import React, { useState } from "react";
import { motion } from "motion/react";
import { useFirebaseData } from "../lib/hooks";
import { MapPin, Phone, Mail, MessageCircle, Send, Globe, Facebook, Instagram, Twitter, User, Briefcase, Loader2, Users, GraduationCap, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "../lib/supabase";
import { cn } from "../lib/utils";

export default function Contact() {
  const { siteConfig } = useFirebaseData();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    whatsapp: "",
    email: "",
    city: "",
    country: "",
    parentWhatsapp: "",
    academicLevel: "Terminale / Baccalauréat",
    major: "",
    lastDegreeYear: "",
    desiredField: "",
    startDate: "Prochaine rentrée",
    campusFranceHistory: "Non",
    motivation: "",
    readyForPrivateSchool: "Oui",
    contactPreference: "Aujourd’hui",
    confirmation: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.whatsapp || !formData.email || !formData.city || !formData.country || !formData.parentWhatsapp || !formData.desiredField || !formData.confirmation) {
      toast.error("Veuillez remplir tous les champs obligatoires et confirmer votre intérêt.");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // 1. Enregistrement dans Supabase (votre base de données actuelle)
      const { error } = await supabase.from('contact_messages').insert([
        { 
          name: formData.name,
          email: formData.email,
          whatsapp: formData.whatsapp,
          city: formData.city,
          country: formData.country,
          parent_whatsapp: formData.parentWhatsapp,
          academic_level: formData.academicLevel,
          major: formData.major,
          last_degree_year: formData.lastDegreeYear,
          desired_field: formData.desiredField,
          start_date: formData.startDate,
          campus_france_history: formData.campusFranceHistory,
          motivation: formData.motivation,
          ready_for_private_school: formData.readyForPrivateSchool,
          contact_preference: formData.contactPreference,
          created_at: new Date().toISOString()
        }
      ]);

      if (error) {
        console.warn("Erreur Supabase:", error.message);
      }

      // 2. Envoi vers Google Sheets via Webhook
      const webhookUrl = import.meta.env.VITE_GOOGLE_SHEETS_WEBHOOK_URL;
      if (webhookUrl) {
        try {
          await fetch(webhookUrl, {
            method: 'POST',
            mode: 'no-cors', // Important pour Google Apps Script
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              ...formData,
              submittedAt: new Date().toLocaleString('fr-FR')
            }),
          });
        } catch (webhookErr) {
          console.error("Erreur Webhook Google Sheets:", webhookErr);
        }
      }

      toast.success("Votre demande a été envoyée avec succès ! Un conseiller vous contactera bientôt.");
      setFormData({
        name: "",
        whatsapp: "",
        email: "",
        city: "",
        country: "",
        parentWhatsapp: "",
        academicLevel: "Terminale / Baccalauréat",
        major: "",
        lastDegreeYear: "",
        desiredField: "",
        startDate: "Prochaine rentrée",
        campusFranceHistory: "Non",
        motivation: "",
        readyForPrivateSchool: "Oui",
        contactPreference: "Aujourd’hui",
        confirmation: false
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Une erreur est survenue. Veuillez réessayer plus tard.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Nos Succursales</h2>
              <div className="space-y-10">
                {(siteConfig.branches || []).map((branch) => (
                  <div key={branch.id} className="pb-8 border-b border-gray-100 last:border-0 last:pb-0">
                    <h3 className="text-lg font-bold text-primary mb-4 flex items-center space-x-2">
                      <Globe size={20} />
                      <span>{branch.country} — {branch.city}</span>
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 bg-primary/5 text-primary rounded-xl flex items-center justify-center shrink-0">
                          <MapPin size={20} />
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed">{branch.address}</p>
                      </div>
                      <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 bg-primary/5 text-primary rounded-xl flex items-center justify-center shrink-0">
                          <Phone size={20} />
                        </div>
                        <p className="text-gray-600 text-sm">{branch.phone}</p>
                      </div>
                      {branch.email && (
                        <div className="flex items-start space-x-4">
                          <div className="w-10 h-10 bg-primary/5 text-primary rounded-xl flex items-center justify-center shrink-0">
                            <Mail size={20} />
                          </div>
                          <p className="text-gray-600 text-sm">{branch.email}</p>
                        </div>
                      )}
                      {branch.whatsapp && (
                        <a 
                          href={branch.whatsapp} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center space-x-4 text-sm text-secondary font-bold hover:underline"
                        >
                          <div className="w-10 h-10 bg-secondary/10 text-secondary rounded-xl flex items-center justify-center shrink-0">
                            <MessageCircle size={20} />
                          </div>
                          <span>WhatsApp {branch.city}</span>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
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
          <div className="bg-gray-50 p-8 md:p-12 rounded-[2rem] border border-gray-100 shadow-sm">
            <div className="mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Formulaire d'Admission</h2>
              <p className="text-gray-600">Remplissez ce formulaire pour lancer votre projet d'études en France.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-12">
              {/* Informations personnelles */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-primary flex items-center gap-2 border-b pb-2">
                  <User size={20} />
                  Informations personnelles
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Nom et prénom <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Votre nom complet"
                      className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all bg-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Numéro WhatsApp actif <span className="text-red-500">*</span></label>
                    <input
                      type="tel"
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleChange}
                      required
                      placeholder="+237 ..."
                      className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all bg-white"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Email <span className="text-red-500">*</span></label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="votre@email.com"
                      className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all bg-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Ville de résidence <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      placeholder="Ex: Douala"
                      className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all bg-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Pays de résidence <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      required
                      placeholder="Ex: Cameroun"
                      className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Contact du parent */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-primary flex items-center gap-2 border-b pb-2">
                  <Users size={20} />
                  Contact du parent ou tuteur
                </h3>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Numéro WhatsApp du parent ou tuteur <span className="text-red-500">*</span></label>
                  <input
                    type="tel"
                    name="parentWhatsapp"
                    value={formData.parentWhatsapp}
                    onChange={handleChange}
                    required
                    placeholder="+237 ..."
                    className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all bg-white"
                  />
                </div>
              </div>

              {/* Profil académique */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-primary flex items-center gap-2 border-b pb-2">
                  <GraduationCap size={20} />
                  Profil académique
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Niveau d’étude actuel</label>
                    <select 
                      name="academicLevel"
                      value={formData.academicLevel}
                      onChange={handleChange}
                      className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all bg-white cursor-pointer"
                    >
                      <option>Terminale / Baccalauréat</option>
                      <option>Licence</option>
                      <option>Master</option>
                      <option>Autre</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Série ou filière actuelle</label>
                    <input
                      type="text"
                      name="major"
                      value={formData.major}
                      onChange={handleChange}
                      placeholder="Ex: Scientifique, Gestion..."
                      className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all bg-white"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Année d’obtention du dernier diplôme</label>
                  <input
                    type="text"
                    name="lastDegreeYear"
                    value={formData.lastDegreeYear}
                    onChange={handleChange}
                    placeholder="Ex: 2023"
                    className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all bg-white"
                  />
                </div>
              </div>

              {/* Projet d’étude en France */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-primary flex items-center gap-2 border-b pb-2">
                  <Globe size={20} />
                  Projet d’étude en France
                </h3>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Domaine d’étude souhaité en France <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="desiredField"
                    value={formData.desiredField}
                    onChange={handleChange}
                    required
                    placeholder="Ex: Ingénierie, Commerce, Santé..."
                    className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all bg-white"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Pour quelle rentrée souhaitez-vous partir ?</label>
                    <select 
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all bg-white cursor-pointer"
                    >
                      <option>Prochaine rentrée</option>
                      <option>Dès que possible</option>
                      <option>Je me renseigne encore</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Avez-vous déjà tenté une procédure Campus France ?</label>
                    <select 
                      name="campusFranceHistory"
                      value={formData.campusFranceHistory}
                      onChange={handleChange}
                      className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all bg-white cursor-pointer"
                    >
                      <option>Oui</option>
                      <option>Non</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Qualification du candidat */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-primary flex items-center gap-2 border-b pb-2">
                  <Briefcase size={20} />
                  Qualification du candidat
                </h3>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Pourquoi souhaitez-vous étudier en France ?</label>
                  <textarea
                    name="motivation"
                    value={formData.motivation}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Vos motivations..."
                    className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all resize-none bg-white"
                  ></textarea>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Êtes-vous prêt(e) à lancer votre procédure d’admission dans une école privée ?</label>
                  <select 
                    name="readyForPrivateSchool"
                    value={formData.readyForPrivateSchool}
                    onChange={handleChange}
                    className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all bg-white cursor-pointer"
                  >
                    <option>Oui</option>
                    <option>Oui, j’aimerais d’abord parler avec un conseiller</option>
                    <option>Je me renseigne encore</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Quand souhaitez-vous être contacté ?</label>
                  <select 
                    name="contactPreference"
                    value={formData.contactPreference}
                    onChange={handleChange}
                    className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all bg-white cursor-pointer"
                  >
                    <option>Aujourd’hui</option>
                    <option>Cette semaine</option>
                    <option>Plus tard</option>
                  </select>
                </div>
              </div>

              {/* Confirmation */}
              <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative flex items-center mt-1">
                    <input
                      type="checkbox"
                      name="confirmation"
                      checked={formData.confirmation}
                      onChange={handleChange}
                      className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-gray-300 bg-white checked:bg-primary checked:border-primary transition-all"
                    />
                    <CheckCircle size={14} className="absolute text-white opacity-0 peer-checked:opacity-100 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                    Je confirme être réellement intéressé(e) par une admission dans une école privée en France. <span className="text-red-500">*</span>
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  "w-full bg-primary text-white py-5 rounded-2xl font-bold text-lg transition-all shadow-lg flex items-center justify-center space-x-2",
                  isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:bg-primary-hover hover:shadow-primary/20 transform hover:-translate-y-1"
                )}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    <span>Envoi en cours...</span>
                  </>
                ) : (
                  <>
                    <span>Soumettre ma candidature</span>
                    <Send size={20} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
