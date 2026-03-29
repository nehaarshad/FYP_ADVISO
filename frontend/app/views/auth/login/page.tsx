"use client";

import React, { useState } from 'react';
import { motion } from "framer-motion";
import { useRouter } from 'next/navigation'; 
import Link from 'next/link';
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  ChevronLeft, 
  ShieldCheck, 
  AlertCircle 
} from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  // Animations
  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" }
    })
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
  
    router.push('/views/dashboard/coordinator'); 
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex items-center justify-center p-4 md:p-6 relative overflow-hidden font-sans">
      
      
      <div className="absolute inset-0 z-0">
        <img 
          src="/backgroundLanding.png" 
          alt="Background" 
          className="w-full h-full object-cover opacity-100" 
        />
        
        <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl w-full grid md:grid-cols-2 bg-white/95 rounded-[2.5rem] shadow-[0_40px_100px_-15px_rgba(30,58,95,0.15)] overflow-hidden border border-slate-100 relative z-10"
      >
        {/* --- LEFT SIDE: BRANDING --- */}
        <div className="bg-[#1e3a5f] p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-blue-400/10 to-transparent pointer-events-none" />
          
          <div className="relative z-10">
            <motion.div custom={0} initial="hidden" animate="visible" variants={fadeUp}>
              <Link href="/" className="flex items-center gap-2 text-white/60 hover:text-[#FDB813] mb-12 text-sm font-bold group transition-all">
                <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back
              </Link>
            </motion.div>
          
            <motion.div 
              custom={1} initial="hidden" animate="visible" variants={fadeUp} 
              className="mb-8" 
            >
              <img src="/Lightlogo.png" alt="Adviso Logo" className="w-24 h-24 object-contain" /> 
            </motion.div>
            
            <motion.h1 
              custom={2} initial="hidden" animate="visible" variants={fadeUp}
              className="text-5xl font-black tracking-tighter mb-6 leading-[1.1]"
            >
              Welcome back <br /> 
              to <span className="text-[#FDB813]">ADVISO.</span>
            </motion.h1>
            
            <motion.p 
              custom={3} initial="hidden" animate="visible" variants={fadeUp}
              className="text-white/70 font-medium text-lg max-w-[280px] leading-relaxed"
            >
              
            </motion.p>
          </div>

          <motion.div 
            custom={4} initial="hidden" animate="visible" variants={fadeUp}
            className="relative z-10 p-5 bg-white/5 rounded-[1.5rem] border border-white/10 backdrop-blur-md flex items-center gap-4 shadow-inner"
          >
              <div className="w-10 h-10 bg-[#FDB813] rounded-xl flex items-center justify-center text-[#1e3a5f] shadow-lg">
                <ShieldCheck size={22} />
              </div>
              <div>
                <p className="text-xs font-black tracking-widest uppercase opacity-60">Security Protocol</p>
                <p className="text-sm font-bold">Official Riphah Access</p>
              </div>
          </motion.div>
        </div>

        {/* --- RIGHT SIDE: FORM --- */}
        <div className="p-10 md:p-16 flex flex-col justify-center bg-white/95 relative">
          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ delay: 0.4 }}
          >
            <div className="mb-10">
                <h2 className="text-4xl font-black text-[#1e3a5f] mb-2 tracking-tight uppercase italic">Login</h2>
                <div className="h-1.5 w-12 bg-[#FDB813] rounded-full"></div>
            </div>
            
            <form className="space-y-5" onSubmit={handleLogin}>
              {/* SAP ID Field */}
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase text-slate-400 tracking-[0.15em] ml-1">SAP ID / Email</label>
                <div className="relative group">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#1e3a5f] transition-colors" size={20} />
                  <input 
                    type="text" 
                    placeholder="e.g. 49100"
                    className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-200 rounded-[1.5rem] outline-none focus:ring-4 focus:ring-blue-900/5 focus:border-[#1e3a5f] transition-all font-bold text-[#1e3a5f] placeholder:text-slate-300"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase text-slate-400 tracking-[0.15em] ml-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#1e3a5f] transition-colors" size={20} />
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-200 rounded-[1.5rem] outline-none focus:ring-4 focus:ring-blue-900/5 focus:border-[#1e3a5f] transition-all font-bold text-[#1e3a5f] placeholder:text-slate-300"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              {/* Sign In Button */}
              <motion.button 
                whileHover={{ scale: 1.02, backgroundColor: "#162d4a" }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-[#1e3a5f] text-white py-5 rounded-[1.5rem] font-black text-lg flex items-center justify-center gap-3 shadow-2xl shadow-blue-900/20 transition-all mt-4"
              >
                Sign In <ArrowRight size={22} strokeWidth={3} />
              </motion.button>

              {/* Forgot Password */}
              <div className="text-center mt-4">
                <button type="button" className="text-[11px] font-black uppercase text-[#1e3a5f] hover:text-[#FDB813] transition-colors tracking-widest active:scale-95">
                  Forgot Password?
                </button>
              </div>
            </form>

            <div className="mt-10 flex items-center gap-4 p-5 bg-blue-50/50 rounded-[1.5rem] border border-blue-100/50">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm shrink-0">
                <AlertCircle size={18} className="text-blue-600" />
              </div>
              <p className="text-[11px] text-slate-600 font-bold leading-snug uppercase tracking-tight">
                Issues logging in? Contact <span className="text-[#1e3a5f]">Coordinator</span> support.
              </p>
            </div>
          </motion.div>
        </div>

      </motion.div>
    </div>
  );
}