import { useState } from 'react';

import { useSpreadsheet } from './hooks/useSpreadsheet';
import { useFilters } from './hooks/useFilters';
import { useFeedbackData } from './hooks/useFeedbackData';
import type { ActiveTab, QuestionPerformanceItem } from './types/feedback';



import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { SpreadsheetLoader } from './components/SpreadsheetLoader';
import { SkeletonLoader } from './components/SkeletonLoader';
import { QuestionDetailModal } from './components/QuestionDetailModal';
import { SpreadsheetGuideModal } from './components/SpreadsheetGuideModal';

// Pages
import { Dashboard } from './pages/Dashboard';
import { Feedback } from './pages/Feedback';
import { Questions } from './pages/Questions';
import { Classes } from './pages/Classes';
import { Ratings } from './pages/Ratings';
import { Suggestions } from './pages/Suggestions';
import { RawData } from './pages/RawData';

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [isOpenMobile, setIsOpenMobile] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<QuestionPerformanceItem | null>(null);

  // Spreadsheet state hook
  const {
    source,
    records,
    questions,
    headers,
    isLoading,
    error,
    loadFromUrl,
    loadSampleData,
    refresh,
    clearData,
  } = useSpreadsheet();

  // Filters state hook
  const {
    filters,
    setDepartment,
    setClassName,
    setSection,
    resetFilters,
    removeFilter,
    activePills,
    hasActiveFilters,
  } = useFilters();

  // Calculated feedback analytics hook
  const {
    filteredRecords,
    kpis,
    ratingDistribution,
    questionPerformance,
    sectionComparison,
    classSummaries,
    contentRatingStats,
    speakerRatingStats,
    futureSuggestions,
    availableDepartments,
    availableClasses,
    availableSections,
  } = useFeedbackData(records, questions, filters);

  return (
    <div className="min-h-screen bg-[#F7F8FC] text-[#111827] flex">
      {/* If a spreadsheet is loaded, render the complete app layout */}
      {source ? (
        <>
          {/* Sidebar */}
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            source={source}
            onChangeSheet={clearData}
            isOpenMobile={isOpenMobile}
            setIsOpenMobile={setIsOpenMobile}
          />

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0 lg:pl-60">
            {/* Header */}
            <Header
              activeTab={activeTab}
              source={source}
              totalRecordsCount={records.length}
              filteredRecordsCount={filteredRecords.length}
              isLoading={isLoading}
              onRefresh={refresh}
              onChangeSheet={clearData}
              onOpenGuide={() => setIsGuideOpen(true)}
              onToggleMobileMenu={() => setIsOpenMobile(true)}
            />

            {/* Page Body */}
            <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
              {isLoading ? (
                <SkeletonLoader />
              ) : (
                <>
                  {activeTab === 'overview' && (
                    <Dashboard
                      filters={filters}
                      availableDepartments={availableDepartments}
                      availableClasses={availableClasses}
                      availableSections={availableSections}
                      activePills={activePills}
                      hasActiveFilters={hasActiveFilters}
                      onDepartmentChange={setDepartment}
                      onClassChange={setClassName}
                      onSectionChange={setSection}
                      onResetFilters={resetFilters}
                      onRemovePill={removeFilter}
                      kpis={kpis}
                      ratingDistribution={ratingDistribution}
                      questionPerformance={questionPerformance}
                      sectionComparison={sectionComparison}
                      onSelectQuestion={setSelectedQuestion}
                      contentRatingStats={contentRatingStats}
                      speakerRatingStats={speakerRatingStats}
                      futureSuggestions={futureSuggestions}
                      onNavigateTab={setActiveTab}
                    />
                  )}

                  {activeTab === 'feedback' && (
                    <Feedback
                      records={filteredRecords}
                      filters={filters}
                      availableDepartments={availableDepartments}
                      availableClasses={availableClasses}
                      availableSections={availableSections}
                      activePills={activePills}
                      hasActiveFilters={hasActiveFilters}
                      onDepartmentChange={setDepartment}
                      onClassChange={setClassName}
                      onSectionChange={setSection}
                      onResetFilters={resetFilters}
                      onRemovePill={removeFilter}
                    />
                  )}

                  {activeTab === 'questions' && (
                    <Questions
                      questionPerformance={questionPerformance}
                      filters={filters}
                      availableDepartments={availableDepartments}
                      availableClasses={availableClasses}
                      availableSections={availableSections}
                      activePills={activePills}
                      hasActiveFilters={hasActiveFilters}
                      onDepartmentChange={setDepartment}
                      onClassChange={setClassName}
                      onSectionChange={setSection}
                      onResetFilters={resetFilters}
                      onRemovePill={removeFilter}
                      onSelectQuestion={setSelectedQuestion}
                    />
                  )}

                  {activeTab === 'classes' && (
                    <Classes
                      classSummaries={classSummaries}
                      filters={filters}
                      availableDepartments={availableDepartments}
                      availableClasses={availableClasses}
                      availableSections={availableSections}
                      activePills={activePills}
                      hasActiveFilters={hasActiveFilters}
                      onDepartmentChange={setDepartment}
                      onClassChange={setClassName}
                      onSectionChange={setSection}
                      onResetFilters={resetFilters}
                      onRemovePill={removeFilter}
                    />
                  )}

                  {activeTab === 'ratings' && (
                    <Ratings
                      records={filteredRecords}
                      contentRatingStats={contentRatingStats}
                      speakerRatingStats={speakerRatingStats}
                      filters={filters}
                      availableDepartments={availableDepartments}
                      availableClasses={availableClasses}
                      availableSections={availableSections}
                      activePills={activePills}
                      hasActiveFilters={hasActiveFilters}
                      onDepartmentChange={setDepartment}
                      onClassChange={setClassName}
                      onSectionChange={setSection}
                      onResetFilters={resetFilters}
                      onRemovePill={removeFilter}
                    />
                  )}

                  {activeTab === 'suggestions' && (
                    <Suggestions
                      suggestions={futureSuggestions}
                      filters={filters}
                      availableDepartments={availableDepartments}
                      availableClasses={availableClasses}
                      availableSections={availableSections}
                      activePills={activePills}
                      hasActiveFilters={hasActiveFilters}
                      onDepartmentChange={setDepartment}
                      onClassChange={setClassName}
                      onSectionChange={setSection}
                      onResetFilters={resetFilters}
                      onRemovePill={removeFilter}
                    />
                  )}

                  {activeTab === 'raw' && (
                    <RawData
                      records={filteredRecords}
                      headers={headers}
                      filters={filters}
                      availableDepartments={availableDepartments}
                      availableClasses={availableClasses}
                      availableSections={availableSections}
                      activePills={activePills}
                      hasActiveFilters={hasActiveFilters}
                      onDepartmentChange={setDepartment}
                      onClassChange={setClassName}
                      onSectionChange={setSection}
                      onResetFilters={resetFilters}
                      onRemovePill={removeFilter}
                    />
                  )}
                </>
              )}
            </main>
          </div>
        </>
      ) : (
        /* No Spreadsheet Loaded: Landing Screen */
        <main className="flex-1 flex flex-col justify-center items-center">
          <SpreadsheetLoader
            isLoading={isLoading}
            error={error}
            onConnect={loadFromUrl}
            onLoadSample={loadSampleData}
            onOpenGuide={() => setIsGuideOpen(true)}
          />
        </main>
      )}

      {/* Detail Modals */}
      <QuestionDetailModal
        question={selectedQuestion}
        onClose={() => setSelectedQuestion(null)}
      />

      <SpreadsheetGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        onUseSample={() => {
          setIsGuideOpen(false);
          loadSampleData();
        }}
      />
    </div>
  );
}

export default App;
