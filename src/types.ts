export interface StepItem {
  id: number;
  category: string;
  title: string;
  desc: string;
  prompt: string;
  hasRescue?: boolean;
}

export type Category =
  | '全部步驟'
  | '環境與資料'
  | '技術分析'
  | '籌碼與基本面'
  | 'AI 量化模型'
  | '部署與自動化';

export interface AdvBlueprint {
  key: string;
  badge: string;
  badgeColor?: string;
  title: string;
  desc: string;
  advice?: string;
  code: string;
  url?: string;
  buttonText?: string;
}

export interface IndicatorRow {
  name: string;
  category: string;
  value: string;
  status: 'bullish' | 'bearish' | 'neutral';
  signal: string;
  stepNum: number;
  meaning: string;
}

export interface StockMetric {
  name: string;
  label: string;
  value: string;
  category: string;
  status: 'bullish' | 'bearish' | 'neutral';
  desc: string;
  stepLink: number;
}
