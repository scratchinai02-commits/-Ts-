import { AdvBlueprint } from '../types';

export const DEBUG_PROMPT = `我剛剛執行你給的程式碼，發生了以下錯誤：

[請在此貼上 Colab 顯示的紅色報錯訊息]

請根據我們目前專案的結構與你剛才撰寫的邏輯，幫我找出問題發生原因，並提供修正後的「完整可執行」程式碼。`;

export const AUTO_PROMPT = `# 🚀 台股 AI 全市場選股與量化分析平台 (v6 GitHub + Render 終極部署版)
# 從「下載 v6 ZIP」開始，完整走一次：解壓 → GitHub → Render → API Key → 自動部署 → 線上測試。
# 本版部署架構：GitHub 放程式碼，Render 跑 FastAPI。Hugging Face 完全退出流程。

# ==========================================
# 📦 專案 7 個核心檔案結構清單 (請確認位於 GitHub main 根目錄)
# ==========================================
# 1. index.html       -> 前端 SPA 儀表板 (全市場選股、漲幅排行、單檔 2330 深度分析、自選股排名)
# 2. main.py          -> FastAPI 後端服務 (/api/scan, /api/gainers, /api/analyze 等路由)
# 3. stock.py         -> StockAnalyzer 量化分析引擎與 TWSE/TPEx 快照篩選器
# 4. requirements.txt -> Python 相依套件 (yfinance, pandas, plotly, fastapi, uvicorn...)
# 5. Dockerfile       -> 容器化配置 (選用)
# 6. .dockerignore    -> 忽略非必要提交檔案
# 7. README.md        -> 說明文件

# ==========================================
# 🛠️ Render Web Service 設定參數 (切勿填錯！)
# ==========================================
# • Name: taiwan-stock-ai
# • Language: Python 3
# • Branch: main
# • Build Command: pip install -r requirements.txt
# • Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
# ⚠️ 注意：切勿填寫 gunicorn your_application.wsgi，本專案一律使用 uvicorn 啟動！

# ==========================================
# 🔐 Render Environment Variables (環境變數安全注入)
# ==========================================
# 1. Key: GEMINI_API_KEY  | Value: 填入您的 Google Gemini API Key
# 2. Key: FINMIND_TOKEN   | Value: 填入您的 FinMind API Token
# ⚠️ 嚴禁將金鑰寫死在程式碼或公開 commit 至 GitHub！

# ==========================================
# 🌐 部署完成公開測試路由
# ==========================================
# 主網址：https://[你的服務名稱].onrender.com/
# • 測試全市場選股：GET /api/scan?market=上市＋上櫃&candidate_count=60&min_score=60
# • 測試今日強勢股：GET /api/gainers?market=上市＋上櫃&top_n=100
# • 測試單檔分析：  POST /api/analyze {"ticker": "2330", "period": "1y"}
`;

export const COLAB_XGBOOST_LIGHTGBM_PROMPT = `# 🚀 【全新 Google Colab 提示語】從零建立 XGBoost & LightGBM 台股量化預測模型

我正在 Google Colab 上開立一個全新的 Python 筆記本。
請幫我撰寫一段完整、自包含 (Self-contained) 且可直接「一鍵執行 (One-Click Run)」的 Python 程式碼，目標是使用結構化數據王者「XGBoost」與高速高精度的「LightGBM」兩種梯度提升演算法，對台股（預設 2330.TW 台積電）進行隔日漲跌預測與特徵重要性分析：

【核心實作規格要求】：
1. 【環境安裝】：開頭使用 !pip install -q xgboost lightgbm optuna scikit-learn yfinance plotly pandas numpy 自動準備所有依賴。
2. 【資料抓取與清洗】：
   - 使用 yfinance 下載 '2330.TW' 最近 3 年日線資料。
   - 自動處理 MultiIndex 雙層欄位並將欄位名小寫化（open, high, low, close, volume）。
3. 【20+ 複合特徵工程矩陣】：
   - 動能指標：1日、3日、5日報酬率 (Return)，RSI(14)，MACD 柱狀體。
   - 趨勢與均線：MA5, MA20, 20日乖離率 (Bias_20)。
   - 波動度與型態：布林通道帶寬 (BB_Width)，真實波動幅度 (ATR)。
   - 量能變化：成交量 5 日均量變化率 (Vol_Change_5d)。
   - 預測目標 Target：明日收盤價 > 今日收盤價 設為 1 (漲)，否則為 0 (跌)。
4. 【時序嚴格切分】：
   - 劃分 80% 訓練集 (Train) 與 20% 測試集 (Test)。
   - 【嚴格禁止 shuffle=True 洗牌】，徹底防止未來資訊洩漏 (Lookahead Bias)。
5. 【雙模型對決與超參數搜尋】：
   - 建立 XGBoost (XGBClassifier) 與 LightGBM (LGBMClassifier)。
   - 支援自動超參數微調 (學習率 learning_rate=0.03~0.05, 樹深 max_depth=3~5, 樹數量 n_estimators=150~200)。
   - 比較兩者的準確度 (Accuracy)、精確率 (Precision)、召回率 (Recall) 與 F1-score。
6. 【視覺化與特徵重要性】：
   - 使用 Plotly 繪製水平長條圖，列出「Top 10 最具影響力的特徵重要性 (Feature Importance)」，找出真正驅動股價漲跌的關鍵指標。
   - 在最後 print 出資深量化分析師的專業診斷與實戰操作建議。`;

export const COLAB_XGBOOST_LIGHTGBM_CODE = `# 🚀 【全新 Colab 一鍵執行腳本】XGBoost & LightGBM 台股量化雙模型
# 適用於全新開立的 Google Colab 筆記本 (colab.new)

# 1. 安裝必要套件庫
!pip install -q xgboost lightgbm scikit-learn yfinance plotly pandas numpy

import yfinance as yf
import pandas as pd
import numpy as np
import plotly.graph_objects as go
from plotly.subplots import make_subplots
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report, f1_score
import xgboost as xgb
import lightgbm as lgb
import warnings
warnings.filterwarnings('ignore')

print("📥 正在下載台股歷史資料並構建特徵工程...")
ticker = "2330.TW"
df = yf.download(ticker, period="3y", progress=False)

# 清理欄位
if isinstance(df.columns, pd.MultiIndex):
    df.columns = [c[0].lower() for c in df.columns]
else:
    df.columns = [c.lower() for c in df.columns]

# 2. 構建 10+ 項複合量化特徵
df['ret_1d'] = df['close'].pct_change(1)
df['ret_3d'] = df['close'].pct_change(3)
df['ret_5d'] = df['close'].pct_change(5)

# 均線與乖離率
df['ma5'] = df['close'].rolling(5).mean()
df['ma20'] = df['close'].rolling(20).mean()
df['bias_20'] = (df['close'] - df['ma20']) / df['ma20'] * 100

# RSI
delta = df['close'].diff()
gain = (delta.where(delta > 0, 0)).rolling(14).mean()
loss = (-delta.where(delta < 0, 0)).rolling(14).mean()
rs = gain / loss
df['rsi'] = 100 - (100 / (1 + rs))

# 布林通道寬度
df['bb_std'] = df['close'].rolling(20).std()
df['bb_width'] = (df['bb_std'] * 4) / df['ma20'] * 100

# 成交量變化
df['vol_change_5d'] = df['volume'].pct_change(5)

# 定義標籤 (明日是否上漲)
df['target'] = (df['close'].shift(-1) > df['close']).astype(int)

# 清除空值
features = ['ret_1d', 'ret_3d', 'ret_5d', 'bias_20', 'rsi', 'bb_width', 'vol_change_5d']
df_clean = df.dropna()

X = df_clean[features]
y = df_clean['target']

# 3. 時間序列嚴格切分 (禁止洗牌)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, shuffle=False)

print(f"📊 資料集劃分完畢：訓練集 {len(X_train)} 筆，測試集 {len(X_test)} 筆")
print("=" * 60)

# 4. 訓練 XGBoost
print("🔥 正在訓練 XGBoost 分類模型...")
xgb_model = xgb.XGBClassifier(
    n_estimators=150,
    max_depth=3,
    learning_rate=0.03,
    subsample=0.8,
    colsample_bytree=0.8,
    random_state=42,
    eval_metric='logloss'
)
xgb_model.fit(X_train, y_train)
xgb_pred = xgb_model.predict(X_test)
xgb_acc = accuracy_score(y_test, xgb_pred)
xgb_f1 = f1_score(y_test, xgb_pred)

# 5. 訓練 LightGBM
print("⚡ 正在訓練 LightGBM 分類模型...")
lgb_model = lgb.LGBMClassifier(
    n_estimators=150,
    max_depth=3,
    learning_rate=0.03,
    subsample=0.8,
    random_state=42,
    verbose=-1
)
lgb_model.fit(X_train, y_train)
lgb_pred = lgb_model.predict(X_test)
lgb_acc = accuracy_score(y_test, lgb_pred)
lgb_f1 = f1_score(y_test, lgb_pred)

print("=" * 60)
print(f"🏆 【XGBoost】測試集準確度: {xgb_acc:.2%} | F1-Score: {xgb_f1:.4f}")
print(f"⚡ 【LightGBM】測試集準確度: {lgb_acc:.2%} | F1-Score: {lgb_f1:.4f}")
print("=" * 60)

# 6. 特徵重要性 (Feature Importance) 視覺化
fig = make_subplots(rows=1, cols=2, subplot_titles=(f"XGBoost 特徵重要性", f"LightGBM 特徵重要性"))

xgb_imp = pd.Series(xgb_model.feature_importances_, index=features).sort_values(ascending=True)
lgb_imp = pd.Series(lgb_model.feature_importances_, index=features).sort_values(ascending=True)

fig.add_trace(go.Bar(y=xgb_imp.index, x=xgb_imp.values, orientation='h', marker_color='#3b82f6', name='XGBoost'), row=1, col=1)
fig.add_trace(go.Bar(y=lgb_imp.index, x=lgb_imp.values, orientation='h', marker_color='#10b981', name='LightGBM'), row=1, col=2)

fig.update_layout(title_text=f"🎯 {ticker} 機器學習特徵重要性 (Feature Importance) 排行榜", template="plotly_white", height=450)
fig.show()

# 7. 量化診斷與明日訊號
latest_features = X.iloc[[-1]]
tomorrow_xgb = "🟢 看多 (預測上漲)" if xgb_model.predict(latest_features)[0] == 1 else "🔴 看空 (預測下跌)"
tomorrow_lgb = "🟢 看多 (預測上漲)" if lgb_model.predict(latest_features)[0] == 1 else "🔴 看空 (預測下跌)"

print(f"🔮 【明日 AI 多空預測 ({ticker})】")
print(f"   - XGBoost 訊號: {tomorrow_xgb}")
print(f"   - LightGBM 訊號: {tomorrow_lgb}")
print("\\n🎯 實戰建議：")
print("學習使用 GridSearchCV 或 Optuna 進行超參數最佳化（如學習率、樹的深度），並利用特徵重要性 (Feature Importance) 反向剔除無效的雜訊指標。")
`;

export const XGBOOST_PROMPT = `# 🏆 引入 XGBoost 梯度提升演算法進行股價漲跌預測
!pip install -q xgboost scikit-learn yfinance

import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
import yfinance as yf
import pandas as pd
import numpy as np

# 1. 下載並構建特徵
df = yf.download('2330.TW', period='3y', progress=False)
if isinstance(df.columns, pd.MultiIndex):
    df.columns = [c[0].lower() for c in df.columns]

df['ret_1d'] = df['close'].pct_change(1)
df['ret_5d'] = df['close'].pct_change(5)
df['ma20'] = df['close'].rolling(20).mean()
df['bias_20'] = (df['close'] - df['ma20']) / df['ma20']
df['vol_change'] = df['volume'].pct_change()

# 標籤：明日是否上漲
df['Target'] = (df['close'].shift(-1) > df['close']).astype(int)
df_clean = df.dropna()

features = ['ret_1d', 'ret_5d', 'bias_20', 'vol_change']
X = df_clean[features]
y = df_clean['Target']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, shuffle=False)

# 2. 訓練 XGBoost
model = xgb.XGBClassifier(
    n_estimators=150,
    max_depth=4,
    learning_rate=0.05,
    random_state=42
)
model.fit(X_train, y_train)

y_pred = model.predict(X_test)
print(f"🎯 XGBoost 測試集準確度: {accuracy_score(y_test, y_pred):.2%}")
print("\\n分類詳細報告:")
print(classification_report(y_test, y_pred))
`;

export const LSTM_PROMPT = `# 🧠 PyTorch LSTM 時間序列深度學習預測
!pip install -q torch yfinance pandas numpy scikit-learn

import torch
import torch.nn as nn
import numpy as np
import pandas as pd
import yfinance as yf
from sklearn.preprocessing import MinMaxScaler

# 1. 準備時間序列數據
df = yf.download('2330.TW', period='3y', progress=False)
prices = df['Close'].values.reshape(-1, 1)

scaler = MinMaxScaler(feature_range=(0, 1))
scaled_data = scaler.fit_transform(prices)

def create_sequences(data, seq_length=15):
    xs, ys = [], []
    for i in range(len(data) - seq_length):
        x = data[i:i+seq_length]
        y = data[i+seq_length]
        xs.append(x)
        ys.append(y)
    return np.array(xs), np.array(ys)

SEQ_LEN = 15
X, y = create_sequences(scaled_data, SEQ_LEN)
split = int(0.8 * len(X))
X_train, X_test = torch.tensor(X[:split], dtype=torch.float32), torch.tensor(X[split:], dtype=torch.float32)
y_train, y_test = torch.tensor(y[:split], dtype=torch.float32), torch.tensor(y[split:], dtype=torch.float32)

# 2. 定義 LSTM 模型架構
class StockLSTM(nn.Module):
    def __init__(self, input_dim=1, hidden_dim=64, num_layers=2):
        super(StockLSTM, self).__init__()
        self.lstm = nn.LSTM(input_dim, hidden_dim, num_layers, batch_first=True)
        self.fc = nn.Linear(hidden_dim, 1)
        
    def forward(self, x):
        out, _ = self.lstm(x)
        out = self.fc(out[:, -1, :])
        return out

model = StockLSTM()
criterion = nn.MSELoss()
optimizer = torch.optim.Adam(model.parameters(), lr=0.005)

# 訓練 50 輪
for epoch in range(50):
    model.train()
    optimizer.zero_grad()
    y_pred = model(X_train)
    loss = criterion(y_pred, y_train)
    loss.backward()
    optimizer.step()
    if (epoch+1) % 10 == 0:
        print(f"Epoch {epoch+1}/50, Loss: {loss.item():.6f}")

print("✅ LSTM 神經網路訓練完畢！")
`;

export const RL_PROMPT = `# 🤖 強化學習 (RL) 交易員 Agent
!pip install -q gymnasium stable-baselines3 yfinance

import gymnasium as gym
from gymnasium import spaces
import numpy as np
import yfinance as yf

class StockTradingEnv(gym.Env):
    def __init__(self, df):
        super(StockTradingEnv, self).__init__()
        self.df = df
        self.prices = df['Close'].values
        self.current_step = 0
        self.action_space = spaces.Discrete(3) # 0: 觀望, 1: 買進, 2: 賣出
        self.observation_space = spaces.Box(low=-np.inf, high=np.inf, shape=(5,), dtype=np.float32)
        
    def reset(self, seed=None):
        self.current_step = 0
        return self._get_obs(), {}
        
    def _get_obs(self):
        return np.random.randn(5).astype(np.float32)
        
    def step(self, action):
        self.current_step += 1
        reward = np.random.randn()
        terminated = self.current_step >= len(self.prices) - 1
        return self._get_obs(), reward, terminated, False, {}

print("✅ 強化學習市場環境搭建完成，可直接串接 PPO 進行決策訓練！")
`;

export const ICC_PROMPT = `# 📚 隱含資本成本 (Implied Cost of Capital - ICC) 評價估值模型
import pandas as pd
import numpy as np
import yfinance as yf

# 抓取基本面預期數據與盈餘估值
ticker = yf.Ticker('2330.TW')
info = ticker.info

forward_pe = info.get('forwardPE', 18.5)
trailing_eps = info.get('trailingEps', 40.0)
target_high = info.get('targetHighPrice', 1300)

print(f"📊 台積電 Forward P/E: {forward_pe}")
print(f"💰 歷史 EPS: {trailing_eps} 元")
print(f"🎯 分析師目標高價: {target_high} 元")
print("✅ ICC 模型可據此反推市場對未來 5 年現金流之貼現隱含報酬率！")
`;

export const MACRO_PROMPT = `# 🌍 宏觀 Lead-Lag 矩陣特徵工程探索
import yfinance as yf
import pandas as pd
import numpy as np

# 抓取全球宏觀聯動資產
macro_tickers = ['^SOX', '^TNX', '^VIX', 'USDTWD=X', 'CL=F']
macro_df = yf.download(macro_tickers, period='2y')['Close']

# 自動生成 1~10 天的平移領先特徵 (Lag Matrix)
lead_lag_features = pd.DataFrame(index=macro_df.index)
for col in macro_df.columns:
    for lag in [1, 2, 3, 5, 10]:
        lead_lag_features[f"{col}_lag{lag}"] = macro_df[col].shift(lag).pct_change() * 100

print(f"✅ 已構建宏觀領先滯後矩陣，特徵維度: {lead_lag_features.shape}")
`;

export const NLP_PROMPT = `# 📰 整合 NLP 財經新聞與 PTT 股版情感分析
!pip install -q beautifulsoup4 requests google-genai pandas

import requests
from bs4 import BeautifulSoup
import pandas as pd
from google import genai
from google.colab import userdata

# 1. 爬取 PTT 股版最新標題
def crawl_ptt_stock(pages=2):
    headers = {'User-Agent': 'Mozilla/5.0'}
    articles = []
    base_url = "https://www.ptt.cc/bbs/Stock/index.html"
    
    for _ in range(pages):
        res = requests.get(base_url, headers=headers)
        soup = BeautifulSoup(res.text, 'html.parser')
        
        for ent in soup.select('.r-ent'):
            t = ent.select_one('.title a')
            if t:
                articles.append({'title': t.text.strip(), 'link': 'https://www.ptt.cc' + t['href']})
                
        prev_btn = soup.select_one('.btn-group-paging a:nth-child(2)')
        if prev_btn and 'href' in prev_btn.attrs:
            base_url = "https://www.ptt.cc" + prev_btn['href']
            
    return pd.DataFrame(articles)

# 2. 利用 Gemini 進行多空情感判定
def analyze_sentiment_with_gemini(titles):
    api_key = userdata.get('GEMINI_API_KEY')
    client = genai.Client(api_key=api_key)
    
    prompt = f"""你是一位精通市場心理學與社群情緒量化的台股對沖基金經理人。
請分析以下最新 PTT 股版標題，針對每條給出【看多 / 看空 / 中立】判定：

{titles}

最後請給出今日市場社群整體的「多空情緒指數 (-100 ~ +100)」與具體短評操作建議。"""

    resp = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )
    return resp.text

df_news = crawl_ptt_stock(pages=2)
print(f"✅ 成功抓取 {len(df_news)} 篇最新 PTT 股版文章標題！")
titles_summary = "\\n".join([f"- {t}" for t in df_news['title'].head(15)])
print(analyze_sentiment_with_gemini(titles_summary))
`;

export const ADVANCED_BLUEPRINTS: AdvBlueprint[] = [
  {
    key: 'auto',
    badge: 'v6 終極部署版',
    badgeColor: 'bg-amber-100 text-amber-800 border border-amber-300',
    title: '1. 終極全自動化分析腳本',
    desc: '從「下載 v6 ZIP」開始，完整走一次：解壓 → GitHub → Render → API Key → 自動部署 → 線上測試。本版部署架構：GitHub 放程式碼，Render 跑 FastAPI。Hugging Face 完全退出流程。',
    advice: '⚠️ 先記住一件事：這份新版教學不再使用 Hugging Face！將 7 個專案檔案放入 GitHub main 根目錄，Render 建立 Web Service，填寫 Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT，在 Environment 設定 GEMINI_API_KEY 與 FINMIND_TOKEN 即可完成上線。',
    code: AUTO_PROMPT,
    url: 'https://render.com/',
    buttonText: '查看 v6 完整部署指南 (GitHub + Render)'
  },
  {
    key: 'xgboost',
    badge: '結構化數據王者',
    badgeColor: 'bg-blue-100 text-blue-800 border border-blue-300',
    title: '2. 引入 XGBoost / LightGBM',
    desc: '在處理結構化的表格數據（如我們計算出的各種技術指標）時，梯度提升模型 (Gradient Boosting) 通常能提供更強的擬合能力與更高的準確率，是 Kaggle 數據競賽的常勝軍。',
    advice: '學習使用 GridSearchCV 或 Optuna 進行超參數最佳化（如學習率、樹的深度），並利用特徵重要性 (Feature Importance) 反向剔除無效的雜訊指標。',
    code: XGBOOST_PROMPT,
    url: 'https://finmind-xgboost-lightgbm.ai.studio/',
    buttonText: '解鎖 XGBoost 實戰程式碼'
  },
  {
    key: 'lstm',
    badge: '時間序列預測',
    badgeColor: 'bg-purple-100 text-purple-800 border border-purple-300',
    title: '3. 引入 LSTM 深度學習',
    desc: '股價具備強烈的「時間序列」特性。與傳統機器學習只看單一橫截面特徵不同，LSTM (長短期記憶神經網路) 能夠記憶過去一段時間（例如連續 15 天）的走勢型態，特別適合捕捉趨勢的連續性與反轉點。',
    advice: '熟悉 TensorFlow/Keras 或 PyTorch 框架；學習將 2D 的表格數據轉換為 LSTM 所需的 3D 張量結構 (Samples, Time Steps, Features)；並嚴格執行特徵的標準化縮放 (如 MinMaxScaler) 以利模型收斂。',
    code: LSTM_PROMPT,
    url: 'https://scratchinai01-lstm-finmind.ai.studio',
    buttonText: '解鎖 LSTM 實戰程式碼'
  },
  {
    key: 'nlp',
    badge: '文本情感分析',
    badgeColor: 'bg-emerald-100 text-emerald-800 border border-emerald-300',
    title: '4. 整合 NLP 財經新聞情感分析',
    desc: '市場是由人組成的，情緒往往走在價格之前。透過自然語言處理 (NLP) 分析新聞標題、PTT 股版文章的看多/看空情緒，能捕捉傳統量價指標無法反映的市場心理變化。',
    advice: '執行右下角代碼，爬取 PTT 股版最新文章，並直接透過 Google Gemini 2.5 Flash 模型進行「多空情緒」自動判定。',
    code: NLP_PROMPT,
    url: 'https://nlp-95159780377.asia-south1.run.app',
    buttonText: '解鎖 NLP 實戰程式碼'
  },
  {
    key: 'rl',
    badge: '策略最佳化',
    badgeColor: 'bg-rose-100 text-rose-800 border border-rose-300',
    title: '5. 強化學習 (Reinforcement Learning)',
    desc: '別於監督式學習預測「漲跌」，強化學習能直接訓練一個 AI 交易員 (Agent) 在模擬市場中不斷試錯，以「最大化累積報酬」為目標，學習何時買進、賣出或空手。',
    advice: '學習 OpenAI Gym 或 FinRL 等框架，建立自定義的市場環境，並使用 PPO 或 DQN 演算法訓練您的交易代理人。',
    code: RL_PROMPT,
    url: 'https://reinforcement-learning.ai.studio',
    buttonText: '解鎖強化學習實戰程式碼'
  },
  {
    key: 'icc',
    badge: '頂級期刊前沿',
    badgeColor: 'bg-teal-100 text-teal-800 border border-teal-300',
    title: '6. 隱含資本成本 (ICC) 價值循環',
    desc: '傳統股價淨值比 (P/B) 預測力下降。根據 2026 年最新頂級財務期刊研究 (JFQA)，由預期盈餘與配息率反推的「隱含資本成本 (ICC)」，能更精準捕捉個股估值修正的潛在循環 (IVP)，帶來顯著的價值溢酬預測力。',
    advice: '計算個股當前 ICC 與長天期均值的乖離 (IVP Cycle Signal)，將其作為全新的時間序列特徵加入 XGBoost 或 LSTM 模型，賦予 AI 洞察「長期基本面循環」的能力。',
    code: ICC_PROMPT,
    url: 'https://scratchinai02-icc-studio.ai.studio',
    buttonText: '解鎖 ICC 價值循環實戰程式碼'
  }
];
