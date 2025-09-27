/**
 * 全局类型声明文件
 */

// 扩展Window接口
interface Window {
  authManager: {
    getAuthState: () => any;
    resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
    isLoggedIn: () => boolean;
  };
  authStatusIndicator: {
    showCustomMessage: (message: string, type: string) => void;
  };
  SupabaseAuthManager: any;
  AuthManager: any;
  appConfig: any;
  showLoginPrompt?: () => void;
  showToast?: (message: string, type?: string, duration?: number) => void;
}