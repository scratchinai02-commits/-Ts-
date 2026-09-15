// 完美救援程式碼集中管理庫

export const STEP11_RESCUE_CODE = `這是我準備好的 STEP 11 備用救援程式碼。請你直接回覆並輸出這段完整的 Python 程式碼，讓我能順利貼到 Colab 執行，不需額外解釋與修改邏輯：

\`\`\`python
# STEP 11: 融資融券與散戶動態 - 備用救援程式碼
import pandas as pd
import numpy as np
import requests
import plotly.graph_objects as go
from plotly.subplots import make_subplots

# 官方 FinMind 金鑰 (已配置專屬金鑰以確保高頻獲取無誤)
FINMIND_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoic2NyYXRjaGluYWkwMUBnbWFpbC5jb20iLCJlbWFpbCI6InNjcmF0Y2hpbmFpMDFAZ21haWwuY29tIiwidG9rZW5fdmVyc2lvbiI6Mn0.9gGYifRhHQNfV8al5CUJ_fpYLeHYII7oRngzn59yGPA"

if 'df' not in globals() or df.empty:
    import yfinance as yf
    df = yf.download('2330.TW', period='3y', auto_adjust=False)
    if isinstance(df.columns, pd.MultiIndex):
        df.columns = [c[0].lower() for c in df.columns]
    else:
        df.columns = [c.lower() for c in df.columns]

end_date = df.index.max()
start_date = end_date - pd.Timedelta(days=365)
str_start = start_date.strftime('%Y-%m-%d')
str_end = end_date.strftime('%Y-%m-%d')

url = f"https://api.finmindtrade.com/api/v4/data?dataset=TaiwanStockMarginPurchaseShortSale&data_id=2330&start_date={str_start}&end_date={str_end}&token={FINMIND_TOKEN}"

try:
    res = requests.get(url, timeout=10)
    data = res.json()
    if data.get('msg') == 'success' and len(data.get('data', [])) > 0:
        margin_df = pd.DataFrame(data['data'])
        margin_df['date'] = pd.to_datetime(margin_df['date'])
        margin_df.set_index('date', inplace=True)
        margin_df = margin_df[['MarginPurchaseTodayBalance', 'ShortSaleTodayBalance']]
        margin_df.columns = ['margin_balance', 'short_balance']
    else:
        raise ValueError("FinMind 無法取得有效資料，啟動模擬數據")
except Exception as e:
    print(f"⚠️ API 獲取失敗 ({e})，已啟用模擬融資融券數據以利學習流程繼續進行。")
    date_range = pd.date_range(start=start_date, end=end_date, freq='B')
    np.random.seed(42)
    sim_margin = np.random.randint(15000, 35000, size=len(date_range))
    sim_short = np.random.randint(500, 4000, size=len(date_range))
    margin_df = pd.DataFrame({'margin_balance': sim_margin, 'short_balance': sim_short}, index=date_range)

df = df.merge(margin_df, left_index=True, right_index=True, how='left')
df['margin_balance'] = df['margin_balance'].ffill().fillna(0)
df['short_balance'] = df['short_balance'].ffill().fillna(0)
df['margin_ratio'] = np.where(df['margin_balance'] > 0, (df['short_balance'] / df['margin_balance']) * 100, 0)

fig = make_subplots(rows=3, cols=1, shared_xaxes=True, vertical_spacing=0.03, subplot_titles=('2330 收盤價與融資混亂/安定區', '融資與融券餘額 (張)', '券資比 (%)'))
fig.add_trace(go.Scatter(x=df.index, y=df['close'], name='收盤價', line=dict(color='#2563eb', width=1.5)), row=1, col=1)

p90 = df['margin_balance'].quantile(0.9)
p10 = df['margin_balance'].quantile(0.1)

fig.add_trace(go.Bar(x=df.index, y=df['margin_balance'], name='融資餘額', marker_color='#ef4444', opacity=0.7), row=2, col=1)
fig.add_trace(go.Bar(x=df.index, y=df['short_balance'], name='融券餘額', marker_color='#10b981', opacity=0.7), row=2, col=1)
fig.add_trace(go.Scatter(x=df.index, y=df['margin_ratio'], name='券資比 %', line=dict(color='#8b5cf6', width=1.5)), row=3, col=1)

fig.update_layout(height=800, template='plotly_white', showlegend=True, title_text="台積電 散戶融資融券與券資比觀測")
fig.show()
print("✅ STEP 11 散戶籌碼指標與視覺化建構完成！")
\`\`\`
`;

export const STEP13_RESCUE_CODE = `這是我準備好的 STEP 13 備用救援程式碼。請你直接回覆並輸出這段完整的 Python 程式碼，讓我能順利貼到 Colab 執行，不需額外解釋與修改邏輯：

\`\`\`python
# STEP 13: 落後指標綜合熱力圖 - 備用救援程式碼
import pandas as pd
import numpy as np
import seaborn as sns
import matplotlib.pyplot as plt

corr_data = pd.DataFrame(index=df.index)
corr_data['Close_Price'] = df['close']
corr_data['Volume'] = df['volume']
corr_data['Margin_Balance'] = df['margin_balance'] if 'margin_balance' in df.columns else np.random.randint(1000, 5000, len(df))
corr_data['Short_Balance'] = df['short_balance'] if 'short_balance' in df.columns else np.random.randint(100, 500, len(df))

if 'foreign_cum' in df.columns:
    corr_data['Foreign_Cum'] = df['foreign_cum']
else:
    corr_data['Foreign_Cum'] = np.random.randn(len(df)).cumsum() * 1000

corr_matrix = corr_data.corr()

plt.figure(figsize=(8, 6), dpi=120)
sns.heatmap(corr_matrix, annot=True, cmap='coolwarm', fmt='.2f', linewidths=1, vmin=-1, vmax=1)
plt.title('2330 Indicators Correlation Matrix (Lagging & Fundamentals)')
plt.tight_layout()
plt.show()

top_corr = corr_matrix['Close_Price'].drop('Close_Price').abs().idxmax()
top_corr_val = corr_matrix['Close_Price'][top_corr]
print(f"📊 與台積電收盤價相關性最高之落後指標為: {top_corr} (相關係數: {top_corr_val:.2f})")
\`\`\`
`;

export const STEP14_RESCUE_CODE = `這是我準備好的 STEP 14 備用救援程式碼。請你直接回覆並輸出這段完整的 Python 程式碼，讓我能順利貼到 Colab 執行，不需額外解釋與修改邏輯：

\`\`\`python
# STEP 14: 進階領先籌碼 (期貨與借券) - 備用救援程式碼
import pandas as pd
import numpy as np
import requests
import plotly.graph_objects as go
from plotly.subplots import make_subplots

# 官方 FinMind 金鑰
FINMIND_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoic2NyYXRjaGluYWkwMUBnbWFpbC5jb20iLCJlbWFpbCI6InNjcmF0Y2hpbmFpMDFAZ21haWwuY29tIiwidG9rZW5fdmVyc2lvbiI6Mn0.9gGYifRhHQNfV8al5CUJ_fpYLeHYII7oRngzn59yGPA"

end_date = df.index.max()
start_date = end_date - pd.Timedelta(days=365)
str_start = start_date.strftime('%Y-%m-%d')
str_end = end_date.strftime('%Y-%m-%d')

# 獲取台指期法人數據
try:
    url_tx = f"https://api.finmindtrade.com/api/v4/data?dataset=TaiwanFuturesInstitutionalInvestors&data_id=TX&start_date={str_start}&end_date={str_end}&token={FINMIND_TOKEN}"
    res_tx = requests.get(url_tx, timeout=10).json()
    if res_tx.get('msg') == 'success' and len(res_tx.get('data', [])) > 0:
        tx_df = pd.DataFrame(res_tx['data'])
        tx_df = tx_df[tx_df['institutional_investors'] == '外資']
        tx_df['date'] = pd.to_datetime(tx_df['date'])
        tx_df.set_index('date', inplace=True)
        tx_df['Foreign_TX_Net_OI'] = tx_df['long'] - tx_df['short']
        tx_series = tx_df['Foreign_TX_Net_OI']
    else:
        raise ValueError("無法取得期貨數據")
except Exception as e:
    print(f"⚠️ 期貨 API 獲取失敗 ({e})，使用模擬數據。")
    date_rng = pd.date_range(start_date, end_date, freq='B')
    np.random.seed(14)
    tx_series = pd.Series(np.random.randint(-20000, 20000, len(date_rng)), index=date_rng, name='Foreign_TX_Net_OI')

# 獲取借券賣出餘額
try:
    url_lend = f"https://api.finmindtrade.com/api/v4/data?dataset=TaiwanStockSecuritiesLending&data_id=2330&start_date={str_start}&end_date={str_end}&token={FINMIND_TOKEN}"
    res_lend = requests.get(url_lend, timeout=10).json()
    if res_lend.get('msg') == 'success' and len(res_lend.get('data', [])) > 0:
        lend_df = pd.DataFrame(res_lend['data'])
        lend_df['date'] = pd.to_datetime(lend_df['date'])
        lend_grp = lend_df.groupby('date')['volume'].sum()
        lend_grp.name = 'sell_balance'
    else:
        raise ValueError("無法取得借券數據")
except Exception as e:
    print(f"⚠️ 借券 API 獲取失敗 ({e})，使用模擬數據。")
    date_rng = pd.date_range(start_date, end_date, freq='B')
    np.random.seed(28)
    lend_grp = pd.Series(np.random.randint(5000, 60000, len(date_rng)), index=date_rng, name='sell_balance')

df_extended = df.copy()
df_extended = df_extended.merge(tx_series, left_index=True, right_index=True, how='left')
df_extended = df_extended.merge(lend_grp, left_index=True, right_index=True, how='left')
df_extended['Foreign_TX_Net_OI'] = df_extended['Foreign_TX_Net_OI'].ffill().fillna(0)
df_extended['sell_balance'] = df_extended['sell_balance'].ffill().fillna(0)

fig = make_subplots(rows=3, cols=1, shared_xaxes=True, vertical_spacing=0.04, subplot_titles=('2330 收盤價', '外資台指期淨未平倉口數 (Foreign_TX_Net_OI)', '借券賣出餘額 (sell_balance)'))
fig.add_trace(go.Scatter(x=df_extended.index, y=df_extended['close'], name='收盤價', line=dict(color='#2563eb')), row=1, col=1)

colors = ['#10b981' if val >= 0 else '#ef4444' for val in df_extended['Foreign_TX_Net_OI']]
fig.add_trace(go.Bar(x=df_extended.index, y=df_extended['Foreign_TX_Net_OI'], marker_color=colors, name='外資期貨淨未平倉'), row=2, col=1)
fig.add_trace(go.Scatter(x=df_extended.index, y=df_extended['sell_balance'], fill='tozeroy', line=dict(color='#f59e0b'), name='借券賣出餘額'), row=3, col=1)

fig.update_layout(height=800, template='plotly_white', title_text="領先指標：外資期貨與借券佈局")
fig.show()
print("💡 【觀念輸出】：當外資期貨淨空單增加，且借券賣出攀升時，通常是法人正在避險佈局的先行訊號！")
\`\`\`
`;

export const STEP16_RESCUE_CODE = `這是我準備好的 STEP 16 備用救援程式碼。請你直接回覆並輸出這段完整的 Python 程式碼，讓我能順利貼到 Colab 執行，不需額外解釋與修改邏輯：

\`\`\`python
# STEP 16: 訓練 AI 模型 (破解勝率迷思) - 備用救援程式碼
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import pandas as pd
import numpy as np
import yfinance as yf

# 確保前置變數存在
if 'df' not in globals() or df.empty:
    df = yf.download('2330.TW', period='3y', auto_adjust=False)
    if isinstance(df.columns, pd.MultiIndex):
        df.columns = [col[0].lower() for col in df.columns]
    else:
        df.columns = [col.lower() for col in df.columns]

if 'ma20' not in df.columns:
    df['ma20'] = df['close'].rolling(window=20).mean()

if 'rsi' not in df.columns:
    delta = df['close'].diff()
    gain = delta.where(delta > 0, 0).ewm(com=13, adjust=False).mean()
    loss = (-delta).where(delta < 0, 0).ewm(com=13, adjust=False).mean()
    rs = gain / loss
    df['rsi'] = 100 - (100 / (1 + rs))

ml_df = df.copy()
ml_df['Bias_20'] = ((ml_df['close'] - ml_df['ma20']) / ml_df['ma20']) * 100
ml_df['Daily_Return'] = ml_df['close'].pct_change() * 100
ml_df['RSI'] = ml_df['rsi']

if 'Foreign_TX_Net_OI' not in ml_df.columns:
    np.random.seed(42)
    ml_df['Foreign_TX_Net_OI'] = np.random.randint(-15000, 15000, len(ml_df))
if 'sell_balance' not in ml_df.columns:
    ml_df['sell_balance'] = np.random.randint(1000, 50000, len(ml_df))

ml_df['Next_Close'] = ml_df['close'].shift(-1)
ml_df['Target'] = (ml_df['Next_Close'] > ml_df['close']).astype(int)

feature_cols = ['Bias_20', 'Daily_Return', 'RSI', 'Foreign_TX_Net_OI', 'sell_balance']
ml_df_cleaned = ml_df.dropna()

X = ml_df_cleaned[feature_cols]
y = ml_df_cleaned['Target']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, shuffle=False)

model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"🎯 隨機森林模型在測試集上的準確度: {accuracy:.2%}")
print("\\n💡 【AI 助教解析】：若勝率在 50% 左右，代表僅依賴公開的基礎技術指標跟擲硬幣無異。我們必須引入籌碼與複合特徵來榨出超額報酬！")
\`\`\`
`;

export const STEP17_RESCUE_CODE = `這是我準備好的 STEP 17 備用救援程式碼。請你直接回覆並輸出這段完整的 Python 程式碼，讓我能順利貼到 Colab 執行，不需額外解釋與修改邏輯：

\`\`\`python
# STEP 17: 建構 20+ 複合特徵矩陣 - 備用救援程式碼
import pandas as pd
import numpy as np
import yfinance as yf
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import plotly.express as px

mega_df = df.copy()

# 1. 動能特徵
mega_df['Daily_Return_1d'] = mega_df['close'].pct_change(1) * 100
mega_df['Daily_Return_3d'] = mega_df['close'].pct_change(3) * 100
mega_df['Daily_Return_5d'] = mega_df['close'].pct_change(5) * 100

ema12 = mega_df['close'].ewm(span=12, adjust=False).mean()
ema26 = mega_df['close'].ewm(span=26, adjust=False).mean()
dif = ema12 - ema26
dem = dif.ewm(span=9, adjust=False).mean()
mega_df['MACD_Hist'] = dif - dem

# 2. 波動與型態
ma20 = mega_df['close'].rolling(20).mean()
std20 = mega_df['close'].rolling(20).std()
upper_bb = ma20 + (2 * std20)
lower_bb = ma20 - (2 * std20)
mega_df['BB_Width'] = ((upper_bb - lower_bb) / ma20) * 100

tr1 = mega_df['high'] - mega_df['low']
tr2 = (mega_df['high'] - mega_df['close'].shift(1)).abs()
tr3 = (mega_df['low'] - mega_df['close'].shift(1)).abs()
tr = pd.concat([tr1, tr2, tr3], axis=1).max(axis=1)
mega_df['Normalized_ATR'] = (tr.rolling(14).mean() / mega_df['close']) * 100

# 3. 跨市場特徵 (加入防呆)
try:
    market_data = yf.download(['^SOX', '^TNX', '^VIX'], period='3y', progress=False)['Close']
    if isinstance(market_data.columns, pd.MultiIndex):
        market_data.columns = [c[0].upper() for c in market_data.columns]
    mega_df['SOX_Return'] = market_data['^SOX'].pct_change() * 100
    mega_df['TNX_Change'] = market_data['^TNX'].pct_change() * 100
    mega_df['VIX_Change'] = market_data['^VIX'].pct_change() * 100
except Exception as e:
    print(f"⚠️ 跨市場數據下載受限 ({e})，使用模擬特徵。")
    mega_df['SOX_Return'] = np.random.randn(len(mega_df)) * 1.5
    mega_df['TNX_Change'] = np.random.randn(len(mega_df)) * 0.8
    mega_df['VIX_Change'] = np.random.randn(len(mega_df)) * 3.0

# 4. Lead-Lag 領先特徵
if 'Foreign_TX_Net_OI' not in mega_df.columns:
    mega_df['Foreign_TX_Net_OI'] = np.random.randint(-15000, 15000, len(mega_df))
if 'sell_balance' not in mega_df.columns:
    mega_df['sell_balance'] = np.random.randint(1000, 50000, len(mega_df))

mega_df['TX_Net_OI_Lag5'] = mega_df['Foreign_TX_Net_OI'].shift(5)
mega_df['Sell_Balance_Lag5'] = mega_df['sell_balance'].shift(5)

# 5. 標籤與清理
mega_df['Next_Close'] = mega_df['close'].shift(-1)
mega_df['Target'] = (mega_df['Next_Close'] > mega_df['close']).astype(int)

mega_df_cleaned_final = mega_df.dropna()
feature_cols_mega = [
    'Daily_Return_1d', 'Daily_Return_3d', 'Daily_Return_5d', 'MACD_Hist',
    'BB_Width', 'Normalized_ATR', 'SOX_Return', 'TNX_Change', 'VIX_Change',
    'Foreign_TX_Net_OI', 'sell_balance', 'TX_Net_OI_Lag5', 'Sell_Balance_Lag5'
]

X_mega = mega_df_cleaned_final[feature_cols_mega]
y_mega = mega_df_cleaned_final['Target']

X_train_mega, X_test_mega, y_train_mega, y_test_mega = train_test_split(X_mega, y_mega, test_size=0.2, shuffle=False)

rf_mega = RandomForestClassifier(n_estimators=200, random_state=42)
rf_mega.fit(X_train_mega, y_train_mega)
y_pred_mega = rf_mega.predict(X_test_mega)
acc_mega = accuracy_score(y_test_mega, y_pred_mega)

feat_importances = pd.Series(rf_mega.feature_importances_, index=feature_cols_mega).sort_values(ascending=True)
fig = px.bar(x=feat_importances.values, y=feat_importances.index, orientation='h', labels={'x': 'Importance', 'y': 'Feature'}, title='AI 決策特徵重要性分析 (Feature Importance)')
fig.show()

print(f"🔥 20+ 複合特徵隨機森林準確率: {acc_mega:.2%}")
\`\`\`
`;

export const STEP18_RESCUE_CODE = `這是我準備好的 STEP 18 備用救援程式碼。請你直接回覆並輸出這段完整的 Python 程式碼，讓我能順利貼到 Colab 執行，不需額外解釋與修改邏輯：

\`\`\`python
# STEP 18: 純粹 Pandas 向量化回測 - 備用救援程式碼
import pandas as pd
import numpy as np
import plotly.graph_objects as go

if 'X_test_mega' not in globals() or 'y_pred_mega' not in globals():
    raise ValueError("請先執行 STEP 17 產出 X_test_mega 與 y_pred_mega！")

backtest_df = pd.DataFrame(index=X_test_mega.index)
backtest_df['Daily_Return'] = mega_df_cleaned_final.loc[X_test_mega.index, 'Daily_Return_1d']
backtest_df['Signal'] = y_pred_mega

# 計算持有報酬 (今日訊號 -> 明日持有)
backtest_df['Position'] = backtest_df['Signal'].shift(1).fillna(0)
backtest_df['Strategy_Return'] = backtest_df['Position'] * backtest_df['Daily_Return']

# 加入摩擦成本 (0.3%)
backtest_df['Trade_Action'] = backtest_df['Signal'].diff().abs().fillna(0)
backtest_df['Friction_Cost'] = backtest_df['Trade_Action'] * 0.3
backtest_df['Net_Strategy_Return'] = backtest_df['Strategy_Return'] - backtest_df['Friction_Cost']

# 計算累積淨值
backtest_df['Buy_Hold_Equity'] = (1 + backtest_df['Daily_Return'] / 100).cumprod()
backtest_df['AI_Strategy_Equity'] = (1 + backtest_df['Net_Strategy_Return'] / 100).cumprod()

fig = go.Figure()
fig.add_trace(go.Scatter(x=backtest_df.index, y=backtest_df['Buy_Hold_Equity'], mode='lines', name='買進持有 (Buy & Hold)', line=dict(color='#94a3b8', dash='dash')))
fig.add_trace(go.Scatter(x=backtest_df.index, y=backtest_df['AI_Strategy_Equity'], mode='lines', name='AI 量化策略 (含交易成本)', line=dict(color='#2563eb', width=2)))

fig.update_layout(title='向量化回測：AI 策略 vs 買進持有 淨值曲線', yaxis_title='累積淨值 (Multiplier)', template='plotly_white', height=500)
fig.show()

total_bh_return = (backtest_df['Buy_Hold_Equity'].iloc[-1] - 1) * 100
total_ai_return = (backtest_df['AI_Strategy_Equity'].iloc[-1] - 1) * 100
print(f"📈 買進持有總報酬率: {total_bh_return:.2f}%")
print(f"🤖 AI 量化策略總報酬率: {total_ai_return:.2f}%")
\`\`\`
`;

export const STEP19_RESCUE_CODE = `這是我準備好的 STEP 19 備用救援程式碼。請你直接回覆並輸出這段完整的 Python 程式碼，讓我能順利貼到 Colab 執行，不需額外解釋與修改邏輯：

\`\`\`python
# STEP 19: 構建量化分析腳本 (自動化) - 備用救援程式碼
import pandas as pd
import numpy as np
import yfinance as yf
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score

class StockAnalyzer:
    def __init__(self, ticker='2330.TW', period='3y'):
        self.ticker = ticker
        self.period = period
        self.df = pd.DataFrame()
        self.mega_df = pd.DataFrame()
        self.model = None

    def fetch_data(self):
        print(f"📥 正在下載 {self.ticker} 資料 ({self.period})...")
        raw = yf.download(self.ticker, period=self.period, progress=False, auto_adjust=False)
        if isinstance(raw.columns, pd.MultiIndex):
            raw.columns = [c[0].lower() for c in raw.columns]
        else:
            raw.columns = [c.lower() for c in raw.columns]
        if 'adj close' in raw.columns:
            raw['close'] = raw['adj close']
            raw.drop(columns=['adj close'], inplace=True, errors='ignore')
        self.df = raw[['open', 'high', 'low', 'close', 'volume']].copy()
        return self

    def engineer_features(self):
        df = self.df.copy()
        df['ma5'] = df['close'].rolling(5).mean()
        df['ma20'] = df['close'].rolling(20).mean()
        df['bias_20'] = ((df['close'] - df['ma20']) / df['ma20']) * 100
        df['ret_1d'] = df['close'].pct_change(1) * 100
        df['ret_3d'] = df['close'].pct_change(3) * 100
        df['ret_5d'] = df['close'].pct_change(5) * 100

        delta = df['close'].diff()
        gain = delta.where(delta > 0, 0).ewm(com=13, adjust=False).mean()
        loss = (-delta).where(delta < 0, 0).ewm(com=13, adjust=False).mean()
        df['rsi'] = 100 - (100 / (1 + (gain / loss)))

        df['Next_Close'] = df['close'].shift(-1)
        df['Target'] = (df['Next_Close'] > df['close']).astype(int)
        self.mega_df = df.dropna()
        return self

    def run_ai_analysis(self):
        features = ['bias_20', 'ret_1d', 'ret_3d', 'ret_5d', 'rsi']
        X = self.mega_df[features]
        y = self.mega_df['Target']
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, shuffle=False)
        self.model = RandomForestClassifier(n_estimators=100, random_state=42)
        self.model.fit(X_train, y_train)
        acc = accuracy_score(y_test, self.model.predict(X_test))
        print(f"✅ {self.ticker} 自動化分析完成！模型準確率: {acc:.2%}")
        return acc

# 實例化並執行
analyzer = StockAnalyzer('2330.TW', '3y')
analyzer.fetch_data().engineer_features().run_ai_analysis()
\`\`\`
`;

export const STEP20_RESCUE_CODE = `這是我準備好的 STEP 20 備用救援程式碼。請你直接回覆並輸出這段完整的 Python 程式碼，讓我能順利貼到 Colab 執行，不需額外解釋與修改邏輯：

\`\`\`python
# STEP 20: Gemini 3.5 智能盤勢解析 - 備用救援程式碼
!pip install -q google-genai

import pandas as pd
from google import genai
from google.colab import userdata

try:
    api_key = userdata.get('GEMINI_API_KEY')
    if not api_key:
        raise ValueError("GEMINI_API_KEY 未設定，請在 Colab 秘密鍵 (Secrets) 中加入！")
    
    client = genai.Client(api_key=api_key)
    
    recent_data = df.tail(3)[['open', 'high', 'low', 'close', 'volume']].to_string()
    
    prompt = f"以下是台股 2330 台積電近三日交易數據：\\n{recent_data}\\n請身為資深量化分析師，給予 150 字以內的多空解析與操作觀點。"
    
    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=prompt
    )
    print("🤖 【Gemini 智能盤後解析】:")
    print(response.text)
except Exception as e:
    print(f"⚠️ Gemini 呼叫提示: {e}")
\`\`\`
`;

export const STEP21_RESCUE_CODE = `這是我準備好的 STEP 21 備用救援程式碼。請你直接回覆並輸出這段完整的 Python 程式碼，讓我能順利貼到 Colab 執行，不需額外解釋與修改邏輯：

\`\`\`python
# STEP 21: 專業級面板 (Blocks 排版與雷達)
# ==============================================================================
# 🎯 台股 AI 綜合量化量能觀測儀表板 (獨立零依賴、全指標自帶防崩潰版)
# 整合短期/長期均線矩陣、乖離率、多日報酬動能、RSI、MACD、布林通道、ATR 及籌碼代理評估
# ==============================================================================

import gradio as gr
import yfinance as yf
import pandas as pd
import numpy as np
import plotly.graph_objects as go
from plotly.subplots import make_subplots

# ------------------------------------------------------------------------------
# 🛠️ 工具函數：清洗 yfinance 多層索引 (MultiIndex) 欄位與確保欄位格式
# ------------------------------------------------------------------------------
def _fix_col_names(df_param: pd.DataFrame) -> pd.DataFrame:
    """自動展平 yfinance 回傳的多層索引並轉為標準小寫欄位"""
    df = df_param.copy()
    if isinstance(df.columns, pd.MultiIndex):
        df.columns = [col[0].lower() for col in df.columns]
    else:
        df.columns = [str(col).lower() for col in df.columns]
    df.columns.name = None

    if 'adj close' in df.columns:
        df['close'] = df['adj close']
        df = df.drop(columns=['adj close'], errors='ignore')
    elif 'adj close' in df.columns and 'close' not in df.columns:
        df = df.rename(columns={'adj close': 'close'})

    required_cols = ['open', 'high', 'low', 'close', 'volume']
    available_cols = [c for c in required_cols if c in df.columns]
    return df[available_cols]

# ------------------------------------------------------------------------------
# 🧮 核心計算：全指標矩陣引擎 (包含短中長均線、乖離、動能、擺盪、波動率)
# ------------------------------------------------------------------------------
def compute_all_indicators(df_raw: pd.DataFrame) -> pd.DataFrame:
    """計算台股 20+ 項專業技術與量能指標"""
    df = df_raw.copy()

    # 1. 均線矩陣 (短中長期完整排列)
    df['ma5'] = df['close'].rolling(5).mean()
    df['ma10'] = df['close'].rolling(10).mean()
    df['ma20'] = df['close'].rolling(20).mean()
    df['ma60'] = df['close'].rolling(60).mean()
    df['ma120'] = df['close'].rolling(120).mean()
    df['ma240'] = df['close'].rolling(240).mean()

    # 2. 乖離率 (BIAS)
    df['bias_5'] = ((df['close'] - df['ma5']) / df['ma5']) * 100
    df['bias_20'] = ((df['close'] - df['ma20']) / df['ma20']) * 100

    # 3. 累積動能報酬率 (1d / 3d / 5d)
    df['ret_1d'] = df['close'].pct_change(1) * 100
    df['ret_3d'] = df['close'].pct_change(3) * 100
    df['ret_5d'] = df['close'].pct_change(5) * 100

    # 4. RSI (14日相對強弱指標)
    delta = df['close'].diff()
    gain = (delta.where(delta > 0, 0)).ewm(com=13, adjust=False).mean()
    loss = (-delta.where(delta < 0, 0)).ewm(com=13, adjust=False).mean()
    rs = gain / loss.replace(0, np.nan)
    df['rsi_14'] = 100 - (100 / (1 + rs))

    # 5. MACD (DIF, DEM, 柱狀體)
    ema12 = df['close'].ewm(span=12, adjust=False).mean()
    ema26 = df['close'].ewm(span=26, adjust=False).mean()
    df['macd_dif'] = ema12 - ema26
    df['macd_dem'] = df['macd_dif'].ewm(span=9, adjust=False).mean()
    df['macd_hist'] = df['macd_dif'] - df['macd_dem']

    # 6. 布林通道 (Bollinger Bands & BB Width)
    df['bb_mid'] = df['ma20']
    df['bb_std'] = df['close'].rolling(20).std()
    df['bb_upper'] = df['bb_mid'] + (df['bb_std'] * 2)
    df['bb_lower'] = df['bb_mid'] - (df['bb_std'] * 2)
    df['bb_width'] = ((df['bb_upper'] - df['bb_lower']) / df['bb_mid'].replace(0, np.nan)) * 100

    # 7. ATR (14日真實波幅與停損建議)
    high_low = df['high'] - df['low']
    high_close = (df['high'] - df['close'].shift()).abs()
    low_close = (df['low'] - df['close'].shift()).abs()
    tr = pd.concat([high_low, high_close, low_close], axis=1).max(axis=1)
    df['atr_14'] = tr.ewm(com=13, adjust=False).mean()

    # 8. 量能均線 (Vol MA5 / MA20)
    df['vol_ma5'] = df['volume'].rolling(5).mean()
    df['vol_ma20'] = df['volume'].rolling(20).mean()

    return df

# ------------------------------------------------------------------------------
# 📊 核心分析函數：單檔技術與量能視覺化診斷 (含多層圖表與完整指標診斷表)
# ------------------------------------------------------------------------------
def analyze_stock(ticker: str, period: str):
    """
    下載指定標的歷史數據、計算全方位量化指標、繪製四層 Plotly 圖表並產出診斷報表
    """
    if not ticker or not ticker.strip():
        return go.Figure(), "⚠️ 請輸入有效的台股代號（例如: 2330.TW 或 2317）", pd.DataFrame()

    ticker_clean = ticker.strip().upper()
    if not (ticker_clean.endswith(".TW") or ticker_clean.endswith(".TWO") or "^" in ticker_clean):
        ticker_clean += ".TW"

    try:
        # 下載股票歷史數據 (自動關閉 auto_adjust 以保留標準原始價格)
        df_raw = yf.download(ticker_clean, period=period, progress=False, auto_adjust=False)
        if df_raw.empty or len(df_raw) < 5:
            return go.Figure(), f"❌ 無法取得【{ticker_clean}】的歷史數據，請確認代號是否正確或市場休市中。", pd.DataFrame()

        df = _fix_col_names(df_raw)
        df.index = pd.to_datetime(df.index)
        df = compute_all_indicators(df)

        latest = df.iloc[-1]

        # ----------------------------------------------------------------------
        # 🎨 建構 Plotly 4 層全景量化圖表
        # ----------------------------------------------------------------------
        fig = make_subplots(
            rows=4, cols=1,
            shared_xaxes=True,
            vertical_spacing=0.03,
            row_heights=[0.48, 0.16, 0.18, 0.18],
            subplot_titles=(
                f"📈 {ticker_clean} K線走勢、均線矩陣 (MA5/20/60) 與布林通道",
                "⚡ RSI(14) 動能擺盪指標",
                "📊 MACD 雙均線差離與紅綠柱狀體",
                "📦 成交量與 ATR(14) 波動區間"
            )
        )

        # Layer 1: K線 + 均線 + 布林帶
        fig.add_trace(go.Candlestick(
            x=df.index, open=df['open'], high=df['high'], low=df['low'], close=df['close'],
            name="K線", increasing_line_color="#ef4444", decreasing_line_color="#22c55e"
        ), row=1, col=1)
        fig.add_trace(go.Scatter(x=df.index, y=df['ma5'], line=dict(color='#f59e0b', width=1.2), name='MA5(週線)'), row=1, col=1)
        fig.add_trace(go.Scatter(x=df.index, y=df['ma20'], line=dict(color='#3b82f6', width=1.6), name='MA20(月線)'), row=1, col=1)
        fig.add_trace(go.Scatter(x=df.index, y=df['ma60'], line=dict(color='#8b5cf6', width=1.4), name='MA60(季線)'), row=1, col=1)
        fig.add_trace(go.Scatter(x=df.index, y=df['bb_upper'], line=dict(color='rgba(156,163,175,0.6)', dash='dash'), name='布林上軌'), row=1, col=1)
        fig.add_trace(go.Scatter(x=df.index, y=df['bb_lower'], line=dict(color='rgba(156,163,175,0.6)', dash='dash'), name='布林下軌'), row=1, col=1)

        # Layer 2: RSI
        fig.add_trace(go.Scatter(x=df.index, y=df['rsi_14'], line=dict(color='#ec4899', width=1.5), name='RSI(14)'), row=2, col=1)
        fig.add_hline(y=70, line_dash="dot", line_color="#ef4444", row=2, col=1)
        fig.add_hline(y=30, line_dash="dot", line_color="#22c55e", row=2, col=1)

        # Layer 3: MACD
        hist_colors = ['#ef4444' if (v or 0) >= 0 else '#22c55e' for v in df['macd_hist']]
        fig.add_trace(go.Bar(x=df.index, y=df['macd_hist'], marker_color=hist_colors, name='MACD柱狀體'), row=3, col=1)
        fig.add_trace(go.Scatter(x=df.index, y=df['macd_dif'], line=dict(color='#f97316', width=1.2), name='DIF快線'), row=3, col=1)
        fig.add_trace(go.Scatter(x=df.index, y=df['macd_dem'], line=dict(color='#06b6d4', width=1.2), name='DEM慢線'), row=3, col=1)

        # Layer 4: Volume & ATR
        vol_colors = ['#ef4444' if df['close'].iloc[i] >= df['open'].iloc[i] else '#22c55e' for i in range(len(df))]
        fig.add_trace(go.Bar(x=df.index, y=df['volume'], marker_color=vol_colors, opacity=0.4, name='成交量'), row=4, col=1)
        fig.add_trace(go.Scatter(x=df.index, y=df['vol_ma5'], line=dict(color='#eab308', width=1.1), name='5日均量'), row=4, col=1)

        fig.update_layout(
            height=850,
            template="plotly_white",
            xaxis_rangeslider_visible=False,
            margin=dict(l=30, r=30, t=40, b=30),
            legend=dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1)
        )

        # ----------------------------------------------------------------------
        # 📋 產生結構化全指標診斷表 (符合多空量化矩陣)
        # ----------------------------------------------------------------------
        close_p = latest['close']
        ma5_p = latest['ma5']
        ma20_p = latest['ma20']
        ma60_p = latest['ma60']
        bias20_v = latest['bias_20']
        rsi_v = latest['rsi_14']
        macd_h = latest['macd_hist']
        bb_w = latest['bb_width']
        atr_v = latest['atr_14']
        suggested_stop = close_p - (atr_v * 1.5)

        sig_ma_short = "⬆️ 偏多" if (close_p > ma20_p and ma5_p > ma20_p) else "⬇️ 偏空" if (close_p < ma20_p) else "➖ 中立"
        sig_ma_long = "⬆️ 偏多" if (pd.notna(ma60_p) and close_p > ma60_p) else "➖ 中立"
        sig_bias = "⚠️ 超買乖離" if bias20_v > 8 else "🟢 超賣反彈" if bias20_v < -8 else "➖ 常態區間"
        sig_ret = "⬆️ 動能推升" if (latest['ret_1d'] > 0 and latest['ret_3d'] > 0) else "⬇️ 動能趨緩"
        sig_rsi = "🔥 處超買區 (>70)" if rsi_v > 70 else "❄️ 處超賣區 (<30)" if rsi_v < 30 else "⬆️ 多方主控" if rsi_v >= 50 else "⬇️ 空方主控"
        sig_macd = "⬆️ 紅柱多頭進攻" if macd_h > 0 else "⬇️ 綠柱空頭承壓"
        sig_bb = "🚀 帶寬擴張發散" if bb_w > 8 else "➖ 帶寬壓縮盤整"

        report_table_data = [
            {"指標名稱": "MA5 / MA10 / MA20 (短中期均線)", "類別": "均線與趨勢", "即時數值": f"{latest['ma5']:.1f} / {latest['ma10']:.1f} / {latest['ma20']:.1f}", "多空訊號": sig_ma_short, "策略意義": "月線之上維持多頭排列" if sig_ma_short == "⬆️ 偏多" else "跌破月線轉為整理"},
            {"指標名稱": "MA60 / MA120 / MA240 (長期均線矩陣)", "類別": "均線與趨勢", "即時數值": f"{latest['ma60']:.1f} / {latest.get('ma120', np.nan):.1f} / {latest.get('ma240', np.nan):.1f}", "多空訊號": sig_ma_long, "策略意義": "季線強固多頭支撐" if sig_ma_long == "⬆️ 偏多" else "中長期均線橫向糾結"},
            {"指標名稱": "20日乖離率 (Bias 20)", "類別": "動能與擺盪", "即時數值": f"{bias20_v:+.2f}%", "多空訊號": sig_bias, "策略意義": "處於合理安全常態範圍" if sig_bias == "➖ 常態區間" else "留意正負乖離過大之拉回風險"},
            {"指標名稱": "1d / 3d / 5d 累積報酬率", "類別": "動能與擺盪", "即時數值": f"{latest['ret_1d']:+.2f}% / {latest['ret_3d']:+.2f}% / {latest['ret_5d']:+.2f}%", "多空訊號": sig_ret, "策略意義": "短線多方動能連續推進" if sig_ret == "⬆️ 動能推升" else "短線出現震盪調節"},
            {"指標名稱": "RSI (14) 相對強弱指標", "類別": "動能與擺盪", "即時數值": f"{rsi_v:.1f}", "多空訊號": sig_rsi, "策略意義": "多方主控進攻區間" if rsi_v >= 50 else "空方主導偏弱震盪"},
            {"指標名稱": "MACD (DIF / DEM / 柱狀體)", "類別": "動能與擺盪", "即時數值": f"{latest['macd_dif']:.2f} / {latest['macd_dem']:.2f} / {macd_h:+.2f}", "多空訊號": sig_macd, "策略意義": "紅柱放大 偏多進攻" if macd_h > 0 else "綠柱延伸 偏空整理"},
            {"指標名稱": "布林通道帶寬 (BB Width)", "類別": "波動與型態", "即時數值": f"{bb_w:.2f}%", "多空訊號": sig_bb, "策略意義": "喇叭開口 趨勢行情展開中" if bb_w > 8 else "通道壓縮 醞釀突破方向"},
            {"指標名稱": "ATR (14) 真實波幅停損建議", "類別": "波動與型態", "即時數值": f"{atr_v:.2f} 元 ({(atr_v/close_p)*100:.2f}%)", "多空訊號": "➖ 風控參考", "策略意義": f"動態追蹤停損建議設於 {suggested_stop:.2f} 元"}
        ]
        report_df = pd.DataFrame(report_table_data)

        # 診斷摘要文字
        summary_markdown = f"""### 🎯 【{ticker_clean}】最新量化多空深度總評
- **最新收盤價**：\`{close_p:.2f}\` 元 ｜ **單日漲跌**：\`{latest['ret_1d']:+.2f}%\` ｜ **成交量**：\`{int(latest['volume']):,}\` 股
- **核心均線 (MA20 月線)**：\`{ma20_p:.2f}\` 元 ｜ **月線乖離率**：\`{bias20_v:+.2f}%\`
- **動能擺盪**：RSI(14) 為 \`{rsi_v:.1f}\`，MACD 柱狀體為 \`{macd_h:+.2f}\`（{sig_macd}）
- **風控停損點**：依據 ATR(14) 計算，防守關鍵點建議設於 **\`{suggested_stop:.2f}\` 元**
"""
        return fig, summary_markdown, report_df

    except Exception as e:
        return go.Figure(), f"⚠️ 分析過程發生未預期錯誤：{str(e)}", pd.DataFrame()

# ------------------------------------------------------------------------------
# 🎯 自選股雷達函數：批次多股掃描 (含收盤價、漲跌幅、MA20、RSI、多空訊號)
# ------------------------------------------------------------------------------
def scan_watchlist(watchlist_str: str) -> pd.DataFrame:
    """
    掃描多檔自選股，計算並彙整關鍵指標，產出結構化雷達看板
    """
    if not watchlist_str or not watchlist_str.strip():
        return pd.DataFrame(columns=['股票代號', '最新收盤價', '單日漲跌幅', 'MA20(月線)', '20日乖離率', 'RSI(14)', '多空評定'])

    raw_symbols = [s.strip().upper() for s in watchlist_str.replace("，", ",").split(",") if s.strip()]
    results = []

    for sym in raw_symbols:
        ticker = sym if (sym.endswith(".TW") or sym.endswith(".TWO") or "^" in sym) else f"{sym}.TW"
        try:
            df_raw = yf.download(ticker, period="3mo", progress=False, auto_adjust=False)
            if df_raw.empty or len(df_raw) < 20:
                continue

            df = _fix_col_names(df_raw)
            close = float(df['close'].iloc[-1])
            prev_close = float(df['close'].iloc[-2]) if len(df) > 1 else close
            change_pct = ((close - prev_close) / prev_close) * 100

            ma20 = float(df['close'].rolling(20).mean().iloc[-1])
            bias20 = ((close - ma20) / ma20) * 100

            # RSI(14)
            delta = df['close'].diff()
            gain = (delta.where(delta > 0, 0)).ewm(com=13, adjust=False).mean()
            loss = (-delta.where(delta < 0, 0)).ewm(com=13, adjust=False).mean()
            rs = gain / loss.replace(0, np.nan)
            rsi = float((100 - (100 / (1 + rs))).iloc[-1])

            # 多空訊號綜合評定
            if close > ma20 and bias20 > 0 and rsi >= 50:
                signal = "🔥 多頭強勢"
            elif close < ma20 and bias20 < 0 and rsi < 50:
                signal = "❄️ 空頭弱勢"
            else:
                signal = "➖ 震盪整理"

            results.append({
                "股票代號": sym,
                "最新收盤價": f"{close:.2f}",
                "單日漲跌幅": f"{change_pct:+.2f}%",
                "MA20(月線)": f"{ma20:.2f}",
                "20日乖離率": f"{bias20:+.2f}%",
                "RSI(14)": f"{rsi:.1f}",
                "多空評定": signal
            })
        except Exception:
            continue

    if not results:
        return pd.DataFrame(columns=['股票代號', '最新收盤價', '單日漲跌幅', 'MA20(月線)', '20日乖離率', 'RSI(14)', '多空評定'])

    return pd.DataFrame(results)

# ------------------------------------------------------------------------------
# 🚀 Gradio Blocks 現代化 UI 介面架構
# ------------------------------------------------------------------------------
with gr.Blocks(theme=gr.themes.Soft(), title="台股 AI 綜合量化量能觀測儀表板") as app:
    gr.Markdown("# 📈 台股 AI 綜合量化量能觀測儀表板")
    gr.Markdown("結合 **短中長均線矩陣、動能加速指標、RSI / MACD / 布林通道、ATR 風控波幅** 之全方位視覺化看盤系統。")

    with gr.Tabs():
        # Tab 1: 單檔技術與模型透視
        with gr.TabItem("📊 單檔技術與模型透視"):
            with gr.Row():
                with gr.Column(scale=1):
                    ticker_input = gr.Dropdown(
                        label="選擇熱門股或手動輸入股票代號 (如: 2330.TW)",
                        choices=["2330.TW", "2317.TW", "2454.TW", "2303.TW", "2308.TW", "2603.TW", "^TWII"],
                        value="2330.TW",
                        allow_custom_value=True,
                        interactive=True
                    )
                    period_input = gr.Dropdown(
                        label="歷史分析區間",
                        choices=["1mo", "3mo", "6mo", "1y", "2y", "3y", "5y"],
                        value="1y"
                    )
                    analyze_btn = gr.Button("🚀 啟動量化綜合分析", variant="primary")

                with gr.Column(scale=2):
                    summary_output = gr.Markdown("請點擊左側【啟動量化綜合分析】按鈕以載入盤勢數據...")

            plot_output = gr.Plot(label="Plotly 4層全景量化走勢圖")

            gr.Markdown("### 📋 全方位量化指標多空診斷矩陣")
            table_output = gr.DataFrame(label="即時指標數據與策略解讀", interactive=False)

            analyze_btn.click(
                fn=analyze_stock,
                inputs=[ticker_input, period_input],
                outputs=[plot_output, summary_output, table_output],
                concurrency_limit=10
            )

        # Tab 2: 智慧自選股雷達
        with gr.TabItem("🎯 智慧自選股雷達"):
            with gr.Row():
                watchlist_input = gr.Textbox(
                    label="輸入自選股票清單 (以逗號分隔)",
                    value="2330, 2317, 2454, 2303, 2308, 3231, 2603, 0050",
                    lines=2
                )
                scan_btn = gr.Button("🔍 啟動多股即時雷達掃描", variant="primary")

            radar_output = gr.DataFrame(label="自選股即時量化雷達矩陣", interactive=False)

            scan_btn.click(
                fn=scan_watchlist,
                inputs=[watchlist_input],
                outputs=[radar_output],
                concurrency_limit=5
            )

if __name__ == "__main__":
    app.launch(share=True)
\`\`\`
`;

export const STEP22_RESCUE_CODE = `這是我準備好的 STEP 22 備用救援程式碼。請你直接回覆並輸出這段完整的 Python 程式碼，讓我能順利貼到 Colab 執行，不需額外解釋與修改邏輯：

\`\`\`python
# 根據筆記本中已知的依賴套件列表，自動生成 requirements.txt
# 這裡將使用在 \`7519ed5d\` cell 中列出的套件。
requirements_content = """
requests==2.32.4
pandas==2.2.3
numpy
scipy
scikit-learn
plotly
yfinance
FinMind
gradio
numba
anyio
google-genai
matplotlib
seaborn
ta
"""

with open('requirements.txt', 'w') as f:
    f.write(requirements_content.strip())

print("已成功生成 requirements.txt 檔案！內容如下：")
print("----------------------------------------")
print(requirements_content.strip())
print("----------------------------------------")
print("您可以使用 \`!cat requirements.txt\` 命令來查看檔案內容。")

# 嘗試啟動瀏覽器自動下載 (支援 Google Colab 環境)
try:
    from google.colab import files
    print("\n🚀 正在啟動瀏覽器自動下載 requirements.txt...")
    files.download('requirements.txt')
    print("📥 下載指令已送出！請檢查您電腦瀏覽器的「下載」資料夾。")
except Exception as e:
    print(f"💡 瀏覽器自動下載提示 (若未自動跳出): {e}")

print("\n📂 【手動下載備用指引】：")
print("👉 您也可以隨時點擊 Colab 左側面板的「📁 檔案」圖示")
print("👉 在檔案列表中找到 requirements.txt，按右鍵點選「下載」即可存至本機電腦！")
\`\`\`
`;

export const STEP23_RESCUE_CODE = `這是我準備好的 STEP 23 備用救援程式碼。請你直接回覆並輸出這段完整的 Python 程式碼，讓我能順利貼到 Colab 執行，不需額外解釋與修改邏輯：

\`\`\`python
# STEP 23: 分析程式碼重構為模組化 stock.py - 備用救援程式碼
import os

stock_analyzer_code = '''import pandas as pd
import numpy as np
import yfinance as yf
import requests
import plotly.graph_objects as go
import plotly.express as px
from plotly.subplots import make_subplots
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
try:
    from google.colab import userdata
except ImportError:
    userdata = None

class StockAnalyzer:
    def __init__(self, ticker):
        self.ticker = ticker
        self.df = pd.DataFrame()  # 主要存放K線數據
        self.df_fin = pd.DataFrame() # 存放財報數據
        self.df_inst_pivot = pd.DataFrame() # 存放法人籌碼
        self.df_margin_data = pd.DataFrame() # 存放融資融券數據
        self.df_futures_data = pd.DataFrame() # 存放外資台指期數據
        self.df_securities_lending = pd.DataFrame() # 存放借券數據
        self.df_extended = pd.DataFrame() # 綜合所有K線和籌碼數據
        self.ml_df = pd.DataFrame() # 機器學習的基礎數據
        self.mega_df_cleaned_final = pd.DataFrame() # 最終特徵矩陣
        self.final_feature_cols = []
        self.finmind_token = userdata.get('FINMIND_TOKEN') if userdata else None

    def _fix_col_names(self, df_param: pd.DataFrame) -> pd.DataFrame:
        """根據指定邏輯清洗 DataFrame 的欄位名稱。"""
        if isinstance(df_param.columns, pd.MultiIndex):
            df_param.columns = [col[0].lower() for col in df_param.columns]
        else:
            df_param.columns = [col.lower() for col in df_param.columns]

        df_param.columns.name = None

        if 'adj close' in df_param.columns:
            df_param['close'] = df_param['adj close']
        elif 'adj close' in df_param.columns and 'close' not in df_param.columns:
            df_param = df_param.rename(columns={'adj close': 'close'})

        required_cols = ['open', 'high', 'low', 'close', 'volume']
        df_param = df_param[[col for col in required_cols if col in df_param.columns]]
        return df_param

    def _fetch_finmind_api_data(self, dataset, data_id, start_date, end_date, is_futures=False, is_securities_lending=False, use_mock_data=True):
        """統一處理 FinMind API 數據獲取和錯誤處理，支持模擬數據。"""
        url = "https://api.finmindtrade.com/api/v4/data"

        params = {
            "dataset": dataset,
            "data_id": data_id,
            "start_date": start_date,
            "end_date": end_date,
            "token": self.finmind_token
        }

        df_output = pd.DataFrame()

        try:
            resp = requests.get(url, params=params, timeout=10)
            resp.raise_for_status() # 檢查請求是否成功
            data = resp.json()

            if data.get('data'):
                df_output = pd.DataFrame(data['data'])
                df_output['date'] = pd.to_datetime(df_output['date'])
                df_output = df_output.set_index('date').sort_index()
                print(f"成功獲取 {dataset} 數據。")
            else:
                print(f"FinMind API 未回傳 {dataset} 數據，請檢查參數或 Token。將使用模擬數據。")
                if use_mock_data:
                    raise ValueError(f"No data from API for {dataset}")

        except (requests.exceptions.RequestException, ValueError) as e:
            print(f"獲取 {dataset} 數據時發生錯誤: {e}。將使用模擬數據。")
            if use_mock_data:
                # 生成模擬數據
                date_range = pd.date_range(start=start_date, end=end_date)
                if is_futures: # 台指期數據模擬
                    simulated_net_oi = np.random.randint(-15000, 15000, len(date_range))
                    df_output = pd.DataFrame({'Foreign_TX_Net_OI': simulated_net_oi}, index=date_range)
                elif is_securities_lending: # 借券賣出餘額數據模擬
                    simulated_sell_balance = np.random.randint(1000, 50000, len(date_range))
                    df_output = pd.DataFrame({'sell_balance': simulated_sell_balance}, index=date_range)
                else: # 融資融券數據模擬
                    simulated_margin_purchase = np.random.randint(15000, 35000, len(date_range))
                    simulated_short_sale = np.random.randint(500, 5000, len(date_range))
                    df_output = pd.DataFrame({
                        'stock_id': data_id,
                        'MarginPurchaseTodayBalance': simulated_margin_purchase,
                        'ShortSaleTodayBalance': simulated_short_sale
                    }, index=date_range)

        return df_output


    def fetch_data(self, period='3y'):
        """下載股票數據，並進行初步清洗與技術指標計算。"""
        print(f"\\n--- STEP 1: 下載 {self.ticker} 股票數據 ({period}) ---")
        self.df = yf.download(self.ticker, period=period, progress=False)
        if self.df.empty:
            raise ValueError(f"無法取得 {self.ticker} 的股票數據。請檢查股票代號或時間區間。")

        self.df = self._fix_col_names(self.df)
        self.df.index = pd.to_datetime(self.df.index)

        # 計算均線 (MA5, MA20, MA60, MA120, MA240)
        self.df['ma5'] = self.df['close'].rolling(window=5).mean()
        self.df['ma20'] = self.df['close'].rolling(window=20).mean()
        self.df['ma60'] = self.df['close'].rolling(window=60).mean()
        self.df['ma120'] = self.df['close'].rolling(window=120).mean()
        self.df['ma240'] = self.df['close'].rolling(window=240).mean()

        # 計算 RSI(14)
        delta = self.df['close'].diff()
        gain = delta.where(delta > 0, 0)
        loss = (-delta).where(delta < 0, 0)
        avg_gain = gain.ewm(com=13, adjust=False).mean()
        avg_loss = loss.ewm(com=13, adjust=False).mean()
        rs = avg_gain / avg_loss
        self.df['rsi'] = 100 - (100 / (1 + rs))

        # 計算 MACD
        self.df['ema12'] = self.df['close'].ewm(span=12, adjust=False).mean()
        self.df['ema26'] = self.df['close'].ewm(span=26, adjust=False).mean()
        self.df['macd_line'] = self.df['ema12'] - self.df['ema26']
        self.df['signal_line'] = self.df['macd_line'].ewm(span=9, adjust=False).mean()
        self.df['macd_histogram'] = self.df['macd_line'] - self.df['signal_line']

        # 計算布林通道 (Bollinger Bands)
        window = 20
        self.df['middle_band'] = self.df['close'].rolling(window=window).mean()
        self.df['std_dev'] = self.df['close'].rolling(window=window).std()
        self.df['upper_band'] = self.df['middle_band'] + (self.df['std_dev'] * 2)
        self.df['lower_band'] = self.df['middle_band'] - (self.df['std_dev'] * 2)

        # 計算 ATR
        high_minus_low = self.df['high'] - self.df['low']
        high_minus_prev_close = abs(self.df['high'] - self.df['close'].shift(1))
        low_minus_prev_close = abs(self.df['low'] - self.df['close'].shift(1))
        self.df['tr'] = pd.concat([high_minus_low, high_minus_prev_close, low_minus_prev_close], axis=1).max(axis=1)
        self.df['atr'] = self.df['tr'].ewm(span=14, adjust=False).mean()

        print(f"成功下載並清洗 {self.ticker} 數據，並計算基礎技術指標。")

    def fetch_external_data(self):
        """獲取 FinMind 等外部數據，如法人籌碼、融資融券、期貨借券等。"""
        print("\\n--- STEP 7: 獲取外部數據 (財報、法人籌碼、融資融券、期貨借券) ---")
        end_date = self.df.index.max()
        start_date_three_year = (end_date - pd.Timedelta(days=1095)).strftime('%Y-%m-%d')
        start_date_one_year = (end_date - pd.Timedelta(days=365)).strftime('%Y-%m-%d')
        str_end = end_date.strftime('%Y-%m-%d')

        # 財報數據
        ticker_yf = yf.Ticker(self.ticker)
        try:
            quarterly_financials = ticker_yf.quarterly_income_stmt
            if not quarterly_financials.empty:
                recent_financials_raw = quarterly_financials.iloc[:, :12]
                df_fin_transposed = recent_financials_raw.T
                total_revenue_col = 'Total Revenue'
                gross_profit_col = 'Gross Profit'
                cost_of_revenue_col = 'Cost Of Revenue'

                if total_revenue_col in df_fin_transposed.columns:
                    if gross_profit_col in df_fin_transposed.columns:
                        self.df_fin = df_fin_transposed[[total_revenue_col, gross_profit_col]].copy()
                    elif cost_of_revenue_col in df_fin_transposed.columns:
                        self.df_fin = df_fin_transposed[[total_revenue_col, cost_of_revenue_col]].copy()
                        self.df_fin[total_revenue_col] = pd.to_numeric(self.df_fin[total_revenue_col], errors='coerce')
                        self.df_fin[cost_of_revenue_col] = pd.to_numeric(self.df_fin[cost_of_revenue_col], errors='coerce')
                        self.df_fin[gross_profit_col] = self.df_fin[total_revenue_col] - self.df_fin[cost_of_revenue_col]
                    self.df_fin.index = pd.to_datetime(self.df_fin.index)
                    self.df_fin = self.df_fin.sort_index()
                    self.df_fin['GrossProfitMargin'] = (self.df_fin[gross_profit_col] / self.df_fin[total_revenue_col]) * 100
                    self.df_fin['GrossProfitMargin'] = self.df_fin['GrossProfitMargin'].replace([float('inf'), -float('inf')], pd.NA).fillna(pd.NA)
                print("成功獲取財報數據。")
            else:
                print("無法取得季度損益表數據。")
        except Exception as e:
            print(f"取得財報數據提示: {e}")

        # 法人買賣超
        clean_id = self.ticker.replace('.TW', '').replace('.TWO', '')
        df_inst = self._fetch_finmind_api_data(
            dataset="TaiwanStockInstitutionalInvestorsBuySell",
            data_id=clean_id,
            start_date=start_date_three_year,
            end_date=str_end
        )
        if not df_inst.empty and 'buy' in df_inst.columns and 'sell' in df_inst.columns:
            df_inst['net_buy_sell'] = df_inst['buy'] - df_inst['sell']
            df_inst_filtered = df_inst[df_inst['name'].isin(['Foreign_Investor', 'Investment_Trust'])].copy()
            if not df_inst_filtered.empty:
                self.df_inst_pivot = df_inst_filtered.reset_index().pivot_table(index='date', columns='name', values='net_buy_sell').fillna(0)
                self.df_inst_pivot = self.df_inst_pivot.rename(columns={
                    'Foreign_Investor': '外資累積買賣超',
                    'Investment_Trust': '投信累積買賣超'
                })
                if '外資累積買賣超' in self.df_inst_pivot.columns:
                    self.df_inst_pivot['外資累積買賣超'] = self.df_inst_pivot['外資累積買賣超'].cumsum()
                if '投信累積買賣超' in self.df_inst_pivot.columns:
                    self.df_inst_pivot['投信累積買賣超'] = self.df_inst_pivot['投信累積買賣超'].cumsum()

        # 融資融券數據
        self.df_margin_data = self._fetch_finmind_api_data(
            dataset="TaiwanStockMarginPurchaseShortSale",
            data_id=clean_id,
            start_date=start_date_three_year,
            end_date=str_end
        )
        if not self.df_margin_data.empty and 'ShortSaleTodayBalance' in self.df_margin_data.columns and 'MarginPurchaseTodayBalance' in self.df_margin_data.columns:
            self.df_margin_data['short_margin_ratio'] = self.df_margin_data['ShortSaleTodayBalance'] / self.df_margin_data['MarginPurchaseTodayBalance']
            self.df_margin_data['short_margin_ratio'] = self.df_margin_data['short_margin_ratio'].replace([np.inf, -np.inf], np.nan).fillna(0)

        # 外資台指期法人數據
        self.df_futures_data = self._fetch_finmind_api_data(
            dataset="TaiwanFuturesInstitutionalInvestors",
            data_id="TX",
            start_date=start_date_one_year,
            end_date=str_end,
            is_futures=True
        )
        if not self.df_futures_data.empty and 'institutional_investors' in self.df_futures_data.columns:
            df_foreign_futures = self.df_futures_data[self.df_futures_data['institutional_investors'] == '外資'].copy()
            self.df_futures_data = pd.DataFrame(index=df_foreign_futures.index)
            self.df_futures_data['Foreign_TX_Net_OI'] = df_foreign_futures['long_open_interest_balance_volume'] - df_foreign_futures['short_open_interest_balance_volume']

        # 借券賣出餘額
        self.df_securities_lending = self._fetch_finmind_api_data(
            dataset="TaiwanStockSecuritiesLending",
            data_id=clean_id,
            start_date=start_date_one_year,
            end_date=str_end,
            is_securities_lending=True
        )
        if not self.df_securities_lending.empty and 'volume' in self.df_securities_lending.columns:
            self.df_securities_lending = self.df_securities_lending.groupby('date')['volume'].sum().to_frame(name='sell_balance')

        print("外部數據獲取完成。")

    def engineer_features(self):
        """結合所有數據，建構 AI 模型所需的複合特徵矩陣。"""
        print("\\n--- STEP 8: 建構複合特徵矩陣 ---")

        self.df_extended = self.df.copy()

        # 合併法人買賣超
        if not self.df_inst_pivot.empty:
            self.df_extended = pd.merge(
                self.df_extended,
                self.df_inst_pivot,
                left_index=True,
                right_index=True,
                how='left'
            )

        # 合併融資融券
        if not self.df_margin_data.empty:
            cols = [c for c in ['MarginPurchaseTodayBalance', 'ShortSaleTodayBalance', 'short_margin_ratio'] if c in self.df_margin_data.columns]
            self.df_extended = pd.merge(
                self.df_extended,
                self.df_margin_data[cols],
                left_index=True,
                right_index=True,
                how='left'
            )

        # 合併外資台指期
        if not self.df_futures_data.empty:
            self.df_extended = pd.merge(
                self.df_extended,
                self.df_futures_data[['Foreign_TX_Net_OI']],
                left_index=True,
                right_index=True,
                how='left'
            )

        # 合併借券
        if not self.df_securities_lending.empty:
            self.df_extended = pd.merge(
                self.df_extended,
                self.df_securities_lending[['sell_balance']],
                left_index=True,
                right_index=True,
                how='left'
            )

        self.df_extended = self.df_extended.ffill().fillna(0)
        self.ml_df = self.df_extended.copy()

        # 基礎技術特徵
        self.ml_df['Bias_20'] = ((self.ml_df['close'] - self.ml_df['ma20']) / self.ml_df['ma20']) * 100
        self.ml_df['Daily_Return'] = self.ml_df['close'].pct_change() * 100
        self.ml_df['RSI'] = self.ml_df['rsi']

        # 動能特徵
        self.ml_df['Daily_Return_1d'] = self.ml_df['close'].pct_change(periods=1) * 100
        self.ml_df['Daily_Return_3d'] = self.ml_df['close'].pct_change(periods=3) * 100
        self.ml_df['Daily_Return_5d'] = self.ml_df['close'].pct_change(periods=5) * 100
        self.ml_df['MACD_Histogram'] = self.ml_df['macd_histogram']

        # 波動率與型態
        self.ml_df['BB_Width'] = ((self.ml_df['upper_band'] - self.ml_df['lower_band']) / self.ml_df['middle_band']) * 100
        self.ml_df['Normalized_ATR'] = (self.ml_df['atr'] / self.ml_df['close'] * 100)

        # 跨市場特徵
        cross_market_tickers = {'^SOX': 'SOX_Change', '^TNX': 'TNX_Change', '^VIX': 'VIX_Change'}
        for ticker, col_name in cross_market_tickers.items():
            try:
                cross_market_data = yf.download(ticker, period='3y', progress=False)
                if not cross_market_data.empty:
                    close_col = cross_market_data['Close'] if 'Close' in cross_market_data.columns else cross_market_data.iloc[:, 0]
                    self.ml_df[col_name] = close_col.pct_change() * 100
                    self.ml_df[col_name] = self.ml_df[col_name].reindex(self.ml_df.index, method='ffill').fillna(0)
                else:
                    self.ml_df[col_name] = 0.0
            except Exception:
                self.ml_df[col_name] = 0.0

        # Lead-Lag 領先特徵
        lag_periods = [1, 3, 5]
        for col in ['Foreign_TX_Net_OI', 'sell_balance']:
            if col in self.ml_df.columns:
                for lag in lag_periods:
                    self.ml_df[f'{col}_Lag{lag}'] = self.ml_df[col].shift(lag)

        # 標籤工程
        self.ml_df['Next_Close'] = self.ml_df['close'].shift(-1)
        self.ml_df['Target'] = (self.ml_df['Next_Close'] > self.ml_df['close']).astype(int)

        self.mega_df_cleaned_final = self.ml_df.dropna()

        potential_cols = [
            'Bias_20', 'Daily_Return', 'RSI', 'Foreign_TX_Net_OI', 'sell_balance',
            'Daily_Return_1d', 'Daily_Return_3d', 'Daily_Return_5d', 'MACD_Histogram',
            'BB_Width', 'Normalized_ATR', 'SOX_Change', 'TNX_Change', 'VIX_Change',
            'Foreign_TX_Net_OI_Lag1', 'Foreign_TX_Net_OI_Lag3', 'Foreign_TX_Net_OI_Lag5',
            'sell_balance_Lag1', 'sell_balance_Lag3', 'sell_balance_Lag5'
        ]
        self.final_feature_cols = [col for col in potential_cols if col in self.mega_df_cleaned_final.columns]

        print("複合特徵矩陣建構完成。")


    def run_ai_analysis(self):
        """訓練 AI 模型並進行回測。"""
        print("\\n--- STEP 9: 運行 AI 模型分析與回測 ---")
        if self.mega_df_cleaned_final.empty or 'Target' not in self.mega_df_cleaned_final.columns:
            print("錯誤：特徵矩陣為空或缺少 'Target' 欄位，無法進行 AI 分析。")
            return

        X = self.mega_df_cleaned_final[self.final_feature_cols]
        y = self.mega_df_cleaned_final['Target']

        if len(X) < 2:
            print("錯誤：數據點不足，無法分割訓練集和測試集並訓練模型。")
            return

        test_size = 0.2 if len(X) > 5 else 0.5
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=test_size, shuffle=False)

        model = RandomForestClassifier(n_estimators=200, random_state=42)
        model.fit(X_train, y_train)
        y_pred = model.predict(X_test)

        accuracy = accuracy_score(y_test, y_pred)
        print(f"模型在測試集上的準確度: {accuracy:.2f}")

        # 回測部分
        backtest_df = pd.DataFrame(index=X_test.index)
        backtest_df['Daily_Return'] = self.mega_df_cleaned_final.loc[X_test.index, 'Daily_Return']
        backtest_df['Signal'] = y_pred

        backtest_df['Strategy_Raw_Return'] = backtest_df['Signal'].shift(1) * backtest_df['Daily_Return']
        backtest_df['Buy_Hold_Return'] = backtest_df['Daily_Return']

        position_change = backtest_df['Signal'].shift(1).diff().abs()
        transaction_cost_per_trade = 0.003
        backtest_df['Transaction_Cost'] = position_change * transaction_cost_per_trade * 100
        backtest_df['Strategy_Net_Return'] = backtest_df['Strategy_Raw_Return'] - backtest_df['Transaction_Cost'].fillna(0)

        backtest_df['Buy_Hold_Cumulative'] = (1 + backtest_df['Buy_Hold_Return'].fillna(0) / 100).cumprod()
        backtest_df['Strategy_Cumulative'] = (1 + backtest_df['Strategy_Net_Return'].fillna(0) / 100).cumprod()

        final_buy_hold_return = (backtest_df['Buy_Hold_Cumulative'].iloc[-1] - 1) * 100 if not backtest_df.empty else 0
        final_strategy_return = (backtest_df['Strategy_Cumulative'].iloc[-1] - 1) * 100 if not backtest_df.empty else 0

        print(f"買進持有最終累積總報酬率: {final_buy_hold_return:.2f}%")
        print(f"AI 策略最終累積總報酬率 (含成本): {final_strategy_return:.2f}%")

        feature_importances = model.feature_importances_
        feature_importance_df = pd.DataFrame({
            'Feature': X_train.columns,
            'Importance': feature_importances
        }).sort_values(by='Importance', ascending=False)
        print("\\n特徵重要性 (Top 5):")
        print(feature_importance_df.head())

        fig = go.Figure()
        fig.add_trace(go.Scatter(x=backtest_df.index, y=backtest_df['Buy_Hold_Cumulative'], mode='lines', name='買進持有', line=dict(color='blue', width=2)))
        fig.add_trace(go.Scatter(x=backtest_df.index, y=backtest_df['Strategy_Cumulative'], mode='lines', name='AI 策略 (含成本)', line=dict(color='red', width=2)))
        fig.update_layout(
            title_text=f"{self.ticker} 買進持有 vs. AI 策略累積報酬率對比",
            template='plotly_white',
            xaxis_title="日期",
            yaxis_title="累積淨值",
            xaxis_rangeslider_visible=False
        )
        fig.show()

if __name__ == '__main__':
    try:
        analyzer = StockAnalyzer('2330.TW')
        analyzer.fetch_data(period='3y')
        analyzer.fetch_external_data()
        analyzer.engineer_features()
        analyzer.run_ai_analysis()
    except Exception as e:
        print(f"執行提示: {e}")
'''

# 寫入 stock.py 檔案
with open('stock.py', 'w', encoding='utf-8') as f:
    f.write(stock_analyzer_code)

print("=" * 60)
print(f"✅ stock.py 模組化檔案已成功自動建立！路徑：{os.path.abspath('stock.py')}")
print("=" * 60)

# 嘗試啟動瀏覽器自動下載 (支援 Google Colab 環境)
try:
    from google.colab import files
    print("🚀 正在啟動瀏覽器自動下載 stock.py...")
    files.download('stock.py')
    print("📥 下載指令已送出！請檢查您電腦瀏覽器的「下載」資料夾。")
except Exception as e:
    print(f"💡 瀏覽器自動下載提示 (若未自動跳出): {e}")

print("\\n📂 【手動下載備用指引】：")
print("👉 您也可以隨時點擊 Colab 左側面板的「📁 檔案」圖示")
print("👉 在檔案列表中找到 stock.py，按右鍵點選「下載」即可存至本機電腦！")
print("\\n🎉 STEP 23 完成！stock.py 與 requirements.txt 已備妥，可進行 STEP 24 Hugging Face 線上部署！")
\`\`\`
`;

export const STEP24_RESCUE_CODE = `這是我準備好的 STEP 24「線上網站部署 (Colab 股市工具一鍵變 Web App)」雲端發布指南與應急說明。

⚠️ **【重要觀念說明】：本步驟【完全不需要再回到 Colab 貼上或執行任何程式碼】！**
因為在 STEP 22 (requirements.txt) 與 STEP 23 (stock.py) 您已經透過自動下載或檔案面板將這兩個檔案儲存至您的電腦。STEP 24 的所有操作均直接在 **Hugging Face 官方網站** 上進行。

---

### 🌐 【Hugging Face Spaces 部署 4 步全流程】

#### 1️⃣ 建立 Gradio Space
- 前往 [huggingface.co](https://huggingface.co/) 註冊/登入 ➔ 點右上角頭像 ➔ **「+ New Space」**。
- **Space name**: 輸入自訂專案名（如 \`taiwan-stock-dashboard\`）。
- **Space SDK**: 選擇 👉 **\`Gradio\`**。
- **Space hardware**: 選擇 👉 **\`CPU Basic (Free)\`**。
- 點擊頁面底部的 **「Create Space」**。

#### 2️⃣ 上傳 requirements.txt 與 app.py
- 進入 Space 頁面，點選頂部 **「Files」** 頁籤 ➔ 點選 **「+ Add file」** ➔ **「Upload files」**。
- 將電腦下載好的 \`requirements.txt\` 與 \`stock.py\` 拖曳上傳。
  *(💡 小秘訣：若檔案名為 stock.py，建議直接在電腦上重新命名為 \`app.py\` 後再上傳，Hugging Face 會自動視為預設進入點)*
- 點擊 **「Commit changes to main」**。

#### 3️⃣ 🔑 安全設定 FinMind Token 與 Gemini API Key (絕對不外洩)
若您的系統有使用到法人籌碼/借券數據或 Gemini AI 策略解析：
- 切換至 Space 頂部的 **「Settings」** (設定) 頁籤。
- 往下滑找到 **「Variables and secrets」** 區塊。
- 點擊 **「New secret」** 分別新增兩筆密鑰：
  * **密鑰一 (Gemini AI)**：
    - Name: \`GEMINI_API_KEY\`
    - Value: 填入您的 Google Gemini API Key
  * **密鑰二 (FinMind 台股籌碼)**：
    - Name: \`FINMIND_TOKEN\`
    - Value: 填入您的 FinMind API Token
- 點擊 **「Save」** 儲存。平台會以加密環境變數自動注入容器，程式碼即可透過 \`os.environ.get('KEY')\` 安全讀取！

#### 4️⃣ 自動建置 (Build) 與上線營運
- 切換回 **「App」** 頁籤，上方狀態會顯示 🟡 **Building**。
- 點擊可展開 Build Logs 查看套件安裝進度。
- 當狀態變為 🟢 **Running** (綠燈) 時，您的台股量化盯盤系統就正式在雲端上線囉！
- 複製 Space 網址即可分享給好友或在手機瀏覽器中隨時看盤！
`;

