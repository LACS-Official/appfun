import React, { useState, useEffect, useRef } from 'react';

const useLoginLogic = (validUsername, validPassword, storageKey = 'login') => {
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '', rememberMe: false });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const loginModalRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const accepted = localStorage.getItem(`${storageKey}_privacyAccepted`) === 'true';
    setPrivacyAccepted(accepted);

    const loggedInUser = localStorage.getItem(`${storageKey}_loggedInUser`);
    if (loggedInUser === validUsername) {
      setIsLoggedIn(true);
      setCurrentUser({ username: validUsername });
    }

    if (!accepted) {
      // 首次未接受隐私政策
    } else if (!loggedInUser) {
      setShowLoginModal(true);
    }
  }, []);

  const handlePrivacyAccept = (privacyCheck) => {
    if (privacyCheck) {
      if (typeof window !== 'undefined') {
        localStorage.setItem(`${storageKey}_privacyAccepted`, 'true');
      }
      setPrivacyAccepted(true);
      setTimeout(() => {
        setShowLoginModal(true);
      }, 200);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();

    if (loginForm.username === validUsername && loginForm.password === validPassword) {
      if (typeof window !== 'undefined') {
        localStorage.setItem(`${storageKey}_loggedInUser`, validUsername);

        if (loginForm.rememberMe) {
          localStorage.setItem(`${storageKey}_rememberedUser`, validUsername);
        } else {
          localStorage.removeItem(`${storageKey}_rememberedUser`);
        }
      }

      showNotification('登录成功！', 'success');
      setIsLoggedIn(true);
      setCurrentUser({ username: validUsername });
      setShowLoginModal(false);
    } else {
      showNotification('用户名或密码错误，请重试（提示：lacs / ' + validPassword + '）', 'error');
    }
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(`${storageKey}_loggedInUser`);
    }
    setIsLoggedIn(false);
    setCurrentUser(null);
    showNotification('已退出登录', 'info');
    setTimeout(() => {
      setShowLoginModal(true);
    }, 500);
  };

  const showNotification = (message, type = 'info') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  const handleModalClick = (ref, setShow) => {
    return (e) => {
      if (ref.current && e.target === ref.current) {
        setShow(false);
      }
    };
  };

  return {
    privacyAccepted,
    isLoggedIn,
    currentUser,
    showLoginModal,
    setShowLoginModal,
    loginForm,
    setLoginForm,
    passwordVisible,
    setPasswordVisible,
    notification,
    loginModalRef,
    handlePrivacyAccept,
    handleLogin,
    handleLogout,
    showNotification,
    handleModalClick
  };
};

const LoginModal = ({
  showLoginModal,
  setShowLoginModal,
  loginForm,
  setLoginForm,
  passwordVisible,
  setPasswordVisible,
  loginModalRef,
  handleLogin,
  handleModalClick,
  onLogin
}) => {
  if (!showLoginModal) return null;

  return (
    <div
      id="loginModal"
      ref={loginModalRef}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100]"
      onClick={handleModalClick ? handleModalClick(loginModalRef, setShowLoginModal) : undefined}
    >
      <div className="bg-white dark:bg-[#1c1c1e] text-gray-900 dark:text-gray-100 rounded-2xl shadow-2xl max-w-md w-full mx-4 border border-black/5 dark:border-white/10 transform transition-all scale-100">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-secondary dark:text-white">用户模拟登录</h3>
            <button
              onClick={() => setShowLoginModal(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              <i className="fa fa-times"></i>
            </button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            体验账号：<span className="font-mono text-primary font-medium">lacs</span>，触控笔密码：<span className="font-mono text-primary font-medium">appfun</span>，彩虹电池密码：<span className="font-mono text-primary font-medium">appfunhub</span>
          </p>
        </div>
        <div className="p-6">
          <form className="space-y-4 login-form" onSubmit={handleLogin || onLogin}>
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

const PrivacyModal = ({ privacyAccepted, privacyCheck, setPrivacyCheck, onAccept }) => {
  if (privacyAccepted) return null;

  return (
    <div className="modal privacy-modal fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100]">
      <div className="bg-white dark:bg-[#1c1c1e] text-gray-900 dark:text-gray-100 rounded-2xl shadow-2xl max-w-3xl w-full mx-4 max-h-[85vh] overflow-hidden flex flex-col border border-black/5 dark:border-white/10">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
          <h3 className="text-xl sm:text-2xl font-semibold text-secondary dark:text-white">隐私政策与模拟协议</h3>
          <span className="text-xs px-2.5 py-1 rounded-full bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400 font-medium">Demo 声明</span>
        </div>
        <div className="p-6 overflow-y-auto privacy-content text-sm leading-relaxed space-y-4 text-gray-600 dark:text-gray-300">
          <h4 className="text-base font-semibold text-gray-900 dark:text-white">隐私声明与服务须知</h4>
          <p>感谢您体验 FunHub 趣味模拟工坊。本模块包含「大米触控笔解锁」与「大米巨能写设备电池刷机」等趣味创意交互。</p>
          
          <div className="p-4 rounded-xl bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 text-orange-800 dark:text-orange-300 text-xs leading-normal">
            <strong>免责与娱乐声明：</strong><br />
            本页面所有开盖、设备解锁、MIUI/HyperOS ROM 刷机、Root 提权及电池健康数据均为前端纯模拟仿真娱乐 Demo，不连接任何真实硬件设备，亦不会对您的电脑或手写笔产生任何物理修改。
          </div>

          <h5 className="font-semibold text-gray-800 dark:text-gray-200">1. 数据存储机制</h5>
          <p>所有登录信息和操作进度均保存在您浏览器的本地 LocalStorage 中，刷新或清除缓存即可重置初始状态。</p>

          <h5 className="font-semibold text-gray-800 dark:text-gray-200">2. 探索与交互</h5>
          <p>您可以自由尝试所有按钮、输入框及刷机功能，感受细腻的动效设计与趣味交互流程。</p>
        </div>
        <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-black/20">
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="privacyCheck"
              className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary cursor-pointer"
              checked={privacyCheck}
              onChange={(e) => setPrivacyCheck(e.target.checked)}
            />
            <label htmlFor="privacyCheck" className="ml-2 block text-sm text-gray-700 dark:text-gray-300 cursor-pointer select-none">
              我已阅读并了解这只是一个趣味前端交互 Demo
            </label>
          </div>
          <button
            className={`w-full py-3 px-4 rounded-xl transition duration-200 font-medium ${privacyCheck
              ? 'bg-primary hover:bg-primary/90 text-white transform hover:scale-[1.01] active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-sm cursor-pointer'
              : 'bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
              }`}
            disabled={!privacyCheck}
            onClick={onAccept}
          >
            同意并继续体验
          </button>
        </div>
      </div>
    </div>
  );
};

const Notification = ({ notification }) => {
  if (!notification || !notification.show) return null;

  const bgColor = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    info: 'bg-[#0071e3]',
    warning: 'bg-amber-500'
  }[notification.type] || 'bg-[#0071e3]';

  return (
    <div className={`fixed top-5 right-5 ${bgColor} text-white px-5 py-3 rounded-xl shadow-xl z-[150] transition-all duration-300 text-sm font-medium flex items-center space-x-2 animate-bounce`}>
      <i className={`fa ${notification.type === 'success' ? 'fa-check-circle' : notification.type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}`}></i>
      <span>{notification.message}</span>
    </div>
  );
};

export { useLoginLogic, LoginModal, PrivacyModal, Notification };
export default useLoginLogic;
