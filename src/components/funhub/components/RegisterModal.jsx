import React, { useRef } from 'react';

const RegisterModal = ({ 
  showRegisterModal, 
  setShowRegisterModal, 
  setShowLoginModal, 
  registerForm, 
  setRegisterForm, 
  regPasswordVisible, 
  setRegPasswordVisible, 
  onRegister 
}) => {
  const registerModalRef = useRef(null);
  
  if (!showRegisterModal) return null;
  
  const handleLoginClick = () => {
    setShowRegisterModal(false);
    setShowLoginModal(true);
  };
  
  return (
    <div
      id="registerModal"
      ref={registerModalRef}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
    >
      <div className="bg-white dark:bg-[#1c1c1e] text-gray-900 dark:text-gray-100 rounded-2xl shadow-2xl max-w-md w-full border border-black/5 dark:border-white/10 transform transition-all scale-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
          <h3 className="text-xl font-semibold text-secondary dark:text-white">模拟注册新账号</h3>
          <button
            onClick={() => setShowRegisterModal(false)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <i className="fa fa-times"></i>
          </button>
        </div>
        <div className="p-6">
          <form className="space-y-4 register-form" onSubmit={onRegister}>
            <div>
              <label htmlFor="regUsername" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                用户名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="regUsername"
                name="regUsername"
                placeholder="请设置用户名"
                required
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-black/20 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition text-sm text-gray-900 dark:text-gray-100"
                value={registerForm.username}
                onChange={(e) => setRegisterForm(prev => ({ ...prev, username: e.target.value }))}
              />
            </div>
            <div>
              <label htmlFor="regEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                邮箱 <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="regEmail"
                name="regEmail"
                placeholder="请输入邮箱地址"
                required
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-black/20 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition text-sm text-gray-900 dark:text-gray-100"
                value={registerForm.email}
                onChange={(e) => setRegisterForm(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div>
              <label htmlFor="regPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                密码 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={regPasswordVisible ? "text" : "password"}
                  id="regPassword"
                  name="regPassword"
                  placeholder="请设置密码"
                  required
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-black/20 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition pr-10 text-sm text-gray-900 dark:text-gray-100"
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm(prev => ({ ...prev, password: e.target.value }))}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary"
                  onClick={() => setRegPasswordVisible(!regPasswordVisible)}
                >
                  <i className={`fa ${regPasswordVisible ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
            </div>
            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 px-4 rounded-xl transition duration-200 transform hover:scale-[1.01] active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-sm"
              >
                注册模拟账号
              </button>
            </div>
          </form>
          <div className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400">
            已有账号？
            <button
              onClick={handleLoginClick}
              className="text-primary hover:underline ml-1 font-medium"
            >
              直接登录
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;
