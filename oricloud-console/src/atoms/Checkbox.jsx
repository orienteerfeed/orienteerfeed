import React, { forwardRef } from 'react';
import * as CheckboxComponent from '@radix-ui/react-checkbox';
import { AiOutlineCheck } from 'react-icons/ai';

import { cn } from '../utils';

export const Checkbox = forwardRef(
  ({ className, checked, helpers, ...props }, ref) => {
    const { setValue } = helpers;
    return (
      <CheckboxComponent.Root
        className={cn(
          'border border-input hover:bg-primary/90 flex h-[20px] w-[20px] appearance-none items-center justify-center rounded-[4px] bg-transparent focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          className,
        )}
        checked={checked}
        onCheckedChange={(checked) => setValue(checked)}
        {...props}
        ref={ref}
      >
        <CheckboxComponent.Indicator className="text-black">
          <AiOutlineCheck size={12} />
        </CheckboxComponent.Indicator>
      </CheckboxComponent.Root>
    );
  },
);
