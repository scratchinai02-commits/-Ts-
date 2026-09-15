import React, { useState } from 'react';
import {
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  Code2,
  TrendingUp,
  ShieldAlert,
  BarChart2,
  Layers,
  Sparkles,
  Zap,
  BookOpen,
  ArrowRight,
  Database,
  Radio,
  Clock,
  Activity,
  Sliders,
  Cpu
} from 'lucide-react';
import {
  MARKET_STAGES,
  FINMIND_INDICATORS_TABLE,
  PRE_MARKET_PYTHON_CODE,
  INTRADAY_REALTIME_PYTHON_CODE,
  POST_MARKET_PYTHON_CODE,
  MULTI_INDICATOR_PYTHON_CODE,
  ATR_STOP_LOSS_PYTHON_CODE
} from '../data/finmindGuideData';

interface FinMindGuideSectionProps {
  onCopyText?: (text: string, title?: string) => void;
}

export const FinMindGuideSection: React.FC<FinMindGuideSectionProps> = ({ onCopyText }) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeStage, setActiveStage] = useState<'pre' | 'intraday' | 'post'>('intraday');

  const handleCopy = (code: string, label: string) => {
    if (onCopyText) {
      onCopyText(code, label);
    } else {
      navigator.clipboard.writeText(code);
    }
    setCopiedCode(label);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const currentStageInfo = MARKET_STAGES.find((s) => s.id === activeStage) || MARKET_STAGES[1];

  const getStageCode = (id: 'pre' | 'intraday' | 'post') => {
    switch (id) {
      case 'pre':
        return PRE_MARKET_PYTHON_CODE;
      case 'intraday':
        return INTRADAY_REALTIME_PYTHON_CODE;
      case 'post':
        return POST_MARKET_PYTHON_CODE;
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-8 bg-slate-50/50 text-slate-800">
      {/* 頂部 Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 rounded-3xl p-6 sm:p-8 text-white border border-indigo-500/30 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-4xl space-y-3">
          <div className="inline-flex items-center gap-2 bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-bold px-3 py-1 rounded-full">
            <Database className="w-3.5 h-3.5" />
            <span>台股量化標準作戰藍圖</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            盤前盤中盤後實戰流程範本（FinMind 技術分析攻略）
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            透過 FinMind 官方開放資料與即時行情規範，以 Python 貫穿每日 <strong className="text-amber-400 font-bold">「盤前準備 ➔ 盤中即時 ➔ 盤後複盤」</strong> 三階段完整作戰流程。從盤前均線與 ATR 停損定錨、盤中 WebSocket 逐筆與五檔委託監控，到盤後三大法人籌碼結算，打造全天候自動化量化盯盤系統！
          </p>
        </div>
      </div>

      {/* ★ 核心重點：盤前 ➔ 盤中 ➔ 盤後 三大階段實戰流程導引 */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-black text-base shadow-sm">
              ★
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-slate-900">
                台股【盤前、盤中、盤後】全日作戰流程範本
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                切換時段檢視核心任務、關鍵資料集與對應的 Python 自動化實戰代碼
              </p>
            </div>
          </div>

          {/* 時段切換按鈕 */}
          <div className="flex items-center p-1 bg-slate-100 rounded-2xl border border-slate-200 self-start sm:self-auto">
            {MARKET_STAGES.map((stage) => (
              <button
                key={stage.id}
                onClick={() => setActiveStage(stage.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  activeStage === stage.id
                    ? 'bg-white text-indigo-700 shadow-sm border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>{stage.icon}</span>
                <span>{stage.id === 'pre' ? '盤前' : stage.id === 'intraday' ? '盤中即時' : '盤後'}</span>
                <span className="text-[10px] opacity-75 font-mono">({stage.badge})</span>
              </button>
            ))}
          </div>
        </div>

        {/* 階段詳情卡片 */}
        <div className="bg-slate-50/80 rounded-2xl p-5 sm:p-6 border border-slate-200 space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{currentStageInfo.icon}</span>
                <h4 className="text-lg font-black text-slate-900">{currentStageInfo.name}</h4>
                <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-indigo-200">
                  {currentStageInfo.badge}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {currentStageInfo.summary}
              </p>
            </div>

            {activeStage === 'intraday' && (
              <a
                href="https://finmind.github.io/tutor/TaiwanMarket/RealTime/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all shrink-0 self-start md:self-auto"
              >
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                <span>FinMind 即時行情 (RealTime) 官方文檔</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          {/* 重點任務清單 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {currentStageInfo.focusPoints.map((item, idx) => (
              <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs space-y-1.5">
                <div className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5">
                  <span>{item.icon}</span>
                  <span>{item.title}</span>
                </div>
                <p className="text-slate-500 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* 常用資料集標籤 */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="font-bold text-slate-500 flex items-center gap-1">
              <Database className="w-3.5 h-3.5" />
              <span>關鍵資料接口：</span>
            </span>
            {currentStageInfo.keyEndpoints.map((ep, idx) => (
              <code key={idx} className="bg-slate-200/70 text-slate-800 font-mono px-2 py-0.5 rounded text-[11px]">
                {ep}
              </code>
            ))}
          </div>

          {/* Python 程式碼展示與複製 */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                <Code2 className="w-4 h-4 text-indigo-600" />
                <span>{currentStageInfo.name} — Python 範例程式碼</span>
              </div>
              <button
                onClick={() => handleCopy(getStageCode(activeStage), `${currentStageInfo.name} 程式碼`)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-2xs cursor-pointer"
              >
                {copiedCode === `${currentStageInfo.name} 程式碼` ? (
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span>
                  {copiedCode === `${currentStageInfo.name} 程式碼` ? '已複製到剪貼簿' : '複製此階段 Python 程式碼'}
                </span>
              </button>
            </div>

            <div className="bg-slate-950 rounded-2xl p-4 sm:p-5 border border-slate-800 overflow-x-auto text-xs font-mono text-slate-300 max-h-96">
              <pre>{getStageCode(activeStage)}</pre>
            </div>
          </div>
        </div>
      </div>

      {/* 一、最核心：個股 OHLCV 技術分析 */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
            1
          </div>
          <h3 className="text-xl font-bold text-slate-900">
            一、最核心：個股 OHLCV 技術分析
          </h3>
        </div>
        <p className="text-slate-600 text-sm leading-relaxed">
          透過 FinMind 免費的 <code className="bg-slate-100 px-2 py-0.5 rounded text-indigo-600 font-mono text-xs">TaiwanStockPrice</code> 資料集，對單一股票代號可直接免費查詢以下完整價格維度，已足以自行計算絕大多數常見技術指標：
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {[
            { name: '開盤價 (Open)', desc: '開盤多空開局價' },
            { name: '最高價 (High)', desc: '當日多頭最高攻防' },
            { name: '最低價 (Low)', desc: '當日空頭下殺低點' },
            { name: '收盤價 (Close)', desc: '結算基準關鍵價' },
            { name: '成交量 (Volume)', desc: '當日總成交股數' },
            { name: '成交金額', desc: '實質資金流向總值' },
            { name: '漲跌 (Spread)', desc: '與前一日收盤差額' },
            { name: '交易週轉資訊', desc: '市場熱度與換手' }
          ].map((item, idx) => (
            <div key={idx} className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-1">
              <div className="font-bold text-slate-800 text-xs sm:text-sm flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{item.name}</span>
              </div>
              <p className="text-slate-500 text-xs">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 二、可以自行完成的技術指標 + 關鍵觀念 */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
            2
          </div>
          <h3 className="text-xl font-bold text-slate-900">
            二、可以自行完成的技術指標清單
          </h3>
        </div>

        {/* 關鍵觀念 Flowchart */}
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-2xl p-5 text-white border border-indigo-800/40 space-y-3">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>核心關鍵觀念 (The Fundamental Flow)</span>
          </div>
          <p className="text-slate-300 text-xs sm:text-sm">
            FinMind 免費版不是直接提供 MACD、RSI、KD 算好的數值，而是提供基礎價格量能，讓您能以 Python 自由打造專屬的量化公式：
          </p>
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-xs font-mono">
            <span className="bg-slate-800 px-3 py-2 rounded-xl border border-slate-700">價格 + 成交量 (OHLCV)</span>
            <ArrowRight className="w-4 h-4 text-slate-500 hidden sm:inline" />
            <span className="bg-indigo-900/80 px-3 py-2 rounded-xl border border-indigo-700 text-indigo-200">Python pandas 計算</span>
            <ArrowRight className="w-4 h-4 text-slate-500 hidden sm:inline" />
            <span className="bg-blue-900/80 px-3 py-2 rounded-xl border border-blue-700 text-blue-200">自行計算技術指標</span>
            <ArrowRight className="w-4 h-4 text-slate-500 hidden sm:inline" />
            <span className="bg-emerald-900/80 px-3 py-2 rounded-xl border border-emerald-700 text-emerald-200">建立交易訊號</span>
            <ArrowRight className="w-4 h-4 text-slate-500 hidden sm:inline" />
            <span className="bg-amber-900/80 px-3 py-2 rounded-xl border border-amber-700 text-amber-200">視覺化 + 回測</span>
          </div>
        </div>

        {/* 指標對照表格 */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-100/80 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">技術分析維度</th>
                <th className="py-3 px-3 text-center">免費版支援</th>
                <th className="py-3 px-4">說明與指標細節</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {FINMIND_INDICATORS_TABLE.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-800 whitespace-nowrap">{row.indicator}</td>
                  <td className="py-3 px-3 text-center">
                    <span className="inline-block bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full text-xs">
                      {row.freeTier} 可行
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600 leading-relaxed">{row.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 三、多指標交易系統 */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
              3
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              三、還可以做「多指標交易系統」
            </h3>
          </div>
          <button
            onClick={() => handleCopy(MULTI_INDICATOR_PYTHON_CODE, '多指標交易系統')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold transition-all cursor-pointer"
          >
            {copiedCode === '多指標交易系統' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedCode === '多指標交易系統' ? '已複製 Python 程式碼' : '複製完整 Python 範例'}</span>
          </button>
        </div>

        <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4 text-xs sm:text-sm text-emerald-950 space-y-1.5">
          <div className="font-bold text-emerald-900 flex items-center gap-1.5">
            <span>🟢</span>
            <span>經典複合買進訊號 (Buy Signal)：</span>
          </div>
          <p className="font-mono text-xs text-emerald-800 pl-5 leading-relaxed">
            MA20 向上突破 MA60 + RSI &gt; 50 + MACD DIF &gt; DEA + 成交量 &gt; 20日平均成交量
          </p>
        </div>

        <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 overflow-x-auto text-xs font-mono text-slate-300">
          <pre>{`df["BuySignal"] = (
    (df["MA20"] > df["MA60"]) &
    (df["RSI"] > 50) &
    (df["MACD"] > df["MACD_signal"]) &
    (df["Volume"] > df["Volume_MA20"])
)`}</pre>
        </div>
      </div>

      {/* 四、ATR 動態停損系統 */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
              4
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              四、ATR 動態停損也完全可以
            </h3>
          </div>
          <button
            onClick={() => handleCopy(ATR_STOP_LOSS_PYTHON_CODE, 'ATR 停損計算')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold transition-all cursor-pointer"
          >
            {copiedCode === 'ATR 停損計算' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedCode === 'ATR 停損計算' ? '已複製 Python 程式碼' : '複製 ATR 停損程式碼'}</span>
          </button>
        </div>

        <p className="text-slate-600 text-sm leading-relaxed">
          FinMind 免費日 K 資料（包含最高 High、最低 Low 與收盤 Close）已完全足夠計算真實波動幅度 (ATR)，並支援多種量化停損策略：
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
            <div className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-500" />
              <span>進場固定波動停損</span>
            </div>
            <div className="bg-white p-2.5 rounded-xl border border-slate-200 font-mono text-xs text-indigo-700">
              停損價 = 買進價格 - (2 × ATR)
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
            <div className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-500" />
              <span>動態移動停損 (Trailing Stop)</span>
            </div>
            <div className="bg-white p-2.5 rounded-xl border border-slate-200 font-mono text-xs text-indigo-700">
              Trailing Stop = 持有期間最高價 - (2 × ATR)
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          {['固定百分比停損', 'ATR 波動停損', '移動停損 (Trailing)', '波動率停損', '支撐位跌破停損'].map((tag, i) => (
            <span key={i} className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-medium border border-slate-200">
              ✓ {tag}
            </span>
          ))}
        </div>
      </div>

      {/* 五、成交量與量價分析 */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
            5
          </div>
          <h3 className="text-xl font-bold text-slate-900">
            五、成交量與量價分析
          </h3>
        </div>

        <p className="text-slate-600 text-sm leading-relaxed">
          免費資料可以直接透過 TaiwanStockPrice 的價格與成交量欄位進行三大量價型態判定：
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200 space-y-2">
            <div className="font-bold text-amber-900 text-sm flex items-center gap-1.5">
              <span>1️⃣</span>
              <span>量價背離</span>
            </div>
            <p className="text-xs text-amber-800 leading-relaxed">
              股價創新高，但成交量未同步放大，暗示動能減弱、主力高檔出貨警戒。
            </p>
          </div>

          <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200 space-y-2">
            <div className="font-bold text-emerald-900 text-sm flex items-center gap-1.5">
              <span>2️⃣</span>
              <span>爆量突破</span>
            </div>
            <p className="text-xs text-emerald-800 leading-relaxed">
              成交量 &gt; MA20 × 2 且收盤價突破前期壓力平台，確立攻擊起漲訊號。
            </p>
          </div>

          <div className="bg-blue-50/60 p-4 rounded-2xl border border-blue-200 space-y-2">
            <div className="font-bold text-blue-900 text-sm flex items-center gap-1.5">
              <span>3️⃣</span>
              <span>量縮整理</span>
            </div>
            <p className="text-xs text-blue-800 leading-relaxed">
              價格在特定區間箱型盤整，成交量逐日遞減，沉澱籌碼等待方向表態。
            </p>
          </div>
        </div>
      </div>

      {/* 六、完整技術分析儀表板架構 */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
            6
          </div>
          <h3 className="text-xl font-bold text-slate-900">
            六、完整技術分析儀表板架構 (Stock Radar Architecture)
          </h3>
        </div>

        <p className="text-slate-600 text-sm leading-relaxed">
          建議的最佳系統架構（本實機模擬儀表板即以此標準量化流程實作）：
        </p>

        <div className="bg-slate-950 rounded-2xl p-5 text-slate-200 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
          <pre>{`                 FinMind 免費 API
                        │
                        ▼
                 台股歷史資料
                        │
          ┌─────────────┼─────────────┐
          ▼             ▼             ▼
        均線          動能指標       波動分析
       MA/EMA       RSI/MACD/KD       ATR
          │             │             │
          └─────────────┼─────────────┘
                        ▼
                   訊號評分系統
                        │
          ┌─────────────┼─────────────┐
          ▼             ▼             ▼
        趨勢分數       動能分數       量能分數
                        │
                        ▼
                  Stock Radar
                        │
                        ▼
              🟢 買進 / 🟡 觀察 / 🔴 風險`}</pre>
        </div>
      </div>

      {/* 七、免費版還能搭配哪些資料？ */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
            7
          </div>
          <h3 className="text-xl font-bold text-slate-900">
            七、免費版還能搭配哪些進階資料？
          </h3>
        </div>

        <p className="text-slate-600 text-sm leading-relaxed">
          除了最核心的日價格資料外，FinMind 免費層還提供多個可與技術分析相結合的實用資料集：
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-1">
          {[
            '📅 台股交易日曆 (TaiwanStockTradingDate)',
            '📊 個股 PER、PBR、殖利率 (TaiwanStockPER_PBR)',
            '⚡ 當沖交易資料 (TaiwanStockDayTrading)',
            '📈 台股總報酬指數 (TaiwanStockPriceTick)',
            '💎 還原股價 (TaiwanStockPriceAdj)',
            '📰 個股新聞 (TaiwanStockNews)',
            '⏱️ 每 5 秒委託／成交統計與加權指數'
          ].map((item, idx) => (
            <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs font-semibold text-slate-700">
              {item}
            </div>
          ))}
        </div>
        <p className="text-slate-400 text-xs pt-1">
          * 註：分鐘 K、歷史逐筆成交資料、十年線等更高頻資料需要更高階方案，但日線與波段交易完全使用免費版即可勝任！
        </p>
      </div>

      {/* 總結與官方文檔連結 */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-blue-500/30 shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-amber-300 text-xs font-bold">
          <span>🌟</span>
          <span>總結與下一步行動</span>
        </div>
        <h4 className="text-xl font-black text-white">
          如果您的目標是「日線技術分析 ＋ 盤中即時監控 ＋ Python 自動化」—— FinMind 非常夠用！
        </h4>
        <p className="text-slate-200 text-xs sm:text-sm leading-relaxed max-w-3xl">
          您可以順暢完成：<span className="text-amber-300 font-bold">盤前指標預載 ➔ 盤中 WebSocket 逐筆/五檔委託即時監控 ➔ 盤後三大法人籌碼結算 ➔ 多指標買賣訊號 ➔ 回測 ➔ 視覺化</span>。<br />
          直接將 FinMind 作為台股數據源，用 Python 打造專屬的 <strong className="text-white">AI Stock Radar（趨勢分析 × 即時行情 × 量價分析 × ATR 風險控制 × 自動買賣訊號）</strong>！
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <a
            href="https://finmind.github.io/tutor/TaiwanMarket/RealTime/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-md transition-all cursor-pointer"
          >
            <Radio className="w-3.5 h-3.5 text-slate-950" />
            <span>FinMind 盤中即時行情 (RealTime) 官方指南</span>
            <ExternalLink className="w-3 h-3 text-slate-900" />
          </a>
          <a
            href="https://finmind.github.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs shadow-md transition-all"
          >
            <BookOpen className="w-3.5 h-3.5 text-blue-600" />
            <span>FinMind 官方快速開始文件</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
          <a
            href="https://finmindtrade.com/analysis/#/data/api"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600/80 hover:bg-indigo-600 text-white font-bold text-xs border border-indigo-400/40 transition-all"
          >
            <Database className="w-3.5 h-3.5" />
            <span>FinMind API 完整文件</span>
            <ExternalLink className="w-3 h-3 text-slate-300" />
          </a>
        </div>
      </div>
    </div>
  );
};

