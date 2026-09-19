import React from 'react';
import { Star, Clock } from 'lucide-react';
import type { FeedbackRecord } from '../types/feedback';


interface FeedbackCardProps {
  record: FeedbackRecord;
}

export const FeedbackCard: React.FC<FeedbackCardProps> = ({ record }) => {
  // Render stars
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map(star => {
          const isFilled = rating >= star;
          const isHalf = !isFilled && rating >= star - 0.5;
          return (
            <Star
              key={star}
              className={`w-3.5 h-3.5 ${
                isFilled
                  ? 'fill-amber-400 text-amber-400'
                  : isHalf
                  ? 'fill-amber-200 text-amber-400'
                  : 'text-gray-300'
              }`}
            />
          );
        })}
        <span className="text-xs font-semibold text-gray-800 ml-1.5">{record.averageRating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 shadow-2xs hover:border-indigo-200 hover:shadow-xs transition-all space-y-3">
      {/* Top row: Badges and Star Rating */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-medium text-gray-600">
          <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-semibold border border-indigo-100">
            {record.department}
          </span>
          <span className="text-gray-300">•</span>
          <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-700">
            {record.className}
          </span>
          <span className="text-gray-300">•</span>
          <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-700">
            Sec {record.section}
          </span>
        </div>

        <div>{renderStars(record.averageRating)}</div>
      </div>

      {/* Student comment text */}
      {record.comments ? (
        <div className="p-3 bg-gray-50/80 rounded-lg text-xs sm:text-sm text-[#111827] leading-relaxed border border-gray-100 italic">
          "{record.comments}"
        </div>
      ) : (
        <div className="p-2.5 bg-gray-50/50 rounded-lg text-xs text-gray-400 italic">
          No written comments submitted.
        </div>
      )}

      {/* Timestamp footer */}
      {record.timestamp && (
        <div className="flex items-center gap-1 text-[11px] text-gray-400 pt-1">
          <Clock className="w-3 h-3" />
          <span>{record.timestamp}</span>
        </div>
      )}
    </div>
  );
};
