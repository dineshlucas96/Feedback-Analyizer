import React from 'react';
import {
  LayoutDashboard,
  MessageSquareText,
  BarChart3,
  GraduationCap,
  Table,
  Sparkles,
  Sheet,
  X,
} from 'lucide-react';
import type { ActiveTab, SpreadsheetSource } from '../types/feedback';


interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  source: SpreadsheetSource | null;
  onChangeSheet: () => void;
  isOpenMobile: boolean;
  setIsOpenMobile: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  source,
  onChangeSheet,
  isOpenMobile,
  setIsOpenMobile,
}) => {
  const navItems = [
    { id: 'overview' as ActiveTab, label: 'Overview', icon: LayoutDashboard },
    { id: 'feedback' as ActiveTab, label: 'Feedback', icon: MessageSquareText },
    { id: 'questions' as ActiveTab, label: 'Questions', icon: BarChart3 },
    { id: 'classes' as ActiveTab, label: 'Classes', icon: GraduationCap },
    { id: 'raw' as ActiveTab, label: 'Raw Data', icon: Table },
  ];

  const handleNavClick = (tab: ActiveTab) => {
    setActiveTab(tab);
    setIsOpenMobile(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={() => setIsOpenMobile(false)}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-60 bg-[#111827] text-gray-300 flex flex-col border-r border-gray-800 transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-gray-800/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-500/30">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-white tracking-tight text-sm block">Feedback Analytics</span>
              <span className="text-[10px] text-gray-400 leading-none">Academic Intelligence</span>
            </div>
          </div>
          <button
            onClick={() => setIsOpenMobile(false)}
            className="lg:hidden text-gray-400 hover:text-white p-1 rounded-md"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
            Analytics Views
          </div>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors text-left ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20'
                    : 'text-gray-300 hover:bg-gray-800/80 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom Data Source Indicator */}
        <div className="p-3 border-t border-gray-800/80 bg-gray-950/40">
          <div className="bg-gray-900/90 rounded-xl p-3 border border-gray-800">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">Data Source</span>
              {source ? (
                <div className="flex items-center gap-1.5" title="Connected">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-[10px] font-medium text-emerald-400">Live</span>
                </div>
              ) : (
                <span className="text-[10px] text-gray-500">Disconnected</span>
              )}
            </div>

            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-md bg-emerald-950/80 border border-emerald-800/50 flex items-center justify-center text-emerald-400 shrink-0">
                {source?.isDemo ? <Sparkles className="w-3.5 h-3.5" /> : <Sheet className="w-3.5 h-3.5" />}
              </div>
              <div className="truncate text-xs text-gray-200 font-medium">
                {source ? (source.isDemo ? 'Sample Demo Data' : 'Google Sheets') : 'No Sheet Connected'}
              </div>
            </div>

            {source && (
              <div className="text-[10px] text-gray-400 truncate mb-2">
                Loaded at {source.lastLoadedAt}
              </div>
            )}

            <button
              onClick={onChangeSheet}
              className="w-full text-center py-1.5 px-2 text-[11px] font-medium text-indigo-300 hover:text-indigo-200 bg-indigo-950/50 hover:bg-indigo-900/60 border border-indigo-800/40 rounded-lg transition-colors cursor-pointer"
            >
              {source ? 'Switch Spreadsheet' : 'Connect Sheet'}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
