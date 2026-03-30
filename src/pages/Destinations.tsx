import React from "react";
import { motion } from "motion/react";
import { destinations as staticDestinations } from "../data";
import { Globe, ShieldCheck, Zap, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useFirebaseData } from "../lib/hooks";

export default function Destinations() {
  const { destinations: fbDestinations } = useFirebaseData();
  const destinations = fbDestinations.length > 0 ? fbDestinations : staticDestinations;

  return (
    <div className="pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Destinations & Partenaires</h1>
          <p className="text-xl text-gray-600">
            Nous ouvrons les portes des meilleures institutions académiques mondiales pour vous.
          </p>
        </div>

        {/* Partners Intro */}
        <div className="bg-primary rounded-[3rem] p-12 md:p-20 text-white mb-32 relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl font-bold">Un réseau d'écoles partenaires exclusif</h2>
              <p className="text-xl text-white/90 leading-relaxed">
                L’agence dispose d’accords directs avec de grandes écoles privées en Europe, ce qui sécurise vos admissions et simplifie vos démarches.
              </p>
              <div className="flex flex-col space-y-4">
                <div className="flex items-center space-x-3">
                  <ShieldCheck className="text-secondary" size={28} />
                  <span className="font-bold">Admissions garanties sous conditions</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Zap className="text-secondary" size={28} />
                  <span className="font-bold">Traitement prioritaire des dossiers</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white/10 backdrop-blur-md rounded-2xl p-8 flex items-center justify-center border border-white/20 h-32">
                  <span className="text-2xl font-bold opacity-50 italic">LOGO ÉCOLE</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Destinations Grid */}
        <div className="space-y-16 mb-32">
          <h2 className="text-4xl font-bold text-gray-900 text-center">Où voulez-vous aller ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {destinations.map((dest) => (
              <motion.div
                key={dest.id}
                whileHover={{ y: -10 }}
                className="group relative h-[500px] rounded-[2.5rem] overflow-hidden shadow-2xl"
              >
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-10 text-white">
                  <h3 className="text-3xl font-bold mb-4">{dest.name}</h3>
                  <p className="text-gray-200 mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {dest.description}
                  </p>
                  <Link
                    to="/contact"
                    className="inline-flex items-center space-x-2 bg-primary text-white px-6 py-3 rounded-full font-bold text-sm"
                  >
                    <span>Se renseigner</span>
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Why Beff's Africa */}
        <div className="bg-gray-50 rounded-[4rem] p-16 md:p-24 border border-gray-100">
          <div className="max-w-4xl mx-auto text-center space-y-12">
            <h2 className="text-4xl font-bold text-gray-900">Pourquoi partir avec Beff’s Africa ?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
              <div className="space-y-4">
                <h4 className="text-xl font-bold text-primary">Sécurité & Fiabilité</h4>
                <p className="text-gray-600">Nous ne travaillons qu'avec des institutions reconnues par l'État dans leurs pays respectifs.</p>
              </div>
              <div className="space-y-4">
                <h4 className="text-xl font-bold text-primary">Gain de Temps</h4>
                <p className="text-gray-600">Nos processus optimisés vous font gagner des mois de recherches et de démarches incertaines.</p>
              </div>
              <div className="space-y-4">
                <h4 className="text-xl font-bold text-primary">Accompagnement Local</h4>
                <p className="text-gray-600">Nous sommes à Douala. Vous pouvez nous rencontrer physiquement pour discuter de votre avenir.</p>
              </div>
              <div className="space-y-4">
                <h4 className="text-xl font-bold text-primary">Réseau d'Alumni</h4>
                <p className="text-gray-600">Rejoignez une communauté d'étudiants déjà installés qui pourront vous guider à votre arrivée.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
