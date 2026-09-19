import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white/80 dark:bg-[#161617]/80 backdrop-blur-md border-t border-black/[0.04] dark:border-white/[0.06] py-6 transition-colors">
      <div className="container mx-auto px-4">
        <div className="text-center text-gray-600 dark:text-gray-400">
          <p className="mb-1 text-sm font-medium">© 2025 - 2026 领创工作室 · FunHub 趣味模拟工坊</p>
          <p className="text-xs text-gray-500 dark:text-gray-500">一个专注于创意网页开发与交互设计的集合平台</p>
        </div>
        <div className="flex flex-wrap justify-center items-center mt-3 gap-4 text-xs">
          <a href="/" className="text-primary font-medium flex items-center hover:underline">
            APPFUN 软件库
            <i className="fa fa-home ml-1 text-[10px]"></i>
          </a>
          <span className="text-gray-300 dark:text-gray-700">·</span>
          <a href="/funhub" className="text-primary font-medium flex items-center hover:underline">
            FunHub 首页
            <i className="fa fa-compass ml-1 text-[10px]"></i>
          </a>
          <span className="text-gray-300 dark:text-gray-700">·</span>
          <a href="https://www.lacs.cc" target="_blank" rel="noopener noreferrer" className="text-primary font-medium flex items-center hover:underline">
            领创工作室官网
            <i className="fa fa-external-link-alt ml-1 text-[10px]"></i>
          </a>
          <span className="text-gray-300 dark:text-gray-700">·</span>
          <a href="https://www.lacs.cc/contact#qun-group" target="_blank" rel="noopener noreferrer" className="text-primary font-medium flex items-center hover:underline" id="qun-group">
            加入交流群
            <i className="fa fa-users ml-1 text-[10px]"></i>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
