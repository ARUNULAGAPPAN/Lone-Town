// frontend/src/pages/RegisterPage.jsx - REVISED FOR CONTACT FORM LAYOUT

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import heroHeartImage from '../assets/images/heart.png'; 

const RegisterPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData.name, formData.email, formData.password);
      navigate('/onboarding'); 
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'An unknown error occurred.';
      console.error("Registration failed:", errorMessage);
      alert('Registration failed: ' + errorMessage);
    }
  };

  return (
    <div className="auth-page-container">
      
      {/* --- Left Column: The Form --- */}
      <div className="auth-form-column">
        {/* We use the existing form-container, but the JSX inside is now corrected */}
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <h2>Create Your Account</h2>
            <p className="form-subtitle">Join us and find your meaningful connection.</p>
            
            {/* Each input is now wrapped in its own div for better structure */}
            <div className="form-group">
              <label htmlFor="name">Your Name</label>
              <input id="name" type="text" name="name" placeholder="What's your name?" value={formData.name} onChange={handleChange} required />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Your Email</label>
              <input id="email" type="email" name="email" placeholder="What's your email address?" value={formData.email} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label htmlFor="password">Your Password</label>
              <input id="password" type="password" name="password" placeholder="Create a strong password" value={formData.password} onChange={handleChange} required />
            </div>
            
            <button type="submit">Create Account</button>
            
            <p className="auth-switch">
              Already have an account? <Link to="/login">Login Instead</Link>
            </p>
          </form>
        </div>
      </div>

      {/* --- Right Column: The Image --- */}
      <div className="auth-image-column">
        <img src={heroHeartImage} alt="Beating Heart" className="auth-heart-image" />
      </div>

    </div>
  );
};

export default RegisterPage;