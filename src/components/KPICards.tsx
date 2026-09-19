import React from 'react';
import {
  Users,
  Star,
  ThumbsUp,
  Layers,
  TrendingUp,
} from 'lucide-react';
import type { KPIData } from '../types/feedback';


interface KPICardsProps {
  kpis: KPIData;
}

export const KPICards: React.FC<KPICardsProps> = ({ kpis }) => {
  const getRatingBadge = (rating: number) => {
    if (rating >= 4.5) return { label: 'Outstanding', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    if (rating >= 4.0) return { label: 'Good', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
    if (rating >= 3.0) return { label: 'Average', color: 'bg-amber-50 text-amber-700 border-amber-200' };
    return { label: 'Needs Focus', color: 'bg-rose-50 text-rose-700 border-rose-200' };
  };

  const ratingBadge = getRatingBadge(kpis.averageRating);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
      {/* 1. Total Responses */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 shadow-2xs hover:border-gray-300 transition-all">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-[#6B7280]">Total Responses</span>
          <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-bold tracking-tight text-[#111827]">
          {kpis.totalResponses.toLocaleString()}
        </div>
        <div className="flex items-center gap-1 mt-1 text-xs text-emerald-600 font-medium">
          <TrendingUp className="w-3 h-3" />
          <span>Active period</span>
        </div>
      </div>

      {/* 2. Average Rating */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 shadow-2xs hover:border-gray-300 transition-all">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-[#6B7280]">Average Rating</span>
          <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <Star className="w-4 h-4 fill-amber-400" />
          </div>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold tracking-tight text-[#111827]">
            {kpis.averageRating > 0 ? kpis.averageRating.toFixed(2) : '—'}
          </span>
          <span className="text-xs text-[#6B7280]">/ 5.0</span>
        </div>
        <div className="mt-1">
          <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold border ${ratingBadge.color}`}>
            {ratingBadge.label}
          </span>
        </div>
      </div>

      {/* 3. Positive Feedback Rate */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 shadow-2xs hover:border-gray-300 transition-all">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-[#6B7280]">Positive Feedback</span>
          <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ThumbsUp className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-bold tracking-tight text-[#111827]">
          {kpis.positiveFeedbackRate}%
        </div>
        <div className="text-[11px] text-[#6B7280] mt-1">
          Rated 4.0 or above
        </div>
      </div>

      {/* 4. Sections Count */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 shadow-2xs hover:border-gray-300 transition-all">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-[#6B7280]">Sections</span>
          <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Layers className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-bold tracking-tight text-[#111827]">
          {kpis.sectionCount}
        </div>
        <div className="text-[11px] text-[#6B7280] mt-1">
          Active cohorts
        </div>
      </div>
    </div>
  );
};
