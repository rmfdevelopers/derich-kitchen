'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { 
  Utensils, 
  ChefHat, 
  Truck, 
  Instagram, 
  MapPin, 
  ArrowRight, 
  Phone, 
  Mail, 
  CheckCheck, 
  Loader2, 
  ImageOff,
  Menu,
  X,
  Beef
} from 'lucide-react';

// DESIGN DECISIONS:
// Layout Energy: bold
// Depth Treatment: glassmorphic
// Divider Style: D-STAT
// Typography Personality: editorial

const brief = {
  "brand": {
    "name": "De'rich Kitchen",
    "tagline": "Luxury in every meal.",
    "description": "Premium gourmet lunch packs, artisan bakery selections, and executive event catering curated by Chef C.P.",
    "industry": "food"
  },
  "contact": {
    "instagram": "@de_rich_kitchen",
    "address": "Gbagada & Surulere, Lagos"
  },
  "heroImage": {
    "url": "https://images.unsplash.com/photo-1665332398215-825114bbb355?auto=format&fit=crop&q=80&w=1080"
  }
};

const IMAGES = {
  hero: "https://images.unsplash.com/photo-1665332398215-825114bbb355?auto=format&fit=crop&q=80&w=1080",
  products: [
    "https://images.unsplash.com/photo-1763048443535-1243379234e2?auto=format&fit=crop&q=80&w=1080",
    "https://images.unsplash.com/photo-1632852576480-c10a8e19496a?auto=format&fit=crop&q=80&w=1080",
    "https://images.unsplash.com/photo-1700625914525-54dba25d2125?auto=format&fit=crop&q=80&w=1080",
    "https://images.unsplash.com/photo-1568254183919-78a4f43a2877?auto=format&fit=crop&q=80&w=1080"
  ],
  gallery: [
    "https://images.unsplash.com/photo-1665332195309-9d75071138f0?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1664334997177-6ae654a62735?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1665833613236-7c1d087463b1?auto=format&fit=crop&q=80&w=600"
  ]
};

// --- Hooks ---

const useScrollReveal = (threshold = 0.15) => {
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, isVisible };
};

// --- Components ---

function SafeImage({ src, alt, fill, width, height, className, priority }: {
  src: string; alt: string; fill?: boolean; width?: number; height?: number;
  className?: string; priority?: boolean;
}) {
  const [error, setError] = useState(false);
  if (error) {
    return (
      <div className={`flex items-center justify-center bg-accent/50 ${className}`}>
        <ImageOff size={28} className="text-white/20" />
      </div>
    );
  }
  return (
    <Image src={src} alt={alt} fill={fill}
      width={!fill ? (width ?? 800) : undefined}
      height={!fill ? (height ?? 600) : undefined}
      className={className} priority={priority}
      onError={() => setError(true)} />
  );
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-accent/90 backdrop-blur-xl py-4 shadow-2xl' : 'bg-transparent py-8'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="w-10 h-10 bg-primary flex items-center justify-center rounded-none rotate-45 group-hover:rotate-90 transition-transform duration-500">
            <span className="text-accent font-black text-xl -rotate-45 group-hover:-rotate-90 transition-transform duration-500">D</span>
          </div>
          <span className="font-heading text-2xl font-black tracking-tighter uppercase text-white">De'rich</span>
        </div>

        <div className="hidden md:flex items-center gap-10">
          {['Home', 'Menu', 'About Chef', 'Contact'].map((link) => (
            <a key={link} href={`#${link.toLowerCase().replace(' ', '')}`} className="text-sm font-bold uppercase tracking-widest text-white/70 hover:text-primary transition-colors">
              {link}
            </a>
          ))}
          <a href="#products" className="bg-primary text-accent px-6 py-2.5 font-black text-sm uppercase tracking-tighter hover:scale-105 transition-all">
            Order Now
          </a>
        </div>

        <button className="md:hidden text-white" onClick={() => setIsOpen(true)}>
          <Menu size={30} />
        </button>
      </div>

      {/* Mobile Sidebar */}
      <div className={`fixed inset-0 bg-accent z-[60] transition-transform duration-500 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-8 flex justify-between items-center">
          <span className="font-heading text-2xl font-black text-white">DE'RICH</span>
          <button onClick={() => setIsOpen(false)}><X size={32} className="text-primary" /></button>
        </div>
        <div className="flex flex-col gap-8 p-12">
          {['Home', 'Menu', 'About Chef', 'Contact'].map((link) => (
            <a key={link} href={`#${link.toLowerCase().replace(' ', '')}`} onClick={() => setIsOpen(false)} className="text-4xl font-heading font-black text-white hover:text-primary transition-colors">
              {link}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}

function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setSent(true); }, 1500);
  };

  if (sent) {
    return (
      <div className="glass-panel p-12 text-center animate-scaleIn rounded-3xl">
        <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-6 mx-auto border border-primary/40">
          <CheckCheck size={32} className="text-primary" />
        </div>
        <h3 className="font-heading text-4xl font-black text-white mb-3">Order Received</h3>
        <p className="text-white/60 max-w-sm mx-auto text-lg">Chef C.P's team will contact you shortly to confirm your luxury selection.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white/5 p-8 sm:p-10 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="relative z-10">
        <h3 className="font-heading text-3xl font-black text-white mb-8">Place Your Order</h3>
        <div className="space-y-4">
          {(['name', 'email', 'phone'] as const).map(field => (
            <input
              key={field}
              type={field === 'email' ? 'email' : 'text'}
              placeholder={field.toUpperCase()}
              value={form[field]}
              onChange={e => setForm(prev => ({ ...prev, [field]: e.target.value }))}
              required
              className="w-full bg-accent border border-white/10 rounded-none px-5 py-4 text-white placeholder-white/30 text-sm outline-none transition-all duration-300 focus:border-primary focus:ring-1 focus:ring-primary"
            />
          ))}
          <textarea 
            rows={4} 
            placeholder="ORDER DETAILS & DELIVERY ADDRESS"
            value={form.message}
            onChange={e => setForm(prev => ({ ...prev, message: e.target.value }))}
            required
            className="w-full bg-accent border border-white/10 rounded-none px-5 py-4 text-white placeholder-white/30 text-sm outline-none resize-none transition-all duration-300 focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>
        <button type="submit" disabled={loading}
          className="w-full mt-8 bg-primary text-accent py-5 font-black text-lg uppercase tracking-tighter hover:brightness-110 transition-all disabled:opacity-60 flex justify-center items-center gap-3 group">
          {loading ? <Loader2 className="animate-spin" /> : <>Send Inquiry <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" /></>}
        </button>
      </div>
    </form>
  );
}

// --- Sections ---

export default function Page() {
  const heroReveal = useScrollReveal();
  const featuresReveal = useScrollReveal();
  const galleryReveal = useScrollReveal();
  const productsReveal = useScrollReveal();
  const aboutReveal = useScrollReveal();
  const testimonialsReveal = useScrollReveal();
  const contactReveal = useScrollReveal();

  return (
    <main className="bg-accent">
      <Navbar />

      {/* Hero Section - HR-A */}
      <section id="home" ref={heroReveal.ref} className="min-h-screen relative flex items-center justify-center bg-accent px-6 overflow-hidden pt-20">
        <div className="absolute top-1/4 left-1/4 w-[40rem] h-[40rem] bg-primary/10 rounded-full blur-[140px] pointer-events-none animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[80vh] opacity-20 grayscale mix-blend-overlay max-w-6xl pointer-events-none">
          <SafeImage src={IMAGES.hero} alt="Luxury Dining" fill className="object-cover" priority />
        </div>

        <div className={`relative z-10 text-center max-w-5xl transition-all duration-1000 ${heroReveal.isVisible ? 'opacity-100 translate-y-0 skew-y-0' : 'opacity-0 translate-y-12 skew-y-2'}`}>
          <h1 className="font-heading text-7xl md:text-[9rem] font-black text-white leading-[0.85] tracking-tighter uppercase italic">
            Luxury in <br/> <span className="text-primary">Every Meal.</span>
          </h1>
          <p className="text-white/50 mt-10 text-xl md:text-2xl max-w-2xl mx-auto font-light leading-relaxed">
            {brief.brand.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center mt-12">
            <a href="#products" className="bg-primary text-accent px-12 py-5 font-black text-xl uppercase tracking-tighter hover:scale-105 transition-all shadow-[0_0_40px_rgba(57,255,20,0.2)]">
              Explore Menu
            </a>
            <a href="#about" className="border-2 border-white/20 text-white px-12 py-5 font-black text-xl uppercase tracking-tighter hover:bg-white/5 transition-all">
              Meet Chef C.P
            </a>
          </div>
        </div>
      </section>

      {/* Divider Style: D-STAT */}
      <div className="bg-primary py-16 border-y-4 border-accent">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          {[
            { number: '50k+', label: 'Meals Served' },
            { number: '3k+', label: 'Happy Foodies' },
            { number: '2', label: 'Lagos Kitchen Hubs' }
          ].map((s, i) => (
            <div key={i} className="group">
              <p className="text-6xl font-heading font-black text-accent tracking-tighter group-hover:scale-110 transition-transform">{s.number}</p>
              <p className="text-accent/60 text-sm mt-2 font-bold uppercase tracking-[0.2em]">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Features - F-STICKY */}
      <section id="features" ref={featuresReveal.ref} className="py-32 px-6 bg-accent relative">
        <div className="max-w-4xl mx-auto">
          <div className="mb-20 text-center md:text-left">
            <h2 className="font-heading text-6xl md:text-8xl font-black text-white leading-none uppercase">The De'rich <br/><span className="text-primary/40">Standard</span></h2>
          </div>
          <div className="space-y-6">
            {[
              { icon: <Utensils size={32} />, title: "Gourmet Catering", desc: "Elevated menu options for weddings and high-end corporate events." },
              { icon: <ChefHat size={32} />, title: "Chef-Curated", desc: "Every meal is designed and supervised by the visionary Chef C.P." },
              { icon: <Truck size={32} />, title: "Lagos Delivery", desc: "Efficient delivery across Gbagada, Surulere, and surrounding areas." }
            ].map((f, idx) => (
              <div key={idx} className={`sticky group top-32 transition-all duration-700 ${featuresReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`} style={{ transitionDelay: `${idx * 150}ms` }}>
                <div className="glass-panel p-10 flex flex-col md:flex-row items-start gap-8 hover:border-primary/40 transition-colors shadow-2xl">
                  <div className="w-20 h-20 bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-accent transition-all duration-500">
                    {f.icon}
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-heading text-4xl font-bold text-white uppercase tracking-tighter italic">{f.title}</h3>
                      <span className="text-primary font-mono text-xl opacity-20">0{idx + 1}</span>
                    </div>
                    <p className="text-white/50 text-xl leading-relaxed max-w-xl">{f.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Showcase */}
      <section id="gallery" ref={galleryReveal.ref} className="py-32 px-6 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <h2 className="font-heading text-6xl font-black text-white uppercase leading-none">Culinary <br/> Showcase</h2>
            <p className="text-white/40 max-w-xs text-xl font-light">A glimpse into our restaurant and bakery craft.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {IMAGES.gallery.map((img, i) => (
              <div key={i} className={`group relative h-[500px] overflow-hidden transition-all duration-700 ${galleryReveal.isVisible ? 'opacity-100 blur-0 translate-y-0' : 'opacity-0 blur-sm translate-y-12'}`} style={{ transitionDelay: `${i * 100}ms` }}>
                <SafeImage src={img} alt="Dish" fill className="object-cover group-hover:scale-110 transition-transform duration-1000 grayscale group-hover:grayscale-0" />
                <div className="absolute inset-0 bg-gradient-to-t from-accent to-transparent opacity-60" />
                <div className="absolute bottom-6 left-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <span className="bg-primary text-accent px-4 py-1 text-xs font-black uppercase tracking-widest italic">Signature Item</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products - P-EDITORIAL */}
      <section id="products" ref={productsReveal.ref} className="py-32 px-6 bg-accent">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="font-heading text-7xl md:text-[10rem] font-black text-white leading-none uppercase italic opacity-10 absolute left-0 right-0 pointer-events-none select-none">Signature</h2>
            <h2 className="font-heading text-6xl font-black text-white relative z-10 uppercase tracking-tighter">Our Signature Bowls</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { name: "Seafood Okro Bowl", price: "₦35,000", desc: "Rich, luxury seafood okro loaded with prawns, crab, and fresh catch.", img: IMAGES.products[0] },
              { name: "The Executive Lunch Pack", price: "₦8,500", desc: "A balanced gourmet meal featuring signature jollof and grilled proteins.", img: IMAGES.products[1] },
              { name: "Bulk Celebration Platter", price: "₦120,000", desc: "Premium bulk catering for events and corporate gatherings.", img: IMAGES.products[2] },
              { name: "Artisan Bakery Basket", price: "₦15,000", desc: "Freshly baked luxury pastries and breads from our bakery wing.", img: IMAGES.products[3] }
            ].map((p, i) => (
              <div key={i} className={`group relative h-[500px] overflow-hidden rounded-none transition-all duration-700 ${productsReveal.isVisible ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`} style={{ transitionDelay: `${i * 150}ms` }}>
                <SafeImage src={p.img} alt={p.name} fill className="object-cover group-hover:scale-110 transition-transform duration-1000 opacity-60 group-hover:opacity-100" />
                <div className="absolute inset-0 bg-black/50 group-hover:bg-black/20 transition-all duration-500" />
                <div className="absolute inset-0 p-12 flex flex-col justify-end">
                  <div className="border-l-4 border-primary pl-6 transform translate-y-12 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="text-4xl md:text-5xl font-heading font-black text-white uppercase italic">{p.name}</h3>
                    <p className="text-white/60 mt-4 text-lg line-clamp-2 transition-opacity duration-500 opacity-0 group-hover:opacity-100">{p.desc}</p>
                    <div className="flex justify-between items-end mt-8">
                      <span className="text-primary font-heading text-4xl font-black tracking-tighter">{p.price}</span>
                      <a href="#contact" className="bg-white text-accent px-8 py-3 font-black uppercase text-sm hover:bg-primary transition-colors">Select</a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About - Split Horizontal */}
      <section id="about" ref={aboutReveal.ref} className="py-32 px-6 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center">
          <div className={`transition-all duration-1000 ${aboutReveal.isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'}`}>
            <h2 className="font-heading text-7xl font-black text-accent leading-none uppercase mb-10 tracking-tighter">Meet <br/>Chef C.P</h2>
            <p className="text-accent/70 text-xl leading-relaxed mb-8">
              De'rich Kitchen was founded on the principle that food should be an experience, not just a meal. Led by the creative vision of Chef C.P, we bridge the gap between home-cooked comfort and luxury restaurant elegance.
            </p>
            <p className="text-accent/50 text-lg leading-relaxed mb-12 italic border-l-4 border-primary pl-6">
              "Sharp delivery, nationwide. Based in the heart of Lagos, we specialize in bulk orders that never compromise on quality."
            </p>
            <div className="grid grid-cols-2 gap-10">
              <div>
                <Instagram size={30} className="text-primary mb-4" />
                <p className="font-heading text-2xl font-bold text-accent">@de_rich_kitchen</p>
                <p className="text-accent/40 text-xs uppercase font-bold tracking-widest mt-1">Join Our Community</p>
              </div>
              <div>
                <MapPin size={30} className="text-primary mb-4" />
                <p className="font-heading text-2xl font-bold text-accent">Lagos Hubs</p>
                <p className="text-accent/40 text-xs uppercase font-bold tracking-widest mt-1">Gbagada & Surulere</p>
              </div>
            </div>
          </div>
          <div className={`relative h-[700px] transition-all duration-1000 delay-300 ${aboutReveal.isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'}`}>
            <div className="absolute inset-0 bg-primary/20 -translate-x-6 translate-y-6" />
            <SafeImage src={IMAGES.hero} alt="Chef CP" fill className="object-cover relative z-10" />
            <div className="absolute -bottom-10 -right-10 bg-primary p-12 z-20 hidden md:block">
              <span className="text-accent font-heading text-8xl font-black leading-none">10</span>
              <p className="text-accent font-bold uppercase tracking-widest text-sm mt-2">Years of Excellence</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials - T-SLIDER */}
      <section ref={testimonialsReveal.ref} className="py-32 bg-accent overflow-hidden border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 mb-20 text-center">
          <h2 className="font-heading text-6xl font-black text-white uppercase tracking-tighter">Client Stories</h2>
        </div>
        <div className="w-full overflow-hidden">
          <div className="flex w-[200%] gap-8 animate-slide-left hover:[animation-play-state:paused]">
            {[
              { name: "Chidi Okoro", text: "The seafood okro from De'rich is in a class of its own. Truly luxury.", role: "Corporate Client" },
              { name: "Amina Bello", text: "Chef C.P handled our wedding catering perfectly. Everyone is still talking about the jollof!", role: "Event Planner" },
              { name: "Tunde Adeyemi", text: "The best lunch pack delivery in Surulere. Consistent and premium.", role: "Business Executive" }
            ].concat([
              { name: "Chidi Okoro", text: "The seafood okro from De'rich is in a class of its own. Truly luxury.", role: "Corporate Client" },
              { name: "Amina Bello", text: "Chef C.P handled our wedding catering perfectly. Everyone is still talking about the jollof!", role: "Event Planner" },
              { name: "Tunde Adeyemi", text: "The best lunch pack delivery in Surulere. Consistent and premium.", role: "Business Executive" }
            ]).map((t, i) => (
              <div key={i} className="w-[450px] shrink-0 glass-panel p-12 relative group">
                <div className="flex gap-1 mb-8">
                  {[1,2,3,4,5].map(n => <div key={n} className="w-3 h-3 bg-primary" />)}
                </div>
                <p className="text-white text-2xl leading-relaxed italic mb-10 font-light">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-4 pt-8 border-t border-white/10">
                  <div className="w-14 h-14 bg-primary flex items-center justify-center font-heading font-black text-2xl text-accent">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-heading font-bold text-white text-xl tracking-tighter">{t.name}</p>
                    <p className="text-primary text-xs uppercase font-bold tracking-[0.2em]">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact - C1 */}
      <section id="contact" ref={contactReveal.ref} className="py-32 px-6 bg-accent relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 -skew-x-12 pointer-events-none" />
        <div className="max-w-7xl mx-auto grid md:grid-cols-[1fr_1.4fr] gap-20 items-start relative z-10">
          <div className={`transition-all duration-1000 ${contactReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            <h2 className="font-heading text-7xl font-black text-white leading-none uppercase italic mb-8 tracking-tighter">Get a <br/><span className="text-primary">Taste.</span></h2>
            <p className="text-white/40 text-xl leading-relaxed mb-12 max-w-sm">
              We operate exclusively from our high-end Lagos kitchens to ensure maximum freshness for your orders.
            </p>
            <div className="space-y-8">
              <div className="flex items-center gap-6 group cursor-pointer">
                <div className="w-14 h-14 bg-white/5 border border-white/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-accent transition-all duration-500">
                  <Instagram size={24} />
                </div>
                <div>
                  <p className="text-white font-bold text-xl">{brief.contact.instagram}</p>
                  <p className="text-white/30 text-xs uppercase tracking-widest mt-1">Follow Our Daily Specials</p>
                </div>
              </div>
              <div className="flex items-center gap-6 group cursor-pointer">
                <div className="w-14 h-14 bg-white/5 border border-white/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-accent transition-all duration-500">
                  <MapPin size={24} />
                </div>
                <div>
                  <p className="text-white font-bold text-xl">{brief.contact.address}</p>
                  <p className="text-white/30 text-xs uppercase tracking-widest mt-1">Our Operating Hubs</p>
                </div>
              </div>
            </div>
          </div>
          <div className={`transition-all duration-1000 delay-300 ${contactReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            <ContactForm />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-accent border-t border-white/10 py-20 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start mb-6">
              <div className="w-8 h-8 bg-primary rounded-none rotate-45 flex items-center justify-center">
                <span className="text-accent font-black text-sm -rotate-45">D</span>
              </div>
              <span className="font-heading text-3xl font-black text-white uppercase tracking-tighter tracking-tighter italic">De'rich Kitchen</span>
            </div>
            <p className="text-white/30 text-sm max-w-xs uppercase font-bold tracking-widest leading-loose">
              Luxury gourmet catering based in the heart of Lagos. Curated by Chef C.P.
            </p>
          </div>
          
          <div className="flex gap-12">
            <div>
              <p className="text-primary text-xs uppercase font-black tracking-[0.3em] mb-6">Explore</p>
              <ul className="space-y-3">
                {['Home', 'Menu', 'About', 'Contact'].map(l => (
                  <li key={l}><a href={`#${l.toLowerCase()}`} className="text-white/50 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest">{l}</a></li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-white/20 text-xs uppercase font-bold tracking-[0.3em]">
            &copy; {new Date().getFullYear()} De'rich Kitchen. All Rights Reserved.
          </p>
          <div className="flex gap-6">
             <Instagram size={18} className="text-white/20 hover:text-primary transition-colors cursor-pointer" />
          </div>
        </div>
      </footer>
    </main>
  );
}