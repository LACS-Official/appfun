import React from 'react';

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

export default Notification;
