/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import React, { useState } from 'react';
import { motion } from "framer-motion";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  ChevronLeft, 
  User,
  Phone,
  GraduationCap
} from "lucide-react";
import Image from 'next/image';
import { authRepository } from '@/src/repositories/authRepository/authRepository';
import { SignupCredentials } from '@/src/credentials/authCred/signUpCreds';

export default function SignupPage() {
  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [sapId, setSapId] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<  "advisor" | "coordinator" | "admin">("coordinator");
  const [department, setDepartment] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [gender, setGender] = useState("");
  
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();


  const validateForm = (): boolean => {
    // Name validation
    if (!name.trim()) {
      setError("Full name is required");
      return false;
    }
    
    // SAP ID validation
    if (!sapId.trim()) {
      setError("SAP ID is required");
      return false;
    }
    if (!/^\d+$/.test(sapId)) {
      setError("SAP ID must contain only numbers");
      return false;
    }
    
    // Email validation
    if (!email.trim()) {
      setError("Email is required");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return false;
    }
    
    // Password validation
    if (!password) {
      setError("Password is required");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }

    
    if ( role === 'coordinator' && !department) {
      setError("Department is required for this role");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous error
    setError(null);
    
    validateForm();
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    // Set loading state
    setIsLoading(true);
    
    try {
      // Prepare signup credentials
      const credentials: SignupCredentials = {
        sapid: sapId,
        password: password,
        name: name,
        email: email,
        role: role,
        ...(department && { department }),
        ...(contactNumber && { contactNumber }),
        ...(gender && { gender }),
      };
      
      // Call signup API through repository
      const user = await authRepository.signup(credentials);
      
      // Redirect based on user role
      redirectBasedOnRole(user.data!.role, router);
      
    } catch (err: any) {
      // Handle error
      setError(err.message || "Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
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
              <ChevronLeft size={18} /> Back 
            </Link>

            <div className="p-3 mb-20 rounded-full w-max">
              <Image 
                width={154} 
                height={184} 
                alt='logo' 
                src="/lightLogo.png" 
              />
            </div>

            <h1 className="text-4xl font-black mb-6 mt-10 leading-[1.1]">
              Join <br />
              <span className="text-[#FDB813]">ADVISO.</span>
            </h1>

            <p className="text-white/70 font-medium text-1xl max-w-[280px]">
              Empower academic decisions with structured advising and course guidance.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="p-5 md:p-10 flex flex-col justify-center bg-white overflow-y-auto max-h-screen">

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-[1.2rem]">
              <p className="text-red-600 text-sm font-medium">{error}</p>
            </div>
          )}
          
           <form className="space-y-4" onSubmit={handleSubmit}>
           

            {/* Name */}
            <div>
              <div className="relative">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                <input 
                  type="text"
                  placeholder="Your full name"
                  className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-[1.2rem] focus:outline-none focus:border-[#FDB813] transition-colors"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* SAP ID */}
            <div>
              <div className="relative">
                <GraduationCap className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                <input 
                  type="text"
                  placeholder="sap ID"
                  className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-[1.2rem] focus:outline-none focus:border-[#FDB813] transition-colors"
                  value={sapId}
                  onChange={(e) => setSapId(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                <input 
                  type="email"
                  placeholder="example@riphah.edu.pk"
                  className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-[1.2rem] focus:outline-none focus:border-[#FDB813] transition-colors"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Contact Number */}
            <div>
              <div className="relative">
                <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                <input 
                  type="tel"
                  placeholder="0300xxxxxxx"
                  className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-[1.2rem] focus:outline-none focus:border-[#FDB813] transition-colors"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Department (for coordinators) */}
              <div>
               <div className="relative">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                  <select
                    title='department'
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-[1.2rem] focus:outline-none focus:border-[#FDB813] transition-colors"
                    disabled={isLoading}
                  >
                    <option value="" disabled>---Select Department---</option>
                    <option value="COMPUTING">COMPUTING</option>
                    <option value="SOCIAL SCIENCES">SOCIAL SCIENCES</option>
                  </select>
                </div>
              </div>
            
 {/* role (for coordinators) */}
              <div>
               <div className="relative">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                  <select
                    title='role'
                    value={role}
                    onChange={(e) => setRole(e.target.value as "advisor" | "coordinator" | "admin")}
                    className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-[1.2rem] focus:outline-none focus:border-[#FDB813] transition-colors"
                    disabled={isLoading}
                  >
                    <option value="" disabled>---Select Role---</option>
                    <option value="coordinator">COORDINATOR</option>
                    <option value="adviser" disabled>ADVISOR</option>
                  </select>
                </div>
              </div>
            
            {/* Gender (for advisors) */}
            
              <div>
               <div className="relative">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                  <select
                    title='gender'
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-[1.2rem] focus:outline-none focus:border-[#FDB813] transition-colors"
                    disabled={isLoading}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>

            {/* Password */}
            <div>
             <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                <input 
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-[1.2rem] focus:outline-none focus:border-[#FDB813] transition-colors"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Button */}
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#1e3a5f] text-white py-4 rounded-[1.2rem] font-black text-lg flex items-center justify-center gap-3 mt-10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creating Account..." : "Create New Account"} 
              {!isLoading && <ArrowRight size={22} />}
            </motion.button>
          </form>

  
         
        </div>
      </motion.div>
    </div>
  );
}

// Helper function to redirect based on user role
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