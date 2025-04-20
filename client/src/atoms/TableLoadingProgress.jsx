import { AiOutlineLoading3Quarters } from 'react-icons/ai';
export const TableLoadingProgress = () => {
  return (
    <span className="inline-flex self-center text-center items-center gap-1 px-2 py-2">
      <AiOutlineLoading3Quarters className="mr-2 h-4 w-4 animate-spin" />
      Loading data ...
    </span>
  );
};
