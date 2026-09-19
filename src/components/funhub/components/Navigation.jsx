import React from 'react';

const Navigation = ({ 
  isLoggedIn, 
  username, 
  setShowLoginModal, 
  onLogout 
}) => {
  return (
    <header className="bg-white/90 dark:bg-[#161617]/90 backdrop-blur-md shadow-sm border-b border-black/[0.04] dark:border-white/[0.06] transition-colors">
      <div className="container max-w-7xl mx-auto px-4 py-3 sm:py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <a href="/funhub" className="text-primary hover:scale-105 transition-transform flex items-center">
              <i className="fa fa-pen-fancy text-2xl"></i>
            </a>
            <h1 className="text-lg sm:text-xl font-bold text-secondary dark:text-white">
              大米触控笔解锁工具
            </h1>
          </div>
          
          <nav className="hidden md:flex space-x-6 text-sm">
            <a href="/funhub" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
              工坊首页
            </a>
            <a href="/funhub/mipen-unlocker" className="text-primary font-medium transition-colors">
              触控笔解锁
            </a>
            <a href="/funhub/mi-rainbow-battery" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
              彩虹电池
            </a>
            <a href="/" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
              APPFUN 主站
            </a>
          </nav>
          
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-semibold shadow-sm">
                    {username ? username.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="text-gray-700 dark:text-gray-200 text-sm font-medium">{username}</span>
                </div>
                <button
                  className="text-gray-500 hover:text-primary transition-colors p-1"
                  onClick={onLogout}
                  title="退出登录"
                >
                  <i className="fa fa-sign-out-alt"></i>
                </button>
              </div>
            ) : (
              <button
                className="bg-primary hover:bg-primary/90 text-white text-sm font-medium py-2 px-4 rounded-xl transition duration-200 shadow-sm"
                onClick={() => setShowLoginModal(true)}
              >
                登录体验
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navigation;
