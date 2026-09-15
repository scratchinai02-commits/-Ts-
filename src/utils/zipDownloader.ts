import JSZip from 'jszip';
import { V6_FILES_DATA } from '../data/v6ProjectFiles';

/**
 * 在瀏覽器端使用 JSZip 動態建立標準 PKZip 壓縮檔並觸發下載。
 * 設定標準 Unix 檔案權限 (0o644) 與標準格式，
 * 確保 macOS 封存工具程式 (Archive Utility) 與 Windows 檔案總管 100% 能正常解壓縮。
 */
export async function downloadV6ZipInBrowser(customFilename = 'taiwan-stock-no-gradio-flat-updated-v6-20260904.zip'): Promise<void> {
  const zip = new JSZip();

  // 將 7 個核心檔案寫入 zip 根目錄
  Object.values(V6_FILES_DATA).forEach((file) => {
    zip.file(file.filename, file.content, {
      date: new Date('2026-09-04T00:00:00Z'),
      unixPermissions: 0o644,
      dosPermissions: 0o20,
    });
  });

  const blob = await zip.generateAsync({
    type: 'blob',
    mimeType: 'application/zip',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
    platform: 'UNIX',
  });

  triggerBlobDownload(blob, customFilename);
}

/**
 * 單獨下載某一個檔案 (例如 index.html, main.py 等)
 * 免除任何解壓縮步驟，適合解壓縮有問題的環境。
 */
export function downloadSingleV6File(filename: string): void {
  const file = V6_FILES_DATA[filename];
  if (!file) {
    console.error(`File ${filename} not found in V6_FILES_DATA`);
    return;
  }

  let mimeType = 'text/plain;charset=utf-8';
  if (filename.endsWith('.html')) mimeType = 'text/html;charset=utf-8';
  if (filename.endsWith('.json')) mimeType = 'application/json;charset=utf-8';

  const blob = new Blob([file.content], { type: mimeType });
  triggerBlobDownload(blob, filename);
}

/**
 * 一鍵單獨下載全部 7 個檔案 (每隔 250ms 下載一個，避免被瀏覽器彈出式阻擋)
 */
export async function downloadAllV6FilesIndividually(
  onProgress?: (current: number, total: number, filename: string) => void
): Promise<void> {
  const files = Object.keys(V6_FILES_DATA);
  for (let i = 0; i < files.length; i++) {
    const filename = files[i];
    if (onProgress) {
      onProgress(i + 1, files.length, filename);
    }
    downloadSingleV6File(filename);
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
}

/**
 * 通用觸發 Blob 下載
 */
function triggerBlobDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 1000);
}
