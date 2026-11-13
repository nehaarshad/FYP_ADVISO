


/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, Variants, TargetAndTransition } from "framer-motion";
import Link from 'next/link';
import { Mail, Lock, ChevronLeft, AlertCircle, User } from "lucide-react";
import UniversalInput from "@/components/textsComponents/universalInput";
import BlueFilledButton from '@/components/buttons/FilledButton/blueFilledButton';
import { authRepository } from '@/src/repositories/authRepository/authRepository';
import { LoginCredentials } from '@/src/credentials/authCred/loginCred';
import Image from 'next/image';

export default function LoginPage() {
  // Form state
  const [sapId, setSapId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

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

  useEffect(() => {
    if (authRepository.isAuthenticated()) {
      const user = authRepository.getCurrentUser();
      console.log("Already authenticated user:", user);
      if (user && user.data) {
        redirectBasedOnRole(user.data.role, router);
      }
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous error
    setError(null);

    // Validate inputs
    if (!sapId.trim()) {
      setError("SAP ID is required");
      return;
    }

    if (!password.trim()) {
      setError("Password is required");
      return;
    }

    // Set loading state
    setIsLoading(true);

    try {
      // Prepare credentials
      const credentials: LoginCredentials = {
        sapid: sapId,
        password: password
      };

      // Call login API through repository
      const user = await authRepository.login(credentials);

      // Redirect based on user role
      redirectBasedOnRole(user.data!.role, router);

    } catch (err: any) {
      // Handle error
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat selection:bg-[#FDB813]/30 flex items-center justify-center p-4 md:p-6 relative overflow-hidden font-sans"
      style={{ backgroundImage: "url('/backgroundLanding.png')" }}
    >
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[3px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl w-full grid md:grid-cols-2 bg-white/95 backdrop-blur-md rounded-[2.5rem] shadow-[0_40px_100px_-15px_rgba(0,0,0,0.4)] overflow-hidden border border-white/20 relative z-10"
      >
        {/* LEFT SIDE: BRANDING - Solid #1e3a5f color */}
        <div className="bg-[#1e3a5f] p-12 text-white flex flex-col justify-between relative overflow-hidden">

          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-blue-400/10 to-transparent pointer-events-none" />

          <div className="relative z-10">

            {/* Back Navigation */}
            <motion.div
              custom={0}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
            >
              <Link
                href="/"
                className="flex items-center gap-2 text-gray-300 hover:text-[#FDB813] mb-12 text-medium font-bold group transition-all"
              >
                <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                Back
              </Link>
            </motion.div>

            {/* Centered Logo */}
            <motion.div
              custom={1}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="mb-4 flex justify-center"
            >
              <Image
                width={200}
                height={200}
                src="/logo(1).png"
                alt="Riphah Logo"
                priority
                className="w-44 h-44 object-contain drop-shadow-2xl"
              />
            </motion.div>

            {/* Centered Welcome Message */}
            <motion.h1
              custom={2}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="text-3xl md:text-4xl font-black tracking-tight mb-4 leading-tight text-center"
            >
              Welcome to
              <br />
               <span className="text-[#FDB813] text-4xl md:text-5xl">ADVISO</span>
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
              <h2 className="text-4xl font-black text-[#1e3a5f] mb-2 tracking-tight">
                Login
              </h2>
              <div className="h-1.5 w-12 bg-[#FDB813] rounded-full"></div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-[1.2rem]">
                <p className="text-red-600 text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Form tag */}
            <form className="space-y-6" onSubmit={handleLogin}>
              <UniversalInput
                label="User"
                type="text"
                placeholder="******"
                value={sapId}
                onChange={setSapId}
                Icon={User}
                disabled={isLoading}
              />

              <UniversalInput
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={setPassword}
                Icon={Lock}
                disabled={isLoading}
              />

              <BlueFilledButton text={isLoading ? "Signing In..." : "Sign In"} />
            </form>

            <div className="mt-6 flex items-center gap-3 p-4 bg-blue-50/50 rounded-[1.2rem] border border-blue-100/50">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm shrink-0">
                <AlertCircle size={15} className="text-blue-600" />
              </div>

              <p className="text-[12px] text-slate-500 font-semibold leading-tight">
                Issues logging in? Reach out to your <span className="text-[#1e3a5f] font-bold">Coordinator</span> for support.
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
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
