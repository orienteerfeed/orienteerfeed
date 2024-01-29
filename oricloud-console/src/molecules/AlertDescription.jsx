import { forwardRef } from 'react';
import { cn } from '../utils';
export const AlertDescription = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('text-sm [&_p]:leading-relaxed', className)}
    {...props}
  />
));
