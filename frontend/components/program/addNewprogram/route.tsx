// app/components/AddProgram.tsx
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, BookOpen, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { usePrograms } from '@/src/hooks/programHook/useProgram'

export function AddProgram() {
  const [programName, setProgramName] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const { addProgram, isLoading, error, clearError } = usePrograms();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    clearError();
    
    const result = await addProgram(programName);
    
    if (result.success) {
      setSuccessMessage(result.message || 'Program added successfully!');
      setProgramName('');
      setTimeout(() => {
        setShowForm(false);
        setSuccessMessage(null);
      }, 2000);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2d4a6f] p-6">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 bg-[#FDB813]/20 rounded-xl flex items-center justify-center">
              <BookOpen size={24} className="text-[#FDB813]" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white uppercase italic">Program Management</h2>
              <p className="text-white/70 text-xs mt-1">Add and manage academic programs</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="w-full py-4 bg-[#1e3a5f] text-white rounded-xl font-black text-xs uppercase tracking-wider hover:bg-[#FDB813] hover:text-[#1e3a5f] transition-all flex items-center justify-center gap-2"
            >
              <Plus size={18} />
              Add New Program
            </button>
          ) : (
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2">
                  <AlertCircle size={16} className="text-red-500" />
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}
              
              {successMessage && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-500" />
                  <p className="text-green-600 text-sm">{successMessage}</p>
                </div>
              )}
              
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                  Program Name
                </label>
                <input
                  type="text"
                  value={programName}
                  onChange={(e) => setProgramName(e.target.value)}
                  placeholder="e.g., Computer Science"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-[#FDB813] outline-none transition-all mt-1"
                  required
                  autoFocus
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-3 bg-[#1e3a5f] text-white rounded-xl font-black text-xs uppercase tracking-wider hover:bg-[#FDB813] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                  {isLoading ? 'Adding...' : 'Add Program'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setProgramName('');
                    clearError();
                    setSuccessMessage(null);
                  }}
                  className="px-6 py-3 bg-slate-100 text-slate-600 rounded-xl font-black text-xs uppercase tracking-wider hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
              </div>
            </motion.form>
          )}
        </div>
      </div>
    </div>
  );
}