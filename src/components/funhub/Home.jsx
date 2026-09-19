import React from 'react';
import Footer from './components/Footer.jsx';

const Home = () => {
  return (
    <div className="min-h-screen bg-[#f5f5f7] dark:bg-[#000000] text-[#1d1d1f] dark:text-[#f5f5f7] flex flex-col transition-colors duration-200">
      {/* 顶部二级导航 */}
      <div className="bg-white/80 dark:bg-[#161617]/80 backdrop-blur-md border-b border-black/[0.04] dark:border-white/[0.06] sticky top-0 z-30 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center font-bold text-sm shadow-sm">
              FH
            </div>
            <div>
              <span className="text-base sm:text-lg font-bold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight">
                FunHub
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs text-[#86868b] dark:text-[#a1a1a6]">
                创意网页与交互集合平台
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-4 text-xs font-medium">
            <a
              href="/"
              className="text-[#515154] dark:text-[#a1a1a6] hover:text-[#0071e3] dark:hover:text-[#2997ff] flex items-center space-x-1 transition-colors"
            >
              <i className="fa fa-arrow-left text-[11px] mr-1"></i>
              <span>APPFUN 主站</span>
            </a>
          </div>
        </div>
      </div>

      {/* 主要内容区域 */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 w-full">
        {/* Hero 区域 */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-orange-500/10 dark:from-orange-500/20 dark:to-amber-500/20 text-orange-600 dark:text-orange-400 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold mb-6 border border-orange-500/20">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping"></span>
            <span>AI太好用了你们知道吗</span>
          </div>
          
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7] mb-4 sm:mb-6">
            Welcome to FunHub
          </h1>
          <p className="text-sm sm:text-lg text-[#515154] dark:text-[#a1a1a6] leading-relaxed max-w-2xl mx-auto">
            探索各类趣味创意网页项目，体验拟真硬件交互、刷机模拟与别具一格的前端设计。
          </p>
        </div>

        {/* 工具卡片网格 (Apple Squircle Diffused Card) */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* 大米笔解锁工具卡片 */}
          <div
            className="group rounded-3xl bg-white dark:bg-[#161617] p-7 sm:p-8 border border-black/[0.04] dark:border-white/[0.06] shadow-[0_4px_24px_-2px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
            onClick={() => {
              if (typeof window !== 'undefined') window.location.href = '/funhub/mipen-unlocker';
            }}
          >
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center transition-transform group-hover:scale-110 duration-200">
                  <i className="fa fa-unlock-alt text-2xl"></i>
                </div>
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-black/[0.04] dark:bg-white/[0.06] text-[#86868b] dark:text-[#a1a1a6]">
                  仿真解锁
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#1d1d1f] dark:text-[#f5f5f7] mb-2.5 group-hover:text-orange-500 transition-colors">
                大米笔解锁工具
              </h3>
              <p className="text-xs sm:text-sm text-[#515154] dark:text-[#a1a1a6] leading-relaxed mb-6">
                解除大米巨能写手写笔与触控设备的功能限制，体验完整拟真开盖、5秒强制协议与进度模拟。
              </p>
            </div>
            <div className="pt-4 border-t border-black/[0.03] dark:border-white/[0.04] flex justify-between items-center">
              <span className="text-xs text-[#86868b] dark:text-[#6e6e73]">
                交互工具类
              </span>
              <span className="text-xs sm:text-sm font-semibold text-orange-500 group-hover:translate-x-1 transition-transform flex items-center">
                立即体验
                <i className="fa fa-arrow-right ml-1.5 text-xs"></i>
              </span>
            </div>
          </div>

          {/* 大米巨能写设备电池卡片 */}
          <div
            className="group rounded-3xl bg-white dark:bg-[#161617] p-7 sm:p-8 border border-black/[0.04] dark:border-white/[0.06] shadow-[0_4px_24px_-2px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
            onClick={() => {
              if (typeof window !== 'undefined') window.location.href = '/funhub/mi-rainbow-battery';
            }}
          >
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center transition-transform group-hover:scale-110 duration-200">
                  <i className="fa fa-battery-full text-2xl"></i>
                </div>
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-black/[0.04] dark:bg-white/[0.06] text-[#86868b] dark:text-[#a1a1a6]">
                  刷机 & Root
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#1d1d1f] dark:text-[#f5f5f7] mb-2.5 group-hover:text-orange-500 transition-colors">
                大米巨能写设备电池
              </h3>
              <p className="text-xs sm:text-sm text-[#515154] dark:text-[#a1a1a6] leading-relaxed mb-6">
                查看大米彩虹电池设备连接状态，模拟 MIUI 14 / HyperOS 官改刷机与 Magisk/KernelSU Root 授权。
              </p>
            </div>
            <div className="pt-4 border-t border-black/[0.03] dark:border-white/[0.04] flex justify-between items-center">
              <span className="text-xs text-[#86868b] dark:text-[#6e6e73]">
                系统管理类
              </span>
              <span className="text-xs sm:text-sm font-semibold text-orange-500 group-hover:translate-x-1 transition-transform flex items-center">
                立即体验
                <i className="fa fa-arrow-right ml-1.5 text-xs"></i>
              </span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
