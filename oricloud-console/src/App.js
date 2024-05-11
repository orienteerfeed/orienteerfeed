import { AppRouter } from './Router';
import { AuthProvider } from './utils';
import { Toaster } from './molecules/Toaster';

function App() {
  return (
    <AuthProvider>
      <AppRouter />
      <Toaster />
    </AuthProvider>
  );
}

export default App;
