import type {
  ApiResponse,
  PaginatedResponse,
  SoftwareListResponse,
  Software,
  SoftwareQueryParams,
  RankingQueryParams,
  RankingResponse,
  SoftwareVersion,
  VersionQueryParams,
  Announcement,
  AnnouncementQueryParams,
  TagsResponse,
  Banner,
  BannerQueryParams,
  BannerListResponse,
} from '../types/api';
import { buildQueryString } from './utils';

/**
 * API 配置
 */
export interface ApiConfig {
  baseUrl: string;
  apiKey: string;
  timeout?: number;
}

/**
 * API 客户端类
 */
export class ApiClient {
  private config: ApiConfig;

  constructor(config: ApiConfig) {
    this.config = {
      timeout: 10000,
      ...config,
    };
  }

  /**
   * 发送 HTTP 请求
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.config.baseUrl}${endpoint}`;
    
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    };

    // 只在有API密钥时才添加
    if (this.config.apiKey) {
      headers['X-API-Key'] = this.config.apiKey;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('请求超时');
      }
      throw error;
    }
  }

  /**
   * GET 请求
   */
  private async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const queryString = params ? buildQueryString(params) : '';
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request<T>(url);
  }



  // ==================== 软件管理 API ====================

  /**
   * 获取软件列表
   */
  async getSoftwareList(params?: SoftwareQueryParams): Promise<SoftwareListResponse> {
    return this.get<SoftwareListResponse>('/app/software', params);
  }

  /**
   * 获取所有可用标签
   */
  async getSoftwareTags(params?: {
    includeCount?: boolean;
    minCount?: number;
    sortBy?: 'name' | 'count';
    sortOrder?: 'asc' | 'desc';
  }): Promise<TagsResponse> {
    return this.get<TagsResponse>('/app/software/tags', params);
  }

  /**
   * 根据 ID 获取软件详情
   */
  async getSoftwareById(id: number): Promise<ApiResponse<Software>> {
    return this.get<ApiResponse<Software>>(`/app/software/id/${id}`);
  }

  /**
   * 根据名称获取软件详情
   */
  async getSoftwareByName(name: string): Promise<ApiResponse<Software>> {
    return this.get<ApiResponse<Software>>(`/app/software/${encodeURIComponent(name)}`);
  }

  /**
   * 获取软件访问量排行榜
   */
  async getSoftwareRanking(params?: RankingQueryParams): Promise<RankingResponse> {
    return this.get<RankingResponse>('/app/software/ranking', params);
  }

  // ==================== 版本管理 API ====================

  /**
   * 获取软件版本历史
   */
  async getSoftwareVersions(
    softwareId: number,
    params?: VersionQueryParams
  ): Promise<PaginatedResponse<SoftwareVersion>> {
    return this.get<PaginatedResponse<SoftwareVersion>>(
      `/app/software/id/${softwareId}/versions`,
      params
    );
  }

  /**
   * 获取版本详情
   */
  async getSoftwareVersionById(
    softwareId: number,
    versionId: number
  ): Promise<ApiResponse<SoftwareVersion>> {
    return this.get<ApiResponse<SoftwareVersion>>(
      `/app/software/id/${softwareId}/versions/${versionId}`
    );
  }

  // ==================== 公告管理 API ====================

  /**
   * 获取软件公告列表
   */
  async getSoftwareAnnouncements(
    softwareId: number,
    params?: AnnouncementQueryParams
  ): Promise<PaginatedResponse<Announcement>> {
    return this.get<PaginatedResponse<Announcement>>(
      `/app/software/id/${softwareId}/announcements`,
      params
    );
  }

  /**
   * 获取公告详情
   */
  async getSoftwareAnnouncementById(
    softwareId: number,
    announcementId: number
  ): Promise<ApiResponse<Announcement>> {
    return this.get<ApiResponse<Announcement>>(
      `/app/software/id/${softwareId}/announcements/${announcementId}`
    );
  }

  /**
   * 获取轮播图列表
   */
  async getBanners(websiteId: number, params?: BannerQueryParams): Promise<BannerListResponse> {
    return this.get<BannerListResponse>(`/api/websites/${websiteId}/banners`, params);
  }

  /**
   * 获取轮播图详情
   */
  async getBannerById(websiteId: number, bannerId: number): Promise<ApiResponse<Banner>> {
    return this.get<ApiResponse<Banner>>(`/api/websites/${websiteId}/banners/${bannerId}`);
  }
}

/**
 * 默认 API 客户端实例
 */
let defaultApiClient: ApiClient | null = null;

/**
 * 初始化默认 API 客户端
 */
export function initializeApiClient(config: ApiConfig): void {
  defaultApiClient = new ApiClient(config);
}

/**
 * 获取默认 API 客户端
 */
export function getApiClient(): ApiClient {
  if (!defaultApiClient) {
    throw new Error('API 客户端未初始化。请先调用 initializeApiClient()');
  }
  return defaultApiClient;
}

/**
 * 创建新的 API 客户端实例
 */
export function createApiClient(config: ApiConfig): ApiClient {
  return new ApiClient(config);
}
