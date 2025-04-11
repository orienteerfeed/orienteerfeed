import React from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { cva } from 'class-variance-authority';

import { cn } from '../utils';

const tabsTrigger = cva(
  'px-4 py-2 text-sm font-medium focus:outline-none transition-all',
  {
    variants: {
      variant: {
        line: 'text-gray-600 hover:text-black data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black',
        subtle:
          'text-gray-600 hover:text-black data-[state=active]:text-black bg-transparent data-[state=active]:bg-gray-100 rounded-md',
        enclosed:
          'text-gray-600 hover:text-black border data-[state=active]:bg-white data-[state=active]:border-gray-300 rounded-t-md',
        outline:
          'text-gray-600 hover:text-black border border-gray-300 data-[state=active]:bg-white rounded-md',
        plain: 'text-gray-700 data-[state=active]:font-semibold',
      },
      size: {
        sm: 'text-sm px-3 py-1',
        md: 'text-base px-4 py-2',
        lg: 'text-lg px-5 py-3',
      },
    },
    defaultVariants: {
      variant: 'line',
      size: 'md',
    },
  },
);

const tabsList = cva('flex gap-2 mb-2', {
  variants: {
    variant: {
      line: 'border-b border-gray-300',
      subtle: '',
      enclosed: 'border-b border-gray-300',
      outline: '',
      plain: '',
    },
  },
  defaultVariants: {
    variant: 'line',
  },
});

export const Tab = ({
  tabs,
  children,
  defaultValue,
  variant = 'line',
  size = 'md',
  className,
}) => {
  return (
    <Tabs.Root
      defaultValue={defaultValue || tabs[0]}
      className={cn('w-full', className)}
    >
      <Tabs.List className={tabsList({ variant })}>
        {tabs.map((tab) => (
          <Tabs.Trigger
            key={tab}
            value={tab}
            className={tabsTrigger({ variant, size })}
          >
            {tab}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      {tabs.map((tab, index) => (
        <Tabs.Content key={tab} value={tab} className="p-4">
          {children[index]}
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
};
