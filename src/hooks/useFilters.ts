import { useCallback, useState } from 'react';
import type { FilterState } from '../types/feedback';


import { INITIAL_FILTERS } from '../utils/filters';

export interface ActiveFilterPill {
  key: keyof FilterState;
  label: string;
  value: string;
}

export function useFilters() {
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);

  const setDepartment = useCallback((department: string) => {
    setFilters(prev => ({
      ...prev,
      department,
      className: 'ALL',
      section: 'ALL',
    }));
  }, []);

  const setClassName = useCallback((className: string) => {
    setFilters(prev => ({
      ...prev,
      className,
      section: 'ALL',
    }));
  }, []);

  const setSection = useCallback((section: string) => {
    setFilters(prev => ({
      ...prev,
      section,
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(INITIAL_FILTERS);
  }, []);

  const removeFilter = useCallback((key: keyof FilterState) => {
    setFilters(prev => {
      const next = { ...prev, [key]: 'ALL' };
      // If department is removed, reset dependent filters
      if (key === 'department') {
        next.className = 'ALL';
        next.section = 'ALL';
      }
      if (key === 'className') {
        next.section = 'ALL';
      }
      return next;
    });
  }, []);

  const activePills: ActiveFilterPill[] = [];
  if (filters.department !== 'ALL') {
    activePills.push({ key: 'department', label: 'Dept', value: filters.department });
  }
  if (filters.className !== 'ALL') {
    activePills.push({ key: 'className', label: 'Class', value: filters.className });
  }
  if (filters.section !== 'ALL') {
    activePills.push({ key: 'section', label: 'Sec', value: filters.section });
  }

  const hasActiveFilters = activePills.length > 0;

  return {
    filters,
    setDepartment,
    setClassName,
    setSection,
    resetFilters,
    removeFilter,
    activePills,
    hasActiveFilters,
  };
}
