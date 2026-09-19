import Papa from 'papaparse';

/**
 * Extracts a Google Spreadsheet ID or returns the cleaned string if already an ID.
 */
export function extractSpreadsheetId(input: string): string | null {
  if (!input) return null;
  const trimmed = input.trim();

  // Pattern for /d/SPREADSHEET_ID/
  const matchD = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/i);
  if (matchD && matchD[1]) {
    return matchD[1];
  }

  // Pattern for /d/e/2PACX-... published links
  const matchPub = trimmed.match(/\/spreadsheets\/d\/e\/([a-zA-Z0-9-_]+)/i);
  if (matchPub && matchPub[1]) {
    return matchPub[1];
  }

  // If already looks like an alphanumeric ID (typically 25-60 chars)
  if (/^[a-zA-Z0-9-_]{20,}$/.test(trimmed)) {
    return trimmed;
  }

  return null;
}

export interface FetchResult {
  headers: string[];
  rows: Record<string, string>[];
  spreadsheetId: string;
  sourceUrl: string;
}

/**
 * Fetches Google Sheet data as CSV and parses into headers and rows.
 */
export async function fetchSpreadsheetData(urlOrId: string): Promise<FetchResult> {
  const id = extractSpreadsheetId(urlOrId);
  if (!id) {
    throw new Error('Invalid Google Sheets URL or Spreadsheet ID. Please verify the URL.');
  }

  // Candidate URLs to try
  const candidateUrls: string[] = [];

  if (urlOrId.includes('/d/e/')) {
    // It's a published web link
    if (urlOrId.includes('output=csv')) {
      candidateUrls.push(urlOrId);
    } else {
      candidateUrls.push(`https://docs.google.com/spreadsheets/d/e/${id}/pub?output=csv`);
    }
  } else {
    // Standard spreadsheet ID
    // 1. Google Visualization API CSV export (works with viewable sheets without API key)
    candidateUrls.push(`https://docs.google.com/spreadsheets/d/${id}/gviz/tq?tqx=out:csv`);
    // 2. Direct export format=csv
    candidateUrls.push(`https://docs.google.com/spreadsheets/d/${id}/export?format=csv`);
  }

  let csvText: string | null = null;
  let lastError: Error | null = null;

  for (const url of candidateUrls) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        const text = await response.text();
        // Check if response is actually HTML login page or error instead of CSV
        if (text.includes('<!DOCTYPE html') || text.includes('<html')) {
          if (text.includes('accounts.google.com') || text.includes('ServiceLogin')) {
            throw new Error(
              'The spreadsheet is private. Please set General Access to "Anyone with the link can view".'
            );
          }
        } else if (text.trim().length > 0) {
          csvText = text;
          break;
        }
      }
    } catch (err: unknown) {
      lastError = err instanceof Error ? err : new Error(String(err));
    }
  }

  // Fallback: If direct fetch failed (e.g. CORS restriction), try allorigins proxy
  if (!csvText && candidateUrls.length > 0) {
    try {
      const target = encodeURIComponent(candidateUrls[0]);
      const proxyUrl = `https://api.allorigins.win/raw?url=${target}`;
      const proxyRes = await fetch(proxyUrl);
      if (proxyRes.ok) {
        const text = await proxyRes.text();
        if (!text.includes('<!DOCTYPE html') && text.trim().length > 0) {
          csvText = text;
        }
      }
    } catch {
      // Continue to throw last error
    }
  }

  if (!csvText) {
    throw (
      lastError ||
      new Error(
        'Could not load spreadsheet data. Make sure the spreadsheet is set to "Anyone with the link can view".'
      )
    );
  }

  return new Promise((resolve, reject) => {
    Papa.parse<Record<string, string>>(csvText!, {
      header: true,
      skipEmptyLines: 'greedy',
      complete: result => {
        if (!result.data || result.data.length === 0) {
          reject(new Error('The spreadsheet appears to be empty or has no data rows.'));
          return;
        }

        const headers = result.meta.fields?.map(f => f.trim()).filter(Boolean) || [];
        if (headers.length === 0) {
          reject(new Error('Could not identify valid column headers in the spreadsheet.'));
          return;
        }

        // Clean up row keys
        const cleanedRows = result.data.map(row => {
          const clean: Record<string, string> = {};
          for (const key of Object.keys(row)) {
            clean[key.trim()] = String(row[key] ?? '').trim();
          }
          return clean;
        });

        resolve({
          headers,
          rows: cleanedRows,
          spreadsheetId: id,
          sourceUrl: urlOrId,
        });
      },
      error: (parseErr: Error) => {
        reject(new Error(`Failed to parse CSV data: ${parseErr.message}`));
      },

    });
  });
}
