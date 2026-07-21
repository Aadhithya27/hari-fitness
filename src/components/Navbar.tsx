"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useFitness } from "@/context/FitnessContext";
import { Dumbbell, Menu, X, LogOut, LayoutDashboard } from "lucide-react";

export const Navbar: React.FC = () => {
  const { currentUser, logout } = useFitness();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getDashboardLink = () => {
    if (!currentUser) return "/auth";
    return currentUser.role === "TRAINER" ? "/dashboard/trainer" : "/dashboard/client";
  };

  return (
    <nav className="sticky top-0 z-50 bg-brand-bg/75 backdrop-blur-md border-b border-white/5 px-4 lg:px-8 py-4 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-black border border-brand-accent/50 group-hover:border-brand-accent transition-all duration-300 shadow-[0_0_15px_rgba(255,30,30,0.3)] group-hover:shadow-[0_0_25px_rgba(255,30,30,0.6)]">
            <Dumbbell className="w-5 h-5 text-brand-glow drop-shadow-[0_0_8px_#FF1E1E] transition-transform group-hover:rotate-45 duration-300" />
            <div className="absolute inset-0 rounded-lg bg-brand-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <span className="font-space font-bold text-xl tracking-wider uppercase text-white group-hover:text-brand-accent transition-colors duration-300">
            Hari <span className="text-brand-accent">Fitness</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8 font-space text-sm tracking-widest text-brand-muted uppercase">
          <Link href="/#why-choose-us" className="hover:text-brand-accent transition-colors duration-200">
            Why Us
          </Link>
          <Link href="/#features" className="hover:text-brand-accent transition-colors duration-200">
            Features
          </Link>
          <Link href="/#transformations" className="hover:text-brand-accent transition-colors duration-200">
            Results
          </Link>
          <Link href="/#coach" className="hover:text-brand-accent transition-colors duration-200">
            The Coach
          </Link>
          <Link href="/#pricing" className="hover:text-brand-accent transition-colors duration-200">
            Pricing
          </Link>
          <Link href="/#faq" className="hover:text-brand-accent transition-colors duration-200">
            FAQ
          </Link>
        </div>

        {/* CTA / Auth Actions */}
        <div className="hidden md:flex items-center gap-4">
          {currentUser ? (
            <>
              <Link
                href={getDashboardLink()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-brand-accent/25 hover:border-brand-accent bg-brand-accent/10 hover:bg-brand-accent/20 text-white font-space text-sm tracking-wider uppercase transition-all duration-300 shadow-[0_0_15px_rgba(255,30,30,0.05)] hover:shadow-[0_0_15px_rgba(255,30,30,0.2)]"
              >
                <LayoutDashboard className="w-4 h-4 text-brand-accent" />
                <span>Dashboard</span>
              </Link>
              <button
                onClick={logout}
                suppressHydrationWarning
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-white/5 hover:border-brand-danger/30 bg-white/5 hover:bg-brand-danger/10 text-brand-muted hover:text-white font-space text-sm tracking-wider uppercase transition-all duration-300 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth"
                className="px-5 py-2.5 rounded-lg text-brand-muted hover:text-white font-space text-sm tracking-wider uppercase transition-colors duration-200"
              >
                Sign In
              </Link>
              <Link
                href="/#consultation-pricing-auth"
                className="px-6 py-2.5 rounded-lg bg-brand-accent hover:bg-brand-accent-sec text-white font-space text-sm tracking-wider uppercase transition-all duration-300 shadow-[0_0_20px_rgba(255,30,30,0.35)] hover:shadow-[0_0_25px_rgba(255,30,30,0.55)] border border-brand-accent"
              >
                Start Transformation
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          suppressHydrationWarning
          className="md:hidden p-2 rounded-lg border border-white/10 hover:border-brand-accent/30 text-white hover:text-brand-accent transition-colors"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed top-[73px] left-0 right-0 bottom-0 bg-brand-bg/95 backdrop-blur-lg border-t border-white/5 px-6 py-8 flex flex-col gap-6 z-40 animate-in fade-in slide-in-from-top-5 duration-300">
          <div className="flex flex-col gap-5 font-space text-lg tracking-widest text-brand-muted uppercase">
            <Link
              href="/#why-choose-us"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-brand-accent py-2 border-b border-white/5"
            >
              Why Us
            </Link>
            <Link
              href="/#features"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-brand-accent py-2 border-b border-white/5"
            >
              Features
            </Link>
            <Link
              href="/#transformations"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-brand-accent py-2 border-b border-white/5"
            >
              Results
            </Link>
            <Link
              href="/#coach"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-brand-accent py-2 border-b border-white/5"
            >
              The Coach
            </Link>
            <Link
              href="/#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-brand-accent py-2 border-b border-white/5"
            >
              Pricing
            </Link>
          </div>

          <div className="mt-auto flex flex-col gap-4">
            {currentUser ? (
              <>
                <Link
                  href={getDashboardLink()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-lg bg-brand-accent/15 border border-brand-accent/40 text-white font-space text-sm tracking-wider uppercase transition-colors"
                >
                  <LayoutDashboard className="w-5 h-5 text-brand-accent" />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  suppressHydrationWarning
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-lg bg-white/5 border border-white/10 text-brand-muted hover:text-white font-space text-sm tracking-wider uppercase transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center w-full py-3.5 rounded-lg bg-white/5 border border-white/10 text-white font-space text-sm tracking-wider uppercase transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/#consultation-pricing-auth"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center w-full py-3.5 rounded-lg bg-brand-accent hover:bg-brand-accent-sec text-white font-space text-sm tracking-wider uppercase shadow-[0_0_20px_rgba(255,30,30,0.3)] border border-brand-accent"
                >
                  Start Transformation
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
export default Navbar;
