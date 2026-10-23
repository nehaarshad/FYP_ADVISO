// app/components/ProgramList.tsx
'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, RefreshCw, AlertCircle, Loader2 } from 'lucide-react';
import { usePrograms } from '@/src/hooks/programHook/useProgram';

export function ProgramList() {
  const { programs, isLoading, error, fetchPrograms, totalCount } = usePrograms();

  useEffect(() => {
    fetchPrograms();
  }, []);

  if (isLoading && programs.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 size={32} className="animate-spin text-[#1e3a5f]" />
      </div>
    );
  }

  return (
    <div className="mt-8 border-t border-slate-100 pt-8">
      
      {/* HEADER SECTION */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-sm font-bold text-[#1e3a5f] uppercase tracking-wider">
            All Programs ({totalCount})
          </h3>
        </div>
        
        <button
          onClick={() => fetchPrograms()}
          className="p-2 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors"
          title="Refresh List"
        >
          <RefreshCw size={16} className="text-[#1e3a5f]" />
        </button>
      </div>

      {/* ERROR STATE */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
          <AlertCircle size={20} className="text-red-500" />
          <p className="text-red-600 text-sm flex-1">{error}</p>
          <button
            onClick={() => fetchPrograms()}
            className="px-3 py-1 bg-red-600 text-white rounded-lg text-xs font-bold"
          >
            Retry
          </button>
        </div>
      )}

      {/* PROGRAMS GRID (Same style as Roadmap cards) */}
      {!error && (
        <div>
          {programs.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <BookOpen size={48} className="mx-auto text-slate-300 mb-4" />
              <p className="text-slate-500 font-bold">No programs found</p>
              <p className="text-slate-400 text-sm mt-1">Add your first program using the form above</p>
            </div>
          ) : (
            <div className="space-y-3">
              {programs.map((program, index) => (
                <motion.div
                  key={program.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border border-slate-200 bg-white rounded-xl p-4 flex items-center gap-4 hover:border-slate-300 transition-all"
                >
                  <div className="h-10 w-10 bg-slate-50 rounded-lg flex items-center justify-center shrink-0">
                    <BookOpen size={18} className="text-[#1e3a5f]" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-[#1e3a5f] text-sm capitalize">
                      {program.programName}
                    </h4>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">
                      ID: {program.id}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}