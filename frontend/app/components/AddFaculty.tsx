// // components/AddFaculty.tsx
// 'use client';

// import React, { useState } from 'react';
// import { motion } from 'framer-motion';
// import { UserPlus, User, Fingerprint, Mail, ShieldCheck, Phone } from 'lucide-react';
// import { useAddAdvisor } from '@/src/hooks/advisorHooks/addAdvisor';

// export function AddFaculty() {
//   const [formData, setFormData] = useState({
//     advisorName: '',
//     sapid: '',
//     email: '',
//     gender: 'Male',
//     contactNumber: '',
//     password: ''
//   });
  
//   const { addAdvisor, isLoading, error, success } = useAddAdvisor();

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     const result = await addAdvisor({
//       ...formData,
//       password: formData.password || `sap${formData.sapid}`
//     });
    
//     if (result.success) {
//       // Reset form
//       setFormData({
//         advisorName: '',
//         sapid: '',
//         email: '',
//         gender: 'Male',
//         contactNumber: '',
//         password: ''
//       });
//     }
//   };

//   return (
//     <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
//       <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl border border-slate-100 overflow-hidden">
        
//         {/* HEADER SECTION */}
//         <div className="flex justify-between items-center mb-10 bg-[#1e3a5f]/5 p-6 rounded-[2.5rem] border border-[#1e3a5f]/10">
//           <div className="flex items-center gap-4">
//             <div className="h-14 w-14 bg-[#1e3a5f] text-[#FDB813] rounded-2xl flex items-center justify-center shadow-lg shadow-blue-100">
//               <UserPlus size={28} />
//             </div>
//             <div>
//               <h2 className="text-xl font-bold text-[#1e3a5f] uppercase  leading-none">Faculty Registration</h2>
//             </div>
//           </div>
//           {success && (
//             <div className="bg-green-500/20 text-green-600 px-4 py-2 rounded-xl text-xs font-bold">
//               Advisor added successfully!
//             </div>
//           )}
//         </div>

//         {error && (
//           <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-[1.5rem] text-red-600 text-sm">
//             {error}
//           </div>
//         )}

//         <form className="space-y-8" onSubmit={handleSubmit}>
//           {/* Row 1: Name & SAP ID */}
//           <div className="grid grid-cols-2 gap-8">
//             <div className="space-y-2 group">
//               <label className="text-[10px] font-bold uppercase text-slate-400 ml-4 tracking-widest">Full Name</label>
//               <div className="relative">
//                 <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
//                 <input 
//                   type="text" 
//                   name="advisorName"
//                   value={formData.advisorName}
//                   onChange={handleChange}
//                   placeholder="Dr. Muhammad Arshad" 
//                   className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-xs outline-none focus:ring-2 ring-[#FDB813]/20 transition-all text-[#1e3a5f]" 
//                   required
//                 />
//               </div>
//             </div>

//             <div className="space-y-2 group">
//               <label className="text-[10px] font-bold uppercase text-slate-400 ml-4 tracking-widest">Employee / SAP ID</label>
//               <div className="relative">
//                 <Fingerprint className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
//                 <input 
//                   type="text" 
//                   name="sapid"
//                   value={formData.sapid}
//                   onChange={handleChange}
//                   placeholder="49XXX" 
//                   className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-xs outline-none focus:ring-2 ring-[#FDB813]/20 transition-all text-[#1e3a5f]" 
//                   required
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Row 2: Email & Gender */}
//           <div className="grid grid-cols-2 gap-8">
//             <div className="space-y-2 group">
//               <label className="text-[10px] font-bold uppercase text-slate-400 ml-4 tracking-widest">Official Email</label>
//               <div className="relative">
//                 <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
//                 <input 
//                   type="email" 
//                   name="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   placeholder="faculty@riphah.edu.pk" 
//                   className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-xs outline-none focus:ring-2 ring-[#FDB813]/20 transition-all text-[#1e3a5f]" 
//                   required
//                 />
//               </div>
//             </div>

//             <div className="space-y-2 group">
//               <label className="text-[10px] font-bold uppercase text-slate-400 ml-4 tracking-widest">Gender</label>
//               <select
//                 title='gender' 
//                 name="gender"
//                 value={formData.gender}
//                 onChange={handleChange}
//                 className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-xs outline-none focus:ring-2 ring-[#FDB813]/20 transition-all text-[#1e3a5f]"
//               >
//                 <option value="Male">Male</option>
//                 <option value="Female">Female</option>
//               </select>
//             </div>
//           </div>

//           {/* Row 3: Contact Number & Designation */}
//           <div className="grid grid-cols-2 gap-8">
//             <div className="space-y-2 group">
//               <label className="text-[10px] font-bold uppercase text-slate-400 ml-4 tracking-widest">Contact Number</label>
//               <div className="relative">
//                 <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
//                 <input 
//                   type="tel" 
//                   name="contactNumber"
//                   value={formData.contactNumber}
//                   onChange={handleChange}
//                   placeholder="0300xxxxxxx" 
//                   className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-xs outline-none focus:ring-2 ring-[#FDB813]/20 transition-all text-[#1e3a5f]" 
//                   required
//                 />
//               </div>
//             </div>

//             <div className="space-y-2 group opacity-80">
//               <label className="text-[10px] font-bold uppercase text-slate-400 ml-4 tracking-widest">Set Password</label>
//               <div className="relative">
//                 <ShieldCheck className="absolute left-5 top-1/2 -translate-y-1/2 text-[#FDB813]" size={16} />
//                 <input 
//                   type="password" 
//                   name="password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   placeholder="*********" 
//                   className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-xs outline-none focus:ring-2 ring-[#FDB813]/20 transition-all text-[#1e3a5f]" 
//                   required
//                 />
//               </div>
//             </div>
//           </div>

//           <button 
//             type="submit"
//             disabled={isLoading}
//             className="w-full py-6 bg-[#1e3a5f] text-white rounded-[2rem] font-bold text-xs uppercase tracking-[0.3em] shadow-xl hover:bg-[#FDB813] hover:text-[#1e3a5f] transition-all flex items-center justify-center gap-3 active:scale-[0.98] mt-4 disabled:opacity-50"
//           >
//             {isLoading ? 'Creating...' : 'Create Advisor Profile'} <UserPlus size={18} />
//           </button>
//         </form>
//       </div>
//     </motion.div>
//   );
// }


// components/AddFaculty.tsx
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, User, Fingerprint, Mail, ShieldCheck, Phone, ArrowLeft, AlertCircle } from 'lucide-react';
import { useAddAdvisor } from '@/src/hooks/advisorHooks/addAdvisor';

interface AddFacultyProps {
  onBack?: () => void;
}

export function AddFaculty({ onBack }: AddFacultyProps) {
  const [formData, setFormData] = useState({
    advisorName: '',
    sapid: '',
    email: '',
    gender: '',
    contactNumber: '',
    password: ''
  });
  
  const { addAdvisor, isLoading, error, success } = useAddAdvisor();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await addAdvisor({
      ...formData,
      password: formData.password || `sap${formData.sapid}`
    });
    
    if (result.success) {
      setFormData({
        advisorName: '',
        sapid: '',
        email: '',
        gender: '',
        contactNumber: '',
        password: ''
      });
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto px-4 sm:px-6 pb-10 -mt-6">
      
      {/* Top Header Section */}
      <div className="flex items-center justify-between mb-6 px-1">
        <div className="flex items-center gap-4">
          {onBack && (
            <button
              type="button"
              title="Back"
              onClick={onBack}
              className="
                p-3 
                hover:bg-slate-100 
                bg-white 
                shadow-sm 
                rounded-2xl 
                text-[#1e3a5f] 
                transition-all 
                flex 
                items-center 
                justify-center
                w-11 
                h-11
                border 
                border-slate-200/80
                cursor-pointer
                shrink-0
              "
            >
              <ArrowLeft size={18} />
            </button>
          )}

          <div className="flex items-center gap-4 ml-1">
            <div className="h-14 w-14 rounded-2xl flex items-center justify-center bg-gradient-to-br from-[#1e3a5f] to-[#2c5282] text-[#FDB813] shadow-md shadow-slate-200 shrink-0">
              <UserPlus size={26} />
            </div>
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight text-[#1e3a5f]">Faculty Registration</h2>
              <p className="text-xs font-medium text-slate-400 mt-0.5">Register a new faculty or advisor account</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white p-10 sm:p-12 rounded-[2.5rem] shadow-xl border border-slate-100">

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-[1.5rem] flex items-center gap-3">
            <AlertCircle className="text-red-500" size={20} />
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-[1.5rem] flex items-center gap-3">
            <AlertCircle className="text-green-500" size={20} />
            <p className="text-green-600 text-sm">Advisor added successfully!</p>
          </div>
        )}

        <form className="space-y-8" onSubmit={handleSubmit}>
          {/* Row 1: Name & SAP ID */}
          <div className="grid grid-cols-2 gap-8">
            <InputField 
              label="Full Name *" 
              name="advisorName"
              placeholder="Full Name" 
              icon={<User size={16}/>}
              value={formData.advisorName}
              onChange={handleChange}
              required
            />
            <InputField 
              label="Employee / SAP ID *" 
              name="sapid"
              placeholder="xxxxx" 
              icon={<Fingerprint size={16}/>}
              value={formData.sapid}
              onChange={handleChange}
              required
            />
          </div>

          {/* Row 2: Email & Gender */}
          <div className="grid grid-cols-2 gap-8">
            <InputField 
              label="Official Email *" 
              name="email"
              type="email"
              placeholder="xxxxx@riphah.edu.pk" 
              icon={<Mail size={16}/>}
              value={formData.email}
              onChange={handleChange}
              required
            />

            <div className="space-y-2 group">
              <label className="text-[10px] font-bold uppercase text-slate-400 ml-4 tracking-widest">Gender *</label>
              <select
                title="gender" 
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                className="w-full px-4 py-4 bg-slate-50 border-none rounded-2xl font-bold text-xs outline-none focus:ring-2 ring-[#FDB813]/50 transition-all cursor-pointer text-[#1e3a5f]"
              >
                <option value="" disabled className="text-slate-400 font-normal">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>

          {/* Row 3: Contact Number & Password */}
          <div className="grid grid-cols-2 gap-8">
            <InputField 
              label="Contact Number *" 
              name="contactNumber"
              type="tel"
              placeholder="xxxxxxxxx" 
              icon={<Phone size={16}/>}
              value={formData.contactNumber}
              onChange={handleChange}
              required
            />

            <InputField 
              label="Set Password *" 
              name="password"
              type="password"
              placeholder="*********" 
              icon={<ShieldCheck size={16}/>}
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* Button aligned to end (right) */}
          <div className="flex justify-end pt-4">
            <button 
              type="submit"
              disabled={isLoading}
              className="px-12 py-4 bg-[#1e3a5f] text-white rounded-[2rem] font-bold text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-[#FDB813] hover:text-[#1e3a5f] transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? 'Creating...' : 'Create Advisor Profile'} <UserPlus size={16} />
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}

function InputField({ label, name, placeholder, icon, type = "text", value, onChange, required = false }: any) {
  return (
    <div className="space-y-2 group">
      <label className="text-[10px] font-bold uppercase text-slate-400 ml-4 tracking-widest">
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#FDB813]">
          {icon}
        </div>
        <input 
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className="w-full pl-11 pr-4 py-4 bg-slate-50 border-none rounded-2xl font-bold text-xs outline-none focus:ring-2 ring-[#FDB813]/20 transition-all text-[#1e3a5f]" 
        />
      </div>
    </div>
  );
}