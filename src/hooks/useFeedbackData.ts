import { useMemo } from 'react';
import type { FeedbackRecord, FilterState, QuestionMeta } from '../types/feedback';

import {
  filterRecords,
  getAvailableClasses,
  getAvailableDepartments,
  getAvailableSections,
} from '../utils/filters';
import {
  calculateClassSummaries,
  calculateKPIs,
  calculateQuestionPerformance,
  calculateRatingDistribution,
  calculateSectionComparison,
} from '../utils/statistics';

export function useFeedbackData(
  records: FeedbackRecord[],
  questions: QuestionMeta[],
  filters: FilterState
) {
  // Available options for cascading filters
  const availableDepartments = useMemo(() => getAvailableDepartments(records), [records]);

  const availableClasses = useMemo(
    () => getAvailableClasses(records, filters.department),
    [records, filters.department]
  );

  const availableSections = useMemo(
    () => getAvailableSections(records, filters.department, filters.className),
    [records, filters.department, filters.className]
  );

  // Filtered dataset
  const filteredRecords = useMemo(
    () => filterRecords(records, filters),
    [records, filters]
  );

  // Memoized calculations
  const kpis = useMemo(() => calculateKPIs(filteredRecords), [filteredRecords]);

  const ratingDistribution = useMemo(
    () => calculateRatingDistribution(filteredRecords),
    [filteredRecords]
  );

  const questionPerformance = useMemo(
    () => calculateQuestionPerformance(filteredRecords, questions),
    [filteredRecords, questions]
  );

  const sectionComparison = useMemo(
    () => calculateSectionComparison(filteredRecords),
    [filteredRecords]
  );

  const classSummaries = useMemo(
    () => calculateClassSummaries(filteredRecords),
    [filteredRecords]
  );

  return {
    filteredRecords,
    kpis,
    ratingDistribution,
    questionPerformance,
    sectionComparison,
    classSummaries,
    availableDepartments,
    availableClasses,
    availableSections,
  };
}
