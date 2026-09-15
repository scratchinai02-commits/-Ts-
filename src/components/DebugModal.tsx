import React, { useState, useEffect } from 'react';
import {
  X,
  Copy,
  AlertTriangle,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Terminal,
  AlertOctagon,
  CheckCircle2,
  Cpu
} from 'lucide-react';
import { DEBUG_PROMPT } from '../data/advancedPrompts';
import { STEP_DEBUG_PROMPTS } from '../data/debugPrompts';

interface DebugModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCopyText: (text: string, title: string) => void;
  initialStepId?: number | null;
}

export const DebugModal: React.FC<DebugModalProps> = ({
  isOpen,
  onClose,
  onCopyText,
  initialStepId = 1,
}) => {
  const [selectedStepId, setSelectedStepId] = useState<number | 'general'>(() => {
    return initialStepId && initialStepId >= 1 && initialStepId <= 24 ? initialStepId : 1;
  });

  useEffect(() => {
    if (initialStepId && initialStepId >= 1 && initialStepId <= 24) {
      setSelectedStepId(initialStepId);
    }
  }, [initialStepId, isOpen]);

  if (!isOpen) return null;

  const currentStepDebug = typeof selectedStepId === 'number' ? STEP_DEBUG_PROMPTS[selectedStepId] : null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 pb-4 border-b border-slate-100 bg-red-50/60 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-500 text-white flex items-center justify-center font-bold shadow-md shadow-red-200 shrink-0">
              <AlertOctagon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="bg-red-100 text-red-700 text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-md border border-red-200">
                  24 步獨立除錯助手
                </span>
                <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
                  專為台股量化教學打造
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-slate-800">
                出錯了？24 步獨立 AI 即時除錯助手
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-2 rounded-full hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* 步驟選擇器 (1~24 + 通用) */}
        <div className="bg-slate-100/80 p-3 sm:p-4 border-b border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-red-500" />
              請選擇遇到問題的步驟（共 24 個獨立步驟除錯 Prompt）：
            </span>
            <button
              onClick={() => setSelectedStepId('general')}
              className={`text-xs font-bold px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                selectedStepId === 'general'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-50'
              }`}
            >
              通用萬用除錯
            </button>
          </div>

          {/* 24 步驟快捷切換按鈕 */}
          <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto custom-scrollbar p-1 bg-white rounded-xl border border-slate-200">
            {Array.from({ length: 24 }, (_, i) => i + 1).map((stepNum) => {
              const isSelected = selectedStepId === stepNum;
              return (
                <button
                  key={stepNum}
                  onClick={() => setSelectedStepId(stepNum)}
                  className={`text-xs font-bold px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-red-500 text-white shadow-xs scale-105'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-200 border border-slate-100'
                  }`}
                >
                  S{stepNum}
                </button>
              );
            })}
          </div>
        </div>

        {/* Body Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-grow custom-scrollbar">
          {currentStepDebug ? (
            <>
              {/* 當前步驟標題與資訊 */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-red-100 text-red-700 text-xs font-black px-2.5 py-0.5 rounded-full">
                      STEP {currentStepDebug.stepId}
                    </span>
                    <span className="text-xs text-slate-500 font-bold">
                      {currentStepDebug.category}
                    </span>
                  </div>
                  <h4 className="text-base sm:text-lg font-black text-slate-800">
                    {currentStepDebug.stepTitle}
                  </h4>
                </div>

                <span className="text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-xl shrink-0">
                  常見症狀：{currentStepDebug.commonErrorTag}
                </span>
              </div>

              {/* 該步驟常見錯誤快篩指引 */}
              {currentStepDebug.commonErrors.length > 0 && (
                <div className="space-y-2">
                  <h5 className="font-black text-xs sm:text-sm text-slate-700 flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-blue-600" />
                    STEP {currentStepDebug.stepId} 常見報錯與快速診斷：
                  </h5>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {currentStepDebug.commonErrors.map((err, idx) => (
                      <div
                        key={idx}
                        className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3 text-xs space-y-1"
                      >
                        <span className="font-bold text-amber-900 block leading-tight">
                          ⚠️ {err.title}
                        </span>
                        <p className="text-slate-600 text-[11px] leading-relaxed">
                          <b className="text-slate-700">原因：</b>{err.reason}
                        </p>
                        <p className="text-emerald-700 text-[11px] leading-relaxed font-medium">
                          <b className="text-emerald-800">解法：</b>{err.quickFix}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 該步驟專屬除錯 Prompt 程式碼區塊 */}
              <div className="bg-slate-900 text-slate-100 rounded-2xl p-5 relative group shadow-inner border border-slate-800">
                <div className="flex items-center justify-between mb-3 border-b border-slate-700 pb-2.5">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-slate-400 text-xs font-mono pl-2">
                      debug_step_{currentStepDebug.stepId}.txt
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      onCopyText(
                        currentStepDebug.debugPrompt,
                        `STEP ${currentStepDebug.stepId} 專屬除錯詠唱詞`
                      )
                    }
                    className="bg-red-500 hover:bg-red-600 text-white text-xs font-bold py-1.5 px-3.5 rounded-lg shadow-sm transition-all flex items-center gap-1.5 cursor-pointer hover:scale-105"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    一鍵複製 STEP {currentStepDebug.stepId} 除錯詠唱詞
                  </button>
                </div>

                <div className="max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                  <pre className="whitespace-pre-wrap font-mono text-xs sm:text-sm text-slate-200 leading-relaxed">
                    {currentStepDebug.debugPrompt}
                  </pre>
                </div>
              </div>
            </>
          ) : (
            /* 通用萬用除錯模版 */
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                <h4 className="font-bold text-sm text-blue-900 mb-1">
                  💡 通用除錯指令模版 (適用於任何未列出之錯誤)
                </h4>
                <p className="text-xs text-blue-700 leading-relaxed">
                  將 Colab 的紅色錯誤文字貼入下方模板，發送給 Gemini，即可由 AI 自動幫你修復程式碼！
                </p>
              </div>

              <div className="bg-slate-900 text-slate-100 rounded-2xl p-5 border border-slate-800">
                <div className="flex items-center justify-between mb-3 border-b border-slate-700 pb-2.5">
                  <span className="text-xs font-mono text-slate-400">general_debug_prompt.txt</span>
                  <button
                    onClick={() => onCopyText(DEBUG_PROMPT, '通用除錯助手詠唱詞')}
                    className="bg-red-500 hover:bg-red-600 text-white text-xs font-bold py-1.5 px-3 rounded-lg shadow-xs transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    複製通用除錯詠唱詞
                  </button>
                </div>
                <pre className="whitespace-pre-wrap font-mono text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {DEBUG_PROMPT}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {typeof selectedStepId === 'number' && (
              <>
                <button
                  onClick={() => setSelectedStepId(Math.max(1, selectedStepId - 1))}
                  disabled={selectedStepId <= 1}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-1 px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" /> 上一步除錯
                </button>
                <button
                  onClick={() => setSelectedStepId(Math.min(24, selectedStepId + 1))}
                  disabled={selectedStepId >= 24}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-1 px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  下一步除錯 <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs cursor-pointer transition-colors"
          >
            關閉除錯視窗
          </button>
        </div>
      </div>
    </div>
  );
};
