import React, { useState, useEffect, useMemo } from 'react';
import { STEPS_DATA } from './data/stepsData';
import { StepItem, Category } from './types';
import { Navbar } from './components/Navbar';
import { StepCard } from './components/StepCard';
import { StepModal } from './components/StepModal';
import { AdvancedSection } from './components/AdvancedSection';
import { DebugModal } from './components/DebugModal';
import { DownloadProjectModal } from './components/DownloadProjectModal';
import { Toast } from './components/Toast';
import {
  Search,
  AlertOctagon,
  Sparkles,
  Terminal,
  Compass,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  HelpCircle,
  TrendingUp,
  Cpu
} from 'lucide-react';

const CATEGORIES: Category[] = [
  '全部步驟',
  '環境與資料',
  '技術分析',
  '籌碼與基本面',
  'AI 量化模型',
  '部署與自動化',
];

export default function App() {
  const [completedSteps, setCompletedSteps] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('vibeCodingProgress');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeCategory, setActiveCategory] = useState<Category>('全部步驟');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeStepId, setActiveStepId] = useState<number | null>(null);
  const [isDebugOpen, setIsDebugOpen] = useState<boolean>(false);
  const [isDownloadOpen, setIsDownloadOpen] = useState<boolean>(false);

  const [toast, setToast] = useState<{ message: string; icon?: string; visible: boolean }>({
    message: '',
    icon: '🪄',
    visible: false,
  });

  // 儲存進度至 localStorage
  useEffect(() => {
    localStorage.setItem('vibeCodingProgress', JSON.stringify(completedSteps));
  }, [completedSteps]);

  // 顯示 Toast 通知
  const showToast = (message: string, icon = '✅') => {
    setToast({ message, icon, visible: true });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 2800);
  };

  // 複製文字至剪貼簿
  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        showToast(`已複製「${label}」！趕快貼給 Gemini 吧！`, '🪄');
      })
      .catch(() => {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast(`已複製「${label}」！`, '🪄');
      });
  };

  // 切換步驟完成狀態
  const handleToggleComplete = (id: number) => {
    setCompletedSteps((prev) => {
      const isDone = prev.includes(id);
      if (isDone) {
        return prev.filter((item) => item !== id);
      } else {
        showToast(`STEP ${id} 已標記為完成！`, '🎉');
        return [...prev, id];
      }
    });
  };

  // 重置所有進度
  const handleResetProgress = () => {
    if (window.confirm('確定要重置所有 24 步驟的完成進度嗎？')) {
      setCompletedSteps([]);
      showToast('所有進度已重置', '🔄');
    }
  };

  // 篩選卡片
  const filteredSteps = useMemo(() => {
    return STEPS_DATA.filter((step) => {
      const matchCat =
        activeCategory === '全部步驟' || step.category === activeCategory;
      const matchQuery =
        step.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        step.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        `step ${step.id}`.includes(searchQuery.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [activeCategory, searchQuery]);

  const activeStep = activeStepId !== null ? STEPS_DATA.find((s) => s.id === activeStepId) : null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased relative selection:bg-indigo-100 selection:text-indigo-900 pb-28">
      {/* 頂部導航列 */}
      <Navbar
        completedCount={completedSteps.length}
        totalCount={STEPS_DATA.length}
        onReset={handleResetProgress}
        onOpenDownload={() => setIsDownloadOpen(true)}
      />

      <Toast message={toast.message} icon={toast.icon} visible={toast.visible} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* Hero 主視覺 */}
        <div className="bg-white rounded-3xl shadow-xs border border-slate-200 p-6 sm:p-12 mb-10 overflow-hidden relative">
              <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-blue-50/80 rounded-full opacity-60 blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-purple-50/80 rounded-full opacity-60 blur-3xl pointer-events-none" />

              <div className="text-center relative z-10">
                <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold px-3.5 py-1.5 rounded-full mb-4 shadow-xs">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  2026 最新 Vibe Coding 實戰架構
                </div>

                <h1 className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600 mb-5 tracking-tight leading-tight">
                  不會寫程式，也能用 AI 打造台股盯盤系統
                </h1>

                <p className="text-slate-600 text-sm sm:text-lg text-center mx-auto max-w-3xl font-medium mb-10 leading-relaxed">
                  體驗最前沿的{' '}
                  <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md font-bold border border-indigo-100">
                    Vibe Coding
                  </span>{' '}
                  開發模式！你只需扮演「架構師」下達自然語言指令，讓 Gemini 成為你的首席工程師，一步步建構具備主動通知、20+ 量化指標與回測能力的量化分析平台。
                </p>

                {/* 3 步驟基礎指示 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-sm max-w-4xl mx-auto text-left">
                  <div className="bg-slate-50/90 backdrop-blur rounded-2xl p-5 sm:p-6 border border-slate-200 hover:border-blue-300 transition-all hover:shadow-xs">
                    <div className="flex items-center mb-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-black text-base mr-3 shadow-xs">
                        1
                      </div>
                      <div className="text-slate-800 font-bold text-base">準備環境</div>
                    </div>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                      開啟一個全新的{' '}
                      <a
                        href="https://colab.research.google.com/"
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 font-bold hover:underline"
                      >
                        Google Colab
                      </a>{' '}
                      筆記本，並在旁邊準備好 <b>Gemini</b> 對話視窗。
                    </p>
                  </div>

                  <div className="bg-slate-50/90 backdrop-blur rounded-2xl p-5 sm:p-6 border border-slate-200 hover:border-purple-300 transition-all hover:shadow-xs">
                    <div className="flex items-center mb-3">
                      <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-black text-base mr-3 shadow-xs">
                        2
                      </div>
                      <div className="text-slate-800 font-bold text-base">一鏡到底</div>
                    </div>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                      為確保 AI 的記憶堆疊，所有的詠唱詞都必須貼在
                      <strong className="text-purple-700">「同一個」</strong>
                      對話框，嚴禁開啟新檔案。
                    </p>
                  </div>

                  <div className="bg-slate-50/90 backdrop-blur rounded-2xl p-5 sm:p-6 border border-slate-200 hover:border-amber-300 transition-all hover:shadow-xs">
                    <div className="flex items-center mb-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-black text-base mr-3 shadow-xs">
                        3
                      </div>
                      <div className="text-slate-800 font-bold text-base">AI 伴讀</div>
                    </div>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                      指令中已內建分析要求，AI 產出程式碼的同時，也會化身資深分析師為你解讀盤勢！
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 控制器：分類與搜尋 */}
            <div className="bg-white p-4 rounded-2xl shadow-xs border border-slate-200 mb-8 sticky top-[68px] z-30 backdrop-blur-md bg-white/95">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                {/* 分類按鈕列 */}
                <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
                  {CATEGORIES.map((category) => (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        activeCategory === category
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>

                {/* 搜尋框 */}
                <div className="relative w-full md:w-64">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="搜尋步驟或關鍵字..."
                    className="block w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs transition-all"
                  />
                </div>
              </div>
            </div>

            {/* 24 步驟卡片網格 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-16">
              {filteredSteps.map((step) => (
                <StepCard
                  key={step.id}
                  step={step}
                  isCompleted={completedSteps.includes(step.id)}
                  onClick={() => setActiveStepId(step.id)}
                />
              ))}
            </div>

            {filteredSteps.length === 0 && (
              <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 shadow-xs mb-16">
                <Search className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h4 className="text-base font-bold text-slate-700">查無符合條件的步驟</h4>
                <p className="text-xs text-slate-400 mt-1">請嘗試變更搜尋關鍵字或分類篩選</p>
              </div>
            )}

            {/* 專家之路：進階模型升級藍圖 */}
            <AdvancedSection onCopyText={handleCopyText} />
      </main>

      {/* 浮動除錯助手按鈕 */}
      <button
        onClick={() => setIsDebugOpen(true)}
        className="fixed bottom-6 right-6 bg-red-500 hover:bg-red-600 text-white rounded-full py-3.5 px-5 shadow-2xl transition-all hover:scale-105 flex items-center font-bold text-sm z-40 group cursor-pointer border border-red-400"
      >
        <AlertOctagon className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
        出錯了？呼叫除錯助手
      </button>

      {/* 步驟 Modal */}
      {activeStep && (
        <StepModal
          step={activeStep}
          isCompleted={completedSteps.includes(activeStep.id)}
          totalSteps={STEPS_DATA.length}
          onClose={() => setActiveStepId(null)}
          onToggleComplete={handleToggleComplete}
          onNavigate={(id) => setActiveStepId(id)}
          onCopyText={handleCopyText}
          onOpenDebug={(stepId) => {
            setIsDebugOpen(true);
          }}
        />
      )}

      {/* 除錯助手 Modal */}
      <DebugModal
        isOpen={isDebugOpen}
        onClose={() => setIsDebugOpen(false)}
        onCopyText={handleCopyText}
        initialStepId={activeStepId || 1}
      />

      {/* 下載整個專案 Modal */}
      <DownloadProjectModal
        isOpen={isDownloadOpen}
        onClose={() => setIsDownloadOpen(false)}
        onToast={showToast}
      />
    </div>
  );
}
