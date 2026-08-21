/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { FacultyRecommendationProps } from './type/type';
import { CreateRecommendationData, AddCommentData } from '@/src/hooks/facultyRecommendation/type/facultyRecommType';
import { useFacultyRecommendations } from '@/src/hooks/facultyRecommendation/facultyRecommendationHook';
import { sessionManager } from '@/src/services/sessionManagement/sessionManager';
import { CreateRecommendationModal } from './createRecommModal';
import { RecommendationDetail } from './recommDetails';
import { RecommendationCard } from './recommendationCard';
import { EmptyState } from '../states/emptystate';
import { FilterBar } from './filterBar';
import { useUserProfile } from '@/src/hooks/profileHook/useProfile';

export const FacultyRecommendation: React.FC<FacultyRecommendationProps> = ({
  onBack,
  initialFilters,
}) => {
  // State
  const currentUser = sessionManager.getCurrentUser<any>();
  const userId = currentUser?.data?.id || currentUser?.id;
  
  const { userProfile } = useUserProfile();
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedRec, setSelectedRec] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedPostingAdvisor, setSelectedPostingAdvisor] = useState<number | undefined>(
    undefined
  );
  const [showMyIssues, setShowMyIssues] = useState(false);
  const [editingRecommendation, setEditingRecommendation] = useState<any>(null);

  // Hooks
  const {
    recommendations,
    isLoading,
    isCreating,
    isCommenting,
    error,
    openCount,
    totalCount,
    createNewRecommendation,
    addCommentToRecommendation,
    updateRecommendationById,
    updateRecommendationStatus,
    voteOnComment,
    acceptCommentAsSolution,
    deleteRecommendationById,
    deleteCommentById,
    updateCommentById,
    refreshRecommendations,
    applyFilters,
    resetFilters,
    clearError,
    getRecommendation,
  } = useFacultyRecommendations(userId, {
    autoFetch: true,
    initialFilters,
  });

  // Apply filters and search
  const filteredRecommendations = useMemo(() => {
    
    let filtered = [...recommendations];

    // Apply status filter
    if (selectedStatus) {
      filtered = filtered.filter((rec) => rec.status === selectedStatus);
    }
     if (selectedPostingAdvisor) {
      filtered = filtered.filter((rec) => rec.postingAdvisorId === selectedPostingAdvisor);
    }

    if (showMyIssues && userProfile?.profile?.id) {
      filtered = filtered.filter((rec) => {
        return rec.postingAdvisorId === userProfile.profile.id;
      });
    }
    return filtered;
  }, [recommendations, searchTerm, selectedStatus, showMyIssues, userProfile?.profile.id]);

  // Handlers
  const handleBackAction = () => {
    if (viewMode === 'detail') {
      setViewMode('list');
      setSelectedRec(null);
    } else if (onBack) {
      onBack();
    }
  };

  const handleCreateRecommendation = async (data: CreateRecommendationData) => {
    const response = await createNewRecommendation(data);
    if (response.success) {
      setShowAddModal(false);
      await refreshRecommendations(true);
    }
  };

  const handleEditRecommendation = async (data: any) => {
    // Update the recommendation
    const response = await updateRecommendationById(data.id, data);
    if (response.success) {
      await refreshRecommendations(true);
      // Update selected recommendation
      if (selectedRec) {
        const updated = getRecommendation(selectedRec.id);
        if (updated) setSelectedRec(updated);
      }
    }
  };

  const handleDeleteRecommendation = async (id: number) => {
      await deleteRecommendationById(id);
      setViewMode('list');
      setSelectedRec(null);
      await refreshRecommendations(true);
    
  };

  const handleAddComment = async (recommendationId: number, text: string) => {
    const data: AddCommentData = {
      recommendationId,
      suggestedSolution: text,
    };
    const response = await addCommentToRecommendation(data);
    if (response.success) {
      await refreshRecommendations(true);
      if (selectedRec) {
        const updated = getRecommendation(selectedRec.id);
        if (updated) setSelectedRec(updated);
      }
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    
    const response = await deleteCommentById(commentId);
    if (response.success) {
      await refreshRecommendations(true);
      // Update selected recommendation
      if (selectedRec) {
        const updated = getRecommendation(selectedRec.id);
        if (updated) setSelectedRec(updated);
      }
    }
  };

  const handleEditComment = async (commentId: number, newText: string) => {
    const response = await updateCommentById(commentId, { suggestedSolution: newText });
    if (response.success) {
      await refreshRecommendations(true);
      // Update selected recommendation
      if (selectedRec) {
        const updated = getRecommendation(selectedRec.id);
        if (updated) setSelectedRec(updated);
      }
    }
  };

  const handleVote = async (commentId: number, voteType: 'upvote' | 'downvote') => {
    await voteOnComment(commentId, voteType);
    if (selectedRec) {
      const updated = getRecommendation(selectedRec.id);
      if (updated) setSelectedRec(updated);
    }
  };

  const handleAcceptSolution = async (commentId: number) => {
    await acceptCommentAsSolution(commentId);
    if (selectedRec) {
      const updated = getRecommendation(selectedRec.id);
      if (updated) setSelectedRec(updated);
    }
    await refreshRecommendations(true);
  };

  const handleStatusChange = async (
    id: number,
    status: 'Open' | 'In Progress' | 'Resolved' | 'Closed'
  ) => {
    await updateRecommendationStatus(id, status);
    if (selectedRec && selectedRec.id === id) {
      const updated = getRecommendation(id);
      if (updated) setSelectedRec(updated);
    }
    await refreshRecommendations(true);
  };

  const handleApplyFilters = () => {
    const filters: any = {};
    if (selectedStatus) filters.status = selectedStatus;
    if (showMyIssues) filters.postingAdvisorId = userProfile?.profile.id;
    applyFilters(filters);
    setShowFilterMenu(false);
  };

  const handleClearFilters = () => {
    setSelectedStatus('');
    setSelectedPostingAdvisor(undefined);
    setShowMyIssues(false);
    resetFilters();
    setShowFilterMenu(false);
  };

  const handleSelectRecommendation = (rec: any) => {
    setSelectedRec(rec);
    setViewMode('detail');
  };

   const handleMyIssuesToggle = () => {
    const newShowMyIssues = !showMyIssues;
    setShowMyIssues(newShowMyIssues);
    
    if (newShowMyIssues && userProfile?.profile?.id) {
      setSelectedPostingAdvisor(userProfile.profile.id);
    } else {
      setSelectedPostingAdvisor(undefined);
    }
    
    const filters: any = {};
    if (selectedStatus) filters.status = selectedStatus;
    if (newShowMyIssues && userProfile?.profile?.id) {
      filters.postingAdvisorId = userProfile.profile.id;
    } else if (selectedPostingAdvisor) {
      filters.postingAdvisorId = selectedPostingAdvisor;
    }
    applyFilters(filters);
  };

  // Loading State
  if (isLoading && recommendations.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 size={40} className="animate-spin text-[#1e3a5f]" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1300px] mx-auto p-4 md:p-6 font-sans text-slate-900 relative">
      {/* Navigation Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={handleBackAction}
          className="p-2 hover:bg-slate-200 bg-white shadow-sm rounded-full text-[#1e3a5f] transition-all border border-slate-100 active:scale-90"
        >
          <ArrowLeft size={20} />
        </button>
        {viewMode === 'detail' && (
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Recommendation Detail
          </span>
        )}
      </div>

      {/* Create Modal */}
      <CreateRecommendationModal
        isOpen={showAddModal}
        isSubmitting={isCreating}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleCreateRecommendation}
      />

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center mb-6">
          <p className="text-red-600 font-semibold">{error}</p>
          <button
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold uppercase"
            onClick={() => {
              clearError();
              refreshRecommendations(true);
            }}
          >
            Retry
          </button>
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' ? (
        <div className="animate-in fade-in duration-500">
          {/* Search Bar with Filter Toggle */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <h2 className="text-2xl font-black text-[#1e3a5f] tracking-tighter uppercase leading-none">
                Faculty Recommendations
              </h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">
                {openCount} Open • {totalCount} Total
                {showMyIssues && ' • Showing My Issues'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            
              <button
                className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  showFilterMenu || selectedStatus || selectedPostingAdvisor || showMyIssues
                    ? 'bg-[#1e3a5f] text-white shadow-md'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
                onClick={() => setShowFilterMenu(!showFilterMenu)}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filter
                {(selectedStatus || selectedPostingAdvisor || showMyIssues) && (
                  <span className="ml-1 bg-blue-500 text-white rounded-full w-4 h-4 text-[8px] flex items-center justify-center">
                    {[selectedStatus, selectedPostingAdvisor, showMyIssues].filter(Boolean).length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center justify-center gap-2 bg-[#1e3a5f] text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-md active:scale-95 transition-all hover:shadow-lg"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New
              </button>
            </div>
          </div>

          {/* Filter Bar */}
          <FilterBar
            showFilterMenu={showFilterMenu}
            selectedStatus={selectedStatus}
            selectedPostingAdvisor={selectedPostingAdvisor}
            currentUserId={userProfile?.profile.id}
            showMyIssues={showMyIssues}
            onStatusChange={setSelectedStatus}
            onAdvisorChange={setSelectedPostingAdvisor}
            onMyIssuesToggle={handleMyIssuesToggle}
            onApply={handleApplyFilters}
            onClear={handleClearFilters}
            onToggle={() => setShowFilterMenu(!showFilterMenu)}
          />

          {/* Active Filters Display */}
          {(selectedStatus || selectedPostingAdvisor || showMyIssues) && (
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedStatus && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold uppercase">
                  Status: {selectedStatus}
                  <button
                    onClick={() => {
                      setSelectedStatus('');
                      handleApplyFilters();
                    }}
                    className="hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              )}
              {showMyIssues && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-bold uppercase">
                  My Issues
                  <button
                    onClick={() => {
                      setShowMyIssues(false);
                      handleApplyFilters();
                    }}
                    className="hover:text-green-800"
                  >
                    ×
                  </button>
                </span>
              )}
              <button
                onClick={handleClearFilters}
                className="text-[10px] font-bold text-slate-400 uppercase hover:text-slate-600"
              >
                Clear All
              </button>
            </div>
          )}

          {/* Recommendations Grid */}
          {filteredRecommendations.length === 0 ? (
            <EmptyState
              message={
                searchTerm ||
                (showMyIssues
                  ? "You haven't created any recommendations yet. Click 'New' to create one."
                  : 'Try adjusting your filters or search terms.')
              }
              title="No Results"
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredRecommendations.map((rec) => (
                <RecommendationCard
                  key={rec.id}
                  recommendation={rec}
                  userId={userProfile?.profile.id}
                  onSelect={handleSelectRecommendation}
                  onDelete={handleDeleteRecommendation}
                  onEdit={setEditingRecommendation}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Detail View */
        selectedRec && (
          <RecommendationDetail
            recommendation={selectedRec}
            userId={userProfile?.profile.id}
            isCommenting={isCommenting}
            onBack={handleBackAction}
            onComment={handleAddComment}
            onVote={handleVote}
            onAcceptSolution={handleAcceptSolution}
            onStatusChange={handleStatusChange}
            onDelete={handleDeleteRecommendation}
            onEditRecommendation={handleEditRecommendation}
            onDeleteComment={handleDeleteComment}
            onEditComment={handleEditComment}
          />
        )
      )}
    </div>
  );
};

export default FacultyRecommendation;