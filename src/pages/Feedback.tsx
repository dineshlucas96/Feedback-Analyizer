import React, { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import type { FeedbackRecord, FilterState } from '../types/feedback';
import { FeedbackCard } from '../components/FeedbackCard';
import { EmptyState } from '../components/EmptyState';
import { FilterBar } from '../components/FilterBar';
import type { ActiveFilterPill } from '../hooks/useFilters';


interface FeedbackProps {
  records: FeedbackRecord[];
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

export const Feedback: React.FC<FeedbackProps> = ({
  records,
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
  const [searchQuery, setSearchQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState<string>('ALL');
  const [onlyWithComments, setOnlyWithComments] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const pageSize = 12;

  // Filter records based on local search and rating
  const processedFeedback = useMemo(() => {
    return records.filter(r => {
      // Written comments toggle
      if (onlyWithComments && (!r.comments || r.comments.trim() === '')) {
        return false;
      }

      // Rating filter
      if (ratingFilter !== 'ALL') {
        const star = Number(ratingFilter);
        if (Math.round(r.averageRating) !== star) {
          return false;
        }
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchComment = r.comments?.toLowerCase().includes(q);
        const matchDept = r.department.toLowerCase().includes(q);
        if (!matchComment && !matchDept) {
          return false;
        }
      }

      return true;
    });
  }, [records, onlyWithComments, ratingFilter, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(processedFeedback.length / pageSize));
  const currentPageRecords = processedFeedback.slice((page - 1) * pageSize, page * pageSize);

  const handleResetLocal = () => {
    setSearchQuery('');
    setRatingFilter('ALL');
    setOnlyWithComments(false);
    onResetFilters();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Department/Class/Section Filter Bar */}
      <FilterBar
        filters={filters}
        availableDepartments={availableDepartments}
        availableClasses={availableClasses}
        availableSections={availableSections}
        activePills={activePills}
        hasActiveFilters={hasActiveFilters}
        onDepartmentChange={onDepartmentChange}
        onClassChange={onClassChange}
        onSectionChange={onSectionChange}
        onResetFilters={onResetFilters}
        onRemovePill={onRemovePill}
      />

      {/* Local Feedback Control Bar */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search feedback..."
            value={searchQuery}
            onChange={e => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-[#E5E7EB] rounded-lg text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>

        {/* Rating Filter */}
        <div className="flex items-center gap-2">
          <select
            value={ratingFilter}
            onChange={e => {
              setRatingFilter(e.target.value);
              setPage(1);
            }}
            className="bg-gray-50 border border-[#E5E7EB] text-gray-800 text-xs font-medium rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
          >
            <option value="ALL">All Star Ratings</option>
            <option value="5">5 Stars (Excellent)</option>
            <option value="4">4 Stars (Good)</option>
            <option value="3">3 Stars (Average)</option>
            <option value="2">2 Stars (Poor)</option>
            <option value="1">1 Star (Very Poor)</option>
          </select>

          {/* Only with comments checkbox */}
          <label className="flex items-center gap-2 text-xs text-gray-700 select-none cursor-pointer bg-gray-50 border border-[#E5E7EB] px-3 py-2 rounded-lg hover:bg-gray-100/60 transition-colors">
            <input
              type="checkbox"
              checked={onlyWithComments}
              onChange={e => {
                setOnlyWithComments(e.target.checked);
                setPage(1);
              }}
              className="rounded text-indigo-600 focus:ring-indigo-500"
            />
            <span>With comments only</span>
          </label>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-gray-500 px-1">
        <span>
          Showing <strong>{processedFeedback.length.toLocaleString()}</strong> matching responses
        </span>
        {totalPages > 1 && (
          <span>
            Page {page} of {totalPages}
          </span>
        )}
      </div>

      {/* Feedback Cards Grid */}
      {processedFeedback.length === 0 ? (
        <EmptyState
          title="No matching student feedback"
          description="No responses match your search or rating filters. Try clearing your search or filters."
          actionText="Reset All Filters"
          onAction={handleResetLocal}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {currentPageRecords.map(record => (
              <FeedbackCard key={record.id} record={record} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 text-xs font-medium bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Previous
              </button>
              <div className="flex items-center gap-1">
                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  const pNum = i + 1;
                  return (
                    <button
                      key={pNum}
                      onClick={() => setPage(pNum)}
                      className={`w-7 h-7 text-xs font-medium rounded-lg transition-colors ${
                        page === pNum
                          ? 'bg-indigo-600 text-white'
                          : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {pNum}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 text-xs font-medium bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
