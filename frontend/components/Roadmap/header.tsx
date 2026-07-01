import { CloudUpload } from 'lucide-react';

interface RoadmapHeaderProps {
  showUploadForm: boolean;
  onToggleUpload: () => void;
}

export function RoadmapHeader({ showUploadForm, onToggleUpload }: RoadmapHeaderProps) {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
      <div>
        <h2 className="text-2xl font-black uppercase italic tracking-tighter text-[#1e3a5f]">
          Roadmap Management
        </h2>
        <p className="text-slate-500 text-sm mt-1">View, filter and manage academic roadmaps</p>
      </div>
      <button
        onClick={onToggleUpload}
        className="px-6 py-3 bg-[#1e3a5f] text-white rounded-xl font-black text-xs uppercase tracking-wider hover:bg-[#FDB813] transition-all flex items-center gap-2"
      >
        <CloudUpload size={16} />
        {showUploadForm ? 'Cancel' : 'Upload New Roadmap'}
      </button>
    </div>
  );
}