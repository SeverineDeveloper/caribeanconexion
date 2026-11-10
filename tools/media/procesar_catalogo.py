"""Prepara las fotos del catálogo de excursiones para la web.

Lee los originales del cliente (una carpeta por actividad, como docs/catalog/) y genera,
según tools/media/catalogo.json:

  apps/web/src/assets/images/excursiones/<slug>/portada.jpg   16:9, 1920x1080
  apps/web/src/assets/images/excursiones/<slug>/NN.jpg        galería, lado mayor 1600 px
  apps/web/src/assets/images/excursiones/<slug>/video.jpg     póster del clip, si hay
  apps/web/public/videos/excursiones/<slug>.mp4               clip sin audio, si hay
  apps/web/src/content/generated/excursion-media.ts            índice con los imports

Por cada foto: quita bandas negras, endereza y recorta si el manifiesto lo pide, amplía con
Real-ESRGAN las que no llegan al tamaño final, corrige color y contraste, convierte a sRGB y
guarda sin metadatos (EXIF ni GPS). Las fotos marcadas como "pendiente" (derechos sin
confirmar) se procesan en otra carpeta, fuera del repositorio, y no se publican.

Requisitos: Python 3.11+, Pillow, OpenCV (cv2), ffmpeg en el PATH y Real-ESRGAN ncnn-vulkan
(https://github.com/xinntao/Real-ESRGAN/releases). La ruta del ejecutable se toma de la
variable REALESRGAN o del manifiesto. Sin Real-ESRGAN (--sin-ia) se amplía con Lanczos.

Uso:
  python tools/media/procesar_catalogo.py --origen <carpeta del catálogo> [--solo buggies,pesca]
"""

from __future__ import annotations

import argparse
import io
import json
import os
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

import cv2
import numpy as np
from PIL import Image, ImageCms, ImageOps

RAIZ = Path(__file__).resolve().parents[2]
MANIFIESTO = Path(__file__).with_name("catalogo.json")
SALIDA_WEB = RAIZ / "apps/web/src/assets/images/excursiones"
SALIDA_VIDEO = RAIZ / "apps/web/public/videos/excursiones"

LADO_GALERIA = 1600
PORTADA = (1920, 1080)
CALIDAD_JPEG = 82


# ── Lectura y escritura ──────────────────────────────────────────────────────


def leer_foto(ruta: Path) -> np.ndarray:
    """Abre la foto respetando la orientación EXIF y la pasa a sRGB (BGR para OpenCV)."""
    im = ImageOps.exif_transpose(Image.open(ruta))
    icc = im.info.get("icc_profile")
    if icc:
        origen = ImageCms.ImageCmsProfile(io.BytesIO(icc))
        if "srgb" not in ImageCms.getProfileDescription(origen).lower():
            im = ImageCms.profileToProfile(
                im.convert("RGB"), origen, ImageCms.createProfile("sRGB"), outputMode="RGB"
            )
    return cv2.cvtColor(np.asarray(im.convert("RGB")), cv2.COLOR_RGB2BGR)


def leer_fotograma(video: Path, segundo: float, ventana: float) -> np.ndarray:
    """Extrae el fotograma más nítido en ±ventana segundos alrededor del segundo pedido.
    En montajes con transiciones conviene ventana 0 (solo el instante exacto)."""
    mejor, nitidez = None, -1.0
    for delta in sorted({-ventana, -ventana / 2, 0.0, ventana / 2, ventana}):
        t = max(0.0, segundo + delta)
        res = subprocess.run(
            ["ffmpeg", "-v", "error", "-ss", f"{t:.2f}", "-i", str(video), "-frames:v", "1",
             "-f", "image2pipe", "-vcodec", "png", "-"],
            capture_output=True, check=True,
        )
        img = cv2.imdecode(np.frombuffer(res.stdout, np.uint8), cv2.IMREAD_COLOR)
        valor = cv2.Laplacian(cv2.cvtColor(img, cv2.COLOR_BGR2GRAY), cv2.CV_64F).var()
        if valor > nitidez:
            mejor, nitidez = img, valor
    return mejor


def guardar(img: np.ndarray, ruta: Path) -> None:
    ruta.parent.mkdir(parents=True, exist_ok=True)
    rgb = Image.fromarray(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))
    # Sin exif ni icc: la imagen ya está en sRGB y así no viajan datos del móvil.
    rgb.save(ruta, "JPEG", quality=CALIDAD_JPEG, optimize=True, progressive=True)


# ── Geometría ────────────────────────────────────────────────────────────────


def quitar_bandas(img: np.ndarray) -> np.ndarray:
    """Recorta bandas negras en los bordes (filas o columnas casi totalmente negras)."""
    oscuro = img.max(axis=2) < 22
    filas = oscuro.mean(axis=1) > 0.985
    cols = oscuro.mean(axis=0) > 0.985
    top, bottom, left, right = 0, len(filas), 0, len(cols)
    while top < bottom and filas[top]:
        top += 1
    while bottom > top and filas[bottom - 1]:
        bottom -= 1
    while left < right and cols[left]:
        left += 1
    while right > left and cols[right - 1]:
        right -= 1
    # 2 px más en cada lado recortado, para no dejar el borde difuminado de la banda.
    top += 2 if top else 0
    left += 2 if left else 0
    bottom -= 2 if bottom < len(filas) else 0
    right -= 2 if right < len(cols) else 0
    return img[top:bottom, left:right]


def enderezar(img: np.ndarray, grados: float) -> np.ndarray:
    """Rota y recorta al mayor rectángulo sin bordes vacíos."""
    h, w = img.shape[:2]
    m = cv2.getRotationMatrix2D((w / 2, h / 2), grados, 1.0)
    rot = cv2.warpAffine(img, m, (w, h), flags=cv2.INTER_CUBIC)
    a = abs(np.radians(grados))
    sin, cos = np.sin(a), np.cos(a)
    lado_largo, lado_corto = max(w, h), min(w, h)
    if lado_corto <= 2 * sin * cos * lado_largo or abs(sin - cos) < 1e-10:
        x = 0.5 * lado_corto
        wr, hr = (x / sin, x / cos) if w >= h else (x / cos, x / sin)
    else:
        cos2 = cos * cos - sin * sin
        wr, hr = (w * cos - h * sin) / cos2, (h * cos - w * sin) / cos2
    x0, y0 = int((w - wr) / 2), int((h - hr) / 2)
    return rot[y0 : y0 + int(hr), x0 : x0 + int(wr)]


def recortar(img: np.ndarray, caja: list[float]) -> np.ndarray:
    """Recorte con coordenadas relativas [x0, y0, x1, y1] entre 0 y 1."""
    h, w = img.shape[:2]
    x0, y0, x1, y1 = caja
    return img[int(y0 * h) : int(y1 * h), int(x0 * w) : int(x1 * w)]


def recorte_16_9(img: np.ndarray, foco: list[float]) -> np.ndarray:
    """El mayor recorte 16:9 posible, centrado en el foco [x, y] relativo."""
    h, w = img.shape[:2]
    cw, ch = (w, int(w * 9 / 16)) if w * 9 / 16 <= h else (int(h * 16 / 9), h)
    cx, cy = foco[0] * w, foco[1] * h
    x0 = int(min(max(cx - cw / 2, 0), w - cw))
    y0 = int(min(max(cy - ch / 2, 0), h - ch))
    return img[y0 : y0 + ch, x0 : x0 + cw]


# ── Ampliación ───────────────────────────────────────────────────────────────


class Ampliador:
    """Real-ESRGAN x4 (GPU) si está disponible; si no, Lanczos."""

    def __init__(self, ejecutable: str | None):
        self.exe = ejecutable if ejecutable and Path(ejecutable).exists() else None
        if not self.exe:
            print("· Real-ESRGAN no disponible: se amplía con Lanczos", file=sys.stderr)

    def ampliar(self, img: np.ndarray, ancho: int, alto: int) -> np.ndarray:
        h, w = img.shape[:2]
        if w >= ancho and h >= alto:
            return cv2.resize(img, (ancho, alto), interpolation=cv2.INTER_AREA)
        if self.exe:
            with tempfile.TemporaryDirectory() as tmp:
                entrada, salida = Path(tmp, "in.png"), Path(tmp, "out.png")
                cv2.imwrite(str(entrada), img)
                subprocess.run(
                    [self.exe, "-i", str(entrada), "-o", str(salida), "-n", "realesrgan-x4plus"],
                    capture_output=True, check=True, cwd=Path(self.exe).parent,
                )
                img = cv2.imread(str(salida))
            # Bajar de x4 suaviza el aspecto "pintado" que deja la red en las texturas.
            return cv2.resize(img, (ancho, alto), interpolation=cv2.INTER_AREA)
        return enfocar(cv2.resize(img, (ancho, alto), interpolation=cv2.INTER_LANCZOS4), 0.35)


def tamano_galeria(img: np.ndarray) -> tuple[int, int]:
    h, w = img.shape[:2]
    escala = LADO_GALERIA / max(w, h)
    return round(w * escala), round(h * escala)


# ── Color ────────────────────────────────────────────────────────────────────


def estirar(canal: np.ndarray, bajo: float, alto: float) -> np.ndarray:
    a, b = np.percentile(canal, bajo), np.percentile(canal, alto)
    return np.clip((canal - a) / max(b - a, 1e-6), 0, 1)


def clahe_l(img: np.ndarray, limite: float) -> np.ndarray:
    lab = cv2.cvtColor(img, cv2.COLOR_BGR2LAB)
    l, a, b = cv2.split(lab)
    l = cv2.createCLAHE(clipLimit=limite, tileGridSize=(8, 8)).apply(l)
    return cv2.cvtColor(cv2.merge([l, a, b]), cv2.COLOR_LAB2BGR)


def color_agua(img: np.ndarray, fuerza: float) -> np.ndarray:
    """Bajo el agua: compensa el rojo que se pierde y equilibra blancos por canal."""
    f = img.astype(np.float32) / 255
    b, g, r = cv2.split(f)
    r = np.clip(r + (g.mean() - r.mean()) * (1 - r) * g, 0, 1)
    corr = cv2.merge([estirar(c, 0.5, 99.5) for c in (b, g, r)])
    corr = clahe_l((corr * 255).astype(np.uint8), 1.6)
    return cv2.addWeighted(corr, fuerza, img, 1 - fuerza, 0)


def color_exterior(img: np.ndarray, fuerza: float) -> np.ndarray:
    """Exterior: niveles y contraste local solo en luminancia (no toca el balance de blancos)."""
    lab = cv2.cvtColor(img, cv2.COLOR_BGR2LAB).astype(np.float32)
    l = lab[..., 0] / 255
    lab[..., 0] = estirar(l, 0.4, 99.6) * 255
    corr = cv2.cvtColor(np.clip(lab, 0, 255).astype(np.uint8), cv2.COLOR_LAB2BGR)
    corr = clahe_l(corr, 1.25)
    corr = vibrancia(corr, 0.10)
    return cv2.addWeighted(corr, fuerza, img, 1 - fuerza, 0)


def vibrancia(img: np.ndarray, cantidad: float) -> np.ndarray:
    """Sube la saturación de los colores apagados y apenas toca los ya saturados."""
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV).astype(np.float32)
    s = hsv[..., 1] / 255
    hsv[..., 1] = np.clip(s * (1 + cantidad * (1 - s)), 0, 1) * 255
    return cv2.cvtColor(hsv.astype(np.uint8), cv2.COLOR_HSV2BGR)


def saturacion(img: np.ndarray, factor: float) -> np.ndarray:
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV).astype(np.float32)
    hsv[..., 1] = np.clip(hsv[..., 1] * factor, 0, 255)
    return cv2.cvtColor(hsv.astype(np.uint8), cv2.COLOR_HSV2BGR)


def enfocar(img: np.ndarray, cantidad: float) -> np.ndarray:
    suave = cv2.GaussianBlur(img, (0, 0), 1.0)
    return cv2.addWeighted(img, 1 + cantidad, suave, -cantidad, 0)


def corregir(img: np.ndarray, op: dict) -> np.ndarray:
    modo = op.get("modo", "exterior")
    fuerza = op.get("fuerza", 0.8)
    if modo == "agua":
        img = color_agua(img, fuerza)
    elif modo == "exterior":
        img = color_exterior(img, fuerza)
    if "saturacion" in op:
        img = saturacion(img, op["saturacion"])
    return img


# ── Proceso ──────────────────────────────────────────────────────────────────


def preparar(origen: Path, op: dict) -> np.ndarray:
    if "video" in op:
        img = leer_fotograma(origen / op["video"], op["segundo"], op.get("ventana", 0.4))
    else:
        img = leer_foto(origen / op["foto"])
    img = quitar_bandas(img)
    if op.get("rotar"):
        img = enderezar(img, op["rotar"])
    if op.get("recorte"):
        img = recortar(img, op["recorte"])
    return img


def procesar_actividad(slug: str, act: dict, origen_cat: Path, pendientes: Path, amp: Ampliador):
    origen = (RAIZ if act.get("raiz") == "repo" else origen_cat) / act["carpeta"]
    destino = SALIDA_WEB / slug
    if destino.exists():
        shutil.rmtree(destino)
    defecto = {k: v for k, v in act.items() if k in ("modo", "fuerza")}

    portada = {**defecto, **act["portada"]}
    img = recorte_16_9(preparar(origen, portada), portada.get("foco", [0.5, 0.5]))
    img = corregir(amp.ampliar(img, *portada.get("tamano", PORTADA)), portada)
    guardar(img, destino / "portada.jpg")
    print(f"  {slug}/portada.jpg  ← {portada.get('foto') or portada.get('video')}")

    n = 0
    for op in act.get("fotos", []):
        op = {**defecto, **op}
        img = preparar(origen, op)
        img = corregir(amp.ampliar(img, *tamano_galeria(img)), op)
        if op.get("pendiente"):
            ruta = pendientes / slug / Path(op.get("foto", "fotograma.jpg")).with_suffix(".jpg").name
        else:
            n += 1
            ruta = destino / f"{n:02d}.jpg"
        guardar(img, ruta)
        print(f"  {ruta.relative_to(ruta.parents[1])}  ← {op.get('foto') or op.get('video')}")

    if act.get("clip"):
        procesar_video(slug, act["clip"], origen, amp)


def procesar_video(slug: str, op: dict, origen: Path, amp: Ampliador) -> None:
    """Clip corto, sin audio y en bucle para la galería, más su póster.

    op: archivo, desde y hasta (segundos), poster (segundo), recorte (filtro crop de ffmpeg,
    p. ej. "676:1200:22:0"), alto (altura final), crf (calidad x264, 26 por defecto) e ia
    (ampliar cada fotograma x4 con Real-ESRGAN: unos 6 s por fotograma en una RTX 3060, así que
    solo compensa en clips muy cortos; en un 720p mejora poco frente a Lanczos).
    """
    entrada = origen / op["archivo"]
    salida = SALIDA_VIDEO / f"{slug}.mp4"
    salida.parent.mkdir(parents=True, exist_ok=True)
    filtros = []
    if op.get("recorte"):
        filtros.append(f"crop={op['recorte']}")
    if op.get("alto") and not op.get("ia"):
        filtros.append(f"scale=-2:{op['alto']}:flags=lanczos")
    filtros += ["hqdn3d=2:1.5:4:4", "unsharp=5:5:0.4"]
    codificar = ["-c:v", "libx264", "-preset", "slow", "-crf", str(op.get("crf", 26)),
                 "-pix_fmt", "yuv420p", "-an", "-movflags", "+faststart"]
    tramo = ["-ss", str(op.get("desde", 0)), "-to", str(op["hasta"])] if "hasta" in op else []

    if op.get("ia") and amp.exe:
        with tempfile.TemporaryDirectory() as tmp:
            crudo, grande = Path(tmp, "crudo"), Path(tmp, "grande")
            crudo.mkdir()
            grande.mkdir()
            subprocess.run(["ffmpeg", "-v", "error", *tramo, "-i", str(entrada),
                            "-vf", ",".join(filtros[:-2]) or "null", str(crudo / "%05d.png")],
                           check=True)
            fps = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries",
                                  "stream=r_frame_rate", "-of", "csv=p=0", str(entrada)],
                                 capture_output=True, text=True, check=True).stdout.strip()
            subprocess.run([amp.exe, "-i", str(crudo), "-o", str(grande), "-n", "realesrgan-x4plus",
                            "-f", "jpg"], capture_output=True, check=True, cwd=Path(amp.exe).parent)
            subprocess.run(["ffmpeg", "-v", "error", "-y", "-framerate", fps, "-i",
                            str(grande / "%05d.jpg"), "-vf", f"scale=-2:{op.get('alto', 720)}:flags=area",
                            *codificar, str(salida)], check=True)
    else:
        subprocess.run(["ffmpeg", "-v", "error", "-y", *tramo, "-i", str(entrada),
                        "-vf", ",".join(filtros), *codificar, str(salida)], check=True)

    # Póster: fotograma del clip ya procesado, para que coincida con el primer cuadro visible.
    poster = op.get("poster", 0) - (op.get("desde", 0) if "hasta" in op else 0)
    res = subprocess.run(["ffmpeg", "-v", "error", "-ss", f"{max(poster, 0):.2f}", "-i", str(salida),
                          "-frames:v", "1", "-f", "image2pipe", "-vcodec", "png", "-"],
                         capture_output=True, check=True)
    guardar(cv2.imdecode(np.frombuffer(res.stdout, np.uint8), cv2.IMREAD_COLOR),
            SALIDA_WEB / slug / "video.jpg")
    print(f"  videos/excursiones/{slug}.mp4 ({salida.stat().st_size // 1024} KB) ← {op['archivo']}")


def camel(slug: str) -> str:
    partes = slug.split("-")
    return partes[0] + "".join(p.capitalize() for p in partes[1:])


def generar_indice() -> None:
    """Escribe content/generated/excursion-media.ts a partir de lo que hay en disco."""
    imports, entradas = [], []
    for carpeta in sorted(p for p in SALIDA_WEB.iterdir() if p.is_dir()):
        slug, var = carpeta.name, camel(carpeta.name)
        base = f"@/assets/images/excursiones/{slug}"
        imports.append(f'import {var}Cover from "{base}/portada.jpg";')
        galeria = sorted(f.stem for f in carpeta.glob("[0-9][0-9].jpg"))
        for n in galeria:
            imports.append(f'import {var}{n} from "{base}/{n}.jpg";')
        lineas = [f"  {json.dumps(slug)}: {{", f"    cover: {var}Cover,"]
        lineas.append(f"    gallery: [{', '.join(f'{var}{n}' for n in galeria)}],")
        if (carpeta / "video.jpg").exists() and (SALIDA_VIDEO / f"{slug}.mp4").exists():
            imports.append(f'import {var}Poster from "{base}/video.jpg";')
            lineas.append(f'    video: {{ src: "/videos/excursiones/{slug}.mp4", poster: {var}Poster }},')
        lineas.append("  },")
        entradas.append("\n".join(lineas))

    destino = RAIZ / "apps/web/src/content/generated/excursion-media.ts"
    destino.parent.mkdir(parents=True, exist_ok=True)
    destino.write_text(
        "// Generado por tools/media/procesar_catalogo.py: no editar a mano.\n"
        'import type { StaticImageData } from "next/image";\n'
        + "\n".join(imports)
        + "\n\nexport type ExcursionMedia = {\n"
        "  /** Portada 16:9 para tarjetas y cabecera. */\n"
        "  cover: StaticImageData;\n"
        "  /** Galería en orden; vacía si la actividad aún no tiene fotos propias. */\n"
        "  gallery: StaticImageData[];\n"
        "  /** Clip sin audio (ruta pública, sin basePath) y su póster. */\n"
        "  video?: { src: string; poster: StaticImageData };\n"
        "};\n\n"
        "export const EXCURSION_MEDIA = {\n"
        + "\n".join(entradas)
        + "\n} satisfies Record<string, ExcursionMedia>;\n\n"
        "export type ExcursionSlug = keyof typeof EXCURSION_MEDIA;\n",
        encoding="utf-8",
        newline="\n",
    )
    print(f"▸ {destino.relative_to(RAIZ)}")


def main() -> None:
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawTextHelpFormatter)
    p.add_argument("--origen", required=True, type=Path, help="Carpeta con una subcarpeta por actividad")
    p.add_argument("--pendientes", type=Path, help="Salida de las fotos sin derechos confirmados")
    p.add_argument("--solo", help="Slugs separados por comas")
    p.add_argument("--sin-ia", action="store_true", help="Ampliar con Lanczos en vez de Real-ESRGAN")
    args = p.parse_args()
    sys.stdout.reconfigure(encoding="utf-8")  # la consola de Windows usa cp1252
    sys.stderr.reconfigure(encoding="utf-8")

    manifiesto = json.loads(MANIFIESTO.read_text(encoding="utf-8"))
    exe = None if args.sin_ia else os.environ.get("REALESRGAN", manifiesto.get("realesrgan"))
    amp = Ampliador(exe)
    pendientes = args.pendientes or args.origen / "_procesado" / "pendientes"
    solo = set(args.solo.split(",")) if args.solo else None

    for slug, act in manifiesto["actividades"].items():
        if solo and slug not in solo:
            continue
        print(f"▸ {slug}")
        procesar_actividad(slug, act, args.origen, pendientes, amp)
    generar_indice()


if __name__ == "__main__":
    main()
