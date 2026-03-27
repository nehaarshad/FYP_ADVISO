"use client";
import React from 'react';
import { motion } from "framer-motion";
import { 
  BookOpen, Users, Calendar, 
  ShieldCheck, History, Send, 
  CheckCircle2, Lightbulb, Search 
} from "lucide-react";
import { LandingFooter, FeatureCard, SmallFeature } from "@/components/ui/ui";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-[#FDB813]/30 overflow-x-hidden">
      

      {/* --- HERO SECTION --- */}
      <section className="relative h-screen flex items-center justify-center text-center px-6">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/Group.png')" }} />
        <div className="relative z-10 text-white max-w-5xl">
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-5xl text-[#FDB813] md:text-7xl font-black tracking-tight mb-6">
            Adviso - <br/> <span className="text-[#FDB813]">An Academic Batch Advisor System</span>
          </motion.h1>
        </div>
      </section>

      {/* --- WHY CHOOSE US --- */}
      <section className="py-32 px-6 md:px-12 text-center max-w-7xl mx-auto">
        <div className="flex justify-center mb-20">
            <button className="px-10 py-3 border-2 border-slate-200 rounded-full text-[#1e3a5f] font-black text-[11px] uppercase tracking-[0.25em] flex items-center gap-3">
               <span className="text-blue-600 text-xl">•</span> Why Choose Us
            </button>
        </div>
        <div className="grid md:grid-cols-3 gap-12">
          <FeatureCard Icon={Users} title="Structured Advisory System" desc="A well-organized platform that streamlines academic advising and student guidance." />
          <FeatureCard Icon={Lightbulb} title="Efficient Meeting Management" desc="Schedule, manage, and track advisory meetings without manual effort." />
          <FeatureCard Icon={Search} title="Transparent Decision Tracking" desc="All advisory decisions and academic records are securely stored and easy to access." />
        </div>
      </section>

      {/* --- ABOUT US SECTION (Image.png Fix) --- */}
      <section id="about" className="bg-[#1e3a5f] text-white py-32 px-6 md:px-24">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-24 items-center">
          <div className="text-left">
            <h2 className="text-2xl font-black mb-12 tracking-[0.2em] text-[#FDB813] uppercase">About Us</h2>
            <h3 className="text-4xl font-black mb-10 leading-tight">Making academic guidance smarter, <br /> simpler, and more reliable.</h3>
            <p className="text-white/70 leading-[2] text-lg font-medium">Adviso is a smart academic advising platform that connects students and advisors, streamlining guidance, course recommendations, meetings, and academic decisions.</p>
          </div>
          <motion.div className="rounded-[3rem] overflow-hidden shadow-2xl border-[12px] border-white/5">
            <img src="/Image.png" alt="About" className="w-full h-[450px] object-cover" />
          </motion.div>
        </div>
      </section>

      {/* --- FEATURES GRID (image_5bd803.png Match) --- */}
      <section id="features" className="py-32 px-6 md:px-12 text-center bg-white">
        <div className="flex justify-center mb-24 text-blue-600 uppercase font-black text-[11px] tracking-widest border-2 border-slate-200 rounded-full w-fit mx-auto px-10 py-3 gap-3">
            <span>•</span> Features
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-[95rem] mx-auto">
          <SmallFeature Icon={CheckCircle2} title="Smart Course Recommendations" desc="Automatically suggests eligible courses." />
          <SmallFeature Icon={Calendar} title="Meeting Scheduling" desc="Schedule and track advisory sessions easily." />
          <SmallFeature Icon={ShieldCheck} title="Secure Records" desc="Store student profiles, transcripts, and decisions safely." />
          <SmallFeature Icon={History} title="Advisory History" desc="Complete logs accessible to future advisors." />
          <SmallFeature Icon={BookOpen} title="Transcript" desc="View and manage student academic records for accurate advising." />
          <SmallFeature Icon={Send} title="Submit Requests" desc="Submit academic requests quickly and digitally." />
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}