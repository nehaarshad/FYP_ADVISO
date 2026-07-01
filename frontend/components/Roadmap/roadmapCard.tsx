import { Eye, BookOpen, GraduationCap, Calendar, Layers, Link2 } from 'lucide-react';
import { Roadmap } from './types';

interface RoadmapCardProps {
  roadmap: Roadmap;
  onView: () => void;
  onAssign: () => void;
}

export function RoadmapCard({ roadmap, onView, onAssign }: RoadmapCardProps) {
  const categories = roadmap.RoadmapCourseCategoryModels || [];
  const semesters = roadmap.SemesterRoadmapModels || [];
  
  return (
    <div className="p-6 hover:bg-slate-50/50 transition-all group">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 bg-[#1e3a5f]/10 rounded-xl flex items-center justify-center group-hover:bg-[#1e3a5f] transition-colors">
            <BookOpen size={22} className="text-[#1e3a5f] group-hover:text-white" />
          </div>
          <div>
            <h4 className="font-black text-[#1e3a5f] text-base uppercase tracking-tight">
              {roadmap.versionName}
            </h4>
            <div className="flex items-center gap-4 mt-1">
              <span className="text-[9px] font-black text-slate-400 uppercase flex items-center gap-1">
                <GraduationCap size={10} /> {roadmap.totalCreditHours} Credits
              </span>
              <span className="text-[9px] font-black text-slate-400 uppercase flex items-center gap-1">
                <Layers size={10} /> {categories.length} Categories
              </span>
              <span className="text-[9px] font-black text-slate-400 uppercase flex items-center gap-1">
                <Calendar size={10} /> {semesters.length} Semesters
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onAssign}
            className="px-4 py-2 bg-[#FDB813]/20 text-[#1e3a5f] rounded-xl text-[9px] font-black uppercase tracking-wider hover:bg-[#1e3a5f] hover:text-white transition-all flex items-center gap-2"
          >
            <Link2 size={14} /> Assign to Batch
          </button>
          <button
            onClick={onView}
            className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-[9px] font-black uppercase tracking-wider hover:bg-[#1e3a5f] hover:text-white transition-all flex items-center gap-2"
          >
            <Eye size={14} /> View Details
          </button>
        </div>
      </div>
    </div>
  );
}