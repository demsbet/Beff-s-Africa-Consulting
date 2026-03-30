import React from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import { blogPosts as staticBlogPosts } from "../data";
import { Calendar, User, ArrowLeft, Tag } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useFirebaseData } from "../lib/hooks";

export default function BlogPost() {
  const { id } = useParams();
  const { blogPosts: fbBlogPosts } = useFirebaseData();
  const blogPosts = fbBlogPosts.length > 0 ? fbBlogPosts : staticBlogPosts;
  
  const post = blogPosts.find((p) => p.id === id);

  if (!post) {
    return (
      <div className="pt-40 pb-24 text-center">
        <h1 className="text-3xl font-bold mb-4">Article non trouvé</h1>
        <Link to="/blog" className="text-primary hover:underline">Retour au blog</Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/blog"
          className="inline-flex items-center space-x-2 text-gray-500 hover:text-primary mb-12 transition-colors group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span>Retour aux articles</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12"
        >
          <div className="space-y-6">
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Calendar size={16} />
                <span>{post.date}</span>
              </div>
              {post.author && (
                <div className="flex items-center space-x-1">
                  <User size={16} />
                  <span>{post.author}</span>
                </div>
              )}
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
              {post.title}
            </h1>
            <p className="text-xl text-gray-600 italic leading-relaxed">
              {post.excerpt}
            </p>
          </div>

          <div className="aspect-video rounded-[3rem] overflow-hidden shadow-2xl">
            <img
              src={post.image || `https://picsum.photos/seed/${post.id}/1200/800`}
              alt={post.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="prose prose-lg prose-primary max-w-none">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>

          <div className="pt-12 border-t border-gray-100">
            <div className="bg-gray-50 rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-gray-900">Vous avez un projet d'études ?</h3>
                <p className="text-gray-600">Nos experts vous accompagnent dans toutes vos démarches.</p>
              </div>
              <Link
                to="/contact"
                className="bg-primary text-white px-10 py-4 rounded-full font-bold hover:bg-primary-hover transition-all shadow-lg shadow-primary/20 whitespace-nowrap"
              >
                Prendre rendez-vous
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
