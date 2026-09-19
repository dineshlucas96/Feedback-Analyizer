import React from 'react';
import { FilterX, RotateCcw } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No matching feedback',
  description = 'No feedback matches your current filters. Try adjusting your Department, Class, or Section.',
  actionText = 'Reset Filters',
  onAction,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] p-12 text-center my-6 shadow-2xs">
      <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mx-auto mb-4 text-gray-400">
        <FilterX className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-[#111827]">{title}</h3>
      <p className="text-xs sm:text-sm text-[#6B7280] mt-1 max-w-md mx-auto">
        {description}
      </p>
      {onAction && (
        <div className="mt-5">
          <button
            onClick={onAction}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100/80 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-medium transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{actionText}</span>
          </button>
        </div>
      )}
    </div>
  );
};
