import { forwardRef } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { MdClose } from 'react-icons/md';

import { Button } from '../atoms';
import { cn } from '../utils';

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = ({ className, children, ...props }) => (
  <DialogPrimitive.Portal className={cn(className)} {...props}>
    <div className="fixed inset-0 z-50 flex items-start justify-center sm:items-center">
      {children}
    </div>
  </DialogPrimitive.Portal>
);

const DialogOverlay = forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-50 bg-background/80 dark:bg-zinc-800/80 backdrop-blur-sm transition-all duration-100 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:fade-in',
      className,
    )}
    {...props}
  />
));

const DialogContent = forwardRef(
  ({ className, children, title, description, ...props }, ref) => (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          'fixed z-50 flex flex-col w-full max-h-[90vh] sm:max-w-lg bg-background dark:bg-zinc-800 rounded-lg shadow-lg border dark:border-zinc-900 animate-in',
          className,
        )}
        {...props}
      >
        {/* 🔹 Close Button in Top-Right */}
        <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm z-20 opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground data-[state=open]:text-white dark:text-white">
          <MdClose className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>

        {/* 🔹 Fixed Header */}
        <div className="sticky top-0 z-10 bg-background dark:bg-zinc-800 p-4 shadow-sm">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
        </div>

        {/* 🔹 Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4">{children}</div>

        {/* 🔹 Fixed Footer */}
        <div className="sticky bottom-0 z-10 bg-background dark:bg-zinc-800 p-1 shadow-sm">
          <DialogFooter />
        </div>
      </DialogPrimitive.Content>
    </DialogPortal>
  ),
);

const DialogHeader = ({ className, ...props }) => (
  <div
    className={cn(
      'flex flex-col space-y-1.5 text-center sm:text-left',
      className,
    )}
    {...props}
  />
);

const DialogFooter = ({ className, ...props }) => (
  <div
    className={cn(
      'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2',
      className,
    )}
    {...props}
  />
);

const DialogTitle = forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      'text-lg font-semibold leading-none tracking-tight dark:text-white',
      className,
    )}
    {...props}
  />
));

const DialogDescription = forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn(
      'text-sm text-muted-foreground dark:text-gray-400',
      className,
    )}
    {...props}
  />
));

const SimpleDialog = ({ trigger, title, description, children }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>{trigger}</Button>
      </DialogTrigger>
      <DialogContent title={title} description={description}>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  SimpleDialog,
};
