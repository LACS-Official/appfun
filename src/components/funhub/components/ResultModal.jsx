import React, { useRef } from 'react';

const ResultModal = ({ 
  showResultModal, 
  setShowResultModal, 
  resultModal 
}) => {
  const resultModalRef = useRef(null);
  
  if (!showResultModal || !resultModal) return null;
  
  const handleModalClick = (e) => {
    if (resultModalRef.current && e.target === resultModalRef.current) {
      setShowResultModal(false);
    }
  };
  
  const getIconClass = () => {
    switch (resultModal.type) {
      case 'success':
        return 'fa-check-circle text-green-500';
      case 'error':
        return 'fa-times-circle text-red-500';
      case 'warning':
        return 'fa-exclamation-triangle text-amber-500';
      default:
        return 'fa-info-circle text-[#0071e3]';
    }
  };
  
  const getButtonClass = () => {
    switch (resultModal.type) {
      case 'success':
        return 'bg-green-600 hover:bg-green-700';
      case 'error':
        return 'bg-red-600 hover:bg-red-700';
      case 'warning':
        return 'bg-amber-600 hover:bg-amber-700';
      default:
        return 'bg-[#0071e3] hover:bg-[#0077ed]';
    }
  };
  
  return (
    <div
      id="resultModal"
      ref={resultModalRef}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleModalClick}
    >
      <div className="bg-white dark:bg-[#1c1c1e] text-gray-900 dark:text-gray-100 rounded-3xl shadow-2xl max-w-md w-full border border-black/5 dark:border-white/10 p-6 text-center transform transition-all scale-100">
        <div className="mb-4 result-icon-bounce">
          <i className={`fa ${getIconClass()} text-5xl`}></i>
        </div>
        <h3 className="text-xl font-bold text-secondary dark:text-white mb-2">
          {resultModal.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
          {resultModal.message}
        </p>
        <button
          className={`${getButtonClass()} text-white font-medium py-2.5 px-8 rounded-full transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-sm`}
          onClick={() => setShowResultModal(false)}
        >
          我知道了
        </button>
      </div>
    </div>
  );
};

export default ResultModal;
