/**
 * 全局类型声明文件
 */

// 扩展Window接口
interface Window {
  appConfig: any;
  showToast?: (message: string, type?: string, duration?: number) => void;
  initializeDownloadButton?: (button: HTMLButtonElement) => void;
  loadSoftwareDetails?: () => void;
}