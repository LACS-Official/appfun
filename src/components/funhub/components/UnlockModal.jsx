import React, { useRef } from 'react';

const UnlockModal = ({ 
  showUnlockModal, 
  setShowUnlockModal, 
  unlockForm, 
  setUnlockForm, 
  onUnlock 
}) => {
  const unlockModalRef = useRef(null);
  
  if (!showUnlockModal) return null;
  
  return (
    <div
      id="unlockModal"
      ref={unlockModalRef}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <div className="bg-white dark:bg-[#1c1c1e] text-gray-900 dark:text-gray-100 rounded-2xl shadow-2xl max-w-md w-full border border-black/5 dark:border-white/10 transform transition-all scale-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
          <h3 className="text-xl font-bold text-secondary dark:text-white">设备信息录入</h3>
          <button
            onClick={() => setShowUnlockModal(false)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <i className="fa fa-times"></i>
          </button>
        </div>
        <div className="p-6">
          <form className="space-y-4 unlock-form" onSubmit={onUnlock}>
            <div>
              <label htmlFor="deviceModel" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                设备型号 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="deviceModel"
                name="deviceModel"
                placeholder="例如：大米灵感触控笔 2 代"
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
                placeholder="例如：DM202410240001"
                required
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-black/20 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition text-sm text-gray-900 dark:text-gray-100"
                value={unlockForm.deviceSN}
                onChange={(e) => setUnlockForm(prev => ({ ...prev, deviceSN: e.target.value }))}
              />
              <p className="mt-1.5 text-xs text-gray-400 dark:text-gray-500">提示：可填任意数字作为模拟序列号</p>
            </div>
            <div className="pt-3">
              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 px-4 rounded-xl transition duration-200 transform hover:scale-[1.01] active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-sm"
              >
                下一步：验证与开盖
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UnlockModal;
