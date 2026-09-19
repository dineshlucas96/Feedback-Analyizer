import type { ColumnMapping } from '../types/feedback';

/**
 * Normalizes a header string for fuzzy matching (lowercase, trimmed, stripped of special chars).
 */
export function normalizeHeader(header: string): string {
  return header
    .toLowerCase()
    .trim()
    .replace(/[_\-/\\ ]+/g, ' ')

    .replace(/[^\w\s]/g, '');
}

/**
 * Normalizes text or numeric rating value into a numeric scale (1 - 5).
 * Returns NaN if the value cannot be parsed as a rating.
 */
export function parseRating(value: unknown): number {
  if (value === null || value === undefined) return NaN;
  const str = String(value).trim();
  if (!str) return NaN;

  // Direct number check
  const num = Number(str);
  if (!isNaN(num)) {
    if (num >= 1 && num <= 5) return num;
    if (num > 5 && num <= 10) return Math.round((num / 2) * 10) / 10;
    if (num > 10 && num <= 100) return Math.round((num / 20) * 10) / 10;
  }

  // Textual mapping
  const lower = str.toLowerCase();
  
  if (
    lower === 'excellent' ||
    lower === 'strongly agree' ||
    lower === 'outstanding' ||
    lower === '5 - excellent' ||
    lower.startsWith('5')
  ) {
    return 5;
  }
  if (
    lower === 'very good' ||
    lower === 'above average' ||
    lower === '4 - very good' ||
    lower.startsWith('4')
  ) {
    return 4.5;
  }
  if (
    lower === 'good' ||
    lower === 'agree' ||
    lower === 'satisfactory' ||
    lower === '3 - good' ||
    lower.startsWith('3')
  ) {
    return 4;
  }
  if (
    lower === 'average' ||
    lower === 'neutral' ||
    lower === 'fair' ||
    lower === 'moderate' ||
    lower.startsWith('2.5')
  ) {
    return 3;
  }
  if (
    lower === 'poor' ||
    lower === 'disagree' ||
    lower === 'needs improvement' ||
    lower === 'below average' ||
    lower === '2 - poor' ||
    lower.startsWith('2')
  ) {
    return 2;
  }
  if (
    lower === 'very poor' ||
    lower === 'strongly disagree' ||
    lower === 'terrible' ||
    lower === '1 - very poor' ||
    lower.startsWith('1')
  ) {
    return 1;
  }

  return NaN;
}

/**
 * Automatically inspects dataset headers and sample rows to deduce the column mapping.
 */
export function detectColumnMapping(headers: string[], sampleRows: Record<string, string>[] = []): ColumnMapping {
  const mapping: ColumnMapping = {
    departmentCol: null,
    classCol: null,
    sectionCol: null,
    contentRatingCol: null,
    speakerRatingCol: null,
    suggestionCol: null,
    timestampCol: null,
    commentsCol: null,
    questionCols: [],
  };

  const departmentAliases = ['department', 'dept', 'department name', 'branch', 'discipline', 'course stream'];
  const classAliases = ['class', 'year', 'class year', 'academic year', 'batch', 'semester', 'sem', 'study year'];
  const sectionAliases = ['section', 'sec', 'division', 'div', 'group'];
  const contentRatingAliases = ['content rating', 'content', 'content quality', 'rating of content', 'rating on content', 'content relevance', 'material rating'];
  const speakerRatingAliases = ['speaker rating', 'speaker', 'speaker quality', 'presenter rating', 'rating of speaker', 'delivery rating', 'presentation skills rating'];
  const suggestionAliases = ['future suggestion', 'future suggestions', 'suggestions', 'suggestion', 'suggestions for improvement', 'suggestions for the future', 'suggestions for future', 'future improvements', 'any suggestions', 'improvement suggestions', 'recommendations'];
  const timestampAliases = ['timestamp', 'date', 'submitted at', 'submitted date', 'time', 'created at', 'submission time'];
  const commentAliases = ['comments', 'comment', 'feedback', 'student comments', 'remarks', 'any comments', 'student feedback', 'overall comments'];

  // Helper matcher
  const findMatch = (aliases: string[], excluded: string[]): string | null => {
    for (const h of headers) {
      if (excluded.includes(h)) continue;
      const norm = normalizeHeader(h);
      if (aliases.includes(norm)) return h;
    }
    // Substring partial match
    for (const h of headers) {
      if (excluded.includes(h)) continue;
      const norm = normalizeHeader(h);
      if (aliases.some(alias => norm.includes(alias) || alias.includes(norm))) return h;
    }
    return null;
  };

  const allocated: string[] = [];

  // Match Department
  mapping.departmentCol = findMatch(departmentAliases, allocated);
  if (mapping.departmentCol) allocated.push(mapping.departmentCol);

  // Match Class
  mapping.classCol = findMatch(classAliases, allocated);
  if (mapping.classCol) allocated.push(mapping.classCol);

  // Match Section
  mapping.sectionCol = findMatch(sectionAliases, allocated);
  if (mapping.sectionCol) allocated.push(mapping.sectionCol);

  // Match Content Rating
  mapping.contentRatingCol = findMatch(contentRatingAliases, allocated);
  if (mapping.contentRatingCol) allocated.push(mapping.contentRatingCol);

  // Match Speaker Rating
  mapping.speakerRatingCol = findMatch(speakerRatingAliases, allocated);
  if (mapping.speakerRatingCol) allocated.push(mapping.speakerRatingCol);

  // Match Future Suggestions
  mapping.suggestionCol = findMatch(suggestionAliases, allocated);
  if (mapping.suggestionCol) allocated.push(mapping.suggestionCol);

  // Match Timestamp
  mapping.timestampCol = findMatch(timestampAliases, allocated);
  if (mapping.timestampCol) allocated.push(mapping.timestampCol);

  // Match Comments
  mapping.commentsCol = findMatch(commentAliases, allocated);
  if (mapping.commentsCol) allocated.push(mapping.commentsCol);

  // Identify remaining columns as potential questions (ratings)
  const potentialQuestionCols = headers.filter(h => !allocated.includes(h));

  // Test potential questions against sample rows to see if they hold rating data
  for (const col of potentialQuestionCols) {
    let validRatingCount = 0;
    let testedCount = 0;

    for (const row of sampleRows.slice(0, 30)) {
      const val = row[col];
      if (val !== undefined && val !== null && String(val).trim() !== '') {
        testedCount++;
        const parsed = parseRating(val);
        if (!isNaN(parsed)) {
          validRatingCount++;
        }
      }
    }

    // If more than 40% of non-empty sample values parse as valid ratings, or column name looks like a question
    const norm = normalizeHeader(col);
    const looksLikeQuestion =
      norm.includes('rate') ||
      norm.includes('clarity') ||
      norm.includes('knowledge') ||
      norm.includes('syllabus') ||
      norm.includes('teaching') ||
      norm.includes('punctual') ||
      norm.includes('communication') ||
      norm.includes('explain') ||
      norm.includes('doubt') ||
      norm.startsWith('q') ||
      norm.includes('question') ||
      norm.includes('interaction') ||
      norm.includes('engagement') ||
      norm.includes('materials');

    if ((testedCount > 0 && validRatingCount / testedCount >= 0.35) || looksLikeQuestion || (testedCount === 0 && potentialQuestionCols.length <= 15)) {
      mapping.questionCols.push(col);
    }
  }

  // Fallback: If no question columns detected, take any leftover numeric-ish columns
  if (mapping.questionCols.length === 0 && potentialQuestionCols.length > 0) {
    mapping.questionCols = potentialQuestionCols;
  }

  return mapping;
}
