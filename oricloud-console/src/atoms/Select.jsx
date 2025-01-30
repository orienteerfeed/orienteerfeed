import { forwardRef } from 'react';

import { cn } from '../utils';

export const Select = forwardRef(
  ({ className, type, options = [], ...props }, ref) => {
    return (
      <select
        type={type}
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-transparent dark:text-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        ref={ref}
        {...props}
      >
        <option value="" label="" />
        {options.map((option, i) => (
          <option key={i} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  },
);

export default Select;
