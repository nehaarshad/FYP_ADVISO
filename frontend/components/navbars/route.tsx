/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { NAV_CONFIG, NavItem, UserRole } from "@/src/utilits/const/navBarItems";

interface SidebarProps {
  userRole: UserRole;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ userRole, activeTab, setActiveTab }) => {
  const router = useRouter();
  const navItems = NAV_CONFIG[userRole] ?? [];

  const grouped: { group: string | null; items: NavItem[] }[] = [];
  for (const item of navItems) {
    const last = grouped[grouped.length - 1];
    const g = item.group ?? null;
    if (!last || last.group !== g) grouped.push({ group: g, items: [item] });
    else last.items.push(item);
  }

  return (
    <aside className="w-70 bg-[#1e3a5f] text-white flex flex-col p-4 shrink-0 shadow-xl z-50 h-full">
      <div className="p-8 mb-4">
        <img src="/Lightlogo.png" alt="Adviso Logo" className="w-32 h-auto object-contain drop-shadow-md" />
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
        {grouped.map(({ group, items }) => (
          <div key={group ?? "default"} className="py-2">
            {group && (
              <p className="px-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-2">
                {group}
              </p>
            )}
            {items.map((item) =>
              item.subItems ? (
                <ExpandableItem
                  key={item.key}
                  item={item}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                />
              ) : (
                <SidebarItem
                  key={item.key}
                  icon={item.icon}
                  label={item.label}
                  active={activeTab === item.key}
                  onClick={() => setActiveTab(item.key)}
                />
              )
            )}
          </div>
        ))}
      </nav>

      <div className="p-2">
        <div className={`p-5 rounded-[2rem] border transition-all group ${
          activeTab === "profile"
            ? "bg-white/20 border-white/20 shadow-lg"
            : "bg-gradient-to-b from-white/10 to-transparent border-white/5 hover:bg-white/5"
        }`}>
          <div onClick={() => setActiveTab("profile")} className="flex items-center gap-3 mb-1 cursor-pointer">
            <div className="h-10 w-10 rounded-full bg-[#FDB813] border-2 border-[#1e3a5f] flex items-center justify-center font-black text-[#1e3a5f] text-xs uppercase">
              {userRole.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-xs font-black italic">Aleena Ayub</p>
              <p className="text-[10px] opacity-50 font-bold uppercase tracking-tighter">{userRole}</p>
            </div>
          </div>
          <button
            onClick={() => router.push("/views/auth/login")}
            className="w-full py-2 bg-white/5 hover:bg-red-500/20 hover:text-red-400 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95"
          >
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
};

function ExpandableItem({ item, activeTab, setActiveTab,}: {
  item: NavItem; activeTab: string; setActiveTab: (t: string) => void;
}) {
  const isChildActive = item.subItems?.some(s => s.key === activeTab);
  const [open, setOpen] = useState(isChildActive ?? false);
  return (
    <>
      <button
        onClick={() => setOpen(o => !o)}
        className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${
          open ? "bg-white/10" : "hover:bg-white/5 opacity-70 hover:opacity-100"
        }`}
      >
        <div className="text-xl">{item.icon}</div>
        <span className="text-sm font-bold">{item.label}</span>
        <ChevronRight size={20} className={`ml-auto transition-transform ${open ? "rotate-90" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden pl-10 space-y-1 mt-1"
          >
            {item.subItems!.map(sub => (
              <div
                key={sub.key}
                onClick={() => setActiveTab(sub.key)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all text-[11px] font-bold italic ${
                  activeTab === sub.key
                    ? "text-[#FDB813] bg-white/10 opacity-100"
                    : "opacity-60 hover:opacity-100 hover:bg-white/10"
                }`}
              >
                {sub.icon} <span>{sub.label}</span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function SidebarItem({ icon, label, active, onClick }: any) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-5 px-5 py-4 rounded-2xl cursor-pointer transition-all ${
        active
          ? "bg-[#FDB813] text-[#1e3a5f] font-black shadow-xl scale-[1.02]"
          : "opacity-60 hover:opacity-100 hover:bg-white/5 font-bold"
      }`}
    >
      {icon} <span className="text-sm tracking-tight">{label}</span>
    </div>
  );
}

