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
  'relative w-full rounded-lg p-4 [&>svg]:absolute [&>svg]:text-foreground [&>svg]:left-4 [&>svg]:top-4 [&>svg+div]:translate-y-[-3px] [&:has(svg)]:pl-11',
  {
    variants: {
      variant: {
        default: 'bg-orange-200 text-foreground dark:text-white',
        destructive:
          'text-destructive border border-destructive/50 dark:border-destructive [&>svg]:text-destructive text-destructive',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

const SeverityIcon = ({ severity, size }) => {
  let icon;
  switch (severity) {
    case 'success':
      icon = <AiOutlineCheckCircle size={size} className="dark:text-white" />;
      break;
    case 'warning':
      icon = <AiOutlineWarning size={size} className="dark:text-white" />;
      break;
    case 'error':
      icon = (
        <AiOutlineExclamationCircle size={size} className="dark:text-white" />
      );
      break;
    case 'info':
      icon = <AiOutlineInfoCircle size={size} className="dark:text-white" />;
      break;
    default:
      icon = null;
      break;
  }
  return icon;
};

export const Alert = forwardRef(
  ({ title, severity, children, className, variant, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="alert"
        className={cn(alertVariants({ variant }), className)}
        {...props}
      >
        <SeverityIcon severity={severity} size="24px" />
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{children}</AlertDescription>
      </div>
    );
  },
);
