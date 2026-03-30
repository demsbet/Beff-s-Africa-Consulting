import React from "react";
import { motion } from "motion/react";
import { useFirebaseData } from "../lib/hooks";
import { MapPin, Phone, Mail, MessageCircle, Send, Globe, Facebook, Instagram, Twitter } from "lucide-react";

export default function Contact() {
  const { siteConfig } = useFirebaseData();

  if (!siteConfig) return null;

  return (
    <div className="pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Contactez-nous</h1>
          <p className="text-xl text-gray-600">
            Nous sommes à votre écoute pour répondre à toutes vos questions et vous accompagner dans votre projet.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div className="space-y-12">
            <div className="bg-white p-10 rounded-[2rem] shadow-xl border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Nos Coordonnées</h2>
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/5 text-primary rounded-2xl flex items-center justify-center shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Notre Agence</h4>
                    <p className="text-gray-600">{siteConfig.address}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/5 text-primary rounded-2xl flex items-center justify-center shrink-0">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Téléphone</h4>
                    <p className="text-gray-600">{siteConfig.phone}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/5 text-primary rounded-2xl flex items-center justify-center shrink-0">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Email</h4>
                    <p className="text-gray-600">{siteConfig.email}</p>
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-12 border-t border-gray-100">
                <h4 className="font-bold text-gray-900 mb-6">Suivez-nous</h4>
                <div className="flex space-x-4">
                  {siteConfig.socials?.facebook && (
                    <a href={siteConfig.socials.facebook} target="_blank" rel="noopener noreferrer" className="bg-secondary text-gray-900 p-4 rounded-2xl hover:bg-secondary-hover transition-colors">
                      <Facebook size={24} />
                    </a>
                  )}
                  {siteConfig.socials?.instagram && (
                    <a href={siteConfig.socials.instagram} target="_blank" rel="noopener noreferrer" className="bg-secondary text-gray-900 p-4 rounded-2xl hover:bg-secondary-hover transition-colors">
                      <Instagram size={24} />
                    </a>
                  )}
                  {siteConfig.socials?.twitter && (
                    <a href={siteConfig.socials.twitter} target="_blank" rel="noopener noreferrer" className="bg-secondary text-gray-900 p-4 rounded-2xl hover:bg-secondary-hover transition-colors">
                      <Twitter size={24} />
                    </a>
                  )}
                  {siteConfig.whatsapp && (
                    <a href={siteConfig.whatsapp} target="_blank" rel="noopener noreferrer" className="bg-secondary text-gray-900 p-4 rounded-2xl hover:bg-secondary-hover transition-colors">
                      <MessageCircle size={24} />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-gray-200 h-80 rounded-[2rem] overflow-hidden relative group">
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900/10 group-hover:bg-transparent transition-colors">
                <div className="bg-white px-6 py-3 rounded-full shadow-lg flex items-center space-x-2">
                  <Globe size={20} className="text-primary" />
                  <span className="font-bold text-gray-900">Voir sur Google Maps</span>
                </div>
              </div>
              <img
                src="https://picsum.photos/seed/map/800/400"
                alt="Map Placeholder"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-gray-50 p-10 md:p-16 rounded-[2rem] border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Envoyez-nous un message</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Nom Complet</label>
                  <input
                    type="text"
                    placeholder="Votre nom"
                    className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Email</label>
                  <input
                    type="email"
                    placeholder="votre@email.com"
                    className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Téléphone</label>
                  <input
                    type="tel"
                    placeholder="+237 ..."
                    className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Type de Projet</label>
                  <select className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none bg-white">
                    <option>Études en Europe</option>
                    <option>Orientation</option>
                    <option>Visa / Dossier</option>
                    <option>Autre</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Message</label>
                <textarea
                  rows={5}
                  placeholder="Comment pouvons-nous vous aider ?"
                  className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-primary text-white py-5 rounded-2xl font-bold text-lg hover:bg-primary-hover transition-all shadow-lg flex items-center justify-center space-x-2"
              >
                <span>Envoyer le message</span>
                <Send size={20} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
