// frontend/src/components/MatchDisplay.jsx - UPDATED

import React from 'react';
import { useAuth } from '../context/AuthContext'; // Import useAuth to get current user ID
import ChatWindow from './ChatWindow.jsx';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const MatchDisplay = ({ matchData }) => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth(); // Get the logged-in user's data

  // Find the other user in the match
  const partner = matchData.users.find(u => u._id !== currentUser.user._id);

  if (!partner) {
    return <div>Error: Could not find your match partner.</div>;
  }

  // Function to create the WhatsApp "click to chat" URL
  // It removes non-digit characters and assumes an international format
  const getWhatsAppUrl = (number) => {
    if (!number) return null;
    const cleanedNumber = number.replace(/\D/g, '');
    return `https://wa.me/${cleanedNumber}`;
  };

  const whatsappUrl = getWhatsAppUrl(partner.profile.whatsappNumber);

  const handleUnpin = () => {
    navigate(`/feedback/${matchData._id}`);
  };

  return (
    <div className="match-display-container">
      <div className="match-profile-column">
        <h2>You are matched with {partner.name}!</h2>
        
        <div className="match-profile-card">
          <img src={partner.profile.profilePictureUrl || 'path/to/default-avatar.png'} alt={partner.name} className="match-profile-picture" />
          <p className="match-bio">{partner.profile.bio}</p>

          <div className="match-details">
            {partner.profile.displayLocation && (
              <div className="detail-item">
                <span className="detail-icon">📍</span>
                <span>{partner.profile.displayLocation}</span>
              </div>
            )}
            {whatsappUrl && (
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="detail-item whatsapp-link">
                <span className="detail-icon">💬</span>
                <span>Chat on WhatsApp</span>
              </a>
            )}
          </div>

          <button onClick={handleUnpin} className="unpin-button">
            Unpin & Move On
          </button>
        </div>
      </div>

      <div className="match-chat-column">
        <ChatWindow matchData={matchData} />
      </div>
    </div>
  );
};

export default MatchDisplay;