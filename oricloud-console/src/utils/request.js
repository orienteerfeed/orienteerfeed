import { useEffect, useState } from 'react';
import { toast } from './toast';
import { config } from '../config';

const log = config.REQUEST_LOGGING
  ? (message, ...args) => {
      console.info(message, ...args);
    }
  : () => {};
export const useRequest = (api = fetch, initialState = {}) => {
  const [state, setState] = useState({
    data: null,
    isLoading: false,
    error: null,
    ...initialState,
    request: async (url, options) => {
      sendRequest(url, options, { api, setState });
    },
  });

  useEffect(() => {
    return () => {
      cancelRequest('Canceling pending request on component unmount.');
    };
  }, []);

  return state;
};

const sendRequest = async (
  url,
  { method = 'GET', onSuccess, onError, ...options } = {},
  { api, setState },
) => {
  log(`[api.${method}] start`, url);

  cancelRequest('Request canceled.');

  setState((oldState) => ({
    ...oldState,
    isLoading: true,
    error: null,
  }));

  try {
    const response = await api(url, { method, ...options });
    const data = await response.json();

    log(`[api.${method}] success`, url, data);

    setState((oldState) => ({
      ...oldState,
      data,
      isLoading: false,
      error: null,
    }));

    if (onSuccess) {
      onSuccess(data);
    }
  } catch (error) {
    toast({
      title: 'Ooh! Something went wrong.',
      description: error.message,
      variant: 'destructive',
    });
    log(`[api.${method}] error`, url, error);

    setState((oldState) => ({
      ...oldState,
      isLoading: false,
      error: error.message,
    }));

    if (onError) {
      onError(error.message);
    }
  }
};

export const useFetchRequest = (url, { lazy = false, ...options } = {}) => {
  const fetchRequest = useRequest(fetch, lazy ? {} : { isLoading: true });

  const refetch = (optionsUpdate = {}) => {
    fetchRequest.request(url, { ...options, optionsUpdate });
  };

  useEffect(() => {
    if (!lazy) {
      refetch();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    ...fetchRequest,
    refetch,
  };
};

const cancelRequest = (reason) => {
  // Implement canceling logic if needed
};
