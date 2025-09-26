// 基础 API 响应类型
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  code?: number;
  timestamp?: string;
}

// 分页信息
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// 分页响应
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: Pagination;
}

// 软件列表响应（匹配实际API结构）
export interface SoftwareListResponse extends ApiResponse<{
  software: Software[];
  pagination: Pagination;
}> {}

// 轮播图数据结构
export interface Banner {
  id: number;
  title: string;
  description?: string;
  imageUrl: string;
  imageAlt?: string;
  linkUrl?: string;
  linkTarget?: '_self' | '_blank';
  sortOrder: number;
  isActive: boolean;
  viewCount: number;
  clickCount: number;
  createdAt: string;
  updatedAt: string;
}

// 轮播图查询参数
export interface BannerQueryParams {
  page?: number;
  limit?: number;
  isActive?: boolean;
}

// 轮播图列表响应
export interface BannerListResponse extends ApiResponse<{
  website: {
    id: number;
    name: string;
  };
  banners: Banner[];
  pagination: Pagination;
}> {}

// 软件相关类型
export interface Software {
  id: number;
  name: string;
  nameEn?: string;
  description: string;
  descriptionEn?: string;
  currentVersion: string;
  currentVersionId?: number | null;
  latestDownloadUrl?: string | null;
  category?: string;
  tags: string[];
  officialWebsite?: string;
  openname?: string;
  filetype?: string;
  viewCount?: number; // 浏览量统计
  rank?: number; // 排行榜排名
  systemRequirements?: {
    os?: string[];
    memory?: string;
    storage?: string;
  };
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  versions?: SoftwareVersion[];
  announcements?: Announcement[];
}

// 软件版本
export interface SoftwareVersion {
  id: number;
  version: string;
  releaseNotes: string;
  releaseNotesEn?: string;
  releaseDate: string;
  downloadLinks?: {
    official?: string;
    quark?: string;
    pan123?: string;
    baidu?: string;
    thunder?: string;
    github?: string;
    backup?: string[];
  };
  fileSize?: string;
  isStable: boolean;
  versionType: 'release' | 'beta' | 'alpha';
  metadata?: Record<string, any>;
}

// 公告
export interface Announcement {
  id: number;
  title: string;
  titleEn?: string;
  content: string;
  contentEn?: string;
  type: 'general' | 'update' | 'security' | 'maintenance' | 'feature' | 'bugfix';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  version?: string;
  isPublished: boolean;
  publishedAt?: string;
  expiresAt?: string;
  metadata?: Record<string, any>;
}



// 标签信息
export interface TagInfo {
  name: string;
  count?: number;
}

export interface TagsResponse extends ApiResponse {
  data: {
    tags: string[] | TagInfo[];
    total: number;
    totalSoftware?: number;
  };
}

// API 查询参数
export interface SoftwareQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  tags?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  minViewCount?: number; // 最小浏览量筛选
  timeRange?: 'all' | 'today' | 'week' | 'month' | 'year'; // 时间范围
}

// 排行榜查询参数
export interface RankingQueryParams extends SoftwareQueryParams {
  // 继承所有软件查询参数，用于排行榜筛选
}

// 排行榜响应数据
export interface RankingResponse extends PaginatedResponse<Software> {
  summary?: {
    totalSoftware: number;
    totalViews: number;
    averageViews: number;
  };
}

export interface VersionQueryParams {
  page?: number;
  limit?: number;
  versionType?: 'all' | 'release' | 'beta' | 'alpha';
  isStable?: boolean;
  sortBy?: 'releaseDate' | 'version';
  sortOrder?: 'asc' | 'desc';
}

export interface AnnouncementQueryParams {
  page?: number;
  limit?: number;
  type?: 'all' | 'general' | 'update' | 'security' | 'maintenance';
  priority?: 'all' | 'low' | 'normal' | 'high' | 'urgent';
  isPublished?: boolean;
  sortBy?: 'publishedAt' | 'priority';
  sortOrder?: 'asc' | 'desc';
}
