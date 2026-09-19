import { useEffect, useState } from "react";
import { Disclosure, Switch } from "@headlessui/react";
import AuthButton from "../auth/AuthButton.jsx";
import JoinGroupModal from "./JoinGroupModal";

function classNames(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Header({
  title = "APPFUN",
  showSearch = true,
}: {
  title?: string;
  showSearch?: boolean;
}) {
  const [dark, setDark] = useState<boolean>(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);

  useEffect(() => {
    // 初始化主题状态
    const currentTheme = window.getTheme
      ? window.getTheme()
      : document.documentElement.classList.contains("dark")
        ? "dark"
        : "light";
    setDark(currentTheme === "dark");

    // 监听主题变化事件
    const handleThemeChange = (event: CustomEvent) => {
      setDark(event.detail.theme === "dark");
    };

    window.addEventListener("themechange", handleThemeChange);
    window.addEventListener("themeapplied", handleThemeChange);

    return () => {
      window.removeEventListener("themechange", handleThemeChange);
      window.removeEventListener("themeapplied", handleThemeChange);
    };
  }, []);

  const handleThemeChange = (newTheme: boolean) => {
    if (window.setTheme) {
      window.setTheme(newTheme ? "dark" : "light");
    } else {
      // 降级处理
      setDark(newTheme);
      document.documentElement.classList.toggle("dark", newTheme);
      localStorage.setItem("theme", newTheme ? "dark" : "light");
    }
  };

  return (
    <Disclosure
      as="nav"
      className="backdrop-blur-xl bg-white/80 dark:bg-black/80 border-b border-black/[0.04] dark:border-white/[0.08] sticky top-0 z-50 transition-colors duration-200"
    >
      {() => (
        <>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <a href="/" className="flex items-center space-x-3 group">
                  <div className="w-8 h-8 rounded-xl overflow-hidden shadow-sm border border-black/[0.06] dark:border-white/[0.1] transition-transform duration-200 group-hover:scale-105">
                    <img
                      src="/img/APPFUN.webp"
                      alt="APPFUN Logo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-lg font-bold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7] transition-colors">
                    {title}
                  </span>
                </a>
              </div>

              {showSearch && (
                <div className="hidden md:flex flex-1 max-w-md mx-8 items-center">
                  <div className="relative w-full group">
                    <div className="pointer-events-none absolute inset-y-0 left-0 pl-3.5 flex items-center">
                      <svg
                        className="h-4 w-4 text-[#86868b] group-focus-within:text-[#0071e3]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>
                    <input
                      id="global-search"
                      type="text"
                      placeholder="搜索软件、工具、分类..."
                      className="block w-full pl-10 pr-4 py-2 border border-black/[0.04] dark:border-white/[0.08] rounded-full text-sm bg-black/[0.03] dark:bg-white/[0.06] text-[#1d1d1f] dark:text-[#f5f5f7] placeholder-[#86868b] focus:outline-none focus:bg-white dark:focus:bg-[#161617] focus:ring-2 focus:ring-[#0071e3]/30 focus:border-[#0071e3] transition-all duration-200"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          const query = (
                            e.target as HTMLInputElement
                          ).value.trim();
                          if (query)
                            window.location.href = `/search?q=${encodeURIComponent(query)}`;
                        }
                      }}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-2.5">
                <Switch
                  checked={dark}
                  onChange={handleThemeChange}
                  className={classNames(
                    dark ? "bg-[#0071e3]" : "bg-black/10 dark:bg-white/20",
                    "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0071e3]",
                  )}
                  aria-label="切换深色模式"
                >
                  <span className="sr-only">切换深色模式</span>
                  <span
                    className={classNames(
                      dark ? "translate-x-6" : "translate-x-1",
                      "inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200",
                    )}
                  />
                </Switch>

                <div className="hidden md:flex items-center space-x-1">
                  <a
                    href="/"
                    className="px-3.5 py-1.5 rounded-full text-[13px] font-medium text-[#515154] dark:text-[#a1a1a6] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7] hover:bg-black/[0.04] dark:hover:bg-white/[0.08] transition-all duration-150"
                  >
                    首页
                  </a>
                  <a
                    href="/ranking"
                    className="px-3.5 py-1.5 rounded-full text-[13px] font-medium text-[#515154] dark:text-[#a1a1a6] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7] hover:bg-black/[0.04] dark:hover:bg-white/[0.08] transition-all duration-150"
                  >
                    排行榜
                  </a>
                  <a
                    href="/about"
                    className="px-3.5 py-1.5 rounded-full text-[13px] font-medium text-[#515154] dark:text-[#a1a1a6] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7] hover:bg-black/[0.04] dark:hover:bg-white/[0.08] transition-all duration-150"
                  >
                    关于
                  </a>
                  <a
                    href="/funhub"
                    className="px-3.5 py-1.5 rounded-full text-[13px] font-medium text-[#515154] dark:text-[#a1a1a6] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7] hover:bg-black/[0.04] dark:hover:bg-white/[0.08] transition-all duration-150 flex items-center gap-1"
                  >
                    <span>FunHub</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 inline-block animate-pulse"></span>
                  </a>
                </div>

                <AuthButton />

                {/* 加群按钮 */}
                <button
                  onClick={() => setIsGroupModalOpen(true)}
                  className="hidden md:inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#e8f2fc] text-[#0071e3] dark:bg-[#2997ff]/15 dark:text-[#2997ff] hover:bg-[#0071e3] hover:text-white dark:hover:bg-[#2997ff] dark:hover:text-black transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  title="加入交流群"
                >
                  <svg
                    className="w-4 h-4 mr-1.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <span>加群</span>
                </button>

                <Disclosure.Button className="md:hidden inline-flex items-center justify-center rounded-full p-2 text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.08] focus:outline-none">
                  <span className="sr-only">打开主菜单</span>
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="md:hidden">
            <div className="mx-4 mb-3 p-3 rounded-2xl border border-black/[0.04] dark:border-white/[0.08] bg-white/90 dark:bg-[#161617]/90 backdrop-blur-xl shadow-lg space-y-1">
              <a
                href="/"
                className="block px-4 py-2.5 rounded-xl text-sm font-medium text-[#1d1d1f] dark:text-[#f5f5f7] hover:bg-black/[0.04] dark:hover:bg-white/[0.08] transition-colors"
              >
                首页
              </a>
              <a
                href="/ranking"
                className="block px-4 py-2.5 rounded-xl text-sm font-medium text-[#1d1d1f] dark:text-[#f5f5f7] hover:bg-black/[0.04] dark:hover:bg-white/[0.08] transition-colors"
              >
                排行榜
              </a>
              <a
                href="/about"
                className="block px-4 py-2.5 rounded-xl text-sm font-medium text-[#1d1d1f] dark:text-[#f5f5f7] hover:bg-black/[0.04] dark:hover:bg-white/[0.08] transition-colors"
              >
                关于
              </a>
              <a
                href="/funhub"
                className="block px-4 py-2.5 rounded-xl text-sm font-medium text-[#1d1d1f] dark:text-[#f5f5f7] hover:bg-black/[0.04] dark:hover:bg-white/[0.08] transition-colors flex items-center justify-between"
              >
                <span>FunHub 创意工坊</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-500 font-semibold">趣味</span>
              </a>
              <button
                onClick={() => setIsGroupModalOpen(true)}
                className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium text-[#0071e3] dark:text-[#2997ff] hover:bg-[#e8f2fc] dark:hover:bg-[#2997ff]/10 transition-colors"
              >
                加入交流群
              </button>
            </div>
          </Disclosure.Panel>
          <JoinGroupModal
            isOpen={isGroupModalOpen}
            onClose={() => setIsGroupModalOpen(false)}
          />
        </>
      )}
    </Disclosure>
  );
}
