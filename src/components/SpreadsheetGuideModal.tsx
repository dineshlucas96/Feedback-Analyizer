import React from 'react';
import { X, CheckCircle2, Copy, ExternalLink, HelpCircle } from 'lucide-react';

interface SpreadsheetGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUseSample: () => void;
}

export const SpreadsheetGuideModal: React.FC<SpreadsheetGuideModalProps> = ({
  isOpen,
  onClose,
  onUseSample,
}) => {
  const [copied, setCopied] = React.useState(false);
  const sampleUrl = 'https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit';

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(sampleUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
      <div
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl border border-gray-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">How to prepare your Google Sheet</h3>
              <p className="text-xs text-gray-500">Quick 2-step setup for student feedback analytics</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 text-sm text-gray-600">
          {/* Step 1 */}
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-xs flex items-center justify-center font-bold">
                1
              </span>
              Make your spreadsheet viewable
            </h4>
            <p className="text-xs text-gray-600 pl-7">
              In your Google Sheet, click the <strong>Share</strong> button (top right). Under <em>General access</em>, change <strong>Restricted</strong> to <strong>"Anyone with the link"</strong> with role set to <strong>Viewer</strong>.
            </p>
          </div>

          {/* Step 2 */}
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-xs flex items-center justify-center font-bold">
                2
              </span>
              Structure your columns
            </h4>
            <p className="text-xs text-gray-600 pl-7">
              The dashboard uses an intelligent column mapper that auto-detects column variations:
            </p>
            <div className="pl-7 grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-xs">
              <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                <span className="font-semibold text-gray-900 block">Demographics</span>
                <span className="text-gray-500">Department, Class / Year, Section</span>
              </div>
              <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                <span className="font-semibold text-gray-900 block">Evaluation Questions</span>
                <span className="text-gray-500">Teaching clarity, Knowledge, Doubt solving (1–5 ratings or text)</span>
              </div>
              <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                <span className="font-semibold text-gray-900 block">Content & Speaker Rating</span>
                <span className="text-gray-500">"Content Rating", "Speaker Rating" (1–5 ratings)</span>
              </div>
              <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                <span className="font-semibold text-gray-900 block">Qualitative Feedback</span>
                <span className="text-gray-500">Comments, Suggestions, Future Suggestions, Remarks</span>
              </div>
              <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                <span className="font-semibold text-gray-900 block">Metadata</span>
                <span className="text-gray-500">Timestamp (optional)</span>
              </div>
            </div>
          </div>

          {/* Ratings info */}
          <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-900 space-y-1">
            <p className="font-semibold">Supported Rating Formats:</p>
            <p>Numeric (1, 2, 3, 4, 5) or textual values (<em>Excellent, Very Good, Good, Average, Poor, Very Poor</em>) are automatically detected and normalized.</p>
          </div>

          {/* Example Spreadsheet URL */}
          <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-800">Public Example Spreadsheet:</span>
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-medium cursor-pointer"
              >
                {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied URL!' : 'Copy URL'}</span>
              </button>
            </div>
            <div className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-md border border-gray-200 text-gray-600 font-mono text-[11px] truncate">
              <span className="truncate mr-2">{sampleUrl}</span>
              <a
                href={sampleUrl}
                target="_blank"
                rel="noreferrer"
                className="text-gray-400 hover:text-gray-600"
                title="Open in new tab"
              >
                <ExternalLink className="w-3.5 h-3.5 shrink-0" />
              </a>
            </div>
          </div>
        </div>


        {/* Modal Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={() => {
              onClose();
              onUseSample();
            }}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline"
          >
            Or try with instant preloaded Demo Data →
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-xs font-medium transition-colors"
          >
            Got it, close
          </button>
        </div>
      </div>
    </div>
  );
};
