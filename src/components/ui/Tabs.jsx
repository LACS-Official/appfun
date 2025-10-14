import React, { useState, useRef } from 'react';
import { cn } from '../../lib/utils';

const Tabs = React.forwardRef(({ defaultValue, children, className, ...props }, ref) => {
  const [value, setValue] = useState(defaultValue);
  
  React.useImperativeHandle(ref, () => ({
    value,
    setValue,
  }));
  
  return (
    <div ref={ref} className={className} {...props}>
      {React.Children.map(children, (child) => {
        if (child.type === TabsList) {
          return React.cloneElement(child, { value, onValueChange: setValue });
        }
        return child;
      })}
    </div>
  );
});
Tabs.displayName = 'Tabs';

const TabsList = React.forwardRef(({ children, value, onValueChange, className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground',
        className
      )}
      {...props}
    >
      {React.Children.map(children, (child) => {
        if (child.type === TabsTrigger) {
          return React.cloneElement(child, {
            pressed: child.props.value === value,
            onPressedChange: (pressed) => {
              if (pressed) {
                onValueChange(child.props.value);
              }
            },
          });
        }
        return child;
      })}
    </div>
  );
});
TabsList.displayName = 'TabsList';

const TabsTrigger = React.forwardRef(({ children, pressed, onPressedChange, className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm',
        pressed && 'data-[state=active]',
        className
      )}
      onClick={() => onPressedChange(true)}
      {...props}
    >
      {children}
    </button>
  );
});
TabsTrigger.displayName = 'TabsTrigger';

const TabsContent = React.forwardRef(({ children, value, className, ...props }, ref) => {
  const tabValue = React.useContext(TabsValueContext);
  const isActive = value === tabValue;
  
  return (
    <div
      ref={ref}
      className={cn(
        'mt-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        !isActive && 'hidden',
        className
      )}
      {...props}
    >
      {isActive && children}
    </div>
  );
});
TabsContent.displayName = 'TabsContent';

// Context for passing tab value down to TabsContent
const TabsValueContext = React.createContext(undefined);

// Override Tabs component to provide context
const TabsWithContext = React.forwardRef(({ defaultValue, children, className, ...props }, ref) => {
  const [value, setValue] = useState(defaultValue);
  
  React.useImperativeHandle(ref, () => ({
    value,
    setValue,
  }));
  
  return (
    <TabsValueContext.Provider value={value}>
      <div ref={ref} className={className} {...props}>
        {React.Children.map(children, (child) => {
          if (child.type === TabsList) {
            return React.cloneElement(child, { value, onValueChange: setValue });
          }
          if (child.type === TabsContent) {
            return React.cloneElement(child, { value: child.props.value });
          }
          return child;
        })}
      </div>
    </TabsValueContext.Provider>
  );
});
TabsWithContext.displayName = 'Tabs';

export { TabsWithContext as Tabs, TabsList, TabsTrigger, TabsContent };