import React from 'react';
import { X, Star, BarChart2 } from 'lucide-react';
import type { QuestionPerformanceItem } from '../types/feedback';


interface QuestionDetailModalProps {
  question: QuestionPerformanceItem | null;
  onClose: () => void;
}

export const QuestionDetailModal: React.FC<QuestionDetailModalProps> = ({
  question,
  onClose,
}) => {
  if (!question) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
      <div
        className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between p-6 border-b border-gray-100 bg-gray-50/60">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <BarChart2 className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-lg font-bold text-[#111827]">{question.question}</h3>
              <p className="text-xs text-gray-500">Criteria Evaluation Details</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-200/60 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 text-center">
              <span className="text-xs text-gray-500 font-medium">Average Score</span>
              <div className="flex items-center justify-center gap-1 mt-1 text-2xl font-bold text-gray-900">
                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                <span>{question.average.toFixed(2)}</span>
              </div>
              <span className="text-[10px] text-gray-400">out of 5.0</span>
            </div>

            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 text-center">
              <span className="text-xs text-gray-500 font-medium">Total Responses</span>
              <div className="mt-1 text-2xl font-bold text-gray-900">
                {question.count.toLocaleString()}
              </div>
              <span className="text-[10px] text-gray-400">Evaluations counted</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Distribution of Student Ratings
            </h4>
            <div className="space-y-2.5">
              {question.distribution.map(d => (
                <div key={d.star} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-gray-700">{d.star} Stars</span>
                    <span className="text-gray-500 font-medium">
                      {d.count} ({d.percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        d.star >= 4
                          ? 'bg-emerald-500'
                          : d.star === 3
                          ? 'bg-blue-500'
                          : 'bg-amber-500'
                      }`}
                      style={{ width: `${d.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-xs font-medium transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
