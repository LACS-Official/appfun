/**
 * 全局类型声明文件
 */

// 扩展Window接口
interface Window {
  appConfig: any;
  apiClient?: any;
  umami?: { 
    track: (eventName: string, data?: any) => void;
    identify?: (data: any) => void;
  };
  showToast?: (message: string, type?: string, duration?: number) => void;
  initializeDownloadButton?: (button: HTMLButtonElement) => void;
  loadSoftwareDetails?: () => void;
}