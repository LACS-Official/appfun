import { type ClassValue, clsx } from 'clsx';

/**
 * 合并 CSS 类名的工具函数
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/**
 * 格式化日期
 */
export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  
  return dateObj.toLocaleDateString('zh-CN', { ...defaultOptions, ...options });
}

/**
 * 格式化相对时间
 */
export function formatRelativeTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return '刚刚';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}分钟前`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}小时前`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}天前`;
  }
  
  return formatDate(dateObj);
}

/**
 * 截断文本
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/**
 * 格式化文件大小
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * 解析文件大小字符串为字节数
 */
export function parseFileSize(sizeStr: string): number {
  const units: { [key: string]: number } = {
    'B': 1,
    'KB': 1024,
    'MB': 1024 * 1024,
    'GB': 1024 * 1024 * 1024,
    'TB': 1024 * 1024 * 1024 * 1024,
  };
  
  const match = sizeStr.match(/^(\d+(?:\.\d+)?)\s*([A-Z]+)$/i);
  if (!match) return 0;
  
  const [, size, unit] = match;
  const multiplier = units[unit.toUpperCase()] || 1;
  
  return parseFloat(size) * multiplier;
}

/**
 * 生成随机ID
 */
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

/**
 * 防抖函数
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * 节流函数
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * 构建查询字符串
 */
export function buildQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });

  return searchParams.toString();
}

/**
 * 获取优先下载链接
 */
export function getPriorityDownloadLink(downloadLinks?: {
  official?: string;
  quark?: string;
  pan123?: string;
  baidu?: string;
  thunder?: string;
  github?: string;
  backup?: string[];
}): string | null {
  if (!downloadLinks) return null;

  // 按优先级顺序检查下载链接
  const priorities = ['official', 'github', 'quark', 'pan123', 'baidu', 'thunder'];

  for (const priority of priorities) {
    if (downloadLinks[priority as keyof typeof downloadLinks]) {
      return downloadLinks[priority as keyof typeof downloadLinks] as string;
    }
  }

  // 检查备用链接
  if (downloadLinks.backup && downloadLinks.backup.length > 0) {
    return downloadLinks.backup[0];
  }

  return null;
}
