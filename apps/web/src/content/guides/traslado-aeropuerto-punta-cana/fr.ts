import type { GuideText } from "../types";

export const fr: GuideText = {
  title: "Transfert de l'aéroport de Punta Cana (PUJ) à votre hôtel : durées et conseils",
  metaTitle: "Transfert aéroport Punta Cana (PUJ) : durées et astuces",
  description:
    "Durée du trajet de l'aéroport de Punta Cana à Bávaro, Cap Cana, Uvero Alto, Bayahíbe ou Saint-Domingue, transfert à choisir et infos à donner pour être attendu.",
  lead: "L'arrivée à l'aéroport et le départ sont la première et la dernière étape de votre voyage. Avec ces informations, vous saurez combien de temps dure chaque trajet, quel véhicule choisir et comment éviter d'attendre.",
  summary:
    "Depuis l'aéroport international de Punta Cana (PUJ), comptez environ 15 minutes de route jusqu'à Cap Cana, 20 jusqu'à Punta Cana et Cabeza de Toro, 25 à 30 jusqu'à Bávaro et Los Corales, 45 jusqu'à Uvero Alto, 1 h 15 jusqu'à Bayahíbe et La Romana et 2 h 30 jusqu'à Saint-Domingue. La solution la plus confortable est un transfert privé réservé à l'avance : il vous attend à la sortie et vous conduit directement à votre hébergement, sans arrêt dans d'autres hôtels.",
  sections: [
    {
      heading: "Temps de trajet depuis l'aéroport PUJ",
      blocks: [
        {
          type: "p",
          text: "Temps de trajet approximatifs en voiture. Ils varient selon la circulation et l'emplacement exact de votre hébergement.",
        },
        { type: "transferRoutes" },
      ],
    },
    {
      heading: "Transfert privé, partagé ou taxi",
      blocks: [
        {
          type: "list",
          items: [
            "Transfert privé : uniquement vous et votre groupe. Il part dès votre arrivée et vous conduit directement à votre hébergement. C'est la solution la plus confortable pour les familles, les groupes et les vols au petit matin ou de nuit.",
            "Transfert partagé : il coûte généralement moins cher, mais il attend d'autres passagers et s'arrête dans plusieurs hôtels avant le vôtre.",
            "Taxi à l'aéroport : des taxis attendent à la sortie, avec des tarifs par zone. Confirmez le prix avant de monter.",
          ],
        },
      ],
    },
    {
      heading: "Quel véhicule choisir",
      blocks: [
        { type: "transferVehicles" },
        {
          type: "p",
          text: "La capacité réelle dépend des bagages : deux grandes valises par personne prennent bien plus de place qu'un bagage cabine. Au moment du devis, nous vous recommandons le véhicule adapté à votre groupe.",
        },
      ],
    },
    {
      heading: "Quelles informations donner à la réservation",
      blocks: [
        {
          type: "list",
          items: [
            "Date et heure d'arrivée, et numéro de vol.",
            "Nombre de personnes et âge des enfants.",
            "Nombre de valises et bagages spéciaux, comme des sacs de golf ou des poussettes.",
            "Adresse exacte de votre hébergement.",
            "Un numéro de téléphone avec WhatsApp pour vous prévenir en cas de changement.",
          ],
        },
      ],
    },
    {
      heading: "À votre arrivée à Punta Cana",
      blocks: [
        {
          type: "list",
          items: [
            "Avant de partir, remplissez le formulaire électronique E-Ticket d'entrée et de sortie de la République dominicaine : il est gratuit et obligatoire. Vérifiez les conditions en vigueur avant votre vol.",
            "À l'atterrissage, vous passez le contrôle de l'immigration et récupérez vos bagages. En haute saison, cela peut prendre un moment : c'est pourquoi nous coordonnons la prise en charge avec votre numéro de vol.",
            "À la sortie, les offres de transport sont nombreuses : suivez uniquement les indications de votre réservation.",
            "Gardez sous la main le WhatsApp de votre transfert en cas de changement.",
          ],
        },
      ],
    },
    {
      heading: "Le retour à l'aéroport",
      blocks: [
        {
          type: "p",
          text: "Pour les vols internationaux, il est recommandé d'arriver à l'aéroport environ 3 heures avant le départ. Nous calculons l'heure de prise en charge en fonction de votre vol et de la distance depuis votre hébergement, pour que vous arriviez en avance et sans vous presser.",
        },
        {
          type: "p",
          text: "Vous pouvez réserver l'aller et le retour en une seule fois sur [Transferts](/traslados), ou ajouter le transfert à vos excursions et à votre hébergement via [Organisez votre voyage](/arma-tu-viaje).",
        },
      ],
    },
  ],
  faq: [
    {
      q: "Combien de temps faut-il pour aller de l'aéroport de Punta Cana à Bávaro ?",
      a: "Environ 25 à 30 minutes en voiture, selon la circulation et l'emplacement exact de votre hébergement.",
    },
    {
      q: "Combien coûte un transfert depuis l'aéroport de Punta Cana ?",
      a: "Cela dépend de la zone, du véhicule, du nombre de personnes et de valises. Écrivez-nous en indiquant votre vol et votre hébergement, et nous vous confirmerons le prix avant le paiement.",
    },
    {
      q: "Que se passe-t-il si mon vol a du retard ?",
      a: "Grâce à votre numéro de vol, nous coordonnons l'heure de prise en charge. En cas de changement, écrivez-nous sur WhatsApp et nous l'ajustons.",
    },
    {
      q: "Proposez-vous des transferts au petit matin ou de nuit ?",
      a: "Oui. Nous organisons les arrivées et les départs à toute heure, y compris au petit matin ou de nuit.",
    },
    {
      q: "Faites-vous des transferts vers Saint-Domingue ?",
      a: "Oui, depuis et vers Saint-Domingue et d'autres régions du pays. Depuis l'aéroport de Punta Cana, le trajet dure environ 2 h 30.",
    },
  ],
};
