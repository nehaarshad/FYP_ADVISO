// components/PageHeader.tsx
import React from "react";
import { ArrowLeft, FileText, Plus, Upload } from "lucide-react";
import VideoModal from "../supportingVideos/createVideoModal";

interface PageHeaderProps {
  onBack: () => void;
  onCreate: () => void;
  onUploadVideo: () => void;
  isVideoModalOpen?: boolean;
  onVideoModalClose?: () => void;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ 
  onBack, 
  onCreate, 
  onUploadVideo,
  isVideoModalOpen,
  onVideoModalClose 
}) => {
  return (
    <div className="p-4 md:p-6 shrink-0 border-b border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            title="Go back"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-xl md:text-2xl font-black text-[#1e3a5f] uppercase tracking-tighter flex items-center gap-2">
              <FileText className="text-amber-500" size={24} />
              Degree Guidelines
            </h2>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
              Manage academic guidelines and requirements
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onCreate}
            className="flex items-center gap-2 bg-[#1e3a5f] text-white px-4 py-2.5 rounded-xl text-xs font-black uppercase hover:bg-[#15304a] transition-all shadow-lg hover:shadow-xl active:scale-95"
          >
            <Plus size={16} />
            Add Guideline
          </button>
          <button
            onClick={onUploadVideo}
            className="flex items-center gap-2 bg-amber-500 text-white px-4 py-2.5 rounded-xl text-xs font-black uppercase hover:bg-amber-600 transition-all shadow-lg hover:shadow-xl active:scale-95"
          >
            <Upload size={16} />
            Upload Video
          </button>
        </div>
      </div>

      {/* Video Modal */}
      {isVideoModalOpen && onVideoModalClose && (
        <VideoModal
          isOpen={isVideoModalOpen}
          onClose={onVideoModalClose}
          editingVideo={null}
          formData={{ title: "", description: "" }}
          formErrors={{}}
          isLoading={false}
          uploadProgress={0}
          onInputChange={() => {}}
          onFileSelect={() => {}}
          onSubmit={async () => {}}
          onRemoveFile={() => {}}
          selectedFile={null}
          videoPreview={null}
        />
      )}
    </div>
  );
};