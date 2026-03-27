"use client";
import React from 'react';
import { 
  LucideIcon, ArrowRight, ChevronLeft, 
  ShieldCheck, AlertCircle 
} from "lucide-react";
import { motion } from "framer-motion";
import Link from 'next/link';

// --- 1. UNIVERSAL INPUT ---
export const UniversalInput = ({ label, type = "text", placeholder, value, onChange, Icon }: any) => (
  <div className="space-y-2 text-left">
    <label className="text-[11px] font-black uppercase text-slate-400 tracking-[0.15em] ml-1">{label}</label>
    <div className="relative group">
      {Icon && <Icon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#1e3a5f] transition-colors" size={20} />}
      <input 
        type={type} placeholder={placeholder} value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-200 rounded-[1.5rem] outline-none focus:ring-4 focus:ring-blue-900/5 focus:border-[#1e3a5f] transition-all font-bold text-[#1e3a5f] placeholder:text-slate-300"
      />
    </div>
  </div>
);

// --- 2. PRIMARY BUTTON ---
export const PrimaryButton = ({ text, onClick, type = "submit" }: any) => (
  <motion.button 
    type={type} whileHover={{ scale: 1.02, backgroundColor: "#162d4a" }} whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className="w-full bg-[#1e3a5f] text-white py-5 rounded-[1.5rem] font-black text-lg flex items-center justify-center gap-3 shadow-2xl shadow-blue-900/20 transition-all mt-8"
  >
    {text} <ArrowRight size={22} strokeWidth={3} />
  </motion.button>
);


// --- 4. FEATURE CARD ---
export const FeatureCard = ({ title, desc, Icon }: any) => (
  <motion.div whileHover={{ y: -10 }} className="p-10 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-blue-900/5 text-center flex flex-col items-center h-full">
    <div className="w-16 h-16 bg-blue-50 text-[#FDB813] rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-blue-100/50">
      <Icon size={32} strokeWidth={2.5} />
    </div>
    <h3 className="text-xl font-black text-[#1e3a5f] mb-4 tracking-tight leading-tight">{title}</h3>
    <p className="text-slate-500 font-bold leading-relaxed text-[13px]">{desc}</p>
  </motion.div>
);

// --- 5. SMALL FEATURE ---
export const SmallFeature = ({ Icon, title, desc }: any) => (
  <div className="p-8 border-2 border-blue-100 rounded-[2rem] hover:shadow-2xl hover:border-[#1e3a5f] transition-all bg-white flex flex-col items-center text-center group h-full">
    <div className="w-14 h-14 bg-slate-50 text-[#1e3a5f] rounded-full flex items-center justify-center mb-6 group-hover:bg-[#1e3a5f] group-hover:text-[#FDB813] transition-all border border-blue-50 shadow-sm">
      <Icon size={28} />
    </div>
    <h4 className="text-[14px] font-black uppercase tracking-tight text-[#1e3a5f] mb-3 leading-tight">{title}</h4>
    <p className="text-[11px] font-bold text-slate-500 leading-relaxed">{desc}</p>
  </div>
);

// --- 6. Logo ---
export const AuthSidebar = ({ title }: { title: string | React.ReactNode }) => (
  <div className="bg-[#1e3a5f]/90 p-12 text-white flex flex-col justify-between relative overflow-hidden h-full">
    <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-blue-400/10 to-transparent pointer-events-none" />
    <div className="relative z-10 text-left">
      <Link href="/" className="flex items-center gap-2 text-white/60 hover:text-[#FDB813] mb-12 text-sm font-bold group">
        <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back
      </Link>
      
      {/* White Card with Logo */}
      <div className="bg-white p-4 inline-block mb-10 rounded-2xl shadow-2xl">
        <img 
          src="/logo.png" 
          alt="Adviso Logo" 
          className="h-16 w-auto object-contain"
          onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/150?text=Logo+Missing'; }}
        />
      </div>
      
      <h1 className="text-5xl font-black tracking-tighter mb-6 leading-[1.1]">
        {title}
      </h1>
    </div>

    <div className="relative z-10 p-5 bg-white/5 rounded-[1.5rem] border border-white/10 backdrop-blur-md flex items-center gap-4 text-left">
      <div className="w-10 h-10 bg-[#FDB813] rounded-xl flex items-center justify-center text-[#1e3a5f] shadow-lg">
        <ShieldCheck size={22} />
      </div>
      <div>
        <p className="text-xs font-black tracking-widest uppercase opacity-60">Security Protocol</p>
        <p className="text-sm font-bold">Official Riphah Access</p>
      </div>
    </div>
  </div>
);

// --- 7. AUTH FOOTER ---
export const AuthFooter = () => (
  <div className="mt-12 flex items-center gap-4 p-5 bg-blue-50/50 rounded-[1.5rem] border border-blue-100/50">
    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm shrink-0">
      <AlertCircle size={18} className="text-blue-600" />
    </div>
    <p className="text-[12px] text-slate-600 font-bold leading-snug text-left">
      Issues logging in? Reach out to your <span className="text-[#1e3a5f]"> Coordinator</span> for support.
    </p>
  </div>
);

// --- 8. LANDING FOOTER ---
export const LandingFooter = () => (
  <footer className="bg-[#1e3a5f] text-white p-16 px-24 border-t-8 border-[#FDB813]">
    <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
      <div className="text-left">
        <img 
          src="/logo.png" 
          alt="Adviso Logo" 
          className="h-14 w-auto mb-6" 
          style={{ filter: 'brightness(0) invert(1)' }} 
        />
        <p className="text-sm font-medium opacity-50 max-w-sm">Riphah International University, Gulberg Green Campus Islamabad</p>
        <div className="flex gap-4 mt-6">
          {['f', 'ig', 'in'].map((social) => (
            <div key={social} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#FDB813] hover:text-[#1e3a5f] transition-all cursor-pointer">
              <span className="font-bold text-xs">{social}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex gap-8 md:justify-end text-[11px] font-black uppercase tracking-[0.2em] opacity-80">
        <span className="cursor-pointer hover:text-[#FDB813]">Home</span>
        <span className="cursor-pointer hover:text-[#FDB813]">Services</span>
        <span className="cursor-pointer hover:text-[#FDB813]">About Us</span>
        <span className="cursor-pointer hover:text-[#FDB813]">Features</span>
      </div>
    </div>
    <div className="mt-16 pt-8 border-t border-white/5 text-center text-[10px] font-bold uppercase tracking-widest opacity-30">
      © 2026 Adviso. Academic Batch Advisor System.
    </div>
  </footer>
);