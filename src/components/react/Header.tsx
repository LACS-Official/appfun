import { useEffect, useState } from 'react'
import { Disclosure, Switch } from '@headlessui/react'
import AuthButton from '../auth/AuthButton.jsx'

function classNames(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Header({ title = 'APPFUN', showSearch = true }: { title?: string; showSearch?: boolean }) {
  const [dark, setDark] = useState<boolean>(false)

  useEffect(() => {
    // 初始化主题状态
    const currentTheme = window.getTheme ? window.getTheme() : 
      (document.documentElement.classList.contains('dark') ? 'dark' : 'light');
    setDark(currentTheme === 'dark');
    
    // 监听主题变化事件
    const handleThemeChange = (event: CustomEvent) => {
      setDark(event.detail.theme === 'dark');
    };
    
    window.addEventListener('themechange', handleThemeChange);
    window.addEventListener('themeapplied', handleThemeChange);
    
    return () => {
      window.removeEventListener('themechange', handleThemeChange);
      window.removeEventListener('themeapplied', handleThemeChange);
    };
  }, []);

  const handleThemeChange = (newTheme: boolean) => {
    if (window.setTheme) {
      window.setTheme(newTheme ? 'dark' : 'light');
    } else {
      // 降级处理
      setDark(newTheme);
      document.documentElement.classList.toggle('dark', newTheme);
      localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    }
  };

  return (
    <Disclosure as="nav" className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
      {() => (
        <>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <a href="/" className="flex items-center space-x-3 group">
                  <div className="w-8 h-8 rounded-lg overflow-hidden shadow-sm group-hover:shadow-md transition-shadow">
                    <img src="/img/APPFUN.webp" alt="APPFUN Logo" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-xl font-bold text-gray-900 dark:text-white transition-colors">{title}</span>
                </a>
              </div>

              {showSearch && (
                <div className="hidden md:flex flex-1 max-w-lg mx-8 items-center">
                  <div className="relative w-full group">
                    <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                      <svg className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <input
                      id="global-search"
                      type="text"
                      placeholder="搜索软件..."
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg leading-5 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:bg-white dark:focus:bg-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent sm:text-sm transition-all"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const query = (e.target as HTMLInputElement).value.trim()
                          if (query) window.location.href = `/search?q=${encodeURIComponent(query)}`
                        }
                      }}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-3">
                <Switch
                  checked={dark}
                  onChange={handleThemeChange}
                  className={classNames(
                    dark ? 'bg-primary-600' : 'bg-gray-200',
                    'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
                  )}
                  aria-label="切换深色模式"
                >
                  <span className="sr-only">切换深色模式</span>
                  <span
                    className={classNames(
                      dark ? 'translate-x-6' : 'translate-x-1',
                      'inline-block h-4 w-4 transform rounded-full bg-white transition-transform'
                    )}
                  />
                </Switch>

                <div className="hidden md:flex items-center">
                  <a href="/" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800">首页</a>
                  <a href="/categories" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800">分类</a>
                  <a href="/tags" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800">标签</a>
                  <a href="/about" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800">关于</a>
                </div>

                <AuthButton />

                <Disclosure.Button className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500">
                  <span className="sr-only">打开主菜单</span>
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="md:hidden">
            <div className="space-y-1 px-2 pt-2 pb-3 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
              <a href="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800">首页</a>
              <a href="/categories" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800">分类</a>
              <a href="/tags" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800">标签</a>
              <a href="/about" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800">关于</a>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}
