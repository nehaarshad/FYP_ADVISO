"use client";
import React, { useState } from 'react';
import { motion, Variants, TargetAndTransition } from "framer-motion";
import Link from 'next/link';
import { 
  Mail, 
  Lock, 
  ChevronLeft, 
  AlertCircle 
} from "lucide-react";
import UniversalInput from "@/components/textsComponents/universalInput";
import BlueFilledButton from '@/components/buttons/FilledButton/blueFilledButton';

export default function LoginPage() {
  const [sapId, setSapId] = useState("");
  const [password, setPassword] = useState("");

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i: number): string | TargetAndTransition => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.6,
        ease: "easeOut",
      },
    }),
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login Attempt:", { sapId, password });
    // API logic goes here
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat selection:bg-[#FDB813]/30 flex items-center justify-center p-4 md:p-6 relative overflow-hidden font-sans"
      // Using the landing page background image
      style={{ backgroundImage: "url('/backgroundLanding.png')" }}
    >
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[3px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl w-full grid md:grid-cols-2 bg-white/95 backdrop-blur-md rounded-[2.5rem] shadow-[0_40px_100px_-15px_rgba(0,0,0,0.4)] overflow-hidden border border-white/20 relative z-10"
      >
        {/* LEFT SIDE: BRANDING */}
        <div className="bg-[#1e3a5f]/90 p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-blue-400/10 to-transparent pointer-events-none" />
          <div className="relative z-10">
            <motion.div custom={0} initial="hidden" animate="visible" variants={fadeUp}>
              <Link href="/" className="flex items-center gap-2 text-white/60 hover:text-[#FDB813] mb-12 text-sm font-bold group transition-all">
                <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back
              </Link>
            </motion.div>
            
            {/* Logo*/}
            <motion.div 
              custom={1} initial="hidden" animate="visible" variants={fadeUp} 
              className="mb-8"
            >
              <img 
                src="/Lightlogo.png" 
                alt="Riphah Logo" 
                className="w-32 h-32 object-contain drop-shadow-2xl" 
              />
            </motion.div>

            <motion.h1 
              custom={2} initial="hidden" animate="visible" variants={fadeUp}
              className="text-5xl font-black tracking-tighter mb-6 leading-[1.1]"
            >
              Welcome back <br /> 
              to <span className="text-[#FDB813]">ADVISO.</span>
            </motion.h1>
          </div>
        </div>

        {/* RIGHT SIDE: FORM */}
        <div className="p-10 md:p-16 flex flex-col justify-center bg-white relative">
          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ delay: 0.4 }}
          >
            <div className="mb-10 text-left">
                <h2 className="text-4xl font-black text-[#1e3a5f] mb-2 tracking-tight">Login</h2>
                <div className="h-1.5 w-12 bg-[#FDB813] rounded-full"></div>
            </div>
            
            <form className="space-y-6" onSubmit={handleLogin}>
              <UniversalInput 
                    label="SAP ID"
                    type="text"
                    placeholder="e.g. 49100"
                    value={sapId}
                    onChange={setSapId}
                    Icon={Mail}
                  />

              <UniversalInput 
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={setPassword}
                Icon={Lock}
              />

              <BlueFilledButton text="Sign In" />
            </form>

            <div className="mt-12 flex items-center gap-4 p-5 bg-blue-50/50 rounded-[1.5rem] border border-blue-100/50">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm shrink-0">
                <AlertCircle size={18} className="text-blue-600" />
              </div>
              <p className="text-[12px] text-slate-600 font-bold leading-snug">
                Issues logging in? Reach out to your <span className="text-[#1e3a5f]"> Coordinator</span> for support.
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}