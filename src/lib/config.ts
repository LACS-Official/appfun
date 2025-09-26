/**
 * 应用程序配置
 */

// 环境变量类型定义
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_API_KEY: string;
  readonly VITE_APP_TITLE: string;
  readonly VITE_APP_DESCRIPTION: string;
  readonly VITE_ACCOUNT_LOGIN_URL: string;
  readonly VITE_REQUIRE_LOGIN_FOR_DOWNLOAD: string;
  readonly VITE_DEV_MODE: string;
  readonly VITE_DEBUG: string;
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly MODE: string;
  readonly BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

/**
 * API 配置
 */
export const apiConfig = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'https://api-g.lacs.cc',
  apiKey: import.meta.env.VITE_API_KEY || '',
  timeout: 10000,
};

/**
 * 应用程序配置
 */
export const appConfig = {
  title: import.meta.env.VITE_APP_TITLE || 'APPFUN',
  description: import.meta.env.VITE_APP_DESCRIPTION || 'APPFUN.FUN,APP TOO FUN,有趣软件',
  version: '1.0.0',
  author: 'LACS Team',
  
  // 分页配置
  pagination: {
    defaultPageSize: 12,
    maxPageSize: 100,
    pageSizeOptions: [6, 12, 24, 48],
  },
  
  // 搜索配置
  search: {
    debounceDelay: 300,
    minSearchLength: 2,
  },
  
  // 缓存配置
  cache: {
    defaultTTL: 5 * 60 * 1000, // 5分钟
    maxAge: 30 * 60 * 1000, // 30分钟
  },
  
  // 文件上传配置
  upload: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  },
  
  // 主题配置
  theme: {
    primaryColor: '#3b82f6',
    secondaryColor: '#64748b',
    successColor: '#10b981',
    warningColor: '#f59e0b',
    errorColor: '#ef4444',
  },
  
  // 功能开关
  features: {
    enableDarkMode: true,
    enableNotifications: true,
    enableAnalytics: false,
    enableOfflineMode: false,
  },
  
  // 外部链接
  links: {
    documentation: 'https://docs.lacs.cc',
    support: 'https://support.lacs.cc',
    github: 'https://github.com/lacs-team',
    website: 'https://lacs.cc',
    account: 'https://account.lacs.cc',
  },

  // 认证配置
  auth: {
    loginUrl: '/auth/login',
    signUpUrl: '/auth/sign-up',
    forgotPasswordUrl: '/auth/forgot-password',
    requireLoginForDownload: import.meta.env.VITE_REQUIRE_LOGIN_FOR_DOWNLOAD === 'true',
    sessionStorageKey: 'supabase-auth-session',
    returnUrlParam: 'redirect',
    // 添加微信小程序备案相关配置
    wechatMiniprogram: {
      // 微信小程序环境中使用特定的登录方式
      enableWechatLogin: true,
      // 备案审核模式 - 在审核期间启用特殊处理
     备案审核Mode: false,
      // 审核期间显示的提示信息
      reviewNotice: '系统正在维护中，请稍后再试',
      // 允许匿名访问的内容（备案审核要求）
      allowAnonymousPaths: [
        '/',
        '/about',
        '/software',
        '/software/*',
        '/categories',
        '/categories/*',
        '/tags',
        '/tags/*',
        '/search'
      ]
    }
  },

  // 开发配置
  dev: {
    enabled: import.meta.env.VITE_DEV_MODE === 'true' || import.meta.env.DEV,
    debug: import.meta.env.VITE_DEBUG === 'true',
  },
};

/**
 * 路由配置
 */
export const routes = {
  home: '/',
  software: '/software',
  softwareDetail: '/software/:id',
  categories: '/categories',
  category: '/categories/:category',
  tags: '/tags',
  tag: '/tags/:tag',
  about: '/about',
  search: '/search',

  // API 路由
  api: {
    software: '/api/software',
  },
} as const;

/**
 * 本地存储键名
 */
export const storageKeys = {
  theme: 'app-theme',
  language: 'app-language',
  preferences: 'app-preferences',
  cache: 'app-cache',
  recentSearches: 'recent-searches',
  favorites: 'user-favorites',
  userSession: 'lacs-user-session',
  returnUrl: 'lacs-return-url',
} as const;

/**
 * 错误消息
 */
export const errorMessages = {
  network: '网络连接失败，请检查网络设置',
  timeout: '请求超时，请稍后重试',
  unauthorized: '未授权访问，请检查 API 密钥',
  forbidden: '权限不足，无法访问此资源',
  notFound: '请求的资源不存在',
  serverError: '服务器内部错误，请稍后重试',
  validation: '数据验证失败，请检查输入内容',
  unknown: '发生未知错误，请稍后重试',
} as const;

/**
 * 成功消息
 */
export const successMessages = {
  created: '创建成功',
  updated: '更新成功',
  deleted: '删除成功',
  saved: '保存成功',
  uploaded: '上传成功',
  downloaded: '下载成功',
  activated: '激活成功',
  verified: '验证成功',
} as const;

/**
 * 软件分类配置
 */
export const softwareCategories = [
  { id: 'tools', name: '工具软件', icon: '🔧' },
  { id: 'development', name: '开发工具', icon: '💻' },
  { id: 'design', name: '设计软件', icon: '🎨' },
  { id: 'multimedia', name: '多媒体', icon: '🎬' },
  { id: 'productivity', name: '办公软件', icon: '📊' },
  { id: 'games', name: '游戏娱乐', icon: '🎮' },
  { id: 'security', name: '安全软件', icon: '🔒' },
  { id: 'system', name: '系统工具', icon: '⚙️' },
  { id: 'education', name: '教育学习', icon: '📚' },
  { id: 'communication', name: '通讯社交', icon: '💬' },
] as const;

/**
 * 优先级配置
 */
export const priorities = [
  { id: 'low', name: '低', color: 'gray' },
  { id: 'normal', name: '普通', color: 'blue' },
  { id: 'high', name: '高', color: 'orange' },
  { id: 'urgent', name: '紧急', color: 'red' },
] as const;

/**
 * 公告类型配置
 */
export const announcementTypes = [
  { id: 'general', name: '一般公告', color: 'blue' },
  { id: 'update', name: '更新通知', color: 'green' },
  { id: 'security', name: '安全公告', color: 'red' },
  { id: 'maintenance', name: '维护通知', color: 'yellow' },
  { id: 'feature', name: '功能介绍', color: 'purple' },
  { id: 'bugfix', name: '修复通知', color: 'orange' },
] as const;

/**
 * 版本类型配置
 */
export const versionTypes = [
  { id: 'release', name: '正式版', color: 'green' },
  { id: 'beta', name: '测试版', color: 'orange' },
  { id: 'alpha', name: '内测版', color: 'red' },
] as const;

/**
 * 检查配置是否有效
 */
export function validateConfig(): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!apiConfig.baseUrl) {
    errors.push('API 基础 URL 未配置');
  }
  
  if (!apiConfig.apiKey) {
    errors.push('API 密钥未配置');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * 获取环境信息
 */
export function getEnvironmentInfo() {
  return {
    isDevelopment: import.meta.env.DEV,
    isProduction: import.meta.env.PROD,
    mode: import.meta.env.MODE,
    baseUrl: import.meta.env.BASE_URL,
  };
}
