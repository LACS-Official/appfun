import React from 'react';
import { Tab } from '@headlessui/react';
import { cn } from '../../lib/utils';

const Tabs = ({ defaultIndex = 0, selectedIndex, onChange, children, className, ...props }) => {
  return (
    <Tab.Group defaultIndex={selectedIndex == null ? defaultIndex : undefined} selectedIndex={selectedIndex} onChange={onChange}>
      <div className={className} {...props}>{children}</div>
    </Tab.Group>
  );
};

const TabsList = ({ children, className, ...props }) => {
  return (
    <Tab.List className={cn('inline-flex h-10 items-center justify-center rounded-md bg-gray-100 dark:bg-gray-800 p-1 text-gray-600 dark:text-gray-300', className)} {...props}>
      {children}
    </Tab.List>
  );
};

const TabsTrigger = ({ children, className, ...props }) => {
  return (
    <Tab
      className={({ selected }) =>
        cn(
          'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
          selected ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow-sm' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700',
          className
        )
      }
      {...props}
    >
      {children}
    </Tab>
  );
};

const TabsContent = ({ children, className, ...props }) => {
  return (
    <Tab.Panel className={cn('mt-2 focus:outline-none', className)} {...props}>
      {children}
    </Tab.Panel>
  );
};

export { Tabs, TabsList, TabsTrigger, TabsContent };
