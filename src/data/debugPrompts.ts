export interface StepDebugInfo {
  stepId: number;
  stepTitle: string;
  category: string;
  commonErrorTag: string;
  commonErrors: {
    title: string;
    reason: string;
    quickFix: string;
  }[];
  debugPrompt: string;
}

export const STEP_DEBUG_PROMPTS: Record<number, StepDebugInfo> = {
  1: {
    stepId: 1,
    stepTitle: "啟動環境與套件安裝",
    category: "環境與資料",
    commonErrorTag: "套件依賴衝突 / 金鑰未找到",
    commonErrors: [
      {
        title: "pip dependency conflicts (google-colab vs pandas/requests)",
        reason: "Colab 預設環境套件版本與最新 pip 安裝包產生衝突。",
        quickFix: "在 pip 指令加上 `--upgrade gradio anyio` 並指定相容版本。"
      },
      {
        title: "SecretNotFoundError: 'GEMINI_API_KEY' or 'FINMIND_TOKEN'",
        reason: "尚未在 Colab 左側鑰匙圖示 🔑 設定對應的金鑰名稱與存取權限。",
        quickFix: "至 Colab 左側點選 🔑 新增金鑰並開啟「Notebook access」開關。"
      }
    ],
    debugPrompt: `# 【STEP 1 專屬除錯提示語：環境與金鑰設定】
我正在執行《台股 AI 盯盤系統》的「STEP 1: 啟動環境與套件安裝」，在 Colab 執行時發生了以下錯誤：

【錯誤訊息 / 報錯內容】：
[請在此貼上 Colab 的紅色錯誤文字或報錯訊息]

【本步驟目標】：
1. 使用 pip 安裝 requests, pandas, numpy, plotly, yfinance, scikit-learn, FinMind, gradio 等分析套件。
2. 透過 google.colab.userdata 讀取 GEMINI_API_KEY 與 FINMIND_TOKEN。

請以資深 Python 與 Colab 專家的角度，幫我排查依賴版本衝突或金鑰讀取失敗的原因，並提供修正後可直接複製執行的完整程式碼（禁止產生新檔案，直接給出儲存格代碼）。`
  },

  2: {
    stepId: 2,
    stepTitle: "下載台積電三年數據",
    category: "環境與資料",
    commonErrorTag: "yfinance 下載為空 / 網路連線逾時",
    commonErrors: [
      {
        title: "yf.download 回傳 Empty DataFrame",
        reason: "股票代碼格式錯誤（如未加 .TW）或 Yahoo Finance API 暫時阻擋 IP。",
        quickFix: "確認代號為 '2330.TW'，設定 period='3y' 並可加入 timeout 重新嘗試。"
      },
      {
        title: "HTTPError 404 / 429 Too Many Requests",
        reason: "短時間內頻繁請求 Yahoo Finance 伺服器導致被限流。",
        quickFix: "等待數秒後重試，或使用 yf.Ticker('2330.TW').history(period='3y')。"
      }
    ],
    debugPrompt: `# 【STEP 2 專屬除錯提示語：yfinance 數據抓取】
我正在執行《台股 AI 盯盤系統》的「STEP 2: 下載台積電三年數據」，但在使用 yfinance 下載 '2330.TW' 時出現了問題：

【錯誤訊息 / 執行狀況】：
[請在此貼上錯誤訊息或資料為空的情形]

【本步驟目標】：
1. 匯入 yfinance 與 pandas。
2. 下載 '2330.TW' 近三年歷史日線資料 (period='3y') 並存入變數 df。
3. 印出資料總筆數與 tail(5)。

請幫我檢查是股票代號格式、網路逾時、還是 yfinance 最新版本的 API 變更問題，並提供修正後的 Python 代碼，確保變數 df 成功建立！`
  },

  3: {
    stepId: 3,
    stepTitle: "穩健清洗：多層索引處理",
    category: "環境與資料",
    commonErrorTag: "MultiIndex 索引維度 / KeyError 'close'",
    commonErrors: [
      {
        title: "KeyError: 'close' 或 'adj close'",
        reason: "yfinance 最新版本回傳了二維 MultiIndex 欄位 (Price, Ticker)。",
        quickFix: "使用 df.columns = [col[0].lower() for col in df.columns] 展平為單層索引。"
      },
      {
        title: "TypeError: 'float' object is not iterable",
        reason: "欄位名稱清洗時未正確判斷 MultiIndex 或欄位已有遺失值。",
        quickFix: "使用 isinstance(df.columns, pd.MultiIndex) 進行分流判斷。"
      }
    ],
    debugPrompt: `# 【STEP 3 專屬除錯提示語：MultiIndex 欄位清洗】
我正在執行《台股 AI 盯盤系統》的「STEP 3: 穩健清洗：多層索引處理」，但在清洗 DataFrame 欄位時遇到了報錯：

【錯誤訊息 / 報錯內容】：
[請在此貼上 Colab 的紅色錯誤文字]

【目前 df 的欄位資訊】：
- df.columns: [請可附上 print(df.columns) 的輸出]

【本步驟目標】：
1. 撰寫 fix_col_names(df) 函式。
2. 若為 MultiIndex 則提取第一層並轉小寫，清除 columns.name。
3. 若存在 'adj close' 則覆寫 'close' 並移除原欄位。
4. 只保留 ['open', 'high', 'low', 'close', 'volume'] 五大標準欄位。

請幫我提供最穩健且絕不報 KeyError 的 fix_col_names 函數，並直接清洗 df 變數！`
  },

  4: {
    stepId: 4,
    stepTitle: "專業 K 線與分價量表",
    category: "技術分析",
    commonErrorTag: "Plotly make_subplots / 分價量表切割錯誤",
    commonErrors: [
      {
        title: "IndexError: index out of bounds in np.searchsorted",
        reason: "價格區間 (price_bins) 在處理極端最高價時索引超出範圍。",
        quickFix: "加上邊界防護：`binned_indices[binned_indices >= num_bins] = num_bins - 1`。"
      },
      {
        title: "ValueError: Incompatible dimensions for subplots",
        reason: "make_subplots 的 column_widths 或 shared_yaxes 設定不匹配。",
        quickFix: "使用 rows=1, cols=2, column_widths=[0.8, 0.2], shared_yaxes=True。"
      }
    ],
    debugPrompt: `# 【STEP 4 專屬除錯提示語：Plotly K線與分價量表】
我正在執行《台股 AI 盯盤系統》的「STEP 4: 專業 K 線與分價量表」，但在繪製雙列子圖時發生了錯誤：

【錯誤訊息 / 報錯內容】：
[請在此貼上報錯訊息]

【本步驟目標】：
1. 將股價最低至最高等距切為 50 個價格區間，用 np.searchsorted 累作成交量。
2. 建立左右雙列子圖 (make_subplots: column_widths=[0.8, 0.2], shared_yaxes=True)。
3. 左邊繪製 go.Candlestick，右邊繪製 go.Bar(orientation='h') 橫向分價量表。

請檢查 numpy 區間索引計算與 Plotly 子圖綁定邏輯，給我修正後的完整可執行代碼！`
  },

  5: {
    stepId: 5,
    stepTitle: "MA 五線譜與交叉訊號",
    category: "技術分析",
    commonErrorTag: "均線滾動計算 NaN / 交叉判斷邏輯",
    commonErrors: [
      {
        title: "全圖無三角形標記 (交叉訊號未觸發)",
        reason: "黃金/死亡交叉判斷條件語法不精確，或比較時未用 shift(1)。",
        quickFix: "使用 (df['ma5'].shift(1) < df['ma20'].shift(1)) & (df['ma5'] > df['ma20'])。"
      },
      {
        title: "TypeError: unsupported operand type for <",
        reason: "均線欄位中包含字串或無效值，或 df['close'] 未轉為 numeric。",
        quickFix: "使用 pd.to_numeric(df['close'], errors='coerce') 確保為浮點數。"
      }
    ],
    debugPrompt: `# 【STEP 5 專屬除錯提示語：MA 五線譜與黃金交叉】
我正在執行《台股 AI 盯盤系統》的「STEP 5: MA 五線譜與交叉訊號」，但在計算均線或繪製交叉點時出現了問題：

【錯誤訊息 / 異常現象】：
[請在此貼上報錯訊息或說明為何圖表未顯示三角形訊號]

【本步驟目標】：
1. 計算 5, 20, 60, 120, 240 日均線。
2. 判斷 MA5 與 MA20 交叉：向上穿過為黃金交叉（綠色三角形向上），向下穿過為死亡交叉（紅色三角形向下）。
3. 疊加在同一個 Plotly 圖表上。

請幫我檢查交叉條件判斷與 Scatter markers 標記語法，提供修正後的程式碼！`
  },

  6: {
    stepId: 6,
    stepTitle: "RSI 相對強弱指標",
    category: "技術分析",
    commonErrorTag: "RSI 除以零 / Subplots 雙層坐標軸未對齊",
    commonErrors: [
      {
        title: "ZeroDivisionError: division by zero in RS calculation",
        reason: "股價連續上漲無下跌時，avg_loss 為 0 導致除以零錯誤。",
        quickFix: "在計算 rs 時避免除以零，使用 `np.where(avg_loss == 0, 100, avg_gain / avg_loss)`。"
      },
      {
        title: "Plotly 图表疊在一起或找不到 xaxis2",
        reason: "make_subplots 建立雙層圖時未指定 shared_xaxes=True 或 row/col 參數放錯。",
        quickFix: "Row 1 放股價與 MA，Row 2 放 RSI(14) 並添加 70/30 參考線。"
      }
    ],
    debugPrompt: `# 【STEP 6 專屬除錯提示語：RSI 相對強弱指標】
我正在執行《台股 AI 盯盤系統》的「STEP 6: RSI 相對強弱指標」，在計算 RSI(14) 或建立上下雙層圖表時遇到錯誤：

【錯誤訊息 / 報錯內容】：
[請在此貼上錯誤訊息]

【本步驟目標】：
1. 上層子圖保留股價與均線。
2. 下層計算並繪製 RSI(14) 指標，加入 70 (超買線) 與 30 (超賣線) 水平虛線。

請檢查 RSI 平滑公式（如 ewm 寫法）與 Plotly make_subplots(rows=2, cols=1, shared_xaxes=True) 配置，提供修正後的代碼！`
  },

  7: {
    stepId: 7,
    stepTitle: "MACD 動能指標",
    category: "技術分析",
    commonErrorTag: "三層子圖比例 / EMA 指數平滑計算",
    commonErrors: [
      {
        title: "ValueError: Row heights don't match row count",
        reason: "make_subplots 的 row_heights 列表長度不等於 3。",
        quickFix: "設定 `rows=3, cols=1, row_heights=[0.5, 0.25, 0.25]`。"
      },
      {
        title: "Histogram 顏色全為單色",
        reason: "go.Bar marker_color 未用列表推導式區分正負值。",
        quickFix: "使用 `marker_color=['green' if val >= 0 else 'red' for val in df['macd_histogram']]`。"
      }
    ],
    debugPrompt: `# 【STEP 7 專屬除錯提示語：MACD 三層動能圖】
我正在執行《台股 AI 盯盤系統》的「STEP 7: MACD 動能指標」，在繪製三層子圖 (K線 + RSI + MACD) 時出現報錯：

【錯誤訊息 / 報錯內容】：
[請在此貼上報錯訊息]

【本步驟目標】：
1. 計算 EMA12、EMA26，得到 MACD 線 (DIF) 與 9日訊號線 (Signal)，相減得 Histogram。
2. 建立三層子圖：Row 1 股價MA，Row 2 RSI，Row 3 MACD快慢線與正綠負紅柱狀體。

請檢查三層子圖坐標軸共享與 MACD 運算，提供完整可直接執行的程式碼！`
  },

  8: {
    stepId: 8,
    stepTitle: "布林通道 (Bollinger Bands)",
    category: "技術分析",
    commonErrorTag: "軌道填充 tonexty 順序 / 標準差計算",
    commonErrors: [
      {
        title: "布林通道填充顏色填滿整張圖表",
        reason: "go.Scatter 的加入順序錯誤，必須先加 Lower Band，再加 Upper Band (帶 fill='tonexty')。",
        quickFix: "確保先 add_trace(lower_band) 然後 add_trace(upper_band, fill='tonexty')。"
      },
      {
        title: "NameError: name 'df' is not defined",
        reason: "先前的清洗步驟未保存至全域 df 變數。",
        quickFix: "確認前面的儲存格有正確執行，引用全域 df['close']。"
      }
    ],
    debugPrompt: `# 【STEP 8 專屬除錯提示語：布林通道】
我正在執行《台股 AI 盯盤系統》的「STEP 8: 布林通道 (Bollinger Bands)」，但在計算中軌/上下軌或填色時發生了問題：

【錯誤訊息 / 畫面異常】：
[請在此貼上報錯訊息或填色顯示異常情況]

【本步驟目標】：
1. 計算 20 日移動平均線 (中軌) 與 2 倍標準差的上下軌。
2. 使用 Plotly 繪製收盤價、三條軌道，並將上下軌之間的區域柔和填色 (fill='tonexty')。

請幫我排查軌跡加入順序與填色設定，給予修正後的完整程式碼！`
  },

  9: {
    stepId: 9,
    stepTitle: "抓取營收與毛利 (財報)",
    category: "籌碼與基本面",
    commonErrorTag: "quarterly_income_stmt 欄位缺失 / 轉置結構",
    commonErrors: [
      {
        title: "KeyError: 'Total Revenue' 或 'Gross Profit'",
        reason: "yfinance 財報項目名稱隨版本有所變動，或為日期欄位未轉置。",
        quickFix: "對 `ticker.quarterly_income_stmt.T` 進行轉置，並容錯計算 Revenue - Cost。"
      },
      {
        title: "財報資料為空 (Empty DataFrame)",
        reason: "部分台股代號在 Yahoo Finance 上損益表數據更新延遲。",
        quickFix: "加上 if quarterly_financials.empty 防呆判斷。"
      }
    ],
    debugPrompt: `# 【STEP 9 專屬除錯提示語：季度營收與毛利抓取】
我正在執行《台股 AI 盯盤系統》的「STEP 9: 抓取營收與毛利 (財報)」，在取得 yfinance 損益表時發生報錯：

【錯誤訊息 / 報錯內容】：
[請在此貼上錯誤訊息]

【本步驟目標】：
1. 使用 yf.Ticker('2330.TW').quarterly_income_stmt 取得損益表。
2. 提取近三年季度 Total Revenue 與 Gross Profit，計算毛利率。
3. 繪製營收長條圖與毛利率折線圖。

請幫我檢查 DataFrame 轉置 (T) 與欄位名稱相容性，提供具備防呆的修正代碼！`
  },

  10: {
    stepId: 10,
    stepTitle: "外資與投信動向 (真實籌碼)",
    category: "籌碼與基本面",
    commonErrorTag: "FinMind Token 換行符 / Merge 對齊失敗",
    commonErrors: [
      {
        title: "Token 認證失敗或 400 Bad Request",
        reason: "從 Colab Secrets 讀出的 Token 帶有 \\r\\n 換行符或空格。",
        quickFix: "使用 `finmind_token.strip().split('\\r\\n')[0]` 清理 Token。"
      },
      {
        title: "KeyError: 'name' or 'buy'",
        reason: "FinMind API 回傳的 data 為空列表或 JSON 結構不符合預期。",
        quickFix: "增加 `if data['data']:` 判斷，若為空則給予友善提示或模擬數據。"
      }
    ],
    debugPrompt: `# 【STEP 10 專屬除錯提示語：三大法人籌碼】
我正在執行《台股 AI 盯盤系統》的「STEP 10: 外資與投信動向 (真實籌碼)」，在呼叫 FinMind API 時發生了錯誤：

【錯誤訊息 / 報錯內容】：
[請在此貼上報錯訊息]

【本步驟目標】：
1. 呼叫 FinMind dataset='TaiwanStockInstitutionalInvestorsBuySell' 取得外資與投信進出。
2. 計算 net_buy_sell = buy - sell 並 pivot 後使用 .cumsum() 計算累積買賣超。
3. 與 df[['close']] 進行 Left Merge，ffill().fillna(0) 填補空值並繪製雙層圖。

請幫我檢查 Token 清理、日期對齊與 pivot 語法，提供修正後的程式碼！`
  },

  11: {
    stepId: 11,
    stepTitle: "融資融券與散戶動態",
    category: "籌碼與基本面",
    commonErrorTag: "API 請求逾時 / 券資比除以零 (inf)",
    commonErrors: [
      {
        title: "requests.exceptions.ReadTimeout",
        reason: "FinMind 免費版在抓取大量散戶融資券數據時伺服器響應超時。",
        quickFix: "縮短抓取區間至最近一年，並加入 try-except 與 numpy 模擬數據備援。"
      },
      {
        title: "ZeroDivisionError / short_margin_ratio 出現 inf",
        reason: "融資餘額為 0 時計算券資比產生無窮大。",
        quickFix: "使用 `.replace([np.inf, -np.inf], np.nan).fillna(0)` 處理無窮大。"
      }
    ],
    debugPrompt: `# 【STEP 11 專屬除錯提示語：散戶融資融券】
我正在執行《台股 AI 盯盤系統》的「STEP 11: 融資融券與散戶動態」，在抓取 TaiwanStockMarginPurchaseShortSale 時遇到超時或計算錯誤：

【錯誤訊息 / 報錯內容】：
[請在此貼上錯誤訊息]

【本步驟目標】：
1. 抓取最近一年散戶融資券數據，加上 timeout=10 防卡死與自動模擬備援機制。
2. Left Merge 對齊 df，計算券資比並消除 inf。
3. 繪製三層子圖，並在股價上標示 90% (混亂區紅底) 與 10% (安定區綠底)。

請幫我排查 requests 例外處理與券資比計算，提供穩定不中斷的修正代碼！`
  },

  12: {
    stepId: 12,
    stepTitle: "ATR 波動幅度與停損策略",
    category: "技術分析",
    commonErrorTag: "True Range 三序列最大值計算錯誤",
    commonErrors: [
      {
        title: "ValueError: Shape of passed values is not compatible",
        reason: "使用 pd.concat 計算 TR 時，Series 的 index 或 axis 設定錯誤。",
        quickFix: "使用 `pd.concat([high_minus_low, abs_high_prev, abs_low_prev], axis=1).max(axis=1)`。"
      },
      {
        title: "atr 欄位全部為 NaN",
        reason: "df['close'].shift(1) 未正確對齊，或 ewm 平滑未給定適當的 span。",
        quickFix: "使用 `df['tr'].ewm(span=14, adjust=False).mean()`。"
      }
    ],
    debugPrompt: `# 【STEP 12 專屬除錯提示語：ATR 真實波動幅度】
我正在執行《台股 AI 盯盤系統》的「STEP 12: ATR 波動幅度與停損策略」，在計算 TR 或 ATR 時遇到問題：

【錯誤訊息 / 報錯內容】：
[請在此貼上錯誤訊息]

【本步驟目標】：
1. 計算每日 True Range: max(H-L, |H-前C|, |L-前C|)。
2. 計算 14 日 EWM 平滑平均得到 ATR。
3. 繪製收盤價與 ATR 雙層圖，並輸出停損觀念說明。

請幫我檢查 TR 三者取最大值的向量化寫法與圖表繪製，提供修正代碼！`
  },

  13: {
    stepId: 13,
    stepTitle: "落後指標綜合熱力圖",
    category: "籌碼與基本面",
    commonErrorTag: "中文字型亂碼 / 非數值欄位相關性錯誤",
    commonErrors: [
      {
        title: "ValueError: could not convert string to float in corr()",
        reason: "DataFrame 包含日期字串或非數值欄位，導致相關性矩陣計算失敗。",
        quickFix: "先篩選數值型欄位：`df.select_dtypes(include=[np.number]).corr()`。"
      },
      {
        title: "Seaborn 熱力圖中文字型顯示方塊 (Tofu 碼)",
        reason: "Colab Linux 預設環境未安裝微軟正黑體或中文字形。",
        quickFix: "將欄位改為英文（如 Close Price, Foreign Net Buy, Total Revenue）。"
      }
    ],
    debugPrompt: `# 【STEP 13 專屬除錯提示語：相關性熱力圖】
我正在執行《台股 AI 盯盤系統》的「STEP 13: 落後指標綜合熱力圖」，在使用 Seaborn 繪製 Heatmap 時遇到報錯：

【錯誤訊息 / 報錯內容】：
[請在此貼上錯誤訊息]

【本步驟目標】：
1. 整合股價、營收、外資買賣、融資餘額，欄位命名為英文。
2. 計算 Correlation 矩陣並使用 sns.heatmap 繪製熱力圖。
3. 自動印出與股價相關性最高之落後指標名稱與係數。

請幫我檢查 DataFrame 欄位型態與 dropna 處理，提供正確可執行的代碼！`
  },

  14: {
    stepId: 14,
    stepTitle: "進階領先籌碼 (期貨與借券)",
    category: "籌碼與基本面",
    commonErrorTag: "台指期法人代號篩選 / 借券 groupby 聚合",
    commonErrors: [
      {
        title: "KeyError: 'institutional_investors' or 'sell_balance'",
        reason: "FinMind 期貨或借券 API 回傳結構缺少對應欄位，或未經過 try-except 容錯。",
        quickFix: "加入完整 try-except，遇失敗立即由 numpy 生成模擬時間序列。"
      },
      {
        title: "Merge 後日期維度不一致導致全為 NaN",
        reason: "期貨交易日與現貨交易日存在極端少數日曆差異。",
        quickFix: "合併後執行 `df_extended = df_extended.ffill().fillna(0)`。"
      }
    ],
    debugPrompt: `# 【STEP 14 專屬除錯提示語：外資期貨與借券賣出】
我正在執行《台股 AI 盯盤系統》的「STEP 14: 進階領先籌碼 (期貨與借券)」，在抓取台指期法人數據或借券餘額時發生錯誤：

【錯誤訊息 / 報錯內容】：
[請在此貼上報錯訊息]

【本步驟目標】：
1. 抓取 TaiwanFuturesInstitutionalInvestors (TX) 外資淨未平倉 (long - short)。
2. 抓取 TaiwanStockSecuritiesLending 借券賣出餘額 groupby.sum()。
3. 合併至 df 並繪製 3 列子圖 (收盤價、期貨淨OI綠正紅負、借券折線填色)。

請檢查 FinMind 參數、期貨外資篩選與備援生成機制，提供修正後的代碼！`
  },

  15: {
    stepId: 15,
    stepTitle: "AI 特徵工程與標籤定義",
    category: "AI 量化模型",
    commonErrorTag: "FutureWarning: fill_method / Target 全為 0 或 1",
    commonErrors: [
      {
        title: "FutureWarning: The default fill_method='pad' in pct_change is deprecated",
        reason: "Pandas 最新版要求 pct_change 顯式指定 fill_method=None。",
        quickFix: "將 `pct_change()` 改為 `pct_change(fill_method=None)`。"
      },
      {
        title: "Target 全部為 0 或全部為 1 (標籤失衡)",
        reason: "shift(-1) 未正確比較隔日與今日收盤價，或型態轉換錯誤。",
        quickFix: "使用 `ml_df['Target'] = (ml_df['close'].shift(-1) > ml_df['close']).astype(int)`。"
      }
    ],
    debugPrompt: `# 【STEP 15 專屬除錯提示語：AI 特徵與標籤定義】
我正在執行《台股 AI 盯盤系統》的「STEP 15: AI 特徵工程與標籤定義」，在構建特徵矩陣與 Target 標籤時出現錯誤：

【錯誤訊息 / 報錯內容】：
[請在此貼上報錯訊息]

【本步驟目標】：
1. 建立 ml_df = df.copy()，計算 20日乖離率 (Bias_20)、日報酬率 (Daily_Return)、RSI。
2. 納入領先特徵 (期貨淨未平倉、借券賣出)。
3. 定義 Target = (隔日收盤價 > 今日收盤價) 即 shift(-1) > 今日。
4. dropna 後印出 Target=0 與 1 的特徵平均值。

請幫我檢查特徵計算與標籤定義邏輯，提供修正後的完整程式碼！`
  },

  16: {
    stepId: 16,
    stepTitle: "訓練 AI 模型 (破解勝率迷思)",
    category: "AI 量化模型",
    commonErrorTag: "ImportError: cannot import name '_slice' from numpy / NameError: 'ml_df_cleaned'",
    commonErrors: [
      {
        title: "ImportError: cannot import name '_slice' from 'numpy._core.umath'",
        reason: "Colab 最新升級中，numpy 2.x 與舊版 scikit-learn / scipy 二進制擴展不相容。",
        quickFix: "重設 numpy 與 scipy 版本，或重新執行 pip 安裝與特徵防呆自我修復。"
      },
      {
        title: "NameError: name 'ml_df_cleaned' or 'feature_cols' is not defined",
        reason: "STEP 15 未執行或變數未寫入全域狀態。",
        quickFix: "在 STEP 16 頂部內建自我依賴檢測與修復區塊。"
      }
    ],
    debugPrompt: `# 【STEP 16 專屬除錯提示語：隨機森林模型訓練】
我正在執行《台股 AI 盯盤系統》的「STEP 16: 訓練 AI 模型 (破解勝率迷思)」，在匯入 sklearn 或訓練模型時發生了報錯：

【錯誤訊息 / 報錯內容】：
[請在此貼上 Colab 的紅色錯誤，如 ImportError _slice 或 NameError]

【本步驟目標】：
1. 從 sklearn.ensemble 匯入 RandomForestClassifier，從 sklearn.model_selection 匯入 train_test_split。
2. 劃分 X 與 y，test_size=0.2 且【禁止洗牌 shuffle=False】防止未來數據洩漏。
3. 訓練模型並輸出準確度 (Accuracy)。

請幫我提供具備「自我防呆修復機制」（包含完整 import 與前置變數檢查）的完整可執行程式碼！`
  },

  17: {
    stepId: 17,
    stepTitle: "建構 20+ 複合特徵矩陣",
    category: "AI 量化模型",
    commonErrorTag: "跨市場數據下載失敗 / 特徵長度不一致",
    commonErrors: [
      {
        title: "yfinance 下載 ^SOX / ^TNX / ^VIX 失敗或為空",
        reason: "美股代號在特定網路環境下偶發性連線失敗，或時區日期不對齊。",
        quickFix: "使用 try-except 包覆美股指數下載，若失敗則補 0.0 並使用 ffill 對齊。"
      },
      {
        title: "ValueError: Number of features of the model must match the input",
        reason: "訓練時的特徵列表與預測時的 X_test 欄位不一致。",
        quickFix: "建立明確的 final_feature_cols 列表並過濾出實際存在的欄位。"
      }
    ],
    debugPrompt: `# 【STEP 17 專屬除錯提示語：20+ 複合特徵與特徵重要性】
我正在執行《台股 AI 盯盤系統》的「STEP 17: 建構 20+ 複合特徵矩陣」，在擴充特徵或計算 Feature Importance 時發生了錯誤：

【錯誤訊息 / 報錯內容】：
[請在此貼上錯誤訊息]

【本步驟目標】：
1. 擴充動能特徵 (1d/3d/5d 報酬率、MACD柱狀體)、波動型態 (BB_Width, Normalized_ATR)。
2. 整合跨市場變動率 (^SOX 費半, ^TNX 美債殖利率, ^VIX 恐慌指數)。
3. 建立期貨未平倉與借券的 Lag1/Lag3/Lag5 領先特徵。
4. 重新訓練隨機森林 (n_estimators=200) 並用 Plotly 繪製橫向特徵重要性排行。

請幫我檢查跨市場抓取與特徵陣列維度，提供修正後的代碼！`
  },

  18: {
    stepId: 18,
    stepTitle: "純粹 Pandas 向量化回測",
    category: "AI 量化模型",
    commonErrorTag: "cumprod 累積報酬維度不符 / 交易摩擦成本扣除",
    commonErrors: [
      {
        title: "回測曲線全為直線或 NaN",
        reason: "Daily_Return 未正確對齊 X_test 索引，或累積乘數 (1 + r/100) 含有 NaN。",
        quickFix: "使用 `backtest_df['Daily_Return'].fillna(0)` 並在 cumprod 前確認無空值。"
      },
      {
        title: "策略報酬計算未來數據洩漏",
        reason: "未將 Signal 向後平移一天 (未用 shift(1))。",
        quickFix: "嚴格遵守 `Strategy_Return = backtest_df['Signal'].shift(1) * backtest_df['Daily_Return']`。"
      }
    ],
    debugPrompt: `# 【STEP 18 專屬除錯提示語：向量化回測】
我正在執行《台股 AI 盯盤系統》的「STEP 18: 純粹 Pandas 向量化回測」，在計算累積淨值曲線或摩擦成本時發生了錯誤：

【錯誤訊息 / 報錯內容】：
[請在此貼上報錯訊息]

【本步驟目標】：
1. 建立 backtest_df(index=X_test_mega.index)，載入預測訊號 Signal。
2. 今日訊號決定明日持倉：Strategy_Return = Signal.shift(1) * Daily_Return。
3. 摩擦成本：訊號變動 Trade_Action = Signal.diff().abs()，扣除 0.3% 單邊滑價與手續費。
4. 使用 .cumprod() 計算買進持有與 AI 策略淨值曲線，並繪製對比圖。

請幫我檢查向量化回測公式與 Plotly 曲線繪製，提供修正代碼！`
  },

  19: {
    stepId: 19,
    stepTitle: "構建量化分析腳本 (自動化)",
    category: "部署與自動化",
    commonErrorTag: "類別 self 屬性未初始化 / 方法依賴順序",
    commonErrors: [
      {
        title: "AttributeError: 'StockAnalyzer' object has no attribute 'df'",
        reason: "在 __init__ 中未正確宣告屬性，或未先呼叫 fetch_data 就執行特徵工程。",
        quickFix: "在 __init__ 中預先宣告所有 DataFrame 屬性，並在方法中回傳狀態布林值。"
      },
      {
        title: "NameError inside class method",
        reason: "類別內部呼叫其他方法時漏寫 `self.` 前綴。",
        quickFix: "檢查內部函式呼叫，確保使用 `self._fix_col_names` 或 `self.df`。"
      }
    ],
    debugPrompt: `# 【STEP 19 專屬除錯提示語：StockAnalyzer 封裝類別】
我正在執行《台股 AI 盯盤系統》的「STEP 19: 構建量化分析腳本 (自動化)」，在將散落邏輯封裝為 StockAnalyzer 類別時遇到報錯：

【錯誤訊息 / 報錯內容】：
[請在此貼上報錯訊息]

【本步驟目標】：
1. 建立 StockAnalyzer 類別，封裝 fetch_data (含財報籌碼)、engineer_features (含複合特徵)、run_ai_analysis (含回測)。
2. 在最下方加入實例化執行語法：analyzer = StockAnalyzer('2330.TW')。

請幫我檢查類別中的 self 作用域、方法依賴關係與例外處理，給我修正後的完整類別代碼！`
  },

  20: {
    stepId: 20,
    stepTitle: "Gemini 3.5 智能盤勢解析",
    category: "部署與自動化",
    commonErrorTag: "google-genai SDK 語法 / API Key 讀取",
    commonErrors: [
      {
        title: "AttributeError: module 'google.genai' has no attribute 'Client'",
        reason: "使用了舊版 google-generativeai 語法或未正確安裝 google-genai。",
        quickFix: "執行 `!pip install -q google-genai` 並使用 `from google import genai`。"
      },
      {
        title: "ValueError: GEMINI_API_KEY 未設置",
        reason: "未在 Colab Secrets 中配置 GEMINI_API_KEY 密鑰。",
        quickFix: "至 Colab 左側 🔑 新增 GEMINI_API_KEY 並勾選 Notebook access。"
      }
    ],
    debugPrompt: `# 【STEP 20 專屬除錯提示語：Gemini 智能盤勢解析】
我正在執行《台股 AI 盯盤系統》的「STEP 20: Gemini 3.5 智能盤勢解析」，在呼叫 Gemini 產出分析報告時遇到錯誤：

【錯誤訊息 / 報錯內容】：
[請在此貼上報錯訊息]

【本步驟目標】：
1. 安裝 google-genai SDK。
2. 從 mega_df 取出最後 3 筆數據轉為字串。
3. 採用 Google 官方最新寫法：
   client = genai.Client(api_key=api_key)
   interaction = client.interactions.create(model="gemini-3.7-flash", system_instruction="...", input=...)
4. 印出產出的盤後分析報告。

請幫我檢查 google-genai SDK 的呼叫寫法與 API Key 防呆，提供修正代碼！`
  },

  21: {
    stepId: 21,
    stepTitle: "專業級面板 (Blocks 排版與雷達)",
    category: "部署與自動化",
    commonErrorTag: "Gradio Blocks 元件綁定 / concurrency_limit 語法",
    commonErrors: [
      {
        title: "TypeError: analyze_stock() takes 1 positional argument but 2 were given",
        reason: "Gradio 按鈕點擊事件傳入的 inputs 列表與後端函式參數數量不符。",
        quickFix: "確認 analyze_stock(ticker, period) 接收 2 個參數，且 inputs=[ticker_input, period_dropdown] 對齊。"
      },
      {
        title: "Gradio 畫面按下分析按鈕後卡住無回應",
        reason: "yfinance 下載未加 try-except 造成內部崩潰未回傳圖表。",
        quickFix: "在 analyze_stock 內加上完整 try-except，失敗時回傳 (go.Figure(), 錯誤訊息)。"
      }
    ],
    debugPrompt: `# 【STEP 21 專屬除錯提示語：Gradio Blocks 儀表板】
我正在執行《台股 AI 盯盤系統》的「STEP 21: 專業級面板 (Blocks 排版與雷達)」，在構建 Gradio UI 面板時發生報錯：

【錯誤訊息 / 報錯內容】：
[請在此貼上報錯訊息]

【本步驟目標】：
1. 建立 analyze_stock (繪製K線均線圖、計算MA20乖離率) 與 scan_watchlist (多股掃描表格)。
2. 使用 gr.Blocks(theme=gr.themes.Soft()) 與 gr.Tabs() 建構 Tab 1 (單檔透視) 與 Tab 2 (自選股雷達)。
3. 正確綁定按鈕 click 事件並加入 concurrency_limit=5。

請檢查 Gradio 元件 inputs/outputs 對齊與事件綁定，給我修正後的完整代碼！`
  },

  22: {
    stepId: 22,
    stepTitle: "自動建立 requirements.txt 依賴檔",
    category: "部署與自動化",
    commonErrorTag: "Colab 檔案寫入權限 / 瀏覽器封鎖彈跳視窗下載",
    commonErrors: [
      {
        title: "google.colab.files.download 未自動觸發下載",
        reason: "瀏覽器開啟了彈跳視窗封鎖 (Pop-up Blocker)，阻擋了 Colab 自動下載事件。",
        quickFix: "允許 Colab 的彈跳視窗，或直接在 Colab 左側「📁 檔案」列表對 requirements.txt 右鍵點選「下載」。"
      },
      {
        title: "requirements.txt 格式或換行符號問題",
        reason: "寫入時未指定 UTF-8 編碼或套件名稱拼寫錯誤。",
        quickFix: "使用標準 with open('requirements.txt', 'w', encoding='utf-8') 寫入純文字套件名稱與版本。"
      }
    ],
    debugPrompt: `# 【STEP 22 專屬除錯提示語：自動建立 requirements.txt】
我正在執行《台股 AI 盯盤系統》的「STEP 22: 自動建立 requirements.txt 依賴檔」，在生成檔案或下載時發生問題：

【錯誤訊息 / 報錯內容】：
[請在此貼上錯誤訊息]

【本步驟目標】：
1. 自動在 Colab 目錄中生成 requirements.txt，包含 gradio, yfinance, pandas, numpy, plotly, requests, google-genai, scikit-learn, xgboost 等依賴。
2. 透過 files.download('requirements.txt') 觸發下載，並提供 Colab 左側檔案面板手動下載引導。

請幫我檢查檔案寫入與下載程式碼，提供修正後的完整 Python 程式碼！`
  },

  23: {
    stepId: 23,
    stepTitle: "分析程式碼重構為模組化 stock.py",
    category: "部署與自動化",
    commonErrorTag: "Colab 檔案寫入 / 類別封裝與瀏覽器下載",
    commonErrors: [
      {
        title: "google.colab.files.download 瀏覽器無回應",
        reason: "瀏覽器封鎖了 Colab 彈出式視窗自動下載事件。",
        quickFix: "直接在 Colab 左側「📁 檔案」列表對 stock.py 右鍵點選「下載」。"
      },
      {
        title: "StockAnalyzer 類別方法缺漏或縮排錯誤",
        reason: "寫入 stock.py 字串時 Python 縮排或多行引號產生解析異常。",
        quickFix: "確保 fetch_data, engineer_features, plot_dashboard 等方法完整對齊，並以 utf-8 編碼寫入檔案。"
      }
    ],
    debugPrompt: `# 【STEP 23 專屬除錯提示語：重構為模組化 stock.py】
我正在執行《台股 AI 盯盤系統》的「STEP 23: 分析程式碼重構為模組化 stock.py」，在封裝 StockAnalyzer 或生成/下載檔案時發生問題：

【錯誤訊息 / 報錯內容】：
[請在此貼上報錯訊息]

【本步驟目標】：
1. 將 StockAnalyzer 類別、特徵工程、Plotly 圖表以及 Gradio Blocks 面板重構成獨立模組化 stock.py。
2. 自動在 Colab 根目錄生成 stock.py，並使用 files.download('stock.py') 觸發下載至電腦，以便後續直接部署到 Hugging Face Spaces。

請幫我檢查 stock.py 程式碼封裝與檔案下載邏輯，提供修正後的完整 Python 程式碼！`
  },

  24: {
    stepId: 24,
    stepTitle: "線上網站部署 (Colab 股市工具一鍵變 Web App)",
    category: "部署與自動化",
    commonErrorTag: "Hugging Face Space Build Error / requirements.txt 遺漏",
    commonErrors: [
      {
        title: "ModuleNotFoundError: No module named 'yfinance' or 'plotly'",
        reason: "requirements.txt 檔案中遺漏了必備的依賴套件。",
        quickFix: "在 requirements.txt 中加入 gradio, yfinance, pandas, numpy, plotly, google-genai。"
      },
      {
        title: "No application file found (找不到進入點)",
        reason: "上傳的 Python 檔名為 stock.py，但 Space 預設尋找 app.py。",
        quickFix: "將主程式更名為 app.py，或在 README.md 前置 YAML 設定 app_file: stock.py。"
      },
      {
        title: "API Key 讀取失敗導致即時解析無法使用",
        reason: "未在 Space 的 Settings -> Variables and secrets 中設定 GEMINI_API_KEY。",
        quickFix: "在 Space 設定頁面新增 Secret 名稱為 GEMINI_API_KEY。"
      }
    ],
    debugPrompt: `# 【STEP 24 專屬除錯提示語：Hugging Face Spaces 部署】
我正在執行《台股 AI 盯盤系統》的「STEP 24: 線上網站部署 (Colab 股市工具一鍵變 Web App)」，在將專案部署至 Hugging Face Spaces 時遇到問題：

【錯誤狀況 / Space 狀態或 Logs 紀錄】：
[請在此貼上 Hugging Face Space 的 Build Logs 或 Runtime Error]

【目前已上傳的檔案與設定】：
1. 主程式檔案：[例如 app.py 或 stock.py]
2. requirements.txt 內容：[請列出目前寫入的套件清單]
3. Space SDK：Gradio

請以雲端部署專家的角度，幫我分析 Docker 容器建置失敗或應用崩潰的原因，並給予修復 requirements.txt、README.md 或主程式進入點的具體指引！`
  }
};
