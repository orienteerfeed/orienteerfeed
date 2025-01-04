import { useTranslation } from 'react-i18next';

export const TableNoDataAvailable = () => {
  const { t } = useTranslation('common');
  return (
    <span className="inline-flex items-center gap-1 px-2 py-2">
      {t('Table.NoData')}
    </span>
  );
};
