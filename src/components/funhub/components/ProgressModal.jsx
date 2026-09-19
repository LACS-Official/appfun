import React, { useRef } from 'react';

const ProgressModal = ({ 
  showProgressModal, 
  progress 
}) => {
  const progressModalRef = useRef(null);
  
  if (!showProgressModal || !progress) return null;
  
  const getProgressPercentage = () => {
    return Math.round(progress.percentage || 0);
  };
  
  return (
    <div
      id="progressModal"
      ref={progressModalRef}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <div className="bg-white dark:bg-[#1c1c1e] text-gray-900 dark:text-gray-100 rounded-2xl shadow-2xl max-w-md w-full border border-black/5 dark:border-white/10 p-6 transform transition-all scale-100">
        <h3 className="text-xl font-bold text-secondary dark:text-white mb-4 text-center">
          {progress.title || '正在处理'}
        </h3>
        <div className="mb-4">
          <div className="flex justify-between text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>{progress.message || '数据通讯中...'}</span>
            <span className="font-mono font-medium text-primary">{getProgressPercentage()}%</span>
          </div>
          <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-3 overflow-hidden">
            <div
              className="bg-primary h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress.percentage || 0}%` }}
            ></div>
          </div>
        </div>
        <div className="text-center text-xs text-gray-400 dark:text-gray-500">
          正在与模拟设备建立通道，请稍候...
        </div>
      </div>
    </div>
  );
};

export default ProgressModal;
