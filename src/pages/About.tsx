import React from "react";
import { motion } from "motion/react";
import { CheckCircle, Target, Eye, Heart, MapPin } from "lucide-react";
import { useFirebaseData } from "../lib/hooks";
import { siteConfig as staticSiteConfig } from "../data";

export default function About() {
  const { siteConfig: fbSiteConfig } = useFirebaseData();
  const siteConfig = fbSiteConfig || staticSiteConfig;

  return (
    <div className="pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
          <div className="space-y-8">
            <span className="text-primary font-bold uppercase tracking-widest text-sm">À propos de nous</span>
            <h1 className="text-5xl font-bold text-gray-900 leading-tight">
              Votre partenaire de confiance pour <span className="text-primary">réussir</span> à l'international.
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              {siteConfig.about_text || `${siteConfig.name} est une agence africaine dédiée aux projets d’études et de carrière à l’international. Basée à Douala, nous sommes le pont entre vos ambitions et les meilleures opportunités mondiales.`}
            </p>
            <div className="flex items-center space-x-4 p-6 bg-primary/5 rounded-3xl border border-primary/10">
              <div className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center shrink-0">
                <MapPin size={24} />
              </div>
              <p className="text-primary font-medium">
                Siège social à {siteConfig.address || "Douala, Cameroun"} — Présence active en Afrique Centrale et de l'Ouest.
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-secondary/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
            <img
              src={siteConfig.about_image_url || "https://picsum.photos/seed/about-hero/800/1000"}
              alt="Team at work"
              className="relative z-10 rounded-[3rem] shadow-2xl"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Mission, Vision, Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
          <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100 text-center space-y-6">
            <div className="w-16 h-16 bg-primary/5 text-primary rounded-2xl flex items-center justify-center mx-auto">
              <Target size={32} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Notre Mission</h3>
            <p className="text-gray-600 leading-relaxed">
              Ouvrir les portes du monde à la jeunesse africaine à travers un accompagnement sur mesure, humain et inspirant.
            </p>
          </div>
          <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100 text-center space-y-6">
            <div className="w-16 h-16 bg-secondary/10 text-secondary-hover rounded-2xl flex items-center justify-center mx-auto">
              <Eye size={32} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Notre Vision</h3>
            <p className="text-gray-600 leading-relaxed">
              Devenir le leader panafricain du conseil en mobilité internationale, reconnu pour l'excellence de ses résultats.
            </p>
          </div>
          <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100 text-center space-y-6">
            <div className="w-16 h-16 bg-primary/5 text-primary rounded-2xl flex items-center justify-center mx-auto">
              <Heart size={32} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Nos Valeurs</h3>
            <p className="text-gray-600 leading-relaxed">
              L'humain au cœur de nos actions, l'ambition pour nos étudiants, et l'intégrité dans chaque dossier.
            </p>
          </div>
        </div>

        {/* Story Section */}
        <div className="bg-gray-900 rounded-[4rem] p-12 md:p-24 text-white">
          <div className="max-w-4xl mx-auto space-y-12">
            <h2 className="text-4xl font-bold text-center">Notre Histoire</h2>
            <div className="space-y-8 text-lg text-white/80 leading-relaxed">
              <p>
                Beff’s Africa Consulting Group est né d'un constat simple : le potentiel immense de la jeunesse africaine se heurte trop souvent à des barrières administratives et informationnelles complexes.
              </p>
              <p>
                Fondée par des experts de l'éducation internationale, notre agence s'est rapidement imposée comme une référence à Douala. Nous avons bâti un réseau solide de partenaires en Europe, nous permettant d'offrir des garanties d'admission uniques.
              </p>
              <p>
                Aujourd'hui, nous ne nous contentons pas de remplir des formulaires. Nous coachons, nous préparons et nous suivons nos étudiants bien après leur arrivée, car leur succès est notre seule véritable mesure de performance.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 border-t border-white/10">
              <div className="text-center">
                <div className="text-4xl font-bold text-secondary mb-2">5+</div>
                <div className="text-sm text-white/60 uppercase tracking-widest">Années d'expertise</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-secondary mb-2">10+</div>
                <div className="text-sm text-white/60 uppercase tracking-widest">Pays de destination</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-secondary mb-2">100%</div>
                <div className="text-sm text-white/60 uppercase tracking-widest">Engagement client</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-secondary mb-2">24/7</div>
                <div className="text-sm text-white/60 uppercase tracking-widest">Support WhatsApp</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
