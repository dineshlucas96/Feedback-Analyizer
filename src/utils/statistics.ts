import type {
  ClassAnalysisItem,
  FeedbackRecord,
  KPIData,
  QuestionMeta,
  QuestionPerformanceItem,
  RatingDistributionItem,
  SectionComparisonItem,
} from '../types/feedback';


export function calculateKPIs(records: FeedbackRecord[]): KPIData {
  if (records.length === 0) {
    return {
      totalResponses: 0,
      averageRating: 0,
      positiveFeedbackRate: 0,
      sectionCount: 0,
    };
  }

  const total = records.length;
  let totalRatingSum = 0;
  let validRatingsCount = 0;
  let positiveCount = 0;

  const sections = new Set<string>();

  records.forEach(r => {
    if (r.averageRating > 0) {
      totalRatingSum += r.averageRating;
      validRatingsCount++;
      if (r.averageRating >= 4.0) {
        positiveCount++;
      }
    }
    if (r.section) sections.add(`${r.department}__${r.className}__${r.section}`);
  });

  const avg = validRatingsCount > 0 ? Number((totalRatingSum / validRatingsCount).toFixed(2)) : 0;
  const positiveRate = validRatingsCount > 0 ? Number(((positiveCount / validRatingsCount) * 100).toFixed(1)) : 0;

  return {
    totalResponses: total,
    averageRating: avg,
    positiveFeedbackRate: positiveRate,
    sectionCount: sections.size,
  };
}

export function calculateRatingDistribution(records: FeedbackRecord[]): RatingDistributionItem[] {
  const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  let total = 0;

  records.forEach(r => {
    if (r.averageRating > 0) {
      const rounded = Math.min(5, Math.max(1, Math.round(r.averageRating))) as 1 | 2 | 3 | 4 | 5;
      counts[rounded] = (counts[rounded] || 0) + 1;
      total++;
    }
  });

  const colors: Record<number, string> = {
    5: '#10B981', // green
    4: '#6366F1', // indigo
    3: '#3B82F6', // blue
    2: '#F59E0B', // amber
    1: '#EF4444', // red
  };

  const stars = [5, 4, 3, 2, 1] as const;
  return stars.map(star => {
    const count = counts[star];
    const percentage = total > 0 ? Number(((count / total) * 100).toFixed(1)) : 0;
    return {
      star,
      label: `${star} ★`,
      count,
      percentage,
      color: colors[star],
    };
  });
}

export function calculateQuestionPerformance(
  records: FeedbackRecord[],
  questions: QuestionMeta[]
): QuestionPerformanceItem[] {
  const items: QuestionPerformanceItem[] = questions.map(q => {
    let sum = 0;
    let count = 0;
    const starCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    records.forEach(r => {
      const val = r.ratings[q.key];
      if (val !== undefined && !isNaN(val)) {
        sum += val;
        count++;
        const rounded = Math.min(5, Math.max(1, Math.round(val)));
        starCounts[rounded] = (starCounts[rounded] || 0) + 1;
      }
    });

    const average = count > 0 ? Number((sum / count).toFixed(2)) : 0;
    const distribution = [5, 4, 3, 2, 1].map(star => ({
      star,
      count: starCounts[star] || 0,
      percentage: count > 0 ? Number((((starCounts[star] || 0) / count) * 100).toFixed(1)) : 0,
    }));

    return {
      key: q.key,
      question: q.label,
      average,
      count,
      distribution,
    };
  });

  // Sort descending by average rating
  return items.sort((a, b) => b.average - a.average);
}

export function calculateSectionComparison(records: FeedbackRecord[]): SectionComparisonItem[] {
  const map = new Map<string, { department: string; className: string; section: string; sum: number; count: number }>();

  records.forEach(r => {
    const key = `${r.department} - ${r.className} - Sec ${r.section}`;
    const item = map.get(key) || {
      department: r.department,
      className: r.className,
      section: r.section,
      sum: 0,
      count: 0,
    };
    if (r.averageRating > 0) {
      item.sum += r.averageRating;
      item.count++;
    }
    map.set(key, item);
  });

  const result: SectionComparisonItem[] = [];
  map.forEach((data, key) => {
    result.push({
      sectionKey: key,
      department: data.department,
      className: data.className,
      section: data.section,
      average: data.count > 0 ? Number((data.sum / data.count).toFixed(2)) : 0,
      responses: data.count,
    });
  });

  return result.sort((a, b) => a.section.localeCompare(b.section));
}

export function calculateClassSummaries(records: FeedbackRecord[]): ClassAnalysisItem[] {
  const map = new Map<string, { department: string; className: string; section: string; sum: number; count: number; pos: number }>();

  records.forEach(r => {
    const key = `${r.department}__${r.className}__${r.section}`;
    if (!map.has(key)) {
      map.set(key, {
        department: r.department,
        className: r.className,
        section: r.section,
        sum: 0,
        count: 0,
        pos: 0,
      });
    }
    const item = map.get(key)!;
    if (r.averageRating > 0) {
      item.sum += r.averageRating;
      item.count++;
      if (r.averageRating >= 4.0) item.pos++;
    }
  });

  const result: ClassAnalysisItem[] = [];
  map.forEach(item => {
    result.push({
      department: item.department,
      className: item.className,
      section: item.section,
      responses: item.count,
      averageRating: item.count > 0 ? Number((item.sum / item.count).toFixed(2)) : 0,
      positiveRate: item.count > 0 ? Number(((item.pos / item.count) * 100).toFixed(1)) : 0,
    });
  });

  return result.sort((a, b) => b.averageRating - a.averageRating);
}
