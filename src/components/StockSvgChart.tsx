import React, { useMemo, useState } from 'react';
import { ComputedStockPoint, formatTaiwanPrice } from '../services/finmind';
import { Layers } from 'lucide-react';

interface StockSvgChartProps {
  data: ComputedStockPoint[];
  ticker: string;
}

export const StockSvgChart: React.FC<StockSvgChartProps> = ({ data }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // 顯示最近 32 根 K 線
  const visibleData = useMemo(() => {
    return data.slice(-32);
  }, [data]);

  // 計算價格區間 (包含均線與布林通道以防溢出)
  const { minPrice, maxPrice, priceRange } = useMemo(() => {
    if (visibleData.length === 0) return { minPrice: 100, maxPrice: 200, priceRange: 100 };
    let min = Infinity;
    let max = -Infinity;

    visibleData.forEach((pt) => {
      min = Math.min(min, pt.low, pt.bbLower || pt.low, pt.ma60 || pt.low);
      max = Math.max(max, pt.high, pt.bbUpper || pt.high, pt.ma5 || pt.high);
    });

    const padding = (max - min) * 0.08 || 10;
    const finalMin = Math.max(0, min - padding);
    const finalMax = max + padding;
    return { minPrice: finalMin, maxPrice: finalMax, priceRange: finalMax - finalMin || 1 };
  }, [visibleData]);

  // 圖表尺寸設定
  const chartWidth = 800;
  const klineHeight = 160;
  const macdHeight = 55;
  const volumeHeight = 45;
  const paddingX = 20;

  const getX = (index: number) => {
    const usableWidth = chartWidth - paddingX * 2;
    const step = usableWidth / Math.max(1, visibleData.length - 1);
    return paddingX + index * step;
  };

  const getY = (price: number) => {
    return klineHeight - ((price - minPrice) / priceRange) * klineHeight;
  };

  // 生成均線路徑
  const ma5Points = visibleData.map((pt, i) => `${getX(i)},${getY(pt.ma5)}`).join(' ');
  const ma20Points = visibleData.map((pt, i) => `${getX(i)},${getY(pt.ma20)}`).join(' ');
  const ma60Points = visibleData.map((pt, i) => `${getX(i)},${getY(pt.ma60)}`).join(' ');

  // 生成布林通道填充帶
  const bbAreaPoints = useMemo(() => {
    if (visibleData.length === 0) return '';
    const upper = visibleData.map((pt, i) => `${getX(i)},${getY(pt.bbUpper)}`);
    const lower = visibleData.map((pt, i) => `${getX(i)},${getY(pt.bbLower)}`).reverse();
    return [...upper, ...lower].join(' ');
  }, [visibleData, minPrice, priceRange]);

  // MACD 最大振幅
  const maxMacd = useMemo(() => {
    let m = 1;
    visibleData.forEach(p => {
      m = Math.max(m, Math.abs(p.macdHist));
    });
    return m * 1.2;
  }, [visibleData]);

  // 最大成交量
  const maxVol = useMemo(() => {
    let v = 1000;
    visibleData.forEach(p => {
      v = Math.max(v, p.volume);
    });
    return v;
  }, [visibleData]);

  const activePoint = hoveredIdx !== null ? visibleData[hoveredIdx] : visibleData[visibleData.length - 1];

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-5 sm:p-6 border border-slate-800 shadow-xl space-y-4">
      {/* 標題與圖例 */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-400" />
          <h4 className="font-bold text-sm sm:text-base tracking-wide">
            4 層全景量化圖表 (K線均線通道 + MACD/RSI + 籌碼量能 + ATR波幅)
          </h4>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5 text-blue-400 font-mono font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> MA5: {formatTaiwanPrice(activePoint?.ma5 || 0)}
          </span>
          <span className="flex items-center gap-1.5 text-amber-400 font-mono font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> MA20: {formatTaiwanPrice(activePoint?.ma20 || 0)}
          </span>
          <span className="flex items-center gap-1.5 text-emerald-400 font-mono font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> MA60: {formatTaiwanPrice(activePoint?.ma60 || 0)}
          </span>
          <span className="flex items-center gap-1.5 text-slate-400 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-400/40 border border-indigo-400" /> 布林帶寬
          </span>
        </div>
      </div>

      {/* SVG 主畫布 */}
      <div className="relative w-full bg-slate-950/90 rounded-2xl p-2 sm:p-4 border border-slate-800 overflow-hidden select-none">
        <svg
          viewBox={`0 0 ${chartWidth} ${klineHeight + macdHeight + volumeHeight + 40}`}
          className="w-full h-auto overflow-visible"
        >
          <defs>
            <linearGradient id="bbGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.03" />
            </linearGradient>
          </defs>

          {/* 背景格線 */}
          {[0.2, 0.4, 0.6, 0.8].map((ratio, i) => (
            <line
              key={i}
              x1={paddingX}
              y1={klineHeight * ratio}
              x2={chartWidth - paddingX}
              y2={klineHeight * ratio}
              stroke="#1e293b"
              strokeDasharray="4 4"
              strokeWidth="1"
            />
          ))}

          {/* 布林通道區域 */}
          {bbAreaPoints && (
            <polygon points={bbAreaPoints} fill="url(#bbGradient)" />
          )}

          {/* 均線曲線 */}
          <polyline points={ma60Points} fill="none" stroke="#10b981" strokeWidth="1.5" strokeOpacity="0.85" />
          <polyline points={ma20Points} fill="none" stroke="#f59e0b" strokeWidth="1.8" strokeOpacity="0.9" />
          <polyline points={ma5Points} fill="none" stroke="#3b82f6" strokeWidth="2" />

          {/* K 線 (Candlesticks) */}
          {visibleData.map((pt, idx) => {
            const x = getX(idx);
            const isUp = pt.close >= pt.open;
            const yHigh = getY(pt.high);
            const yLow = getY(pt.low);
            const yOpen = getY(pt.open);
            const yClose = getY(pt.close);

            const candleTop = Math.min(yOpen, yClose);
            const candleHeight = Math.max(2.5, Math.abs(yClose - yOpen));
            const candleWidth = Math.max(6, (chartWidth / visibleData.length) * 0.55);

            return (
              <g
                key={idx}
                className="cursor-pointer transition-opacity hover:opacity-100"
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {/* 影線 (Wick) */}
                <line
                  x1={x}
                  y1={yHigh}
                  x2={x}
                  y2={yLow}
                  stroke={isUp ? '#ef4444' : '#10b981'}
                  strokeWidth="1.2"
                />
                {/* 實體 (Body) */}
                <rect
                  x={x - candleWidth / 2}
                  y={candleTop}
                  width={candleWidth}
                  height={candleHeight}
                  fill={isUp ? '#ef4444' : '#10b981'}
                  rx="1"
                />
              </g>
            );
          })}

          {/* 分隔線 1 */}
          <line
            x1={paddingX}
            y1={klineHeight + 5}
            x2={chartWidth - paddingX}
            y2={klineHeight + 5}
            stroke="#334155"
            strokeWidth="1"
          />

          {/* MACD 區塊 */}
          <text x={paddingX} y={klineHeight + 18} fill="#94a3b8" fontSize="10" fontFamily="monospace">
            [Row 2] MACD 柱狀體 & RSI(14): <tspan fill="#f59e0b">{activePoint?.rsi.toFixed(1)}</tspan>
          </text>

          {/* MACD 零軸 */}
          <line
            x1={paddingX}
            y1={klineHeight + 20 + macdHeight / 2}
            x2={chartWidth - paddingX}
            y2={klineHeight + 20 + macdHeight / 2}
            stroke="#1e293b"
            strokeWidth="1"
          />

          {visibleData.map((pt, idx) => {
            const x = getX(idx);
            const barW = Math.max(4, (chartWidth / visibleData.length) * 0.45);
            const zeroY = klineHeight + 20 + macdHeight / 2;
            const barH = (Math.abs(pt.macdHist) / maxMacd) * (macdHeight / 2 - 4);
            const barY = pt.macdHist >= 0 ? zeroY - barH : zeroY;

            return (
              <rect
                key={idx}
                x={x - barW / 2}
                y={barY}
                width={barW}
                height={Math.max(2, barH)}
                fill={pt.macdHist >= 0 ? '#ef4444' : '#10b981'}
                rx="1"
              />
            );
          })}

          {/* 分隔線 2 */}
          <line
            x1={paddingX}
            y1={klineHeight + macdHeight + 25}
            x2={chartWidth - paddingX}
            y2={klineHeight + macdHeight + 25}
            stroke="#334155"
            strokeWidth="1"
          />

          {/* 成交量與波幅區塊 */}
          <text x={paddingX} y={klineHeight + macdHeight + 38} fill="#94a3b8" fontSize="10" fontFamily="monospace">
            [Row 3 & 4] 外資累積籌碼 + ATR(14) 波動度: <tspan fill="#818cf8">{activePoint?.atr.toFixed(1)} 元</tspan>
          </text>

          {visibleData.map((pt, idx) => {
            const x = getX(idx);
            const barW = Math.max(4, (chartWidth / visibleData.length) * 0.45);
            const baseY = klineHeight + macdHeight + volumeHeight + 35;
            const barH = (pt.volume / maxVol) * (volumeHeight - 12);

            return (
              <rect
                key={idx}
                x={x - barW / 2}
                y={baseY - barH}
                width={barW}
                height={Math.max(2, barH)}
                fill="#6366f1"
                fillOpacity={pt.close >= pt.open ? '0.85' : '0.45'}
                rx="1"
              />
            );
          })}
        </svg>

        {/* 浮動指標資訊盒 */}
        {activePoint && (
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-300 gap-2 font-mono">
            <span className="text-slate-400">日期: <strong className="text-white">{activePoint.date}</strong></span>
            <span>開: <strong className="text-white">{formatTaiwanPrice(activePoint.open)}</strong></span>
            <span>高: <strong className="text-red-400">{formatTaiwanPrice(activePoint.high)}</strong></span>
            <span>低: <strong className="text-emerald-400">{formatTaiwanPrice(activePoint.low)}</strong></span>
            <span>收: <strong className={activePoint.spread >= 0 ? 'text-red-400' : 'text-emerald-400'}>{formatTaiwanPrice(activePoint.close)}</strong></span>
            <span>漲跌: <strong className={activePoint.spread >= 0 ? 'text-red-400' : 'text-emerald-400'}>
              {activePoint.spread >= 0 ? '+' : ''}{formatTaiwanPrice(activePoint.spread)}
            </strong></span>
            <span>量: <strong className="text-indigo-300">{activePoint.volume.toLocaleString()}</strong></span>
          </div>
        )}
      </div>
    </div>
  );
};
