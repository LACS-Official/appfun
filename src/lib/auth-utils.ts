/**
 * 认证工具函数
 * 提供页面级别的认证状态检查和管理
 */

import { appConfig } from './config';

// 延迟导入 AuthManager 以避免循环依赖和模块加载问题
let AuthManager: any = null;

async function getAuthManager() {
  if (!AuthManager) {
    try {
      const module = await import('./supabase-auth');
      AuthManager = module.AuthManager || module.SupabaseAuthManager;
    } catch (error) {
      console.error('Failed to import AuthManager:', error);
      return null;
    }
  }
  return AuthManager;
}

// 同步获取 AuthManager（用于已经加载的情况）
function getAuthManagerSync() {
  // 尝试从全局对象获取
  if (typeof window !== 'undefined' && window.authManager) {
    return window.authManager;
  }

  // 如果已经导入过，直接返回
  if (AuthManager) {
    return AuthManager.getInstance();
  }

  // 尝试同步导入（如果模块已加载）
  try {
    const module = require('./supabase-auth');
    AuthManager = module.AuthManager || module.SupabaseAuthManager;
    if (AuthManager) {
      return AuthManager.getInstance();
    }
  } catch (e) {
    // 模块未加载，返回 null
  }

  return null;
}

/**
 * 检查是否处于备案审核模式
 */
export function isUnderReview(): boolean {
  // 检查是否设置了备案审核模式
  if (appConfig.auth.wechatMiniprogram.备案审核Mode) {
    return true;
  }

  // 检查URL参数中是否包含审核标记
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('under_review') === 'true') {
    return true;
  }

  // 检查本地存储中是否设置了审核模式
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('under_review') === 'true';
    }
  } catch (e) {
    // 忽略存储访问错误
  }

  return false;
}

/**
 * 检查当前路径是否允许匿名访问（备案审核要求）
 */
export function isPathAllowedAnonymously(path: string = window.location.pathname): boolean {
  if (!isUnderReview()) {
    return false;
  }

  const allowedPaths = appConfig.auth.wechatMiniprogram.allowAnonymousPaths;
  return allowedPaths.some(allowedPath => {
    // 处理通配符路径
    if (allowedPath.endsWith('/*')) {
      const prefix = allowedPath.slice(0, -1); // 移除 '*'
      return path.startsWith(prefix);
    }
    return path === allowedPath;
  });
}

/**
 * 页面加载时检查认证状态
 */
export function initializePageAuth(): void {
  if (typeof window === 'undefined') {
    return; // 服务端渲染时跳过
  }

  // 备案审核模式下跳过认证检查
  if (isUnderReview() && isPathAllowedAnonymously()) {
    console.log('备案审核模式：允许匿名访问当前路径');
    return;
  }

  const authManager = getAuthManagerSync();
  if (!authManager) {
    console.warn('AuthManager 未初始化，跳过认证状态检查');
    return;
  }

  // 检查认证状态有效性
  if (!authManager.isAuthStateValid()) {
    console.log('认证状态无效或已过期');
    return;
  }

  // 刷新认证状态（延长会话）
  authManager.refreshAuthState();

  console.log('页面认证状态已初始化');
}

/**
 * 检查用户是否已登录
 */
export function isUserLoggedIn(): boolean {
  if (typeof window === 'undefined') {
    return false; // 服务端渲染时返回未登录
  }

  // 备案审核模式下允许匿名访问
  if (isUnderReview() && isPathAllowedAnonymously()) {
    return true;
  }

  const authManager = getAuthManagerSync();
  if (!authManager) {
    return false;
  }

  return authManager.isAuthStateValid() && authManager.getAuthState().isLoggedIn;
}

/**
 * 获取当前用户信息
 */
export function getCurrentUser() {
  if (typeof window === 'undefined') {
    return null; // 服务端渲染时返回空
  }

  // 备案审核模式下返回模拟用户信息
  if (isUnderReview() && isPathAllowedAnonymously()) {
    return {
      id: 0,
      auth_user_id: 'review-mode-user',
      email: 'review@example.com',
      username: '审核用户',
      full_name: '小程序审核员',
      avatar: '',
      email_confirmed_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      isLoggedIn: true
    };
  }

  const authManager = getAuthManagerSync();
  if (!authManager || !authManager.isAuthStateValid()) {
    return null;
  }

  return authManager.getAuthState().user;
}

/**
 * 需要登录的页面保护
 */
export function requireAuth(redirectUrl?: string): boolean {
  if (typeof window === 'undefined') {
    return false; // 服务端渲染时跳过
  }

  // 备案审核模式下跳过登录检查
  if (isUnderReview() && isPathAllowedAnonymously()) {
    return true;
  }

  if (!isUserLoggedIn()) {
    const currentUrl = window.location.href;
    const loginUrl = redirectUrl || `/auth/sign-in?redirect=${encodeURIComponent(currentUrl)}`;
    window.location.href = loginUrl;
    return false;
  }

  return true;
}

/**
 * 已登录用户重定向（用于登录页面等）
 */
export function redirectIfLoggedIn(redirectUrl: string = '/'): boolean {
  if (typeof window === 'undefined') {
    return false; // 服务端渲染时跳过
  }

  if (isUserLoggedIn()) {
    window.location.href = redirectUrl;
    return true;
  }

  return false;
}

/**
 * 监听认证状态变化
 */
export function onAuthStateChange(callback: (isLoggedIn: boolean, user: any) => void): () => void {
  if (typeof window === 'undefined') {
    return () => {}; // 服务端渲染时返回空函数
  }

  const authManager = getAuthManagerSync();
  if (!authManager) {
    console.warn('AuthManager 未初始化，无法监听状态变化');
    // 返回一个延迟初始化的监听器
    let unsubscribe: (() => void) | null = null;
    
    const tryInitialize = async () => {
      const manager = await getAuthManager();
      if (manager && manager.onAuthStateChange) {
        unsubscribe = manager.onAuthStateChange(callback);
      }
    };
    
    tryInitialize();
    
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }

  if (typeof authManager.onAuthStateChange === 'function') {
    return authManager.onAuthStateChange(callback);
  } else {
    console.error('authManager.onAuthStateChange is not a function');
    return () => {};
  }
}

/**
 * 自动刷新认证状态（用于长时间运行的页面）
 */
export function startAuthRefreshTimer(): () => void {
  if (typeof window === 'undefined') {
    return () => {}; // 服务端渲染时返回空函数
  }

  // 每5分钟检查一次认证状态
  const intervalId = setInterval(() => {
    const authManager = getAuthManagerSync();
    if (authManager && authManager.isAuthStateValid()) {
      authManager.refreshAuthState();
    }
  }, 5 * 60 * 1000); // 5分钟

  // 返回清理函数
  return () => {
    clearInterval(intervalId);
  };
}

/**
 * 页面可见性变化时刷新认证状态
 */
export function setupVisibilityRefresh(): () => void {
  if (typeof window === 'undefined') {
    return () => {}; // 服务端渲染时返回空函数
  }

  const handleVisibilityChange = () => {
    if (!document.hidden) {
      const authManager = getAuthManagerSync();
      if (authManager && authManager.isAuthStateValid()) {
        // 页面变为可见时刷新认证状态
        authManager.refreshAuthState();
      }
    }
  };

  document.addEventListener('visibilitychange', handleVisibilityChange);

  // 返回清理函数
  return () => {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  };
}

/**
 * 完整的页面认证初始化（推荐在每个页面使用）
 */
export function setupPageAuth(): () => void {
  if (typeof window === 'undefined') {
    return () => {}; // 服务端渲染时返回空函数
  }

  // 初始化认证状态
  initializePageAuth();

  // 设置自动刷新
  const stopRefreshTimer = startAuthRefreshTimer();
  const stopVisibilityRefresh = setupVisibilityRefresh();

  // 返回清理函数
  return () => {
    stopRefreshTimer();
    stopVisibilityRefresh();
  };
}

/**
 * 格式化用户显示名称
 */
export function getUserDisplayName(user: any): string {
  if (!user) return '未知用户';
  
  if (user.full_name && user.full_name.trim()) {
    return user.full_name;
  }
  
  if (user.username && user.username.trim()) {
    return user.username;
  }
  
  if (user.email) {
    return user.email.split('@')[0];
  }
  
  return `用户 #${user.id}`;
}

/**
 * 获取用户头像URL
 */
export function getUserAvatarUrl(user: any): string {
  if (!user) return '';
  
  if (user.avatar && user.avatar.trim()) {
    return user.avatar;
  }
  
  // 返回默认头像或生成头像
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(getUserDisplayName(user))}&background=random`;
}
