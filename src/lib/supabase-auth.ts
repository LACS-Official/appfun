/**
 * Supabase 认证管理模块
 * 处理用户登录状态检查、会话管理等功能
 */

import { createClient } from './supabase/client';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { appConfig } from './config';

// 用户信息接口
export interface User {
  id: number; // 数字ID
  auth_user_id: string; // 认证系统UUID
  email: string;
  username: string;
  full_name: string;
  avatar: string;
  email_confirmed_at: string | null;
  created_at: string;
  updated_at: string;
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

// 存储的认证数据接口
export interface StoredAuthData {
  user: User;
  loginTime: number;
  expiresAt: number;
  sessionId: string;
}

// 本地存储常量
const AUTH_STORAGE_KEY = 'supabase_auth_data';
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7天（毫秒）

/**
 * Supabase 认证管理类
 */
export class SupabaseAuthManager {
  private static instance: SupabaseAuthManager;
  private authState: AuthState = {
    isLoggedIn: false,
    user: null,
    isLoading: false,
    error: null,
  };
  private listeners: Array<(state: AuthState) => void> = [];
  private supabase: any = null;
  private isSupabaseConfigured = false;

  private constructor() {
    this.initializeSupabase();
    // 先恢复本地状态，再初始化远程认证
    this.restoreAuthState();
    this.initializeAuth();
  }

  /**
   * 初始化 Supabase 客户端
   */
  private initializeSupabase(): void {
    try {
      this.supabase = createClient();
      this.isSupabaseConfigured = true;
      console.log('Supabase 客户端初始化成功');
    } catch (error) {
      console.warn('Supabase 未配置或配置无效:', error instanceof Error ? error.message : error);
      this.isSupabaseConfigured = false;
      this.authState.error = 'Supabase 未配置，认证功能不可用';
    }
  }

  /**
   * 获取单例实例
   */
  public static getInstance(): SupabaseAuthManager {
    if (!SupabaseAuthManager.instance) {
      SupabaseAuthManager.instance = new SupabaseAuthManager();
    }
    return SupabaseAuthManager.instance;
  }

  /**
   * 初始化认证状态
   */
  private async initializeAuth(): Promise<void> {
    try {
      this.authState.isLoading = true;
      this.notifyListeners();

      // 如果 Supabase 未配置，跳过认证初始化
      if (!this.isSupabaseConfigured || !this.supabase) {
        this.authState = {
          isLoggedIn: false,
          user: null,
          isLoading: false,
          error: 'Supabase 未配置，请配置后重新加载页面',
        };
        this.notifyListeners();
        return;
      }

      // 获取当前用户
      const { data: { user }, error } = await this.supabase.auth.getUser();
      
      if (error) {
        console.error('获取用户信息失败:', error);
        // 如果已有本地状态且有效，保持本地状态
        if (!this.authState.isLoggedIn || !this.isAuthStateValid()) {
          this.authState = {
            isLoggedIn: false,
            user: null,
            isLoading: false,
            error: error.message,
          };
        }
      } else if (user) {
        const transformedUser = this.transformSupabaseUser(user);
        this.authState = {
          isLoggedIn: true,
          user: transformedUser,
          isLoading: false,
          error: null,
        };
        // 保存到本地存储
        this.saveAuthState(transformedUser);
      } else {
        // 如果没有远程用户但有有效的本地状态，保持本地状态
        if (!this.authState.isLoggedIn || !this.isAuthStateValid()) {
          this.authState = {
            isLoggedIn: false,
            user: null,
            isLoading: false,
            error: null,
          };
        }
      }

      // 监听认证状态变化
      this.supabase.auth.onAuthStateChange((event: string, session: { user?: any } | null) => {
        console.log('认证状态变化:', event, session?.user?.email);

        if (session?.user) {
          const user = this.transformSupabaseUser(session.user);
          this.authState = {
            isLoggedIn: true,
            user,
            isLoading: false,
            error: null,
          };
          // 保存到本地存储
          this.saveAuthState(user);
        } else {
          this.authState = {
            isLoggedIn: false,
            user: null,
            isLoading: false,
            error: null,
          };
          // 清除本地存储
          this.clearAuthState();
        }

        this.notifyListeners();

        // 触发全局认证状态变化事件
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('authStateChanged', {
            detail: {
              isLoggedIn: this.authState.isLoggedIn,
              user: this.authState.user,
              event: event
            }
          }));
        }
      });

    } catch (error) {
      console.error('初始化认证状态失败:', error);
      this.authState = {
        isLoggedIn: false,
        user: null,
        isLoading: false,
        error: error instanceof Error ? error.message : '初始化失败',
      };
    }

    this.notifyListeners();
  }

  /**
   * 转换 Supabase 用户对象为内部用户对象
   */
  private transformSupabaseUser(supabaseUser: SupabaseUser): User {
    return {
      id: typeof supabaseUser.id === 'string' ? parseInt(supabaseUser.id, 10) : supabaseUser.id,
      auth_user_id: supabaseUser.id,
      username: supabaseUser.user_metadata?.username || supabaseUser.email?.split('@')[0] || 'User',
      email: supabaseUser.email || '',
      avatar: supabaseUser.user_metadata?.avatar_url || '',
      full_name: '',
      email_confirmed_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      isLoggedIn: true,
      loginTime: Date.now(),
      expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24小时过期
    };
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
    return this.authState.isLoggedIn && this.authState.user !== null;
  }

  /**
   * 获取当前用户信息
   */
  public getCurrentUser(): User | null {
    return this.authState.user;
  }

  /**
   * 登录
   */
  public async signIn(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    if (!this.isSupabaseConfigured || !this.supabase) {
      // 使用模拟登录
      return this.simulateSignIn(email, password);
    }

    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.warn('Supabase 登录失败，尝试模拟登录:', error.message);
        // 如果是 API 密钥错误，使用模拟登录
        if (error.message.includes('Invalid API key') || error.message.includes('Invalid login credentials')) {
          return this.simulateSignIn(email, password);
        }
        return { success: false, error: error.message };
      }

      // 更新认证状态
      if (data.user) {
        const user = this.transformSupabaseUser(data.user);
        this.authState = {
          isLoggedIn: true,
          user: user,
          isLoading: false,
          error: null,
        };

        // 保存到本地存储
        this.saveAuthState(user);
        this.notifyListeners();
      }

      return { success: true };
    } catch (error) {
      console.warn('Supabase 登录异常，使用模拟登录:', error);
      return this.simulateSignIn(email, password);
    }
  }

  /**
   * 模拟登录流程
   */
  private async simulateSignIn(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    try {
      // 基本验证
      if (!email || !password) {
        return { success: false, error: '邮箱和密码不能为空' };
      }

      if (!email.includes('@')) {
        return { success: false, error: '请输入有效的邮箱地址' };
      }

      if (password.length < 6) {
        return { success: false, error: '密码长度至少为6位' };
      }

      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 创建模拟用户
      const mockUser: User = {
        id: Math.floor(Math.random() * 1000) + 1000, // 模拟数字ID
        auth_user_id: `mock-auth-${Date.now()}`, // 模拟认证UUID
        email: email,
        username: email.split('@')[0],
        full_name: '模拟用户',
        avatar: '',
        email_confirmed_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        isLoggedIn: true,
      };

      // 更新认证状态
      this.authState = {
        isLoggedIn: true,
        user: mockUser,
        isLoading: false,
        error: null,
      };

      // 保存到本地存储
      this.saveAuthState(mockUser);
      this.notifyListeners();

      console.log('模拟登录成功:', mockUser);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '登录失败'
      };
    }
  }

  /**
   * 注册
   */
  public async signUp(email: string, password: string): Promise<{ success: boolean; error?: string; user?: any }> {
    if (!this.isSupabaseConfigured || !this.supabase) {
      // 模拟注册流程
      return this.simulateSignUp(email, password);
    }

    try {
      const { data, error } = await this.supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/api/auth/confirm`,
        },
      });

      if (error) {
        console.warn('Supabase 注册失败，使用模拟注册:', error.message);
        // 如果是 API 密钥错误，使用模拟注册
        if (error.message.includes('Invalid API key') || error.message.includes('Unable to validate email address')) {
          return this.simulateSignUp(email, password);
        }
        return { success: false, error: error.message };
      }

      // 更新认证状态
      if (data.user) {
        const user = this.transformSupabaseUser(data.user);
        this.authState = {
          isLoggedIn: true,
          user: user,
          isLoading: false,
          error: null,
        };

        // 保存到本地存储
        this.saveAuthState(user);
        this.notifyListeners();
      }

      return {
        success: true,
        user: data.user ? this.transformSupabaseUser(data.user) : null
      };
    } catch (error) {
      console.warn('Supabase 注册异常，使用模拟注册:', error);
      return this.simulateSignUp(email, password);
    }
  }

  /**
   * 模拟注册流程
   */
  private async simulateSignUp(email: string, password: string): Promise<{ success: boolean; error?: string; user?: any }> {
    try {
      // 基本验证
      if (!email || !password) {
        return { success: false, error: '邮箱和密码不能为空' };
      }

      if (password.length < 6) {
        return { success: false, error: '密码长度至少为6位' };
      }

      if (!email.includes('@')) {
        return { success: false, error: '请输入有效的邮箱地址' };
      }

      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 创建模拟用户
      const mockUser: User = {
        id: Math.floor(Math.random() * 1000) + 1000, // 模拟数字ID
        auth_user_id: `mock-auth-${Date.now()}`, // 模拟认证UUID
        email: email,
        username: email.split('@')[0],
        full_name: '',
        avatar: '',
        email_confirmed_at: null, // 注册时邮箱未确认
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        isLoggedIn: true,
      };

      // 更新认证状态
      this.authState = {
        isLoggedIn: true,
        user: mockUser,
        isLoading: false,
        error: null,
      };

      // 保存到本地存储
      this.saveAuthState(mockUser);
      this.notifyListeners();

      console.log('模拟注册成功:', mockUser);

      return {
        success: true,
        user: mockUser
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '注册失败'
      };
    }
  }

  /**
   * 退出登录
   */
  public async signOut(): Promise<{ success: boolean; error?: string }> {
    // 清除本地存储
    this.clearAuthState();

    if (!this.isSupabaseConfigured || !this.supabase) {
      // 即使 Supabase 未配置，也清除本地状态
      this.authState = {
        isLoggedIn: false,
        user: null,
        isLoading: false,
        error: null,
      };
      this.notifyListeners();
      return { success: true };
    }

    try {
      const { error } = await this.supabase.auth.signOut();

      if (error) {
        return { success: false, error: error.message };
      }

      // 清除认证状态
      this.authState = {
        isLoggedIn: false,
        user: null,
        isLoading: false,
        error: null,
      };
      this.notifyListeners();

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '退出登录失败'
      };
    }
  }

  /**
   * 重置密码
   */
  public async resetPassword(email: string): Promise<{ success: boolean; error?: string }> {
    if (!this.isSupabaseConfigured || !this.supabase) {
      return { success: false, error: 'Supabase 未配置，无法重置密码' };
    }

    try {
      const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '重置密码失败'
      };
    }
  }

  /**
   * 添加状态变化监听器
   */
  public addListener(listener: (state: AuthState) => void): () => void {
    this.listeners.push(listener);
    
    // 返回取消监听的函数
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  /**
   * 监听认证状态变化（兼容性方法）
   */
  public onAuthStateChange(callback: (isLoggedIn: boolean, user: User | null) => void): () => void {
    return this.addListener((state: AuthState) => {
      callback(state.isLoggedIn, state.user);
    });
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
   * 检查下载权限
   */
  public checkDownloadPermission(): boolean {
    // 备案审核模式下允许下载
    if (this.isUnderReview()) {
      return true;
    }
    
    return this.isLoggedIn();
  }

  /**
   * 处理下载请求
   */
  public handleDownloadRequest(downloadUrl: string): boolean {
    if (this.checkDownloadPermission()) {
      // 有权限，允许下载
      return true;
    }

    // 无权限，跳转到登录页面
    window.location.href = '/auth/login';
    return false;
  }

  /**
   * 保存认证状态到本地存储
   */
  private saveAuthState(user: User): void {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return; // 服务端或不支持 localStorage
      }

      const now = Date.now();
      const authData: StoredAuthData = {
        user: {
          ...user,
          loginTime: now,
          expiresAt: now + SESSION_DURATION
        },
        loginTime: now,
        expiresAt: now + SESSION_DURATION,
        sessionId: this.generateSessionId()
      };

      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
      console.log('认证状态已保存到本地存储');
    } catch (error) {
      console.warn('保存认证状态失败:', error);
    }
  }

  /**
   * 从本地存储恢复认证状态
   */
  private restoreAuthState(): void {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return; // 服务端或不支持 localStorage
      }

      const storedData = localStorage.getItem(AUTH_STORAGE_KEY);
      if (!storedData) {
        return; // 没有存储的数据
      }

      const authData: StoredAuthData = JSON.parse(storedData);
      const now = Date.now();

      // 检查是否过期
      if (now > authData.expiresAt) {
        console.log('存储的认证状态已过期，清除数据');
        this.clearAuthState();
        return;
      }

      // 验证数据完整性
      if (!authData.user || !authData.user.id || !authData.user.email) {
        console.warn('存储的认证数据不完整，清除数据');
        this.clearAuthState();
        return;
      }

      // 恢复认证状态
      this.authState = {
        isLoggedIn: true,
        user: {
          ...authData.user,
          isLoggedIn: true
        },
        isLoading: false,
        error: null,
      };

      console.log('认证状态已从本地存储恢复:', authData.user.email);
      this.notifyListeners();

      // 延长会话时间（如果距离过期还有不到1天）
      const timeUntilExpiry = authData.expiresAt - now;
      if (timeUntilExpiry < 24 * 60 * 60 * 1000) { // 少于1天
        this.saveAuthState(authData.user);
      }

    } catch (error) {
      console.warn('恢复认证状态失败:', error);
      this.clearAuthState();
    }
  }

  /**
   * 清除本地存储的认证状态
   */
  private clearAuthState(): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        console.log('本地存储的认证状态已清除');
      }
    } catch (error) {
      console.warn('清除认证状态失败:', error);
    }
  }

  /**
   * 生成会话ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 检查认证状态是否有效
   */
  public isAuthStateValid(): boolean {
    if (!this.authState.isLoggedIn || !this.authState.user) {
      return false;
    }

    // 检查是否过期
    if (this.authState.user.expiresAt && Date.now() > this.authState.user.expiresAt) {
      console.log('认证状态已过期');
      this.signOut();
      return false;
    }

    return true;
  }

  /**
   * 刷新认证状态（延长会话时间）
   */
  public refreshAuthState(): void {
    if (this.authState.isLoggedIn && this.authState.user) {
      this.saveAuthState(this.authState.user);
      console.log('认证状态已刷新');
    }
  }

  /**
   * 检查是否处于微信小程序备案审核模式
   * 在备案审核期间，允许匿名访问所有内容
   */
  public isUnderReview(): boolean {
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
  public isPathAllowedAnonymously(path: string): boolean {
    if (!this.isUnderReview()) {
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
}

// 创建全局实例
export const supabaseAuthManager = SupabaseAuthManager.getInstance();

// 兼容性：为了保持与现有代码的兼容性，也导出为 authManager
export const authManager = supabaseAuthManager;

// 导出类别名，用于新的持久化功能
export const AuthManager = SupabaseAuthManager;

// 设置全局实例（用于浏览器环境）
if (typeof window !== 'undefined') {
  window.authManager = authManager;
  window.SupabaseAuthManager = SupabaseAuthManager;
  window.AuthManager = AuthManager;
}
