import React from 'react';
import * as RadixTooltip from '@radix-ui/react-tooltip';

export const Tooltip = ({ children, content }) => {
  return (
    <RadixTooltip.Provider>
      <RadixTooltip.Root>
        <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
        <RadixTooltip.Portal>
          <RadixTooltip.Content
            className="bg-gray-900 text-white text-sm px-3 py-1 rounded-md shadow-lg animate-fadeIn"
            sideOffset={5} // Adjusts spacing from the trigger
          >
            {content}
            <RadixTooltip.Arrow className="fill-gray-900" />
          </RadixTooltip.Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  );
};
