import React, { useState, useMemo } from 'react';
import { Star, BarChart2, ChevronRight } from 'lucide-react';
import type { QuestionPerformanceItem, FilterState } from '../types/feedback';
import { FilterBar } from '../components/FilterBar';
import { EmptyState } from '../components/EmptyState';
import type { ActiveFilterPill } from '../hooks/useFilters';


interface QuestionsProps {
  questionPerformance: QuestionPerformanceItem[];
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
  onSelectQuestion: (question: QuestionPerformanceItem) => void;
}

export const Questions: React.FC<QuestionsProps> = ({
  questionPerformance,
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
  onSelectQuestion,
}) => {
  const [sortBy, setSortBy] = useState<'highest' | 'lowest' | 'alpha'>('highest');

  const sortedQuestions = useMemo(() => {
    const list = [...questionPerformance];
    if (sortBy === 'highest') {
      return list.sort((a, b) => b.average - a.average);
    }
    if (sortBy === 'lowest') {
      return list.sort((a, b) => a.average - b.average);
    }
    return list.sort((a, b) => a.question.localeCompare(b.question));
  }, [questionPerformance, sortBy]);

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

      {/* Sorting bar */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 shadow-2xs flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          <BarChart2 className="w-4 h-4 text-indigo-600" />
          <span>{questionPerformance.length} Evaluation Criteria</span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-gray-500 hidden sm:inline">Sort by:</span>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as 'highest' | 'lowest' | 'alpha')}
            className="bg-gray-50 border border-[#E5E7EB] text-gray-800 text-xs font-medium rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
          >
            <option value="highest">Highest Rated First</option>
            <option value="lowest">Lowest Rated First</option>
            <option value="alpha">Alphabetical (A - Z)</option>
          </select>
        </div>
      </div>

      {/* Questions list */}
      {sortedQuestions.length === 0 ? (
        <EmptyState onAction={onResetFilters} />
      ) : (
        <div className="space-y-3">
          {sortedQuestions.map((q, idx) => {
            const percentage = Math.round((q.average / 5) * 100);
            return (
              <div
                key={q.key}
                onClick={() => onSelectQuestion(q)}
                className="bg-white rounded-xl border border-[#E5E7EB] p-5 shadow-2xs hover:border-indigo-300 hover:shadow-xs transition-all cursor-pointer group"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Left: Rank & Title */}
                  <div className="flex items-start gap-3 flex-1">
                    <span className="w-6 h-6 rounded-md bg-gray-100 group-hover:bg-indigo-50 group-hover:text-indigo-600 text-gray-500 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 transition-colors">
                      {idx + 1}
                    </span>
                    <div>
                      <h3 className="text-sm font-semibold text-[#111827] group-hover:text-indigo-600 transition-colors">
                        {q.question}
                      </h3>
                      <p className="text-xs text-[#6B7280] mt-0.5">
                        Evaluated across <strong>{q.count.toLocaleString()}</strong> student responses
                      </p>
                    </div>
                  </div>

                  {/* Middle: Progress Bar */}
                  <div className="w-full md:w-56 space-y-1">
                    <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          q.average >= 4.2
                            ? 'bg-emerald-500'
                            : q.average >= 3.5
                            ? 'bg-indigo-500'
                            : 'bg-amber-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] text-gray-400">
                      <span>0.0</span>
                      <span>Target: 4.0+</span>
                      <span>5.0</span>
                    </div>
                  </div>

                  {/* Right: Average score and chevron */}
                  <div className="flex items-center justify-between md:justify-end gap-3 min-w-[120px]">
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-lg font-bold text-[#111827]">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span>{q.average.toFixed(2)}</span>
                      </div>
                      <span className="text-[10px] text-gray-400">out of 5.0</span>
                    </div>

                    <div className="p-1 text-gray-400 group-hover:text-indigo-600 transition-colors">
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
