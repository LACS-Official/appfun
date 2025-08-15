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
