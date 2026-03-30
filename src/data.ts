import { Service, Testimonial, BlogPost, Destination, SiteConfig } from "./types";

export const siteConfig: SiteConfig = {
  name: "Beff’s Africa Consulting Group",
  address: "Douala, Cameroun – Bonamoussadi, Ancienne Mairie, 3ème étage",
  phone: "+237 6 92 44 98 74",
  whatsapp: "https://wa.me/237676140933",
  email: "contact@beffsafrica.com",
  socials: {
    facebook: "https://facebook.com/beffsafrica",
    instagram: "https://instagram.com/beffsafrica",
    linkedin: "https://linkedin.com/company/beffsafrica",
  }
};

export const services: Service[] = [
  {
    id: "etudes-international",
    title: "Accompagnement Projets d'Études",
    description: "Nous vous accompagnons dans vos projets d'études en Europe et à l'international, avec un focus sur les grandes écoles partenaires.",
    icon: "GraduationCap",
    benefits: [
      "Accès à un réseau d'écoles partenaires",
      "Sécurisation des admissions",
      "Accompagnement personnalisé"
    ],
    steps: [
      "Entretien d'orientation",
      "Choix des programmes et écoles",
      "Constitution du dossier de candidature",
      "Suivi des admissions"
    ]
  },
  {
    id: "orientation",
    title: "Conseil et Orientation",
    description: "Une orientation académique et professionnelle sur mesure pour aligner vos études avec vos ambitions de carrière.",
    icon: "Compass",
    benefits: [
      "Bilan de compétences",
      "Analyse du marché du travail",
      "Plan de carrière clair"
    ],
    steps: [
      "Évaluation du profil",
      "Tests d'intérêts",
      "Définition du projet professionnel"
    ]
  },
  {
    id: "administratif",
    title: "Accompagnement Administratif",
    description: "Gestion complète de vos dossiers d'admission et de visa pour maximiser vos chances de succès.",
    icon: "FileText",
    benefits: [
      "Dossiers conformes aux exigences",
      "Gain de temps précieux",
      "Réduction du stress administratif"
    ],
    steps: [
      "Collecte des documents",
      "Rédaction des lettres de motivation",
      "Préparation aux entretiens Campus France / Ambassade",
      "Dépôt de visa"
    ]
  },
  {
    id: "coaching",
    title: "Coaching Pré-départ",
    description: "Préparez votre arrivée à l'étranger en toute sérénité avec nos sessions de coaching interculturel et logistique.",
    icon: "Users",
    benefits: [
      "Meilleure intégration",
      "Conseils pratiques (logement, banque)",
      "Réseautage avec d'anciens étudiants"
    ],
    steps: [
      "Atelier vie pratique",
      "Gestion du budget",
      "Choc culturel et adaptation"
    ]
  }
];

export const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Samuel N.",
    destination: "France",
    program: "Master en Management",
    content: "Grâce à Beff's Africa, j'ai pu intégrer une grande école de commerce à Paris. Leur accompagnement pour le visa a été déterminant."
  },
  {
    id: "2",
    name: "Marie-Claire T.",
    destination: "Belgique",
    program: "Bachelier en Informatique",
    content: "Une équipe à l'écoute et très professionnelle. Ils m'ont aidée à trouver la formation qui correspondait exactement à mes attentes."
  }
];

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Comment réussir son entretien Campus France ?",
    date: "15 Mai 2024",
    excerpt: "Découvrez les astuces et les questions fréquentes pour briller lors de votre entretien d'admission.",
    content: "L'entretien Campus France est une étape cruciale...",
    image: "https://picsum.photos/seed/interview/800/600"
  },
  {
    id: "2",
    title: "Les bourses d'études en Europe pour 2025",
    date: "10 Juin 2024",
    excerpt: "Le guide complet des bourses disponibles pour les étudiants africains souhaitant étudier en Europe.",
    content: "Plusieurs opportunités de bourses existent...",
    image: "https://picsum.photos/seed/scholarship/800/600"
  }
];

export const destinations: Destination[] = [
  {
    id: "france",
    name: "France",
    description: "Une destination d'excellence avec des universités de renom et un cadre de vie dynamique.",
    image: "https://picsum.photos/seed/france/800/600"
  },
  {
    id: "belgique",
    name: "Belgique",
    description: "Au cœur de l'Europe, la Belgique offre des formations de qualité et multilingues.",
    image: "https://picsum.photos/seed/belgium/800/600"
  },
  {
    id: "allemagne",
    name: "Allemagne",
    description: "Idéal pour les ingénieurs et les profils techniques, avec des opportunités de carrière exceptionnelles.",
    image: "https://picsum.photos/seed/germany/800/600"
  }
];
