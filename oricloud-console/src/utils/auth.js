import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

const LOCAL_STORAGE_AUTH_KEY = 'orienteerfeed-auth';

const initialState = {
  token: null,
  user: null,
};

const AuthContext = createContext(
  createContextValue({
    token: initialState.token,
    user: initialState.user,
    setState: () =>
      console.error('You are using AuthContext without AuthProvider!'),
  }),
);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [state, setState] = usePersistedAuth(initialState);

  const contextValue = useMemo(() => {
    const { token, user } = state;
    return createContextValue({ token, user, setState });
  }, [state, setState]);

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

function createContextValue({ token, user, setState }) {
  return {
    token,
    user,
    signin: ({ token, user }) => setState({ token, user }),
    signout: () => setState({ token: null, user: null }),
  };
}

function usePersistedAuth(defaultState) {
  const [state, setStateRaw] = useState(() => getStorageState(defaultState));

  const setState = useCallback((newState) => {
    setStateRaw(newState);
    setStorageState(newState);
  }, []);

  return [state, setState];
}

function getStorageState(defaultState) {
  console.log('Getting from localStorage');
  if (!window.localStorage) {
    console.log('LocalStorage not available');
    return defaultState;
  }

  const rawData = window.localStorage.getItem(LOCAL_STORAGE_AUTH_KEY);
  console.log(rawData);
  if (!rawData) {
    return defaultState;
  }

  try {
    const { user, token } = JSON.parse(rawData);

    if (
      token &&
      user &&
      user.email &&
      user.id &&
      user.lastname &&
      user.firstname
    ) {
      return { token, user };
    }
  } catch {}

  return defaultState;
}

function setStorageState(newState) {
  if (!window.localStorage) {
    return;
  }

  window.localStorage.setItem(LOCAL_STORAGE_AUTH_KEY, JSON.stringify(newState));
}
