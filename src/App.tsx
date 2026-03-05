import LobbyPage from './pages/LobbyPage';

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from './store';
import useSocket from './hooks/useSocket';

// @ts-expect-error — PokerInterface is a .jsx file without type declarations
import PokerInterface from './PokerInterface';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  // Initialise socket connection (auto-connects when authenticated)
  useSocket();

  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/game" replace /> : <LoginPage />
          }
        />
        <Route
          path="/register"
          element={
            isAuthenticated ? <Navigate to="/game" replace /> : <RegisterPage />
          }
        />

        {/* Protected game route */}
        <Route
          path="/game"
          element={
            <ProtectedRoute>
              <PokerInterface />
            </ProtectedRoute>
          }
        />

        {/* Lobby route */}
        <Route
          path="/lobby"
          element={
            <ProtectedRoute>
              <LobbyPage />
            </ProtectedRoute>
          }
        />

        {/* Default redirect */}
        <Route
          path="*"
          element={
            <Navigate to={isAuthenticated ? '/game' : '/login'} replace />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
