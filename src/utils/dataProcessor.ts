import type { ColumnMapping, FeedbackRecord, QuestionMeta } from '../types/feedback';
import { parseRating } from './columnMapper';

export function processRawData(
  rows: Record<string, string>[],
  mapping: ColumnMapping
): { records: FeedbackRecord[]; questions: QuestionMeta[] } {
  const questions: QuestionMeta[] = mapping.questionCols.map((col, idx) => ({
    key: `q_${idx}_${col.replace(/[^\w]/g, '_')}`,
    label: col,
    columnName: col,
  }));

  const records: FeedbackRecord[] = [];

  rows.forEach((row, index) => {
    // Check if row is completely empty
    const values = Object.values(row).map(v => String(v).trim());
    if (values.every(v => v === '')) return;

    const department = mapping.departmentCol && row[mapping.departmentCol]?.trim()
      ? row[mapping.departmentCol].trim()
      : 'General';

    const className = mapping.classCol && row[mapping.classCol]?.trim()
      ? row[mapping.classCol].trim()
      : 'General';

    const section = mapping.sectionCol && row[mapping.sectionCol]?.trim()
      ? row[mapping.sectionCol].trim()
      : 'A';

    const contentRatingRaw = mapping.contentRatingCol ? row[mapping.contentRatingCol] : undefined;
    const contentRating = !isNaN(parseRating(contentRatingRaw)) ? parseRating(contentRatingRaw) : undefined;

    const speakerRatingRaw = mapping.speakerRatingCol ? row[mapping.speakerRatingCol] : undefined;
    const speakerRating = !isNaN(parseRating(speakerRatingRaw)) ? parseRating(speakerRatingRaw) : undefined;

    const futureSuggestion = mapping.suggestionCol && row[mapping.suggestionCol]?.trim()
      ? row[mapping.suggestionCol].trim()
      : undefined;

    const timestamp = mapping.timestampCol && row[mapping.timestampCol]?.trim()
      ? row[mapping.timestampCol].trim()
      : undefined;

    const comments = mapping.commentsCol && row[mapping.commentsCol]?.trim()
      ? row[mapping.commentsCol].trim()
      : undefined;

    const ratings: Record<string, number> = {};
    let ratingSum = 0;
    let ratingCount = 0;

    questions.forEach(q => {
      const rawVal = row[q.columnName];
      const parsed = parseRating(rawVal);
      if (!isNaN(parsed)) {
        ratings[q.key] = parsed;
        ratingSum += parsed;
        ratingCount++;
      }
    });

    const averageRating = ratingCount > 0 ? Number((ratingSum / ratingCount).toFixed(2)) : 0;

    records.push({
      id: `record_${index + 1}`,
      timestamp,
      department,
      className,
      section,
      contentRating,
      speakerRating,
      futureSuggestion,
      ratings,
      averageRating,
      comments,
      raw: row,
    });
  });

  return { records, questions };
}
