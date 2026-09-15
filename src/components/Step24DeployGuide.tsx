import React, { useState } from 'react';
import { V6DeployModal } from './V6DeployModal';
import { downloadV6ZipInBrowser, downloadAllV6FilesIndividually } from '../utils/zipDownloader';
import {
  ExternalLink,
  Copy,
  Check,
  Download,
  Key,
  ShieldCheck,
  Sparkles,
  AlertTriangle,
  FileCode,
  FileText,
  Server,
  Cloud,
  CheckCircle2,
  Terminal,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  FolderUp,
  Sliders,
  Play,
  FolderDown,
  Loader2
} from 'lucide-react';
import { STEP24_REQUIREMENTS_TXT, STEP24_APP_PY } from '../data/step24Files';
import {
  downloadStep24RequirementsTxt,
  downloadStep24AppPy,
  downloadBothStep24FilesIndividually,
  downloadStep24Zip
} from '../utils/step24Downloader';

interface Step24DeployGuideProps {
  onCopyText: (text: string, label: string) => void;
}

const REQUIREMENTS_TXT_CONTENT = STEP24_REQUIREMENTS_TXT;
const APP_PY_CONTENT = STEP24_APP_PY;

export const Step24DeployGuide: React.FC<Step24DeployGuideProps> = ({ onCopyText }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isV6Open, setIsV6Open] = useState<boolean>(false);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleDownloadFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 text-slate-800">
      <V6DeployModal
        isOpen={isV6Open}
        onClose={() => setIsV6Open(false)}
        onCopyText={onCopyText}
      />

      {/* 🚀 最新 v6 GitHub + Render 推薦架構橫幅 */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 rounded-2xl p-4 sm:p-5 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-blue-400/30">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-300/30 text-[11px] font-black uppercase tracking-wider">
                2026 終極推薦 · 免費部署
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-300/30 text-[11px] font-bold">
                GitHub + Render
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-white">
              想完全跳過 Hugging Face？使用「v6 GitHub + Render」架構！
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
              從「下載 v6 ZIP」開始，完整走一次：解壓 → GitHub → Render → API Key → 自動部署 → 線上測試。
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
          <button
            onClick={() => setIsV6Open(true)}
            className="flex-1 sm:flex-initial px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-xs transition-colors cursor-pointer whitespace-nowrap"
          >
            開啟 v6 完整部署指南
          </button>
          <button
            onClick={() => downloadV6ZipInBrowser()}
            className="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition-colors cursor-pointer flex items-center gap-1 whitespace-nowrap"
            title="下載符合 macOS / Windows 標準之 v6 ZIP"
          >
            <Download className="w-3.5 h-3.5" />
            <span>ZIP 下載</span>
          </button>
          <button
            onClick={() => downloadAllV6FilesIndividually()}
            className="px-3 py-2.5 bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-200 font-bold text-xs rounded-xl border border-emerald-400/30 transition-colors cursor-pointer hidden md:flex items-center gap-1 whitespace-nowrap"
            title="完全免解壓縮，直接下載 7 個核心檔案"
          >
            <FolderDown className="w-3.5 h-3.5 text-emerald-300" />
            <span>免解壓下載 7 檔</span>
          </button>
        </div>
      </div>

      {/* ⚠️ 與 Colab 無關 重要醒目標題橫幅 */}
      <div className="bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 rounded-2xl p-[2px] shadow-lg">
        <div className="bg-slate-900 rounded-[14px] p-5 sm:p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              終極步驟：免架伺服器 · 雲端一鍵上線
            </div>
            <h2 className="text-xl sm:text-2xl font-black mb-2 flex items-center gap-2">
              <span>🚀</span> Hugging Face Spaces 一頁式線上部署全攻略
            </h2>
            <div className="bg-amber-500/20 border border-amber-400/40 rounded-xl p-3.5 mt-3 flex items-start gap-3">
              <span className="text-xl shrink-0">💡</span>
              <div className="text-xs sm:text-sm text-amber-100 leading-relaxed font-medium">
                <strong className="text-amber-300 underline font-bold">重要提醒：本步驟完全不需要再回 Google Colab 貼上或執行任何程式碼！</strong>
                <br />
                在 STEP 22 & 23 中，您已將所需的檔案下載至電腦。接下來的全部流程均在 <strong>Hugging Face 官方網站</strong> 瀏覽器中操作！
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 📦 步驟 0：檔案清單與最新 2 大核心檔案下載區 */}
      <div className="bg-gradient-to-b from-indigo-50/70 via-slate-50 to-white border-2 border-indigo-200 rounded-2xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-5 pb-4 border-b border-indigo-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-indigo-600 text-white text-[11px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                STEP 24 專屬檔案更新
              </span>
              <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                已同步最新 5 大頁籤量化分析旗艦版
              </span>
            </div>
            <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
              <FolderDown className="w-5 h-5 text-indigo-600" />
              前置準備：請下載以下 2 個部署核心檔案
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Hugging Face Spaces（或本機執行）只需這 2 個檔案即可直接啟動完整的台股 AI 全市場量化分析雷達。
            </p>
          </div>

          {/* 一鍵雙下載動作列 */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => downloadBothStep24FilesIndividually()}
              className="bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs py-2 px-3.5 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              title="免解壓！直接由瀏覽器連續觸發下載 requirements.txt 與 app.py"
            >
              <Download className="w-4 h-4" />
              一鍵下載 2 個檔案 (免解壓)
            </button>
            <button
              onClick={() => downloadStep24Zip()}
              className="bg-white hover:bg-slate-50 active:scale-95 text-indigo-700 border border-indigo-300 font-bold text-xs py-2 px-3.5 rounded-xl shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
              title="下載標準 PKZip 壓縮檔 (相容 macOS / Windows，含 requirements.txt 與 app.py)"
            >
              <FolderDown className="w-4 h-4 text-indigo-600" />
              打包下載 ZIP
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* File 1: requirements.txt */}
          <div className="bg-white rounded-xl p-4 sm:p-5 border border-indigo-100 shadow-2xs flex flex-col justify-between hover:border-indigo-300 transition-colors">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-2 font-bold text-sm text-slate-900">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  requirements.txt
                </span>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  相依套件清單 (8大套件)
                </span>
              </div>
              <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                包含 <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-indigo-600">yfinance</code>、<code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-indigo-600">plotly</code>、<code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-indigo-600">xgboost</code>、<code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-indigo-600">scikit-learn</code>、<code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-indigo-600">google-generativeai</code> 等雲端環境所需函式庫。
              </p>

              {/* 預覽區塊 */}
              <div className="bg-slate-900 rounded-lg p-2.5 font-mono text-[11px] text-emerald-400 mb-3 overflow-x-auto max-h-24">
                <pre>{REQUIREMENTS_TXT_CONTENT}</pre>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => onCopyText(REQUIREMENTS_TXT_CONTENT, 'requirements.txt 完整內容')}
                className="flex-1 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 text-xs font-bold py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" /> 複製內容
              </button>
              <button
                onClick={() => downloadStep24RequirementsTxt()}
                className="flex-1 bg-indigo-50 hover:bg-indigo-100 active:scale-95 text-indigo-700 border border-indigo-200 text-xs font-bold py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> 下載檔案
              </button>
            </div>
          </div>

          {/* File 2: app.py */}
          <div className="bg-white rounded-xl p-4 sm:p-5 border border-blue-100 shadow-2xs flex flex-col justify-between hover:border-blue-300 transition-colors">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-2 font-bold text-sm text-slate-900">
                  <FileCode className="w-4 h-4 text-blue-600" />
                  app.py <span className="text-xs font-normal text-slate-400">/ stock.py</span>
                </span>
                <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                  全市場量化旗艦版
                </span>
              </div>
              <p className="text-xs text-slate-600 mb-2 leading-relaxed">
                台股 AI 全市場選股雷達、今日漲幅前100、單檔深度分析（MACD 24項+先行指標22項）、自選股量化排名與 Gemini 整合。
              </p>

              {/* 特性清單 */}
              <div className="grid grid-cols-2 gap-1.5 mb-3 text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                <div className="flex items-center gap-1">
                  <span className="text-indigo-600">✓</span> 全市場選股雷達
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-indigo-600">✓</span> 漲幅排行 Top 100
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-indigo-600">✓</span> 4 層式專業 Plotly K線
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-indigo-600">✓</span> 自選股 100分制排名
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-3 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onCopyText(APP_PY_CONTENT, 'app.py 完整代碼')}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 text-xs font-bold py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" /> 複製代碼
                </button>
                <button
                  onClick={() => downloadStep24AppPy('app.py')}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Download className="w-3.5 h-3.5" /> 下載 app.py
                </button>
              </div>
              <button
                onClick={() => downloadStep24AppPy('stock.py')}
                className="w-full text-center text-[11px] text-slate-500 hover:text-blue-600 underline py-0.5 cursor-pointer transition-colors"
                title="若需要保留在 Colab 原生檔名 stock.py，可點此另存為 stock.py"
              >
                或點此下載為 stock.py (Colab 檔名)
              </button>
            </div>
          </div>
        </div>

        <div className="mt-4 text-[12px] text-slate-600 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-amber-50/90 border border-amber-200 rounded-xl p-3">
          <div className="flex items-start sm:items-center gap-2">
            <span className="text-amber-600 font-bold shrink-0">💡 部署命名提示：</span>
            <span>Hugging Face Spaces 預設以 <code className="bg-white px-1.5 py-0.5 rounded text-indigo-700 font-mono font-bold border border-amber-200">app.py</code> 作為程式進入點。上傳時檔名請直接使用 <code className="bg-white px-1.5 py-0.5 rounded text-indigo-700 font-mono font-bold border border-amber-200">app.py</code>。</span>
          </div>
        </div>
      </div>

      {/* 🧭 4 大實戰步驟 Step-by-Step 卡片 */}
      <div className="space-y-4">
        <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
          <span>🛠️</span> 4 步驟手把手圖文部署流程
        </h3>

        {/* STEP 1 */}
        <div className="bg-white border-2 border-indigo-100 rounded-2xl p-5 shadow-xs relative overflow-hidden">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-xs">
                1
              </span>
              <div>
                <h4 className="font-bold text-base text-slate-800">
                  前往 Hugging Face 建立新 Space 雲端容器
                </h4>
                <p className="text-xs text-slate-500">免信用卡 · 永久免費 2 vCPU 伺服器</p>
              </div>
            </div>
            <a
              href="https://huggingface.co/new-space"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2 px-3.5 rounded-xl shadow-xs transition-all flex items-center gap-1.5 shrink-0 cursor-pointer hover:scale-105"
            >
              <span>開啟 New Space</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 text-xs sm:text-sm space-y-2.5 text-slate-700 border border-slate-200/80">
            <p className="font-semibold text-slate-900 mb-1">📝 Space 建立表單設定指南：</p>
            <ul className="space-y-2 pl-4 list-disc marker:text-indigo-600">
              <li>
                <strong>Space name</strong>：輸入自訂專案英文名稱（例如：<code className="bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded font-mono font-bold">taiwan-stock-ai-dashboard</code>）
              </li>
              <li>
                <strong>Select the Space SDK</strong>：點選 👉 <strong className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">Gradio</strong>
              </li>
              <li>
                <strong>Space hardware</strong>：選擇 👉 <strong className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">CPU Basic (Free - 2 vCPU · 16GB RAM)</strong>（完全免費）
              </li>
              <li>
                <strong>Space visibility</strong>：選擇 <strong className="text-slate-900">Public</strong>（公開分享）或 <strong className="text-slate-900">Private</strong>（私人私有專用）
              </li>
              <li>
                點擊最下方按鈕 👉 <strong className="text-indigo-600">「Create Space」</strong>
              </li>
            </ul>
          </div>
        </div>

        {/* STEP 2 */}
        <div className="bg-white border-2 border-blue-100 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center gap-3 mb-3">
            <span className="w-8 h-8 rounded-xl bg-blue-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-xs">
              2
            </span>
            <div>
              <h4 className="font-bold text-base text-slate-800">
                拖曳上傳專案檔案 (requirements.txt & app.py)
              </h4>
              <p className="text-xs text-slate-500">免打 Git 指令 · 網頁直接拖曳</p>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 text-xs sm:text-sm space-y-2.5 text-slate-700 border border-slate-200/80">
            <ol className="space-y-2 pl-4 list-decimal marker:text-blue-600 font-medium">
              <li>
                進入剛建立的 Space 主頁，點擊頂部橫條的 <strong>「Files」</strong>（檔案）頁籤。
              </li>
              <li>
                點擊右上方按鈕 <strong>「+ Add file」</strong> ➔ 選擇 <strong>「Upload files」</strong>。
              </li>
              <li>
                將您電腦下載的 <code className="bg-white px-1.5 py-0.5 rounded font-mono font-bold text-indigo-600">requirements.txt</code> 與 <code className="bg-white px-1.5 py-0.5 rounded font-mono font-bold text-blue-600">app.py</code> 直接拖曳至上傳區域。
              </li>
              <li>
                在最下方輸入 Commit 說明（例如：<span className="text-slate-500">Initial Deploy AI Stock App</span>），點選綠色按鈕 <strong>「Commit changes to main」</strong> 提交！
              </li>
            </ol>
          </div>
        </div>

        {/* STEP 3 - KEY AND TOKEN SECURITY (HIGHLIGHTED) */}
        <div className="bg-gradient-to-br from-amber-50 via-rose-50 to-indigo-50 border-2 border-amber-300 rounded-2xl p-5 sm:p-6 shadow-md relative">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-xs">
                3
              </span>
              <div>
                <h4 className="font-black text-base sm:text-lg text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  【關鍵安全核心】在 Settings 中設定 FinMind Token 與 Gemini API Key
                </h4>
                <p className="text-xs text-amber-800 font-medium">嚴禁把金鑰明文寫死在程式碼中 · Hugging Face 自動加密注入容器環境變數</p>
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur rounded-xl p-4 sm:p-5 text-xs sm:text-sm space-y-3.5 text-slate-800 border border-amber-200/90 shadow-2xs">
            <div className="bg-amber-100/70 border border-amber-300 rounded-xl p-3 text-xs text-amber-950 font-medium">
              🔒 <strong>為什麼一定要用 Hugging Face 的 Secrets 設定？</strong>
              <br />
              因為若把您的 API Key 寫進程式碼，一旦 Space 設為公開或被檢視，金鑰將完全曝光導致額度被盜刷。透過 Space 的 <strong>Variables and secrets</strong> 設定，密鑰會被最高規格加密，並在執行時期以 Linux 環境變數自動讀取！
            </div>

            <p className="font-bold text-slate-900">📌 詳細操作步驟：</p>
            <ol className="space-y-3 pl-4 list-decimal marker:text-amber-600">
              <li>
                點選 Space 頁面頂部的 <strong>⚙️ 「Settings」</strong>（設定）頁籤。
              </li>
              <li>
                向下滾動頁面，找到 <strong>「Variables and secrets」</strong>（變數與密鑰）區塊。
              </li>
              <li>
                點擊 👉 <strong className="bg-slate-900 text-white px-2.5 py-1 rounded text-xs">New secret</strong> 按鈕，依序新增以下兩組安全密鑰：
              </li>
            </ol>

            {/* Secret 1 & 2 Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {/* Secret 1: Gemini */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-xs text-indigo-700 flex items-center gap-1">
                    <Key className="w-3.5 h-3.5 text-indigo-500" /> 密鑰一：Gemini AI 智能解析
                  </span>
                  <button
                    onClick={() => onCopyText('GEMINI_API_KEY', 'Secret 名稱 (GEMINI_API_KEY)')}
                    className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" /> 複製變數名
                  </button>
                </div>
                <div className="space-y-1 text-xs">
                  <div>
                    <span className="text-slate-500">Name：</span>
                    <code className="bg-white px-1.5 py-0.5 rounded font-mono font-bold text-slate-800 border border-slate-200">
                      GEMINI_API_KEY
                    </code>
                  </div>
                  <div>
                    <span className="text-slate-500">Value：</span>
                    <span className="text-slate-700 font-medium">貼上您的 Google Gemini API Key</span>
                  </div>
                </div>
              </div>

              {/* Secret 2: FinMind */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-xs text-emerald-700 flex items-center gap-1">
                    <Key className="w-3.5 h-3.5 text-emerald-500" /> 密鑰二：FinMind 台股籌碼數據
                  </span>
                  <button
                    onClick={() => onCopyText('FINMIND_TOKEN', 'Secret 名稱 (FINMIND_TOKEN)')}
                    className="text-[11px] font-bold text-emerald-600 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" /> 複製變數名
                  </button>
                </div>
                <div className="space-y-1 text-xs">
                  <div>
                    <span className="text-slate-500">Name：</span>
                    <code className="bg-white px-1.5 py-0.5 rounded font-mono font-bold text-slate-800 border border-slate-200">
                      FINMIND_TOKEN
                    </code>
                  </div>
                  <div>
                    <span className="text-slate-500">Value：</span>
                    <span className="text-slate-700 font-medium">貼上您的 FinMind API Token</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-xs text-slate-600 pt-1">
              4. 點擊 <strong>「Save」</strong> 儲存即可！Python 程式碼將透過標準 <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">os.environ.get("GEMINI_API_KEY")</code> 自動安全讀取。
            </div>
          </div>
        </div>

        {/* STEP 4 */}
        <div className="bg-white border-2 border-emerald-100 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center gap-3 mb-3">
            <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-xs">
              4
            </span>
            <div>
              <h4 className="font-bold text-base text-slate-800">
                自動 Build 容器 ➔ 綠燈 Running 成功上線！
              </h4>
              <p className="text-xs text-slate-500">即時 Logs 監控 · 取得全螢幕網址分享</p>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 text-xs sm:text-sm space-y-3 text-slate-700 border border-slate-200/80">
            <ol className="space-y-2 pl-4 list-decimal marker:text-emerald-600 font-medium">
              <li>
                切換回 Space 頂部的 <strong>「App」</strong> 頁籤。
              </li>
              <li>
                上方狀態會顯示 🟡 <strong className="text-amber-600">Building</strong>，點擊可展開即時查看 Docker 容器安裝套件進度。
              </li>
              <li>
                約 1~2 分鐘後，狀態將變為 🟢 <strong className="text-emerald-600">Running</strong>（綠燈），此時您的台股 AI 量化盯盤 Web App 正式永久上線！
              </li>
            </ol>

            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-emerald-900">
              <span className="text-lg shrink-0">📱</span>
              <div>
                <strong>全螢幕獨立無廣告網址技巧：</strong>
                <br />
                在 Space 右上角點選 <strong>「...」選單 ➔ Embed this Space ➔ 複製 Direct URL</strong>，即可取得純淨全螢幕網址，支援手機 Safari / Chrome 「加入主畫面」，隨時隨地宛如原生 App 般看盤！
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🩺 常見問題與故障排除 FAQ */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
        <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-indigo-600" />
          常見問題與故障排查 (Troubleshooting FAQ)
        </h3>

        <div className="space-y-2 text-xs sm:text-sm">
          {/* FAQ 1 */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <button
              onClick={() => toggleFaq(1)}
              className="w-full bg-slate-50 hover:bg-slate-100 p-3.5 text-left font-bold flex items-center justify-between text-slate-800 transition-colors cursor-pointer"
            >
              <span>❌ 狀態顯示 No application file found 怎麼辦？</span>
              {openFaq === 1 ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
            </button>
            {openFaq === 1 && (
              <div className="p-4 bg-white text-slate-600 leading-relaxed border-t border-slate-100 text-xs">
                原因：Hugging Face 預設主程式檔名必須為 <code className="bg-slate-100 px-1 py-0.5 rounded font-mono font-bold">app.py</code>。<br />
                解決方法：進入 <strong>Files</strong> 頁籤，若您的檔案名稱為 <code className="font-mono">stock.py</code>，請點進該檔案點選右上角選單重新命名為 <code className="font-mono font-bold text-indigo-600">app.py</code>，或直接重新上傳命名為 app.py 的檔案。
              </div>
            )}
          </div>

          {/* FAQ 2 */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <button
              onClick={() => toggleFaq(2)}
              className="w-full bg-slate-50 hover:bg-slate-100 p-3.5 text-left font-bold flex items-center justify-between text-slate-800 transition-colors cursor-pointer"
            >
              <span>❌ 狀態顯示 ModuleNotFoundError: No module named 'xxx' 怎麼辦？</span>
              {openFaq === 2 ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
            </button>
            {openFaq === 2 && (
              <div className="p-4 bg-white text-slate-600 leading-relaxed border-t border-slate-100 text-xs">
                原因：<code className="font-mono">requirements.txt</code> 遺漏了該模組套件名稱。<br />
                解決方法：進入 <strong>Files</strong> 頁籤點選 <code className="font-mono font-bold">requirements.txt</code> ➔ 點選 <strong>Edit</strong> ➔ 在最下方換行補上該套件名稱（例如 <code className="font-mono">plotly</code> 或 <code className="font-mono">yfinance</code>）➔ 點擊 <strong>Commit</strong>，系統將自動觸發重新 Build！
              </div>
            )}
          </div>

          {/* FAQ 3 */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <button
              onClick={() => toggleFaq(3)}
              className="w-full bg-slate-50 hover:bg-slate-100 p-3.5 text-left font-bold flex items-center justify-between text-slate-800 transition-colors cursor-pointer"
            >
              <span>⚠️ AI 分析沒有反應或提示找無 API Key 怎麼辦？</span>
              {openFaq === 3 ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
            </button>
            {openFaq === 3 && (
              <div className="p-4 bg-white text-slate-600 leading-relaxed border-t border-slate-100 text-xs">
                請至 Space 的 <strong>Settings</strong> ➔ <strong>Variables and secrets</strong> 確認 Secret 名稱是否完全為全大寫的 <code className="bg-slate-100 px-1 py-0.5 rounded font-mono font-bold text-indigo-600">GEMINI_API_KEY</code>，並確認 Value 是否包含前後不小心複製到的空格。設定完成後至 Settings 最下方點選 <strong>Restart this Space</strong> 重啟容器即可！
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
