import { AppRouter } from './Router';
import { ApolloWrapper, AuthProvider } from './utils';
import { Toaster } from './molecules/Toaster';

function App() {
  return (
    <AuthProvider>
      <ApolloWrapper>
        <AppRouter />
        <Toaster />
      </ApolloWrapper>
    </AuthProvider>
  );
}

export default App;
