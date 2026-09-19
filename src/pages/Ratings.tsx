import React, { useMemo } from 'react';
import { BookMarked, Mic2, Table2 } from 'lucide-react';
import type { FeedbackRecord, FilterState, RatingAspectStats } from '../types/feedback';
import { FilterBar } from '../components/FilterBar';
import { RatingSection } from '../components/RatingSection';
import { EmptyState } from '../components/EmptyState';
import type { ActiveFilterPill } from '../hooks/useFilters';

interface RatingsProps {
  records: FeedbackRecord[];
  contentRatingStats: RatingAspectStats;
  speakerRatingStats: RatingAspectStats;
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

interface SectionAspectRow {
  key: string;
  department: string;
  className: string;
  section: string;
  responses: number;
  contentAverage: number;
  speakerAverage: number;
}

export const Ratings: React.FC<RatingsProps> = ({
  records,
  contentRatingStats,
  speakerRatingStats,
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
  const sectionRows = useMemo(() => {
    const map = new Map<
      string,
      { department: string; className: string; section: string; responses: number; contentSum: number; contentCount: number; speakerSum: number; speakerCount: number }
    >();

    records.forEach(r => {
      const key = `${r.department}__${r.className}__${r.section}`;
      const item = map.get(key) || {
        department: r.department,
        className: r.className,
        section: r.section,
        responses: 0,
        contentSum: 0,
        contentCount: 0,
        speakerSum: 0,
        speakerCount: 0,
      };
      item.responses++;
      if (r.contentRating !== undefined) {
        item.contentSum += r.contentRating;
        item.contentCount++;
      }
      if (r.speakerRating !== undefined) {
        item.speakerSum += r.speakerRating;
        item.speakerCount++;
      }
      map.set(key, item);
    });

    const rows: SectionAspectRow[] = [];
    map.forEach(item => {
      rows.push({
        key: `${item.department}_${item.className}_${item.section}`,
        department: item.department,
        className: item.className,
        section: item.section,
        responses: item.responses,
        contentAverage: item.contentCount > 0 ? Number((item.contentSum / item.contentCount).toFixed(2)) : 0,
        speakerAverage: item.speakerCount > 0 ? Number((item.speakerSum / item.speakerCount).toFixed(2)) : 0,
      });
    });

    return rows.sort((a, b) => a.department.localeCompare(b.department) || a.className.localeCompare(b.className) || a.section.localeCompare(b.section));
  }, [records]);

  return (
    <div className="space-y-6 animate-fade-in">
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

      {/* Content & Speaker Rating Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RatingSection
          title="Content Rating"
          subtitle="Evaluation of the session material and subject matter"
          stats={contentRatingStats}
          icon={<BookMarked className="w-4 h-4" />}
          accentClass="bg-blue-50 text-blue-600"
          barClass="bg-blue-500"
        />
        <RatingSection
          title="Speaker Rating"
          subtitle="Evaluation of the presenter's delivery and clarity"
          stats={speakerRatingStats}
          icon={<Mic2 className="w-4 h-4" />}
          accentClass="bg-emerald-50 text-emerald-600"
          barClass="bg-emerald-500"
        />
      </div>

      {/* Content vs Speaker by Section */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-2xs overflow-hidden">
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-100">
          <Table2 className="w-4 h-4 text-indigo-600" />
          <h2 className="text-base font-semibold text-[#111827] tracking-tight">Content vs Speaker by Section</h2>
        </div>

        {sectionRows.length === 0 ? (
          <EmptyState onAction={onResetFilters} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E5E7EB] bg-gray-50/70 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Section</th>
                  <th className="py-3 px-4 text-center">Responses</th>
                  <th className="py-3 px-4 text-center">Content Avg</th>
                  <th className="py-3 px-4 text-center">Speaker Avg</th>
                  <th className="py-3 px-4 text-center">Gap</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {sectionRows.map(row => {
                  const gap = row.speakerAverage - row.contentAverage;
                  return (
                    <tr key={row.key} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-semibold text-gray-900">{row.department}</span>
                        <span className="text-gray-400"> • {row.className} - Sec {row.section}</span>
                      </td>
                      <td className="py-3 px-4 text-center text-gray-600">{row.responses}</td>
                      <td className="py-3 px-4 text-center font-semibold text-blue-600">{row.contentAverage.toFixed(2)}</td>
                      <td className="py-3 px-4 text-center font-semibold text-emerald-600">{row.speakerAverage.toFixed(2)}</td>
                      <td
                        className={`py-3 px-4 text-center font-medium ${
                          gap === 0 ? 'text-gray-400' : gap > 0 ? 'text-emerald-600' : 'text-amber-600'
                        }`}
                      >
                        {gap > 0 ? '+' : ''}{gap.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};