import React from 'react';
import { RotateCcw, X, Filter } from 'lucide-react';
import type { FilterState } from '../types/feedback';
import type { ActiveFilterPill } from '../hooks/useFilters';


interface FilterBarProps {
  filters: FilterState;
  availableDepartments: string[];
  availableClasses: string[];
  availableSections: string[];
  activePills: ActiveFilterPill[];
  hasActiveFilters: boolean;
  onDepartmentChange: (dept: string) => void;
  onClassChange: (cls: string) => void;
  onSectionChange: (sec: string) => void;
  onResetFilters: () => void;
  onRemovePill: (key: keyof FilterState) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  availableDepartments,
  availableClasses,
  availableSections,
  activePills,
  hasActiveFilters,
  onDepartmentChange,
  onClassChange,
  onSectionChange,
  onResetFilters,
  onRemovePill,
}) => {
  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] p-3 sm:p-4 shadow-2xs mb-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Dropdown selectors */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 flex-1 min-w-[280px]">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider mr-1">
            <Filter className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden sm:inline">Filters:</span>
          </div>

          {/* Department selector */}
          <div className="relative min-w-[140px] flex-1 sm:flex-initial">
            <select
              value={filters.department}
              onChange={e => onDepartmentChange(e.target.value)}
              className="w-full appearance-none bg-gray-50 hover:bg-gray-100/80 border border-[#E5E7EB] text-gray-800 text-xs font-medium rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer"
            >
              <option value="ALL">All Departments</option>
              {availableDepartments.map(dept => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-gray-400">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>

          {/* Class selector */}
          <div className="relative min-w-[130px] flex-1 sm:flex-initial">
            <select
              value={filters.className}
              onChange={e => onClassChange(e.target.value)}
              className="w-full appearance-none bg-gray-50 hover:bg-gray-100/80 border border-[#E5E7EB] text-gray-800 text-xs font-medium rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer"
            >
              <option value="ALL">All Classes</option>
              {availableClasses.map(cls => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-gray-400">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>

          {/* Section selector */}
          <div className="relative min-w-[120px] flex-1 sm:flex-initial">
            <select
              value={filters.section}
              onChange={e => onSectionChange(e.target.value)}
              className="w-full appearance-none bg-gray-50 hover:bg-gray-100/80 border border-[#E5E7EB] text-gray-800 text-xs font-medium rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer"
            >
              <option value="ALL">All Sections</option>
              {availableSections.map(sec => (
                <option key={sec} value={sec}>
                  Section {sec}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-gray-400">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Reset button */}
        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-600 hover:text-indigo-600 bg-gray-50 hover:bg-indigo-50/70 border border-gray-200 rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset filters</span>
          </button>
        )}
      </div>

      {/* Active Filter Pills */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-gray-100">
          <span className="text-[11px] font-medium text-gray-400">Active filters:</span>
          {activePills.map(pill => (
            <span
              key={pill.key}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100"
            >
              <span>
                <strong className="font-semibold text-indigo-800">{pill.label}:</strong> {pill.value}
              </span>
              <button
                onClick={() => onRemovePill(pill.key)}
                className="text-indigo-400 hover:text-indigo-700 p-0.5 rounded-full"
                title={`Remove ${pill.label} filter`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
