import React, { useState, useEffect } from "react";
import { 
  LayoutDashboard, FileText, Users, MessageSquare, Settings, 
  Plus, Edit, Trash2, Save, X, LogIn, LogOut, Globe, MapPin, Image as ImageIcon,
  Loader2, AlertCircle, CheckCircle2, CheckCircle
} from "lucide-react";
import { cn } from "../lib/utils";
import { supabase } from "../lib/supabase";
import { Service, Testimonial, BlogPost, SiteConfig, Destination, Branch } from "../types";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

// Image Upload Component
function ImageUpload({ onUpload, currentImage, label }: { onUpload: (url: string) => void, currentImage?: string, label: string }) {
  const [isUploading, setIsUploading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileName = `${Date.now()}_${file.name}`;
      const { data, error } = await supabase.storage
        .from('uploads')
        .upload(fileName, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('uploads')
        .getPublicUrl(fileName);

      onUpload(publicUrl);
      toast.success("Image téléchargée avec succès");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Erreur lors du téléchargement de l'image");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-bold text-gray-700">{label}</label>
      <div className="flex items-center space-x-4">
        {currentImage && (
          <img src={currentImage} alt="Preview" className="w-16 h-16 rounded-lg object-cover border border-gray-200" />
        )}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
        >
          {isUploading ? <Loader2 className="animate-spin" size={16} /> : <ImageIcon size={16} />}
          <span>{isUploading ? "Téléchargement..." : "Choisir une image"}</span>
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleUpload}
          className="hidden"
          accept="image/*"
        />
      </div>
    </div>
  );
}

// Operation types for error handling
enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export default function Admin() {
  const [user, setUser] = useState<any>(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(localStorage.getItem('admin_authenticated') === 'true');
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isEditing, setIsEditing] = useState<string | boolean>(false); // false, 'new', or docId
  
  const isSupabaseConfigured = !!import.meta.env.VITE_SUPABASE_URL && !!import.meta.env.VITE_SUPABASE_ANON_KEY;

  // Data states
  const [services, setServices] = useState<Service[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null);

  // Form states
  const [formData, setFormData] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState<{ id: string, type: 'delete' } | null>(null);
  const [previewMarkdown, setPreviewMarkdown] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    }).catch(err => {
      console.error("Auth session error:", err);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [isSupabaseConfigured]);

  // Real-time listeners
  useEffect(() => {
    if ((!user && !isAdminAuthenticated) || !isSupabaseConfigured) return;

    const fetchData = async () => {
      try {
        const [
          { data: servicesData },
          { data: testimonialsData },
          { data: blogData },
          { data: destinationsData },
          { data: branchesData },
          { data: configData }
        ] = await Promise.all([
          supabase.from('services').select('*'),
          supabase.from('testimonials').select('*'),
          supabase.from('blog_posts').select('*'),
          supabase.from('destinations').select('*'),
          supabase.from('branches').select('*'),
          supabase.from('site_config').select('*').eq('id', 1).maybeSingle()
        ]);

        if (servicesData) setServices(servicesData as Service[]);
        if (testimonialsData) setTestimonials(testimonialsData as Testimonial[]);
        if (blogData) setBlogPosts(blogData as BlogPost[]);
        if (destinationsData) setDestinations(destinationsData as Destination[]);
        if (branchesData) setBranches(branchesData as Branch[]);
        
        if (configData) {
          setSiteConfig(configData as SiteConfig);
        } else if (activeTab === 'contact') {
          // If no config exists and we are on contact tab, we'll create it on save
          console.log("No site config found, will be created on first save");
        }
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error("Erreur lors du chargement des données");
      }
    };

    fetchData();

    // Setup realtime subscriptions
    const channels = [
      supabase.channel('admin-services').on('postgres_changes', { event: '*', schema: 'public', table: 'services' }, fetchData).subscribe(),
      supabase.channel('admin-testimonials').on('postgres_changes', { event: '*', schema: 'public', table: 'testimonials' }, fetchData).subscribe(),
      supabase.channel('admin-blog').on('postgres_changes', { event: '*', schema: 'public', table: 'blog_posts' }, fetchData).subscribe(),
      supabase.channel('admin-destinations').on('postgres_changes', { event: '*', schema: 'public', table: 'destinations' }, fetchData).subscribe(),
      supabase.channel('admin-branches').on('postgres_changes', { event: '*', schema: 'public', table: 'branches' }, fetchData).subscribe(),
      supabase.channel('admin-config').on('postgres_changes', { event: '*', schema: 'public', table: 'site_config' }, fetchData).subscribe(),
    ];

    return () => {
      channels.forEach(channel => channel.unsubscribe());
    };
  }, [user, isAdminAuthenticated, isSupabaseConfigured]);

  useEffect(() => {
    if (activeTab === 'contact' && siteConfig && Object.keys(formData).length === 0) {
      setFormData(siteConfig);
    }
  }, [activeTab, siteConfig]);

  const handleSupabaseError = (error: any, operationType: string, path: string | null) => {
    console.error('Supabase Error: ', error);
    toast.error(`Erreur lors de l'opération ${operationType} sur ${path}`);
  };

  const handlePasswordLogin = () => {
    const correctPassword = import.meta.env.VITE_ADMIN_PASSWORD || "admin123";
    if (password === correctPassword) {
      localStorage.setItem('admin_authenticated', 'true');
      setIsAdminAuthenticated(true);
      toast.success('Accès autorisé');
    } else {
      toast.error('Mot de passe incorrect');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('admin_authenticated');
    setIsAdminAuthenticated(false);
    toast.success('Déconnecté avec succès');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTab) return;
    setIsSaving(true);

    const tableName = activeTab === 'contact' ? 'site_config' : (activeTab === 'blog' ? 'blog_posts' : activeTab);
    const docId = activeTab === 'contact' ? 1 : (typeof isEditing === 'string' && isEditing !== 'new' ? isEditing : null);

    try {
      if (activeTab === 'contact') {
        // STRICT FILTERING: Only send fields that belong to site_config
        const allowedKeys = [
          'name', 'logo_url', 'hero_title', 'hero_description', 'hero_image_url',
          'stats', 'mission_title', 'mission_text', 'mission_quote', 'mission_image_url',
          'why_title', 'why_points', 'why_image_url_1', 'why_image_url_2',
          'about_text', 'about_image_url', 'address', 'phone', 'whatsapp', 'email', 'socials'
        ];
        
        const configToSave: any = { id: 1 };
        allowedKeys.forEach(key => {
          if (formData[key] !== undefined) {
            configToSave[key] = formData[key];
          } else if (siteConfig && siteConfig[key] !== undefined) {
            configToSave[key] = siteConfig[key];
          }
        });

        const { error } = await supabase.from('site_config').upsert(configToSave);
        if (error) throw error;
      } else if (isEditing === 'new') {
        const { error } = await supabase.from(tableName).insert([formData]);
        if (error) throw error;
      } else if (docId) {
        const { error } = await supabase.from(tableName).update(formData).eq('id', docId);
        if (error) throw error;
      }
      setIsEditing(false);
      if (activeTab !== 'contact') setFormData({});
      toast.success('Enregistré avec succès !');
    } catch (error: any) {
      console.error("Detailed Supabase Error:", error);
      handleSupabaseError(error, 'WRITE', `${tableName}/${docId || 'new'}`);
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDelete = (id: string) => {
    setShowConfirm({ id, type: 'delete' });
  };

  const handleDelete = async () => {
    if (!showConfirm) return;
    const { id } = showConfirm;
    setIsDeleting(id);
    setShowConfirm(null);

    const tableName = activeTab === 'blog' ? 'blog_posts' : activeTab;

    try {
      const { error } = await supabase.from(tableName).delete().eq('id', id);
      if (error) throw error;
      toast.success('Supprimé avec succès');
    } catch (error) {
      handleSupabaseError(error, 'DELETE', `${tableName}/${id}`);
    } finally {
      setIsDeleting(null);
    }
  };

  const startEdit = (item: any) => {
    setFormData(item);
    setIsEditing(item.id);
  };

  const tabs = [
    { id: "dashboard", name: "Tableau de bord", icon: LayoutDashboard },
    { id: "services", name: "Services", icon: Settings },
    { id: "testimonials", name: "Témoignages", icon: Users },
    { id: "blog", name: "Blog", icon: FileText },
    { id: "destinations", name: "Destinations", icon: Globe },
    { id: "branches", name: "Succursales", icon: MapPin },
    { id: "contact", name: "Configuration du Site", icon: MessageSquare },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <AlertCircle className="mx-auto text-amber-500 mb-4" size={48} />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Supabase non configuré</h1>
          <p className="text-gray-600 mb-6">
            Veuillez configurer les variables d'environnement <strong>VITE_SUPABASE_URL</strong> et <strong>VITE_SUPABASE_ANON_KEY</strong> pour accéder au panel admin.
          </p>
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-sm text-amber-800 text-left">
            <p className="font-bold mb-1">Comment faire :</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Ouvrez le menu "Settings"</li>
              <li>Allez dans "Environment Variables"</li>
              <li>Ajoutez les clés et leurs valeurs</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20">
        <div className="bg-white p-10 rounded-3xl shadow-xl max-w-md w-full text-center space-y-6">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
            <Settings size={40} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Accès Administrateur</h1>
          <p className="text-gray-500">Veuillez entrer le mot de passe administrateur pour accéder à la console de gestion.</p>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 block text-left">Mot de passe</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handlePasswordLogin()}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none"
                placeholder="Entrez le mot de passe"
              />
            </div>
            
            <button 
              onClick={handlePasswordLogin}
              className="w-full bg-primary text-white py-4 rounded-xl font-bold flex items-center justify-center space-x-3 hover:bg-primary-hover transition-all shadow-lg shadow-primary/20"
            >
              <LogIn size={20} />
              <span>Se connecter</span>
            </button>
            
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-gray-400">Ou</span></div>
            </div>

            <button 
              onClick={() => window.location.href = '/'}
              className="w-full bg-gray-100 text-gray-600 py-4 rounded-xl font-bold flex items-center justify-center space-x-3 hover:bg-gray-200 transition-all"
            >
              <span>Retour au site</span>
            </button>
          </div>

          <p className="text-xs text-gray-400">
            Note: L'accès est réservé aux administrateurs autorisés.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 flex pt-24 overflow-hidden">
      
      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl space-y-6">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle size={32} />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900">Confirmation</h3>
              <p className="text-gray-500 mt-2">Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible.</p>
            </div>
            <div className="flex space-x-3">
              <button 
                onClick={() => setShowConfirm(null)}
                className="flex-1 px-4 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button 
                onClick={handleDelete}
                className="flex-1 px-4 py-3 rounded-xl font-bold bg-red-500 text-white hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-gray-200 hidden md:flex flex-col h-full">
        <div className="p-8 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Beff's Africa</h2>
          <p className="text-xs text-gray-400 uppercase tracking-widest mt-1 font-semibold">Console de Gestion</p>
        </div>
        <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { 
                setActiveTab(tab.id); 
                setIsEditing(false); 
                setFormData({}); // Reset form data when switching tabs
              }}
              className={cn(
                "w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all",
                activeTab === tab.id
                  ? "text-primary bg-primary/5 shadow-sm"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <tab.icon size={20} className={activeTab === tab.id ? "text-primary" : "text-gray-400"} />
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-100 mt-auto">
          <div className="flex items-center space-x-3 px-4 py-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary overflow-hidden">
              {user?.user_metadata?.avatar_url ? (
                <img src={user.user_metadata.avatar_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <Settings size={16} />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">
                {user?.user_metadata?.full_name || "Administrateur"}
              </p>
              <p className="text-xs text-gray-400 truncate">
                {user?.email || "Mode Maintenance"}
              </p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut size={20} />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h1 className="text-4xl font-black text-gray-900 tracking-tight">
                {tabs.find((t) => t.id === activeTab)?.name}
              </h1>
              <p className="text-gray-500 mt-2">Gérez les contenus de votre plateforme en temps réel.</p>
            </div>
            {activeTab !== "dashboard" && activeTab !== "contact" && !isEditing && (
              <button
                onClick={() => { setFormData({}); setIsEditing('new'); }}
                className="bg-primary text-white px-6 py-3 rounded-2xl font-bold flex items-center space-x-2 hover:bg-primary-hover transition-all shadow-lg shadow-primary/20"
              >
                <Plus size={20} />
                <span>Ajouter</span>
              </button>
            )}
          </div>

          {isEditing ? (
            <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">
                  {isEditing === 'new' ? 'Nouvel élément' : 'Modifier l\'élément'}
                </h2>
                <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
              </div>
              <form onSubmit={handleSave} className="space-y-6">
                {activeTab === 'services' && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Titre</label>
                        <input required type="text" value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Icône (Lucide name)</label>
                        <input type="text" value={formData.icon || ''} onChange={e => setFormData({...formData, icon: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none" placeholder="GraduationCap, Compass..." />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <ImageUpload 
                        label="Image du service" 
                        currentImage={formData.image} 
                        onUpload={(url) => setFormData({...formData, image: url})} 
                      />
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Ou URL de l'image</label>
                        <input type="text" value={formData.image || ''} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Description</label>
                      <textarea required rows={4} value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Bénéfices (un par ligne)</label>
                        <textarea rows={4} value={formData.benefits?.join('\n') || ''} onChange={e => setFormData({...formData, benefits: e.target.value.split('\n').filter(Boolean)})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none" placeholder="Bénéfice 1&#10;Bénéfice 2" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Étapes (une par ligne)</label>
                        <textarea rows={4} value={formData.steps?.join('\n') || ''} onChange={e => setFormData({...formData, steps: e.target.value.split('\n').filter(Boolean)})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none" placeholder="Étape 1&#10;Étape 2" />
                      </div>
                    </div>
                  </>
                )}

                {activeTab === 'blog' && (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Titre de l'article</label>
                      <input required type="text" value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <ImageUpload 
                        label="Image de l'article" 
                        currentImage={formData.image} 
                        onUpload={(url) => setFormData({...formData, image: url})} 
                      />
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Ou URL de l'image</label>
                        <input type="text" value={formData.image || ''} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Date</label>
                        <input type="text" value={formData.date || ''} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none" placeholder="15 Mai 2024" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Extrait</label>
                      <textarea rows={2} value={formData.excerpt || ''} onChange={e => setFormData({...formData, excerpt: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-bold text-gray-700">Contenu (Markdown)</label>
                        <button 
                          type="button"
                          onClick={() => setPreviewMarkdown(!previewMarkdown)}
                          className="text-xs font-bold text-primary hover:underline"
                        >
                          {previewMarkdown ? 'Retour à l\'édition' : 'Aperçu'}
                        </button>
                      </div>
                      {previewMarkdown ? (
                        <div className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 min-h-[250px] prose prose-sm max-w-none">
                          <ReactMarkdown>{formData.content || ''}</ReactMarkdown>
                        </div>
                      ) : (
                        <textarea required rows={10} value={formData.content || ''} onChange={e => setFormData({...formData, content: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none" />
                      )}
                    </div>
                  </>
                )}

                {activeTab === 'testimonials' && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Nom du client</label>
                        <input required type="text" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Destination</label>
                        <input type="text" value={formData.destination || ''} onChange={e => setFormData({...formData, destination: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <ImageUpload 
                        label="Photo du client" 
                        currentImage={formData.image} 
                        onUpload={(url) => setFormData({...formData, image: url})} 
                      />
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Ou URL de l'image</label>
                        <input type="text" value={formData.image || ''} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Témoignage</label>
                      <textarea required rows={4} value={formData.content || ''} onChange={e => setFormData({...formData, content: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none" />
                    </div>
                  </>
                )}

                {activeTab === 'destinations' && (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Nom de la destination</label>
                      <input required type="text" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <ImageUpload 
                        label="Image de la destination" 
                        currentImage={formData.image} 
                        onUpload={(url) => setFormData({...formData, image: url})} 
                      />
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Ou URL de l'image</label>
                        <input type="text" value={formData.image || ''} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Description</label>
                      <textarea rows={4} value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none" />
                    </div>
                  </>
                )}

                {activeTab === 'branches' && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Pays</label>
                        <input required type="text" value={formData.country || ''} onChange={e => setFormData({...formData, country: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none" placeholder="Cameroun, Gabon..." />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Ville</label>
                        <input required type="text" value={formData.city || ''} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none" placeholder="Douala, Libreville..." />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Adresse complète</label>
                      <input required type="text" value={formData.address || ''} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Téléphone</label>
                        <input required type="text" value={formData.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">WhatsApp (optionnel)</label>
                        <input type="text" value={formData.whatsapp || ''} onChange={e => setFormData({...formData, whatsapp: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Email (optionnel)</label>
                        <input type="email" value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">URL Google Maps (optionnel)</label>
                        <input type="text" value={formData.map_url || ''} onChange={e => setFormData({...formData, map_url: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none" />
                      </div>
                    </div>
                  </>
                )}

                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-100">
                  <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition-colors">Annuler</button>
                  <button 
                    type="submit" 
                    disabled={isSaving}
                    className="bg-primary text-white px-10 py-3 rounded-xl font-bold flex items-center space-x-2 hover:bg-primary-hover transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                    <span>{isSaving ? 'Enregistrement...' : 'Enregistrer'}</span>
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <>
              {activeTab === "dashboard" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {[
                    { label: "Services", count: services.length, icon: Settings, color: "bg-blue-500" },
                    { label: "Témoignages", count: testimonials.length, icon: Users, color: "bg-purple-500" },
                    { label: "Articles", count: blogPosts.length, icon: FileText, color: "bg-orange-500" },
                    { label: "Destinations", count: destinations.length, icon: Globe, color: "bg-green-500" },
                    { label: "Succursales", count: branches.length, icon: MapPin, color: "bg-red-500" },
                  ].map((stat, i) => (
                    <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden group">
                      <div className={cn("absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-10 transition-transform group-hover:scale-110", stat.color)}></div>
                      <stat.icon className="text-gray-400 mb-4" size={24} />
                      <div className="text-gray-400 text-xs font-black uppercase tracking-widest mb-1">{stat.label}</div>
                      <div className="text-4xl font-black text-gray-900">{stat.count}</div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "services" && (
                <div className="grid grid-cols-1 gap-4">
                  {services.map((service) => (
                    <div key={service.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center hover:border-primary/20 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-primary">
                          <Settings size={24} />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-gray-900">{service.title}</h3>
                          <p className="text-sm text-gray-400 line-clamp-1">{service.description}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button onClick={() => startEdit(service)} className="p-3 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"><Edit size={20} /></button>
                        <button 
                          onClick={() => confirmDelete(service.id)} 
                          disabled={isDeleting === service.id}
                          className="p-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors disabled:opacity-50"
                        >
                          {isDeleting === service.id ? <Loader2 size={20} className="animate-spin" /> : <Trash2 size={20} />}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "blog" && (
                <div className="grid grid-cols-1 gap-4">
                  {blogPosts.map((post) => (
                    <div key={post.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
                      <div className="flex items-center space-x-4">
                        <img src={post.image} alt="" className="w-16 h-16 rounded-xl object-cover" />
                        <div>
                          <h3 className="font-bold text-lg text-gray-900">{post.title}</h3>
                          <p className="text-sm text-gray-400">{post.date}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button onClick={() => startEdit(post)} className="p-3 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"><Edit size={20} /></button>
                        <button 
                          onClick={() => confirmDelete(post.id)} 
                          disabled={isDeleting === post.id}
                          className="p-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors disabled:opacity-50"
                        >
                          {isDeleting === post.id ? <Loader2 size={20} className="animate-spin" /> : <Trash2 size={20} />}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "contact" && (
                <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100">
                  <form onSubmit={handleSave} className="space-y-12">
                    <section className="space-y-6">
                      <h3 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
                        <Globe size={20} className="text-primary" />
                        <span>Identité & Hero Accueil</span>
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-gray-700">Nom de l'Agence</label>
                          <input type="text" value={formData.name || siteConfig?.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none" />
                        </div>
                        <div className="space-y-4">
                          <ImageUpload label="Logo du Site" currentImage={formData.logo_url || siteConfig?.logo_url} onUpload={url => setFormData({...formData, logo_url: url})} />
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400">Ou URL du Logo</label>
                            <input type="text" value={formData.logo_url || siteConfig?.logo_url || ''} onChange={e => setFormData({...formData, logo_url: e.target.value})} className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-primary outline-none" placeholder="https://..." />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Titre Hero Accueil</label>
                        <input type="text" value={formData.hero_title || siteConfig?.hero_title || ''} onChange={e => setFormData({...formData, hero_title: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Description Hero Accueil</label>
                        <textarea value={formData.hero_description || siteConfig?.hero_description || ''} onChange={e => setFormData({...formData, hero_description: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none h-24" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <ImageUpload label="Image Hero Accueil" currentImage={formData.hero_image_url || siteConfig?.hero_image_url} onUpload={url => setFormData({...formData, hero_image_url: url})} />
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-gray-700">Ou URL de l'image Hero</label>
                          <input type="text" value={formData.hero_image_url || siteConfig?.hero_image_url || ''} onChange={e => setFormData({...formData, hero_image_url: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none" placeholder="https://..." />
                        </div>
                      </div>
                    </section>

                    <section className="space-y-6 pt-10 border-t border-gray-100">
                      <h3 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
                        <LayoutDashboard size={20} className="text-primary" />
                        <span>Statistiques Accueil</span>
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-gray-700">Taux de réussite (%)</label>
                          <input type="text" value={formData.stats?.success_rate || siteConfig?.stats?.success_rate || ''} onChange={e => setFormData({...formData, stats: {...(formData.stats || siteConfig?.stats || {}), success_rate: e.target.value}})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-gray-700">Écoles partenaires</label>
                          <input type="text" value={formData.stats?.partners_count || siteConfig?.stats?.partners_count || ''} onChange={e => setFormData({...formData, stats: {...(formData.stats || siteConfig?.stats || {}), partners_count: e.target.value}})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-gray-700">Étudiants accompagnés</label>
                          <input type="text" value={formData.stats?.students_count || siteConfig?.stats?.students_count || ''} onChange={e => setFormData({...formData, stats: {...(formData.stats || siteConfig?.stats || {}), students_count: e.target.value}})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none" />
                        </div>
                      </div>
                    </section>

                    <section className="space-y-6 pt-10 border-t border-gray-100">
                      <h3 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
                        <FileText size={20} className="text-primary" />
                        <span>Section Mission Accueil</span>
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-gray-700">Titre Mission</label>
                          <input type="text" value={formData.mission_title || siteConfig?.mission_title || ''} onChange={e => setFormData({...formData, mission_title: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none" />
                        </div>
                        <div className="space-y-4">
                          <ImageUpload label="Image Mission" currentImage={formData.mission_image_url || siteConfig?.mission_image_url} onUpload={url => setFormData({...formData, mission_image_url: url})} />
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400">Ou URL de l'image Mission</label>
                            <input type="text" value={formData.mission_image_url || siteConfig?.mission_image_url || ''} onChange={e => setFormData({...formData, mission_image_url: e.target.value})} className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-primary outline-none" placeholder="https://..." />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Texte Mission</label>
                        <textarea value={formData.mission_text || siteConfig?.mission_text || ''} onChange={e => setFormData({...formData, mission_text: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none h-32" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Citation Mission</label>
                        <input type="text" value={formData.mission_quote || siteConfig?.mission_quote || ''} onChange={e => setFormData({...formData, mission_quote: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none" />
                      </div>
                    </section>

                    <section className="space-y-6 pt-10 border-t border-gray-100">
                      <h3 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
                        <CheckCircle size={20} className="text-primary" />
                        <span>Section Pourquoi Nous Choisir</span>
                      </h3>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Titre de la section</label>
                        <input type="text" value={formData.why_title || siteConfig?.why_title || ''} onChange={e => setFormData({...formData, why_title: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none" />
                      </div>
                      
                      <div className="space-y-4">
                        <label className="text-sm font-bold text-gray-700">Points forts (3 points)</label>
                        {[0, 1, 2].map((i) => (
                          <div key={i} className="p-4 bg-gray-50 rounded-2xl space-y-4">
                            <div className="flex items-center space-x-2 mb-2">
                              <div className="w-8 h-8 bg-secondary text-gray-900 rounded-lg flex items-center justify-center font-bold text-sm">0{i+1}</div>
                              <span className="font-bold text-gray-700">Point {i+1}</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-400 uppercase">Titre</label>
                                <input 
                                  type="text" 
                                  value={Array.isArray(formData.why_points) ? (formData.why_points[i]?.title || '') : (Array.isArray(siteConfig?.why_points) ? (siteConfig?.why_points[i]?.title || '') : '')} 
                                  onChange={e => {
                                    const currentPoints = Array.isArray(formData.why_points) ? formData.why_points : (Array.isArray(siteConfig?.why_points) ? siteConfig?.why_points : [{}, {}, {}]);
                                    const newPoints = [...currentPoints];
                                    while(newPoints.length <= i) newPoints.push({});
                                    newPoints[i] = { ...newPoints[i], title: e.target.value };
                                    setFormData({...formData, why_points: newPoints});
                                  }} 
                                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary outline-none text-sm" 
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-400 uppercase">Description</label>
                                <input 
                                  type="text" 
                                  value={Array.isArray(formData.why_points) ? (formData.why_points[i]?.description || '') : (Array.isArray(siteConfig?.why_points) ? (siteConfig?.why_points[i]?.description || '') : '')} 
                                  onChange={e => {
                                    const currentPoints = Array.isArray(formData.why_points) ? formData.why_points : (Array.isArray(siteConfig?.why_points) ? siteConfig?.why_points : [{}, {}, {}]);
                                    const newPoints = [...currentPoints];
                                    while(newPoints.length <= i) newPoints.push({});
                                    newPoints[i] = { ...newPoints[i], description: e.target.value };
                                    setFormData({...formData, why_points: newPoints});
                                  }} 
                                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary outline-none text-sm" 
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <ImageUpload label="Image 1 (Gauche)" currentImage={formData.why_image_url_1 || siteConfig?.why_image_url_1} onUpload={url => setFormData({...formData, why_image_url_1: url})} />
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400">Ou URL Image 1</label>
                            <input type="text" value={formData.why_image_url_1 || siteConfig?.why_image_url_1 || ''} onChange={e => setFormData({...formData, why_image_url_1: e.target.value})} className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-primary outline-none" placeholder="https://..." />
                          </div>
                        </div>
                        <div className="space-y-4">
                          <ImageUpload label="Image 2 (Droite)" currentImage={formData.why_image_url_2 || siteConfig?.why_image_url_2} onUpload={url => setFormData({...formData, why_image_url_2: url})} />
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400">Ou URL Image 2</label>
                            <input type="text" value={formData.why_image_url_2 || siteConfig?.why_image_url_2 || ''} onChange={e => setFormData({...formData, why_image_url_2: e.target.value})} className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-primary outline-none" placeholder="https://..." />
                          </div>
                        </div>
                      </div>
                    </section>

                    <section className="space-y-6 pt-10 border-t border-gray-100">
                      <h3 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
                        <Users size={20} className="text-primary" />
                        <span>Page À Propos</span>
                      </h3>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Texte Introduction À Propos</label>
                        <textarea value={formData.about_text || siteConfig?.about_text || ''} onChange={e => setFormData({...formData, about_text: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none h-32" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <ImageUpload label="Image À Propos" currentImage={formData.about_image_url || siteConfig?.about_image_url} onUpload={url => setFormData({...formData, about_image_url: url})} />
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-gray-700">Ou URL de l'image À Propos</label>
                          <input type="text" value={formData.about_image_url || siteConfig?.about_image_url || ''} onChange={e => setFormData({...formData, about_image_url: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none" placeholder="https://..." />
                        </div>
                      </div>
                    </section>

                    <section className="space-y-6 pt-10 border-t border-gray-100">
                      <h3 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
                        <MessageSquare size={20} className="text-primary" />
                        <span>Coordonnées de Contact</span>
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-gray-700">Email</label>
                          <input type="email" value={formData.email || siteConfig?.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-gray-700">Téléphone</label>
                          <input type="text" value={formData.phone || siteConfig?.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-gray-700">WhatsApp (Lien complet)</label>
                          <input type="text" value={formData.whatsapp || siteConfig?.whatsapp || ''} onChange={e => setFormData({...formData, whatsapp: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-gray-700">Adresse Siège</label>
                          <input type="text" value={formData.address || siteConfig?.address || ''} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none" />
                        </div>
                      </div>
                    </section>

                    <div className="flex justify-end pt-6">
                      <button 
                        type="submit" 
                        disabled={isSaving}
                        className="bg-primary text-white px-10 py-4 rounded-2xl font-bold flex items-center space-x-2 hover:bg-primary-hover transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                      >
                        {isSaving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                        <span>{isSaving ? 'Enregistrement...' : 'Enregistrer la configuration'}</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Testimonials, Destinations & Branches lists follow same pattern */}
              {(activeTab === "testimonials" || activeTab === "destinations" || activeTab === "branches") && (
                <div className="grid grid-cols-1 gap-4">
                  {(activeTab === "testimonials" ? testimonials : activeTab === "destinations" ? destinations : branches).map((item: any) => (
                    <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
                      <div className="flex items-center space-x-4">
                        {activeTab !== "branches" && (item.image || item.avatar) ? (
                          <img src={item.image || item.avatar} alt="" className="w-12 h-12 rounded-xl object-cover" />
                        ) : (
                          <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                            {activeTab === "branches" ? <MapPin size={20} /> : <ImageIcon size={20} />}
                          </div>
                        )}
                        <div>
                          <h3 className="font-bold text-lg text-gray-900">
                            {activeTab === "branches" ? `${item.city}, ${item.country}` : item.name}
                          </h3>
                          <p className="text-sm text-gray-400 line-clamp-1">
                            {activeTab === "branches" ? item.address : (item.content || item.description)}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button onClick={() => startEdit(item)} className="p-3 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"><Edit size={20} /></button>
                        <button 
                          onClick={() => confirmDelete(item.id)} 
                          disabled={isDeleting === item.id}
                          className="p-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors disabled:opacity-50"
                        >
                          {isDeleting === item.id ? <Loader2 size={20} className="animate-spin" /> : <Trash2 size={20} />}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
