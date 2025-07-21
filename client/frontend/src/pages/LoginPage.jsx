// frontend/src/pages/LoginPage.jsx - NEW TWO-COLUMN LAYOUT

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

// Import the same image for consistency
import heroHeartImage from '../assets/images/heart.png'; 

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password);
      // On successful login, navigate to the homepage to see user status
      navigate('/'); 
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'An unknown error occurred.';
      console.error("Login failed:", errorMessage);
      alert('Login failed: ' + errorMessage);
    }
  };

  return (
    // Use the exact same container class as the Register page
    <div className="auth-page-container">
      
      {/* --- Left Column: The Form --- */}
      <div className="auth-form-column">
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <h2>Welcome Back</h2>
            <p className="form-subtitle">Login to continue your journey.</p>
            
            <div className="form-group">
              <label htmlFor="email">Your Email</label>
              <input id="email" type="email" name="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label htmlFor="password">Your Password</label>
              <input id="password" type="password" name="password" placeholder="Enter your password" value={formData.password} onChange={handleChange} required />
            </div>
            
            <button type="submit">Login</button>
            
            <p className="auth-switch">
              Don't have an account? <Link to="/register">Register Now</Link>
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

export default LoginPage;