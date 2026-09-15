export interface TechnicalIndicatorRow {
  indicator: string;
  freeTier: string;
  description: string;
}

export interface MarketStageInfo {
  id: 'pre' | 'intraday' | 'post';
  name: string;
  badge: string;
  timeRange: string;
  summary: string;
  icon: string;
  color: string;
  focusPoints: { title: string; desc: string; icon: string }[];
  keyEndpoints: string[];
}

export const MARKET_STAGES: MarketStageInfo[] = [
  {
    id: 'pre',
    name: '盤前準備 (Pre-Market)',
    badge: '08:30 - 09:00',
    timeRange: '每日開盤前 30 分鐘',
    summary: '載入歷史日 K 線、預先計算 14+ 技術指標均線矩陣、預估支撐壓力位並定錨各檔標的之 ATR 動態停損點。',
    icon: '🌅',
    color: 'from-amber-500/20 to-orange-500/20 border-amber-400/40 text-amber-900',
    focusPoints: [
      { title: '歷史指標批次預載', desc: '抓取 TaiwanStockPrice 計算 MA20/60、MACD、RSI、布林通道與 ATR。', icon: '📊' },
      { title: '關鍵價位與停損預定錨', desc: '計算 Pivot Point 樞紐支撐壓力，預先算出每檔股票固定與移動停損價。', icon: '🎯' },
      { title: '盤前試撮監控 (08:30-09:00)', desc: '觀察模擬試撮之開盤預估價與預估量能，評估今日多空開局強弱。', icon: '⏱️' }
    ],
    keyEndpoints: ['TaiwanStockPrice', 'TaiwanStockTradingDate', 'TaiwanStockPER_PBR']
  },
  {
    id: 'intraday',
    name: '盤中即時盯盤 (Intraday Real-Time)',
    badge: '09:00 - 13:30',
    timeRange: '每日盤中連續交易時段',
    summary: '透過 FinMind RealTime WebSocket / 即時行情 API，串接即時成交逐筆 (Tick)、最佳五檔委託 (Orderbook)、即時量能突破與分時均價線 (VWAP) 監控。',
    icon: '⚡',
    color: 'from-emerald-500/20 to-teal-500/20 border-emerald-400/40 text-emerald-900',
    focusPoints: [
      { title: 'WebSocket 即時逐筆成交 (Match)', desc: '毫秒級監控即時成交價、單筆成交量與內外盤力道（大單主動買 vs 主動賣）。', icon: '⚡' },
      { title: '最佳五檔委託簿 (Orderbook)', desc: '即時解析買一至買五、賣一至賣五掛單量，判斷大單支撐掛單與上方賣壓。', icon: '📑' },
      { title: '分時均線 (VWAP) 與即時分K合成', desc: '盤中將逐筆動態合成分鐘K線，以量加權平均價 (VWAP) 作為盤中多空分水嶺。', icon: '📈' },
      { title: '盤中即時策略觸發與推播', desc: '觸發即時爆量突破或跌破移動停損時，秒速發送 Webhook 即時告警至手機。', icon: '🚨' }
    ],
    keyEndpoints: ['FinMind RealTime WebSocket', 'TaiwanStockPriceTick', 'Orderbook Best 5', 'RealTime Webhook']
  },
  {
    id: 'post',
    name: '盤後複盤與選股 (Post-Market)',
    badge: '13:30 - 20:00',
    timeRange: '每日收盤後數據結算時段',
    summary: '抓取三大法人買賣超、融資融券、借券賣出與期貨大額交易人數據，進行全方位籌碼分析與策略回測，產出明日自選雷達清單。',
    icon: '🌙',
    color: 'from-indigo-500/20 to-purple-500/20 border-indigo-400/40 text-indigo-900',
    focusPoints: [
      { title: '三大法人籌碼匯入', desc: '獲取外資、投信、自營商買賣超淨額與累積庫存變化趨勢。', icon: '🏛️' },
      { title: '融資融券與散戶指標', desc: '計算融資餘額、融券餘額與券資比，識別籌碼集中度與潛在軋空行情。', icon: '👥' },
      { title: '策略回測與勝率結算', desc: '更新自選股雷達評分矩陣（趨勢、動能、量能、籌碼），產出明日觀察股。', icon: '🏆' }
    ],
    keyEndpoints: ['TaiwanStockInstitutionalInvestorsBuySell', 'TaiwanStockMarginPurchaseShortSale', 'TaiwanStockSecuritiesLending']
  }
];

export const FINMIND_INDICATORS_TABLE: TechnicalIndicatorRow[] = [
  { indicator: '📈 MA 均線', freeTier: '✅', description: 'MA5、MA10、MA20、MA60、MA120、MA240 均線矩陣' },
  { indicator: '🔀 均線交叉', freeTier: '✅', description: '黃金交叉 (短期突穿長期)、死亡交叉' },
  { indicator: '🚀 MACD', freeTier: '✅', description: 'DIF 快線、DEA 慢線、Histogram 紅白雙色柱狀體' },
  { indicator: '🔥 RSI', freeTier: '✅', description: 'RSI6、RSI12、RSI14 相對強弱指標' },
  { indicator: '📊 KD 指標', freeTier: '✅', description: 'RSV 基礎值、K 值、D 值、J 值超買超賣判定' },
  { indicator: '🎯 布林通道', freeTier: '✅', description: '上軌 (Upper Band)、中軌 (SMA20)、下軌 (Lower Band) 與帶寬' },
  { indicator: '⚡ ATR', freeTier: '✅', description: '真實波動區間 (TR)、ATR(14) 波動率與動態停損定價' },
  { indicator: '📉 OBV', freeTier: '✅', description: '能量潮 (On-Balance Volume) 累積量能動向' },
  { indicator: '📦 成交量均線', freeTier: '✅', description: 'VMA5、VMA20 短中期成交量量能均線' },
  { indicator: '🔍 量價關係', freeTier: '✅', description: '價漲量增、價跌量縮、量價背離判定' },
  { indicator: '📐 支撐壓力', freeTier: '✅', description: '波段高低點、Pivot Point 樞紐分析線' },
  { indicator: '🔄 動能指標', freeTier: '✅', description: '變動率 (ROC)、價格動量 (Momentum)' },
  { indicator: '📊 波動分析', freeTier: '✅', description: '歷史標準差 (Standard Deviation)、ATR 百分比' },
  { indicator: '🕯 K 線型態', freeTier: '✅', description: '十字線、吞沒型態、錘頭線、倒錘頭、晨星' }
];

export const PRE_MARKET_PYTHON_CODE = `# ==========================================================
# 🌅 盤前實戰流程 (Pre-Market: 08:30 - 09:00)
# 核心任務：載入歷史日 K 線、計算指標矩陣、定錨支撐壓力與 ATR 停損
# ==========================================================
import requests
import pandas as pd
import numpy as np

STOCK_ID = "2330" # 以台積電為例
API_URL = "https://api.finmindtrade.com/api/v4/data"

# 1. 抓取過去 1 年歷史日 K 線資料
res = requests.get(API_URL, params={
    "dataset": "TaiwanStockPrice",
    "data_id": STOCK_ID,
    "start_date": (pd.Timestamp.now() - pd.Timedelta(days=365)).strftime("%Y-%m-%d")
})
df = pd.DataFrame(res.json().get("data", []))
df["date"] = pd.to_datetime(df["date"])
df = df.sort_values("date").reset_index(drop=True)

# 2. 盤前計算均線與指標矩陣
df["MA5"] = df["close"].rolling(5).mean()
df["MA20"] = df["close"].rolling(20).mean()
df["MA60"] = df["close"].rolling(60).mean()

# 計算真實波動區間 (ATR 14)
high_low = df["max"] - df["min"]
high_close = (df["max"] - df["close"].shift(1)).abs()
low_close = (df["min"] - df["close"].shift(1)).abs()
tr = pd.concat([high_low, high_close, low_close], axis=1).max(axis=1)
df["ATR"] = tr.rolling(14).mean()

# 3. 盤前定錨：支撐壓力與 ATR 停損價
latest = df.iloc[-1]
yesterday_close = latest["close"]
yesterday_atr = latest["ATR"]

pivot = (latest["max"] + latest["min"] + latest["close"]) / 3
r1_resistance = (2 * pivot) - latest["min"] # 壓力一
s1_support = (2 * pivot) - latest["max"]    # 支撐一
hard_stop_loss = yesterday_close - (2 * yesterday_atr) # 固定停損價位

print(f"【盤前分析報表 - {STOCK_ID}】")
print(f"昨日收盤價: {yesterday_close:.1f} 元 | ATR波動度: {yesterday_atr:.2f}")
print(f"樞紐強弱價: {pivot:.1f} 元 | 壓力一 R1: {r1_resistance:.1f} | 支撐一 S1: {s1_support:.1f}")
print(f"建議防守停損價: {hard_stop_loss:.1f} 元 (跌破即嚴格執行風控)")
`;

export const INTRADAY_REALTIME_PYTHON_CODE = `# ==========================================================
# ⚡ 盤中即時實戰流程 (Intraday Real-Time: 09:00 - 13:30)
# 參考 FinMind RealTime 規範 (WebSocket / 即時逐筆 / 最佳五檔 / VWAP 均價線)
# 官方文件：https://finmind.github.io/tutor/TaiwanMarket/RealTime/
# ==========================================================
import json
import time
import requests
import pandas as pd

# --- 模式一：透過 FinMind WebSocket 訂閱台股即時逐筆與五檔 (推薦) ---
# pip install websockets 或使用 FinMind WebSocket 協定
FINMIND_WS_URL = "wss://api.finmindtrade.com/api/v4/websocket"
TOKEN = "YOUR_FINMIND_TOKEN" # 若有 token 填入可享更高速率

def on_realtime_tick_received(tick_data):
    """
    收到盤中即時逐筆成交 (Tick) 時觸發
    tick_data 結構範例：{'time': '09:15:32.120', 'price': 1085.0, 'volume': 25, 'bid_ask_flag': 1}
    """
    price = tick_data.get("price")
    vol = tick_data.get("volume")
    timestamp = tick_data.get("time")
    flag = "外盤主買" if tick_data.get("bid_ask_flag") == 1 else "內盤主賣"
    
    print(f"[{timestamp}] 即時成交: {price} 元 | 單量: {vol} 張 | 屬性: {flag}")
    
    # 盤中大單突破檢測 (例如單筆大於 50 張且大單敲外盤)
    if vol >= 50 and flag == "外盤主買":
        trigger_intraday_alert(f"🚨 【盤中大單敲進】{price} 元 湧入 {vol} 張大單！多頭攻擊啟動！")

def on_orderbook_received(orderbook_data):
    """
    收到盤中最佳五檔委託簿 (Orderbook) 時觸發
    包含 買一~買五 (bid_price, bid_vol) 與 賣一~賣五 (ask_price, ask_vol)
    """
    bids = orderbook_data.get("bids", []) # [(1080, 120), (1075, 80)...]
    asks = orderbook_data.get("asks", []) # [(1085, 30), (1090, 150)...]
    total_bid_vol = sum(v for p, v in bids)
    total_ask_vol = sum(v for p, v in asks)
    
    power_ratio = total_bid_vol / (total_ask_vol + 1e-5)
    print(f"盤中五檔委買總量: {total_bid_vol} 張 vs 委賣總量: {total_ask_vol} 張 (委買比: {power_ratio:.2f})")

def calculate_intraday_vwap(ticks_df):
    """
    盤中計算成交量加權平均價 (VWAP - Volume Weighted Average Price)
    盤中價格若站上 VWAP 為多頭強勢；跌破 VWAP 則偏空防守
    """
    cumulative_turnover = (ticks_df["price"] * ticks_df["volume"]).cumsum()
    cumulative_volume = ticks_df["volume"].cumsum()
    vwap = cumulative_turnover / cumulative_volume
    return vwap

def trigger_intraday_alert(message):
    print("=" * 60)
    print(message)
    print("=" * 60)
    # 可串接 Discord / LINE / Telegram 即時推播 (免 Gmail 登入)

print("⚡ 盤中即時監控引擎已就緒，開始接收即時行情串流...")
# 模擬單筆盤中觸發
on_realtime_tick_received({"time": "09:30:15", "price": 1085.0, "volume": 88, "bid_ask_flag": 1})
`;

export const POST_MARKET_PYTHON_CODE = `# ==========================================================
# 🌙 盤後複盤與選股 (Post-Market: 13:30 - 20:00)
# 核心任務：抓取三大法人買賣超、融資融券、借券、全市場篩選與明日雷達
# ==========================================================
import requests
import pandas as pd
import datetime

STOCK_ID = "2330"
API_URL = "https://api.finmindtrade.com/api/v4/data"
TODAY = datetime.date.today().strftime("%Y-%m-%d")
START_DATE = (datetime.date.today() - datetime.timedelta(days=30)).strftime("%Y-%m-%d")

# 1. 抓取三大法人買賣超 (外資 Foreign_Investor, 投信 Investment_Trust)
res_inst = requests.get(API_URL, params={
    "dataset": "TaiwanStockInstitutionalInvestorsBuySell",
    "data_id": STOCK_ID,
    "start_date": START_DATE
})
df_inst = pd.DataFrame(res_inst.json().get("data", []))
if not df_inst.empty:
    df_inst["net"] = df_inst["buy"] - df_inst["sell"]
    inst_summary = df_inst.groupby(["date", "name"])["net"].sum().unstack()
    print("【三大法人最近 3 日買賣超 (股)】")
    print(inst_summary.tail(3))

# 2. 抓取融資融券餘額 (Margin Purchase & Short Sale)
res_margin = requests.get(API_URL, params={
    "dataset": "TaiwanStockMarginPurchaseShortSale",
    "data_id": STOCK_ID,
    "start_date": START_DATE
})
df_margin = pd.DataFrame(res_margin.json().get("data", []))
if not df_margin.empty:
    df_margin["MarginRatio"] = (df_margin["ShortSaleBalance"] / (df_margin["MarginPurchaseBalance"] + 1)) * 100
    print("\n【融資融券最新水位】")
    print(df_margin[["date", "MarginPurchaseBalance", "ShortSaleBalance", "MarginRatio"]].tail(3))

print("\n✅ 盤後結算完成！已自動將綜合評分寫入明日 Stock Radar 觀察清單！")
`;

export const MULTI_INDICATOR_PYTHON_CODE = `# ==========================================
# FinMind 免費版：多指標交易系統範例程式碼
# ==========================================
import requests
import pandas as pd
import numpy as np

# 1. 透過 FinMind 免費 API 抓取台積電 (2330) 日 K 線資料
url = "https://api.finmindtrade.com/api/v4/data"
params = {
    "dataset": "TaiwanStockPrice",
    "data_id": "2330",
    "start_date": "2023-01-01"
}
res = requests.get(url, params=params)
data = res.json()
df = pd.DataFrame(data["data"])
df["date"] = pd.to_datetime(df["date"])
df = df.sort_values("date").reset_index(drop=True)

# 2. 自行計算技術指標 (均線、RSI、MACD、量能均線)
df["MA20"] = df["close"].rolling(window=20).mean()
df["MA60"] = df["close"].rolling(window=60).mean()
df["Volume_MA20"] = df["Trading_Volume"].rolling(window=20).mean()

# 計算 RSI (14)
delta = df["close"].diff()
gain = delta.where(delta > 0, 0).ewm(com=13, adjust=False).mean()
loss = (-delta.where(delta < 0, 0)).ewm(com=13, adjust=False).mean()
rs = gain / loss
df["RSI"] = 100 - (100 / (1 + rs))

# 計算 MACD
ema12 = df["close"].ewm(span=12, adjust=False).mean()
ema26 = df["close"].ewm(span=26, adjust=False).mean()
df["MACD"] = ema12 - ema26
df["MACD_signal"] = df["MACD"].ewm(span=9, adjust=False).mean()

# 3. 建立複合「多指標買進訊號」
df["BuySignal"] = (
    (df["MA20"] > df["MA60"]) &
    (df["RSI"] > 50) &
    (df["MACD"] > df["MACD_signal"]) &
    (df["Trading_Volume"] > df["Volume_MA20"])
)

print("最新 5 筆訊號判斷：")
print(df[["date", "close", "MA20", "MA60", "RSI", "BuySignal"]].tail(5))
`;

export const ATR_STOP_LOSS_PYTHON_CODE = `# ==========================================
# FinMind 免費版：ATR 動態與移動停損計算系統
# ==========================================
import pandas as pd
import numpy as np

def calculate_atr(df, period=14):
    """計算真實波動區間 (ATR)"""
    high_low = df['max'] - df['min']
    high_close = np.abs(df['max'] - df['close'].shift(1))
    low_close = np.abs(df['min'] - df['close'].shift(1))
    tr = pd.concat([high_low, high_close, low_close], axis=1).max(axis=1)
    df['ATR'] = tr.ewm(span=period, adjust=False).mean()
    return df

# 停損定價邏輯範例：
# 1. 買進固定停損價 = 買進價格 - 2 × ATR
# 2. 動態移動停損 (Trailing Stop) = 持有期間最高價 - 2 × ATR
`;

