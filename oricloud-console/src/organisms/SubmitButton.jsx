import React from 'react';
import { useFormikContext } from 'formik';
import { ButtonWithSpinner } from '../molecules';

export const SubmitButton = ({ children, ...props }) => {
  const { isSubmitting, isValid, dirty } = useFormikContext();

  return (
    <ButtonWithSpinner
      type="submit"
      disabled={isSubmitting || !(isValid && dirty)}
      isSubmitting={isSubmitting}
      {...props}
    >
      {children}
    </ButtonWithSpinner>
  );
};
