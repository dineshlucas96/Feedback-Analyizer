import type { FeedbackRecord, FilterState } from '../types/feedback';

export const INITIAL_FILTERS: FilterState = {
  department: 'ALL',
  className: 'ALL',
  section: 'ALL',
};

export function filterRecords(records: FeedbackRecord[], filters: FilterState): FeedbackRecord[] {
  return records.filter(record => {
    if (filters.department !== 'ALL' && record.department !== filters.department) {
      return false;
    }
    if (filters.className !== 'ALL' && record.className !== filters.className) {
      return false;
    }
    if (filters.section !== 'ALL' && record.section !== filters.section) {
      return false;
    }
    return true;
  });
}

export function getAvailableDepartments(records: FeedbackRecord[]): string[] {
  const set = new Set<string>();
  records.forEach(r => {
    if (r.department) set.add(r.department);
  });
  return Array.from(set).sort();
}

export function getAvailableClasses(records: FeedbackRecord[], selectedDepartment: string): string[] {
  const set = new Set<string>();
  records.forEach(r => {
    if (selectedDepartment === 'ALL' || r.department === selectedDepartment) {
      if (r.className) set.add(r.className);
    }
  });
  return Array.from(set).sort();
}

export function getAvailableSections(
  records: FeedbackRecord[],
  selectedDepartment: string,
  selectedClass: string
): string[] {
  const set = new Set<string>();
  records.forEach(r => {
    const matchDept = selectedDepartment === 'ALL' || r.department === selectedDepartment;
    const matchClass = selectedClass === 'ALL' || r.className === selectedClass;
    if (matchDept && matchClass && r.section) {
      set.add(r.section);
    }
  });
  return Array.from(set).sort();
}
