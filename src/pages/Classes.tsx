import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Star } from 'lucide-react';
import type { ClassAnalysisItem, FilterState } from '../types/feedback';
import { FilterBar } from '../components/FilterBar';
import { EmptyState } from '../components/EmptyState';
import { ChartCard } from '../components/ChartCard';
import type { ActiveFilterPill } from '../hooks/useFilters';


interface ClassesProps {
  classSummaries: ClassAnalysisItem[];
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

export const Classes: React.FC<ClassesProps> = ({
  classSummaries,
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
  const chartData = classSummaries.map(c => ({
    name: `${c.department} ${c.className} (${c.section})`,
    shortName: `${c.department} ${c.section}`,
    average: c.averageRating,
    responses: c.responses,
    positiveRate: c.positiveRate,
  }));

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

      {classSummaries.length === 0 ? (
        <EmptyState onAction={onResetFilters} />
      ) : (
        <>
          {/* Comparison Bar Chart */}
          <ChartCard
            title="Class & Cohort Rating Comparison"
            subtitle="Benchmark average student satisfaction across classes and sections"
          >
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 25 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                  <XAxis
                    dataKey="name"
                    stroke="#6B7280"
                    fontSize={11}
                    tickLine={false}
                    interval={0}
                    angle={-15}
                    textAnchor="end"
                    axisLine={{ stroke: '#E5E7EB' }}
                  />
                  <YAxis
                    domain={[0, 5]}
                    ticks={[1, 2, 3, 4, 5]}
                    stroke="#9CA3AF"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: '#F9FAFB' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white border border-gray-200 rounded-lg p-2.5 shadow-md text-xs">
                            <span className="font-semibold text-gray-900 block">{data.name}</span>
                            <div className="mt-1 text-gray-700">
                              Avg Rating: <strong>{data.average.toFixed(2)} / 5.0</strong>
                            </div>
                            <div className="text-emerald-600 font-medium text-[11px]">
                              {data.positiveRate}% Positive Feedback
                            </div>
                            <div className="text-gray-500 text-[11px]">
                              {data.responses} student responses
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="average" fill="#6366F1" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.average >= 4.2 ? '#10B981' : entry.average >= 3.8 ? '#6366F1' : '#F59E0B'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          {/* Classes Table */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">Cohorts Breakdown</h3>
              <span className="text-xs text-gray-500">{classSummaries.length} classes / sections</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#E5E7EB] bg-gray-50/70 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                    <th className="py-3 px-4">Department</th>
                    <th className="py-3 px-4">Class / Year</th>
                    <th className="py-3 px-4 text-center">Section</th>
                    <th className="py-3 px-4 text-center">Responses</th>
                    <th className="py-3 px-4 text-center">Average Rating</th>
                    <th className="py-3 px-4 text-center">Positive Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  {classSummaries.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/60 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-gray-900">
                        {item.department}
                      </td>
                      <td className="py-3.5 px-4 text-gray-700">
                        {item.className}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex px-2 py-0.5 rounded bg-gray-100 font-semibold text-gray-800">
                          {item.section}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center font-medium text-gray-800">
                        {item.responses.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="inline-flex items-center gap-1 font-bold text-gray-900">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{item.averageRating.toFixed(2)}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="font-semibold text-emerald-600">
                          {item.positiveRate}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
