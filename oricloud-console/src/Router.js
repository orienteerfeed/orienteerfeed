import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PATHNAMES from './pathnames';
import { SignInPage } from './pages/auth';
import { HomePage } from './pages/home';

export const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route exact path={PATHNAMES.empty()} element={<HomePage />} />
        <Route path={PATHNAMES.signIn()} element={<SignInPage />} />
      </Routes>
    </Router>
  );
};
