import React, { useState } from 'react';
import { Sheet, Sparkles, ArrowRight, ShieldCheck, HelpCircle, AlertCircle, RefreshCw } from 'lucide-react';

interface SpreadsheetLoaderProps {
  isLoading: boolean;
  error: string | null;
  onConnect: (url: string) => void;
  onLoadSample: () => void;
  onOpenGuide: () => void;
}

export const SpreadsheetLoader: React.FC<SpreadsheetLoaderProps> = ({
  isLoading,
  error,
  onConnect,
  onLoadSample,
  onOpenGuide,
}) => {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onConnect(url.trim());
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="max-w-xl w-full">
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-8 sm:p-10 shadow-sm text-center">
          {/* Main Icon */}
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mx-auto mb-6 text-indigo-600 shadow-inner">
            <Sheet className="w-8 h-8" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111827]">
            Connect your feedback data
          </h2>
          <p className="text-sm text-[#6B7280] mt-2 mb-8 max-w-md mx-auto">
            Paste your Google Sheets URL to start analyzing student feedback in real time.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Paste Google Sheets URL (e.g., https://docs.google.com/spreadsheets/d/...)"
                value={url}
                onChange={e => setUrl(e.target.value)}
                disabled={isLoading}
                className="w-full px-4 py-3.5 bg-gray-50 border border-[#E5E7EB] rounded-xl text-sm text-[#111827] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="submit"
                disabled={isLoading || !url.trim()}
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-all shadow-sm shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Connecting Spreadsheet...</span>
                  </>
                ) : (
                  <>
                    <span>Connect Spreadsheet</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onLoadSample}
                disabled={isLoading}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gray-50 hover:bg-gray-100 border border-[#E5E7EB] text-gray-700 text-sm font-medium transition-all cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Load Sample Data</span>
              </button>
            </div>
          </form>

          {/* Error Message */}
          {error && (
            <div className="mt-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-left animate-fade-in">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-rose-900">Couldn't connect to spreadsheet</h4>
                  <p className="text-xs text-rose-700 mt-1">{error}</p>
                  <div className="mt-2 text-xs text-rose-800 space-y-1">
                    <p>• Make sure the Google Sheet sharing is set to <strong>"Anyone with the link can view"</strong>.</p>
                    <p>• Verify the URL contains a valid spreadsheet ID.</p>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={onLoadSample}
                      className="text-xs font-semibold text-rose-900 underline hover:text-rose-950"
                    >
                      Or explore with Demo Data instead →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Information */}
          <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between text-xs text-[#6B7280] gap-3">
            <div className="flex items-center gap-1.5 text-gray-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Your data is processed 100% in the browser.</span>
            </div>

            <button
              onClick={onOpenGuide}
              className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-medium hover:underline cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>How to prepare your spreadsheet</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
