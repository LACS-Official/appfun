/**
 * 用户认证管理模块
 * 处理用户登录状态检查、会话管理、登录跳转等功能
 */

import { appConfig, storageKeys } from './config';

// 用户信息接口
export interface User {
  id: string;
  username: string;
  email?: string;
  avatar?: string;
  isLoggedIn: boolean;
  loginTime?: number;
  expiresAt?: number;
}

// 认证状态接口
export interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * 用户认证管理类
 */
export class AuthManager {
  private static instance: AuthManager;
  private authState: AuthState = {
    isLoggedIn: false,
    user: null,
    isLoading: false,
    error: null,
  };
  private listeners: Array<(state: AuthState) => void> = [];

  private constructor() {
    this.initializeAuth();
  }

  /**
   * 获取单例实例
   */
  public static getInstance(): AuthManager {
    if (!AuthManager.instance) {
      AuthManager.instance = new AuthManager();
    }
    return AuthManager.instance;
  }

  /**
   * 初始化认证状态
   */
  private initializeAuth(): void {
    try {
      const savedSession = this.getStoredSession();
      if (savedSession && this.isSessionValid(savedSession)) {
        this.authState = {
          isLoggedIn: true,
          user: savedSession,
          isLoading: false,
          error: null,
        };
      }
    } catch (error) {
      console.error('初始化认证状态失败:', error);
      this.clearSession();
    }
  }

  /**
   * 获取当前认证状态
   */
  public getAuthState(): AuthState {
    return { ...this.authState };
  }

  /**
   * 检查用户是否已登录
   */
  public isLoggedIn(): boolean {
    const session = this.getStoredSession();
    return session ? this.isSessionValid(session) : false;
  }

  /**
   * 获取当前用户信息
   */
  public getCurrentUser(): User | null {
    if (!this.isLoggedIn()) {
      return null;
    }
    return this.authState.user;
  }

  /**
   * 设置用户会话
   */
  public setUserSession(user: User): void {
    const sessionData = {
      ...user,
      isLoggedIn: true,
      loginTime: Date.now(),
      expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24小时过期
    };

    this.authState = {
      isLoggedIn: true,
      user: sessionData,
      isLoading: false,
      error: null,
    };

    this.storeSession(sessionData);
    this.notifyListeners();
  }

  /**
   * 清除用户会话
   */
  public clearSession(): void {
    this.authState = {
      isLoggedIn: false,
      user: null,
      isLoading: false,
      error: null,
    };

    this.removeStoredSession();
    this.notifyListeners();
  }

  /**
   * 添加状态变化监听器
   */
  public addListener(listener: (state: AuthState) => void): () => void {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  /**
   * 通知所有监听器
   */
  private notifyListeners(): void {
    this.listeners.forEach(listener => {
      try {
        listener(this.getAuthState());
      } catch (error) {
        console.error('认证状态监听器执行失败:', error);
      }
    });
  }

  /**
   * 获取存储的会话数据
   */
  private getStoredSession(): User | null {
    try {
      const sessionData = localStorage.getItem(storageKeys.userSession);
      return sessionData ? JSON.parse(sessionData) : null;
    } catch (error) {
      console.error('获取存储会话失败:', error);
      return null;
    }
  }

  /**
   * 存储会话数据
   */
  private storeSession(user: User): void {
    try {
      localStorage.setItem(storageKeys.userSession, JSON.stringify(user));
    } catch (error) {
      console.error('存储会话失败:', error);
    }
  }

  /**
   * 移除存储的会话数据
   */
  private removeStoredSession(): void {
    try {
      localStorage.removeItem(storageKeys.userSession);
    } catch (error) {
      console.error('移除存储会话失败:', error);
    }
  }

  /**
   * 检查会话是否有效
   */
  private isSessionValid(user: User): boolean {
    if (!user || !user.isLoggedIn) {
      return false;
    }

    // 检查是否过期
    if (user.expiresAt && Date.now() > user.expiresAt) {
      return false;
    }

    return true;
  }
}

/**
 * 下载验证管理类
 */
export class DownloadAuthManager {
  private static instance: DownloadAuthManager;
  private authManager: AuthManager;

  private constructor() {
    this.authManager = AuthManager.getInstance();
  }

  /**
   * 获取单例实例
   */
  public static getInstance(): DownloadAuthManager {
    if (!DownloadAuthManager.instance) {
      DownloadAuthManager.instance = new DownloadAuthManager();
    }
    return DownloadAuthManager.instance;
  }

  /**
   * 检查下载权限
   */
  public checkDownloadPermission(): boolean {
    if (!appConfig.auth.requireLoginForDownload) {
      return true;
    }
    return this.authManager.isLoggedIn();
  }

  /**
   * 处理下载请求
   */
  public handleDownloadRequest(downloadUrl: string, currentUrl?: string): boolean {
    if (this.checkDownloadPermission()) {
      // 有权限，允许下载
      return true;
    }

    // 无权限，保存返回URL并跳转到登录页面
    this.saveReturnUrl(currentUrl || window.location.href);
    this.redirectToLogin();
    return false;
  }

  /**
   * 保存返回URL
   */
  private saveReturnUrl(url: string): void {
    try {
      localStorage.setItem(storageKeys.returnUrl, url);
    } catch (error) {
      console.error('保存返回URL失败:', error);
    }
  }

  /**
   * 获取返回URL
   */
  public getReturnUrl(): string | null {
    try {
      return localStorage.getItem(storageKeys.returnUrl);
    } catch (error) {
      console.error('获取返回URL失败:', error);
      return null;
    }
  }

  /**
   * 清除返回URL
   */
  public clearReturnUrl(): void {
    try {
      localStorage.removeItem(storageKeys.returnUrl);
    } catch (error) {
      console.error('清除返回URL失败:', error);
    }
  }

  /**
   * 跳转到登录页面
   */
  private redirectToLogin(): void {
    const returnUrl = encodeURIComponent(window.location.href);
    const loginUrl = `${appConfig.auth.loginUrl}?${appConfig.auth.returnUrlParam}=${returnUrl}`;
    window.location.href = loginUrl;
  }

  /**
   * 显示登录提示
   */
  public showLoginPrompt(): void {
    if (window.showToast) {
      window.showToast('需要登录才能下载', 'warning', 3000);
    } else {
      alert('需要登录才能下载');
    }
  }
}

// 导出单例实例
export const authManager = AuthManager.getInstance();
export const downloadAuthManager = DownloadAuthManager.getInstance();

// 全局类型声明
declare global {
  interface Window {
    authManager: AuthManager;
    downloadAuthManager: DownloadAuthManager;
    showToast?: (message: string, type?: string, duration?: number) => void;
  }
}
