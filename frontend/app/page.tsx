
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import OutlinedTextHeading from "@/components/textsComponents/OutlinedTextHeading";
import { motion } from "framer-motion";
import YellowFilledButtonProps from "@/components/buttons/FilledButton/yellowFilledButton";
import { 
  BookOpen, Users, Calendar, 
  ShieldCheck, History, Send, 
  CheckCircle2, Lightbulb, Search, 
  MessageSquare
} from "lucide-react";
import LandingFooter from "@/components/footer/route";
import SmallFeature from "@/components/cards/featureCards";
import { useRouter } from 'next/navigation';
import { authRepository } from "@/src/repositories/authRepository/authRepository";
import { useEffect } from "react";

export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    if (authRepository.isAuthenticated()) {
      const user = authRepository.getCurrentUser();
      console.log("Already authenticated user:", user);
      if (user && user.data) {
        redirectBasedOnRole(user.data.role, router);
      }
    }
  }, [router]);
  
  const handleClick = () => {
      router.push('/views/auth/login'); 
  };

  return (
    <>
       {/* Yahan id="home" add ki hai */}
       <div id="home" className="min-h-screen bg-white font-sans selection:bg-[#FDB813]/30 overflow-x-hidden scroll-smooth">
      
      {/* ---- HERO SECTION (Added id="home") ----*/}
      <section id="home" className="relative h-screen flex items-center justify-center text-center px-6">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/backgroundLanding.png')" }}
        />
        <div className="relative z-10 text-white max-w-5xl">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl text-[#FDB813] md:text-6xl font-bold tracking-tight mb-10 mt-20"
          >
            Adviso - <br />
            <span className="text-[#FDB813]">An Academic Batch Advisor System</span>
          </motion.h1>
          <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-white text-8xl md:text-2xl font-normal tracking-wide mb-16 leading-relaxed">
              Smart Guidance, Simple Solution
          </motion.h2>
          <div className="mt-8">
               <YellowFilledButtonProps text="Get Started" onClick={handleClick}/>
          </div>
        </div>
      </section>

      <section id="services" className="py-32 px-6 md:px-12 text-center max-w-7xl mx-auto">
            <OutlinedTextHeading text="Why Choose Us" hasDot={true} />
        <div className="grid md:grid-cols-3 gap-12">
          <SmallFeature Icon={Users} title="Structured Advisory System" desc="A well-organized platform that streamlines academic advising and student guidance." />
          <SmallFeature Icon={Lightbulb} title="Efficient Meeting Management" desc="Schedule, manage, and track advisory meetings without manual effort." />
          <SmallFeature Icon={Search} title="Transparent Decision Tracking" desc="All advisory decisions and academic records are securely stored and easy to access." />
        </div>
      </section>

      <section id="about" className="bg-[#1e3a5f] text-white py-32 px-4 md:px-18">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-24 items-center">
          <div className="text-left">
            <h2 className="text-4xl font-black mb-20 tracking-wide text-[#FDB813] ">About Us</h2>
            <h3 className="text-3xl font-bold mb-7 leading-tight">Making academic guidance smarter, <br /> simpler, and more reliable.</h3>
            <p className="text-white/75 leading-[1.7] text-normal font-semibold">Adviso is a smart academic advising platform that connects students and advisors, streamlining guidance, course recommendations, meetings, and academic decisions.</p>
          </div>
          <motion.div className="rounded-[3rem] overflow-hidden shadow-2xl border-[12px] border-white/5">
            <img src="/Image.png" alt="About" className="w-full h-[450px] object-cover" />
          </motion.div>
        </div>
      </section>

      {/* ---- FEATURES SECTION --- */}
      <section id="features" className="py-32 px-6 md:px-12 text-center bg-white">
            <OutlinedTextHeading text="Features" hasDot={true} />
            <div className="grid md:grid-cols-3 gap-12 max-w-7xl mx-auto">
              <SmallFeature Icon={CheckCircle2} title="Smart Course Advising" desc="Automatically suggests eligible courses along with specific reasons." />
              <SmallFeature Icon={Calendar} title="Meeting Scheduling" desc="Schedule and track advisory sessions easily." />
              <SmallFeature Icon={ShieldCheck} title="Secure Records" desc="Store student profiles, transcripts, and decisions safely." />
              <SmallFeature Icon={History} title="Advisory History" desc="Complete logs accessible to future advisors." />
              <SmallFeature Icon={BookOpen} title="Automatic Transcript Management" desc="Manage student academic records automatically for accurate advising." />
              <SmallFeature Icon={MessageSquare} title="Faculty Hub & Real-Time Chat" desc="Collaborate with peers on the faculty board and instantly message students or advisors for quick guidance." />
            </div>
      </section>
    </div>

    <LandingFooter />
    </>
  );
}

function redirectBasedOnRole(role: string, router: any) {
  switch (role) {
    case 'student':
      router.push('/views/dashboard/students');
      break;
    case 'advisor':
      router.push('/views/dashboard/advisor');
      break;
    case 'coordinator':
      router.push('/views/dashboard/coordinator');
      break;
    case 'admin':
      router.push('/views/dashboard/admin');
      break;
    default:
      router.push('/dashboard');
  }
}