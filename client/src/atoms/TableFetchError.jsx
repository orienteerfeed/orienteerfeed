import { AiOutlineCloseCircle } from 'react-icons/ai';
export const TableFetchError = ({ error }) => {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-2">
      <AiOutlineCloseCircle className="mr-2 h-4 w-4" />
      {error}
    </span>
  );
};
