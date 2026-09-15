import React, { useState } from 'react';
import {
  X,
  Download,
  Copy,
  Check,
  ExternalLink,
  Server,
  Cloud,
  Terminal,
  ShieldCheck,
  AlertTriangle,
  FolderArchive,
  FileCode,
  Layers,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  Sparkles,
  HelpCircle,
  FolderDown,
  Loader2
} from 'lucide-react';
import { V6_FILES_DATA } from '../data/v6ProjectFiles';
import {
  downloadV6ZipInBrowser,
  downloadSingleV6File,
  downloadAllV6FilesIndividually
} from '../utils/zipDownloader';

interface V6DeployModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCopyText: (text: string, label: string) => void;
}

export const V6DeployModal: React.FC<V6DeployModalProps> = ({
  isOpen,
  onClose,
  onCopyText,
}) => {
  const [activeTab, setActiveTab] = useState<'guide' | 'files' | 'checklist'>('guide');
  const [activeFile, setActiveFile] = useState<string>('requirements.txt');
  const [isZipping, setIsZipping] = useState<boolean>(false);
  const [downloadMsg, setDownloadMsg] = useState<string | null>(null);
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>(() => {
    try {
      const saved = localStorage.getItem('v6_checklist_state');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      localStorage.setItem('v6_checklist_state', JSON.stringify(next));
      return next;
    });
  };

  const handleDownloadZip = async () => {
    try {
      setIsZipping(true);
      setDownloadMsg('正在打包符合 macOS / Windows 標準之 ZIP...');
      await downloadV6ZipInBrowser('taiwan-stock-no-gradio-flat-updated-v6-20260904.zip');
      setDownloadMsg('ZIP 已下載成功！包含全部 7 個專案檔案。');
      setTimeout(() => setDownloadMsg(null), 4000);
    } catch (err) {
      console.error(err);
      setDownloadMsg('瀏覽器打包失敗，切換至備用下載...');
      const a = document.createElement('a');
      a.href = '/taiwan-stock-no-gradio-flat-updated-v6-20260904.zip';
      a.download = 'taiwan-stock-no-gradio-flat-updated-v6-20260904.zip';
      a.click();
    } finally {
      setIsZipping(false);
    }
  };

  const handleDownloadAllFiles = async () => {
    try {
      setDownloadMsg('正在逐一下載 7 個檔案至下載資料夾...');
      await downloadAllV6FilesIndividually((current, total, filename) => {
        setDownloadMsg(`正在下載 (${current}/${total}): ${filename}`);
      });
      setDownloadMsg('7 個檔案已全部下載完成！可直接放入資料夾上傳 GitHub，完全免解壓縮！');
      setTimeout(() => setDownloadMsg(null), 6000);
    } catch (err) {
      console.error(err);
      setDownloadMsg('下載過程發生異常，請使用單檔下載按鈕');
    }
  };

  if (!isOpen) return null;

  const filesContent = V6_FILES_DATA;

  const checklistItems = [
    { id: 'c1', label: 'v6 ZIP 已下載並解壓（確認資料夾無多層包夾）' },
    { id: 'c2', label: 'GitHub main 分支根目錄包含 7 個專案檔案' },
    { id: 'c3', label: 'Render 已成功連接 GitHub Repository (如 taiwan-stock-ai)' },
    { id: 'c4', label: 'Build Command 設定為 pip install -r requirements.txt' },
    { id: 'c5', label: 'Start Command 設定為 uvicorn main:app --host 0.0.0.0 --port $PORT' },
    { id: 'c6', label: 'GEMINI_API_KEY 已於 Render Environment Variables 正確設定' },
    { id: 'c7', label: 'FINMIND_TOKEN 已於 Render Environment Variables 正確設定' },
    { id: 'c8', label: 'Render Web Service 儀表板已顯示綠色「Live」' },
    { id: 'c9', label: '全市場選股掃描功能在公開網址測試成功' },
    { id: 'c10', label: '2330 單檔深度分析與 AI 報告在公開網址測試成功' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-8 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-bold rounded-full">
              V6 完整版
            </span>
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold rounded-full">
              GitHub + Render
            </span>
            <span className="px-3 py-1 bg-rose-500/20 text-rose-300 border border-rose-400/30 text-xs font-bold rounded-full">
              不使用 Hugging Face
            </span>
            <span className="px-3 py-1 bg-purple-500/20 text-purple-300 border border-purple-400/30 text-xs font-bold rounded-full">
              不需要 Gradio
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">
            台股 AI 全市場選股與量化分析平台
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
            從「下載 v6 ZIP」開始，完整走一次：<strong>解壓 → GitHub → Render → API Key → 自動部署 → 線上測試</strong>。
          </p>

          <div className="mt-4 p-3 rounded-xl bg-blue-500/10 border border-blue-400/20 text-blue-200 text-xs sm:text-sm flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-300 shrink-0" />
            <span>
              <strong>本版部署架構：</strong>GitHub 放程式碼，Render 跑 FastAPI。Hugging Face 完全退出流程。
            </span>
          </div>
        </div>

        {/* 快速導覽 Bar & 標籤頁切換 */}
        <div className="bg-slate-100/80 px-6 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveTab('guide')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'guide'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              📖 24 步部署全流程
            </button>
            <button
              onClick={() => setActiveTab('files')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'files'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              📁 查看 7 個專案檔案
            </button>
            <button
              onClick={() => setActiveTab('checklist')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'checklist'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              🚀 上線檢查表
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadZip}
              disabled={isZipping}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              {isZipping ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
              <span>{isZipping ? '打包中...' : '⬇️ 下載 v6 ZIP'}</span>
            </button>
            <button
              onClick={handleDownloadAllFiles}
              className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              title="一鍵單獨下載全部 7 個檔案，完全免解壓縮"
            >
              <FolderDown className="w-3.5 h-3.5" />
              <span>免解壓下載 7 檔案</span>
            </button>
            <a
              href="https://render.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold transition-colors"
            >
              <span>Render 官網</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          </div>
        </div>

        {downloadMsg && (
          <div className="bg-amber-500 text-slate-950 font-bold px-6 py-2.5 text-xs sm:text-sm flex items-center justify-between shadow-xs animate-in fade-in duration-150">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>{downloadMsg}</span>
            </div>
            <button
              onClick={() => setDownloadMsg(null)}
              className="text-xs text-slate-900 hover:underline cursor-pointer"
            >
              關閉
            </button>
          </div>
        )}

        {/* 內文滾動區 */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-8 flex-1 text-slate-800">
          {activeTab === 'guide' && (
            <div className="space-y-8">
              {/* 🚨 針對 Mac 封存工具程式解壓縮錯誤的專屬排查橫幅 */}
              <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-rose-50 border-2 border-amber-300 rounded-2xl p-5 sm:p-6 shadow-sm">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shrink-0 mt-0.5 shadow-xs">
                    <AlertTriangle className="w-5 h-5 text-slate-950" />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-950 font-black text-xs uppercase tracking-wider">
                        常見問題排查
                      </span>
                      <span className="text-xs font-bold text-slate-500">
                        針對 macOS「封存工具程式」
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900">
                      解壓縮失敗？提示「無法解壓縮... 其為不支援的格式」？
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                      這是因為 Mac 內建的「封存工具程式」(Archive Utility) 在面對瀏覽器串流下載的某些 ZIP 時，會因缺少 Unix 權限標頭或檔案被快取干擾而誤報。請任選以下<strong>三個秒解方案</strong>：
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                      {/* 方案 A */}
                      <div className="bg-white p-3.5 rounded-xl border border-amber-200 shadow-2xs flex flex-col justify-between">
                        <div>
                          <span className="inline-block px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[11px] font-black mb-1.5">
                            方案 1 · 最推薦
                          </span>
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-1">
                            瀏覽器即時標準打包
                          </h4>
                          <p className="text-[11px] text-slate-500 leading-normal">
                            由前端 JS 注入標準 Unix 權限 (0o644)，Mac 封存工具程式 100% 保證可直接解壓。
                          </p>
                        </div>
                        <button
                          onClick={handleDownloadZip}
                          disabled={isZipping}
                          className="mt-3 w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1"
                        >
                          {isZipping ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                          <span>重打標準 ZIP 下載</span>
                        </button>
                      </div>

                      {/* 方案 B */}
                      <div className="bg-white p-3.5 rounded-xl border border-emerald-200 shadow-2xs flex flex-col justify-between">
                        <div>
                          <span className="inline-block px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[11px] font-black mb-1.5">
                            方案 2 · 免解壓縮
                          </span>
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-1">
                            一鍵下載 7 個核心檔案
                          </h4>
                          <p className="text-[11px] text-slate-500 leading-normal">
                            完全省去解壓縮動作！直接下載 7 個原始檔案放入資料夾，直接上傳 GitHub！
                          </p>
                        </div>
                        <button
                          onClick={handleDownloadAllFiles}
                          className="mt-3 w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1"
                        >
                          <FolderDown className="w-3.5 h-3.5" />
                          <span>一鍵直接下載 7 檔案</span>
                        </button>
                      </div>

                      {/* 方案 C */}
                      <div className="bg-white p-3.5 rounded-xl border border-purple-200 shadow-2xs flex flex-col justify-between">
                        <div>
                          <span className="inline-block px-2 py-0.5 rounded bg-purple-100 text-purple-800 text-[11px] font-black mb-1.5">
                            方案 3 · Mac 終端機
                          </span>
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-1">
                            終端機一行指令解壓
                          </h4>
                          <p className="text-[11px] text-slate-500 leading-normal">
                            打開 Mac 終端機貼上，使用系統底層 unzip 工具，無視封存工具程式錯誤。
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            onCopyText(
                              'cd ~/Downloads && unzip -o "taiwan-stock-no-gradio-flat-updated-v6-20260904*.zip" -d taiwan-stock-ai',
                              'Mac 終端機解壓縮指令'
                            )
                          }
                          className="mt-3 w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>複製終端機指令</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 警語 Notice */}
              <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 sm:p-5 flex items-start gap-3 shadow-xs">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm text-rose-900 leading-relaxed">
                  <strong className="font-bold text-rose-700">⚠️ 先記住一件事：</strong>
                  這份新版教學不再使用 Hugging Face。不要再建立 Hugging Face Space，也不要把時間花在 Gradio Space 的付費／部署設定上。
                </div>
              </div>

              {/* 先看懂架構 */}
              <div className="bg-slate-50 rounded-2xl p-5 sm:p-6 border border-slate-200">
                <div className="text-xs font-black text-blue-700 tracking-wider uppercase mb-1">
                  先看懂架構
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-3">
                  新的部署路線只有兩個平台
                </h3>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 font-bold text-xs sm:text-sm">
                  <span className="px-3.5 py-2 bg-blue-100 text-blue-800 rounded-xl border border-blue-200 shadow-2xs">你的電腦</span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                  <span className="px-3.5 py-2 bg-indigo-100 text-indigo-800 rounded-xl border border-indigo-200 shadow-2xs">GitHub</span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                  <span className="px-3.5 py-2 bg-purple-100 text-purple-800 rounded-xl border border-purple-200 shadow-2xs">Render</span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                  <span className="px-3.5 py-2 bg-emerald-100 text-emerald-800 rounded-xl border border-emerald-200 shadow-2xs">公開 HTTPS 網址</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 mt-3.5 leading-relaxed">
                  前端 <code className="bg-white border border-slate-200 px-1.5 py-0.5 rounded text-blue-700 font-mono">index.html</code> 與後端 <code className="bg-white border border-slate-200 px-1.5 py-0.5 rounded text-blue-700 font-mono">main.py</code> 一起由 Render 提供，不再拆成 Hugging Face 前端。
                </p>
              </div>

              {/* 24 步驟卡片列表 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* STEP 1 */}
                <article className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-black text-blue-600 tracking-wider uppercase">STEP 1</span>
                    <h3 className="text-lg font-bold text-slate-900 mt-1 mb-2">下載 v6 完整專案檔案</h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
                      提供三種下載途徑，建議使用<strong>「瀏覽器標準打包」</strong>或<strong>「免解壓縮直接下載 7 個檔案」</strong>：
                    </p>
                    <div className="mb-3">
                      <h4 className="text-xs font-bold text-slate-700 mb-1.5">專案包含 7 個完整檔案：</h4>
                      <pre className="bg-slate-900 text-slate-200 rounded-xl p-3 text-xs font-mono leading-relaxed">
.dockerignore
Dockerfile
README.md
index.html
main.py
requirements.txt
stock.py</pre>
                    </div>
                  </div>
                  <div className="space-y-2 pt-2">
                    <button
                      onClick={handleDownloadZip}
                      disabled={isZipping}
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs disabled:opacity-50"
                    >
                      {isZipping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                      <span>✨ 下載標準 v6 ZIP (Mac/Win 100% 相容)</span>
                    </button>
                    <button
                      onClick={handleDownloadAllFiles}
                      className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <FolderDown className="w-3.5 h-3.5 text-emerald-600" />
                      <span>📂 免解壓縮！一鍵直接下載 7 個檔案</span>
                    </button>
                  </div>
                </article>

                {/* STEP 2 */}
                <article className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-xs font-black text-blue-600 tracking-wider uppercase">STEP 2</span>
                  <h3 className="text-lg font-bold text-slate-900 mt-1 mb-2">解壓縮 ZIP (或免解壓縮)</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-2.5">
                    若下載 ZIP，請雙擊解壓；若使用「免解壓縮直接下載」，請直接將 7 個檔案放入資料夾。
                  </p>
                  <ul className="text-xs sm:text-sm text-slate-600 space-y-1.5 list-disc pl-4 mb-3 leading-relaxed">
                    <li>建立一個資料夾，例如 <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">taiwan-stock-ai</code></li>
                    <li>確認 7 個檔案直接位於資料夾內（根目錄）</li>
                    <li><strong className="text-rose-600">不要再包一層同名資料夾</strong></li>
                  </ul>
                  <div className="space-y-1.5 text-xs font-mono mb-3">
                    <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 font-bold">
                      <span className="text-emerald-600 mr-1">✓ 正確：</span>taiwan-stock-ai/index.html
                    </div>
                    <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 font-bold">
                      <span className="text-rose-600 mr-1">✗ 錯誤：</span>taiwan-stock-ai/taiwan-stock-ai/index.html
                    </div>
                  </div>

                  <div className="p-3 bg-slate-900 text-slate-200 rounded-xl text-xs font-mono">
                    <div className="text-[11px] text-amber-400 font-bold mb-1">
                      # Mac 封存工具程式報錯時？在終端機貼上這行秒解：
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <code className="text-[11px] text-slate-300 break-all">
                        unzip -o "taiwan-stock-*.zip" -d taiwan-stock-ai
                      </code>
                      <button
                        onClick={() =>
                          onCopyText(
                            'cd ~/Downloads && unzip -o "taiwan-stock-no-gradio-flat-updated-v6-20260904*.zip" -d taiwan-stock-ai',
                            'Mac 終端機解壓指令'
                          )
                        }
                        className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded text-[10px] font-sans font-bold shrink-0 transition-colors"
                      >
                        複製指令
                      </button>
                    </div>
                  </div>
                </article>

                {/* STEP 3 (Full) */}
                <article className="md:col-span-2 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-xs font-black text-blue-600 tracking-wider uppercase">STEP 3</span>
                  <h3 className="text-lg font-bold text-slate-900 mt-1 mb-2">建立／確認 GitHub Repository</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-2">
                    登入 GitHub，建立或打開您的專案 Repository（例如）：
                  </p>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 bg-slate-900 p-3.5 rounded-xl">
                    <pre className="text-slate-100 text-xs sm:text-sm font-mono m-0">scratchinai01 / taiwan-stock-ai</pre>
                    <a
                      href="https://github.com/scratchinai01/taiwan-stock-ai"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0"
                    >
                      <span>開啟 GitHub Repository</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    </a>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Branch 使用 <code className="bg-slate-100 px-1 py-0.5 rounded font-mono font-bold text-blue-700">main</code>。
                  </p>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    GitHub 官方支援直接從瀏覽器將檔案加入 Repository；單一檔案透過網頁上傳的限制為 25 MiB，本次 v6 ZIP 很小，可以正常處理。若是把 ZIP 本身上傳到 repo，建議把它當作下載附件，不要拿 ZIP 取代程式碼檔案。
                  </p>
                </article>

                {/* STEP 4 */}
                <article className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-xs font-black text-blue-600 tracking-wider uppercase">STEP 4</span>
                  <h3 className="text-lg font-bold text-slate-900 mt-1 mb-2">把 v6 程式碼放進 GitHub</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-2">
                    在 Repository 首頁：
                  </p>
                  <ol className="text-xs sm:text-sm text-slate-700 space-y-1.5 list-decimal pl-4 mb-3">
                    <li>點 <strong>Add file</strong></li>
                    <li>選 <strong>Upload files</strong></li>
                    <li>一次選取 v6 解壓後的 <strong>7 個檔案</strong></li>
                    <li>確認檔案出現在根目錄</li>
                    <li>Commit message 可寫：<code className="bg-slate-100 px-1 py-0.5 rounded font-mono">Update to v6</code></li>
                    <li>選 <strong>Commit changes</strong></li>
                  </ol>
                  <p className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    💡 說明：如果 GitHub 已經有相同檔案，就用新版檔案覆蓋。
                  </p>
                </article>

                {/* STEP 5 */}
                <article className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-xs font-black text-blue-600 tracking-wider uppercase">STEP 5</span>
                  <h3 className="text-lg font-bold text-slate-900 mt-1 mb-2">確認 GitHub 最終檔案</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-2">
                    根目錄至少看到：
                  </p>
                  <pre className="bg-slate-900 text-slate-200 rounded-xl p-3 text-xs font-mono mb-3 leading-relaxed">
Dockerfile
README.md
index.html
main.py
requirements.txt
stock.py</pre>
                  <div className="space-y-1 text-xs text-emerald-700 font-bold">
                    <p className="flex items-center gap-1.5"><span className="text-emerald-600">✓</span> index.html：前端 SPA 儀表板</p>
                    <p className="flex items-center gap-1.5"><span className="text-emerald-600">✓</span> main.py：FastAPI API 後端</p>
                    <p className="flex items-center gap-1.5"><span className="text-emerald-600">✓</span> stock.py：分析邏輯與選股引擎</p>
                    <p className="flex items-center gap-1.5"><span className="text-emerald-600">✓</span> requirements.txt：Python 套件</p>
                  </div>
                </article>

                {/* STEP 6 (Full) */}
                <article className="md:col-span-2 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-xs font-black text-blue-600 tracking-wider uppercase">STEP 6</span>
                  <h3 className="text-lg font-bold text-slate-900 mt-1 mb-2">註冊／登入 Render</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
                    打開 Render，使用 GitHub 帳號登入最方便。
                  </p>
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <a
                      href="https://render.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold transition-colors shadow-xs"
                    >
                      <span>開啟 Render 官網</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    進入 Dashboard 後，準備建立 <strong>Web Service</strong>。這個專案是 FastAPI 後端，因此不是 Static Site。
                  </p>
                </article>

                {/* STEP 7 */}
                <article className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-xs font-black text-blue-600 tracking-wider uppercase">STEP 7</span>
                  <h3 className="text-lg font-bold text-slate-900 mt-1 mb-2">建立 New Web Service</h3>
                  <ol className="text-xs sm:text-sm text-slate-700 space-y-1.5 list-decimal pl-4 mb-3">
                    <li>Render Dashboard</li>
                    <li>點 <strong>New</strong></li>
                    <li>選 <strong>Web Service</strong></li>
                    <li>連接 GitHub</li>
                    <li>找到 <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-blue-700">scratchinai01/taiwan-stock-ai</code></li>
                  </ol>
                  <p className="text-xs sm:text-sm text-slate-600">
                    Branch：<code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono font-bold text-blue-700">main</code>
                  </p>
                </article>

                {/* STEP 8 */}
                <article className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-xs font-black text-blue-600 tracking-wider uppercase">STEP 8</span>
                  <h3 className="text-lg font-bold text-slate-900 mt-1 mb-2">Render 基本設定</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-100 text-slate-700">
                          <th className="p-2 border border-slate-200">欄位</th>
                          <th className="p-2 border border-slate-200">設定</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="p-2 border border-slate-200 font-bold">Name</td>
                          <td className="p-2 border border-slate-200 font-mono text-blue-700">taiwan-stock-ai</td>
                        </tr>
                        <tr>
                          <td className="p-2 border border-slate-200 font-bold">Language</td>
                          <td className="p-2 border border-slate-200 font-mono">Python 3</td>
                        </tr>
                        <tr>
                          <td className="p-2 border border-slate-200 font-bold">Branch</td>
                          <td className="p-2 border border-slate-200 font-mono">main</td>
                        </tr>
                        <tr>
                          <td className="p-2 border border-slate-200 font-bold">Build Command</td>
                          <td className="p-2 border border-slate-200 font-mono font-bold text-blue-800">
                            pip install -r requirements.txt
                          </td>
                        </tr>
                        <tr>
                          <td className="p-2 border border-slate-200 font-bold">Start Command</td>
                          <td className="p-2 border border-slate-200 font-mono font-bold text-amber-800">
                            uvicorn main:app --host 0.0.0.0 --port $PORT
                          </td>
                        </tr>
                        <tr>
                          <td className="p-2 border border-slate-200 font-bold">Plan</td>
                          <td className="p-2 border border-slate-200">Free（若帳號介面提供）</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </article>

                {/* STEP 9 (Full) */}
                <article className="md:col-span-2 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-xs font-black text-blue-600 tracking-wider uppercase">STEP 9</span>
                  <h3 className="text-lg font-bold text-slate-900 mt-1 mb-2">最重要：不要再用錯 Start Command</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-3">
                    <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl">
                      <div className="text-xs font-bold text-rose-700 mb-1 flex items-center gap-1">
                        <span>❌ 不要填：</span>
                      </div>
                      <code className="text-xs font-mono text-rose-900 font-bold block bg-white/80 p-2 rounded border border-rose-200">
                        gunicorn your_application.wsgi
                      </code>
                    </div>
                    <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl">
                      <div className="text-xs font-bold text-emerald-700 mb-1 flex items-center justify-between">
                        <span>✅ 本專案填：</span>
                        <button
                          onClick={() => onCopyText('uvicorn main:app --host 0.0.0.0 --port $PORT', 'Start Command')}
                          className="text-[11px] text-emerald-800 hover:text-emerald-950 font-bold flex items-center gap-1 cursor-pointer bg-emerald-100 hover:bg-emerald-200 px-2 py-0.5 rounded transition-colors"
                        >
                          <Copy className="w-3 h-3" />
                          <span>複製</span>
                        </button>
                      </div>
                      <code className="text-xs font-mono text-emerald-900 font-bold block bg-white/80 p-2 rounded border border-emerald-200">
                        uvicorn main:app --host 0.0.0.0 --port $PORT
                      </code>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Render 官方 FastAPI 部署文件也是以 <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">pip install -r requirements.txt</code> 搭配 Uvicorn 啟動 FastAPI；Render 的 Web Service 會把公開流量轉給你的 <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">0.0.0.0:$PORT</code> 程序。
                  </p>
                </article>

                {/* STEP 10 */}
                <article className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-xs font-black text-blue-600 tracking-wider uppercase">STEP 10</span>
                  <h3 className="text-lg font-bold text-slate-900 mt-1 mb-2">設定 Environment Variables</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-2.5">
                    Render → 你的 Service → <strong>Environment</strong> → <strong>Environment Variables</strong> → Add Environment Variable。
                  </p>
                  <table className="w-full text-xs text-left border-collapse mb-3">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700">
                        <th className="p-2 border border-slate-200">Key</th>
                        <th className="p-2 border border-slate-200">Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-2 border border-slate-200 font-mono font-bold">GEMINI_API_KEY</td>
                        <td className="p-2 border border-slate-200">貼你的 Gemini API Key</td>
                      </tr>
                      <tr>
                        <td className="p-2 border border-slate-200 font-mono font-bold">FINMIND_TOKEN</td>
                        <td className="p-2 border border-slate-200">貼你的 FinMind Token</td>
                      </tr>
                    </tbody>
                  </table>
                  <p className="text-xs text-rose-600 font-bold bg-rose-50 p-2 rounded-xl border border-rose-200">
                    ⚠️ API Key 絕對不要寫進 index.html，也不要 Commit 到 GitHub。
                  </p>
                </article>

                {/* STEP 11 */}
                <article className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-xs font-black text-blue-600 tracking-wider uppercase">STEP 11</span>
                  <h3 className="text-lg font-bold text-slate-900 mt-1 mb-2">儲存並部署</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-2.5">
                    設定完成後儲存環境變數，開始 Deploy。
                  </p>
                  <p className="text-xs sm:text-sm font-bold text-slate-700 mb-1.5">第一次建置會：</p>
                  <ul className="text-xs sm:text-sm text-slate-600 space-y-1 list-disc pl-4">
                    <li>抓 GitHub 的 <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">main</code></li>
                    <li>安裝 requirements.txt</li>
                    <li>啟動 Uvicorn</li>
                    <li>產生 Render 的 <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">onrender.com</code> 公開網址</li>
                  </ul>
                </article>

                {/* STEP 12 (Full) */}
                <article className="md:col-span-2 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-xs font-black text-blue-600 tracking-wider uppercase">STEP 12</span>
                  <h3 className="text-lg font-bold text-slate-900 mt-1 mb-2">看到 Live 才算成功</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-3">
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs sm:text-sm text-emerald-800 font-bold flex items-center gap-2">
                      <span className="text-emerald-600 text-base">✓</span>
                      <span>Build succeeded</span>
                    </div>
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs sm:text-sm text-emerald-800 font-bold flex items-center gap-2">
                      <span className="text-emerald-600 text-base">✓</span>
                      <span>Deploy succeeded</span>
                    </div>
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs sm:text-sm text-emerald-800 font-bold flex items-center gap-2">
                      <span className="text-emerald-600 text-base">✓</span>
                      <span>Live</span>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    如果仍顯示 Building，就先等待。<strong className="text-rose-600">不要急著 Cancel，也不要 Rollback。</strong>
                  </p>
                </article>

                {/* STEP 13 */}
                <article className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-xs font-black text-blue-600 tracking-wider uppercase">STEP 13</span>
                  <h3 className="text-lg font-bold text-slate-900 mt-1 mb-2">取得 Render 網址</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-2.5">
                    在 Render Service 頁面找到公開網址，例如：
                  </p>
                  <pre className="bg-slate-900 text-emerald-300 rounded-xl p-3 text-xs sm:text-sm font-mono mb-2">
https://你的服務名稱.onrender.com</pre>
                  <p className="text-xs text-slate-500">
                    這就是新的網站／API 主網址。
                  </p>
                </article>

                {/* STEP 14 */}
                <article className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-xs font-black text-blue-600 tracking-wider uppercase">STEP 14</span>
                  <h3 className="text-lg font-bold text-slate-900 mt-1 mb-2">測試 API</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-1.5">
                    先測試健康狀態：
                  </p>
                  <pre className="bg-slate-900 text-slate-200 rounded-xl p-2.5 text-xs font-mono mb-2">
https://你的服務名稱.onrender.com/</pre>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-1.5">
                    再測常用路由：
                  </p>
                  <pre className="bg-slate-900 text-blue-300 rounded-xl p-2.5 text-xs font-mono mb-2">
/api/scan
/api/gainers
/api/watchlist
/api/analyze</pre>
                  <p className="text-xs text-slate-500">
                    實際可用的路由以目前 v6 的 main.py 為準。
                  </p>
                </article>

                {/* STEP 15 (Full) */}
                <article className="md:col-span-2 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-xs font-black text-blue-600 tracking-wider uppercase">STEP 15</span>
                  <h3 className="text-lg font-bold text-slate-900 mt-1 mb-2">讓前端直接使用 Render</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-2">
                    v6 <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">index.html</code> 已經把 API Base 指向 Render 後端。確認網址是你的實際 Render Service URL：
                  </p>
                  <pre className="bg-slate-900 text-slate-200 rounded-xl p-3 text-xs sm:text-sm font-mono mb-2">
const API_BASE = "https://你的服務名稱.onrender.com";</pre>
                  <p className="text-xs text-rose-600 font-bold bg-rose-50 p-2.5 rounded-xl border border-rose-200">
                    ⚠️ 不要把 Gemini API Key 或 FinMind Token 放在這裡。
                  </p>
                </article>

                {/* STEP 16 */}
                <article className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-xs font-black text-blue-600 tracking-wider uppercase">STEP 16</span>
                  <h3 className="text-lg font-bold text-slate-900 mt-1 mb-2">第一次測試：全市場選股</h3>
                  <ol className="text-xs sm:text-sm text-slate-700 space-y-1.5 list-decimal pl-4">
                    <li>開啟 Render 網址</li>
                    <li>進入「全市場選股」</li>
                    <li>按開始掃描</li>
                    <li>等待資料下載與計算</li>
                    <li>確認有排名表</li>
                  </ol>
                </article>

                {/* STEP 17 */}
                <article className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-xs font-black text-blue-600 tracking-wider uppercase">STEP 17</span>
                  <h3 className="text-lg font-bold text-slate-900 mt-1 mb-2">第二次測試：2330</h3>
                  <ol className="text-xs sm:text-sm text-slate-700 space-y-1.5 list-decimal pl-4 mb-2.5">
                    <li>進入「單檔深度分析」</li>
                    <li>輸入 <code className="bg-slate-100 px-1 py-0.5 rounded font-mono font-bold">2330</code></li>
                    <li>期間選 <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">1y</code></li>
                    <li>按分析</li>
                  </ol>
                  <p className="text-xs sm:text-sm text-emerald-700 font-bold bg-emerald-50 p-2 rounded-xl border border-emerald-200">
                    ✓ 應該看到 K 線、技術指標、新聞與 AI 分析。
                  </p>
                </article>

                {/* STEP 18 (Full) */}
                <article className="md:col-span-2 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-xs font-black text-blue-600 tracking-wider uppercase">STEP 18</span>
                  <h3 className="text-lg font-bold text-slate-900 mt-1 mb-2">v6 特別修正：Markdown 與 JSON</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-2.5">
                    本版本不是單純換版面，而是包含三個重要修正：
                  </p>
                  <ul className="text-xs sm:text-sm text-slate-700 space-y-2 list-disc pl-5 leading-relaxed">
                    <li>
                      <strong>JSON 安全輸出</strong>：DataFrame 的 NaN / inf 等值先轉成可安全傳輸的 JSON 值 (None / null)，徹底解決 FastAPI 拋出 500 Internal Server Error。
                    </li>
                    <li>
                      <strong>Plotly JSON</strong>：圖表使用安全 JSON 序列化，避免 API 回傳 500。
                    </li>
                    <li>
                      <strong>Markdown Renderer</strong>：AI 分析中的 <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">###</code>、<code className="bg-slate-100 px-1 py-0.5 rounded font-mono">**粗體**</code>、<code className="bg-slate-100 px-1 py-0.5 rounded font-mono">- 清單</code> 轉成真正的網頁格式。
                    </li>
                  </ul>
                </article>

                {/* STEP 19 (Full) */}
                <article className="md:col-span-2 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-xs font-black text-blue-600 tracking-wider uppercase">STEP 19</span>
                  <h3 className="text-lg font-bold text-slate-900 mt-1 mb-2">以後更新程式，只需要這條路</h3>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 font-bold text-xs sm:text-sm my-3">
                    <span className="px-3 py-1.5 bg-slate-100 text-slate-800 rounded-xl border border-slate-200">修改程式</span>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                    <span className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-xl border border-blue-200">Commit GitHub</span>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                    <span className="px-3 py-1.5 bg-purple-100 text-purple-800 rounded-xl border border-purple-200">Render Auto Deploy</span>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                    <span className="px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-xl border border-emerald-200">測試網站</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Render 可以連接 GitHub Repository；當指定分支有新的 commit 時，可以自動重新部署。這樣就不需要再把同一份前端檔案同步到另一個平台。
                  </p>
                </article>

                {/* STEP 20 */}
                <article className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-xs font-black text-blue-600 tracking-wider uppercase">STEP 20</span>
                  <h3 className="text-lg font-bold text-slate-900 mt-1 mb-2">出現錯誤時先看哪裡？</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-100 text-slate-700">
                          <th className="p-2 border border-slate-200">現象</th>
                          <th className="p-2 border border-slate-200">先檢查</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="p-2 border border-slate-200 font-bold text-rose-700">Build failed</td>
                          <td className="p-2 border border-slate-200">requirements.txt、Python 版本、Build Logs</td>
                        </tr>
                        <tr>
                          <td className="p-2 border border-slate-200 font-bold text-amber-700">Application failed to start</td>
                          <td className="p-2 border border-slate-200">Start Command (uvicorn main:app ...)</td>
                        </tr>
                        <tr>
                          <td className="p-2 border border-slate-200 font-bold text-red-700">500 Internal Server Error</td>
                          <td className="p-2 border border-slate-200">Render Logs + API JSON</td>
                        </tr>
                        <tr>
                          <td className="p-2 border border-slate-200 font-bold text-blue-700">AI 沒有回覆</td>
                          <td className="p-2 border border-slate-200">GEMINI_API_KEY</td>
                        </tr>
                        <tr>
                          <td className="p-2 border border-slate-200 font-bold text-indigo-700">FinMind 資料失敗</td>
                          <td className="p-2 border border-slate-200">FINMIND_TOKEN 與 API 回應</td>
                        </tr>
                        <tr>
                          <td className="p-2 border border-slate-200 font-bold text-purple-700">網頁排版舊版</td>
                          <td className="p-2 border border-slate-200">確認 GitHub 的 index.html 是否真的更新成 v6</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </article>

                {/* STEP 21 */}
                <article className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-xs font-black text-blue-600 tracking-wider uppercase">STEP 21</span>
                  <h3 className="text-lg font-bold text-slate-900 mt-1 mb-2">最終完成架構</h3>
                  <pre className="bg-slate-900 text-slate-200 rounded-xl p-3.5 text-xs font-mono leading-relaxed">
GitHub
└── taiwan-stock-ai
    ├── index.html
    ├── main.py
    ├── stock.py
    ├── requirements.txt
    ├── Dockerfile
    └── README.md
             ↓
          Render
             ↓
    FastAPI + Uvicorn
             ↓
     公開 HTTPS 網站</pre>
                </article>

                {/* STEP 22 (Full) */}
                <article className="md:col-span-2 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-xs font-black text-blue-600 tracking-wider uppercase">STEP 22</span>
                  <h3 className="text-lg font-bold text-slate-900 mt-1 mb-2">本教學正式取消的東西</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-2 text-xs sm:text-sm">
                    <div className="space-y-1.5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 font-bold">
                      <p className="flex items-center gap-2"><span>❌</span> Hugging Face Static Space</p>
                      <p className="flex items-center gap-2"><span>❌</span> Hugging Face Docker Space</p>
                      <p className="flex items-center gap-2"><span>❌</span> Hugging Face Gradio Space</p>
                      <p className="flex items-center gap-2"><span>❌</span> 為了這個專案購買 Hugging Face Pro</p>
                    </div>
                    <div className="space-y-1.5 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 font-bold">
                      <p className="flex items-center gap-2"><span>✅</span> GitHub：程式碼版本管理</p>
                      <p className="flex items-center gap-2"><span>✅</span> Render：前端＋FastAPI 後端部署</p>
                    </div>
                  </div>
                </article>

                {/* STEP 23 (Full) */}
                <article className="md:col-span-2 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-xs font-black text-blue-600 tracking-wider uppercase">STEP 23</span>
                  <h3 className="text-lg font-bold text-slate-900 mt-1 mb-2">官方文件</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <a
                      href="https://render.com/docs/deploy-fastapi"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs text-blue-700 font-bold flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <span>Render：Deploy a FastAPI App</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    </a>
                    <a
                      href="https://render.com/docs/configure-environment-variables"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs text-blue-700 font-bold flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <span>Render：Environment Variables and Secrets</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    </a>
                    <a
                      href="https://docs.github.com/zh/repositories/working-with-files/managing-files/adding-a-file-to-a-repository"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs text-blue-700 font-bold flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <span>GitHub：添加文件到仓库</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    </a>
                  </div>
                </article>

                {/* STEP 24 (Full) */}
                <article className="md:col-span-2 bg-gradient-to-br from-slate-900 to-blue-950 p-5 sm:p-6 rounded-2xl border border-blue-900 shadow-md text-white">
                  <span className="text-xs font-black text-amber-300 tracking-wider uppercase">STEP 24</span>
                  <h3 className="text-lg font-bold text-white mt-1 mb-2 flex items-center gap-2">
                    <span>🚀</span>
                    <span>最後檢查表 (可直接點擊勾選保存進度)</span>
                  </h3>
                  <p className="text-xs text-slate-300 mb-4">
                    依照這 10 項依序檢查，點選方塊即可勾選；進度會自動儲存於瀏覽器：
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {checklistItems.map((item, idx) => {
                      const isDone = !!checkedItems[item.id];
                      return (
                        <div
                          key={item.id}
                          onClick={() => toggleCheck(item.id)}
                          className={`p-3 rounded-xl border text-xs flex items-center gap-2.5 transition-all cursor-pointer select-none ${
                            isDone
                              ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200 font-medium'
                              : 'bg-white/5 border-white/10 text-slate-200 hover:bg-white/10'
                          }`}
                        >
                          <div
                            className={`w-5 h-5 rounded-md flex items-center justify-center border font-bold text-xs shrink-0 ${
                              isDone
                                ? 'bg-emerald-500 border-emerald-500 text-slate-950'
                                : 'border-slate-500 text-transparent'
                            }`}
                          >
                            ✓
                          </div>
                          <span className={isDone ? 'line-through opacity-80' : ''}>
                            {idx + 1}. {item.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </article>
              </div>
            </div>
          )}

          {activeTab === 'files' && (
            <div className="space-y-6">
              <div className="flex flex-wrap gap-2">
                {Object.keys(filesContent).map((k) => (
                  <button
                    key={k}
                    onClick={() => setActiveFile(k)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                      activeFile === k
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {filesContent[k].filename}
                  </button>
                ))}
              </div>

              <div className="bg-slate-900 text-slate-100 rounded-2xl p-5 border border-slate-800 relative">
                <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-3 mb-3 gap-2">
                  <div>
                    <span className="font-mono text-xs font-bold text-blue-400">
                      {filesContent[activeFile].filename}
                    </span>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {filesContent[activeFile].desc}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => downloadSingleV6File(filesContent[activeFile].filename)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition-colors cursor-pointer"
                      title="直接下載此單一檔案，免解壓縮"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>下載此單檔</span>
                    </button>
                    <button
                      onClick={() => onCopyText(filesContent[activeFile].content, filesContent[activeFile].filename)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition-colors cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>複製檔案內容</span>
                    </button>
                  </div>
                </div>
                <pre className="text-xs font-mono overflow-x-auto max-h-[400px] leading-relaxed text-slate-300">
                  {filesContent[activeFile].content}
                </pre>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={handleDownloadZip}
                  disabled={isZipping}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-sm font-bold shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  {isZipping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  <span>✨ 瀏覽器即時打包下載 ZIP (Mac/Win 通用)</span>
                </button>
                <button
                  onClick={handleDownloadAllFiles}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-sm font-bold shadow-md transition-all cursor-pointer"
                >
                  <FolderDown className="w-4 h-4" />
                  <span>📂 免解壓縮！一鍵直接下載 7 個檔案</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'checklist' && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-xs sm:text-sm text-blue-900">
                <strong>💡 實時互動檢查表：</strong>
                依照下述 10 項步驟依序完成，點選核取方塊即可即時保存進度，全部完成代表台股 AI 盯盤平台已成功上線！
              </div>

              <div className="space-y-2.5">
                {checklistItems.map((item, idx) => {
                  const isDone = !!checkedItems[item.id];
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleCheck(item.id)}
                      className={`flex items-center gap-3 p-4 rounded-2xl border transition-all cursor-pointer select-none ${
                        isDone
                          ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                          : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300'
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center border font-bold text-xs transition-colors shrink-0 ${
                          isDone
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : 'border-slate-300 text-transparent bg-white'
                        }`}
                      >
                        ✓
                      </div>
                      <span className={`text-xs sm:text-sm font-medium ${isDone ? 'line-through text-slate-500' : ''}`}>
                        {idx + 1}. {item.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
                <span>
                  完成進度：
                  <strong>
                    {Object.values(checkedItems).filter(Boolean).length} / {checklistItems.length}
                  </strong>
                </span>
                <button
                  onClick={() => {
                    setCheckedItems({});
                    localStorage.removeItem('v6_checklist_state');
                  }}
                  className="text-xs text-slate-500 hover:text-slate-800 underline cursor-pointer"
                >
                  重設檢查表
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            <strong>台股 AI 全市場選股與量化分析平台｜V6</strong> (GitHub + Render 部署版)
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadZip}
              disabled={isZipping}
              className="text-blue-700 font-bold hover:underline cursor-pointer disabled:opacity-50"
            >
              {isZipping ? '打包中...' : '下載標準 ZIP'}
            </button>
            <span>•</span>
            <button
              onClick={handleDownloadAllFiles}
              className="text-emerald-700 font-bold hover:underline cursor-pointer"
            >
              免解壓下載 7 檔案
            </button>
            <span>•</span>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold cursor-pointer transition-colors"
            >
              關閉視窗
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
