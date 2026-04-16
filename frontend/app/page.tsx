"use client";
import OutlinedTextHeading from "@/components/textsComponents/OutlinedTextHeading";
import { motion } from "framer-motion";
import YellowFilledButtonProps from "@/components/buttons/FilledButton/yellowFilledButton";
import { 
  BookOpen, Users, Calendar, 
  ShieldCheck, History, Send, 
  CheckCircle2, Lightbulb, Search 
} from "lucide-react";
import LandingFooter from "@/components/footer/route"
import SmallFeature from "@/components/cards/featureCards";
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter();

  // Navigation logic for Login page
  const handleClick = () => {
    router.push('/views/auth/registeration/signup'); 
  };

  return (
    <>
       <div className="min-h-screen bg-white font-sans selection:bg-[#FDB813]/30 overflow-x-hidden">
      
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
               {/* Button triggers the handleClick function */}
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
            <h2 className="text-3xl font-bold mb-24 tracking-wide text-[#FDB813] uppercase">About Us</h2>
            <h3 className="text-4xl font-bold mb-7 leading-tight">Making academic guidance smarter, <br /> simpler, and more reliable.</h3>
            <p className="text-white/70 leading-[2] text-lg font-normal">Adviso is a smart academic advising platform that connects students and advisors, streamlining guidance, course recommendations, meetings, and academic decisions.</p>
          </div>
          <motion.div className="rounded-[3rem] overflow-hidden shadow-2xl border-[12px] border-white/5">
            <img src="/Image.png" alt="About" className="w-full h-[450px] object-cover" />
          </motion.div>
        </div>
      </section>

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
    </div>

    

      <LandingFooter />
    </>
 
  );
}