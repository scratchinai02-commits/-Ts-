import React, { useState } from 'react';
import { ADVANCED_BLUEPRINTS } from '../data/advancedPrompts';
import { Rocket, Copy, ExternalLink, LockOpen, Target, BookOpen, Download, FolderDown, Loader2 } from 'lucide-react';
import { V6DeployModal } from './V6DeployModal';
import { downloadV6ZipInBrowser, downloadAllV6FilesIndividually } from '../utils/zipDownloader';

interface AdvancedSectionProps {
  onCopyText: (code: string, title: string) => void;
}

export const AdvancedSection: React.FC<AdvancedSectionProps> = ({ onCopyText }) => {
  const [isV6ModalOpen, setIsV6ModalOpen] = useState<boolean>(false);
  const [isZipping, setIsZipping] = useState<boolean>(false);

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200 mt-12">
      <V6DeployModal
        isOpen={isV6ModalOpen}
        onClose={() => setIsV6ModalOpen(false)}
        onCopyText={onCopyText}
      />

      {/* Header Banner */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 px-8 py-10 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col items-center justify-center relative z-10 text-center">
          <div className="w-16 h-16 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center mb-4 shadow-lg backdrop-blur">
            <Rocket className="w-8 h-8 text-blue-400 animate-bounce" style={{ animationDuration: '3s' }} />
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3 flex items-center gap-3">
            <span>🚀</span> 專家之路：未來的進階模型升級藍圖
          </h2>
          <p className="text-slate-300 max-w-3xl text-sm sm:text-base font-normal leading-relaxed">
            目前的隨機森林是一個極佳的基準模型 (Baseline)。為了進一步壓榨數據價值、提升預測勝率，建議您可以朝以下方向探索：
          </p>
        </div>
      </div>

      {/* Grid of Blueprints */}
      <div className="p-6 md:p-8 bg-slate-50/70">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ADVANCED_BLUEPRINTS.map((item) => (
            <div
              key={item.key}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 relative flex flex-col group hover:-translate-y-1"
            >
              {/* Badge */}
              <div className="flex items-center justify-between mb-4">
                <span className={`text-xs font-bold px-3 py-1 rounded-full shadow-2xs ${item.badgeColor}`}>
                  {item.badge}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-lg sm:text-xl font-black text-slate-800 mb-3 tracking-tight group-hover:text-blue-600 transition-colors">
                {item.title}
              </h3>

              {/* 優勢說明 */}
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4">
                <span className="font-bold text-slate-900">優勢：</span>
                {item.desc}
              </p>

              {/* 實戰建議 Box */}
              {item.advice && (
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 mb-5 text-xs text-slate-600 leading-relaxed">
                  <div className="font-bold text-slate-800 flex items-center gap-1.5 mb-1 text-[13px]">
                    <Target className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span>實戰建議：</span>
                  </div>
                  <p className="text-slate-600 pl-5">
                    {item.advice}
                  </p>
                </div>
              )}

              {/* 按鈕區域 */}
              <div className="mt-auto pt-2">
                {item.key === 'auto' ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsV6ModalOpen(true)}
                        className="flex-1 rounded-2xl py-3 px-3.5 shadow-xs transition-all flex items-center justify-center font-bold text-xs sm:text-sm cursor-pointer border bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-amber-500 hover:shadow-md"
                      >
                        <BookOpen className="w-4 h-4 mr-1.5 shrink-0" />
                        <span className="truncate">{item.buttonText || '查看 v6 完整部署指南'}</span>
                      </button>
                      <button
                        onClick={() => onCopyText(item.code, item.title)}
                        title="複製 v6 部署指南與腳本"
                        className="p-3 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 rounded-2xl transition-colors cursor-pointer shrink-0"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-2">
                      <button
                        onClick={async () => {
                          try {
                            setIsZipping(true);
                            await downloadV6ZipInBrowser();
                          } finally {
                            setIsZipping(false);
                          }
                        }}
                        disabled={isZipping}
                        className="flex-1 w-full rounded-xl py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        {isZipping ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                        <span>✨ 下載標準 v6 ZIP (Mac/Win 100% 相容)</span>
                      </button>
                      <button
                        onClick={() => downloadAllV6FilesIndividually()}
                        className="rounded-xl py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                        title="完全免解壓縮，直接下載 7 個檔案"
                      >
                        <FolderDown className="w-3.5 h-3.5 text-emerald-600" />
                        <span>免解壓下載 7 檔案</span>
                      </button>
                    </div>
                  </div>
                ) : item.url ? (
                  <div className="flex items-center gap-2">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => onCopyText(item.code, `${item.title} (已開啟實戰連結)`)}
                      className={`flex-1 rounded-2xl py-3 px-3.5 shadow-xs transition-all flex items-center justify-center font-bold text-xs sm:text-sm cursor-pointer border group-hover:shadow-md ${
                        item.key === 'xgboost'
                          ? 'bg-blue-50 hover:bg-blue-100 text-blue-800 border-blue-300'
                          : item.key === 'lstm'
                          ? 'bg-purple-50 hover:bg-purple-100 text-purple-800 border-purple-300'
                          : item.key === 'nlp'
                          ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300'
                          : item.key === 'rl'
                          ? 'bg-rose-50 hover:bg-rose-100 text-rose-800 border-rose-300'
                          : 'bg-teal-50 hover:bg-teal-100 text-teal-800 border-teal-300'
                      }`}
                    >
                      <LockOpen className="w-4 h-4 mr-1.5 shrink-0" />
                      <span className="truncate">{item.buttonText || '加入課程，解鎖實戰程式碼'}</span>
                      <ExternalLink className="w-3.5 h-3.5 ml-1 shrink-0 opacity-70" />
                    </a>
                    <button
                      onClick={() => onCopyText(item.code, item.title)}
                      title="複製 Python 程式碼"
                      className="p-3 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 rounded-2xl transition-colors cursor-pointer shrink-0"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => onCopyText(item.code, item.title)}
                    className="w-full bg-white hover:bg-indigo-50 text-indigo-700 hover:text-indigo-800 border border-indigo-200 hover:border-indigo-300 rounded-2xl py-3 px-4 shadow-xs transition-all flex items-center justify-center font-bold text-xs sm:text-sm cursor-pointer group-hover:shadow-md"
                  >
                    <LockOpen className="w-4 h-4 mr-2 text-indigo-600" />
                    {item.buttonText || '加入課程，解鎖實戰程式碼'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
