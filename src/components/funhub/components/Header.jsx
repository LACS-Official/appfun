import React from 'react';

const Header = ({ currentUser, onLogout, title = '工具箱' }) => {
  return (
    <nav className="bg-white/90 dark:bg-[#161617]/90 backdrop-blur-md border-b border-black/[0.04] dark:border-white/[0.06] shadow-sm sticky top-0 z-40 transition-colors">
      <div className="container max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <a href="/funhub" className="flex items-center space-x-2 group">
            <span className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-500 flex items-center justify-center font-bold text-sm group-hover:scale-105 transition-transform">
              FH
            </span>
            <h1 className="text-lg sm:text-xl font-bold text-secondary dark:text-white transition-colors">
              {title}
            </h1>
          </a>
          <span className="text-gray-300 dark:text-gray-700">|</span>
          <div className="hidden sm:flex items-center space-x-3 text-xs">
            <a href="/funhub" className="text-gray-500 dark:text-gray-400 hover:text-primary transition-colors">
              FunHub 工坊
            </a>
            <a href="/" className="text-gray-500 dark:text-gray-400 hover:text-primary transition-colors">
              APPFUN 主站
            </a>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {currentUser ? (
            <div className="flex items-center space-x-3">
              <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                欢迎，<span className="font-semibold text-primary">{currentUser.username}</span>
              </span>
              <button
                className="bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/15 text-gray-700 dark:text-gray-200 px-3 py-1.5 rounded-lg text-xs font-medium transition duration-200"
                onClick={onLogout}
              >
                退出
              </button>
            </div>
          ) : (
            <a
              href="/funhub"
              className="text-xs text-gray-500 dark:text-gray-400 hover:text-primary transition-colors"
            >
              返回创意工坊
            </a>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
