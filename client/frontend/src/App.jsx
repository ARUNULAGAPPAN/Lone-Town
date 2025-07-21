// frontend/src/App.jsx - CORRECTED LOGIC

import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ParticleBackground from './components/ParticleBackground';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OnboardingPage from './pages/OnboardingPage';
import EditProfilePage from './pages/EditProfilePage';
import ViewProfilePage from './pages/ViewProfilePage.jsx';
import FeedbackPage from './pages/FeedbackPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  // We need the full 'user' object to check their status
  const { isAuthenticated, user, logout } = useAuth();

  // This variable is now the single source of truth for showing the main UI
  const showMainUI = isAuthenticated && user?.user?.status !== 'ONBOARDING';

  return (
    <div> 
      <ParticleBackground />
      <header>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <h1>Lone Town</h1>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          
          {/* Use the new variable to control visibility */}
          {showMainUI && (
            <Link to="/profile/edit" title="Edit Profile">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color: 'var(--text-light)'}}><path d="M12.22 2h-4.44a2 2 0 0 0-2 2v.79l-4.52 4.52a2 2 0 0 0-.58 1.41v4.58a2 2 0 0 0 .58 1.41l4.52 4.52V20a2 2 0 0 0 2 2h4.44a2 2 0 0 0 1.41-.58l4.52-4.52a2 2 0 0 0 .58-1.41v-4.58a2 2 0 0 0-.58-1.41l-4.52-4.52V4a2 2 0 0 0-2-2z"/><path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"/></svg>
            </Link>
          )}

          {showMainUI && <button onClick={logout}>Logout</button>}

        </div>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/onboarding" element={<ProtectedRoute><OnboardingPage /></ProtectedRoute>} />
          <Route path="/profile/edit" element={<ProtectedRoute><EditProfilePage /></ProtectedRoute>} />
          <Route path="/profile/:userId" element={<ProtectedRoute><ViewProfilePage /></ProtectedRoute>} />
          <Route path="/feedback/:matchId" element={<ProtectedRoute><FeedbackPage /></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;