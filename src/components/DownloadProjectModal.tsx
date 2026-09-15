import React, { useState } from 'react';
import { X, Download, FolderDown, Loader2, Sparkles, Code2, Globe, ExternalLink, Check, FileArchive } from 'lucide-react';
import { downloadV6ZipInBrowser, downloadAllV6FilesIndividually } from '../utils/zipDownloader';

interface DownloadProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onToast?: (message: string, icon?: string) => void;
}

export const DownloadProjectModal: React.FC<DownloadProjectModalProps> = ({
  isOpen,
  onClose,
  onToast,
}) => {
  const [isZipping, setIsZipping] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const handleDownloadZip = async () => {
    try {
      setIsZipping(true);
      await downloadV6ZipInBrowser();
      setDownloadSuccess(true);
      if (onToast) {
        onToast('已成功下載台股 AI 盯盤系統 (v6) ZIP 壓縮檔！', '📦');
      }
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      if (onToast) {
        onToast('下載失敗，請嘗試免解壓下載 7 檔案', '⚠️');
      }
    } finally {
      setIsZipping(false);
    }
  };

  const handleDownloadAllFiles = async () => {
    try {
      await downloadAllV6FilesIndividually();
      if (onToast) {
        onToast('已啟動 7 個專案檔案直接下載！', '📁');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-2xl shadow-inner">
                📦
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight">下載整個專案原始碼</h3>
                <p className="text-slate-300 text-xs sm:text-sm mt-0.5">
                  提供「台股 AI 盯盤後端系統」與「本站 React 前端教學網頁」兩種下載方式
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* 方案一：台股 AI 盯盤系統 Python 完整專案包 */}
          <div className="bg-gradient-to-br from-blue-50/70 to-indigo-50/50 rounded-2xl p-5 sm:p-6 border border-blue-200/80 shadow-xs">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex items-center gap-2.5">
                <span className="p-2 bg-blue-600 text-white rounded-xl shadow-xs">
                  <Code2 className="w-5 h-5" />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-base sm:text-lg text-slate-900">
                      1. 台股 AI 盯盤與量化分析系統 (Python 實戰專案)
                    </h4>
                    <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full border border-blue-200">
                      v6 最新免登入版
                    </span>
                  </div>
                  <p className="text-slate-600 text-xs mt-0.5">
                    包含 FastAPI 後端、TWSE/TPEx 掃描引擎、Plotly 前端與 Render/Docker 一鍵部署檔
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/90 border border-blue-100 rounded-xl p-3 mb-4 text-xs text-slate-600 space-y-1">
              <div className="font-bold text-slate-800 flex items-center gap-1.5 mb-1.5">
                <FileArchive className="w-3.5 h-3.5 text-blue-600" />
                <span>專案內含 7 個核心檔案：</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px] text-slate-700">
                <div className="bg-slate-50 px-2 py-1 rounded border border-slate-200">📄 main.py</div>
                <div className="bg-slate-50 px-2 py-1 rounded border border-slate-200">📄 stock.py</div>
                <div className="bg-slate-50 px-2 py-1 rounded border border-slate-200">📄 index.html</div>
                <div className="bg-slate-50 px-2 py-1 rounded border border-slate-200">📄 requirements.txt</div>
                <div className="bg-slate-50 px-2 py-1 rounded border border-slate-200">📄 Dockerfile</div>
                <div className="bg-slate-50 px-2 py-1 rounded border border-slate-200">📄 .dockerignore</div>
                <div className="bg-slate-50 px-2 py-1 rounded border border-slate-200">📄 README.md</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={handleDownloadZip}
                disabled={isZipping}
                className="w-full sm:flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isZipping ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>正在打包 ZIP 中...</span>
                  </>
                ) : downloadSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>下載成功！</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>一鍵下載標準 v6 ZIP (Mac/Win 100% 相容)</span>
                  </>
                )}
              </button>

              <button
                onClick={handleDownloadAllFiles}
                className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold text-xs py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                title="若電腦解壓縮有問題，可直接下載 7 個純文字檔案"
              >
                <FolderDown className="w-4 h-4 text-emerald-600" />
                <span>免解壓直接下載 7 檔案</span>
              </button>
            </div>
          </div>

          {/* 方案二：本教學網頁應用原始碼 (Google AI Studio Web App) */}
          <div className="bg-gradient-to-br from-slate-50 to-purple-50/40 rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-xs">
            <div className="flex items-start gap-3 mb-3">
              <span className="p-2 bg-purple-600 text-white rounded-xl shadow-xs shrink-0">
                <Globe className="w-5 h-5" />
              </span>
              <div>
                <h4 className="font-extrabold text-base sm:text-lg text-slate-900">
                  2. 本教學網站前端原始碼 (React + Vite + Tailwind)
                </h4>
                <p className="text-slate-600 text-xs mt-0.5">
                  若您希望下載目前這個教學網站的全部原始碼（包含 24 步驟卡片、救援程式碼庫等）
                </p>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 text-xs text-slate-700 space-y-2.5">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>Google AI Studio 官方一鍵匯出步驟：</span>
              </div>
              <ol className="list-decimal list-inside space-y-1.5 pl-1 text-slate-600 leading-relaxed">
                <li>
                  查看當前視窗右上角（AI Studio 介面頂部選單欄）。
                </li>
                <li>
                  點選 <strong className="text-slate-900">「Settings ⚙️ (設定)」</strong> 或 <strong className="text-slate-900">「⋯ (更多選項)」</strong> 按鈕。
                </li>
                <li>
                  選擇 <strong className="text-blue-700">「Export as ZIP」</strong>，即可將整個前端專案下載為 ZIP 壓縮檔至您的電腦！
                </li>
                <li>
                  或者選擇 <strong className="text-purple-700">「Export to GitHub」</strong>，即可直接同步至您的 GitHub 儲存庫。
                </li>
              </ol>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer shadow-2xs"
          >
            關閉
          </button>
        </div>
      </div>
    </div>
  );
};
