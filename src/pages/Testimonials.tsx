import React from "react";
import { motion } from "motion/react";
import { testimonials as staticTestimonials } from "../data";
import { Quote, Star, GraduationCap, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { useFirebaseData } from "../lib/hooks";

export default function Testimonials() {
  const { testimonials: fbTestimonials } = useFirebaseData();
  const testimonials = fbTestimonials.length > 0 ? fbTestimonials : staticTestimonials;

  return (
    <div className="pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Témoignages & Réussites</h1>
          <p className="text-xl text-gray-600">
            Découvrez les histoires inspirantes de nos étudiants qui ont franchi les frontières pour bâtir leur avenir.
          </p>
        </div>

        {/* Success Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-32">
          {testimonials.map((t, index) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-12 rounded-[3rem] shadow-2xl border border-gray-100 relative group"
            >
              <div className="absolute top-12 right-12 text-primary/10 group-hover:text-primary/20 transition-colors">
                <Quote size={80} />
              </div>
              
              <div className="flex items-center space-x-2 text-secondary mb-8">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={20} fill="currentColor" />
                ))}
              </div>

              <p className="text-2xl text-gray-800 italic leading-relaxed mb-10 relative z-10">
                "{t.content}"
              </p>

              <div className="flex items-center space-x-6 pt-10 border-t border-gray-100">
                {t.image ? (
                  <img src={t.image} alt={t.name} className="w-20 h-20 rounded-3xl object-cover shadow-lg" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center text-white font-bold text-3xl shadow-lg">
                    {t.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h4 className="text-2xl font-bold text-gray-900">{t.name}</h4>
                  <div className="flex flex-col space-y-1 mt-1">
                    <div className="flex items-center space-x-2 text-primary font-bold">
                      <GraduationCap size={18} />
                      <span>{t.program}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-500 font-medium">
                      <MapPin size={18} />
                      <span>{t.destination}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Success Stats */}
        <div className="bg-gray-900 rounded-[4rem] p-16 md:p-24 text-white text-center">
          <h2 className="text-4xl font-bold mb-16">Notre impact en chiffres</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            <div>
              <div className="text-5xl font-bold text-secondary mb-2">500+</div>
              <div className="text-white/60 uppercase tracking-widest text-sm font-bold">Étudiants placés</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-secondary mb-2">98%</div>
              <div className="text-white/60 uppercase tracking-widest text-sm font-bold">Succès visa</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-secondary mb-2">15+</div>
              <div className="text-white/60 uppercase tracking-widest text-sm font-bold">Partenaires directs</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-secondary mb-2">24h</div>
              <div className="text-white/60 uppercase tracking-widest text-sm font-bold">Délai de réponse</div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-32 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Vous voulez être notre prochaine success story ?</h2>
          <Link
            to="/contact"
            className="bg-primary text-white px-12 py-5 rounded-full font-bold text-xl hover:bg-primary-hover transition-all shadow-xl inline-block"
          >
            Commencer mon projet
          </Link>
        </div>
      </div>
    </div>
  );
}
