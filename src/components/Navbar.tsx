import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone, MessageCircle } from "lucide-react";
import { siteConfig as staticSiteConfig } from "../data";
import { cn } from "../lib/utils";
import { useFirebaseData } from "../lib/hooks";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { siteConfig: fbSiteConfig } = useFirebaseData();
  const location = useLocation();

  const siteConfig = fbSiteConfig || staticSiteConfig;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Accueil", path: "/" },
    { name: "À propos", path: "/a-propos" },
    { name: "Services", path: "/services" },
    { name: "Destinations", path: "/destinations" },
    { name: "Témoignages", path: "/temoignages" },
    { name: "Blog", path: "/blog" },
    { name: "Contact", path: "/contact" },
  ];

  const isHomePage = location.pathname === "/";

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        (scrolled || !isHomePage || location.pathname === '/admin') ? "bg-white shadow-md py-2" : "bg-transparent py-4"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            {siteConfig.logo_url ? (
              <img 
                src={siteConfig.logo_url} 
                alt={siteConfig.name} 
                className={cn(
                  "h-12 w-auto transition-all duration-300",
                  !(scrolled || !isHomePage || location.pathname === '/admin') && "brightness-0 invert"
                )}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement!.querySelector('.logo-fallback')!.classList.remove('hidden');
                }}
              />
            ) : null}
            <div className={cn("logo-fallback w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xl", siteConfig.logo_url ? "hidden" : "")}>
              {siteConfig.name.charAt(0)}
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-secondary",
                  location.pathname === link.path
                    ? "text-secondary"
                    : (scrolled || !isHomePage || location.pathname === '/admin') ? "text-gray-700" : "text-white"
                )}
              >
                {link.name}
              </Link>
            ))}
            <a
              href={siteConfig.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center space-x-2 hover:bg-primary-hover transition-colors"
            >
              <MessageCircle size={16} />
              <span>WhatsApp</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={cn(
                "p-2 rounded-md",
                (scrolled || !isHomePage || location.pathname === '/admin') ? "text-gray-900" : "text-white"
              )}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <div
        className={cn(
          "md:hidden bg-white absolute top-full left-0 right-0 shadow-lg transition-all duration-300 overflow-hidden",
          isOpen ? "max-h-96" : "max-h-0"
        )}
      >
        <div className="px-4 pt-2 pb-6 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={cn(
                "block px-3 py-2 rounded-md text-base font-medium",
                location.pathname === link.path
                  ? "text-primary bg-primary/5"
                  : "text-gray-700 hover:text-primary hover:bg-gray-50"
              )}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 flex flex-col space-y-3">
            <a
              href={siteConfig.whatsapp}
              className="flex items-center justify-center space-x-2 bg-primary text-white px-4 py-3 rounded-md font-semibold"
            >
              <MessageCircle size={20} />
              <span>WhatsApp</span>
            </a>
            <a
              href={`tel:${siteConfig.phone}`}
              className="flex items-center justify-center space-x-2 border border-primary text-primary px-4 py-3 rounded-md font-semibold"
            >
              <Phone size={20} />
              <span>Appeler</span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
