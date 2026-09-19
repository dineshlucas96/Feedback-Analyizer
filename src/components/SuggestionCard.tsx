import React from 'react';
import { Lightbulb } from 'lucide-react';
import type { FutureSuggestionItem } from '../types/feedback';

interface SuggestionCardProps {
  suggestion: FutureSuggestionItem;
  index: number;
}

export const SuggestionCard: React.FC<SuggestionCardProps> = ({ suggestion, index }) => {
  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 shadow-2xs hover:border-indigo-200 hover:shadow-xs transition-all">
      <div className="flex items-start gap-3">
        <span className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
          <Lightbulb className="w-3.5 h-3.5" />
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-medium text-gray-500 mb-1.5">
            <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-semibold border border-indigo-100">
              #{index + 1}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-700">{suggestion.department}</span>
            <span className="text-gray-300">•</span>
            <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-700">{suggestion.className}</span>
            <span className="text-gray-300">•</span>
            <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-700">Sec {suggestion.section}</span>
          </div>
          <p className="text-xs sm:text-sm text-[#111827] leading-relaxed">"{suggestion.text}"</p>
        </div>
      </div>
    </div>
  );
};