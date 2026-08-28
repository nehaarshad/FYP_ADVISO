// hooks/useGuidelineFilters.ts
import { useState, useMemo } from "react";
import { DegreeGuidlineModel } from "@/src/models/degreeGuidlineModel";
import { GuidelineFiltersHookProps } from "@/components/Guidelines/types";

export const useGuidelineFilters = ({
  guidelines,
  programs,
  userProfile,
}: GuidelineFiltersHookProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProgramFilter, setSelectedProgramFilter] = useState<string>("all");

  // Get user's program for filtering (if advisor/student)
  const userProgramId = useMemo(() => {
    if (!userProfile) return null;
    if (userProfile.role === 'student' && userProfile.profile?.BatchModel?.ProgramModel?.id) {
      return userProfile.profile.BatchModel.ProgramModel.id;
    }
    if (userProfile.role === 'advisor' && userProfile.profile?.BatchAssignments?.length > 0) {
      return userProfile.profile.BatchAssignments[0]?.BatchModel?.ProgramModel?.id;
    }
    return null;
  }, [userProfile]);

  // Filter guidelines
  const filteredGuidelines = useMemo(() => {
    let filtered = guidelines;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(g =>
        g.title.toLowerCase().includes(term) ||
        g.description.toLowerCase().includes(term)
      );
    }

    if (selectedProgramFilter !== "all") {
      const programId = parseInt(selectedProgramFilter);
      filtered = filtered.filter(g => g.programId === programId);
    }

    return filtered;
  }, [guidelines, searchTerm, selectedProgramFilter]);

  // Get program options for filter
  const programOptions = useMemo(() => {
    const options = programs.map(p => ({
      value: p.id.toString(),
      label: p.programName,
    }));
    return [{ value: "all", label: "All Programs" }, ...options];
  }, [programs]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleFilterChange = (value: string) => {
    setSelectedProgramFilter(value);
  };

  return {
    searchTerm,
    selectedProgramFilter,
    filteredGuidelines,
    programOptions,
    userProgramId,
    handleSearchChange,
    handleFilterChange,
  };
};