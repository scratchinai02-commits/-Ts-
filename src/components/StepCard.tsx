import React from 'react';
import { StepItem } from '../types';
import { Check, ChevronRight, Sparkles, AlertCircle, Download, FolderDown } from 'lucide-react';
import { downloadBothStep24FilesIndividually, downloadStep24Zip } from '../utils/step24Downloader';

interface StepCardProps {
  step: StepItem;
  isCompleted: boolean;
  onClick: () => void;
}

export const StepCard: React.FC<StepCardProps> = ({ step, isCompleted, onClick }) => {
  const isSpecialStep24 = step.id === 24;

  const handleQuickDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    downloadBothStep24FilesIndividually();
  };

  const handleQuickZip = (e: React.MouseEvent) => {
    e.stopPropagation();
    downloadStep24Zip();
  };

  return (
    <div
      onClick={onClick}
      className={`rounded-2xl transition-all duration-300 cursor-pointer flex flex-col h-full group relative overflow-hidden border ${
        isCompleted
          ? 'bg-green-50/40 border-green-300 shadow-xs'
          : isSpecialStep24
          ? 'bg-gradient-to-br from-indigo-50/80 via-white to-blue-50/80 border-indigo-300 shadow-md hover:shadow-indigo-100 hover:border-indigo-400'
          : 'bg-white border-slate-200 shadow-xs hover:shadow-lg hover:border-blue-300 hover:-translate-y-1'
      }`}
    >
      {/* 頂部彩條 */}
      <div
        className={`h-1.5 w-full transition-opacity ${
          isSpecialStep24
            ? 'bg-gradient-to-r from-amber-400 via-indigo-500 to-purple-600'
            : isCompleted
            ? 'bg-green-500'
            : 'bg-gradient-to-r from-blue-400 to-indigo-500 opacity-70 group-hover:opacity-100'
        }`}
      />

      {isCompleted && (
        <div className="absolute top-3 right-3 text-white bg-green-500 rounded-full p-1 shadow-xs animate-in zoom-in">
          <Check className="w-3.5 h-3.5 stroke-[3]" />
        </div>
      )}

      {isSpecialStep24 && !isCompleted && (
        <div className="absolute top-3 right-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
          終極旗艦
        </div>
      )}

      <div className="p-5 sm:p-6 flex-grow flex flex-col">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex flex-wrap items-center gap-1.5">
            <span
              className={`text-xs font-bold px-2.5 py-0.5 rounded-md tracking-wider ${
                isSpecialStep24
                  ? 'bg-indigo-600 text-white'
                  : 'text-indigo-600 bg-indigo-50'
              }`}
            >
              STEP {step.id}
            </span>
            {step.hasRescue && (
              <span className="text-[10px] font-semibold bg-red-50 text-red-600 border border-red-200 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                <AlertCircle className="w-2.5 h-2.5" />
                附救援碼
              </span>
            )}
          </div>
        </div>

        <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-2 leading-snug group-hover:text-blue-600 transition-colors">
          {step.title}
        </h3>

        <p className="text-slate-500 text-xs sm:text-sm line-clamp-3 mb-3 leading-relaxed">
          {step.desc}
        </p>

        {isSpecialStep24 && (
          <div className="mt-3 pt-3 border-t border-indigo-100 flex flex-col gap-2">
            <div className="flex items-center justify-between text-[11px] text-indigo-700 font-semibold bg-indigo-50/80 px-2 py-1 rounded-md">
              <span>📦 核心部署檔案已更新 (requirements.txt + app.py)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleQuickDownload}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold py-1.5 px-2 rounded-lg transition-all flex items-center justify-center gap-1 shadow-2xs"
                title="免解壓直接下載 requirements.txt 與 app.py"
              >
                <Download className="w-3 h-3" /> 一鍵下載 2 檔
              </button>
              <button
                type="button"
                onClick={handleQuickZip}
                className="bg-white hover:bg-indigo-50 text-indigo-700 border border-indigo-300 text-[11px] font-bold py-1.5 px-2 rounded-lg transition-all flex items-center justify-center gap-1 shadow-2xs"
                title="下載 ZIP 壓縮檔"
              >
                <FolderDown className="w-3 h-3 text-indigo-600" /> ZIP
              </button>
            </div>
          </div>
        )}

        <div className="mt-auto pt-2">
          <span className="inline-block text-[10px] font-semibold text-slate-400 uppercase tracking-widest border border-slate-100 bg-slate-50 rounded px-2 py-0.5">
            {step.category}
          </span>
        </div>
      </div>

      <div className="bg-slate-50 px-5 sm:px-6 py-2.5 border-t border-slate-100 flex justify-between items-center group-hover:bg-blue-50/70 transition-colors">
        <span className="text-xs font-bold text-slate-500 group-hover:text-blue-700 transition-colors">
          {isCompleted ? '已完成，點擊複習' : '點擊查看詳細提示語與程式碼'}
        </span>
        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
      </div>
    </div>
  );
};
