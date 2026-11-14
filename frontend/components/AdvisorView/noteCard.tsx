// components/AdvisorView/NoteCard.tsx (Auto-expand version)
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Clock, FileText, Edit2, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { AdvisorNote } from '@/src/models/AdvisorNotes';
import { getNoteColor } from '@/src/utilits/const/notesColor';

interface NoteCardProps {
  note: AdvisorNote;
  onEdit: (note: AdvisorNote) => void;
  onDelete: (note: AdvisorNote) => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({ note, onEdit, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [needsExpand, setNeedsExpand] = useState(false);
  const contentRef = useRef<HTMLParagraphElement>(null);
  const color = getNoteColor(note.id);

  useEffect(() => {
    if (contentRef.current) {
      // Check if content height exceeds 3 lines (approx 72px)
      const lineHeight = 20; // approximate
      const maxLines = 6;
      const maxHeight = lineHeight * maxLines;
      setNeedsExpand(contentRef.current.scrollHeight > maxHeight);
    }
  }, [note.noteContent]);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
    } catch {
      return dateString;
    }
  };

  const rotation = ((Number(note.id) * 7) % 5) - 2;

  return (
    <div 
      className={`${color.bg} border-3 ${color.border} rounded-[1.5rem] p-5 md:p-6 flex flex-col shadow-md hover:shadow-xl transition-all duration-300 relative group ${color.shadow} ${color.hoverShadow}`}
      style={{
        transform: `rotate(${rotation}deg)`,
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        minHeight: isExpanded ? 'auto' : '220px',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = `rotate(0deg) scale(1.02)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = `rotate(${rotation}deg) scale(1)`;
      }}
    >

      {/* Action Buttons */}
      <div className="absolute top-4 left-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 z-10">
        <button
          onClick={() => onEdit(note)}
          className="p-1.5 bg-white/90 backdrop-blur-sm rounded-lg text-[#1e3a5f] border border-slate-200 hover:bg-white transition-colors shadow-md"
          title="Edit note"
        >
          <Edit2 size={16} />
        </button>
        <button
          onClick={() => onDelete(note)}
          className="p-1.5 bg-white/90 backdrop-blur-sm rounded-lg text-red-500 border border-slate-200 hover:bg-red-50 transition-colors shadow-md"
          title="Delete note"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Content */}
      <div className="mt-8 relative z-10 flex-1">
        <h3 className={`text-base md:text-lg font-bold ${color.text}  mb-3`}>
          {note.title}
        </h3>
        
        <div className="relative">
          <p 
            ref={contentRef}
            className={`text-[13px] md:text-[14px] font-medium ${color.text} leading-relaxed opacity-90 whitespace-pre-wrap break-words ${
              !isExpanded ? 'line-clamp-6' : ''
            }`}
          >
            {note.noteContent}
          </p>
          
          {!isExpanded && needsExpand && (
            <div className={`absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-${color.bg} to-transparent pointer-events-none`} />
          )}
        </div>

        {needsExpand && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-2 text-[12px] font-bold  tracking-widest text-slate-600 hover:text-slate-900 flex items-center gap-1 transition-colors"
          >
            {isExpanded ? (
              <>
                Show Less <ChevronUp size={16} />
              </>
            ) : (
              <>
                Read More <ChevronDown size={16} />
              </>
            )}
          </button>
        )}
      </div>

      {/* Footer */}
      <div className={`flex items-center justify-end mt-4 pt-4 border-t ${color.border} relative z-10`}>
        <div className="flex items-center gap-1.5 text-slate-600">
          <Clock size={16} />
          <span className="text-[12px] font-bold  tracking-widest opacity-70">
            {formatDate(note.updatedAt || note.createdAt)}
          </span>
        </div>
       
      </div>
    </div>
  );
};