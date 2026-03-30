import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Facebook, Instagram, Linkedin, MessageCircle, Settings, X, Lock, ArrowRight } from "lucide-react";
import { siteConfig as staticSiteConfig } from "../data";
import { useFirebaseData } from "../lib/hooks";
import { cn } from "../lib/utils";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Footer() {
  const { siteConfig: fbSiteConfig } = useFirebaseData();
  const siteConfig = fbSiteConfig || staticSiteConfig;
  const navigate = useNavigate();
  const [isAdminOpen, setIsAdminOpen] = React.useState(false);
  const [adminPassword, setAdminPassword] = React.useState("");

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';
    
    if (adminPassword === correctPassword) {
      setIsAdminOpen(false);
      setAdminPassword('');
      navigate('/admin');
    } else {
      toast.error('Mot de passe incorrect');
    }
  };

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center space-x-2">
              {siteConfig.logo_url ? (
                <img 
                  src={siteConfig.logo_url} 
                  alt={siteConfig.name} 
                  className="h-12 w-auto brightness-0 invert"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement!.querySelector('.logo-fallback')!.classList.remove('hidden');
                  }}
                />
              ) : null}
              <div className={cn("logo-fallback w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xl", siteConfig.logo_url ? "hidden" : "")}>
                {siteConfig.name.charAt(0)}
              </div>
              <span className="font-bold text-xl tracking-tight">{siteConfig.name.split(' ')[0]} {siteConfig.name.split(' ')[1] || ''}</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Ouvrir les portes du monde à la jeunesse africaine à travers un accompagnement sur mesure, humain et inspirant.
            </p>
            <div className="flex space-x-4">
              {siteConfig.socials?.facebook && (
                <a href={siteConfig.socials.facebook} className="text-gray-400 hover:text-primary transition-colors">
                  <Facebook size={20} />
                </a>
              )}
              {siteConfig.socials?.instagram && (
                <a href={siteConfig.socials.instagram} className="text-gray-400 hover:text-primary transition-colors">
                  <Instagram size={20} />
                </a>
              )}
              {siteConfig.socials?.linkedin && (
                <a href={siteConfig.socials.linkedin} className="text-gray-400 hover:text-primary transition-colors">
                  <Linkedin size={20} />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Liens Rapides</h3>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li><Link to="/a-propos" className="hover:text-primary transition-colors">À Propos</Link></li>
              <li><Link to="/services" className="hover:text-primary transition-colors">Nos Services</Link></li>
              <li><Link to="/destinations" className="hover:text-primary transition-colors">Destinations</Link></li>
              <li><Link to="/temoignages" className="hover:text-primary transition-colors">Témoignages</Link></li>
              <li><Link to="/blog" className="hover:text-primary transition-colors">Actualités</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Services</h3>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li>Accompagnement Études</li>
              <li>Orientation Académique</li>
              <li>Dossiers Admission & Visa</li>
              <li>Coaching Pré-départ</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Nos Succursales</h3>
            <div className="space-y-6">
              {(siteConfig.branches || []).length > 0 ? (
                (siteConfig.branches || []).map((branch) => (
                  <div key={branch.id} className="space-y-2">
                    <h4 className="text-primary font-bold text-xs uppercase tracking-widest">{branch.country}</h4>
                    <ul className="space-y-2 text-gray-400 text-xs">
                      <li className="flex items-start space-x-2">
                        <MapPin size={14} className="text-primary shrink-0 mt-0.5" />
                        <span>{branch.address}</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Phone size={14} className="text-primary shrink-0" />
                        <span>{branch.phone}</span>
                      </li>
                    </ul>
                  </div>
                ))
              ) : (
                <ul className="space-y-4 text-gray-400 text-sm">
                  <li className="flex items-start space-x-3">
                    <MapPin size={18} className="text-primary shrink-0" />
                    <span>{siteConfig.address}</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Phone size={18} className="text-primary shrink-0" />
                    <span>{siteConfig.phone}</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Mail size={18} className="text-primary shrink-0" />
                    <span>{siteConfig.email}</span>
                  </li>
                </ul>
              )}
              <div className="pt-2">
                <Link
                  to="/contact"
                  className="inline-flex items-center space-x-2 text-primary hover:text-primary-hover font-medium text-sm"
                >
                  <MessageCircle size={18} />
                  <span>Tous nos contacts</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-500 text-xs">
          <p>© {new Date().getFullYear()} Beff’s Africa Consulting Group. Tous droits réservés.</p>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <Link to="/mentions-legales" className="hover:text-gray-300">Mentions Légales</Link>
            <Link to="/confidentialite" className="hover:text-gray-300">Confidentialité</Link>
            <button 
              onClick={() => setIsAdminOpen(true)}
              className="text-gray-500 hover:text-primary transition-colors flex items-center space-x-1"
              title="Administration"
            >
              <Settings size={14} />
            </button>
          </div>
        </div>
      </div>

      {isAdminOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl space-y-6 relative">
            <button 
              onClick={() => setIsAdminOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto">
              <Lock size={32} />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900">Accès Restreint</h3>
              <p className="text-gray-500 mt-2">Veuillez entrer le mot de passe administrateur pour continuer.</p>
            </div>
            <form onSubmit={handleAdminSubmit} className="space-y-4">
              <input
                autoFocus
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Mot de passe"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 focus:border-primary outline-none"
              />
              <button 
                type="submit"
                className="w-full bg-primary text-white py-3 rounded-xl font-bold flex items-center justify-center space-x-2 hover:bg-primary-hover transition-all"
              >
                <span>Accéder</span>
                <ArrowRight size={20} />
              </button>
            </form>
          </div>
        </div>
      )}
    </footer>
  );
}
