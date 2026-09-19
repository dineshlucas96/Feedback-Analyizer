import React from 'react';
import { Star, ThumbsUp } from 'lucide-react';
import type { RatingAspectStats } from '../types/feedback';

interface RatingSectionProps {
  title: string;
  subtitle: string;
  stats: RatingAspectStats;
  icon?: React.ReactNode;
  accentClass?: string;
  barClass?: string;
  action?: React.ReactNode;
}

const getBadge = (rating: number) => {
  if (rating >= 4.5) return { label: 'Outstanding', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
  if (rating >= 4.0) return { label: 'Good', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
  if (rating >= 3.0) return { label: 'Average', color: 'bg-amber-50 text-amber-700 border-amber-200' };
  return { label: 'Needs Focus', color: 'bg-rose-50 text-rose-700 border-rose-200' };
};

export const RatingSection: React.FC<RatingSectionProps> = ({
  title,
  subtitle,
  stats,
  icon,
  accentClass = 'bg-indigo-50 text-indigo-600',
  barClass = 'bg-indigo-500',
  action,
}) => {
  const badge = getBadge(stats.average);

  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 shadow-2xs transition-all">
      <div className="flex items-start justify-between mb-4 gap-3">
        <div className="flex items-center gap-2.5">
          {icon && <span className={`w-8 h-8 rounded-lg ${accentClass} flex items-center justify-center shrink-0`}>{icon}</span>}
          <div>
            <h2 className="text-base font-semibold text-[#111827] tracking-tight">{title}</h2>
            <p className="text-xs text-[#6B7280] mt-0.5">{subtitle}</p>
          </div>
        </div>
        {action && <div>{action}</div>}
      </div>

      {stats.count === 0 ? (
        <div className="flex items-center justify-center h-40 text-xs text-gray-400 italic">
          No content ratings recorded in the current selection.
        </div>
      ) : (
        <>
          {/* Top stats */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 text-center">
              <span className="text-[11px] text-gray-500 uppercase tracking-wider block font-medium">
                Average
              </span>
              <div className="flex items-center justify-center gap-1 mt-1 text-2xl font-bold text-gray-900">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{stats.average.toFixed(2)}</span>
              </div>
              <span className="text-[10px] text-gray-400">out of 5.0</span>
            </div>

            <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 text-center">
              <span className="text-[11px] text-gray-500 uppercase tracking-wider block font-medium">
                Positive
              </span>
              <div className="flex items-center justify-center gap-1 mt-1 text-2xl font-bold text-emerald-600">
                <ThumbsUp className="w-4 h-4" />
                <span>{stats.positiveRate}%</span>
              </div>
              <span className="text-[10px] text-gray-400">
                <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-semibold border ${badge.color}`}>
                  {badge.label}
                </span>
              </span>
            </div>
          </div>

          {/* Distribution bars */}
          <div className="space-y-1.5 text-xs">
            {stats.distribution.map(item => (
              <div key={item.star} className="flex items-center gap-3">
                <span className="w-8 text-gray-600 font-medium">{item.star} ★</span>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${barClass} rounded-full`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <span className="w-16 text-right text-gray-500">
                  {item.count} ({item.percentage}%)
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};