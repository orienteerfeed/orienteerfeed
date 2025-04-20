import { forwardRef } from 'react';
import { cn } from '../utils';
export const AlertTitle = forwardRef(
  ({ className, children, ...props }, ref) => (
    <h5
      ref={ref}
      className={cn('mb-1 font-medium leading-none tracking-tight', className)}
      {...props}
    >
      {children}
    </h5>
  ),
);
