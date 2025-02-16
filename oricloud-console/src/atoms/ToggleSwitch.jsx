import React from 'react';
import * as Switch from '@radix-ui/react-switch';
import { cva } from 'class-variance-authority';
import { cn } from '../utils'; // Utility function for conditional class merging

const switchVariants = cva(
  'relative w-11 h-6 rounded-full transition-all outline-none cursor-pointer',
  {
    variants: {
      variant: {
        default: 'bg-gray-300 data-[state=checked]:bg-blue-500',
        success: 'bg-gray-300 data-[state=checked]:bg-green-500',
        warning: 'bg-gray-300 data-[state=checked]:bg-yellow-500',
        danger: 'bg-gray-300 data-[state=checked]:bg-red-500',
      },
      size: {
        sm: 'w-8 h-4',
        md: 'w-11 h-6',
        lg: 'w-14 h-7',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  },
);

const switchThumbVariants = cva(
  'block bg-white rounded-full shadow-md transition-all',
  {
    variants: {
      size: {
        sm: 'w-3 h-3 translate-x-1 data-[state=checked]:translate-x-5',
        md: 'w-4 h-4 translate-x-1 data-[state=checked]:translate-x-6',
        lg: 'w-5 h-5 translate-x-1 data-[state=checked]:translate-x-7',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

export const ToggleSwitch = ({ checked, onChange, variant, size }) => {
  return (
    <Switch.Root
      className={cn(switchVariants({ variant, size }))}
      checked={checked}
      onCheckedChange={onChange}
    >
      <Switch.Thumb className={cn(switchThumbVariants({ size }))} />
    </Switch.Root>
  );
};
