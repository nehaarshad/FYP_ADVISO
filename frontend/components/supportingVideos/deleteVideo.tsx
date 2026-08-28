/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { Trash2, Loader2, X, AlertTriangle } from "lucide-react";

interface DeleteVideoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
  videoTitle?: string;
}

export default function DeleteVideoDialog({
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
  videoTitle,
}: DeleteVideoDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="text-center">
          {/* Icon */}
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 size={32} className="text-red-500" />
          </div>

          {/* Title */}
          <h3 className="text-lg font-black text-[#1e3a5f] mb-2">Delete Video?</h3>

          {/* Description */}
          <p className="text-slate-500 text-sm mb-2">
            This action cannot be undone. Are you sure you want to delete this video?
          </p>
          {videoTitle && (
            <p className="text-xs text-slate-400 bg-slate-50 p-2 rounded-lg mb-4">
             <b>{videoTitle}</b> 
            </p>
          )}
          <p className="text-xs text-red-500 mb-6 flex items-center justify-center gap-1">
            <AlertTriangle size={14} />
            This will permanently remove the video from the system
          </p>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="flex-1 px-6 py-3 bg-slate-100 text-slate-600 rounded-xl text-xs font-black uppercase hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className="flex-1 px-6 py-3 bg-red-500 text-white rounded-xl text-xs font-black uppercase hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isDeleting ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Trash2 size={16} />
              )}
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}