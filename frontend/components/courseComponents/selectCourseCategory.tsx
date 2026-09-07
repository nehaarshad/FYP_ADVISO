/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
// components/courseComponents/selectmultiplecategories.tsx
"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Check } from "lucide-react";
import { DropdownCategory } from './types/courseoption';

interface SearchableMultiSelectCategoriesProps {
  options: DropdownCategory[];
  selectedIds: number[];
  onChange: (selectedIds: number[]) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
}

export const SearchableMultiSelectCategories: React.FC<SearchableMultiSelectCategoriesProps> = ({
  options = [], // Default to empty array
  selectedIds = [], // Default to empty array
  onChange,
  placeholder = "Search categories...",
  label = "Select Categories",
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState<DropdownCategory[]>(options);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter options based on search term
  useEffect(() => {
    const filtered = options.filter(option => {
      if (!option) return false;
      const searchLower = searchTerm.toLowerCase().trim();
      if (!searchLower) return true;
      return option.categoryName?.toLowerCase().includes(searchLower);
    });
    setFilteredOptions(filtered);
  }, [searchTerm, options]);

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
    console.log('Toggle option:', optionId);
    let newSelectedIds: number[];
    
    if (selectedIds.includes(optionId)) {
      // Remove the option
      newSelectedIds = selectedIds.filter(id => id !== optionId);
    } else {
      // Add the option
      newSelectedIds = [...selectedIds, optionId];
    }
    
    console.log('New selected IDs:', newSelectedIds);
    onChange(newSelectedIds);
  };

  const removeOption = (optionId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSelectedIds = selectedIds.filter(id => id !== optionId);
    onChange(newSelectedIds);
  };

  const getSelectedLabel = (id: number) => {
    const option = options.find(opt => opt && opt.id === id);
    return option ? option.categoryName : '';
  };

  const getCategoryColor = (id: number) => {
    const option = options.find(opt => opt && opt.id === id);
    return option?.colorScheme || '#1e3a5f';
  };

  const handleFocus = () => {
    if (!disabled && options.length > 0) {
      setIsOpen(true);
      setSearchTerm('');
    }
  };

  const parseColorScheme = (colorScheme: string) => {
    if (!colorScheme) return '#e5e7eb';
    if (colorScheme.startsWith('FF')) {
      return `#${colorScheme.substring(2)}`;
    }
    if (!colorScheme.startsWith('#')) {
      return `#${colorScheme}`;
    }
    return colorScheme;
  };

  return (
    <div className="relative" ref={wrapperRef}>
      {label && (
        <label className="text-[10px] font-black text-slate-400 uppercase block mb-1">
          {label}
        </label>
      )}

      <div 
        className={`w-full min-h-[44px] px-3 py-2 border rounded-lg bg-white flex flex-wrap items-center gap-1 cursor-text transition-colors ${
          isOpen ? 'border-[#1e3a5f] ring-2 ring-[#1e3a5f]/20' : 'border-slate-300'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-slate-400'}`}
        onClick={() => !disabled && inputRef.current?.focus()}
      >
        {/* Selected Tags */}
        {selectedIds.map(id => {
          const color = getCategoryColor(id);
          const parsedColor = parseColorScheme(color);
          return (
            <span
              key={id}
              className="inline-flex items-center gap-1 px-2 py-0.5 text-white text-[10px] font-medium rounded whitespace-nowrap"
              style={{ backgroundColor: parsedColor }}
            >
              {getSelectedLabel(id)}
              {!disabled && (
                <button
                  type="button"
                  onClick={(e) => removeOption(id, e)}
                  className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                >
                  <X size={12} />
                </button>
              )}
            </span>
          );
        })}

        {/* Search Input */}
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={handleFocus}
          placeholder={selectedIds.length === 0 ? placeholder : ''}
          className="flex-1 min-w-[100px] outline-none bg-transparent text-sm placeholder:text-slate-400"
          disabled={disabled || options.length === 0}
        />
      </div>

      {/* Dropdown Options */}
      {isOpen && !disabled && options.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {filteredOptions.length === 0 ? (
            <div className="p-4 text-center text-sm text-slate-400">
              No categories found
            </div>
          ) : (
            filteredOptions.map(option => {
              if (!option) return null;
              const isSelected = selectedIds.includes(option.id);
              const color = option.colorScheme || '#64748b';
              const parsedColor = parseColorScheme(color);
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => toggleOption(option.id)}
                  className={`w-full px-4 py-2.5 text-left text-sm hover:bg-slate-50 transition-colors flex items-center justify-between ${
                    isSelected ? 'bg-slate-50' : ''
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span 
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: parsedColor }}
                    />
                    <span className="font-medium text-slate-900">
                      {option.categoryName}
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

      <p className="text-[9px] text-slate-400 mt-1">
        Type to search and select multiple categories
      </p>
    </div>
  );
};