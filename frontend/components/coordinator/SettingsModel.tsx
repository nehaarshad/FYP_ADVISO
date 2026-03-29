"use client";
import React, { useState } from 'react';
import { motion } from "framer-motion";
import { X, Moon, Bell, Shield, Palette } from "lucide-react";

export function SettingsModal({ onClose }: { onClose: () => void }) {
  // 1. Teeno toggles ki states define ki hain
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [privacyLock, setPrivacyLock] = useState(false);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-6 backdrop-blur-sm bg-slate-900/20">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden"
      >
        <div className="bg-[#1e3a5f] p-8 flex justify-between items-center text-white">
          <div className="flex items-center gap-3">
            <Palette size={24} className="text-[#FDB813]" />
            <h2 className="text-xl font-black uppercase italic tracking-tighter">System Settings</h2>
          </div>
          <button onClick={onClose} className="hover:rotate-90 transition-transform p-2">
            <X size={24}/>
          </button>
        </div>
        
        <div className="p-10 space-y-6">
          {/* Dark Mode Toggle */}
          <SettingToggle 
            icon={<Moon size={18}/>} 
            label="Dark Mode" 
            desc="Switch to dark interface" 
            active={darkMode}
            onToggle={() => setDarkMode(!darkMode)}
          />

          {/* Notifications Toggle */}
          <SettingToggle 
            icon={<Bell size={18}/>} 
            label="Push Notifications" 
            desc="Alert for new requests" 
            active={notifications}
            onToggle={() => setNotifications(!notifications)}
          />

          {/* Privacy Lock Toggle */}
          <SettingToggle 
            icon={<Shield size={18}/>} 
            label="Privacy Lock" 
            desc="Hide CGPA from list view" 
            active={privacyLock}
            onToggle={() => setPrivacyLock(!privacyLock)}
          />
          
          <div className="pt-6 border-t border-slate-100">
            <button 
              onClick={onClose}
              className="w-full py-4 bg-[#FDB813] text-[#1e3a5f] rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] transition-all shadow-lg active:scale-95"
            >
              Save Changes
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Reusable Toggle Component
function SettingToggle({ icon, label, desc, active, onToggle }: any) {
  return (
    <div className="flex items-center justify-between p-2 group">
      <div className="flex items-center gap-4">
        <div className={`h-10 w-10 rounded-xl flex items-center justify-center transition-colors ${active ? 'bg-[#FDB813]/20 text-[#1e3a5f]' : 'bg-slate-50 text-slate-400'}`}>
          {icon}
        </div>
        <div>
          <p className="text-sm font-black text-[#1e3a5f]">{label}</p>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{desc}</p>
        </div>
      </div>
      
      {/* Switch UI */}
      <div 
        onClick={onToggle}
        className={`w-12 h-6 rounded-full p-1 transition-all duration-300 cursor-pointer relative ${active ? 'bg-green-500 shadow-inner' : 'bg-slate-200'}`}
      >
        <motion.div 
          animate={{ x: active ? 24 : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="w-4 h-4 bg-white rounded-full shadow-sm" 
        />
      </div>
    </div>
  );
}