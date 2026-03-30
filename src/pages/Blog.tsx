import React from "react";
import { motion } from "motion/react";
import { blogPosts as staticBlogPosts } from "../data";
import { Calendar, ArrowRight, Search, Tag } from "lucide-react";
import { Link } from "react-router-dom";
import { useFirebaseData } from "../lib/hooks";

export default function Blog() {
  const { blogPosts: fbBlogPosts } = useFirebaseData();
  const blogPosts = fbBlogPosts.length > 0 ? fbBlogPosts : staticBlogPosts;

  return (
    <div className="pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Blog & Actualités</h1>
          <p className="text-xl text-gray-600">
            Conseils, guides et dernières nouvelles sur les études à l'international.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {blogPosts.map((post) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl border border-gray-100 group"
              >
                <div className="h-80 overflow-hidden relative">
                  <img
                    src={post.image || `https://picsum.photos/seed/${post.id}/800/600`}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-6 left-6 bg-primary text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest">
                    Conseils Études
                  </div>
                </div>
                <div className="p-10 space-y-6">
                  <div className="flex items-center space-x-4 text-gray-500 text-sm">
                    <div className="flex items-center space-x-1">
                      <Calendar size={16} />
                      <span>{post.date}</span>
                    </div>
                    {post.author && (
                      <div className="flex items-center space-x-1">
                        <Tag size={16} />
                        <span>{post.author}</span>
                      </div>
                    )}
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 group-hover:text-primary transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    {post.excerpt}
                  </p>
                  <Link
                    to={`/blog/${post.id}`}
                    className="inline-flex items-center space-x-2 text-primary font-bold hover:text-primary-hover transition-colors"
                  >
                    <span>Lire la suite</span>
                    <ArrowRight size={20} />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-12">
            {/* Search */}
            <div className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Rechercher</h3>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Mots clés..."
                  className="w-full pl-12 pr-6 py-4 rounded-2xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              </div>
            </div>

            {/* Categories */}
            <div className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Catégories</h3>
              <ul className="space-y-4">
                {["Guide Visa", "Bourses d'études", "Vie Étudiante", "Partenariats", "Événements"].map((cat) => (
                  <li key={cat}>
                    <button className="flex items-center justify-between w-full text-gray-600 hover:text-primary transition-colors font-medium">
                      <span>{cat}</span>
                      <span className="bg-white px-2 py-1 rounded-md text-xs border border-gray-100">12</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div className="bg-primary p-8 rounded-[2rem] text-white">
              <h3 className="text-xl font-bold mb-4">Newsletter</h3>
              <p className="text-white/80 text-sm mb-6">Recevez nos derniers conseils directement dans votre boîte mail.</p>
              <form className="space-y-4">
                <input
                  type="email"
                  placeholder="votre@email.com"
                  className="w-full px-6 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-white/50 outline-none focus:bg-white/20 transition-all"
                />
                <button className="w-full bg-white text-primary py-4 rounded-2xl font-bold hover:bg-primary/5 transition-colors">
                  S'abonner
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
