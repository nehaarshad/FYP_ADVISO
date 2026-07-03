/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Check } from "lucide-react";
import { DropdownCourse } from './types/courseoption';


interface SearchableMultiSelectProps {
  options: DropdownCourse[];
  selectedIds: number[];
  onChange: (selectedIds: number[]) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  excludeId?: number;
}

export const SearchableMultiSelect: React.FC<SearchableMultiSelectProps> = ({
  options,
  selectedIds,
  onChange,
  placeholder = "Search courses...",
  label = "Select Courses",
  disabled = false,
  excludeId
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState<DropdownCourse[]>(options);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter options based on search term
  useEffect(() => {
    const filtered = options.filter(option => {
      // Exclude the specified ID if provided
      if (excludeId && option.id === excludeId) return false;
      
      const searchLower = searchTerm.toLowerCase().trim();
      if (!searchLower) return true;
      
      return (
        option.courseCode?.toLowerCase().includes(searchLower) ||
        option.courseName?.toLowerCase().includes(searchLower)
      );
    });
    setFilteredOptions(filtered);
  }, [searchTerm, options, excludeId]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (optionId: number) => {
    if (selectedIds.includes(optionId)) {
      onChange(selectedIds.filter(id => id !== optionId));
    } else {
      onChange([...selectedIds, optionId]);
    }
  };

  const removeOption = (optionId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(selectedIds.filter(id => id !== optionId));
  };

  const getSelectedLabel = (id: number) => {
    const option = options.find(opt => opt.id === id);
    return option ? `${option.courseCode}` : '';
  };

  const handleFocus = () => {
    if (!disabled) {
      setIsOpen(true);
      setSearchTerm('');
    }
  };

  return (
    <div className="relative" ref={wrapperRef}>
      {/* Label */}
      {label && (
        <label className="text-[10px] font-black text-slate-400 uppercase block mb-1">
          {label}
        </label>
      )}

      {/* Selected Tags and Input */}
      <div 
        className={`w-full min-h-[44px] px-3 py-2 border rounded-lg bg-white flex flex-wrap items-center gap-1 cursor-text transition-colors ${
          isOpen ? 'border-[#1e3a5f] ring-2 ring-[#1e3a5f]/20' : 'border-slate-300'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-slate-400'}`}
        onClick={() => !disabled && inputRef.current?.focus()}
      >
        {/* Selected Tags */}
        {selectedIds.map(id => (
          <span
            key={id}
            className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#1e3a5f] text-white text-[10px] font-medium rounded whitespace-nowrap"
          >
            {getSelectedLabel(id)}
            {!disabled && (
              <button
                title='btn'
                type="button"
                onClick={(e) => removeOption(id, e)}
                className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
              >
                <X size={12} />
              </button>
            )}
          </span>
        ))}

        {/* Search Input */}
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={handleFocus}
          placeholder={selectedIds.length === 0 ? placeholder : ''}
          className="flex-1 min-w-[100px] outline-none bg-transparent text-sm placeholder:text-slate-400"
          disabled={disabled}
        />
      </div>

      {/* Dropdown Options */}
      {isOpen && !disabled && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {filteredOptions.length === 0 ? (
            <div className="p-4 text-center text-sm text-slate-400">
              No courses found
            </div>
          ) : (
            filteredOptions.map(option => {
              const isSelected = selectedIds.includes(option.id);
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => toggleOption(option.id)}
                  className={`w-full px-4 py-2.5 text-left text-sm hover:bg-slate-50 transition-colors flex items-center justify-between ${
                    isSelected ? 'bg-[#1e3a5f]/5' : ''
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-slate-900">
                      {option.courseCode}
                    </span>
                    <span className="text-xs text-slate-500">
                      {option.courseName}
                    </span>
                  </div>
                  {isSelected && (
                    <Check size={16} className="text-[#1e3a5f] flex-shrink-0" />
                  )}
                </button>
              );
            })
          )}
        </div>
      )}

      {/* Helper Text */}
      <p className="text-[9px] text-slate-400 mt-1">
        Type to search and select multiple courses
      </p>
    </div>
  );
};