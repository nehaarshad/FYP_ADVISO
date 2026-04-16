"use client";
import React from 'react';
import { motion } from "framer-motion";
import { X, Circle, Bell } from "lucide-react";

interface NotificationPanelProps {
  onClose: () => void;
}

export function NotificationPanel({ onClose }: NotificationPanelProps) {
  const notifications = [
    { id: 1, title: "New Enrollment", desc: "Valeeja Jamil added to BSSE", time: "2m ago", unread: true },
    { id: 2, title: "System Update", desc: "Batch 2026 roadmaps are now live", time: "1h ago", unread: false },
    { id: 3, title: "Credit Request", desc: "A student requested 3 extra credit hours", time: "3h ago", unread: true },
  ];

  return (
    <>
      {/* 1. BACKDROP OVERLAY */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[55]"
      />

      {/* 2. RESPONSIVE PANEL */}
      <motion.div 
        initial={{ x: "100%", opacity: 0 }} 
        animate={{ x: 0, opacity: 1 }} 
        exit={{ x: "100%", opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className={`
          fixed right-0 top-0 h-screen z-[60] bg-white 
          border-l border-slate-100 shadow-[-10px_0_30px_rgba(0,0,0,0.05)]
          w-full sm:w-80 md:w-96 
          p-6 md:p-8
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex flex-col">
            <h2 className="text-xl font-black text-[#1e3a5f] uppercase leading-none">
              Notifications
            </h2>
            <div className="h-1 w-8 bg-amber-400 mt-2 rounded-full" />
          </div>
          
          <button 
            onClick={onClose} 
            className="p-2.5 hover:bg-slate-50 text-slate-400 hover:text-[#1e3a5f] rounded-xl transition-all active:scale-90"
          >
            <X size={24}/>
          </button>
        </div>
        
        {/* Notifications List */}
        <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-120px)] pr-2 custom-scrollbar">
          {notifications.length > 0 ? (
            notifications.map((n) => (
              <div 
                key={n.id} 
                className={`
                  p-5 rounded-[1.5rem] border transition-all cursor-pointer group
                  ${n.unread 
                    ? 'bg-blue-50/40 border-blue-100' 
                    : 'bg-white border-slate-50 hover:bg-slate-50'
                  } 
                  hover:border-blue-200 hover:shadow-sm
                `}
              >
                <div className="flex justify-between items-start mb-1.5">
                  <p className="text-[11px] font-black text-[#1e3a5f] uppercase tracking-tight">
                    {n.title}
                  </p>
                  {n.unread && (
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <Circle size={8} className="relative fill-[#FDB813] text-[#FDB813]" />
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 font-bold mb-3 leading-relaxed">
                  {n.desc}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-[9px] text-slate-300 font-black uppercase tracking-[0.15em]">
                    {n.time}
                  </span>
                  <div className="h-1 w-1 bg-slate-200 rounded-full" />
                </div>
              </div>
            ))
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-center opacity-30">
              <Bell className="mb-2" size={32} />
              <p className="text-xs font-black uppercase">Clear for now</p>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}