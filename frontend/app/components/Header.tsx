import React from 'react';
import { Search, Bell } from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ searchQuery, setSearchQuery }) => {
  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b px-10 flex items-center justify-between shrink-0 sticky top-0 z-40">
      <div className="relative w-96">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
        <input 
          type="text" 
          placeholder="Search by name or SAP ID..." 
          className="w-full bg-slate-100 border-none rounded-full py-2.5 pl-12 pr-4 text-xs font-bold outline-none focus:ring-2 focus:ring-amber-400 transition-all" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:text-[#1e3a5f] cursor-pointer transition-all relative">
          <Bell size={20}/>
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-amber-400 rounded-full border-2 border-white"></span>
        </div>
        <div className="w-10 h-10 bg-[#1e3a5f] rounded-xl border-2 border-amber-400 flex items-center justify-center text-white font-black italic uppercase">JF</div>
      </div>
    </header>
  );
};