import { forwardRef } from 'react';

import { cn } from '../utils';

export const FlagIcon = forwardRef(
  ({ countryCode = '', className, ...props }, ref) => {
    if (countryCode === 'en') {
      countryCode = 'gb';
    }

    return (
      <span
        className={cn(`fi fis inline-block fi-${countryCode}`, className)}
        ref={ref}
        {...props}
      />
    );
  },
);
