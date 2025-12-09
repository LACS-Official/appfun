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

export default function SidebarTabs() {
  const [popular, setPopular] = useState<Software[]>([])
  const [latest, setLatest] = useState<Software[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const api = (window as any).apiClient
    if (!api) return

    Promise.all([
      api.getSoftwareRanking({ page: 1, limit: 5, sortBy: 'viewCount', sortOrder: 'desc' }),
      api.getSoftwareList({ page: 1, limit: 5, sortBy: 'updatedAt', sortOrder: 'desc' }),
    ])
      .then(([rankRes, listRes]) => {
        if (rankRes?.success && Array.isArray(rankRes.data)) setPopular(rankRes.data)
        if (listRes?.success && listRes.data?.items) setLatest(listRes.data.items)
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
      <Tab.Group>
        <Tab.List className="flex border-b border-gray-100 dark:border-gray-700">
          <Tab
            className={({ selected }) =>
              classNames(
                'flex-1 py-4 text-sm font-semibold text-center relative',
                selected ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'
              )
            }
          >
            <span className="flex items-center justify-center space-x-2">
              <span className="text-lg">🔥</span>
              <span>热门榜单</span>
            </span>
          </Tab>
          <Tab
            className={({ selected }) =>
              classNames(
                'flex-1 py-4 text-sm font-semibold text-center relative',
                selected ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'
              )
            }
          >
            <span className="flex items-center justify-center space-x-2">
              <span className="text-lg">🆕</span>
              <span>最新收录</span>
            </span>
          </Tab>
        </Tab.List>
        <Tab.Panels className="p-4">
          <Tab.Panel>
            {loading ? (
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center space-x-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 animate-pulse">
                    <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {popular.length === 0 ? (
                  <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">暂无热门软件</div>
                ) : (
                  popular.map((software, index) => {
                    const rankColor =
                      index === 0
                        ? 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                        : index === 1
                        ? 'text-gray-400 bg-gray-50 dark:bg-gray-800'
                        : index === 2
                        ? 'text-orange-500 bg-orange-50 dark:bg-orange-900/20'
                        : 'text-gray-500 bg-transparent'

                    return (
                      <div
                        key={software.id}
                        className="group flex items-center p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all cursor-pointer border border-transparent hover:border-gray-100 dark:hover:border-gray-700"
                        onClick={() => (window.location.href = `/software/${software.id}`)}
                      >
                        <div className={classNames('flex-shrink-0 mr-4 font-bold text-lg w-8 h-8 flex items-center justify-center rounded-lg', rankColor)}>
                          {index + 1}
                        </div>
                        <div className="flex-shrink-0 mr-3">
                          {software.icon ? (
                            <img
                              src={software.icon}
                              alt={software.name}
                              className="w-10 h-10 rounded-lg object-cover shadow-sm group-hover:shadow-md transition-shadow"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/50 text-primary-500 flex items-center justify-center text-lg font-bold">
                              {software.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate group-hover:text-primary-600 dark:group-hover:text-primary-400">
                            {software.name}
                          </h4>
                          <div className="flex items-center mt-1 space-x-3 text-xs text-gray-500 dark:text-gray-400">
                            <span className="flex items-center">
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              {(software.viewCount || 0).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            )}
          </Tab.Panel>
          <Tab.Panel>
            {loading ? (
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center space-x-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 animate-pulse">
                    <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {latest.length === 0 ? (
                  <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">暂无最新软件</div>
                ) : (
                  latest.map((software) => {
                    const date = new Date(software.updatedAt || software.createdAt || '')
                    const dateStr = isNaN(date.getTime())
                      ? ''
                      : date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' })
                    return (
                      <div
                        key={software.id}
                        className="group flex items-center p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all cursor-pointer border border-transparent hover:border-gray-100 dark:hover:border-gray-700"
                        onClick={() => (window.location.href = `/software/${software.id}`)}
                      >
                        <div className="flex-shrink-0 mr-3">
                          {software.icon ? (
                            <img
                              src={software.icon}
                              alt={software.name}
                              className="w-10 h-10 rounded-lg object-cover shadow-sm group-hover:shadow-md transition-shadow"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-500 flex items-center justify-center text-lg font-bold">
                              {software.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 pr-2">
                              {software.name}
                            </h4>
                            <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap bg-gray-50 dark:bg-gray-800 px-1.5 py-0.5 rounded">
                              {dateStr}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                            {software.description || '暂无描述'}
                          </p>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            )}
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  )
}

