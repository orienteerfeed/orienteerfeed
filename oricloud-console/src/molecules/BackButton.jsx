import React from 'react';
import { Link } from 'react-router-dom';
import { MdArrowBackIosNew } from 'react-icons/md';

export const BackButton = ({ t, path }) => {
  return (
    <Link to={path} className="">
      <div className="flex items-center">
        <MdArrowBackIosNew className="mr-2 h-4 w-4" />
        {t('Back', { ns: 'common' })}
      </div>
    </Link>
  );
};
