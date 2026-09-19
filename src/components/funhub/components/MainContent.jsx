import React from 'react';

const MainContent = ({ 
  isLoggedIn, 
  setShowUnlockModal 
}) => {
  return (
    <main className="flex-grow container max-w-5xl mx-auto px-4 py-8 sm:py-12">
      <section className="mb-12">
        <div className="text-center mb-8 sm:mb-12">
          <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-semibold bg-orange-500/10 text-orange-600 dark:text-orange-400 mb-4">
            模拟仿真实验 · 恶搞工具
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-secondary dark:text-white mb-4 tracking-tight">
            大米触控笔解锁工具
          </h1>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            专为大米触控笔与巨能写设备打造的趣味在线解锁工具，体验完整的拟真校验、开盖与解锁流程。
          </p>
        </div>
        
        <div className="bg-white dark:bg-[#161617] rounded-3xl shadow-[0_4px_24px_-2px_rgba(0,0,0,0.04)] border border-black/[0.04] dark:border-white/[0.06] p-6 sm:p-10 mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-secondary dark:text-white mb-6 text-center">
            解锁流程三部曲
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4 rounded-2xl bg-gray-50/50 dark:bg-white/[0.02]">
              <div className="bg-primary/10 rounded-2xl w-14 h-14 flex items-center justify-center mx-auto mb-4">
                <span className="text-primary text-2xl font-bold">1</span>
              </div>
              <h3 className="font-semibold text-base sm:text-lg mb-2 text-gray-900 dark:text-white">登录模拟账号</h3>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">输入体验账号 lacs 与密码 appfun，验证设备绑定权限</p>
            </div>
            <div className="text-center p-4 rounded-2xl bg-gray-50/50 dark:bg-white/[0.02]">
              <div className="bg-primary/10 rounded-2xl w-14 h-14 flex items-center justify-center mx-auto mb-4">
                <span className="text-primary text-2xl font-bold">2</span>
              </div>
              <h3 className="font-semibold text-base sm:text-lg mb-2 text-gray-900 dark:text-white">输入设备 SN</h3>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">填写触控笔型号和任意拟真 SN 序列号</p>
            </div>
            <div className="text-center p-4 rounded-2xl bg-gray-50/50 dark:bg-white/[0.02]">
              <div className="bg-primary/10 rounded-2xl w-14 h-14 flex items-center justify-center mx-auto mb-4">
                <span className="text-primary text-2xl font-bold">3</span>
              </div>
              <h3 className="font-semibold text-base sm:text-lg mb-2 text-gray-900 dark:text-white">开盖仿真解锁</h3>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">系统自动执行云端通讯与 Boot 校验，解锁设备全部潜力</p>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <button
              className="bg-primary hover:bg-primary/90 text-white font-medium py-3.5 px-10 rounded-full transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-md shadow-orange-500/20"
              onClick={() => isLoggedIn ? setShowUnlockModal(true) : alert('请先点击右上角登录账号（lacs / appfun）')}
            >
              {isLoggedIn ? '开始模拟解锁' : '立即登录开始解锁'}
            </button>
          </div>
        </div>
        
      </section>
    </main>
  );
};

export default MainContent;
