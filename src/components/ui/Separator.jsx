import React from 'react';
import { cn } from '../../lib/utils';

const Separator = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "my-6 border-t bg-border",
      className
    )}
    {...props}
  />
));
Separator.displayName = "Separator";

export { Separator };