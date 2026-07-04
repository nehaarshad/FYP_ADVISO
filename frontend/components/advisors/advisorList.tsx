/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, User, Mail, Phone, 
  CheckCircle, XCircle, 
  Users, Layers, Eye, Edit,
  Loader2, AlertCircle, Power,
  Trash2
} from 'lucide-react';
import { useAdvisors } from '@/src/hooks/advisorHooks/useAdvisorHook';
import { AdvisorDetailsModal } from './advisorDetailModal';
import { EditAdvisor } from '../../app/components/EditAdvisor';
import { useAuth } from '@/src/hooks/authHook/useAuth';

export function AdvisorsList() {
  const [searchInput, setSearchInput] = useState('');
  const [selectedAdvisor, setSelectedAdvisor] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<number | null>(null);
  const [statusError, setStatusError] = useState<string | null>(null);
 
  const {
    advisors,
    isLoading,
    error,
    searchAdvisors,
    fetchAdvisors,
  } = useAdvisors();

  const { updateUserStatus } = useAuth();

  const handleSearch = () => {
    searchAdvisors(searchInput);
  };

  const handleViewDetails = (advisor: any) => {
    setSelectedAdvisor(advisor);
    setShowDetailsModal(true);
  };

  const editAdvisor = (advisor: any) => {
    setSelectedAdvisor(advisor);
    setShowEditModal(true);
  };

  // Handle status toggle (activate/deactivate)
  const handleToggleStatus = async (advisor: any) => {
    try {
      setUpdatingStatus(advisor.id);
      setStatusError(null);
      
      // Determine current status
      const currentStatus = advisor.User?.isActive ? 'inactive' : 'active';
      const sapid = advisor.User?.sapid;
      
      if (!sapid) {
        throw new Error('SAP ID not found for this advisor');
      }

      // Call the update status function
      const result = await updateUserStatus(sapid, currentStatus);
      
      if (result.success) {
        // Refresh the advisors list to reflect the change
        await fetchAdvisors(true);
        
        // Optional: Show success toast/notification
        console.log(`Advisor ${advisor.advisorName} ${currentStatus === 'active' ? 'activated' : 'deactivated'} successfully`);
      } else {
        throw new Error(result.error || 'Failed to update status');
      }
    } catch (error: any) {
      setStatusError(error.message || 'Failed to update advisor status');
      console.error('Error toggling advisor status:', error);
      
      // Optional: Show error toast/notification
    } finally {
      setUpdatingStatus(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 size={40} className="animate-spin text-[#FDB813] mx-auto mb-4" />
          <p className="text-slate-500 font-bold">Loading advisors...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
        <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
        <p className="text-red-600 font-bold mb-2">Error loading advisors</p>
        <p className="text-red-500 text-sm">{error}</p>
        <button 
          onClick={() => fetchAdvisors(true)}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-bold"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Search and Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search by name, SAP ID, or email..."
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#FDB813] outline-none transition-all"
            />
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={handleSearch}
              className="px-6 py-3 bg-[#1e3a5f] text-white rounded-xl font-black text-xs uppercase tracking-wider hover:bg-[#FDB813] transition-all"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Status Error Message */}
      {statusError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2">
          <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
          <p className="text-red-600 text-sm font-medium">{statusError}</p>
          <button 
            onClick={() => setStatusError(null)}
            className="ml-auto text-red-400 hover:text-red-600"
          >
            ×
          </button>
        </div>
      )}

      {/* Advisors Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-wider">Advisor</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-wider">Batch Assignment</th>
                <th className="px-6 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {advisors.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <Users size={48} className="mx-auto text-slate-300 mb-4" />
                    <p className="text-slate-500 font-bold">No advisors found</p>
                    <p className="text-slate-400 text-sm">Try adjusting your filters</p>
                  </td>
                </tr>
              ) : (
                advisors.map((advisor: any, index: number) => (
                  <motion.tr
                    key={advisor.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-[#1e3a5f]/10 flex items-center justify-center group-hover:bg-[#1e3a5f] transition-colors">
                          <User size={18} className="text-[#1e3a5f] group-hover:text-white" />
                        </div>
                        <div>
                          <p className="font-black text-[#1e3a5f] text-sm uppercase tracking-tight">
                            {advisor.advisorName}
                          </p>
                          <p className="text-[10px] text-slate-400 uppercase tracking-wider">
                            SAP ID: {advisor.User?.sapid}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Mail size={12} className="text-slate-400" />
                          <p className="text-[11px] text-slate-600">{advisor.email}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone size={12} className="text-slate-400" />
                          <p className="text-[11px] text-slate-600">{advisor.contactNumber}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                        {(() => {
                          const activeAssignment = advisor.BatchAssignments?.find(
                            (assignment: any) => assignment.isCurrentlyAdvised === true
                          );
                          const displayAssignment = activeAssignment || advisor.BatchAssignments?.[0];
                          
                          if (displayAssignment) {
                            return (
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <Layers size={12} className="text-slate-400" />
                                  <p className="text-[11px] font-bold text-[#1e3a5f]">
                                    {displayAssignment.BatchModel?.batchName} {displayAssignment.BatchModel?.batchYear}
                                  </p>
                                </div>
                                <p className="text-[9px] text-slate-400">
                                  {displayAssignment.BatchModel?.ProgramModel?.programName}
                                </p>
                                {displayAssignment.isCurrentlyAdvised && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-[8px] font-black">
                                    <CheckCircle size={8} />
                                    Current
                                  </span>
                                )}
                              </div>
                            );
                          } else {
                            return <p className="text-[11px] text-slate-400 italic">Not Assigned</p>;
                          }
                        })()}
                      </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[9px] font-black uppercase ${
                        advisor.User?.isActive 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {advisor.User?.isActive ? (
                          <CheckCircle size={10} />
                        ) : (
                          <XCircle size={10} />
                        )}
                        {advisor.User?.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1">


                        {/* View Details Button */}
                        <button
                          onClick={() => handleViewDetails(advisor)}
                          className="p-2 rounded-lg text-slate-400 hover:text-[#1e3a5f] hover:bg-slate-100 transition-all"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>

                        {/* Edit Button */}
                        <button
                          onClick={() => editAdvisor(advisor)}
                          className="p-2 rounded-lg text-slate-400 hover:text-[#1e3a5f] hover:bg-slate-100 transition-all"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                         {/* Toggle Status Button */}
                        <button
                          onClick={() => handleToggleStatus(advisor)}
                          disabled={updatingStatus === advisor.id}
                          className={`p-2 rounded-lg transition-all flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider ${
                            advisor.User?.isActive
                              ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                              : 'bg-green-50 text-green-600 hover:bg-green-100 border border-green-200'
                          } ${
                            updatingStatus === advisor.id ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                          title={advisor.User?.isActive ? 'Deactivate Account' : 'Activate Account'}
                        >
                          {updatingStatus === advisor.id ? (
                            <>
                              <Loader2 size={14} className="animate-spin" />
                              <span className="hidden sm:inline">Processing...</span>
                            </>
                          ) : (
                            <>
                              <Power size={14} />
                              <span className="hidden sm:inline">
                                {advisor.User?.isActive ? 'Deactivate' : 'Activate'}
                              </span>
                            </>
                          )}
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Advisor Details Modal */}
      <AdvisorDetailsModal
        isOpen={showDetailsModal}
        advisor={selectedAdvisor}
        onClose={() => setShowDetailsModal(false)}
      />
      <EditAdvisor
        isOpen={showEditModal}
        advisor={selectedAdvisor}
        onClose={() => setShowEditModal(false)}
      />
    </div>
  );
}