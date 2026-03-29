"use client";
<<<<<<< HEAD
import OutlinedTextHeading from "@/components/textsComponents/OutlinedTextHeading"
import { motion } from "framer-motion";
import YellowFilledButtonProps from "@/components/buttons/FilledButton/yellowFilledButton"
import { 
  BookOpen, Users, Calendar, 
  ShieldCheck, History, Send, 
  CheckCircle2, Lightbulb, Search 
} from "lucide-react";
import LandingFooter from "@/components/footer/route";
import SmallFeature from "@/components/cards/featureCards"
import { useRouter } from 'next/navigation';


export default function LandingPage() {

    const router = useRouter();

 const handleClick = () => {
     router.push('../views/auth/login');
  };
=======
import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from "framer-motion";
import { LogIn, LayoutDashboard, Zap } from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
>>>>>>> 7ebe32f424fda4d81778067c3ef2765759c0115d

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-6">
      {/* Decorative Background Element */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-[#FDB813]/10 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-[#1e3a5f]/5 rounded-full blur-[120px]" />
      </div>

<<<<<<< HEAD
          {/* --- HERO SECTION --- */}
      <section className="relative h-screen flex items-center justify-center text-center px-6">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/backgroundLanding.png')" }}
        />
        <div className="relative z-10 text-white max-w-5xl">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl text-[#FDB813] md:text-6xl font-bold tracking-tight mb-10 mt-20"
          >
            Adviso - <br />
            <span className="text-[#FDB813]">An Academic Batch Advisor System</span>
          </motion.h1>
          <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-white text-lg md:text-2xl font-light tracking-wide mb-16 leading-relaxed">
              Smart Guidance, Simple Solution
          </motion.h2>
          <div className="mt-8">
               <YellowFilledButtonProps text="Get Started" onClick={handleClick}/>
          </div>
         

        </div>
      </section>


      {/* --- WHY CHOOSE US --- */}
      <section className="py-32 px-6 md:px-12 text-center max-w-7xl mx-auto">
            <OutlinedTextHeading text="Why Choose Us" hasDot={true} />

        <div className="grid md:grid-cols-3 gap-12">
          <SmallFeature Icon={Users} title="Structured Advisory System" desc="A well-organized platform that streamlines academic advising and student guidance." />
          <SmallFeature Icon={Lightbulb} title="Efficient Meeting Management" desc="Schedule, manage, and track advisory meetings without manual effort." />
          <SmallFeature Icon={Search} title="Transparent Decision Tracking" desc="All advisory decisions and academic records are securely stored and easy to access." />
        </div>
      </section>

      {/* --- ABOUT US SECTION --- */}
      <section id="about" className="bg-[#1e3a5f] text-white py-32 px-6 md:px-24">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-24 items-center">
          <div className="text-left">
            <h2 className="text-3xl font-bold mb-12 tracking-wide text-[#FDB813] uppercase">About Us</h2>
            <h3 className="text-4xl font-bold mb-10 leading-tight">Making academic guidance smarter, <br /> simpler, and more reliable.</h3>
            <p className="text-white/70 leading-[2] text-lg font-medium">Adviso is a smart academic advising platform that connects students and advisors, streamlining guidance, course recommendations, meetings, and academic decisions.</p>
=======
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="flex justify-center mb-6">
          <div className="bg-[#1e3a5f] p-4 rounded-[2rem] shadow-xl">
            <img src="/Lightlogo.png" alt="Adviso" className="h-16 w-auto" />
>>>>>>> 7ebe32f424fda4d81778067c3ef2765759c0115d
          </div>
        </div>
        <h1 className="text-4xl font-black text-[#1e3a5f] uppercase italic tracking-tighter">
          Adviso Testing Hub
        </h1>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">
          Select a module to test your screens
        </p>
      </motion.div>

<<<<<<< HEAD
      <section id="features" className="py-32 px-6 md:px-12 text-center bg-white">
              <OutlinedTextHeading text="Features" hasDot={true} />

              <div className="grid md:grid-cols-3 gap-12 max-w-7xl mx-auto">
                <SmallFeature Icon={CheckCircle2} title="Smart Course Advising" desc="Automatically suggests eligible courses along with specific reasons." />
                <SmallFeature Icon={Calendar} title="Meeting Scheduling" desc="Schedule and track advisory sessions easily." />
                <SmallFeature Icon={ShieldCheck} title="Secure Records" desc="Store student profiles, transcripts, and decisions safely." />
                <SmallFeature Icon={History} title="Advisory History" desc="Complete logs accessible to future advisors." />
                <SmallFeature Icon={BookOpen} title="Automatic Transcript Management" desc="Manage student academic records automatically for accurate advising." />
                <SmallFeature Icon={Send} title="Digital Requests Form Submissions" desc="Submit academic requests quickly and digitally." />
              </div>
      </section>
=======
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl">
        {/* Login Screen Test Button */}
        <TestCard 
          title="Login Module"
          desc="Test authentication UI & forms"
          icon={<LogIn size={32} />}
          color="bg-white"
          onClick={() => router.push('/views/auth/login')}
          
        />
>>>>>>> 7ebe32f424fda4d81778067c3ef2765759c0115d

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
<<<<<<< HEAD
} 
=======
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
>>>>>>> 7ebe32f424fda4d81778067c3ef2765759c0115d
