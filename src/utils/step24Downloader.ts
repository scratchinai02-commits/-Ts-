import JSZip from 'jszip';
import { STEP24_REQUIREMENTS_TXT, STEP24_APP_PY } from '../data/step24Files';

function triggerBlobDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function downloadStep24RequirementsTxt(): void {
  const blob = new Blob([STEP24_REQUIREMENTS_TXT], { type: 'text/plain;charset=utf-8' });
  triggerBlobDownload(blob, 'requirements.txt');
}

export function downloadStep24AppPy(filename = 'app.py'): void {
  const blob = new Blob([STEP24_APP_PY], { type: 'text/x-python;charset=utf-8' });
  triggerBlobDownload(blob, filename);
}

export async function downloadBothStep24FilesIndividually(
  onProgress?: (filename: string) => void
): Promise<void> {
  // 1. requirements.txt
  downloadStep24RequirementsTxt();
  if (onProgress) onProgress('requirements.txt');

  await new Promise((resolve) => setTimeout(resolve, 300));

  // 2. app.py
  downloadStep24AppPy('app.py');
  if (onProgress) onProgress('app.py');
}

export async function downloadStep24Zip(
  zipFilename = 'taiwan-stock-step24-huggingface.zip',
  includeStockPyDuplicate = true
): Promise<void> {
  const zip = new JSZip();

  // 加入 requirements.txt
  zip.file('requirements.txt', STEP24_REQUIREMENTS_TXT, {
    date: new Date('2026-09-04T00:00:00Z'),
    unixPermissions: 0o644,
    dosPermissions: 0o20,
  });

  // 加入 app.py (Hugging Face 官方預設進入點)
  zip.file('app.py', STEP24_APP_PY, {
    date: new Date('2026-09-04T00:00:00Z'),
    unixPermissions: 0o644,
    dosPermissions: 0o20,
  });

  // 也可貼心多附一份命名為 stock.py 的檔案，方便需要以 stock.py 名稱使用的同學
  if (includeStockPyDuplicate) {
    zip.file('stock.py', STEP24_APP_PY, {
      date: new Date('2026-09-04T00:00:00Z'),
      unixPermissions: 0o644,
      dosPermissions: 0o20,
    });
  }

  const blob = await zip.generateAsync({
    type: 'blob',
    mimeType: 'application/zip',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
    platform: 'UNIX',
  });

  triggerBlobDownload(blob, zipFilename);
}
