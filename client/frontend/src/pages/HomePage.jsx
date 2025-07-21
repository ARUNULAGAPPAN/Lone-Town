// frontend/src/pages/HomePage.jsx - NEW VISUAL LANDING PAGE
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, Navigate } from 'react-router-dom';
import MatchDisplay from '../components/MatchDisplay.jsx';
import FrozenState from '../components/FrozenState.jsx';
import ProfileHub from '../components/ProfileHub.jsx';

// Import the hero image
import heroHeartImage from '../assets/images/heart.png'; // Adjust the path as necessary

const HomePage = () => {
  const { isAuthenticated, user } = useAuth();

  // --- THIS IS THE NEW LANDING PAGE FOR LOGGED-OUT USERS ---
  if (!isAuthenticated) {
    return (
      <div className="hero-landing-container">
        <div className="hero-content">
         
          <div className="hero-main">
            <h1 className="hero-title-primary">True</h1>
            <img src={heroHeartImage} alt="Glowing Heart" className="hero-heart-image" />
            <h1 className="hero-title-primary">Love</h1>
          </div>
          <p className="hero-subtitle">
            Join others who have found real connections. Love is just a click away.
          </p>
          <Link to="/register" className="btn-primary hero-button">
            Find Your True Love
          </Link>
          <p className="login-link">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    );
  }

  // --- The rest of the component for logged-in users remains the same ---
  const renderContent = () => {
    if (!user || !user.user) {
        return <p>Loading your profile...</p>;
    }
    switch (user.user.status) {
      case 'ONBOARDING':
        return <Navigate to="/onboarding" replace />;
      case 'MATCHED':
        return <MatchDisplay matchData={user.match} />;
      case 'FROZEN':
        return <FrozenState freezeUntil={user.user.freezeUntil} />;
      case 'AVAILABLE':
        return <ProfileHub />;
      default:
        return <p>Welcome! Unknown account status.</p>;
    }
  };

  return (
    <div className="homepage-loggedIn">
      {renderContent()}
    </div>
  );
};

export default HomePage;