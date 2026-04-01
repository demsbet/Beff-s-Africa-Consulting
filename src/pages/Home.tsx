import React from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowRight, CheckCircle, GraduationCap, Compass, FileText, Users, MessageCircle } from "lucide-react";
import { services as staticServices, testimonials as staticTestimonials, siteConfig as staticSiteConfig } from "../data";
import { useFirebaseData } from "../lib/hooks";

const iconMap: Record<string, any> = {
  GraduationCap,
  Compass,
  FileText,
  Users
};

export default function Home() {
  const { services: fbServices, testimonials: fbTestimonials, siteConfig: fbSiteConfig, loading } = useFirebaseData();

  const services = fbServices.length > 0 ? fbServices : staticServices;
  const testimonials = fbTestimonials.length > 0 ? fbTestimonials : staticTestimonials;
  const siteConfig = fbSiteConfig || staticSiteConfig;

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-gray-900 pt-32 pb-12">
        <div className="absolute inset-0 z-0">
          <img
            src={siteConfig.hero_image_url || "https://picsum.photos/seed/education/1920/1080?blur=2"}
            alt="Hero Background"
            className="w-full h-full object-cover opacity-40"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/80 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl py-12"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
              {siteConfig.hero_title || "Ouvrir les portes du monde à la jeunesse africaine"}
            </h1>
            <p className="text-xl text-gray-300 mb-10 leading-relaxed">
              {siteConfig.hero_description || `${siteConfig.name} accompagne les étudiants et jeunes professionnels africains dans leurs projets d’études et de carrière à l’international.`}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link
                to="/contact"
                className="bg-primary text-white px-8 py-4 rounded-full font-bold text-lg flex items-center justify-center space-x-2 hover:bg-primary-hover transition-all transform hover:scale-105"
              >
                <span>Prendre rendez-vous</span>
                <ArrowRight size={20} />
              </Link>
              <a
                href={siteConfig.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-full font-bold text-lg flex items-center justify-center space-x-2 hover:bg-white/20 transition-all"
              >
                <MessageCircle size={20} className="text-secondary" />
                <span>Nous contacter sur WhatsApp</span>
              </a>
            </div>
          </motion.div>
        </div>

        {/* Floating Stats - Now in flow for better responsiveness */}
        <div className="relative z-10 hidden lg:block pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-3 gap-8 bg-white/5 backdrop-blur-xl border border-white/10 py-10 px-8 rounded-3xl">
              <div className="text-center border-r border-white/10">
                <div className="text-3xl font-bold text-primary mb-1">{siteConfig.stats?.success_rate || "98%"}</div>
                <div className="text-sm text-gray-400 uppercase tracking-widest">Taux de réussite visa</div>
              </div>
              <div className="text-center border-r border-white/10">
                <div className="text-3xl font-bold text-primary mb-1">{siteConfig.stats?.partners_count || "50+"}</div>
                <div className="text-sm text-gray-400 uppercase tracking-widest">Écoles partenaires</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">{siteConfig.stats?.students_count || "500+"}</div>
                <div className="text-sm text-gray-400 uppercase tracking-widest">Étudiants accompagnés</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Summary */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img
                src={siteConfig.mission_image_url || "https://picsum.photos/seed/consulting/800/1000"}
                alt="Consulting Session"
                className="rounded-3xl shadow-2xl"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-8 -right-8 bg-secondary text-gray-900 p-8 rounded-3xl shadow-xl hidden md:block">
                <p className="text-2xl font-bold italic">"{siteConfig.mission_quote || "De Douala vers le monde, pas à pas."}"</p>
              </div>
            </motion.div>
            <div className="space-y-8">
              <h2 className="text-4xl font-bold text-gray-900 leading-tight">
                {siteConfig.mission_title || "Un accompagnement sur mesure, humain et inspirant."}
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                {siteConfig.mission_text || "Notre mission est d'ouvrir les portes du monde à la jeunesse africaine. Nous croyons que chaque étudiant mérite une chance de briller à l'international, et nous mettons tout en œuvre pour sécuriser ce parcours."}
              </p>
              <ul className="space-y-4">
                {[
                  "Expertise reconnue en études en Europe",
                  "Accords directs avec de grandes écoles privées",
                  "Présence locale forte à Douala",
                  "Accompagnement de A à Z"
                ].map((item, i) => (
                  <li key={i} className="flex items-center space-x-3 text-gray-700 font-medium">
                    <CheckCircle className="text-primary shrink-0" size={24} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/a-propos"
                className="inline-flex items-center space-x-2 text-primary font-bold hover:text-primary-hover transition-colors"
              >
                <span>En savoir plus sur nous</span>
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Nos Services d'Excellence</h2>
            <p className="text-lg text-gray-600">
              Nous offrons une gamme complète de services pour garantir le succès de votre projet d'études.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => {
              const Icon = iconMap[service.icon];
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all border border-gray-100 group"
                >
                  <div className="w-14 h-14 bg-primary/5 text-primary rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                    <Icon size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{service.title}</h3>
                  <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                    {service.description}
                  </p>
                  <Link
                    to="/services"
                    className="text-primary font-semibold text-sm flex items-center space-x-1 hover:space-x-2 transition-all"
                  >
                    <span>Détails</span>
                    <ArrowRight size={16} />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-primary text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 skew-x-12 transform translate-x-1/4"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-8 leading-tight">
                {siteConfig.why_title || "Pourquoi choisir Beff’s Africa Consulting ?"}
              </h2>
              <div className="space-y-8">
                {(siteConfig.why_points || [
                  { title: "Expertise & Réseau", description: "Plus de 50 écoles partenaires en Europe et des accords directs pour sécuriser vos admissions." },
                  { title: "Accompagnement de Proximité", description: "Une agence basée à Douala pour un suivi humain, direct et personnalisé avec les parents et étudiants." },
                  { title: "Réussite Garantie", description: "Un taux de succès exceptionnel pour les admissions et les visas grâce à notre rigueur administrative." }
                ]).map((point, i) => (
                  <div key={i} className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-secondary text-gray-900 rounded-xl flex items-center justify-center shrink-0 font-bold text-xl">0{i + 1}</div>
                    <div>
                      <h4 className="text-xl font-bold mb-2">{point.title}</h4>
                      <p className="text-white/80">{point.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img 
                src={siteConfig.why_image_url_1 || "https://picsum.photos/seed/student1/400/500"} 
                alt="Student" 
                className="rounded-3xl mt-12 w-full h-full object-cover" 
                referrerPolicy="no-referrer" 
              />
              <img 
                src={siteConfig.why_image_url_2 || "https://picsum.photos/seed/student2/400/500"} 
                alt="Student" 
                className="rounded-3xl w-full h-full object-cover" 
                referrerPolicy="no-referrer" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16">
            <div className="max-w-2xl">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Ils nous ont fait confiance</h2>
              <p className="text-lg text-gray-600">Découvrez les parcours de réussite de nos étudiants à travers le monde.</p>
            </div>
            <Link to="/temoignages" className="mt-6 md:mt-0 text-primary font-bold flex items-center space-x-2">
              <span>Voir tous les témoignages</span>
              <ArrowRight size={20} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((t) => (
              <div key={t.id} className="bg-gray-50 p-10 rounded-3xl border border-gray-100 relative">
                <div className="absolute top-10 right-10 text-primary/10">
                  <GraduationCap size={64} />
                </div>
                <p className="text-xl text-gray-700 italic mb-8 relative z-10">"{t.content}"</p>
                <div className="flex items-center space-x-4">
                  {t.image || t.avatar ? (
                    <img src={t.image || t.avatar} alt={t.name} className="w-14 h-14 rounded-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl">
                      {t.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h4 className="font-bold text-gray-900">{t.name}</h4>
                    <p className="text-sm text-primary font-medium">{t.program} — {t.destination}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-8 relative z-10">Prêt à construire votre avenir ?</h2>
            <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto relative z-10">
              Ne laissez pas votre projet d'études au hasard. Parlez dès aujourd'hui à l'un de nos conseillers experts.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6 relative z-10">
              <Link
                to="/contact"
                className="bg-white text-primary px-10 py-5 rounded-full font-bold text-lg hover:bg-white/90 transition-colors shadow-xl"
              >
                Prendre rendez-vous
              </Link>
              <a
                href={siteConfig.whatsapp}
                className="bg-secondary text-gray-900 px-10 py-5 rounded-full font-bold text-lg hover:bg-secondary-hover transition-colors shadow-xl"
              >
                Parler à un conseiller
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
