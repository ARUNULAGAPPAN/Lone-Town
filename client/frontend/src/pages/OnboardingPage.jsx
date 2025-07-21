// frontend/src/pages/OnboardingPage.jsx - CORRECTED LOGIC

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import useAuth
import api from '../api';
import heroHeartImage from '../assets/images/heart.png';

const OnboardingPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth(); // Get the logout function from our context

  const [formData, setFormData] = useState({
    bio: '',
    conflictStyle: 'collaborator',
    loveLanguage: 'quality_time',
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        profile: {
          bio: formData.bio,
          psychology: {
            conflictStyle: formData.conflictStyle,
            loveLanguage: formData.loveLanguage,
          },
        },
      };
      await api.put('/users/onboarding', payload);
      
      // --- THIS IS THE NEW, CORRECTED FLOW ---
      // 1. Log the user out to end the temporary "onboarding" session.
      logout();
      
      // 2. Alert the user with clear instructions.
      alert('Profile created successfully! Please log in to begin.');
      
      // 3. Redirect to the login page.
      navigate('/login');

    } catch (error) {
      console.error('Onboarding submission failed', error);
      alert('Failed to submit profile. Please try again.');
    }
  };

  return (
    <div className="auth-page-container">
      {/* Left Column: The Form */}
      <div className="auth-form-column">
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <h2>Create Your Profile</h2>
            <p className="form-subtitle">This helps us find you a deeply compatible match.</p>
            
            <div className="form-group">
              <label htmlFor="bio">Your Bio</label>
              <textarea id="bio" name="bio" value={formData.bio} onChange={handleChange} required rows="5" placeholder="Write a few sentences about yourself..."></textarea>
            </div>
            
            <div className="form-group">
              <label htmlFor="conflictStyle">My Conflict Style</label>
              <select id="conflictStyle" name="conflictStyle" value={formData.conflictStyle} onChange={handleChange}>
                  <option value="confronter">Address issues head-on</option>
                  <option value="avoider">Need space to think first</option>
                  <option value="collaborator">Seek a compromise</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="loveLanguage">My Primary Love Language</label>
              <select id="loveLanguage" name="loveLanguage" value={formData.loveLanguage} onChange={handleChange}>
                  <option value="quality_time">Quality Time</option>
                  <option value="acts_of_service">Acts of Service</option>
                  <option value="words_of_affirmation">Words of Affirmation</option>
                  <option value="physical_touch">Physical Touch</option>
                  <option value="receiving_gifts">Receiving Gifts</option>
              </select>
            </div>

            <button type="submit">Complete Profile & Enter</button>
          </form>
        </div>
      </div>
      {/* Right Column: The Image */}
      <div className="auth-image-column">
        <img src={heroHeartImage} alt="Beating Heart" className="auth-heart-image" />
      </div>
    </div>
  );
};

export default OnboardingPage;