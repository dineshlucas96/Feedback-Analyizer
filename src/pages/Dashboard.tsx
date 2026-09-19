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
import { FilterBar } from '../components/FilterBar';
import { KPICards } from '../components/KPICards';
import { ChartCard } from '../components/ChartCard';
import { EmptyState } from '../components/EmptyState';
import type {
  FilterState,
  KPIData,
  QuestionPerformanceItem,
  RatingDistributionItem,
  SectionComparisonItem,
} from '../types/feedback';
import type { ActiveFilterPill } from '../hooks/useFilters';


interface DashboardProps {
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
  kpis: KPIData;
  ratingDistribution: RatingDistributionItem[];
  questionPerformance: QuestionPerformanceItem[];
  sectionComparison: SectionComparisonItem[];
  onSelectQuestion: (question: QuestionPerformanceItem) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
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
  kpis,
  ratingDistribution,
  questionPerformance,
  sectionComparison,
  onSelectQuestion,
}) => {
  if (kpis.totalResponses === 0) {
    return (
      <div>
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
        <EmptyState onAction={onResetFilters} />
      </div>
    );
  }

  // Question performance sorted and limited for horizontal bar chart
  const horizontalQuestions = questionPerformance.map(q => ({
    name: q.question.length > 26 ? q.question.substring(0, 24) + '...' : q.question,
    fullName: q.question,
    score: q.average,
    rawItem: q,
  }));

  // Section comparison data
  const sectionChartData = sectionComparison.map(s => ({
    name: `Sec ${s.section}`,
    fullName: `${s.department} • ${s.className} • Section ${s.section}`,
    score: s.average,
    responses: s.responses,
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Cascading Filter Bar */}
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

      {/* KPI Cards */}
      <KPICards kpis={kpis} />

      {/* Main Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Rating Distribution */}
        <ChartCard
          title="Rating Distribution"
          subtitle="Breakdown of student evaluation scores (1 to 5 Stars)"
        >
          <div className="h-68 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={ratingDistribution}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis
                  dataKey="label"
                  stroke="#9CA3AF"
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ stroke: '#E5E7EB' }}
                />
                <YAxis
                  stroke="#9CA3AF"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  cursor={{ fill: '#F9FAFB' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload as RatingDistributionItem;
                      return (
                        <div className="bg-white border border-gray-200 rounded-lg p-2.5 shadow-md text-xs">
                          <span className="font-semibold text-gray-900 block">{data.label} Rating</span>
                          <span className="text-gray-600">
                            {data.count.toLocaleString()} responses ({data.percentage}%)
                          </span>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {ratingDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Chart 2: Question Performance (Horizontal Bar Chart) */}
        <ChartCard
          title="Average Rating by Question"
          subtitle="Click any question to view distribution"
        >
          <div className="h-68 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={horizontalQuestions}
                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F3F4F6" />
                <XAxis
                  type="number"
                  domain={[0, 5]}
                  ticks={[0, 1, 2, 3, 4, 5]}
                  stroke="#9CA3AF"
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ stroke: '#E5E7EB' }}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  stroke="#4B5563"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  width={140}
                />
                <Tooltip
                  cursor={{ fill: '#F9FAFB' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white border border-gray-200 rounded-lg p-2.5 shadow-md text-xs max-w-xs">
                          <span className="font-semibold text-gray-900 block">{data.fullName}</span>
                          <div className="flex items-center gap-1 mt-1 text-indigo-600 font-bold">
                            <span>Score: {data.score.toFixed(2)} / 5.0</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                  dataKey="score"
                  fill="#6366F1"
                  radius={[0, 4, 4, 0]}
                  onClick={(data: any) => {
                    if (data && data.rawItem) {
                      onSelectQuestion(data.rawItem);
                    }
                  }}

                  className="cursor-pointer"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Chart 3: Section Comparison */}
        <ChartCard
          title="Section Comparison"
          subtitle="Performance comparison across class cohorts and sections"
        >
          {sectionChartData.length === 0 ? (
            <div className="h-68 flex items-center justify-center text-xs text-gray-400">
              No section data available for current selection
            </div>
          ) : (
            <div className="h-68 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={sectionChartData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                  <XAxis
                    dataKey="name"
                    stroke="#9CA3AF"
                    fontSize={12}
                    tickLine={false}
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
                            <span className="font-semibold text-gray-900 block">{data.fullName}</span>
                            <div className="mt-1 text-gray-700">
                              Avg Rating: <strong>{data.score.toFixed(2)} / 5.0</strong>
                            </div>
                            <div className="text-gray-500 text-[11px]">
                              {data.responses} responses
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="score" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </ChartCard>
      </div>
    </div>
  );
};
