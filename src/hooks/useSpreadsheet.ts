import { useCallback, useEffect, useState } from 'react';
import type { ColumnMapping, FeedbackRecord, QuestionMeta, SpreadsheetSource } from '../types/feedback';


import { detectColumnMapping } from '../utils/columnMapper';
import { processRawData } from '../utils/dataProcessor';
import { generateSampleFeedback, SAMPLE_COLUMN_MAPPING, SAMPLE_QUESTIONS } from '../utils/sampleData';
import { fetchSpreadsheetData } from '../services/googleSheets';

const STORAGE_KEY = 'feedback_analytics_last_source';

export function useSpreadsheet() {
  const [source, setSource] = useState<SpreadsheetSource | null>(null);
  const [records, setRecords] = useState<FeedbackRecord[]>([]);
  const [questions, setQuestions] = useState<QuestionMeta[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [mapping, setMapping] = useState<ColumnMapping | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Load sample data
  const loadSampleData = useCallback(() => {
    setIsLoading(true);
    setError(null);

    try {
      const sample = generateSampleFeedback();
      setRecords(sample);
      setQuestions(SAMPLE_QUESTIONS);
      setMapping(SAMPLE_COLUMN_MAPPING);
      setHeaders([
        'Department',
        'Class / Year',
        'Section',
        'Content Rating',
        'Speaker Rating',
        'Future Suggestions',
        ...SAMPLE_QUESTIONS.map(q => q.columnName),
        'Timestamp',
        'Student Feedback & Comments',
      ]);
      setSource({
        url: 'demo://sample-dataset',
        spreadsheetId: 'demo-sample-data',
        title: 'Institutional Sample Feedback Dataset',
        isDemo: true,
        lastLoadedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ isDemo: true }));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to generate demo data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load from Google Sheets URL or ID
  const loadFromUrl = useCallback(async (urlOrId: string) => {
    if (!urlOrId.trim()) {
      setError('Please paste a valid Google Sheets URL.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchSpreadsheetData(urlOrId);
      const detectedMapping = detectColumnMapping(result.headers, result.rows);
      const { records: processedRecords, questions: processedQuestions } = processRawData(
        result.rows,
        detectedMapping
      );

      if (processedRecords.length === 0) {
        throw new Error('No valid feedback responses could be read from the sheet.');
      }

      setRecords(processedRecords);
      setQuestions(processedQuestions);
      setHeaders(result.headers);
      setMapping(detectedMapping);
      setSource({
        url: result.sourceUrl,
        spreadsheetId: result.spreadsheetId,
        title: `Google Sheet (${result.spreadsheetId.slice(0, 8)}...)`,
        isDemo: false,
        lastLoadedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ isDemo: false, url: result.sourceUrl })
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch spreadsheet data.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Refresh current sheet
  const refresh = useCallback(async () => {
    if (!source) return;
    if (source.isDemo) {
      loadSampleData();
    } else {
      await loadFromUrl(source.url);
    }
  }, [source, loadSampleData, loadFromUrl]);

  // Clear current data / disconnect
  const clearData = useCallback(() => {
    setSource(null);
    setRecords([]);
    setQuestions([]);
    setHeaders([]);
    setMapping(null);
    setError(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // On mount, auto-load saved state or sample data if user previously used it
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.isDemo) {
          loadSampleData();
        } else if (parsed.url) {
          loadFromUrl(parsed.url);
        }
      }
    } catch {
      // ignore
    }
  }, [loadSampleData, loadFromUrl]);

  return {
    source,
    records,
    questions,
    headers,
    mapping,
    isLoading,
    error,
    loadFromUrl,
    loadSampleData,
    refresh,
    clearData,
  };
}
