"use client";
import React from 'react';
import { motion } from "framer-motion";
import { X, Bell, Circle } from "lucide-react";

export function NotificationPanel({ onClose }: { onClose: () => void }) {
  const notifications = [
    { id: 1, title: "New Enrollment", desc: "Valeeja Jamil added to BSSE", time: "2m ago", unread: true },
    { id: 2, title: "System Update", desc: "Batch 2026 roadmaps are now live", time: "1h ago", unread: false },
  ];

  return (
    <motion.div 
      initial={{ x: 300, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 300, opacity: 0 }}
      className="fixed right-0 top-0 h-screen w-80 bg-white shadow-[-10px_0_30px_rgba(0,0,0,0.05)] z-[60] p-8 border-l border-slate-100"
    >
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-black text-[#1e3a5f] uppercase italic">Notifications</h2>
        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={20}/></button>
      </div>
      
      <div className="space-y-4">
        {notifications.map((n) => (
          <div key={n.id} className={`p-4 rounded-2xl border ${n.unread ? 'bg-blue-50/50 border-blue-100' : 'bg-white border-slate-50'} transition-all cursor-pointer hover:border-blue-200`}>
            <div className="flex justify-between items-start mb-1">
              <p className="text-xs font-black text-[#1e3a5f] uppercase">{n.title}</p>
              {n.unread && <Circle size={8} className="fill-[#FDB813] text-[#FDB813]" />}
            </div>
            <p className="text-[10px] text-slate-500 font-bold mb-2 leading-relaxed">{n.desc}</p>
            <span className="text-[9px] text-slate-300 font-black uppercase tracking-widest">{n.time}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}