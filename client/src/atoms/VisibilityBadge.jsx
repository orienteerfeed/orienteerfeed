import React from 'react';

export const VisibilityBadge = ({ t, isPublic }) => {
  return (
    <span
      className={`px-2 py-1 rounded-md text-xs uppercase font-bold ${
        isPublic ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-900'
      }`}
    >
      {isPublic
        ? t('Public', { ns: 'common' })
        : t('Private', { ns: 'common' })}
    </span>
  );
};
