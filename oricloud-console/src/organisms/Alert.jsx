import React, { forwardRef } from 'react';
import { cva } from 'class-variance-authority';
import {
  AiOutlineWarning,
  AiOutlineInfoCircle,
  AiOutlineCheckCircle,
  AiOutlineExclamationCircle,
} from 'react-icons/ai';

import { AlertTitle, AlertDescription } from '../molecules';
import { cn } from '../utils';

const alertVariants = cva(
  'relative w-full rounded-lg p-4 flex items-start gap-2 [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg+div]:translate-y-[-3px] [&:has(svg)]:pl-11',
  {
    variants: {
      variant: {
        default: 'text-foreground dark:text-white', // No background
        filled: 'text-white', // Background is handled dynamically
        outlined: 'border',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

// Define colors for each severity type
const severityColors = {
  success: {
    filled: 'bg-green-200 text-green-900 dark:bg-green-700 dark:text-white',
    outlined: 'border-green-500 text-green-700 dark:text-green-300',
  },
  info: {
    filled: 'bg-blue-200 text-blue-900 dark:bg-blue-700 dark:text-white',
    outlined: 'border-blue-500 text-blue-700 dark:text-blue-300',
  },
  warning: {
    filled: 'bg-orange-200 text-orange-900 dark:bg-orange-900 dark:text-white',
    outlined: 'border-orange-500 text-orange-700 dark:text-orange-300',
  },
  error: {
    filled: 'bg-red-200 text-red-900 dark:bg-red-700 dark:text-white',
    outlined: 'border-red-500 text-red-700 dark:text-red-300',
  },
};

const SeverityIcon = ({ severity, size }) => {
  const iconProps = {
    size,
    className: 'dark:text-white',
  };

  switch (severity) {
    case 'success':
      return (
        <AiOutlineCheckCircle
          {...iconProps}
          className="text-green-700 dark:text-white"
        />
      );
    case 'warning':
      return (
        <AiOutlineWarning
          {...iconProps}
          className="text-orange-700 dark:text-white"
        />
      );
    case 'error':
      return (
        <AiOutlineExclamationCircle
          {...iconProps}
          className="text-red-700 dark:text-white"
        />
      );
    case 'info':
      return (
        <AiOutlineInfoCircle
          {...iconProps}
          className="text-blue-700 dark:text-white"
        />
      );
    default:
      return null;
  }
};

export const Alert = forwardRef(
  (
    {
      title,
      severity = 'info',
      children,
      className,
      variant = 'default',
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          alertVariants({ variant }),
          severityColors[severity]?.[variant],
          className,
        )}
        {...props}
      >
        <SeverityIcon severity={severity} size="24px" />
        <div>
          <AlertTitle>{title}</AlertTitle>
          <AlertDescription>{children}</AlertDescription>
        </div>
      </div>
    );
  },
);
