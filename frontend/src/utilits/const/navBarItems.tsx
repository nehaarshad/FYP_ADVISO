import {
  LayoutDashboard, Users, ClipboardList, FileText,
  AlertTriangle, StickyNote, MessageSquare,
  BookOpen, Bell, UserPlus, UserCog, ShieldCheck,
  Info, Database, FileSpreadsheet, Map, GraduationCap, FileSearch,
  User
} from "lucide-react";

export type UserRole = "coordinator" | "advisor" | "student";

export interface NavItem {
  key: string;          
  label: string;
  icon: React.ReactNode;
  group?: string;       
  subItems?: NavItem[]; 
}

export const NAV_CONFIG: Record<UserRole, NavItem[]> = {
  coordinator: [
    { key: "overview",        label: "Overview",       icon: <LayoutDashboard size={20}/> },
    { key: "registration",    label: "Registration",   icon: <UserPlus size={20}/>, group: "Users",
      subItems: [
        { key: "add-student",  label: "New Student",  icon: <GraduationCap size={16}/> },
        { key: "add-faculty",  label: "New Faculty",  icon: <Users size={16}/> },
        { key: "all-program",  label: "All Students", icon: <Users size={16}/> },
      ]
    },
    { key: "edit-student",    label: "Edit Student",   icon: <UserCog size={20}/>,   group: "Management" },
    { key: "edit-advisor",    label: "Batch Advisor",  icon: <ShieldCheck size={20}/> , group: "Management" },
    { key: "requests",        label: "Requests",       icon: <FileText size={20}/>, }, 
    { key: "guidelines",      label: "Guidelines",     icon: <Info size={20}/> },
  ],

  advisor: [
    { key: "Overview",        label: "Overview",        icon: <LayoutDashboard size={20}/> },
    { key: "Meetings",        label: "Meetings",        icon: <ClipboardList size={20}/> },
    { key: "Notes",           label: "Advisor Notes",   icon: <StickyNote size={20}/> },
    { key: "AdvisorChat",     label: "Advisor Chat",    icon: <MessageSquare size={20}/> },
    { key: "AdvisoryLogs",     label: "Advisory Logs",    icon: <MessageSquare size={20}/> },
    { key: "guidelines",      label: "Guidelines",     icon: <Info size={20}/> },
   ],

  student: [
    { key: "overview",        label: "Overview",        icon: <LayoutDashboard size={20}/> },
    { key: "my-roadmap",      label: "My Roadmap",      icon: <FileText size={20}/>, group: "Student Portal" },
    { key: "notifications",   label: "Notifications",   icon: <FileText size={20}/> },
    { key: "submit-request",  label: "Submit Request",  icon: <FileText size={20}/> },
  ],
};