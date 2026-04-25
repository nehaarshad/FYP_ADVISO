// app/components/ProgramList.tsx
'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, RefreshCw, AlertCircle, Loader2 } from 'lucide-react';
import { usePrograms } from '@/src/hooks/programHook/useProgram'

export function ProgramList() {
  const { programs, isLoading, error, fetchPrograms, totalCount } = usePrograms();

  useEffect(() => {
    fetchPrograms();
  }, []);

  if (isLoading && programs.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 size={32} className="animate-spin text-[#FDB813]" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2d4a6f] p-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 bg-[#FDB813]/20 rounded-xl flex items-center justify-center">
              <BookOpen size={24} className="text-[#FDB813]" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white uppercase italic">Programs</h2>
              <p className="text-white/70 text-xs mt-1">{totalCount} program(s) available</p>
            </div>
          </div>
          <button
            onClick={() => fetchPrograms()}
            className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
            title="Refresh"
          >
            <RefreshCw size={18} className="text-white" />
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-6">
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
            <AlertCircle size={20} className="text-red-500" />
            <p className="text-red-600 text-sm flex-1">{error}</p>
            <button
              onClick={() => fetchPrograms()}
              className="px-3 py-1 bg-red-600 text-white rounded-lg text-xs font-bold"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Programs Grid */}
      {!error && (
        <div className="p-6">
          {programs.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen size={48} className="mx-auto text-slate-300 mb-4" />
              <p className="text-slate-500 font-bold">No programs found</p>
              <p className="text-slate-400 text-sm mt-1">Add your first program using the form above</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {programs.map((program, index) => (
                <motion.div
                  key={program.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-slate-50 rounded-xl p-4 border border-slate-100 hover:shadow-md transition-all group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-[#1e3a5f]/10 rounded-lg flex items-center justify-center group-hover:bg-[#1e3a5f] transition-colors">
                        <BookOpen size={18} className="text-[#1e3a5f] group-hover:text-white" />
                      </div>
                      <div>
                        <h3 className="font-black text-[#1e3a5f] text-sm uppercase tracking-tight">
                          {program.programName}
                        </h3>
                        <p className="text-[9px] text-slate-400 uppercase tracking-wider">
                          ID: {program.id}
                        </p>
                      </div>
                    </div>
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