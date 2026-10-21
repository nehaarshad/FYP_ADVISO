// components/PageHeader.tsx
import React from "react";
import { FileText, Plus, Upload } from "lucide-react";
import VideoModal from "../supportingVideos/createVideoModal";

interface PageHeaderProps {
  onBack: () => void;
  onCreate: () => void;
  onUploadVideo: () => void;
  isVideoModalOpen?: boolean;
  onVideoModalClose?: () => void;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ 
  onCreate, 
  onUploadVideo,
  isVideoModalOpen,
  onVideoModalClose 
}) => {
  return (
    <div className="mb-6 pb-6 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      
      {/* Title Section */}
      <div>
        <h2 className="text-2xl font-bold text-[#1e3a5f] flex items-center gap-2">
          <FileText className="text-[#1e3a5f]" size={24} />
          Degree Guidelines
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Manage academic guidelines and requirements
        </p>
      </div>

      {/* Buttons Section */}
      <div className="flex gap-3">
        <button
          onClick={onCreate}
          className="flex items-center gap-2 bg-[#1e3a5f] text-white px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-[#152a45] transition-all shadow-sm"
        >
          <Plus size={16} />
          Add Guideline
        </button>
        <button
          onClick={onUploadVideo}
          className="flex items-center gap-2 bg-[#1e3a5f] text-white px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-[#152a45] transition-all shadow-sm"
        >
          <Upload size={16} />
          Upload Video
        </button>
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