import type { ColumnMapping, FeedbackRecord, QuestionMeta } from '../types/feedback';

export const SAMPLE_QUESTIONS: QuestionMeta[] = [
  { key: 'q_teaching_clarity', label: 'Teaching Clarity', columnName: 'Teaching Clarity' },
  { key: 'q_subject_knowledge', label: 'Subject Knowledge', columnName: 'Subject Knowledge' },
  { key: 'q_communication', label: 'Communication Skills', columnName: 'Communication Skills' },
  { key: 'q_practical_explanation', label: 'Practical & Real-world Explanation', columnName: 'Practical & Real-world Explanation' },
  { key: 'q_doubt_clarification', label: 'Doubt Clarification', columnName: 'Doubt Clarification' },
  { key: 'q_syllabus_coverage', label: 'Punctuality & Syllabus Coverage', columnName: 'Punctuality & Syllabus Coverage' },
];

export const SAMPLE_COLUMN_MAPPING: ColumnMapping = {
  departmentCol: 'Department',
  classCol: 'Class / Year',
  sectionCol: 'Section',
  contentRatingCol: 'Content Rating',
  speakerRatingCol: 'Speaker Rating',
  suggestionCol: 'Future Suggestions',
  timestampCol: 'Timestamp',
  commentsCol: 'Student Feedback & Comments',
  questionCols: SAMPLE_QUESTIONS.map(q => q.columnName),
};

interface CohortAssignment {
  department: string;
  classes: string[];
  baseRating: number; // 3.8 to 4.9
  contentBase: number;
  speakerBase: number;
}

const COHORT_LIST: CohortAssignment[] = [
  {
    department: 'AIDS',
    classes: ['II Year', 'III Year'],
    baseRating: 4.75,
    contentBase: 4.7,
    speakerBase: 4.8,
  },
  {
    department: 'AIDS',
    classes: ['II Year', 'IV Year'],
    baseRating: 4.55,
    contentBase: 4.6,
    speakerBase: 4.5,
  },
  {
    department: 'CSE',
    classes: ['II Year', 'III Year'],
    baseRating: 4.62,
    contentBase: 4.5,
    speakerBase: 4.7,
  },
  {
    department: 'CSE',
    classes: ['III Year', 'IV Year'],
    baseRating: 4.38,
    contentBase: 4.4,
    speakerBase: 4.3,
  },
  {
    department: 'ECE',
    classes: ['III Year'],
    baseRating: 4.22,
    contentBase: 4.1,
    speakerBase: 4.3,
  },
  {
    department: 'ECE',
    classes: ['II Year', 'IV Year'],
    baseRating: 4.68,
    contentBase: 4.7,
    speakerBase: 4.6,
  },
  {
    department: 'IT',
    classes: ['II Year', 'III Year'],
    baseRating: 4.45,
    contentBase: 4.5,
    speakerBase: 4.4,
  },
  {
    department: 'Mechanical',
    classes: ['III Year', 'IV Year'],
    baseRating: 4.15,
    contentBase: 4.0,
    speakerBase: 4.2,
  },
];

const POSITIVE_COMMENTS = [
  'Exceptional clarity in explaining complex mathematical formulations.',
  'Provides real industry case studies that made concepts super easy to retain.',
  'Always welcomes questions patiently and explains multiple ways.',
  'Best lab practical demonstrations this semester. Very approachable.',
  'Well structured lecture notes and timely doubt solving sessions.',
  'Makes even theoretical algorithmic proofs very engaging and intuitive.',
  'Punctual, thorough, and gives constructive feedback on assignments.',
  'Encourages student projects and offers guidance outside lecture hours.',
  'Great energy in class and excellent command over the latest literature.',
  'Very supportive during hands-on coding exercises.',
];

const CONSTRUCTIVE_COMMENTS = [
  'The pace in the second half of lectures felt slightly rushed; more numerical examples would help.',
  'Requesting more hands-on lab time for the hardware interfacing modules.',
  'Would love if slides are uploaded at least a day before the lecture.',
  'Doubt clearing at the end of class could use an extra 5 minutes.',
  'Audio clarity in the back rows could be improved during slide presentations.',
  'Good overall, but could explain more previous year exam problems.',
];

const FUTURE_SUGGESTIONS = [
  'Please add more coding projects to the lab sessions so we can apply the concepts.',
  'Kindly share the lecture slides and notes a day before the class for better preparation.',
  'It would help if weekly doubt-clearing slots are scheduled apart from regular classes.',
  'Include more real-world case studies and industry examples in the upcoming sessions.',
  'Requesting placement-oriented training and aptitude practice integrated into the schedule.',
  'Please record the sessions and upload them for students who miss a class.',
  'Add more interactive quizzes and group activities to make the sessions engaging.',
  'Could you share previous year question papers and model answers for practice?',
  'Include guest lectures from industry professionals in the coming months.',
  'Please slow down during the mathematics-heavy derivations and repeat key steps.',
  'More lab hardware kits should be available so every student gets hands-on time.',
  'Schedule regular feedback discussions after each unit to track understanding.',
];

/**
 * Deterministic pseudo-random number generator for consistent demo data.
 */
function seededRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

/**
 * Generates sample feedback records.
 */
export function generateSampleFeedback(): FeedbackRecord[] {
  const records: FeedbackRecord[] = [];
  let idCounter = 1;
  let seed = 42;

  const sections = ['A', 'B', 'C'];
  const dates = [
    '2025-08-12 10:15',
    '2025-08-14 11:30',
    '2025-08-18 14:00',
    '2025-08-22 09:45',
    '2025-08-25 15:20',
    '2025-09-02 11:10',
    '2025-09-05 13:40',
    '2025-09-10 16:15',
  ];

  COHORT_LIST.forEach(cohort => {
    cohort.classes.forEach(cls => {
      // 2 or 3 sections
      const activeSections = cohort.department === 'AIDS' ? ['A', 'B'] : sections;

      activeSections.forEach(section => {
        // Generate between 18 to 28 student responses per section
        const responseCount = 20 + Math.floor(seededRandom(seed++) * 10);

        for (let i = 0; i < responseCount; i++) {
          const ratings: Record<string, number> = {};
          let ratingSum = 0;

          SAMPLE_QUESTIONS.forEach(q => {
            const rand = seededRandom(seed++);
            let val: number;
            // Generate rating centered around cohort.baseRating with small variance
            const shift = (rand - 0.45) * 1.5;
            const rawScore = Math.round(Math.min(5, Math.max(1, cohort.baseRating + shift)));
            val = rawScore;
            ratings[q.key] = val;
            ratingSum += val;
          });

          const averageRating = Number((ratingSum / SAMPLE_QUESTIONS.length).toFixed(2));

          // Generate content and speaker ratings around cohort bases
          const contentRaw = Math.round(Math.min(5, Math.max(1, cohort.contentBase + (seededRandom(seed++) - 0.45) * 1.5)));
          const speakerRaw = Math.round(Math.min(5, Math.max(1, cohort.speakerBase + (seededRandom(seed++) - 0.45) * 1.5)));

          // Generate a future suggestion for approx 30% of records
          let suggestion: string | undefined = undefined;
          const suggestionRand = seededRandom(seed++);
          if (suggestionRand > 0.7) {
            const sIdx = Math.floor(seededRandom(seed++) * FUTURE_SUGGESTIONS.length);
            suggestion = FUTURE_SUGGESTIONS[sIdx];
          }

          // Generate comments for approx 45% of records
          let comment: string | undefined = undefined;
          const commentRand = seededRandom(seed++);
          if (commentRand > 0.55) {
            if (averageRating >= 4.0) {
              const cIdx = Math.floor(seededRandom(seed++) * POSITIVE_COMMENTS.length);
              comment = POSITIVE_COMMENTS[cIdx];
            } else {
              const cIdx = Math.floor(seededRandom(seed++) * CONSTRUCTIVE_COMMENTS.length);
              comment = CONSTRUCTIVE_COMMENTS[cIdx];
            }
          }

          const dateIdx = Math.floor(seededRandom(seed++) * dates.length);
          const timestamp = dates[dateIdx];

          const rawRow: Record<string, string> = {
            Department: cohort.department,
            'Class / Year': cls,
            Section: section,
            Timestamp: timestamp,
            'Content Rating': String(contentRaw),
            'Speaker Rating': String(speakerRaw),
            'Future Suggestions': suggestion || '',
            'Student Feedback & Comments': comment || '',
          };

          SAMPLE_QUESTIONS.forEach(q => {
            rawRow[q.columnName] = String(ratings[q.key]);
          });

          records.push({
            id: `rec_${idCounter++}`,
            timestamp,
            department: cohort.department,
            className: cls,
            section,
            ratings,
            averageRating,
            contentRating: contentRaw,
            speakerRating: speakerRaw,
            futureSuggestion: suggestion,
            comments: comment,
            raw: rawRow,
          });
        }
      });
    });
  });

  return records;
}
