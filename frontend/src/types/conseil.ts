// Types pour le conseiller VIP

export interface UserResponses {
  parfumActuel: string;
  scenteurs: string[];
  famillesAimees: string[];
  famillesNonAimees: string[];
  situations: string[];
  intention: string;
  intensite: string;
  genre: string;
  email: string;
  prenom: string;
  nom: string;
  consentement: boolean;
}

export interface Option {
  id: string;
  label: string;
  value: string;
}

// Options pour les différentes questions
export const senteurOptions: Option[] = [
  { id: 'fraiche', label: '🌬️ Fraîches (agrumes, menthe, propre…)', value: 'Fraîche' },
  { id: 'florale', label: '🌸 Florales (rose, jasmin, iris…)', value: 'Florale' },
  { id: 'sucree', label: '🍭 Sucrées / gourmandes (vanille, caramel, fruits…)', value: 'Sucrée' },
  { id: 'boisee', label: '🌳 Boisées (santal, vétiver, cèdre…)', value: 'Boisée' },
  { id: 'epicee', label: '🌶️ Épicées (poivre, cannelle, gingembre…)', value: 'Épicée' },
  { id: 'musquee', label: '🧴 Musquées / poudrées', value: 'Musquée' }
];

export const familleOptions: Option[] = [
  { id: 'florale', label: 'Florale', value: 'Florale' },
  { id: 'boisee', label: 'Boisée', value: 'Boisée' },
  { id: 'aromatique', label: 'Aromatique', value: 'Aromatique' },
  { id: 'fougere', label: 'Fougère', value: 'Fougère' },
  { id: 'hesperidee', label: 'Hespéridée', value: 'Hespéridée' },
  { id: 'chypree', label: 'Chyprée', value: 'Chyprée' },
  { id: 'orientale', label: 'Orientale', value: 'Orientale' }
];

export const situationOptions: Option[] = [
  { id: 'quotidien', label: 'Tous les jours, pour moi', value: 'Quotidien' },
  { id: 'travail', label: 'Au travail / dans un cadre professionnel', value: 'Travail' },
  { id: 'soiree', label: 'En soirée ou pour sortir', value: 'Soirée' },
  { id: 'seduction', label: 'Pour séduire ou marquer une présence', value: 'Séduction' },
  { id: 'evenement', label: "Lors d'événements spéciaux (mariages, dîners, fêtes...)", value: 'Événement' },
  { id: 'saison', label: "Selon l'humeur ou la saison", value: 'Saison' }
]; 