import { useEffect, useState } from 'react'
import { Tab } from '@headlessui/react'

function classNames(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

type Software = {
  id: string
  name: string
  icon?: string
  viewCount?: number
  description?: string
  category?: { name?: string } | string
  updatedAt?: string
  createdAt?: string
}

export default function SidebarTabs({ initialPopular = [], initialLatest = [] }: { initialPopular?: Software[], initialLatest?: Software[] }) {
  const [popular, setPopular] = useState<Software[]>(initialPopular)
  const [latest, setLatest] = useState<Software[]>(initialLatest)
  const [loading, setLoading] = useState(initialPopular.length === 0 && initialLatest.length === 0)

  useEffect(() => {
    let attempts = 0;
    let isMounted = true;

    const checkApiAndFetch = () => {
      const api = (window as any).apiClient;
      if (api) {
        fetchData(api);
      } else if (attempts < 50) {
        attempts++;
        setTimeout(checkApiAndFetch, 100);
      } else {
        if (isMounted) setLoading(false);
        console.error('API Client initialization timeout in SidebarTabs');
      }
    };

    const fetchData = async (api: any) => {
      try {
        const [rankRes, listRes] = await Promise.all([
          api.getSoftwareRanking({ page: 1, limit: 5, sortBy: 'viewCount', sortOrder: 'desc' }),
          api.getSoftwareList({ page: 1, limit: 5, sortBy: 'createdAt', sortOrder: 'desc' }),
        ])

        if (isMounted && rankRes?.success && Array.isArray(rankRes.data)) {
          setPopular(rankRes.data.slice(0, 5))
        }

        if (isMounted && listRes?.success && listRes.data?.software) {
          setLatest(listRes.data.software.slice(0, 5))
        }
      } catch (error) {
        console.error('Failed to fetch sidebar data:', error)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    checkApiAndFetch();

    return () => {
      isMounted = false;
    }
  }, [])

  return (
    <div className="bg-white dark:bg-[#161617] rounded-3xl shadow-[0_4px_24px_-2px_rgba(0,0,0,0.04)] border border-black/[0.04] dark:border-white/[0.06] overflow-hidden flex flex-col h-full transition-colors">
      <Tab.Group>
        <Tab.List className="flex p-1 bg-black/[0.04] dark:bg-white/[0.06] m-3 rounded-full border border-black/[0.02] dark:border-white/[0.04]">
          <Tab
            className={({ selected }) =>
              classNames(
                'flex-1 py-2 text-xs font-semibold text-center rounded-full transition-all duration-200 flex items-center justify-center space-x-1.5 outline-none',
                selected 
                  ? 'bg-white dark:bg-[#1d1d1f] text-[#0071e3] dark:text-[#2997ff] shadow-sm font-bold' 
                  : 'text-[#86868b] dark:text-[#a1a1a6] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7]'
              )
            }
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span>热门榜单</span>
          </Tab>
          <Tab
            className={({ selected }) =>
              classNames(
                'flex-1 py-2 text-xs font-semibold text-center rounded-full transition-all duration-200 flex items-center justify-center space-x-1.5 outline-none',
                selected 
                  ? 'bg-white dark:bg-[#1d1d1f] text-[#0071e3] dark:text-[#2997ff] shadow-sm font-bold' 
                  : 'text-[#86868b] dark:text-[#a1a1a6] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7]'
              )
            }
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>最新收录</span>
          </Tab>
        </Tab.List>

        <div className="flex-1 overflow-y-auto custom-scrollbar px-3 pb-4">
          <Tab.Panels>
            <Tab.Panel className="animate-in fade-in slide-in-from-bottom-2 duration-300 outline-none">
              {loading ? (
                <div className="space-y-2.5 p-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center space-x-3.5 p-2.5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] animate-pulse">
                      <div className="w-10 h-10 bg-black/5 dark:bg-white/10 rounded-2xl" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3.5 bg-black/5 dark:bg-white/10 rounded-full w-2/3" />
                        <div className="h-2.5 bg-black/5 dark:bg-white/10 rounded-full w-1/3" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-1">
                  {popular.length === 0 ? (
                    <div className="py-12 text-center">
                      <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-black/[0.03] dark:bg-white/[0.05] flex items-center justify-center text-[#86868b]">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                      <p className="text-xs text-[#86868b]">暂无榜单数据</p>
                    </div>
                  ) : (
                    popular.map((software, index) => {
                      const isTop3 = index < 3
                      const rankStyles = [
                        'bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold',
                        'bg-slate-500/15 text-slate-600 dark:text-slate-300 font-bold',
                        'bg-orange-500/15 text-orange-600 dark:text-orange-400 font-bold',
                      ]

                      return (
                        <div
                          key={software.id}
                          className="group flex items-center p-2.5 rounded-2xl hover:bg-black/[0.03] dark:hover:bg-white/[0.05] transition-all duration-200 cursor-pointer"
                          onClick={() => (window.location.href = `/software/${software.id}`)}
                        >
                          <div className={classNames(
                            'flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full font-bold text-xs mr-3 transition-colors',
                            isTop3 ? rankStyles[index] : 'bg-black/[0.04] dark:bg-white/[0.06] text-[#86868b] dark:text-[#6e6e73]'
                          )}>
                            {index + 1}
                          </div>
                          <div className="flex-shrink-0 mr-3">
                            <div className="relative">
                              {software.icon ? (
                                <img
                                  src={software.icon}
                                  alt={software.name}
                                  className="w-10 h-10 rounded-2xl object-cover shadow-sm bg-black/[0.02] dark:bg-white/[0.05] border border-black/[0.04] dark:border-white/[0.08]"
                                  loading="lazy"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-2xl bg-black/[0.04] dark:bg-white/[0.08] text-[#515154] dark:text-[#a1a1a6] flex items-center justify-center text-sm font-bold">
                                  {software.name.charAt(0)}
                                </div>
                              )}
                              {isTop3 && (
                                <div className="absolute -top-0.5 -right-0.5 w-2 h-2 border border-white dark:border-[#161617] rounded-full bg-[#0071e3]"></div>
                              )}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-[13px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] truncate group-hover:text-[#0071e3] dark:group-hover:text-[#2997ff] transition-colors">
                              {software.name}
                            </h4>
                            <div className="flex items-center mt-0.5 text-[11px] text-[#86868b] dark:text-[#a1a1a6]">
                              <span className="flex items-center">
                                <svg className="w-3 h-3 mr-1 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                {formatCompactNumber(software.viewCount || 0)} 次查看
                              </span>
                              <span className="mx-1.5 opacity-40">•</span>
                              <span className="truncate">{software.category && (typeof software.category === 'string' ? software.category : software.category.name) || '工具'}</span>
                            </div>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              )}
            </Tab.Panel>

            <Tab.Panel className="animate-in fade-in slide-in-from-bottom-2 duration-300 outline-none">
              <div className="space-y-1">
                {loading ? (
                  <div className="space-y-2.5 p-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex items-center space-x-3.5 p-2.5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] animate-pulse">
                        <div className="w-10 h-10 bg-black/5 dark:bg-white/10 rounded-2xl" />
                        <div className="flex-1 space-y-2">
                          <div className="h-3.5 bg-black/5 dark:bg-white/10 rounded-full w-2/3" />
                          <div className="h-2.5 bg-black/5 dark:bg-white/10 rounded-full w-1/3" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  latest.map((software) => {
                    const dateStr = formatRelativeTime(software.createdAt || software.updatedAt || '')
                    return (
                      <div
                        key={software.id}
                        className="group flex items-center p-2.5 rounded-2xl hover:bg-black/[0.03] dark:hover:bg-white/[0.05] transition-all duration-200 cursor-pointer"
                        onClick={() => (window.location.href = `/software/${software.id}`)}
                      >
                        <div className="flex-shrink-0 mr-3">
                          {software.icon ? (
                            <img
                              src={software.icon}
                              alt={software.name}
                              className="w-10 h-10 rounded-2xl object-cover shadow-sm bg-black/[0.02] dark:bg-white/[0.05] border border-black/[0.04] dark:border-white/[0.08]"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-2xl bg-black/[0.04] dark:bg-white/[0.08] text-[#515154] dark:text-[#a1a1a6] flex items-center justify-center text-sm font-bold">
                              {software.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center">
                            <h4 className="text-[13px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] truncate group-hover:text-[#0071e3] dark:group-hover:text-[#2997ff] transition-colors">
                              {software.name}
                            </h4>
                            <span className="text-[10px] font-medium text-[#86868b] bg-black/[0.04] dark:bg-white/[0.06] px-2 py-0.5 rounded-full ml-2 whitespace-nowrap">
                              {dateStr}
                            </span>
                          </div>
                          <p className="text-xs text-[#86868b] dark:text-[#a1a1a6] mt-0.5 line-clamp-1">
                            {software.description || '探索全新特性与功能'}
                          </p>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </div>
      </Tab.Group>
      
      <div className="p-3 border-t border-black/[0.04] dark:border-white/[0.06] bg-black/[0.01] dark:bg-white/[0.01] text-center">
        <a href="/ranking" className="text-xs font-semibold text-[#0071e3] dark:text-[#2997ff] hover:opacity-80 transition-opacity inline-flex items-center justify-center group">
          查看完整排行榜
          <svg className="w-3.5 h-3.5 ml-1 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    </div>
  )
}

/**
 * 格式化数字为简短形式 (e.g. 1.2k, 1.5m)
 */
function formatCompactNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return num.toString()
}

/**
 * 格式化相对时间
 */
function formatRelativeTime(dateString: string): string {
  if (!dateString) return ''
  try {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return '刚刚'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`
    
    return date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' })
  } catch {
    return ''
  }
}


