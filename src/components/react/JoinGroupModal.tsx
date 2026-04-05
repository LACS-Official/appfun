import React, { useState, useEffect } from "react";

interface JoinGroupModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const JoinGroupModal = ({
  isOpen: externalIsOpen,
  onClose,
}: JoinGroupModalProps) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);

  // Determine if the modal should be open based on external or internal state
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;

  useEffect(() => {
    // If controlled by external props, skip internal logic
    if (externalIsOpen !== undefined) return;

    // 1. 检查本地存储，如果是首次访问则自动弹出
    const hasShown = localStorage.getItem("hasShownJoinGroup");
    if (!hasShown) {
      // 延迟一小段时间显示，提升用户体验
      const timer = setTimeout(() => {
        setInternalIsOpen(true);
        localStorage.setItem("hasShownJoinGroup", "true");
      }, 1500);
      return () => clearTimeout(timer);
    }

    // 2. 监听全局自定义事件，以便从 Header 按钮触发
    const handleOpen = () => setInternalIsOpen(true);
    window.addEventListener("open-join-group-modal", handleOpen);

    return () =>
      window.removeEventListener("open-join-group-modal", handleOpen);
  }, [externalIsOpen]);

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      setInternalIsOpen(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all duration-300">
      <div className="relative w-[90%] max-w-[360px] overflow-hidden rounded-2xl bg-white p-6 shadow-2xl dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 animate-in zoom-in-95 duration-200">
        {/* 关闭按钮 */}
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 p-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
          aria-label="关闭"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/30">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#2563eb"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>

          <h3 className="mb-1 text-xl font-bold text-zinc-900 dark:text-white">
            APPFUN 交流总群
          </h3>
          <p className="mb-6 text-sm text-zinc-500 dark:text-zinc-400">
            发现更多好玩的应用，与同好交流
          </p>

          {/* 二维码区域 */}
          <div className="group relative mb-6 overflow-hidden rounded-xl bg-zinc-50 p-3 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
            <img
              src="https://img-g.lacs.cc/file/admtweb/1773834361747_qrcode_1773834154907.webp"
              alt="QQ交流群二维码"
              className="h-44 w-44 object-contain transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          </div>

          {/* 交互按钮 */}
          <div className="flex w-full flex-col gap-3">
            <a
              href="https://qm.qq.com/q/8Qq97bYVVe"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition-all hover:bg-blue-700 active:scale-[0.98] shadow-lg shadow-blue-500/20"
            >
              <span>立即加入群聊</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </a>
            <button
              onClick={handleClose}
              className="text-sm font-medium text-zinc-400 hover:text-zinc-500 transition-colors"
            >
              稍后再说
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinGroupModal;
