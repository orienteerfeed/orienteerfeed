import { Input, Select } from '../atoms';
export const InputWithHelper = ({ error, helperText, type, ...props }) => {
  return (
    <>
      {typeof type !== 'undefined' && type === 'select' ? (
        <Select type={type} {...props} className={error && 'border-red-500'} />
      ) : (
        <Input type={type} {...props} className={error && 'border-red-500'} />
      )}
      {helperText && !error && (
        <p className="p-1 text-xs text-left text-gray-500">{helperText}</p>
      )}
      {error && <p className="px-1 text-xs text-left text-red-600">{error}</p>}
    </>
  );
};
