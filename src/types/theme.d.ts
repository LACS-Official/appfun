// @ts-nocheck
export {};

declare global {
  interface Window {
    getTheme?: () => string;
    setTheme?: (theme: string) => void;
  }
  
  interface CustomEventMap {
    themechange: CustomEvent<{ theme: string; source: string }>;
    themeapplied: CustomEvent<{ theme: string }>;
  }
  
  // 扩展WindowEventMap以支持自定义主题事件
  interface WindowEventMap {
    themechange: CustomEvent<{ theme: string; source: string }>;
    themeapplied: CustomEvent<{ theme: string }>;
  }
}