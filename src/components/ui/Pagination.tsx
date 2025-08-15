import React from 'react';
import { cn } from '../../lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  showInfo?: boolean;
  className?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  showInfo = true,
  className = ''
}: PaginationProps) {
  // 计算显示的页码范围
  const getPageNumbers = () => {
    const delta = 2; // 当前页前后显示的页数
    const range = [];
    const rangeWithDots = [];

    // 计算范围
    const start = Math.max(1, currentPage - delta);
    const end = Math.min(totalPages, currentPage + delta);

    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    // 添加第一页和省略号
    if (start > 1) {
      rangeWithDots.push(1);
      if (start > 2) {
        rangeWithDots.push('...');
      }
    }

    // 添加中间页码
    rangeWithDots.push(...range);

    // 添加最后一页和省略号
    if (end < totalPages) {
      if (end < totalPages - 1) {
        rangeWithDots.push('...');
      }
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const pageNumbers = getPageNumbers();
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className={cn('flex items-center justify-between', className)}>
      {/* 信息显示 */}
      {showInfo && (
        <div className="text-sm text-gray-700">
          显示第 <span className="font-medium">{startItem}</span> 到{' '}
          <span className="font-medium">{endItem}</span> 项，共{' '}
          <span className="font-medium">{totalItems}</span> 项
        </div>
      )}

      {/* 分页控件 */}
      <nav className="flex items-center space-x-1">
        {/* 上一页按钮 */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={cn(
            'relative inline-flex items-center px-2 py-2 text-sm font-medium rounded-md',
            'border border-gray-300 bg-white text-gray-500',
            'hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white',
            'transition-colors'
          )}
          aria-label="上一页"
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {/* 页码按钮 */}
        {pageNumbers.map((pageNumber, index) => {
          if (pageNumber === '...') {
            return (
              <span
                key={`ellipsis-${index}`}
                className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700"
              >
                ...
              </span>
            );
          }

          const isCurrentPage = pageNumber === currentPage;

          return (
            <button
              key={pageNumber}
              onClick={() => onPageChange(pageNumber as number)}
              className={cn(
                'relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md',
                'border focus:z-10 focus:outline-none focus:ring-1 focus:ring-primary-500',
                'transition-colors',
                isCurrentPage
                  ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
              )}
              aria-current={isCurrentPage ? 'page' : undefined}
            >
              {pageNumber}
            </button>
          );
        })}

        {/* 下一页按钮 */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={cn(
            'relative inline-flex items-center px-2 py-2 text-sm font-medium rounded-md',
            'border border-gray-300 bg-white text-gray-500',
            'hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white',
            'transition-colors'
          )}
          aria-label="下一页"
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </nav>
    </div>
  );
}
