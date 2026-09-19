import React from 'react';
import { Menu, RefreshCw, Sheet, HelpCircle } from 'lucide-react';
import type { ActiveTab, SpreadsheetSource } from '../types/feedback';



interface HeaderProps {
  activeTab: ActiveTab;
  source: SpreadsheetSource | null;
  totalRecordsCount: number;
  filteredRecordsCount: number;
  isLoading: boolean;
  onRefresh: () => void;
  onChangeSheet: () => void;
  onOpenGuide: () => void;
  onToggleMobileMenu: () => void;
}

const TAB_TITLES: Record<ActiveTab, { title: string; subtitle: string }> = {
  overview: {
    title: 'Overview',
    subtitle: 'Student feedback performance and high-level KPIs',
  },
  feedback: {
    title: 'Student Feedback',
    subtitle: 'Individual student reviews, sentiment, and qualitative remarks',
  },
  questions: {
    title: 'Question Analysis',
    subtitle: 'Understand performance across every feedback question',
  },
  classes: {
    title: 'Class & Section Analysis',
    subtitle: 'Comparative breakdown across academic years and sections',
  },
  ratings: {
    title: 'Content & Speaker Rating',
    subtitle: 'How well the material and the presenter were received',
  },
  suggestions: {
    title: 'Future Suggestions',
    subtitle: 'Actionable ideas and recommendations from respondents',
  },
  raw: {
    title: 'Raw Data',
    subtitle: 'Searchable, sortable tabular view of all spreadsheet rows',
  },
};

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  source,
  totalRecordsCount,
  filteredRecordsCount,
  isLoading,
  onRefresh,
  onChangeSheet,
  onOpenGuide,
  onToggleMobileMenu,
}) => {
  const meta = TAB_TITLES[activeTab];

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-[#E5E7EB] px-4 sm:px-8 py-3.5 flex items-center justify-between transition-all">
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 -ml-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 focus:outline-none"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#111827]">
              {meta.title}
            </h1>
            {source && (
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                {filteredRecordsCount === totalRecordsCount
                  ? `${totalRecordsCount.toLocaleString()} responses`
                  : `${filteredRecordsCount.toLocaleString()} / ${totalRecordsCount.toLocaleString()}`}
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-[#6B7280] mt-0.5">{meta.subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Help / Guide */}
        <button
          onClick={onOpenGuide}
          className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
          title="Spreadsheet setup guide"
          aria-label="Spreadsheet Guide"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        {source && (
          <>
            {/* Refresh */}
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className={`p-2 text-gray-600 hover:text-indigo-600 hover:bg-gray-100 rounded-lg transition-all ${
                isLoading ? 'animate-spin text-indigo-600' : ''
              }`}
              title="Refresh spreadsheet data"
              aria-label="Refresh data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {/* Change sheet */}
            <button
              onClick={onChangeSheet}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-[#E5E7EB] hover:bg-gray-50 hover:text-gray-900 rounded-lg shadow-2xs transition-colors"
            >
              <Sheet className="w-3.5 h-3.5 text-indigo-600" />
              <span>Change Sheet</span>
            </button>
          </>
        )}
      </div>
    </header>
  );
};
