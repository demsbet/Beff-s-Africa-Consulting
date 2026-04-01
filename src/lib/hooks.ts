import { useState, useEffect } from 'react';
import { supabase } from './supabase';
import { Service, Testimonial, BlogPost, Destination, SiteConfig, Branch } from '../types';

export function useFirebaseData() {
  const [services, setServices] = useState<Service[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn('Supabase URL or Anon Key missing. Please check your environment variables.');
      setLoading(false);
      return;
    }

    async function fetchData() {
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
          const config = configData as SiteConfig;
          if (branchesData) {
            config.branches = branchesData as Branch[];
          }
          setSiteConfig(config);
        } else {
          console.log('No site configuration found in Supabase. Using static fallbacks.');
        }
      } catch (error) {
        console.error('Error fetching data from Supabase:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();

    // Setup realtime subscriptions for live updates
    const channels = [
      supabase.channel('services').on('postgres_changes', { event: '*', schema: 'public', table: 'services' }, fetchData).subscribe(),
      supabase.channel('testimonials').on('postgres_changes', { event: '*', schema: 'public', table: 'testimonials' }, fetchData).subscribe(),
      supabase.channel('blog_posts').on('postgres_changes', { event: '*', schema: 'public', table: 'blog_posts' }, fetchData).subscribe(),
      supabase.channel('destinations').on('postgres_changes', { event: '*', schema: 'public', table: 'destinations' }, fetchData).subscribe(),
      supabase.channel('branches').on('postgres_changes', { event: '*', schema: 'public', table: 'branches' }, fetchData).subscribe(),
      supabase.channel('site_config').on('postgres_changes', { event: '*', schema: 'public', table: 'site_config' }, fetchData).subscribe(),
    ];

    return () => {
      channels.forEach(channel => channel.unsubscribe());
    };
  }, []);

  return { services, testimonials, blogPosts, destinations, branches, siteConfig, loading };
}
