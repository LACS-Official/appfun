import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import { useLoginLogic, LoginModal, PrivacyModal, Notification } from './components/LoginLogic.jsx';
import '../../styles/funhub.css';

const MiRainbowBattery = ({ initialIsToolsPage = false }) => {
  const VALID_USERNAME = 'lacs';
  const VALID_PASSWORD = 'appfunhub';

  const [isToolsPage, setIsToolsPage] = useState(() => {
    if (initialIsToolsPage) return true;
    if (typeof window !== 'undefined') {
      return window.location.pathname.endsWith('/tools');
    }
    return false;
  });

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
  } = useLoginLogic(VALID_USERNAME, VALID_PASSWORD, 'funhub_battery_login');

  const [showDeviceConnectedModal, setShowDeviceConnectedModal] = useState(false);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [showFlashModal, setShowFlashModal] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionSuccess, setConnectionSuccess] = useState(false);
  const [currentTab, setCurrentTab] = useState('unlock');
  const [privacyCheck, setPrivacyCheck] = useState(false);

  const [unlockProgress, setUnlockProgress] = useState(0);
  const [flashProgress, setFlashProgress] = useState(0);
  const [selectedRom, setSelectedRom] = useState(null);
  const [isFlashing, setIsFlashing] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [deviceStatus, setDeviceStatus] = useState({
    isUnlocked: false,
    romName: 'MIUI官方版',
    romVersion: 'V14.0.10.0',
    isRooted: false,
    securityPatch: '2024-12',
    batteryHealth: '完美',
    bootloaderStatus: '已锁定',
    verificationStatus: '已验证'
  });
  const [selectedRootMethods, setSelectedRootMethods] = useState({});
  const [selectedRootModules, setSelectedRootModules] = useState({});

  const romList = [
    { id: 1, name: 'MIUI14官方包', version: 'V14.0.10.0', tags: ['稳定安全'] },
    { id: 2, name: 'HyperOS官方包', version: 'V1.0.5.0', tags: ['流畅', '耗电量有所增加'] },
    { id: 3, name: 'HyperOS领创官改包', version: 'V1.0.5.0.CN', tags: ['更开放', '内置高级设置'] },
    { id: 4, name: 'ColorOS', version: 'V13.0.0', tags: ['可变彩虹颜色'] },
    { id: 5, name: 'H2OS', version: 'V3.0.0', tags: ['氢动力', '系统毛坯'] }
  ];

  const rootMethods = [
    { id: 1, name: 'Magisk官方', description: '通过Magisk管理器获取Root权限' },
    { id: 2, name: 'KernelSU', description: '基于内核的Root方案' },
    { id: 3, name: 'APatch', description: 'Android Patch工具' }
  ];

  const rootModules = [
    { id: 1, name: 'LSPosed', description: 'Xposed框架替代品' },
    { id: 2, name: 'EdXposed', description: 'ART虚拟机框架' },
    { id: 3, name: 'Zygisk', description: 'Magisk模块' },
  ];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setShowDeviceConnectedModal(false);
        setShowUnlockModal(false);
        setShowFlashModal(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLidOpened = () => {
    setIsConnecting(true);
    setConnectionSuccess(false);
    const loadingTime = Math.random() * 1500 + 800;
    setTimeout(() => {
      setConnectionSuccess(true);
      setTimeout(() => {
        setIsConnecting(false);
        setConnectionSuccess(false);
        setShowDeviceConnectedModal(true);
      }, 800);
    }, loadingTime);
  };

  const handleConfirm = () => {
    setShowDeviceConnectedModal(false);
    setIsToolsPage(true);
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', '/funhub/mi-rainbow-battery/tools');
    }
  };

  const handleCancel = () => {
    setShowDeviceConnectedModal(false);
  };

  const handleStartUnlock = () => {
    setShowUnlockModal(true);
    setIsUnlocking(true);
    setUnlockProgress(0);

    const interval = setInterval(() => {
      setUnlockProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUnlocking(false);
          setDeviceStatus(prevStatus => ({ ...prevStatus, isUnlocked: true, bootloaderStatus: '已解锁' }));
          showNotification('Bootloader 解锁成功！', 'success');
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleStartFlash = () => {
    if (!selectedRom) {
      showNotification('请先选择需要刷入的 ROM 包', 'error');
      return;
    }

    setShowFlashModal(true);
    setIsFlashing(true);
    setFlashProgress(0);

    const interval = setInterval(() => {
      setFlashProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsFlashing(false);
          const rom = romList.find(r => r.id === selectedRom);
          if (rom) {
            setDeviceStatus(prevStatus => ({
              ...prevStatus,
              romName: rom.name,
              romVersion: rom.version
            }));
          }
          showNotification('系统刷机完成，已成功重启！', 'success');
          return 100;
        }
        return prev + 5;
      });
    }, 200);
  };

  const handleStartRoot = () => {
    const hasMethod = Object.values(selectedRootMethods).some(v => v);
    if (!hasMethod) {
      showNotification('请至少选择一种 Root 方案', 'error');
      return;
    }

    showNotification('正在注入 Root 核心代码...', 'info');
    setTimeout(() => {
      setDeviceStatus(prev => ({ ...prev, isRooted: true }));
      showNotification('Root 授权已获取成功！', 'success');
    }, 1500);
  };

  const handleCloseUnlockModal = () => {
    setShowUnlockModal(false);
    setUnlockProgress(0);
  };

  const handleCloseFlashModal = () => {
    setShowFlashModal(false);
    setFlashProgress(0);
  };

  // 渲染连接动画
  const renderSearchAnimation = () => {
    if (!isConnecting) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-[#1c1c1e] text-gray-900 dark:text-gray-100 rounded-3xl shadow-2xl max-w-sm w-full border border-black/5 dark:border-white/10 p-8 text-center">
          <div className="relative w-28 h-28 mx-auto mb-6 flex items-center justify-center">
            <div className="absolute inset-0 border-4 border-orange-200 dark:border-orange-500/20 rounded-full animate-ping opacity-50"></div>
            <div className="absolute inset-3 border-4 border-primary rounded-full animate-pulse"></div>
            <i className="fa fa-broadcast-tower text-primary text-3xl relative z-10"></i>
          </div>
          <h3 className="text-xl font-bold text-secondary dark:text-white mb-2">
            {connectionSuccess ? '连接握手成功！' : '正在扫描彩虹电池...'}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {connectionSuccess ? '正在同步设备状态...' : '请确保大米彩虹电池设备开盖并处于蓝牙范围内'}
          </p>
        </div>
      </div>
    );
  };

  // 渲染设备已连接模态框
  const renderDeviceConnectedModal = () => {
    if (!showDeviceConnectedModal) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-[#1c1c1e] text-gray-900 dark:text-gray-100 rounded-3xl shadow-2xl max-w-md w-full border border-black/5 dark:border-white/10 p-6 sm:p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center text-3xl mx-auto mb-4">
            <i className="fa fa-battery-full"></i>
          </div>
          <h3 className="text-xl font-bold text-secondary dark:text-white mb-2">已发现大米彩虹电池</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
            设备序列号：<span className="font-mono text-primary font-medium">RB-2024-MIUI</span><br />
            当前状态：电量 100% · 盒盖感应正常<br />
            是否立即进入彩虹电池高级管理工具箱？
          </p>

          <div className="flex gap-3">
            <button
              className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/15 text-gray-700 dark:text-gray-200 font-medium py-3 px-4 rounded-xl text-sm transition"
              onClick={handleCancel}
            >
              稍后再说
            </button>
            <button
              className="flex-1 bg-primary hover:bg-primary/90 text-white font-medium py-3 px-4 rounded-xl text-sm transition shadow-sm"
              onClick={handleConfirm}
            >
              立即进入
            </button>
          </div>
        </div>
      </div>
    );
  };

  // 渲染解锁模态框
  const renderUnlockModal = () => {
    if (!showUnlockModal) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-[#1c1c1e] text-gray-900 dark:text-gray-100 rounded-2xl shadow-2xl max-w-md w-full border border-black/5 dark:border-white/10 p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-orange-500/10 text-orange-500 flex items-center justify-center text-2xl mx-auto mb-4">
            <i className="fa fa-unlock-alt"></i>
          </div>
          <h3 className="text-lg font-bold text-secondary dark:text-white mb-2">Bootloader 解锁中</h3>
          <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2.5 mb-3 overflow-hidden">
            <div className="bg-primary h-2.5 rounded-full transition-all duration-200" style={{ width: `${unlockProgress}%` }}></div>
          </div>
          <p className="text-xs text-gray-400 font-mono mb-4">{unlockProgress}%</p>
          {unlockProgress >= 100 && (
            <button
              onClick={handleCloseUnlockModal}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 px-4 rounded-xl text-sm transition shadow-sm"
            >
              解锁完成
            </button>
          )}
        </div>
      </div>
    );
  };

  // 渲染刷机模态框
  const renderFlashModal = () => {
    if (!showFlashModal) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-[#1c1c1e] text-gray-900 dark:text-gray-100 rounded-2xl shadow-2xl max-w-md w-full border border-black/5 dark:border-white/10 p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-blue-500/10 text-[#0071e3] flex items-center justify-center text-2xl mx-auto mb-4">
            <i className="fa fa-microchip"></i>
          </div>
          <h3 className="text-lg font-bold text-secondary dark:text-white mb-2">正在向电池刷入系统</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">正在解压并校验 Payload 签名包，切勿拔出电池...</p>
          <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2.5 mb-3 overflow-hidden">
            <div className="bg-primary h-2.5 rounded-full transition-all duration-200" style={{ width: `${flashProgress}%` }}></div>
          </div>
          <p className="text-xs text-gray-400 font-mono mb-4">{flashProgress}%</p>
          {flashProgress >= 100 && (
            <button
              onClick={handleCloseFlashModal}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 px-4 rounded-xl text-sm transition shadow-sm"
            >
              刷机完成并重启
            </button>
          )}
        </div>
      </div>
    );
  };

  // 渲染开盖连接主页
  const renderDeviceConnectionArea = () => {
    return (
      <div className="flex-1 flex flex-col">
        <Header currentUser={currentUser} onLogout={handleLogout} title="彩虹电池刷机工具" />

        <div className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 w-full">
          <div className="rounded-3xl bg-white dark:bg-[#161617] p-8 sm:p-10 border border-black/[0.04] dark:border-white/[0.06] shadow-[0_4px_24px_-2px_rgba(0,0,0,0.04)] mb-8">
            <div className="text-center mb-10">
              <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-semibold bg-orange-500/10 text-orange-600 dark:text-orange-400 mb-3">
                硬件级模拟 · 创意工程
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight mb-3">
                彩虹电池刷机与管理中心
              </h2>
              <p className="text-sm sm:text-base text-[#515154] dark:text-[#a1a1a6] max-w-xl mx-auto">
                专业的大米彩虹电池设备管理与刷机仿真解决方案，支持自由解锁、ROM 替换与 Root 模块注入。
              </p>
            </div>

            {/* 特色三个卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
              <div className="p-6 rounded-2xl bg-blue-50/50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 text-center">
                <div className="w-12 h-12 rounded-2xl bg-[#0071e3] text-white flex items-center justify-center mx-auto mb-3 shadow-sm">
                  <i className="fa fa-unlock-alt text-lg"></i>
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">设备解锁</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">安全解除 Bootloader 锁定，释放彩虹电量潜能</p>
              </div>

              <div className="p-6 rounded-2xl bg-purple-50/50 dark:bg-purple-500/10 border border-purple-100 dark:border-purple-500/20 text-center">
                <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center mx-auto mb-3 shadow-sm">
                  <i className="fa fa-download text-lg"></i>
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">系统刷机</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">支持 MIUI 14、HyperOS 及官改包等多样化 ROM</p>
              </div>

              <div className="p-6 rounded-2xl bg-green-50/50 dark:bg-green-500/10 border border-green-100 dark:border-green-500/20 text-center">
                <div className="w-12 h-12 rounded-2xl bg-green-600 text-white flex items-center justify-center mx-auto mb-3 shadow-sm">
                  <i className="fa fa-user-shield text-lg"></i>
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">Root 权限</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Magisk 与 KernelSU 模块定制，自由调校供电电压</p>
              </div>
            </div>

            {/* 开盖操作与按钮 */}
            <div className="bg-gray-50 dark:bg-white/[0.02] border border-black/[0.03] dark:border-white/[0.04] rounded-2xl p-6 mb-8 text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed space-y-2">
              <h4 className="font-bold text-gray-900 dark:text-white text-sm">💡 连接使用说明</h4>
              <p>1. 确保电脑已开启蓝牙或 USB 数据线已连接</p>
              <p>2. 轻轻打开彩虹电池收纳盒盖子，触发光电感应开盖信号</p>
              <p>3. 点击下方「已开盖，立即连接」开始拟真连接握手</p>
            </div>

            <div className="text-center">
              <button
                onClick={handleLidOpened}
                className="bg-primary hover:bg-primary/90 text-white font-medium py-3.5 px-10 rounded-full transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-md shadow-orange-500/20 text-sm sm:text-base"
              >
                已开盖，立即连接
              </button>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    );
  };

  // 渲染工具箱页面
  const renderToolsPage = () => {
    const isOfficialMod = deviceStatus.romName.includes('官改包');
    const tabs = [
      { id: 'unlock', label: '解锁' },
      { id: 'flash', label: '刷机' },
      { id: 'root', label: 'Root' }
    ];

    if (isOfficialMod) {
      tabs.push({ id: 'advanced', label: '高级设置' });
    }

    const renderTabContent = () => {
      switch (currentTab) {
        case 'unlock':
          return (
            <div className="p-6">
              <div className="bg-amber-50 dark:bg-amber-500/10 border-l-4 border-amber-500 p-4 rounded-xl mb-6 text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                <h4 className="font-bold mb-1">解锁须知</h4>
                <ul className="space-y-1">
                  <li>• 解锁后设备将失去官方电池质保</li>
                  <li>• 解锁将清除所有内置电量充放统计日志</li>
                  <li>• 请保持电池电量在 50% 以上避免中途断电</li>
                </ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50/60 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-2xl p-4 text-xs">
                  <h5 className="font-bold text-[#0071e3] mb-2 flex items-center">
                    <i className="fa fa-info-circle mr-1.5"></i>
                    设备信息
                  </h5>
                  <div className="space-y-1.5 text-gray-600 dark:text-gray-300">
                    <div className="flex justify-between">
                      <span>设备型号：</span>
                      <span className="font-medium">大米彩虹电池</span>
                    </div>
                    <div className="flex justify-between">
                      <span>当前系统：</span>
                      <span className="font-medium">{deviceStatus.romName} {deviceStatus.romVersion}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Bootloader 状态：</span>
                      <span className={`font-semibold ${deviceStatus.isUnlocked ? 'text-green-600' : 'text-amber-600'}`}>
                        {deviceStatus.bootloaderStatus}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50/60 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 rounded-2xl p-4 text-xs">
                  <h5 className="font-bold text-purple-600 mb-2 flex items-center">
                    <i className="fa fa-terminal mr-1.5"></i>
                    解锁流程
                  </h5>
                  <div className="space-y-1.5 text-gray-600 dark:text-gray-300">
                    <div>1. 确认电池开盖与通信正常</div>
                    <div>2. 点击下方按钮执行 fastboot oem unlock</div>
                    <div>3. 等待模拟进度跑完即可生效</div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleStartUnlock}
                className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 px-4 rounded-xl transition duration-200 shadow-sm text-sm"
              >
                {deviceStatus.isUnlocked ? '重新解锁 Bootloader' : '开始解锁 Bootloader'}
              </button>
            </div>
          );

        case 'flash':
          return (
            <div className="p-6">
              <h4 className="text-base font-bold text-secondary dark:text-white mb-4">选择适配 ROM 包</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-3">
                  {romList.map(rom => (
                    <label
                      key={rom.id}
                      className={`flex items-center p-4 border rounded-2xl cursor-pointer transition duration-200 ${
                        selectedRom === rom.id
                          ? 'border-primary bg-primary/5 dark:bg-primary/10'
                          : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="rom"
                        value={rom.id}
                        checked={selectedRom === rom.id}
                        onChange={() => setSelectedRom(rom.id)}
                        className="w-4 h-4 text-primary mr-3"
                      />
                      <div className="flex-1 text-sm">
                        <p className="font-bold text-gray-900 dark:text-white">{rom.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">版本：{rom.version}</p>
                        {rom.tags && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {rom.tags.map((tag, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 text-[10px] rounded-full bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 font-medium"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </label>
                  ))}
                </div>

                <div className="flex flex-col gap-4">
                  <button
                    onClick={handleStartFlash}
                    disabled={!selectedRom || isFlashing}
                    className={`w-full py-3.5 px-4 rounded-xl font-medium text-sm transition duration-200 shadow-sm ${
                      !selectedRom || isFlashing
                        ? 'bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                        : 'bg-primary hover:bg-primary/90 text-white'
                    }`}
                  >
                    {isFlashing ? '正在刷入中...' : '开始刷机'}
                  </button>

                  <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-2xl p-4 text-xs text-amber-800 dark:text-amber-300 space-y-1">
                    <p className="font-bold mb-1">⚠️ 刷机注意事项</p>
                    <p>• 确保设备供电平稳</p>
                    <p>• 官改包可解锁「高级设置」面板</p>
                    <p>• 纯模拟环境，可反复体验</p>
                  </div>
                </div>
              </div>
            </div>
          );

        case 'root':
          return (
            <div className="p-6">
              <h4 className="text-base font-bold text-secondary dark:text-white mb-3">选择 Root 方案</h4>
              <div className="space-y-2.5 mb-6">
                {rootMethods.map(method => (
                  <label
                    key={method.id}
                    className="flex items-center p-3.5 border border-gray-200 dark:border-gray-800 rounded-2xl cursor-pointer hover:border-gray-300 dark:hover:border-gray-700 transition"
                  >
                    <input
                      type="checkbox"
                      checked={!!selectedRootMethods[method.id]}
                      onChange={(e) => setSelectedRootMethods(prev => ({ ...prev, [method.id]: e.target.checked }))}
                      className="w-4 h-4 text-primary mr-3 rounded"
                    />
                    <div className="text-sm">
                      <p className="font-bold text-gray-900 dark:text-white">{method.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{method.description}</p>
                    </div>
                  </label>
                ))}
              </div>

              <h4 className="text-base font-bold text-secondary dark:text-white mb-3">常用附加模块</h4>
              <div className="space-y-2.5 mb-6">
                {rootModules.map(module => (
                  <label
                    key={module.id}
                    className="flex items-center p-3.5 border border-gray-200 dark:border-gray-800 rounded-2xl cursor-pointer hover:border-gray-300 dark:hover:border-gray-700 transition"
                  >
                    <input
                      type="checkbox"
                      checked={!!selectedRootModules[module.id]}
                      onChange={(e) => setSelectedRootModules(prev => ({ ...prev, [module.id]: e.target.checked }))}
                      className="w-4 h-4 text-primary mr-3 rounded"
                    />
                    <div className="text-sm">
                      <p className="font-bold text-gray-900 dark:text-white">{module.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{module.description}</p>
                    </div>
                  </label>
                ))}
              </div>

              <button
                onClick={handleStartRoot}
                className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3.5 px-4 rounded-xl transition duration-200 shadow-sm text-sm"
              >
                {deviceStatus.isRooted ? '重新注入 Root 模块' : '开始获取 Root 权限'}
              </button>
            </div>
          );

        case 'advanced':
          return (
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-base font-bold text-secondary dark:text-white">官改包专属：电池高级遥测与设置</h4>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 font-semibold">
                  HyperOS 官改已激活
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-2xl p-4 text-center">
                  <i className="fa fa-battery-full text-green-500 text-2xl mb-1.5"></i>
                  <p className="text-2xl font-bold text-green-600">100%</p>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">实时电量</p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-2xl p-4 text-center">
                  <i className="fa fa-bolt text-[#0071e3] text-2xl mb-1.5"></i>
                  <p className="text-2xl font-bold text-[#0071e3]">7.6V</p>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">输出电压</p>
                </div>
                <div className="bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 rounded-2xl p-4 text-center">
                  <i className="fa fa-temperature-half text-orange-500 text-2xl mb-1.5"></i>
                  <p className="text-2xl font-bold text-orange-600">18°C</p>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">电芯温度</p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 rounded-2xl p-4 text-center">
                  <i className="fa fa-clock text-purple-500 text-2xl mb-1.5"></i>
                  <p className="text-2xl font-bold text-purple-600">2026mAh</p>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">设计容量</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="p-4 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-2">
                  <h5 className="font-bold text-gray-900 dark:text-white text-xs">充电策略</h5>
                  <label className="flex items-center text-xs text-gray-600 dark:text-gray-300">
                    <input type="checkbox" className="mr-2 text-primary rounded" defaultChecked />
                    低温极速快充旁路
                  </label>
                  <label className="flex items-center text-xs text-gray-600 dark:text-gray-300">
                    <input type="checkbox" className="mr-2 text-primary rounded" defaultChecked />
                    智能电池保护（满电自动浮充）
                  </label>
                </div>

                <div className="p-4 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-2">
                  <h5 className="font-bold text-gray-900 dark:text-white text-xs">特色微调</h5>
                  <label className="flex items-center text-xs text-gray-600 dark:text-gray-300">
                    <input type="checkbox" className="mr-2 text-primary rounded" defaultChecked />
                    彩虹流动灯效常亮
                  </label>
                  <label className="flex items-center text-xs text-gray-600 dark:text-gray-300">
                    <input type="checkbox" className="mr-2 text-primary rounded" defaultChecked />
                    开启高功率输出模式
                  </label>
                </div>
              </div>
            </div>
          );

        default:
          return null;
      }
    };

    return (
      <div className="flex-1 flex flex-col">
        <Header currentUser={currentUser} onLogout={handleLogout} title="彩虹电池工具箱" />

        <div className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          <div className="bg-white dark:bg-[#161617] rounded-3xl shadow-[0_4px_24px_-2px_rgba(0,0,0,0.04)] border border-black/[0.04] dark:border-white/[0.06] overflow-hidden mb-8">
            {/* 状态总览 */}
            <div className="p-6 sm:p-8 border-b border-black/[0.04] dark:border-white/[0.06] bg-gradient-to-r from-orange-500/5 via-amber-500/5 to-transparent">
              <div className="flex flex-wrap justify-between items-center gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-green-500/10 text-green-500 flex items-center justify-center text-2xl shadow-sm">
                    <i className="fa fa-battery-three-quarters"></i>
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-secondary dark:text-white">
                      大米彩虹电池工具箱
                    </h2>
                    <p className="text-xs text-green-600 dark:text-green-400 font-semibold flex items-center mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-green-500 inline-block mr-1.5 animate-pulse"></span>
                      已连接 · 盒盖开启中
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setIsToolsPage(false);
                      if (typeof window !== 'undefined') {
                        window.history.pushState(null, '', '/funhub/mi-rainbow-battery');
                      }
                    }}
                    className="text-xs text-gray-500 dark:text-gray-400 hover:text-primary transition-colors px-3 py-1.5 rounded-lg border border-black/[0.05] dark:border-white/[0.08]"
                  >
                    返回连接状态
                  </button>
                </div>
              </div>

              {/* 状态徽章条 */}
              <div className="mt-5 flex flex-wrap gap-2 text-xs">
                <span className={`px-3 py-1 rounded-full font-medium ${
                  deviceStatus.isUnlocked ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' : 'bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-300'
                }`}>
                  <i className={`fa ${deviceStatus.isUnlocked ? 'fa-unlock text-green-500' : 'fa-lock text-gray-400'} mr-1.5`}></i>
                  {deviceStatus.isUnlocked ? 'Bootloader 已解锁' : 'Bootloader 已锁定'}
                </span>
                <span className="px-3 py-1 rounded-full font-medium bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400">
                  <i className="fa fa-layer-group text-[#0071e3] mr-1.5"></i>
                  {deviceStatus.romName} {deviceStatus.romVersion}
                </span>
                <span className={`px-3 py-1 rounded-full font-medium ${
                  deviceStatus.isRooted ? 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400' : 'bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-300'
                }`}>
                  <i className={`fa ${deviceStatus.isRooted ? 'fa-shield-halved text-purple-500' : 'fa-ban text-gray-400'} mr-1.5`}></i>
                  {deviceStatus.isRooted ? 'Root 权限已激活' : '无 Root 权限'}
                </span>
              </div>
            </div>

            {/* 标签栏 */}
            <div className="border-b border-black/[0.04] dark:border-white/[0.06] flex">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setCurrentTab(tab.id)}
                  className={`flex-1 py-4 text-center text-sm font-semibold transition-all border-b-2 ${
                    currentTab === tab.id
                      ? 'text-primary border-primary bg-primary/5 dark:bg-primary/10'
                      : 'text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-800 dark:hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* 标签内容 */}
            {renderTabContent()}
          </div>
        </div>

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
      {renderDeviceConnectedModal()}
      {renderSearchAnimation()}
      {renderUnlockModal()}
      {renderFlashModal()}
      <Notification notification={notification} />
      {isToolsPage ? renderToolsPage() : renderDeviceConnectionArea()}
    </div>
  );
};

export default MiRainbowBattery;
