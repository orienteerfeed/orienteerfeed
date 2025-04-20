import {
  TableFetchError,
  TableLoadingProgress,
  TableNoDataAvailable,
} from '../atoms';

export const TableFetchState = ({ isLoading, error }) => {
  if (typeof isLoading !== 'undefined' && isLoading) {
    return <TableLoadingProgress />;
  } else if (typeof error !== 'undefined' && error) {
    return <TableFetchError error={error} />;
  } else {
    return <TableNoDataAvailable />;
  }
};
