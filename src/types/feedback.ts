export interface FeedbackRecord {
  id: string;
  timestamp?: string;
  department: string;
  className: string;
  section: string;
  contentRating?: number;
  speakerRating?: number;
  futureSuggestion?: string;
  ratings: Record<string, number>; // key: question label, value: 1-5
  averageRating: number; // average rating across questions in this record
  comments?: string;
  raw: Record<string, string>;
}

export interface QuestionMeta {
  key: string;
  label: string;
  columnName: string;
}

export interface ColumnMapping {
  departmentCol: string | null;
  classCol: string | null;
  sectionCol: string | null;
  contentRatingCol: string | null;
  speakerRatingCol: string | null;
  suggestionCol: string | null;
  timestampCol: string | null;
  commentsCol: string | null;
  questionCols: string[];
}

export interface FilterState {
  department: string;
  className: string;
  section: string;
}

export interface KPIData {
  totalResponses: number;
  averageRating: number;
  positiveFeedbackRate: number;
  sectionCount: number;
}

export interface RatingDistributionItem {
  star: number;
  label: string;
  count: number;
  percentage: number;
  color: string;
}

export interface QuestionPerformanceItem {
  key: string;
  question: string;
  average: number;
  count: number;
  distribution: { star: number; count: number; percentage: number }[];
}

export interface RatingBreakdownItem {
  star: number;
  count: number;
  percentage: number;
}

export interface RatingAspectStats {
  average: number;
  count: number;
  positiveRate: number;
  distribution: RatingBreakdownItem[];
}

export interface FutureSuggestionItem {
  text: string;
  department: string;
  className: string;
  section: string;
}

export interface SectionComparisonItem {
  sectionKey: string;
  department: string;
  className: string;
  section: string;
  average: number;
  responses: number;
}

export interface ClassAnalysisItem {
  department: string;
  className: string;
  section: string;
  responses: number;
  averageRating: number;
  positiveRate: number;
}

export interface SpreadsheetSource {
  url: string;
  spreadsheetId: string;
  title?: string;
  isDemo: boolean;
  lastLoadedAt: string;
}

export type ActiveTab = 'overview' | 'feedback' | 'questions' | 'classes' | 'ratings' | 'suggestions' | 'raw';
