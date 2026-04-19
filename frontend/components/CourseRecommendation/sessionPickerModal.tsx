import React, { useState } from 'react';
import { X, Sparkles, Calendar, ChevronDown, Loader2 } from 'lucide-react';
 
interface SessionPickerModalProps {
  isOpen: boolean;
  studentName: string;
  isGenerating: boolean;
  onConfirm: (sessionType: string, sessionYear: number) => void;
  onClose: () => void;
}
 
const CURRENT_YEAR = new Date().getFullYear();
const SESSION_TYPES = ['FALL', 'SPRING', 'SUMMER'];
 
export const SessionPickerModal: React.FC<SessionPickerModalProps> = ({
  isOpen,
  studentName,
  isGenerating,
  onConfirm,
  onClose,
}) => {
  const [sessionType, setSessionType] = useState('FALL');
  const [sessionYear, setSessionYear] = useState(CURRENT_YEAR);
 
  if (!isOpen) return null;
 
  const handleConfirm = () => {
    if (!isGenerating) onConfirm(sessionType, sessionYear);
  };
 
  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[2rem] w-full max-w-md p-7 shadow-2xl animate-in zoom-in-95 duration-200">
 
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-[9px] font-black text-amber-500 uppercase tracking-[0.15em] mb-1">
              Step 1 of 1
            </p>
            <h3 className="text-lg font-black text-[#1e3a5f] uppercase tracking-tighter leading-tight">
              Select Session
            </h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">
              For: <span className="text-[#1e3a5f]">{studentName}</span>
            </p>
          </div>
          <button
            title='type'
            onClick={onClose}
            disabled={isGenerating}
            className="w-8 h-8 flex items-center justify-center bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-full transition-colors"
          >
            <X size={16} />
          </button>
        </div>
 
        {/* Session Type */}
        <div className="space-y-2 mb-4">
          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
            Session Type
          </label>
          <div className="grid grid-cols-3 gap-2">
            {SESSION_TYPES.map(type => (
              <button
                key={type}
                onClick={() => setSessionType(type)}
                className={`py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${
                  sessionType === type
                    ? 'bg-[#1e3a5f] text-white border-[#1e3a5f]'
                    : 'bg-slate-50 text-slate-500 border-slate-100 hover:border-slate-300'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
 
        {/* Session Year */}
        <div className="space-y-2 mb-7">
          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
            Session Year
          </label>
          <div className="relative">
            <Calendar size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
              title='session year'
              value={sessionYear}
              onChange={e => setSessionYear(parseInt(e.target.value))}
              className="w-full pl-10 pr-10 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-black text-[#1e3a5f] focus:ring-2 ring-amber-400 outline-none appearance-none cursor-pointer"
            ></input>
          </div>
        </div>
 
        {/* CTA */}
        <button
          onClick={handleConfirm}
          disabled={isGenerating}
          className="w-full flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 disabled:opacity-60 disabled:cursor-not-allowed text-[#1e3a5f] py-4 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all shadow-lg shadow-amber-100 active:scale-[0.98]"
        >
          {isGenerating ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Analyzing Transcript...
            </>
          ) : (
            <>
              <Sparkles size={14} />
              Generate Recommendations
            </>
          )}
        </button>
 
        {isGenerating && (
          <p className="text-center text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-3">
            AI is analyzing roadmap & transcript. This may take a moment.
          </p>
        )}
      </div>
    </div>
  );
};
 