import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { Button } from '../atoms';
export const ButtonWithSpinner = ({ children, isSubmitting, ...props }) => {
  return (
    <Button {...props}>
      {isSubmitting && (
        <AiOutlineLoading3Quarters className="mr-2 h-4 w-4 animate-spin" />
      )}
      {children}
    </Button>
  );
};
