import React, { useState } from 'react';
import { STEPS_DATA } from '../data/stepsData';
import {
  Sparkles,
  Layers,
  ArrowRight,
  ExternalLink,
  Cpu,
  BarChart3,
  Bot,
  Activity,
  CheckCircle2,
  HelpCircle,
  TrendingUp,
  Database,
  Sliders,
  Bell,
  Code
} from 'lucide-react';

interface StepPipelineGuideProps {
  onOpenStepModal?: (stepId: number) => void;
  onSelectMetricInSimulator?: (stepId: number) => void;
}

// 24 步驟對應實機功能的精準對照表
export const STEP_FEATURE_MAPPING: Record<
  number,
  {
    stage: string;
    stageIcon: string;
    featureInStep24: string;
    techConcept: string;
    metricTarget?: string;
  }
> = {
  1: {
    stage: '階段 1：環境與資料庫',
    stageIcon: '🏗️',
    featureInStep24: 'FinMind 付費授權 API 金鑰與 Colab Secrets 雙通道安全連線',
    techConcept: 'pip 安裝防呆、Gemini/FinMind Token 環境檢查',
  },
  2: {
    stage: '階段 1：環境與資料庫',
    stageIcon: '🏗️',
    featureInStep24: '台股全標的歷史行情引擎與週期選擇器 (1mo ~ 3y)',
    techConcept: 'yfinance / FinMind 日線下載與週期緩存',
  },
  3: {
    stage: '階段 1：環境與資料庫',
    stageIcon: '🏗️',
    featureInStep24: 'TWSE 台股除權息還原與 MultiIndex 欄位正規化清洗',
    techConcept: '自動清理欄位大小寫、adj close 覆寫與空值校正',
  },
  4: {
    stage: '階段 2：技術指標矩陣',
    stageIcon: '📊',
    featureInStep24: '4 層高解析度 SVG 畫布：K 線實體、上下影線與分價量能',
    techConcept: '動態 Y 軸價格比例尺、Candlestick 陰陽柱繪製',
  },
  5: {
    stage: '階段 2：技術指標矩陣',
    stageIcon: '📊',
    featureInStep24: 'MA5 / MA10 / MA20 / MA60 / MA120 / MA240 均線矩陣',
    techConcept: '多週期均線走勢、黃金交叉與死亡交叉多空判讀',
    metricTarget: 'MA5 / MA10 / MA20',
  },
  6: {
    stage: '階段 2：技術指標矩陣',
    stageIcon: '📊',
    featureInStep24: 'RSI(14) 相對強弱擺盪指標與 30 超賣 / 70 超買預警線',
    techConcept: 'EWMA 平滑漲跌幅、多方主控與過熱超買監控',
    metricTarget: 'RSI (14)',
  },
  7: {
    stage: '階段 2：技術指標矩陣',
    stageIcon: '📊',
    featureInStep24: 'MACD (快線 DIF / 慢線 DEM / 紅綠雙色柱狀體能量)',
    techConcept: 'EMA12 / EMA26 差離值、零軸動能加速與收斂',
    metricTarget: 'MACD (DIF / DEM / 柱狀體)',
  },
  8: {
    stage: '階段 2：技術指標矩陣',
    stageIcon: '📊',
    featureInStep24: '布林通道 (Bollinger Bands) 上中下軌與帶寬 (BB Width)',
    techConcept: '20MA ± 2倍標準差、喇叭開口爆發與收斂壓縮',
    metricTarget: '布林通道帶寬 (BB Width)',
  },
  9: {
    stage: '階段 3：籌碼與基本面',
    stageIcon: '🏦',
    featureInStep24: '季度營收年增率、毛利率成長性與落後指標回歸矩陣',
    techConcept: '財務損益表獲利能力與基本面長期趨勢對齊',
  },
  10: {
    stage: '階段 3：籌碼與基本面',
    stageIcon: '🏦',
    featureInStep24: '外資與投信單日買賣超、累積籌碼流向柱狀體',
    techConcept: '三大法人進出數據淨額累計、大戶主力籌碼鎖定',
    metricTarget: '外資單日買賣超 (張)',
  },
  11: {
    stage: '階段 3：籌碼與基本面',
    stageIcon: '🏦',
    featureInStep24: '散戶券資比 (Margin Ratio) 與融資融券籌碼混亂/安定區',
    techConcept: '融資餘額 90% 警示與 10% 安定區、軋空動能評估',
    metricTarget: '散戶券資比 (Margin Ratio)',
  },
  12: {
    stage: '階段 3：籌碼與基本面',
    stageIcon: '🏦',
    featureInStep24: 'ATR(14) 真實波動幅度與動態防守停損價位計算',
    techConcept: '真實波動區間 (TR)、浮動停損定價 (Close - 1.5*ATR)',
    metricTarget: 'ATR (14) 真實波幅',
  },
  13: {
    stage: '階段 3：籌碼與基本面',
    stageIcon: '🏦',
    featureInStep24: '多因子相關性熱力圖 (Heatmap) 與關鍵因子重要度排序',
    techConcept: 'Seaborn / Plotly 矩陣相關係數計算與共線性分析',
  },
  14: {
    stage: '階段 3：籌碼與基本面',
    stageIcon: '🏦',
    featureInStep24: '外資台指期淨未平倉 (TX Net OI) 與借券賣出避險警戒',
    techConcept: '衍生性商品領先籌碼、法人避險現貨變盤先行訊號',
  },
  15: {
    stage: '階段 4：AI 量化模型',
    stageIcon: '🤖',
    featureInStep24: '20日乖離率 (Bias 20) 與 1d/3d/5d 累積報酬特徵工程',
    techConcept: 'Shift(-1) 次日漲跌多空標籤 (Target: 0/1) 構建',
    metricTarget: '20日乖離率 (Bias 20)',
  },
  16: {
    stage: '階段 4：AI 量化模型',
    stageIcon: '🤖',
    featureInStep24: '隨機森林 (Random Forest) / XGBoost 預測模型訓練',
    techConcept: '時序無洗牌分割 (shuffle=False) 杜絕未來數據洩漏',
  },
  17: {
    stage: '階段 4：AI 量化模型',
    stageIcon: '🤖',
    featureInStep24: '20+ 種多因子複合特徵庫 (跨市場 ^SOX/^VIX + Lag 特徵)',
    techConcept: '美股費半與美債殖利率聯動、Feature Importance 分析',
  },
  18: {
    stage: '階段 4：AI 量化模型',
    stageIcon: '🤖',
    featureInStep24: '考慮 0.3% 手續費與滑價之向量化策略淨值回測曲線',
    techConcept: 'Pandas 純量化回測、買進持有 (B&H) 與 AI 策略績效對比',
  },
  19: {
    stage: '階段 5：部署與自動化',
    stageIcon: '⚡',
    featureInStep24: '物件導向 StockAnalyzer 自動化架構封裝',
    techConcept: '數據下載、特徵計算與模型預測一體化 Class 封裝',
  },
  20: {
    stage: '階段 5：部署與自動化',
    stageIcon: '⚡',
    featureInStep24: 'Gemini 3.5 / 3.7 Flash 實時多空盤勢深度診斷視窗',
    techConcept: 'Google GenAI SDK 智能 Prompt 注入、150字專業盤勢解讀',
  },
  21: {
    stage: '階段 5：部署與自動化',
    stageIcon: '⚡',
    featureInStep24: 'Gradio Blocks 多頁籤排版與自選股雷達批次掃描引擎',
    techConcept: 'gr.Blocks、gr.Tabs 與並發限制 concurrency_limit 保護',
  },
  22: {
    stage: '階段 5：部署與自動化',
    stageIcon: '⚡',
    featureInStep24: '自動建立 requirements.txt 依賴檔與一鍵下載',
    techConcept: 'Colab 自動生成 requirements.txt、files.download 瀏覽器下載與檔案面板導引',
  },
  23: {
    stage: '階段 5：部署與自動化',
    stageIcon: '⚡',
    featureInStep24: '分析程式碼重構為模組化 stock.py 與一鍵下載',
    techConcept: 'StockAnalyzer 類別重構、Gradio 介面封裝、Colab 自動生成 stock.py 與檔案下載',
  },
  24: {
    stage: '階段 5：部署與自動化',
    stageIcon: '⚡',
    featureInStep24: '🌐 Hugging Face Spaces 線上網站部署 (永久 Web App 網址)',
    techConcept: '免伺服器將 stock.py 與 requirements.txt 部署至 Hugging Face Space，取得專屬 Web App 網址',
  },
};

export const StepPipelineGuide: React.FC<StepPipelineGuideProps> = ({
  onOpenStepModal,
  onSelectMetricInSimulator,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');
  const [searchWord, setSearchWord] = useState<string>('');

  const stages = [
    { title: '全部', icon: '🌟' },
    { title: '階段 1：環境與資料庫', icon: '🏗️' },
    { title: '階段 2：技術指標矩陣', icon: '📊' },
    { title: '階段 3：籌碼與基本面', icon: '🏦' },
    { title: '階段 4：AI 量化模型', icon: '🤖' },
    { title: '階段 5：部署與自動化', icon: '⚡' },
  ];

  const filteredSteps = STEPS_DATA.filter((step) => {
    const mapping = STEP_FEATURE_MAPPING[step.id];
    const matchStage = selectedCategory === '全部' || mapping.stage === selectedCategory;
    const matchQuery =
      step.title.toLowerCase().includes(searchWord.toLowerCase()) ||
      mapping.featureInStep24.toLowerCase().includes(searchWord.toLowerCase()) ||
      mapping.techConcept.toLowerCase().includes(searchWord.toLowerCase()) ||
      `step ${step.id}`.includes(searchWord.toLowerCase());
    return matchStage && matchQuery;
  });

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-6">
      {/* 標題與說明 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs font-black px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              24 步驟技術鏈路全景圖
            </span>
            <span className="text-slate-400 text-xs font-mono">
              STEP 1 ~ STEP 24 完美呼應對照
            </span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <Layers className="w-7 h-7 text-indigo-400" />
            24 步提示卡 × 實機功能深度映射
          </h3>
          <p className="text-slate-400 text-xs sm:text-sm mt-1.5 leading-relaxed max-w-3xl">
            本「STEP 24 實機模擬儀表板」完整整合了前面 23
            個步驟所建構的資料清洗、均線通道、動能震盪、法人籌碼、AI 模型與自動化推播機制。點擊任一步驟即可直接調閱專屬詠唱詞與救援代碼！
          </p>
        </div>

        {/* 搜尋框 */}
        <div className="flex items-center gap-2 bg-slate-950 px-4 py-2 rounded-2xl border border-slate-800 min-w-[220px]">
          <input
            type="text"
            value={searchWord}
            onChange={(e) => setSearchWord(e.target.value)}
            placeholder="搜尋步驟、指標或概念..."
            className="bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none w-full"
          />
        </div>
      </div>

      {/* 階段分類標籤列 */}
      <div className="flex flex-wrap gap-2 pb-2">
        {stages.map((st) => (
          <button
            key={st.title}
            onClick={() => setSelectedCategory(st.title)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === st.title
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40 border border-blue-400'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white border border-slate-700'
            }`}
          >
            <span>{st.icon}</span>
            <span>{st.title}</span>
          </button>
        ))}
      </div>

      {/* 24 步驟卡片列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSteps.map((step) => {
          const mapping = STEP_FEATURE_MAPPING[step.id];
          const isCurrentStep24 = step.id === 24;

          return (
            <div
              key={step.id}
              className={`rounded-2xl p-5 border transition-all duration-200 flex flex-col justify-between group ${
                isCurrentStep24
                  ? 'bg-gradient-to-br from-indigo-950/80 via-slate-900 to-blue-950/80 border-indigo-500 shadow-lg shadow-indigo-950/50 ring-1 ring-indigo-400/40'
                  : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-800/60'
              }`}
            >
              <div>
                {/* 頂部徽章與步驟編號 */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-black px-2.5 py-1 rounded-lg ${
                        isCurrentStep24
                          ? 'bg-indigo-500 text-white'
                          : 'bg-slate-800 text-blue-400 border border-blue-500/30'
                      }`}
                    >
                      STEP {step.id}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {mapping.stageIcon} {step.category}
                    </span>
                  </div>

                  {step.hasRescue && (
                    <span className="text-[10px] font-bold bg-red-950/80 text-red-400 border border-red-800 px-1.5 py-0.5 rounded">
                      附救援碼
                    </span>
                  )}
                </div>

                {/* 步驟標題 */}
                <h4 className="font-extrabold text-base text-white group-hover:text-blue-300 transition-colors mb-2">
                  {step.title}
                </h4>

                {/* 實機對應功能 */}
                <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800/80 mb-3 space-y-1.5">
                  <div className="text-[11px] text-indigo-300 font-bold flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5 text-indigo-400" />
                    【實機儀表板對應模組】：
                  </div>
                  <p className="text-xs text-slate-300 font-medium leading-relaxed">
                    {mapping.featureInStep24}
                  </p>
                </div>

                {/* 量化技術核心觀念 */}
                <p className="text-slate-400 text-[11px] leading-relaxed mb-4">
                  💡 <span className="text-slate-300 font-semibold">核心技術：</span>
                  {mapping.techConcept}
                </p>
              </div>

              {/* 互動按鈕列 */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <button
                  onClick={() => onOpenStepModal?.(step.id)}
                  className="flex-1 bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/40 font-bold text-xs py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Code className="w-3.5 h-3.5" />
                  調閱詠唱詞
                </button>

                {mapping.metricTarget && onSelectMetricInSimulator && (
                  <button
                    onClick={() => onSelectMetricInSimulator(step.id)}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-bold py-2 px-3 rounded-xl transition-all flex items-center gap-1 cursor-pointer"
                    title="在實機中聚焦此指標"
                  >
                    <span>🎯</span>
                    <span>實機體驗</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
