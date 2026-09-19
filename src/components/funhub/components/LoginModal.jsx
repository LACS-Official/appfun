import React, { useRef } from 'react';

const LoginModal = ({ 
  showLoginModal, 
  setShowLoginModal, 
  loginForm, 
  setLoginForm, 
  passwordVisible, 
  setPasswordVisible, 
  onLogin 
}) => {
  const loginModalRef = useRef(null);
  
  if (!showLoginModal) return null;
  
  return (
    <div
      id="loginModal"
      ref={loginModalRef}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
    >
      <div className="bg-white dark:bg-[#1c1c1e] text-gray-900 dark:text-gray-100 rounded-2xl shadow-2xl max-w-md w-full border border-black/5 dark:border-white/10 transform transition-all scale-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
          <h3 className="text-xl font-semibold text-secondary dark:text-white">用户模拟登录</h3>
          <button
            onClick={() => setShowLoginModal(false)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <i className="fa fa-times"></i>
          </button>
        </div>
        <div className="p-6">
          <form className="space-y-4 login-form" onSubmit={onLogin}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                用户名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="请输入用户名（lacs）"
                required
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-black/20 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition text-sm text-gray-900 dark:text-gray-100"
                value={loginForm.username}
                onChange={(e) => setLoginForm(prev => ({ ...prev, username: e.target.value }))}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                密码 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={passwordVisible ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="请输入密码"
                  required
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-black/20 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition pr-10 text-sm text-gray-900 dark:text-gray-100"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary toggle-password"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                >
                  <i className={`fa ${passwordVisible ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                checked={loginForm.rememberMe}
                onChange={(e) => setLoginForm(prev => ({ ...prev, rememberMe: e.target.checked }))}
              />
              <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-600 dark:text-gray-400">
                记住登录状态
              </label>
            </div>
            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 px-4 rounded-xl transition duration-200 transform hover:scale-[1.01] active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-sm"
              >
                登 录
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
