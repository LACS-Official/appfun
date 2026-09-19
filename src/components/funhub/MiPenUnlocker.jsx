import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import { useLoginLogic, LoginModal, PrivacyModal, Notification } from './components/LoginLogic.jsx';
import '../../styles/funhub.css';

const MiPenUnlocker = () => {
  const VALID_USERNAME = 'lacs';
  const VALID_PASSWORD = 'appfun';

  const {
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
    handleModalClick,
    showNotification
  } = useLoginLogic(VALID_USERNAME, VALID_PASSWORD, 'funhub_pen_login');

  // 状态管理
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [showBindSuccessModal, setShowBindSuccessModal] = useState(false);
  const [showPhysicalUnlockPage, setShowPhysicalUnlockPage] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [showLidOpenModal, setShowLidOpenModal] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState({ title: '', message: '', type: '' });
  const [privacyCheck, setPrivacyCheck] = useState(false);
  const [, setDeviceBound] = useState(false);

  // 三步弹窗相关状态
  const [showStep1Modal, setShowStep1Modal] = useState(false);
  const [showStep2Modal, setShowStep2Modal] = useState(false);
  const [showStep3Modal, setShowStep3Modal] = useState(false);
  const [canProceed, setCanProceed] = useState(false);
  const [step1Deadline, setStep1Deadline] = useState(null);
  const [remainingSeconds, setRemainingSeconds] = useState(5);
  const [unlockProgressStep, setUnlockProgressStep] = useState(0);
  const [unlockProgressPercentage, setUnlockProgressPercentage] = useState(0);
  const [currentStepText, setCurrentStepText] = useState('');
  const [unlockSteps] = useState([
    '正在验证设备信息',
    '正在解锁',
    '解锁完毕'
  ]);

  // 表单状态
  const [unlockForm, setUnlockForm] = useState({ deviceModel: '', deviceSN: '' });

  // 引用
  const unlockModalRef = useRef(null);
  const resultModalRef = useRef(null);

  const startPairing = () => {
    // 模拟配对通讯
  };

  // 键盘事件监听
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setShowUnlockModal(false);
        setShowResultModal(false);
        setShowLidOpenModal(false);
        setShowStep1Modal(false);
        setShowStep2Modal(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleApplyUnlock = (e) => {
    e.preventDefault();

    if (!unlockForm.deviceModel || !unlockForm.deviceSN) {
      showNotification('请填写完整的设备信息', 'error');
      return;
    }

    setShowUnlockModal(false);
    setShowLidOpenModal(true);
  };

  // 处理物理解锁 - 触发第一步弹窗
  const handlePhysicalUnlock = () => {
    setShowPhysicalUnlockPage(false);
    setShowStep1Modal(true);
    setCanProceed(false);
    setStep1Deadline(Date.now() + 5000);
    setRemainingSeconds(5);

    setTimeout(() => {
      setCanProceed(true);
    }, 5000);
  };

  // 处理第一步弹窗同意
  const handleStep1Agree = () => {
    setShowStep1Modal(false);
    setTimeout(() => {
      setShowStep2Modal(true);
    }, 300);
  };

  // 处理第二步弹窗确认
  const handleStep2Confirm = () => {
    setShowStep2Modal(false);
    setTimeout(() => {
      setShowStep3Modal(true);
      startUnlockProgress();
    }, 300);
  };

  // 开始解锁进度模拟
  const startUnlockProgress = () => {
    setUnlockProgressStep(0);
    setUnlockProgressPercentage(0);
    setCurrentStepText(unlockSteps[0]);

    const progressInterval = setInterval(() => {
      setUnlockProgressPercentage(prev => {
        const newProgress = prev + 1;

        if (newProgress >= 33 && unlockProgressStep < 1) {
          setUnlockProgressStep(1);
          setCurrentStepText(unlockSteps[1]);
        } else if (newProgress >= 66 && unlockProgressStep < 2) {
          setUnlockProgressStep(2);
          setCurrentStepText(unlockSteps[2]);
        }

        if (newProgress >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => {
            setShowStep3Modal(false);
            showRandomUnlockResult();
          }, 1000);
        }

        return newProgress;
      });
    }, 50);
  };

  useEffect(() => {
    if (!showStep1Modal || !step1Deadline) return;
    const interval = setInterval(() => {
      const left = Math.max(0, Math.ceil((step1Deadline - Date.now()) / 1000));
      setRemainingSeconds(left);
      if (left === 0) {
        setCanProceed(true);
      }
    }, 250);
    return () => clearInterval(interval);
  }, [showStep1Modal, step1Deadline]);

  // 显示随机解锁结果
  const showRandomUnlockResult = () => {
    const results = [
      { title: '解锁成功', message: '您的设备已成功解锁，已释放触控笔压感与巨能写潜能！', type: 'success' },
      { title: '解锁等待中', message: '设备安全芯片正在验证中，需要等待 168 小时后重试。', type: 'wait' },
      { title: '解锁失败', message: '设备校验超时，请检查笔尖是否插紧或重新开盖。', type: 'failed' },
      { title: '解锁等待', message: '需要等待 72 小时并累计写满 10 页纸后方可再次申请。', type: 'wait' }
    ];

    const randomIndex = Math.floor(Math.random() * results.length);
    const selectedResult = results[randomIndex];

    setResult(selectedResult);
    setShowResultModal(true);
  };

  // 渲染绑定成功模态框
  const renderBindSuccessModal = () => {
    if (!showBindSuccessModal) return null;

    return (
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={() => setShowBindSuccessModal(false)}
      >
        <div className="bg-white dark:bg-[#1c1c1e] text-gray-900 dark:text-gray-100 rounded-2xl shadow-2xl max-w-md w-full border border-black/5 dark:border-white/10 p-6">
          <div className="text-center mb-4">
            <i className="fa fa-check-circle text-green-500 text-5xl"></i>
          </div>
          <h3 className="text-xl font-bold text-center text-secondary dark:text-white mb-2">
            设备绑定成功
          </h3>
          <p className="text-center text-sm text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
            您的设备信息已成功提交并与模拟账号绑定。<br />
            请点击下一步进入物理解锁流程。
          </p>
          <button
            className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 px-4 rounded-xl transition duration-200 transform hover:scale-[1.01] active:scale-[0.99] shadow-sm"
            onClick={() => {
              setShowBindSuccessModal(false);
              setShowPhysicalUnlockPage(true);
            }}
          >
            下一步
          </button>
        </div>
      </div>
    );
  };

  // 渲染物理解锁页面
  const renderPhysicalUnlockPage = () => {
    if (!showPhysicalUnlockPage) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-[#1c1c1e] text-gray-900 dark:text-gray-100 rounded-3xl shadow-2xl max-w-3xl w-full border border-black/5 dark:border-white/10 overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
            <h3 className="text-lg sm:text-xl font-bold text-secondary dark:text-white">巨能写解锁工具 V1.0.0</h3>
            <button
              onClick={() => setShowPhysicalUnlockPage(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <i className="fa fa-times"></i>
            </button>
          </div>
          <div className="p-6 sm:p-8">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              {/* 左侧演示图/示意图 */}
              <div className="flex-1 flex flex-col items-center justify-center p-6 rounded-2xl bg-gray-50 dark:bg-black/20 text-center">
                <div className="w-24 h-24 rounded-full bg-orange-500/10 text-orange-500 flex items-center justify-center text-4xl mb-4">
                  <i className="fa fa-pen"></i>
                </div>
                <h4 className="font-bold text-secondary dark:text-white">已连接笔身</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  请保持笔身合盖状态下插入数据线连接电脑
                </p>
              </div>

              {/* 右侧内容 */}
              <div className="flex-1">
                <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-2xl p-4 mb-6">
                  <h5 className="font-semibold text-amber-800 dark:text-amber-300 text-sm mb-2">
                    解锁须知
                  </h5>
                  <ol className="list-decimal pl-4 space-y-1.5 text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
                    <li>解锁后系统将失去安全保护，纸质识别等功能可能失效</li>
                    <li>近期有用户上报第三方 ROM 有笔油吸油行为，请谨慎操作</li>
                    <li>纯前端趣味交互，不损伤任何硬件</li>
                  </ol>
                </div>

                <button
                  className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3.5 px-4 rounded-xl transition duration-200 transform hover:scale-[1.01] active:scale-[0.99] shadow-md shadow-orange-500/20"
                  onClick={handlePhysicalUnlock}
                >
                  开始解锁设备
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 渲染解锁模态框
  const renderUnlockModal = () => {
    if (!showUnlockModal) return null;

    return (
      <div
        id="unlockModal"
        ref={unlockModalRef}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={handleModalClick(unlockModalRef, setShowUnlockModal)}
      >
        <div className="bg-white dark:bg-[#1c1c1e] text-gray-900 dark:text-gray-100 rounded-2xl shadow-2xl max-w-md w-full border border-black/5 dark:border-white/10 overflow-hidden transform transition-all scale-100">
          <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
            <h3 className="text-xl font-bold text-secondary dark:text-white">申请解锁大米笔</h3>
            <button
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              onClick={() => setShowUnlockModal(false)}
            >
              <i className="fa fa-times text-lg"></i>
            </button>
          </div>
          <div className="p-6">
            <form className="space-y-4 unlock-form" onSubmit={handleApplyUnlock}>
              <div>
                <label htmlFor="deviceModel" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  设备型号 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="deviceModel"
                  name="deviceModel"
                  placeholder="例如：大米触控笔 2 代"
                  required
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-black/20 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition text-sm text-gray-900 dark:text-gray-100"
                  value={unlockForm.deviceModel}
                  onChange={(e) => setUnlockForm(prev => ({ ...prev, deviceModel: e.target.value }))}
                />
              </div>
              <div>
                <label htmlFor="deviceSN" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  SN 序列号 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="deviceSN"
                  name="deviceSN"
                  placeholder="请输入设备 SN 号（如 DM8888）"
                  required
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-black/20 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition text-sm text-gray-900 dark:text-gray-100"
                  value={unlockForm.deviceSN}
                  onChange={(e) => setUnlockForm(prev => ({ ...prev, deviceSN: e.target.value }))}
                />
                <p className="mt-1.5 text-xs text-gray-400 dark:text-gray-500">SN 号通常位于笔身末端或外包装背面</p>
              </div>
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 px-4 rounded-xl transition duration-200 transform hover:scale-[1.01] active:scale-[0.99] shadow-sm"
                >
                  提交申请并等待开盖
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  // 渲染结果模态框
  const renderResultModal = () => {
    if (!showResultModal) return null;

    let buttonColor = 'bg-primary';
    let iconClass = 'fa-info-circle text-[#0071e3]';

    switch (result.type) {
      case 'success':
        buttonColor = 'bg-green-600 hover:bg-green-700';
        iconClass = 'fa-check-circle text-green-500';
        break;
      case 'wait':
        buttonColor = 'bg-amber-600 hover:bg-amber-700';
        iconClass = 'fa-clock text-amber-500';
        break;
      case 'failed':
        buttonColor = 'bg-red-600 hover:bg-red-700';
        iconClass = 'fa-times-circle text-red-500';
        break;
      default:
        break;
    }

    return (
      <div
        id="resultModal"
        ref={resultModalRef}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={handleModalClick(resultModalRef, setShowResultModal)}
      >
        <div className="bg-white dark:bg-[#1c1c1e] text-gray-900 dark:text-gray-100 rounded-3xl shadow-2xl max-w-md w-full border border-black/5 dark:border-white/10 p-6 sm:p-8 text-center">
          <div className="mb-4">
            <i className={`fa ${iconClass} text-5xl`}></i>
          </div>
          <h3 className="text-xl font-bold text-secondary dark:text-white mb-2">
            {result.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 whitespace-pre-line leading-relaxed">
            {result.message}
          </p>
          <button
            className={`w-full ${buttonColor} text-white font-medium py-3 px-6 rounded-xl transition duration-200 shadow-sm`}
            onClick={() => setShowResultModal(false)}
          >
            确 定
          </button>
        </div>
      </div>
    );
  };

  const handleLidOpenConfirm = () => {
    setShowLidOpenModal(false);
    setShowProgressModal(true);
    setProgress(0);

    startPairing();

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 20;
        return newProgress >= 100 ? 100 : newProgress;
      });
    }, 500);

    setTimeout(() => {
      clearInterval(progressInterval);
      setShowProgressModal(false);
      setDeviceBound(true);
      showNotification('开盖识别与配对成功！', 'success');

      setShowStep1Modal(true);
      setCanProceed(false);
      setStep1Deadline(Date.now() + 5000);
      setRemainingSeconds(5);

      setTimeout(() => {
        setCanProceed(true);
      }, 5000);
    }, 3000);
  };

  const handleLidOpenCancel = () => {
    setShowLidOpenModal(false);
    setShowUnlockModal(true);
  };

  const renderLidOpenModal = () => {
    if (!showLidOpenModal) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-[#1c1c1e] text-gray-900 dark:text-gray-100 rounded-2xl shadow-2xl max-w-md w-full border border-black/5 dark:border-white/10 p-6">
          <div className="p-2 text-center">
            <div className="w-20 h-20 mx-auto mb-4 relative flex items-center justify-center">
              <div className="absolute inset-0 border-4 border-gray-100 dark:border-gray-800 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-primary rounded-full animate-ping opacity-75"></div>
              <i className="fa fa-box-open text-primary text-3xl relative z-10"></i>
            </div>
            <h3 className="text-xl font-bold text-secondary dark:text-white mb-2">等待开盖操作</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              请取下或打开笔帽，确保笔尖感应器已暴露并处于可配对状态。
            </p>
          </div>

          <div className="flex gap-3">
            <button
              className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/15 text-gray-700 dark:text-gray-200 font-medium py-3 px-4 rounded-xl text-sm transition"
              onClick={handleLidOpenCancel}
            >
              返 回
            </button>
            <button
              className="flex-1 bg-primary hover:bg-primary/90 text-white font-medium py-3 px-4 rounded-xl text-sm transition shadow-sm"
              onClick={handleLidOpenConfirm}
            >
              我已开盖
            </button>
          </div>
        </div>
      </div>
    );
  };

  // 渲染进度模态框
  const renderProgressModal = () => {
    if (!showProgressModal) return null;

    return (
      <div id="progressModal" className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-[#1c1c1e] text-gray-900 dark:text-gray-100 rounded-2xl shadow-2xl max-w-md w-full border border-black/5 dark:border-white/10 p-6 text-center">
          <div className="w-14 h-14 mx-auto mb-4">
            <div className="animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-primary"></div>
          </div>
          <h3 className="text-lg font-bold text-secondary dark:text-white mb-1">正在进行设备握手</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">系统正在与笔身固件通信并检索 Bootloader...</p>
          <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2.5 mb-2 overflow-hidden">
            <div className="bg-primary h-2.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
          </div>
          <p className="text-xs text-gray-400 font-mono text-right">{progress}%</p>
        </div>
      </div>
    );
  };

  // 渲染第一步弹窗 - 重要提示
  const renderStep1Modal = () => {
    if (!showStep1Modal) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-[#1c1c1e] text-gray-900 dark:text-gray-100 rounded-2xl shadow-2xl max-w-md w-full border border-black/5 dark:border-white/10 overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-gray-800 text-center">
            <h3 className="text-lg font-bold text-secondary dark:text-white">重要安全提示</h3>
          </div>
          <div className="p-6">
            <div className="bg-amber-50 dark:bg-amber-500/10 border-l-4 border-amber-500 p-4 rounded-xl mb-6 text-xs text-amber-800 dark:text-amber-300 leading-relaxed space-y-2">
              <p className="font-semibold">⚠️ 解锁将会清除内置模拟书写缓存，是否继续？</p>
              <p>近期有大量用户上报第三方 ROM 存在“笔油吸油”行为，可能造成财产损失，请谨慎解锁刷机。</p>
            </div>

            <div className="flex gap-3">
              <button
                className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/15 text-gray-700 dark:text-gray-200 font-medium py-3 px-4 rounded-xl text-sm transition"
                onClick={() => setShowStep1Modal(false)}
              >
                取消
              </button>
              <button
                className={`flex-1 bg-primary hover:bg-primary/90 text-white font-medium py-3 px-4 rounded-xl text-sm transition ${!canProceed ? 'opacity-50 cursor-not-allowed' : 'shadow-sm'}`}
                onClick={handleStep1Agree}
                disabled={!canProceed}
              >
                {canProceed ? '已阅读并同意' : `${remainingSeconds} 秒后可点击`}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 渲染第二步弹窗 - 同意确认
  const renderStep2Modal = () => {
    if (!showStep2Modal) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-[#1c1c1e] text-gray-900 dark:text-gray-100 rounded-2xl shadow-2xl max-w-md w-full border border-black/5 dark:border-white/10 p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center text-3xl mx-auto mb-4">
            <i className="fa fa-shield-check"></i>
          </div>
          <h3 className="text-xl font-bold text-secondary dark:text-white mb-2">安全确认完毕</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
            您已确认了解全部模拟风险，点击下方按钮开始注入解锁代码。
          </p>

          <button
            className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3.5 px-4 rounded-xl transition shadow-sm"
            onClick={handleStep2Confirm}
          >
            开始解锁
          </button>
        </div>
      </div>
    );
  };

  // 渲染第三步弹窗 - 解锁进度
  const renderStep3Modal = () => {
    if (!showStep3Modal) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-[#1c1c1e] text-gray-900 dark:text-gray-100 rounded-3xl shadow-2xl max-w-md w-full border border-black/5 dark:border-white/10 p-6 sm:p-8">
          <h3 className="text-lg font-bold text-secondary dark:text-white text-center mb-6">正在解锁设备</h3>

          {/* 进度百分比 */}
          <div className="mb-6">
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
              <span>当前进度</span>
              <span className="font-mono font-medium text-primary">{unlockProgressPercentage}%</span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-primary h-2.5 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${unlockProgressPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* 当前步骤 */}
          <div className="text-center py-4 mb-6">
            <i className="fa fa-cog fa-spin text-primary text-3xl mb-3"></i>
            <h4 className="text-base font-semibold text-secondary dark:text-white mb-1">{currentStepText}</h4>
            <p className="text-xs text-gray-400">请保持连接，切勿合上笔盖...</p>
          </div>

          {/* 步骤指示器 */}
          <div className="flex justify-between gap-2 border-t border-gray-100 dark:border-gray-800 pt-4">
            {unlockSteps.map((step, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mb-1.5 transition-colors ${
                    index <= unlockProgressStep ? 'bg-primary text-white shadow-sm' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                  }`}
                >
                  {index + 1}
                </div>
                <p className={`text-[11px] text-center ${index <= unlockProgressStep ? 'text-primary font-medium' : 'text-gray-400'}`}>
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // 渲染主页面内容
  const renderMainContent = () => {
    return (
      <div className="flex-1 flex flex-col">
        <Header currentUser={currentUser} onLogout={handleLogout} title="大米触控笔解锁工具" />

        <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
          <div className="text-center mb-10 sm:mb-12">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-orange-500/10 text-orange-600 dark:text-orange-400 mb-3">
              大米笔 · 纯前端模拟
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight mb-3">
              解除大米巨能写设备限制
            </h2>
            <p className="text-sm sm:text-base text-[#515154] dark:text-[#a1a1a6] max-w-xl mx-auto">
              使用本模拟工具，体验完整的巨能写与触控笔解锁流程，探索隐藏的趣味彩蛋。
            </p>
          </div>

          <div className="rounded-3xl bg-white dark:bg-[#161617] p-8 sm:p-10 border border-black/[0.04] dark:border-white/[0.06] shadow-[0_4px_24px_-2px_rgba(0,0,0,0.04)] mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-xl font-bold text-secondary dark:text-white mb-4">
                  操作指引
                </h3>
                <ul className="space-y-4 text-sm">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-7 w-7 bg-primary text-white rounded-xl flex items-center justify-center mr-3 mt-0.5 text-xs font-bold shadow-sm">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">输入设备信息</h4>
                      <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">输入您的设备型号与模拟 SN 序列号</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-7 w-7 bg-primary text-white rounded-xl flex items-center justify-center mr-3 mt-0.5 text-xs font-bold shadow-sm">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">开盖并握手</h4>
                      <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">确认笔盖打开，模拟通道建立并阅读安全协议</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-7 w-7 bg-primary text-white rounded-xl flex items-center justify-center mr-3 mt-0.5 text-xs font-bold shadow-sm">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">解锁与彩蛋</h4>
                      <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">等待进度条跑完，揭晓 168 小时或解锁成功结果</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="text-center p-6 rounded-2xl bg-gray-50 dark:bg-white/[0.02] border border-black/[0.03] dark:border-white/[0.04]">
                <div className="w-16 h-16 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center text-3xl mx-auto mb-4">
                  <i className="fa fa-magic"></i>
                </div>
                <h4 className="font-bold text-gray-900 dark:text-white mb-2">已就绪</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
                  {isLoggedIn ? '模拟账号已连接，可立即申请' : '请先登录以申请设备解锁'}
                </p>
                <button
                  className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3.5 px-8 rounded-full transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-md shadow-orange-500/20"
                  onClick={() => {
                    if (isLoggedIn) {
                      setShowUnlockModal(true);
                    } else {
                      setShowLoginModal(true);
                    }
                  }}
                >
                  {isLoggedIn ? '立即申请解锁' : '登录并申请解锁'}
                </button>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] dark:bg-[#000000] text-[#1d1d1f] dark:text-[#f5f5f7] flex flex-col transition-colors duration-200">
      <PrivacyModal
        privacyAccepted={privacyAccepted}
        privacyCheck={privacyCheck}
        setPrivacyCheck={setPrivacyCheck}
        onAccept={() => handlePrivacyAccept(privacyCheck)}
      />
      <LoginModal
        showLoginModal={showLoginModal}
        setShowLoginModal={setShowLoginModal}
        loginForm={loginForm}
        setLoginForm={setLoginForm}
        passwordVisible={passwordVisible}
        setPasswordVisible={setPasswordVisible}
        loginModalRef={loginModalRef}
        handleLogin={handleLogin}
        handleModalClick={handleModalClick}
      />
      {renderUnlockModal()}
      {renderBindSuccessModal()}
      {renderPhysicalUnlockPage()}
      {renderResultModal()}
      {renderLidOpenModal()}
      {renderProgressModal()}
      {renderStep1Modal()}
      {renderStep2Modal()}
      {renderStep3Modal()}
      <Notification notification={notification} />
      {renderMainContent()}
    </div>
  );
};

export default MiPenUnlocker;
