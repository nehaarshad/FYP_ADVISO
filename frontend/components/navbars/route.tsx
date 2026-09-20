/* eslint-disable @typescript-eslint/no-explicit-any */
// components/navbars/route.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, LogOut } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import {
  NAV_CONFIG,
  NavItem,
  UserRole,
} from "@/src/utilits/const/navBarItems";
import { useAuth } from "@/src/hooks/authHook/useAuth";
import { sessionManager } from "@/src/services/sessionManagement/sessionManager";
import { useUserProfile } from "@/src/hooks/profileHook/useProfile";

interface SidebarProps {
  userRole: UserRole;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  userRole,
  activeTab,
  setActiveTab,
}) => {
  const router = useRouter();
  const [userInitial] = useState<string>("A");

  const { logout } = useAuth();
  const { getDisplayName } = useUserProfile();

  const navItems = NAV_CONFIG[userRole] ?? [];

  const handleLogout = async () => {
    try {
      const currentUser = sessionManager.getCurrentUser<any>();

      if (currentUser?.id) {
        await logout(currentUser.id);
      } else {
        sessionManager.destroySession();
      }

      router.push("/views/auth/login");
    } catch (error) {
      console.error("Logout error:", error);
      sessionManager.destroySession();
      router.push("/views/auth/login");
    }
  };

  const grouped: { group: string; items: NavItem[] }[] = [];

  for (const item of navItems) {
    const groupName = item.group ?? "General";
    const existingGroup = grouped.find((g) => g.group === groupName);

    if (existingGroup) {
      existingGroup.items.push(item);
    } else {
      grouped.push({
        group: groupName,
        items: [item],
      });
    }
  }

  return (
    <aside className="h-screen max-h-screen w-80 bg-[#1e3a5f] text-white flex flex-col px-4 py-3 shrink-0 shadow-xl z-50 overflow-hidden">

      {/* Logo */}
      <div className="pt-4 pb-3 flex-shrink-0 flex justify-center">
        <img
          src="/lightLogo.png"
          alt="Adviso Logo"
          className="w-30 h-auto object-contain drop-shadow-md -translate-x-2"
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1 min-h-0 px-1 overflow-hidden">
        {grouped.map(({ group, items }) => (
          <div key={group} className="py-2.5">

            {/* Group Heading */}
            <p className="px-5 text-[10px] font-bold uppercase tracking-[0.18em] text-white/30 mb-2.5">
              {group}
            </p>

            {/* Navigation Items */}
            <div className="space-y-1.5">
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
          </div>
        ))}
      </nav>

      {/* User Profile Section */}
      <div className="px-1 pt-2 pb-1 mt-auto flex-shrink-0">
        <div
          className={`p-4 rounded-[1.5rem] border transition-all group ${
            activeTab === "profile"
              ? "bg-white/20 border-white/20 shadow-lg"
              : "bg-gradient-to-b from-white/10 to-transparent border-white/5 hover:bg-white/5"
          }`}
        >
          {/* Profile */}
          <div
            onClick={() => setActiveTab("profile")}
            className="flex items-center gap-3 mb-3 cursor-pointer"
          >
            <div className="h-10 w-10 rounded-full bg-[#FDB813] border-2 border-[#1e3a5f] flex items-center justify-center font-bold text-[#1e3a5f] text-sm uppercase shrink-0">
              {userInitial}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold  truncate">
                {getDisplayName()}
              </p>

              <p className="text-[9px] opacity-50 font-bold uppercase tracking-tighter">
                {userRole}
              </p>
            </div>
          </div>

          {/* Sign Out */}
          <button
            onClick={handleLogout}
            className="w-full py-2.5 bg-white/5 hover:bg-red-500/20 hover:text-red-400 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
};

function ExpandableItem({
  item,
  activeTab,
  setActiveTab,
}: {
  item: NavItem;
  activeTab: string;
  setActiveTab: (t: string) => void;
}) {
  const isChildActive = item.subItems?.some(
    (s) => s.key === activeTab
  );

  const [open, setOpen] = useState(isChildActive ?? false);

  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center gap-4 px-5 py-[13.2px] rounded-xl transition-all ${
          open
            ? "bg-white/10"
            : "hover:bg-white/5 opacity-70 hover:opacity-100"
        }`}
      >
        <div className="text-lg shrink-0">
          {item.icon}
        </div>

        <span className="text-sm font-bold truncate">
          {item.label}
        </span>

        <ChevronRight
          size={18}
          className={`ml-auto shrink-0 transition-transform ${
            open ? "rotate-90" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden pl-9 space-y-1.5 mt-1.5"
          >
            {item.subItems!.map((sub) => (
              <div
                key={sub.key}
                onClick={() => setActiveTab(sub.key)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all text-[10px] font-bold  ${
                  activeTab === sub.key
                    ? "text-[#FDB813] bg-white/10 opacity-100"
                    : "opacity-60 hover:opacity-100 hover:bg-white/10"
                }`}
              >
                {sub.icon}

                <span className="truncate">
                  {sub.label}
                </span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SidebarItem({
  icon,
  label,
  active,
  onClick,
}: any) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-4 px-5 py-[13.2px] rounded-xl cursor-pointer transition-all ${
        active
          ? "bg-[#FDB813] text-[#1e3a5f] font-bold shadow-xl scale-[1.01]"
          : "opacity-60 hover:opacity-100 hover:bg-white/5 font-bold"
      }`}
    >
      <span className="shrink-0">
        {icon}
      </span>

      <span className="text-sm tracking-tight truncate">
        {label}
      </span>
    </div>
  );
}

