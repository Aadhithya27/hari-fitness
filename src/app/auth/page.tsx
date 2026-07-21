"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useFitness } from "@/context/FitnessContext";
import { Dumbbell, Mail, ShieldCheck } from "lucide-react";

export default function AuthPage() {
  const router = useRouter();
  const { login } = useFitness();
  
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError("");

    // Simulate database lookup delay
    setTimeout(() => {
      const success = login(email);
      setLoading(false);
      
      if (success) {
        if (email.toLowerCase() === "harifitness2026@gmail.com") {
          router.push("/dashboard/trainer");
        } else {
          router.push("/dashboard/client");
        }
      } else {
        setError("Access connection failed. Please ensure your email is registered.");
      }
    }, 1500);
  };



  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[90vh] px-4 py-12 relative overflow-hidden">
      {/* Exit Button */}
      <Link 
        href="/" 
        className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 rounded-xl border border-white/5 hover:border-brand-accent/30 bg-white/5 hover:bg-brand-accent/5 text-brand-muted hover:text-white font-space text-xs font-semibold tracking-wider uppercase transition-all duration-300 cursor-pointer"
      >
        <span>← Exit Home</span>
      </Link>

      {/* Glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-brand-accent/5 blur-[80px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand logo */}
        <div className="flex flex-col items-center gap-2 mb-8 text-center">
          <Link href="/" className="flex items-center gap-2 group mb-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-black border border-brand-accent/50 shadow-[0_0_20px_rgba(255,30,30,0.3)] hover:shadow-[0_0_30px_rgba(255,30,30,0.6)] hover:border-brand-accent transition-all duration-300">
              <Dumbbell className="w-6 h-6 text-brand-glow drop-shadow-[0_0_8px_#FF1E1E] transition-transform group-hover:rotate-45 duration-300" />
            </div>
          </Link>
          <h1 className="font-space font-extrabold text-2xl uppercase tracking-wider text-white">
            Access <span className="text-brand-accent">HARI FITNESS</span> OS
          </h1>
          <p className="font-inter text-brand-muted text-xs">
            Authenticate to sync your training, nutrition, and diagnostics.
          </p>
        </div>

        {/* Auth Box */}
        <div className="glass-panel p-8 rounded-3xl border border-brand-accent/20">
          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            {error && (
              <div className="bg-brand-danger/10 border border-brand-danger/30 text-brand-danger text-xs p-3 rounded-lg text-center font-space">
                {error}
              </div>
            )}

            {/* Email field */}
            <div className="flex flex-col gap-1.5">
              <label className="font-space text-[10px] tracking-wider uppercase text-brand-muted">Secure Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  disabled={loading}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  suppressHydrationWarning
                  className="w-full bg-black border border-white/10 focus:border-brand-accent text-white pl-10 pr-4 py-3.5 rounded-xl outline-none text-sm transition-all font-inter"
                  placeholder="Enter your registered email address"
                />
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
              </div>
            </div>



            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              suppressHydrationWarning
              className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-brand-accent hover:bg-brand-accent-sec text-white font-space font-semibold tracking-wider uppercase transition-all duration-300 shadow-[0_0_20px_rgba(255,30,30,0.15)] disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5" />
                  <span>Initialize Connection</span>
                </>
              )}
            </button>
          </form>


        </div>


      </div>
    </div>
  );
}
