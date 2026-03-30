import React from "react";
import { motion } from "motion/react";
import { services as staticServices } from "../data";
import { GraduationCap, Compass, FileText, Users, CheckCircle, ArrowRight, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { useFirebaseData } from "../lib/hooks";

const iconMap: Record<string, any> = {
  GraduationCap,
  Compass,
  FileText,
  Users
};

export default function Services() {
  const { services: fbServices } = useFirebaseData();
  const services = fbServices.length > 0 ? fbServices : staticServices;

  return (
    <div className="pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Nos Services d'Accompagnement</h1>
          <p className="text-xl text-gray-600">
            Une expertise complète pour transformer vos rêves d'études internationales en réalité concrète.
          </p>
        </div>

        <div className="space-y-32">
          {services.map((service, index) => {
            const Icon = iconMap[service.icon] || Settings;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`flex flex-col lg:flex-row gap-16 items-center ${
                  index % 2 !== 0 ? "lg:flex-row-reverse" : ""
                }`}
              >
                <div className="lg:w-1/2 space-y-8">
                  <div className="w-20 h-20 bg-primary/5 text-primary rounded-3xl flex items-center justify-center">
                    <Icon size={40} />
                  </div>
                  <h2 className="text-4xl font-bold text-gray-900">{service.title}</h2>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    {service.description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {service.benefits && service.benefits.length > 0 && (
                      <div>
                        <h4 className="font-bold text-primary mb-4 uppercase tracking-wider text-sm">Bénéfices</h4>
                        <ul className="space-y-3">
                          {service.benefits.map((benefit, i) => (
                            <li key={i} className="flex items-start space-x-2 text-gray-700">
                              <CheckCircle className="text-primary shrink-0 mt-1" size={18} />
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {service.steps && service.steps.length > 0 && (
                      <div>
                        <h4 className="font-bold text-secondary mb-4 uppercase tracking-wider text-sm">Étapes</h4>
                        <ul className="space-y-3">
                          {service.steps.map((step, i) => (
                            <li key={i} className="flex items-start space-x-2 text-gray-700">
                              <div className="w-5 h-5 bg-secondary/20 text-secondary-hover rounded-full flex items-center justify-center shrink-0 mt-1 text-[10px] font-bold">
                                {i + 1}
                              </div>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                <div className="lg:w-1/2 relative">
                  <div className={`absolute inset-0 bg-primary rounded-[3rem] transform ${
                    index % 2 !== 0 ? "-rotate-3" : "rotate-3"
                  } opacity-10`}></div>
                  <img
                    src={service.image || `https://picsum.photos/seed/${service.id}/800/600`}
                    alt={service.title}
                    className="relative z-10 rounded-[3rem] shadow-2xl w-full h-auto object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Final CTA */}
        <div className="mt-32 text-center bg-gray-50 rounded-[3rem] p-16 border border-gray-100">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Besoin d'un service personnalisé ?</h2>
          <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
            Chaque parcours est unique. Contactez-nous pour discuter de votre projet spécifique et obtenir un devis sur mesure.
          </p>
          <Link
            to="/contact"
            className="bg-primary text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-primary-hover transition-colors inline-flex items-center space-x-2"
          >
            <span>Parler à un conseiller</span>
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
}
