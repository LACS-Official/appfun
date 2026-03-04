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
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col h-full">
      <Tab.Group>
        <Tab.List className="flex p-1 bg-gray-100/50 dark:bg-gray-800/50 m-2 rounded-xl border border-gray-200 dark:border-gray-700">
          <Tab
            className={({ selected }) =>
              classNames(
                'flex-1 py-2.5 text-sm font-bold text-center rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 outline-none',
                selected 
                  ? 'bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 shadow-sm ring-1 ring-black/5' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              )
            }
          >
            <span>🔥</span>
            <span>热门榜单</span>
          </Tab>
          <Tab
            className={({ selected }) =>
              classNames(
                'flex-1 py-2.5 text-sm font-bold text-center rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 outline-none',
                selected 
                  ? 'bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 shadow-sm ring-1 ring-black/5' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              )
            }
          >
            <span>🆕</span>
            <span>最新收录</span>
          </Tab>
        </Tab.List>

        <div className="flex-1 overflow-y-auto custom-scrollbar px-3 pb-4">
          <Tab.Panels>
            <Tab.Panel className="animate-in fade-in slide-in-from-bottom-2 duration-500 outline-none">
              {loading ? (
                <div className="space-y-3 p-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center space-x-4 p-3 rounded-2xl bg-gray-50/50 dark:bg-gray-700/20 animate-pulse">
                      <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-xl" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-1">
                  {popular.length === 0 ? (
                    <div className="py-12 text-center">
                      <div className="text-4xl mb-4">💨</div>
                      <p className="text-sm text-gray-400">暂无榜单数据</p>
                    </div>
                  ) : (
                    popular.map((software, index) => {
                      const isTop3 = index < 3
                      const medalMap = ['🥇', '🥈', '🥉']
                      const rankStyles = [
                        'bg-yellow-50 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-500',
                        'bg-slate-50 dark:bg-slate-400/10 text-slate-500 dark:text-slate-400',
                        'bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-500',
                      ]

                      return (
                        <div
                          key={software.id}
                          className="group flex items-center p-2.5 rounded-2xl hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-300 cursor-pointer"
                          onClick={() => (window.location.href = `/software/${software.id}`)}
                        >
                          <div className={classNames(
                            'flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg font-black text-sm mr-3 transition-colors',
                            isTop3 ? rankStyles[index] : 'text-gray-400 dark:text-gray-600'
                          )}>
                            {isTop3 ? medalMap[index] : index + 1}
                          </div>
                          <div className="flex-shrink-0 mr-3">
                            <div className="relative">
                              {software.icon ? (
                                <img
                                  src={software.icon}
                                  alt={software.name}
                                  className="w-10 h-10 rounded-xl object-cover shadow-sm bg-white dark:bg-gray-700"
                                  loading="lazy"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-500 flex items-center justify-center text-sm font-bold">
                                  {software.name.charAt(0)}
                                </div>
                              )}
                              {isTop3 && (
                                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 border-2 border-white dark:border-gray-800 rounded-full bg-green-500"></div>
                              )}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate group-hover:text-primary-600 dark:group-hover:text-primary-400">
                              {software.name}
                            </h4>
                            <div className="flex items-center mt-1 text-[11px] font-medium text-gray-400 dark:text-gray-500">
                              <span className="flex items-center">
                                <svg className="w-3 h-3 mr-1 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                {formatCompactNumber(software.viewCount || 0)} 浏览
                              </span>
                              <span className="mx-1.5">•</span>
                              <span className="truncate">{software.category && (typeof software.category === 'string' ? software.category : software.category.name) || '未分类'}</span>
                            </div>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              )}
            </Tab.Panel>

            <Tab.Panel className="animate-in fade-in slide-in-from-bottom-2 duration-500 outline-none">
              <div className="space-y-1">
                {loading ? (
                  <div className="space-y-3 p-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex items-center space-x-4 p-3 rounded-2xl bg-gray-50/50 dark:bg-gray-700/20 animate-pulse">
                        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-xl" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
                          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
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
                        className="group flex items-center p-2.5 rounded-2xl hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-300 cursor-pointer"
                        onClick={() => (window.location.href = `/software/${software.id}`)}
                      >
                        <div className="flex-shrink-0 mr-3">
                          {software.icon ? (
                            <img
                              src={software.icon}
                              alt={software.name}
                              className="w-10 h-10 rounded-xl object-cover shadow-sm bg-white dark:bg-gray-700"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-gray-700 text-blue-500 dark:text-blue-400 flex items-center justify-center text-sm font-bold">
                              {software.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center">
                            <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate group-hover:text-primary-600 dark:group-hover:text-primary-400">
                              {software.name}
                            </h4>
                            <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800 px-1.5 py-0.5 rounded-md ml-2 whitespace-nowrap">
                              {dateStr}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1 opacity-80 group-hover:opacity-100 transition-opacity">
                            {software.description || '发现新版本的功能与特性'}
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
      
      <div className="p-3 border-t border-gray-100 dark:border-gray-700/50 bg-gray-50/30 dark:bg-gray-900/20 text-center">
        <a href="/ranking" className="text-xs font-bold text-gray-400 hover:text-primary-500 transition-colors flex items-center justify-center group">
          查看完整榜单
          <svg className="w-3 h-3 ml-1 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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


