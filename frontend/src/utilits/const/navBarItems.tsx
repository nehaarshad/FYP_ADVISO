
import {
  LayoutDashboard, Users, ClipboardList, FileText,
  AlertTriangle, StickyNote, MessageSquare,
  BookOpen, Bell, UserPlus, UserCog, ShieldCheck,
  Info, Database, FileSpreadsheet, Map, GraduationCap, FileSearch,
  User,
  Lightbulb
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
    { key: "overview", label: "Overview", icon: <LayoutDashboard size={20}/> },
    { 
      key: "registration", label: "Registration", icon: <UserPlus size={20}/>, 
      group: "Users Management",
      subItems: [
        { key: "add-student", label: "New Student", icon: <GraduationCap size={16}/> },
        { key: "add-faculty", label: "New Faculty", icon: <Users size={16}/> },
        { key: "bulk-student-upload", label: "Add Multiple Students", icon: <FileSpreadsheet size={16}/> },
      ]
    },
    { key: "edit-student", label: "Student", icon: <GraduationCap size={20}/>, group: "Users Management" },
    { key: "edit-advisor", label: "Batch Advisor", icon: <ShieldCheck size={20}/>, group: "Users Management" },
    { key: "requests", label: "Requests", icon: <FileText size={20}/>, group: "Communication" }, 
    { key: "guidelines", label: "Guidelines", icon: <Info size={20}/>, group: "Communication" },
  ],

  advisor: [
    { key: "overview", label: "Overview", icon: <LayoutDashboard size={20}/>, },
    { key: "meetings", label: "Meetings", icon: <ClipboardList size={20}/>, group: "Advisory" },
    { key: "notes", label: "Advisor Notes", icon: <StickyNote size={20}/>, group: "Advisory" },
    { key: "advisor-chat", label: "Advisor Chat", icon: <MessageSquare size={20}/>, group: "Advisory" },
    { key: "advisory-logs", label: "Advisory Logs", icon: <FileText size={20}/>, group: "Advisory" },
    { key: "guidelines", label: "Guidelines", icon: <Info size={20}/>, group: "Resources" },
    { key: "faculty-recommendation", label: "Faculty Recommendation", icon: <Lightbulb size={20}/>, group: "Resources" },
  ],

  student: [
    { key: "Overview",        label: "Overview",        icon: <LayoutDashboard size={20}/> },
    { key: "StudentChat",     label: "StudentChat",    icon: <MessageSquare size={20}/> },
    { key: "RequestsFoam",     label: "Submit Request",    icon: <FileText size={20}/> },
    { key: "guidelines",      label: "Guidelines",     icon: <Info size={20}/> },
   // { key: "AdvisorRemarks",      label: "Advisory logs",      icon: <FileText size={20}/>},
    
  ],
};