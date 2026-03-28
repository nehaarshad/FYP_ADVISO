"use client";
import React, { useState } from 'react';
import { motion } from "framer-motion";
import Link from 'next/link';
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  ChevronLeft, 
  ShieldCheck, 
  User,
  AlertCircle 
} from "lucide-react";
import Image from 'next/image';

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i:number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" }
    })
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex items-center justify-center p-4 md:p-6 relative overflow-hidden font-sans">

      {/* Background */}
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-50 rounded-full blur-[120px] opacity-60" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#FDB813]/10 rounded-full blur-[100px] opacity-40" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl w-full grid md:grid-cols-2 bg-white rounded-[2.5rem] shadow-[0_40px_100px_-15px_rgba(30,58,95,0.15)] overflow-hidden border border-slate-100 z-10"
      >

        {/* LEFT SIDE */}
        <div className="bg-[#1e3a5f] p-12 text-white flex flex-col justify-between">
          
          <div>
            <Link href="/" className="flex items-center gap-2 text-white/60 hover:text-[#FDB813] mb-12 text-sm font-bold">
              <ChevronLeft size={18} /> Back to Website
            </Link>

            <div className="bg-white p-3 inline-block mb-8 rounded-2xl">
              <Image alt='logo' src="/logo.png" className="w-16 h-16" />
            </div>

            <h1 className="text-5xl font-black mb-6 leading-[1.1]">
              Join <br />
              <span className="text-[#FDB813]">ADVISO.</span>
            </h1>

            <p className="text-white/70 font-medium text-lg max-w-[280px]">
              Create your account and start your academic journey today.
            </p>
          </div>

          <div className="p-5 bg-white/5 rounded-[1.5rem] flex items-center gap-4">
            <div className="w-10 h-10 bg-[#FDB813] rounded-xl flex items-center justify-center text-[#1e3a5f]">
              <ShieldCheck size={22} />
            </div>
            <div>
              <p className="text-xs font-black uppercase opacity-60">Secure Signup</p>
              <p className="text-sm font-bold">Official Riphah Access</p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="p-10 md:p-16 flex flex-col justify-center bg-white">
          
          <div className="mb-10">
            <h2 className="text-4xl font-black text-[#1e3a5f] mb-2">Sign Up</h2>
            <div className="h-1.5 w-12 bg-[#FDB813] rounded-full"></div>
          </div>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>

            {/* Name */}
            <div>
              <label className="text-[11px] font-black uppercase text-slate-400 ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                <input 
                  type="text"
                  placeholder="Your name"
                  className="w-full pl-14 pr-6 py-5 bg-slate-50 border rounded-[1.5rem]"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-[11px] font-black uppercase text-slate-400 ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                <input 
                  type="email"
                  placeholder="example@gmail.com"
                  className="w-full pl-14 pr-6 py-5 bg-slate-50 border rounded-[1.5rem]"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-[11px] font-black uppercase text-slate-400 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                <input 
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-14 pr-6 py-5 bg-slate-50 border rounded-[1.5rem]"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-[11px] font-black uppercase text-slate-400 ml-1">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                <input 
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-14 pr-6 py-5 bg-slate-50 border rounded-[1.5rem]"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Button */}
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-[#1e3a5f] text-white py-5 rounded-[1.5rem] font-black text-lg flex items-center justify-center gap-3 mt-6"
            >
              Create Account <ArrowRight size={22} />
            </motion.button>
          </form>

          {/* Bottom */}
          <p className="mt-8 text-sm text-center text-slate-500 font-bold">
            Already have an account?{" "}
            <Link href="/login" className="text-[#1e3a5f]">Login</Link>
          </p>

          {/* Alert */}
          <div className="mt-8 flex items-center gap-4 p-5 bg-blue-50 rounded-[1.5rem]">
            <AlertCircle size={18} className="text-blue-600" />
            <p className="text-[12px] text-slate-600 font-bold">
              Make sure to use your official university email.
            </p>
          </div>

        </div>
      </motion.div>
    </div>
  );
}