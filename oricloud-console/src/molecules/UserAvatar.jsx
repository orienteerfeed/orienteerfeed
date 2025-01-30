import React from 'react';

export const UserAvatar = ({ firstName, lastName }) => {
  const initials = `${firstName?.charAt(0) ?? ''}${lastName?.charAt(0) ?? ''}`;

  return (
    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-zinc-700 text-white uppercase cursor-pointer">
      {initials}
    </div>
  );
};
