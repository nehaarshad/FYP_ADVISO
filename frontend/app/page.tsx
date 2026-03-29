"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from "framer-motion";
import { LogIn, LayoutDashboard, Zap } from "lucide-react";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-6">
      {/* Decorative Background Element */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-[#FDB813]/10 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-[#1e3a5f]/5 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="flex justify-center mb-6">
          <div className="bg-[#1e3a5f] p-4 rounded-[2rem] shadow-xl">
            <img src="/Lightlogo.png" alt="Adviso" className="h-16 w-auto" />
          </div>
        </div>
        <h1 className="text-4xl font-black text-[#1e3a5f] uppercase italic tracking-tighter">
          Adviso Testing Hub
        </h1>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">
          Select a module to test your screens
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl">
        {/* Login Screen Test Button */}
        <TestCard 
          title="Login Module"
          desc="Test authentication UI & forms"
          icon={<LogIn size={32} />}
          color="bg-white"
          onClick={() => router.push('/views/auth/login')}
          
        />

        {/* Coordinator Dashboard Test Button */}
        <TestCard 
          title="Coordinator Portal"
          desc="Test dashboard, sidebar & tabs"
          icon={<LayoutDashboard size={32} />}
          color="bg-[#1e3a5f]"
          textColor="text-white"
          accentColor="text-[#FDB813]"
          onClick={() => router.push('/views/dashboard/coordinator')}
          
        />
      </div>

      <footer className="mt-16 text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
        FYP Project • Riphah International University
      </footer>
    </div>
  );
}

// Helper Card Component
function TestCard({ title, desc, icon, color, onClick, textColor = "text-[#1e3a5f]", accentColor = "text-[#1e3a5f]" }: any) {
  return (
    <motion.div 
      whileHover={{ y: -10, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`${color} p-8 rounded-[3rem] shadow-xl border border-slate-100 cursor-pointer flex flex-col items-center text-center group transition-all`}
    >
      <div className={`mb-6 ${accentColor} group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h3 className={`text-xl font-black uppercase italic tracking-tight ${textColor}`}>{title}</h3>
      <p className={`text-[10px] font-bold uppercase tracking-widest mt-2 opacity-50 ${textColor}`}>{desc}</p>
      
      <div className="mt-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-tighter bg-[#FDB813] text-[#1e3a5f] px-4 py-2 rounded-full shadow-lg">
        Launch Screen <Zap size={12} fill="currentColor" />
      </div>
    </motion.div>
  );
}