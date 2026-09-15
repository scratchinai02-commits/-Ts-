import React from 'react';
import { StepItem } from '../types';
import {
  X,
  Copy,
  Check,
  LifeBuoy,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Tag,
  AlertOctagon
} from 'lucide-react';
import { STEP_DEBUG_PROMPTS } from '../data/debugPrompts';
import {
  STEP11_RESCUE_CODE,
  STEP13_RESCUE_CODE,
  STEP14_RESCUE_CODE,
  STEP16_RESCUE_CODE,
  STEP17_RESCUE_CODE,
  STEP18_RESCUE_CODE,
  STEP19_RESCUE_CODE,
  STEP20_RESCUE_CODE,
  STEP21_RESCUE_CODE,
  STEP22_RESCUE_CODE,
  STEP23_RESCUE_CODE,
  STEP24_RESCUE_CODE
} from '../data/rescueCodes';
import { Step24DeployGuide } from './Step24DeployGuide';

interface StepModalProps {
  step: StepItem;
  isCompleted: boolean;
  totalSteps: number;
  onClose: () => void;
  onToggleComplete: (id: number) => void;
  onNavigate: (stepId: number) => void;
  onCopyText: (text: string, label: string) => void;
  onOpenDebug?: (stepId: number) => void;
}

export const StepModal: React.FC<StepModalProps> = ({
  step,
  isCompleted,
  totalSteps,
  onClose,
  onToggleComplete,
  onNavigate,
  onCopyText,
  onOpenDebug,
}) => {
  const getFullPromptText = () => {
    const threadContinuityRule = `\n\n【🔥 重要指令：絕對嚴禁建立新檔案 (NO ARTIFACTS)】：\n1. 請直接在對話框中輸出程式碼區塊。絕對不要建立新的檔案或元件。\n2. 保持在目前的對話串中，必須引用之前定義過的變數與數據。`;
    const vibeCodingRule = `\n\n【Vibe Coding 守則】：\n1. 請將此步驟所需的所有 import 直接包含在程式碼區塊內，確保可直接貼入新儲存格運行。`;
    const commentRule = `\n\n【註解要求】：\n1. 第一行為：\`# STEP ${step.id}: ${step.title}\`。\n2. 註解請精要專業，解釋目的。`;

    return step.prompt + threadContinuityRule + vibeCodingRule + commentRule;
  };

  const getRescueCode = (id: number): string | null => {
    switch (id) {
      case 11:
        return STEP11_RESCUE_CODE;
      case 13:
        return STEP13_RESCUE_CODE;
      case 14:
        return STEP14_RESCUE_CODE;
      case 16:
        return STEP16_RESCUE_CODE;
      case 17:
        return STEP17_RESCUE_CODE;
      case 18:
        return STEP18_RESCUE_CODE;
      case 19:
        return STEP19_RESCUE_CODE;
      case 20:
        return STEP20_RESCUE_CODE;
      case 21:
        return STEP21_RESCUE_CODE;
      case 22:
        return STEP22_RESCUE_CODE;
      case 23:
        return STEP23_RESCUE_CODE;
      case 24:
        return STEP24_RESCUE_CODE;
      default:
        return null;
    }
  };

  const rescueCode = getRescueCode(step.id);
  const fullPrompt = getFullPromptText();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 pb-4 border-b border-slate-100 flex items-start justify-between gap-4 bg-slate-50/70">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-indigo-200 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-indigo-600" />
                STEP {step.id} / {totalSteps}
              </span>
              <span className="text-xs font-medium text-slate-600 flex items-center gap-1 bg-white border border-slate-200 px-2.5 py-0.5 rounded-full">
                <Tag className="w-3 h-3 text-slate-400" />
                {step.category}
              </span>
              {step.id === 24 && (
                <span className="bg-gradient-to-r from-amber-500 to-rose-500 text-white text-xs font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                  🌐 Hugging Face Spaces 線上網站部署
                </span>
              )}
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-800 leading-tight">
              {step.title}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-2 rounded-full hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-grow custom-scrollbar">
          {step.id === 24 ? (
            <Step24DeployGuide onCopyText={onCopyText} />
          ) : (
            <>
              {/* 步驟簡述 */}
              <p className="text-slate-700 text-sm sm:text-base leading-relaxed bg-blue-50/60 border border-blue-100/90 rounded-2xl p-4 sm:p-4.5">
                {step.desc}
              </p>

              {/* 救援程式碼與除錯按鈕區 */}
              <div className="space-y-2">
                {rescueCode && (
                  <button
                    onClick={() => onCopyText(rescueCode, `STEP ${step.id} 完美救援代碼`)}
                    className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-2xl py-3 px-4 shadow-xs transition-all flex items-center justify-center font-bold text-xs sm:text-sm cursor-pointer group hover:scale-[1.005]"
                  >
                    <LifeBuoy className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-emerald-600 group-hover:rotate-45 transition-transform" />
                    🚑 遇到問題了嗎？點擊複製「完美救援程式碼」無痛過關 (STEP {step.id})
                  </button>
                )}

                <button
                  onClick={() => {
                    if (STEP_DEBUG_PROMPTS[step.id]) {
                      onCopyText(STEP_DEBUG_PROMPTS[step.id].debugPrompt, `STEP ${step.id} 專屬除錯詠唱詞`);
                    }
                  }}
                  className="w-full bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-2xl py-2.5 px-4 shadow-xs transition-all flex items-center justify-center font-bold text-xs sm:text-sm cursor-pointer group hover:scale-[1.005]"
                >
                  <AlertOctagon className="w-4 h-4 mr-2 text-rose-600 group-hover:rotate-12 transition-transform" />
                  🛑 遇到報錯？點擊複製「STEP {step.id} 專屬除錯 Prompt」直接貼給 Gemini
                </button>
              </div>

              {/* 本步驟標準 Prompt 程式碼區塊 */}
              <div className="bg-slate-900 text-slate-100 rounded-2xl p-5 relative group shadow-inner border border-slate-800">
                <div className="flex items-center justify-between mb-3 border-b border-slate-700 pb-2.5">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                    <span className="text-slate-400 text-xs font-mono pl-2">prompt_step_{step.id}.txt</span>
                  </div>
                  <button
                    onClick={() => onCopyText(fullPrompt, `STEP ${step.id} 詠唱指令`)}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-1.5 px-3.5 rounded-lg shadow-sm transition-all flex items-center gap-1.5 cursor-pointer hover:scale-105"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    一鍵複製本步詠唱詞
                  </button>
                </div>

                <div className="max-h-72 overflow-y-auto pr-2 custom-scrollbar">
                  <pre className="whitespace-pre-wrap font-mono text-xs sm:text-sm text-slate-200 leading-relaxed">
                    {fullPrompt}
                  </pre>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => onNavigate(step.id - 1)}
              disabled={step.id <= 1}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1 px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" /> 上一步
            </button>
            <button
              onClick={() => onNavigate(step.id + 1)}
              disabled={step.id >= totalSteps}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1 px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              下一步 <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => onToggleComplete(step.id)}
              className={`w-full sm:w-auto inline-flex justify-center items-center rounded-xl px-5 py-2.5 text-sm font-bold shadow-xs transition-colors cursor-pointer ${
                isCompleted
                  ? 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {isCompleted ? (
                <>
                  <X className="w-4 h-4 mr-1.5 text-slate-500" />
                  標記為未完成
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-1.5" />
                  標記為已完成
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
