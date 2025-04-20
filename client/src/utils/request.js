import { useEffect, useState } from 'react';
import { toast } from './toast';
import { useAuth } from './auth';
import { config } from '../config';

const log = config.REQUEST_LOGGING
  ? (message, ...args) => {
      console.info(message, ...args);
    }
  : () => {};

export const useRequest = (api = fetch, initialState = {}) => {
  const { token } = useAuth(); // Get the token here
  const [state, setState] = useState({
    data: null,
    isLoading: false,
    error: null,
    ...initialState,
    request: async (url, options) => {
      sendRequest(url, options, { api, setState, token }); // Pass the token here
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
  { method = 'GET', headers = {}, onSuccess, onError, ...options } = {},
  { api, setState, token }, // Accept the token here
) => {
  log(`[api.${method}] start`, url);

  // Construct the full URL by combining baseURL and relativeUrl
  const fullUrl = `${config.BASE_API_URL}${url}`;

  // Add Authorization header if token exists
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  cancelRequest('Request canceled.');

  setState((oldState) => ({
    ...oldState,
    isLoading: true,
    error: null,
  }));

  try {
    const response = await api(fullUrl, {
      method,
      headers: {
        ...authHeaders, // Include Authorization header if token exists
        ...headers, // Include any custom headers passed in options
      },
      ...options,
    });
    const data = await response.json();

    if (response.ok) {
      log(`[api.${method}] success`, fullUrl, data);

      setState((oldState) => ({
        ...oldState,
        data,
        isLoading: false,
        error: null,
      }));

      if (onSuccess) {
        onSuccess(data);
      }
    } else {
      // If the status isn't 200–299, consider it an error
      throw new Error(
        data.errors
          ? data.errors.map((err) => `${err.msg}: ${err.param}`).join(', ')
          : 'Request failed',
      );
    }
  } catch (error) {
    toast({
      title: 'Ooh! Something went wrong.',
      description: error.message,
      variant: 'destructive',
    });
    log(`[api.${method}] error`, fullUrl, error);

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
    fetchRequest.request(url, { ...options, ...optionsUpdate });
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
