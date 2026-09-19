import React, { useState, useMemo } from 'react';
import { Search, Download, Eye, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import Papa from 'papaparse';
import type { FeedbackRecord, FilterState } from '../types/feedback';
import { FilterBar } from '../components/FilterBar';
import { EmptyState } from '../components/EmptyState';
import type { ActiveFilterPill } from '../hooks/useFilters';


interface RawDataProps {
  records: FeedbackRecord[];
  headers: string[];
  filters: FilterState;
  availableDepartments: string[];
  availableClasses: string[];
  availableSections: string[];
  activePills: ActiveFilterPill[];
  hasActiveFilters: boolean;
  onDepartmentChange: (dept: string) => void;
  onClassChange: (cls: string) => void;
  onSectionChange: (sec: string) => void;
  onResetFilters: () => void;
  onRemovePill: (key: keyof FilterState) => void;
}

export const RawData: React.FC<RawDataProps> = ({
  records,
  headers,
  filters,
  availableDepartments,
  availableClasses,
  availableSections,
  activePills,
  hasActiveFilters,
  onDepartmentChange,
  onClassChange,
  onSectionChange,
  onResetFilters,
  onRemovePill,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [visibleColumns, setVisibleColumns] = useState<string[]>([]);
  const [showColPicker, setShowColPicker] = useState(false);

  // Initialize visible columns if not set
  const allColumns = useMemo(() => {
    if (headers && headers.length > 0) return headers;
    if (records.length > 0) return Object.keys(records[0].raw);
    return [];
  }, [headers, records]);

  // Set initial visible columns (up to 8)
  React.useEffect(() => {
    if (allColumns.length > 0 && visibleColumns.length === 0) {
      setVisibleColumns(allColumns.slice(0, 8));
    }
  }, [allColumns, visibleColumns.length]);

  // Filter and sort records
  const processedRows = useMemo(() => {
    let rows = records.map(r => r.raw);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      rows = rows.filter(row =>
        Object.values(row).some(v => String(v).toLowerCase().includes(q))
      );
    }

    if (sortColumn) {
      rows = [...rows].sort((a, b) => {
        const valA = a[sortColumn] ?? '';
        const valB = b[sortColumn] ?? '';

        const numA = Number(valA);
        const numB = Number(valB);
        if (!isNaN(numA) && !isNaN(numB)) {
          return sortDirection === 'asc' ? numA - numB : numB - numA;
        }
        return sortDirection === 'asc'
          ? String(valA).localeCompare(String(valB))
          : String(valB).localeCompare(String(valA));
      });
    }

    return rows;
  }, [records, searchQuery, sortColumn, sortDirection]);

  // Pagination
  const totalRows = processedRows.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize));
  const startIndex = (page - 1) * pageSize;
  const currentRows = processedRows.slice(startIndex, startIndex + pageSize);

  // Toggle sorting
  const handleHeaderClick = (col: string) => {
    if (sortColumn === col) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else {
        setSortColumn(null);
      }
    } else {
      setSortColumn(col);
      setSortDirection('asc');
    }
  };

  // Export filtered CSV
  const handleExportCSV = () => {
    if (processedRows.length === 0) return;
    const csv = Papa.unparse(processedRows);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `feedback_export_${new Date().toISOString().slice(0, 10)}.csv`
    );
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleColumnVisibility = (col: string) => {
    setVisibleColumns(prev =>
      prev.includes(col) ? prev.filter(c => c !== col) : [...prev, col]
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Department/Class/Section Filter Bar */}
      <FilterBar
        filters={filters}
        availableDepartments={availableDepartments}
        availableClasses={availableClasses}
        availableSections={availableSections}
        activePills={activePills}
        hasActiveFilters={hasActiveFilters}
        onDepartmentChange={onDepartmentChange}
        onClassChange={onClassChange}
        onSectionChange={onSectionChange}
        onResetFilters={onResetFilters}
        onRemovePill={onRemovePill}
      />

      {/* Table Controls */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search across all spreadsheet fields..."
            value={searchQuery}
            onChange={e => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-[#E5E7EB] rounded-lg text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Column Visibility */}
          <div className="relative">
            <button
              onClick={() => setShowColPicker(prev => !prev)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 border border-[#E5E7EB] rounded-lg transition-colors cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-gray-500" />
              <span>Columns ({visibleColumns.length})</span>
            </button>

            {showColPicker && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 p-3 z-30 space-y-2 max-h-72 overflow-y-auto">
                <div className="text-xs font-semibold text-gray-700 pb-1 border-b border-gray-100 flex justify-between">
                  <span>Visible Columns</span>
                  <button
                    onClick={() => setVisibleColumns(allColumns)}
                    className="text-indigo-600 hover:underline text-[11px]"
                  >
                    Select All
                  </button>
                </div>
                {allColumns.map(col => (
                  <label
                    key={col}
                    className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer hover:bg-gray-50 p-1 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={visibleColumns.includes(col)}
                      onChange={() => toggleColumnVisibility(col)}
                      className="rounded text-indigo-600"
                    />
                    <span className="truncate">{col}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Export to CSV */}
          <button
            onClick={handleExportCSV}
            disabled={processedRows.length === 0}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm shadow-indigo-600/20 transition-all disabled:opacity-50 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Spreadsheet Table View */}
      {processedRows.length === 0 ? (
        <EmptyState
          title="No records found"
          description="No rows match your search criteria. Try modifying your search or filters."
          actionText="Reset All Filters"
          onAction={() => {
            setSearchQuery('');
            onResetFilters();
          }}
        />
      ) : (
        <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-2xs overflow-hidden">
          {/* Status bar */}
          <div className="px-4 py-3 bg-gray-50/70 border-b border-[#E5E7EB] flex items-center justify-between text-xs text-gray-500">
            <span>
              Showing{' '}
              <strong>
                {startIndex + 1}–{Math.min(startIndex + pageSize, totalRows)}
              </strong>{' '}
              of <strong>{totalRows.toLocaleString()}</strong> responses
            </span>

            <div className="flex items-center gap-2">
              <span>Rows per page:</span>
              <select
                value={pageSize}
                onChange={e => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
                className="bg-white border border-gray-200 rounded px-2 py-1 text-xs text-gray-700 cursor-pointer"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-max">
              <thead>
                <tr className="border-b border-[#E5E7EB] bg-gray-50/50 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="py-2.5 px-4 w-12 text-center">#</th>
                  {visibleColumns.map(col => (
                    <th
                      key={col}
                      onClick={() => handleHeaderClick(col)}
                      className="py-2.5 px-4 cursor-pointer hover:bg-gray-100 transition-colors select-none"
                    >
                      <div className="flex items-center gap-1">
                        <span>{col}</span>
                        <ArrowUpDown className="w-3 h-3 text-gray-400" />
                        {sortColumn === col && (
                          <span className="text-indigo-600 font-bold">
                            {sortDirection === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {currentRows.map((row, rowIdx) => (
                  <tr key={rowIdx} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-2.5 px-4 text-center text-gray-400 font-mono text-[11px]">
                      {startIndex + rowIdx + 1}
                    </td>
                    {visibleColumns.map(col => (
                      <td
                        key={col}
                        className="py-2.5 px-4 text-gray-800 max-w-sm truncate whitespace-nowrap"
                        title={row[col]}
                      >
                        {row[col] || '—'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="p-4 border-t border-[#E5E7EB] bg-gray-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
            <span>
              Page {page} of {totalPages}
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
