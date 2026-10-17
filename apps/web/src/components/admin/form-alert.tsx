import { Alert } from "@heroui/react";

/** Mensaje de error o éxito arriba del primer campo (docs/DESIGN.md §4). */
export function FormAlert({
  status = "danger",
  children,
}: {
  status?: "danger" | "success";
  children: string;
}) {
  return (
    <Alert status={status}>
      <Alert.Content>
        <Alert.Description>{children}</Alert.Description>
      </Alert.Content>
    </Alert>
  );
}
