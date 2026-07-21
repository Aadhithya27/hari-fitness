"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Dumbbell3D } from "@/components/Dumbbell3D";
import { Navbar } from "@/components/Navbar";
import { 
  Flame, 
  Target, 
  LayoutDashboard, 
  MessageSquare, 
  Calendar, 
  TrendingUp, 
  Award, 
  ChevronDown, 
  Send, 
  User, 
  Dumbbell, 
  Apple, 
  Clock, 
  Lock,
  ArrowRight,
  Star,
  Phone,
  Mail,
  ShieldCheck,
  Medal,
  Trophy
} from "lucide-react";
import confetti from "canvas-confetti";
import { savePricingLead, getPricingUnlockState, saveContactMessage } from "@/lib/firebase";
import { useFitness, DurationOption } from "@/context/FitnessContext";
import { getCloudinaryImageUrl } from "@/lib/cloudinary";


// Testimonials Seed
const TESTIMONIALS = [
  {
    name: "Effron Rotchas",
    role: "SaaS Founder",
    text: "Hari completely revamped my lifestyle. Going from a busy 70-hour work week to building 8kg of muscle while staying shredded seemed impossible, but his tracking software and 24/7 accountability made it seamless.",
    rating: 5,
    tag: "Muscle Gain",
    img: "/images/transformations/client-2-after.jpg"
  },
  {
    name: "Karan Johar",
    role: "Software Engineer",
    text: "The interactive client dashboard and workout calendars are incredible. It feels like having Coach Hari in my pocket. Ticking off my sets and seeing my XP grow keeps me addicted to consistency.",
    rating: 5,
    tag: "Transformation",
    img: "/images/transformations/client-1-after.jpg"
  },
  {
    name: "Neha Sharma",
    role: "Corporate Lead",
    text: "I lost 11.2kg of fat and gained absolute strength. The recipes are easy to cook and delicious. Coach Hari doesn't just hand you a plan; he teaches you the discipline to master your life.",
    rating: 5,
    tag: "Fat Loss",
    img: "/images/transformations/client-3-after.jpg"
  }
];

export default function LandingPage() {
  const { standardPrice, premiumPrice, membershipPlans } = useFitness();
  const [durationOption, setDurationOption] = useState<DurationOption>("1month");
  // State for interactive features
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  
  // Before-After State (Trainer)
  const [viewMode, setViewMode] = useState<"before" | "after">("after");

  // Dynamic Image Urls from Cloudinary with local fallback
  const [imageUrls] = useState(() => ({
    trainerBefore: getCloudinaryImageUrl("transformations/trainer-before.jpg", "/images/transformations/trainer-before.jpg"),
    trainerAfter: getCloudinaryImageUrl("transformations/trainer-after.jpg", "/images/transformations/trainer-after.jpg"),
    client1Before: getCloudinaryImageUrl("transformations/client-1-before.jpg", "/images/transformations/client-1-before.jpg"),
    client1After: getCloudinaryImageUrl("transformations/client-1-after.jpg", "/images/transformations/client-1-after.jpg"),
    client2Before: getCloudinaryImageUrl("transformations/client-2-before.jpg", "/images/transformations/client-2-before.jpg"),
    client2After: getCloudinaryImageUrl("transformations/client-2-after.jpg", "/images/transformations/client-2-after.jpg"),
    client3Before: getCloudinaryImageUrl("transformations/client-3-before-new.jpg", "/images/transformations/client-3-before-new.jpg"),
    client3After: getCloudinaryImageUrl("transformations/client-3-after.jpg", "/images/transformations/client-3-after.jpg"),
  }));
  const [dynamicTestimonials] = useState(() =>
    TESTIMONIALS.map((t) => {
      const fileName = t.img.split("/").pop() || "";
      return {
        ...t,
        img: getCloudinaryImageUrl(`transformations/${fileName}`, t.img)
      };
    })
  );

  // State for pricing lead authentication
  const [pricingUnlocked, setPricingUnlocked] = useState(false);
  const [leadForm, setLeadForm] = useState({ name: "", email: "", phone: "" });
  const [leadLoading, setLeadLoading] = useState(false);
  const [leadError, setLeadError] = useState("");

  useEffect(() => {
    // Check if user already unlocked pricing
    if (getPricingUnlockState()) {
      setPricingUnlocked(true);
    }
  }, []);

  const handleUnlockPricing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadForm.name || !leadForm.email || !leadForm.phone) {
      setLeadError("Please fill out all fields.");
      return;
    }
    setLeadLoading(true);
    setLeadError("");
    try {
      const success = await savePricingLead(leadForm);
      if (success) {
        setPricingUnlocked(true);
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.7 },
          colors: ["#FF1E1E", "#FF3B3B", "#ffffff"]
        });
      } else {
        setLeadError("Database connection failed. Please try again.");
      }
    } catch (err) {
      setLeadError("An unexpected error occurred. Please try again.");
      console.error(err);
    } finally {
      setLeadLoading(false);
    }
  };

  // State for contact form
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [contactLoading, setContactLoading] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);
  const [contactError, setContactError] = useState("");

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      setContactError("Please fill out all fields.");
      return;
    }
    setContactLoading(true);
    setContactError("");
    setContactSuccess(false);
    try {
      const success = await saveContactMessage(contactForm);
      if (success) {
        setContactSuccess(true);
        setContactForm({ name: "", email: "", message: "" });
      } else {
        setContactError("Failed to deliver message. Please try again.");
      }
    } catch (err) {
      setContactError("An unexpected error occurred. Please try again.");
      console.error(err);
    } finally {
      setContactLoading(false);
    }
  };



  const toggleFaq = (index: number) => {
    setFaqOpen(faqOpen === index ? null : index);
  };

  return (
    <div className="flex-1 flex flex-col relative">
      <Navbar />
      <main id="main-content" className="flex-1 flex flex-col">
        {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-8 pb-16 overflow-hidden">
        {/* 3D Dumbbell canvas background wrapper */}
        <div className="absolute inset-0 z-0 opacity-80 pointer-events-none">
          <Dumbbell3D />
        </div>

        <div className="max-w-7xl mx-auto w-full px-4 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pointer-events-none">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 flex flex-col items-start text-left pointer-events-auto">
            {/* Tagline */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-accent/10 border border-brand-accent/30 mb-6 animate-pulse">
              <Flame className="w-4 h-4 text-brand-accent" />
              <span className="font-space font-medium text-xs tracking-wider uppercase text-brand-glow">
                Futuristic Personal Training SaaS
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-space font-extrabold text-4xl sm:text-5xl lg:text-7xl leading-tight tracking-tight uppercase mb-6 text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
              Transform Your Body. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-accent via-brand-glow to-brand-accent-sec">
                Master Your Discipline.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="font-inter text-brand-muted text-base sm:text-lg max-w-xl mb-10 leading-relaxed">
              Train smarter, eat better, track everything, and achieve your best physique. Interact with Coach Hari and unlock real-time dashboard analytics with integrated client dashboard logs.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
              <Link
                href="/#consultation-pricing-auth"
                className="flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-brand-accent hover:bg-brand-accent-sec text-white font-space font-semibold tracking-wider uppercase transition-all duration-300 shadow-[0_0_30px_rgba(255,30,30,0.4)] hover:shadow-[0_0_40px_rgba(255,30,30,0.6)] border border-brand-accent"
              >
                <span>Start Transformation</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/auth"
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-white/10 hover:border-brand-accent/50 bg-white/5 hover:bg-brand-accent/5 text-white font-space font-semibold tracking-wider uppercase transition-all duration-300"
              >
                <span>Sign In</span>
              </Link>
            </div>

            {/* Floating HUD Statistics (Client side interactive details) */}
            <div className="grid grid-cols-3 gap-6 mt-16 border-t border-white/5 pt-8 w-full max-w-lg">
              <div>
                <div className="font-orbitron font-extrabold text-2xl sm:text-3xl text-brand-glow">98.4%</div>
                <div className="font-space text-[10px] sm:text-xs tracking-wider uppercase text-brand-muted mt-1">Success Rate</div>
              </div>
              <div className="border-x border-white/5 px-4">
                <div className="font-orbitron font-extrabold text-2xl sm:text-3xl text-white">8+ Years</div>
                <div className="font-space text-[10px] sm:text-xs tracking-wider uppercase text-brand-muted mt-1">Experienced Trainer</div>
              </div>
              <div className="pl-4">
                <div className="font-orbitron font-extrabold text-2xl sm:text-3xl text-brand-glow">100%</div>
                <div className="font-space text-[10px] sm:text-xs tracking-wider uppercase text-brand-muted mt-1">Personalized</div>
              </div>
            </div>
          </div>

          {/* Hero Right space is reserved for dumbbell interactive visibility */}
          <div className="lg:col-span-5 h-[250px] lg:h-[450px]" />
        </div>
      </section>

      {/* Why Choose Us */}
      <section id="why-choose-us" className="py-24 border-y border-white/5 relative bg-brand-sec-bg/50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-space font-bold text-3xl sm:text-5xl uppercase tracking-tight text-white mb-4">
              Why Choose <span className="text-brand-accent">Hari Fitness</span>
            </h2>
            <p className="font-inter text-brand-muted text-sm sm:text-base">
              A premium coaching SaaS designed to replace messy sheets, messages, and pdfs with a unified system.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="glass-panel p-8 rounded-2xl flex flex-col items-start gap-4">
              <div className="p-3 bg-brand-accent/10 border border-brand-accent/20 rounded-xl">
                <Target className="w-6 h-6 text-brand-accent" />
              </div>
              <h3 className="font-space font-bold text-xl uppercase tracking-wider text-white">
                Personal Coaching
              </h3>
              <p className="font-inter text-brand-muted text-sm leading-relaxed">
                Direct 1-on-1 attention from Coach Hari. Structured workouts tailored to your specific biomechanics, history, and physical goals.
              </p>
            </div>

            {/* Card 2 */}
            <div className="glass-panel p-8 rounded-2xl flex flex-col items-start gap-4">
              <div className="p-3 bg-brand-accent/10 border border-brand-accent/20 rounded-xl">
                <LayoutDashboard className="w-6 h-6 text-brand-accent" />
              </div>
              <h3 className="font-space font-bold text-xl uppercase tracking-wider text-white">
                Client Dashboard
              </h3>
              <p className="font-inter text-brand-muted text-sm leading-relaxed">
                Access your training calendar, monitor diet macros, track active workouts, and view detailed progress history in a gamified premium interface.
              </p>
            </div>

            {/* Card 3 */}
            <div className="glass-panel p-8 rounded-2xl flex flex-col items-start gap-4">
              <div className="p-3 bg-brand-accent/10 border border-brand-accent/20 rounded-xl">
                <Apple className="w-6 h-6 text-brand-accent" />
              </div>
              <h3 className="font-space font-bold text-xl uppercase tracking-wider text-white">
                Nutrition Guidance
              </h3>
              <p className="font-inter text-brand-muted text-sm leading-relaxed">
                Log breakfast, lunch, and dinner. Track protein, carbs, fats, and hydration targets. Recalculated daily to speed up fat loss.
              </p>
            </div>

            {/* Card 4 */}
            <div className="glass-panel p-8 rounded-2xl flex flex-col items-start gap-4">
              <div className="p-3 bg-brand-accent/10 border border-brand-accent/20 rounded-xl">
                <TrendingUp className="w-6 h-6 text-brand-accent" />
              </div>
              <h3 className="font-space font-bold text-xl uppercase tracking-wider text-white">
                Progress Monitoring
              </h3>
              <p className="font-inter text-brand-muted text-sm leading-relaxed">
                Monitor muscle hypertrophy with exact body measurements and responsive chart visualizations showing trends over months.
              </p>
            </div>

            {/* Card 5 */}
            <div className="glass-panel p-8 rounded-2xl flex flex-col items-start gap-4">
              <div className="p-3 bg-brand-accent/10 border border-brand-accent/20 rounded-xl">
                <MessageSquare className="w-6 h-6 text-brand-accent" />
              </div>
              <h3 className="font-space font-bold text-xl uppercase tracking-wider text-white">
                Real-Time Messaging
              </h3>
              <p className="font-inter text-brand-muted text-sm leading-relaxed">
                Upload PDFs, share image check-ins, or voice memos directly inside our secure client-trainer messaging workspace.
              </p>
            </div>

            {/* Card 6 */}
            <div className="glass-panel p-8 rounded-2xl flex flex-col items-start gap-4">
              <div className="p-3 bg-brand-accent/10 border border-brand-accent/20 rounded-xl">
                <Award className="w-6 h-6 text-brand-accent" />
              </div>
              <h3 className="font-space font-bold text-xl uppercase tracking-wider text-white">
                Gamified streaks
              </h3>
              <p className="font-inter text-brand-muted text-sm leading-relaxed">
                Accumulate XP by completing meals, finishing workouts, and logging hydration. Unlock badges and level up your discipline.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trainer Transformation toggle */}
      <section id="transformations" className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="font-space text-brand-accent text-xs font-semibold uppercase tracking-widest mb-2">Proving Ground</div>
            <h2 className="font-space font-bold text-3xl sm:text-5xl uppercase tracking-tight text-white mb-4">
              Coach Hari's own Transformation
            </h2>
            <p className="font-inter text-brand-muted text-sm sm:text-base">
              Discipline is practiced, not preached. Click the buttons to view Coach Hari's physical journey.
            </p>
          </div>

          {/* Toggle buttons */}
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => setViewMode("before")}
              suppressHydrationWarning
              className={`px-6 py-2.5 rounded-xl font-space text-xs font-bold uppercase tracking-wider transition-all border cursor-pointer ${
                viewMode === "before"
                  ? "bg-brand-accent border-brand-accent text-white shadow-[0_0_15px_rgba(255,30,30,0.4)]"
                  : "bg-white/5 border-white/10 hover:border-white/30 text-brand-muted hover:text-white"
              }`}
            >
              Before
            </button>
            <button
              onClick={() => setViewMode("after")}
              suppressHydrationWarning
              className={`px-6 py-2.5 rounded-xl font-space text-xs font-bold uppercase tracking-wider transition-all border cursor-pointer ${
                viewMode === "after"
                  ? "bg-brand-accent border-brand-accent text-white shadow-[0_0_15px_rgba(255,30,30,0.4)]"
                  : "bg-white/5 border-white/10 hover:border-white/30 text-brand-muted hover:text-white"
              }`}
            >
              After
            </button>
          </div>

          {/* Image display container */}
          <div className="max-w-xl mx-auto relative rounded-2xl overflow-hidden border border-brand-accent/25 shadow-[0_0_50px_rgba(255,30,30,0.15)] bg-[#111] aspect-[9/16] w-full">
            {/* Before image */}
            <div className={`absolute inset-0 transition-opacity duration-500 ${viewMode === "before" ? "opacity-100 z-10" : "opacity-0 z-0"}`}>
              <Image 
                src={imageUrls.trainerBefore} 
                alt="Coach Hari Before" 
                fill 
                className="object-cover" 
                priority
              />
              <span className="absolute bottom-4 left-4 bg-[#222] border border-white/10 px-3 py-1.5 rounded font-space text-xs font-bold uppercase tracking-wider text-white">BEFORE</span>
            </div>

            {/* After image */}
            <div className={`absolute inset-0 transition-opacity duration-500 ${viewMode === "after" ? "opacity-100 z-10" : "opacity-0 z-0"}`}>
              <Image 
                src={imageUrls.trainerAfter} 
                alt="Coach Hari After" 
                fill 
                className="object-cover" 
                priority
              />
              <span className="absolute bottom-4 right-4 bg-brand-accent px-3 py-1.5 rounded font-space text-xs font-bold uppercase tracking-wider text-white">AFTER</span>
            </div>
          </div>
        </div>
      </section>

      {/* Client Transformations Gallery */}
      <section className="py-20 border-t border-white/5 relative bg-brand-sec-bg/25">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-space font-bold text-3xl sm:text-5xl uppercase tracking-tight text-white mb-4">
              Client Transformations
            </h2>
            <p className="font-inter text-brand-muted text-sm sm:text-base">
              Real results from serious clients who committed to the discipline.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">

            {/* Client Card 2 (Effron Rotchas) */}
            <div className="glass-panel p-4 rounded-2xl flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-2 relative aspect-[4/5] rounded-xl overflow-hidden border border-white/5">
                <div className="relative h-full w-full bg-black">
                  <Image src={imageUrls.client2Before} alt="Effron Rotchas Before" fill className="object-cover" />
                  <span className="absolute bottom-2 left-2 bg-[#222] text-white text-[10px] font-bold px-2 py-0.5 rounded">BEFORE</span>
                </div>
                <div className="relative h-full w-full bg-black">
                  <Image src={imageUrls.client2After} alt="Effron Rotchas After" fill className="object-cover" />
                  <span className="absolute bottom-2 left-2 bg-brand-accent text-white text-[10px] font-bold px-2 py-0.5 rounded">AFTER</span>
                </div>
              </div>
              <div className="px-2">
                <h3 className="font-space font-bold text-lg uppercase text-white">Effron Rotchas</h3>
                <p className="font-inter text-brand-muted text-xs mb-2">22 Yrs • Bulk Program</p>
                <div className="flex gap-4 border-t border-white/5 pt-2 text-xs">
                  <div>
                    <span className="text-brand-muted">Timeline:</span> <span className="font-semibold text-white">8 Months</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Client Card 3 (Harshith) */}
            <div className="glass-panel p-4 rounded-2xl flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-2 relative aspect-[4/5] rounded-xl overflow-hidden border border-white/5">
                <div className="relative h-full w-full bg-black">
                  <Image src={imageUrls.client3Before} alt="Harshith Before" fill className="object-cover" />
                  <span className="absolute bottom-2 left-2 bg-[#222] text-white text-[10px] font-bold px-2 py-0.5 rounded">BEFORE</span>
                </div>
                <div className="relative h-full w-full bg-black">
                  <Image src={imageUrls.client3After} alt="Harshith After" fill className="object-cover" />
                  <span className="absolute bottom-2 left-2 bg-brand-accent text-white text-[10px] font-bold px-2 py-0.5 rounded">AFTER</span>
                </div>
              </div>
              <div className="px-2">
                <h3 className="font-space font-bold text-lg uppercase text-white">Harshith</h3>
                <p className="font-inter text-brand-muted text-xs mb-2">29 Yrs • Fat Loss Program</p>
                <div className="flex gap-4 border-t border-white/5 pt-2 text-xs">
                  <div>
                    <span className="text-brand-muted">Timeline:</span> <span className="font-semibold text-white">1 Year</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories Testimonials */}
      <section className="py-24 relative overflow-hidden bg-brand-sec-bg/50 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-space font-bold text-3xl sm:text-5xl uppercase tracking-tight text-white mb-4">
              Client Testimonials
            </h2>
            <p className="font-inter text-brand-muted text-sm sm:text-base">
              Listen to the stories of our transformed athletes.
            </p>
          </div>

          <div className="max-w-3xl mx-auto relative glass-panel p-8 sm:p-12 rounded-3xl border border-brand-accent/20">
            <div className="flex items-center gap-1 mb-6">
              {[...Array(TESTIMONIALS[activeTestimonial].rating)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-brand-accent text-brand-accent" />
              ))}
            </div>

            <blockquote className="font-space text-lg sm:text-xl text-white italic leading-relaxed mb-8">
              "{dynamicTestimonials[activeTestimonial].text}"
            </blockquote>

            <div className="flex items-center justify-between border-t border-white/5 pt-6">
              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border border-brand-accent/40 bg-black">
                  <Image 
                    src={dynamicTestimonials[activeTestimonial].img} 
                    alt={dynamicTestimonials[activeTestimonial].name} 
                    fill 
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="font-space font-bold text-white uppercase">{dynamicTestimonials[activeTestimonial].name}</div>
                  <div className="font-inter text-brand-muted text-xs">{dynamicTestimonials[activeTestimonial].role}</div>
                </div>
              </div>

              {/* Navigation Indicators */}
              <div className="flex gap-2">
                {TESTIMONIALS.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTestimonial(index)}
                    suppressHydrationWarning
                    className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-300 ${
                      activeTestimonial === index 
                        ? "bg-brand-accent w-8 shadow-[0_0_10px_rgba(255,30,30,0.6)] animate-pulse" 
                        : "bg-white/10 hover:bg-white/30"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Meet Your Coach */}
      <section id="coach" className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-brand-accent/30 shadow-[0_0_40px_rgba(255,30,30,0.15)] bg-black">
              <Image 
                src={imageUrls.trainerAfter} 
                alt="Coach Hari" 
                fill 
                className="object-cover" 
              />
            </div>
            <div className="absolute -bottom-6 -right-6 glass-panel p-5 rounded-2xl border border-brand-accent/40 hidden sm:block">
              <div className="font-orbitron font-extrabold text-brand-glow text-xl">8+ YEARS</div>
              <div className="font-space text-xs tracking-wider uppercase text-brand-muted">COACHING EXPERIENCE</div>
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col items-start text-left">
            <span className="font-space text-brand-accent font-semibold uppercase tracking-widest text-xs mb-2">Master Trainer</span>
            <h2 className="font-space font-extrabold text-3xl sm:text-5xl uppercase tracking-tight text-white mb-6">
              Meet Coach <span className="text-brand-accent">Hari</span>
            </h2>
            <p className="font-inter text-brand-muted text-sm sm:text-base leading-relaxed mb-6">
              {"Discipline is the bridge between goals and accomplishment. I don't believe in generic workout plans or unsustainable starvation diets. I build customized scientific routines around your unique biology."}
            </p>
            <p className="font-inter text-brand-muted text-sm sm:text-base leading-relaxed mb-8">
              Whether you want to shred down to single-digit body fat, pack on clean muscle mass, or rebuild your core stability post-injury, I will map the coordinates. Your job is just to execute.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-xl mb-8 border-y border-white/5 py-6">
              {/* Gold Medal Achievement */}
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30">
                <div className="p-1.5 rounded-lg bg-amber-500/20 border border-amber-400/50 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.4)] shrink-0">
                  <Trophy className="w-4 h-4" />
                </div>
                <span className="font-space text-xs sm:text-sm tracking-wider uppercase text-amber-200 font-bold">
                  3x State Powerlifting Gold
                </span>
              </div>

              {/* Silver & Bronze Medal Achievement */}
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-400/10 border border-slate-400/30">
                <div className="flex items-center -space-x-1 shrink-0">
                  <div className="p-1 rounded-lg bg-slate-300/20 border border-slate-200/40 text-slate-200 shadow-[0_0_10px_rgba(203,213,225,0.3)] z-10" title="Silver Medal">
                    <Medal className="w-4 h-4 text-slate-200" />
                  </div>
                  <div className="p-1 rounded-lg bg-amber-800/30 border border-amber-700/50 text-amber-500 shadow-[0_0_10px_rgba(180,83,9,0.3)]" title="Bronze Medal">
                    <Medal className="w-4 h-4 text-amber-600" />
                  </div>
                </div>
                <span className="font-space text-xs sm:text-sm tracking-wider uppercase text-slate-200 font-bold">
                  District Powerlifting (1 Silver, 1 Bronze)
                </span>
              </div>

              {/* Muscle Mentors Academy */}
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-brand-accent shrink-0" />
                <span className="font-space text-xs sm:text-sm tracking-wider uppercase text-white font-semibold">Muscle Mentors Academy Certified</span>
              </div>

              {/* Certified Nutritionist */}
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-brand-accent shrink-0" />
                <span className="font-space text-xs sm:text-sm tracking-wider uppercase text-white font-semibold">Certified Nutritionist</span>
              </div>

              {/* Hypertrophy Specialist */}
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-brand-accent shrink-0" />
                <span className="font-space text-xs sm:text-sm tracking-wider uppercase text-white font-semibold">Hypertrophy Specialist</span>
              </div>

              {/* Post-Injury Rehab */}
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-brand-accent shrink-0" />
                <span className="font-space text-xs sm:text-sm tracking-wider uppercase text-white font-semibold">Post-Injury Rehab</span>
              </div>
            </div>

            <Link
              href="/#pricing"
              className="px-8 py-4 rounded-xl bg-brand-accent hover:bg-brand-accent-sec text-white font-space font-semibold tracking-wider uppercase transition-all duration-300 shadow-[0_0_20px_rgba(255,30,30,0.3)] hover:shadow-[0_0_30px_rgba(255,30,30,0.5)] border border-brand-accent"
            >
              Consult Coach Hari
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-brand-sec-bg/50 border-y border-white/5 relative">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="font-space font-bold text-3xl sm:text-5xl uppercase tracking-tight text-white mb-4">
              Advanced <span className="text-brand-accent">SaaS Capabilities</span>
            </h2>
            <p className="font-inter text-brand-muted text-sm sm:text-base">
              A premium OS experience with customized tracking widgets and integrated client dashboard analytics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4">
              <Dumbbell className="w-8 h-8 text-brand-accent" />
              <h4 className="font-space font-bold text-lg uppercase text-white">Workout logs</h4>
              <p className="font-inter text-brand-muted text-xs leading-relaxed">
                Log completed sets, weights, and reps. Play guide videos and manage rest intervals with integrated timers.
              </p>
            </div>
            <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4">
              <Apple className="w-8 h-8 text-brand-accent" />
              <h4 className="font-space font-bold text-lg uppercase text-white">Nutrition tracking</h4>
              <p className="font-inter text-brand-muted text-xs leading-relaxed">
                Log breakfast, lunch, and snack macros. View calories remaining and keep check on water intake target.
              </p>
            </div>
            <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4">
              <Calendar className="w-8 h-8 text-brand-accent" />
              <h4 className="font-space font-bold text-lg uppercase text-white">Active Calendar</h4>
              <p className="font-inter text-brand-muted text-xs leading-relaxed">
                Track appointments, weekly body check-ins, meal times, and hydrate logs with automated indicators.
              </p>
            </div>
            <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4">
              <LayoutDashboard className="w-8 h-8 text-brand-accent" />
              <h4 className="font-space font-bold text-lg uppercase text-white">Interactive Dashboard</h4>
              <p className="font-inter text-brand-muted text-xs leading-relaxed">
                Review biometrics, track daily hydration logs, update body stats, and keep direct contact with Coach Hari.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="font-space text-brand-accent text-xs font-semibold uppercase tracking-widest mb-2">Memberships</span>
            <h2 className="font-space font-bold text-3xl sm:text-5xl uppercase tracking-tight text-white mb-4">
              Transformative Pricing Plans
            </h2>
            <p className="font-inter text-brand-muted text-sm sm:text-base">
              Choose the level of dedication that fits your physical ambition.
            </p>
          </div>

          {pricingUnlocked ? (
            <div className="flex flex-col items-center w-full animate-[fadeIn_0.5s_ease-out_forwards]">
              {/* Verified Consultation Banner */}
              <div className="w-full max-w-xl mx-auto mb-10 p-6 rounded-2xl border border-brand-accent/30 bg-brand-accent/5 backdrop-blur-md flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[100px] h-[100px] rounded-full bg-brand-accent/5 blur-[30px] pointer-events-none" />
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-black border border-brand-accent/30 shadow-[0_0_20px_rgba(255,30,30,0.15)] shrink-0 text-brand-glow">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-space font-bold text-sm uppercase text-white tracking-wide mb-1">
                    Consultation Verified
                  </h4>
                  <p className="font-inter text-brand-muted text-xs leading-relaxed">
                    Pricing plans unlocked. Our coach will be contacting you soon.
                  </p>
                </div>
              </div>

              {/* Duration Selector Tabs: 1 Month | 6 Months | 1 Year */}
              <div className="flex justify-center mb-10 w-full px-2">
                <div className="bg-black/70 p-1.5 rounded-2xl border border-white/10 flex flex-wrap sm:flex-nowrap justify-center gap-2 max-w-xl w-full">
                  <button
                    type="button"
                    onClick={() => setDurationOption("1month")}
                    className={`flex-1 whitespace-nowrap inline-flex items-center justify-center py-2.5 px-4 rounded-xl font-space text-xs font-bold transition-all cursor-pointer ${
                      durationOption === "1month"
                        ? "bg-brand-accent text-white shadow-[0_0_20px_rgba(255,30,30,0.4)]"
                        : "text-brand-muted hover:text-white hover:bg-white/5"
                    }`}
                  >
                    1 Month
                  </button>
                  <button
                    type="button"
                    onClick={() => setDurationOption("6months")}
                    className={`flex-1 whitespace-nowrap inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl font-space text-xs font-bold transition-all cursor-pointer ${
                      durationOption === "6months"
                        ? "bg-brand-accent text-white shadow-[0_0_20px_rgba(255,30,30,0.4)]"
                        : "text-brand-muted hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <span>6 Months</span>
                    <span className="whitespace-nowrap text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                      Save ~15%
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDurationOption("1year")}
                    className={`flex-1 whitespace-nowrap inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl font-space text-xs font-bold transition-all cursor-pointer ${
                      durationOption === "1year"
                        ? "bg-brand-accent text-white shadow-[0_0_20px_rgba(255,30,30,0.4)]"
                        : "text-brand-muted hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <span>1 Year</span>
                    <span className="whitespace-nowrap text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                      Best Value
                    </span>
                  </button>
                </div>
              </div>

              {/* Dynamic Pricing Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch max-w-5xl mx-auto w-full">
                {(membershipPlans || []).map((plan) => {
                  const isPremium = plan.id === "premium";
                  const currentPrice = plan.prices[durationOption] || (isPremium ? premiumPrice : standardPrice);
                  
                  let durationLabel = "/ month";
                  let perMonthNote = "";
                  if (durationOption === "6months") {
                    durationLabel = "/ 6 months";
                    perMonthNote = `(₹${Math.round(currentPrice / 6).toLocaleString("en-IN")}/mo)`;
                  } else if (durationOption === "1year") {
                    durationLabel = "/ 1 year";
                    perMonthNote = `(₹${Math.round(currentPrice / 12).toLocaleString("en-IN")}/mo)`;
                  }

                  return (
                    <div
                      key={plan.id}
                      className={`glass-panel p-8 rounded-3xl flex flex-col justify-between border relative transition-all duration-300 ${
                        isPremium
                          ? "border-brand-accent/50 shadow-[0_0_30px_rgba(255,30,30,0.15)] bg-gradient-to-b from-brand-accent/5 via-black/40 to-transparent"
                          : "border-white/10 bg-black/40"
                      }`}
                    >
                      {plan.badge && (
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-accent text-white px-4 py-1 rounded-full font-space text-[10px] font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(255,30,30,0.5)]">
                          {plan.badge}
                        </div>
                      )}
                      <div>
                        <h3 className="font-space font-bold text-xl uppercase tracking-wider text-white mb-2">
                          {plan.title}
                        </h3>
                        <div className="mb-6">
                          <div className={`font-orbitron font-extrabold text-3xl sm:text-4xl ${isPremium ? "text-brand-glow" : "text-white"}`}>
                            ₹{currentPrice.toLocaleString("en-IN")}{" "}
                            <span className="font-inter text-xs text-brand-muted font-normal">{durationLabel}</span>
                          </div>
                          {perMonthNote && (
                            <div className="font-space text-xs text-emerald-400 font-semibold mt-1">
                              {perMonthNote}
                            </div>
                          )}
                        </div>

                        <ul className="font-inter text-sm flex flex-col gap-3.5 mb-8">
                          {plan.features.map((feat) => (
                            <li
                              key={feat.id}
                              className={`flex items-start gap-3 ${
                                feat.included ? "text-white" : "text-brand-muted/50"
                              }`}
                            >
                              <span className={`text-base font-bold shrink-0 ${feat.included ? "text-emerald-400" : "text-red-500/60"}`}>
                                {feat.included ? "✓" : "✕"}
                              </span>
                              <span className="leading-snug">{feat.text}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="max-w-md mx-auto relative z-10" id="consultation-pricing-auth">
              {/* Unlock details card */}
              <div className="glass-panel p-8 rounded-3xl border border-brand-accent/20 relative overflow-hidden bg-brand-card">
                {/* Visual Glows */}
                <div className="absolute top-0 right-0 w-[150px] h-[150px] rounded-full bg-brand-accent/5 blur-[40px] pointer-events-none" />
                
                <div className="flex flex-col items-center gap-3 mb-8 text-center">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-black border border-brand-accent/30 shadow-[0_0_20px_rgba(255,30,30,0.1)]">
                    <Lock className="w-6 h-6 text-brand-accent animate-[pulse_1.5s_infinite]" />
                  </div>
                  <h3 className="font-space font-extrabold text-xl uppercase tracking-wider text-white">
                    Decrypt Pricing Plans
                  </h3>
                  <p className="font-inter text-brand-muted text-xs max-w-xs">
                    Submit your details to unlock our <span className="text-brand-glow font-semibold">Pricing Plans</span> &amp; book a <span className="text-brand-glow font-semibold">Free Consultation</span> with Coach Hari.
                  </p>
                </div>

                <form onSubmit={handleUnlockPricing} className="flex flex-col gap-5">
                  {leadError && (
                    <div className="bg-brand-danger/10 border border-brand-danger/30 text-brand-danger text-xs p-3 rounded-lg text-center font-space">
                      {leadError}
                    </div>
                  )}

                  {/* Name field */}
                  <div className="flex flex-col gap-1.5">
                    <label className="font-space text-[10px] tracking-wider uppercase text-brand-muted">Full Name</label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        disabled={leadLoading}
                        value={leadForm.name}
                        onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                        suppressHydrationWarning
                        className="w-full bg-black border border-white/10 focus:border-brand-accent text-white pl-10 pr-4 py-3 rounded-xl outline-none text-xs transition-all font-inter"
                        placeholder="John Doe"
                      />
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
                    </div>
                  </div>

                  {/* Email field */}
                  <div className="flex flex-col gap-1.5">
                    <label className="font-space text-[10px] tracking-wider uppercase text-brand-muted">Secure Email</label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        disabled={leadLoading}
                        value={leadForm.email}
                        onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                        suppressHydrationWarning
                        className="w-full bg-black border border-white/10 focus:border-brand-accent text-white pl-10 pr-4 py-3 rounded-xl outline-none text-xs transition-all font-inter"
                        placeholder="john@example.com"
                      />
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
                    </div>
                  </div>

                  {/* Phone field */}
                  <div className="flex flex-col gap-1.5">
                    <label className="font-space text-[10px] tracking-wider uppercase text-brand-muted">Phone Connection</label>
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        disabled={leadLoading}
                        value={leadForm.phone}
                        onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                        suppressHydrationWarning
                        className="w-full bg-black border border-white/10 focus:border-brand-accent text-white pl-10 pr-4 py-3 rounded-xl outline-none text-xs transition-all font-inter"
                        placeholder="+1 (555) 000-0000"
                      />
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={leadLoading}
                    suppressHydrationWarning
                    className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-brand-accent hover:bg-brand-accent-sec text-white font-space font-bold text-xs tracking-wider uppercase transition-all duration-300 shadow-[0_0_20px_rgba(255,30,30,0.15)] disabled:opacity-50 cursor-pointer"
                  >
                    {leadLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Unlock Pricing & Consultation</span>
                      </>
                    )}
                  </button>
                </form>

                {/* HUD Footer Status */}
                <div className="flex justify-between items-center mt-6 pt-4 border-t border-white/5 font-space text-[8px] text-brand-muted uppercase tracking-widest">
                  <span>Protocol: Firebase Firestore</span>
                  <span className="text-brand-glow animate-pulse">Ready</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* FAQ Accordion */}
      <section id="faq" className="py-24 bg-brand-sec-bg/50 border-y border-white/5 relative">
        <div className="max-w-4xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-space font-bold text-3xl sm:text-5xl uppercase tracking-tight text-white mb-4">
              Frequently Asked <span className="text-brand-accent">Questions</span>
            </h2>
          </div>

          <div className="flex flex-col gap-4">
            {[
              {
                q: "What is HARI FITNESS?",
                a: "HARI FITNESS is a premium, futuristic coaching platform where Coach Hari assigns customized workouts, meal routines, and habits to clients. You can log meals, complete exercises, monitor progress weights, and chat directly in one unified web app."
              },
              {
                q: "How does the Client Dashboard work?",
                a: "Inside the Client Dashboard, you have a premium interactive terminal. You can check your weekly workout checklist, monitor active diet macros, log daily water targets, update body stats, and chat with Coach Hari in real time."
              },
              {
                q: "Do I have to purchase separate apps?",
                a: "No. Everything you need (workout checklists, macro counters, before/after photos, chats, calendar) runs under this single web application. Both the coach and clients use this same site."
              },
              {
                q: "Can I cancel my subscription anytime?",
                a: "Yes. All subscriptions can be paused or cancelled from your profile settings on the dashboard without any hidden fees."
              }
            ].map((item, idx) => (
              <div 
                key={idx} 
                className="glass-panel rounded-xl overflow-hidden border border-white/5 transition-all"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  suppressHydrationWarning
                  aria-expanded={faqOpen === idx}
                  aria-controls={`faq-answer-${idx}`}
                  id={`faq-button-${idx}`}
                  className="w-full px-6 py-5 flex items-center justify-between text-left font-space text-base uppercase tracking-wider text-white hover:text-brand-accent transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-accent rounded-xl"
                >
                  <span>{item.q}</span>
                  <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${faqOpen === idx ? "rotate-180 text-brand-accent" : "text-brand-muted"}`} />
                </button>
                {faqOpen === idx && (
                  <div
                    id={`faq-answer-${idx}`}
                    role="region"
                    aria-labelledby={`faq-button-${idx}`}
                    className="px-6 pb-6 pt-2 font-inter text-brand-muted text-sm leading-relaxed border-t border-white/5"
                  >
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
      </main>

      {/* Footer */}
      <footer className="bg-black border-t border-white/5 py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="font-space font-bold tracking-wider uppercase text-white">
              Hari <span className="text-brand-accent">Fitness</span>
            </span>
            <span className="text-brand-muted text-xs" suppressHydrationWarning>• © {new Date().getFullYear()}</span>
          </div>

          <div className="flex gap-6 font-space text-xs tracking-widest text-brand-muted uppercase">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
