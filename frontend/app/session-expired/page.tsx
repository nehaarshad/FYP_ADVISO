// frontend/src/app/session-expired/page.tsx
"use client";
import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ShieldAlert, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function SessionExpiredPage() {
  const router = useRouter();

  const handleLoginRedirect = () => {
    // Optional: Clear any leftover data before redirecting
    localStorage.clear(); 
    router.push("/views/auth/login");
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* Background Decor */}
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#1e3a5f]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#FDB813]/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white rounded-[2.5rem] shadow-[0_40px_100px_-15px_rgba(30,58,95,0.15)] border border-slate-100 p-10 text-center relative z-10"
      >
        {/* Icon */}
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          className="w-24 h-24 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6 border-8 border-white shadow-sm"
        >
          <ShieldAlert size={40} className="text-[#FDB813]" />
        </motion.div>

        {/* Text */}
        <h1 className="text-3xl font-bold text-[#1e3a5f] mb-3 tracking-tight">
          Session Expired
        </h1>
        <p className="text-slate-500 font-medium mb-8 text-sm leading-relaxed">
          Your secure session has timed out due to inactivity, or your token is invalid. Please log in again to continue using Adviso.
        </p>

        {/* Action Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLoginRedirect}
          className="w-full bg-[#1e3a5f] text-white py-4 rounded-[1.2rem] font-bold text-lg flex items-center justify-center gap-3 shadow-lg shadow-blue-900/20 hover:bg-[#152c4a] transition-all"
        >
          Login Again <ArrowRight size={20} />
        </motion.button>

        {/* Optional Footer */}
        <div className="mt-8">
          <Link href="/" className="text-xs font-bold text-slate-400 hover:text-[#FDB813] uppercase tracking-widest transition-colors">
            Return to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}