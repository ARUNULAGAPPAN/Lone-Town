// frontend/src/pages/EditProfilePage.jsx - FINAL VERSION WITH CLOUDINARY FILE UPLOAD

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios for the upload
import { useAuth } from '../context/AuthContext';
import api from '../api';
import placeholderAvatar from '../assets/images/placeholder-avatar.png'; 

const EditProfilePage = () => {
  const { user, setUser } = useAuth(); // We might need setUser to refresh the context
  const navigate = useNavigate();

  // State for all form fields
  const [formData, setFormData] = useState({
    profilePictureUrl: '',
    bio: '',
    gender: 'other',
    interestedIn: 'everyone',
    whatsappNumber: '',
    displayLocation: '',
    conflictStyle: 'collaborator',
    loveLanguage: 'quality_time',
  });
  
  // State to manage the upload process
  const [isUploading, setIsUploading] = useState(false);

  // useEffect to populate the form when the component loads
  useEffect(() => {
    if (user && user.user && user.user.profile) {
      const profile = user.user.profile;
      setFormData({
        profilePictureUrl: profile.profilePictureUrl || '',
        bio: profile.bio || '',
        gender: profile.gender || 'other',
        interestedIn: profile.interestedIn || 'everyone',
        whatsappNumber: profile.whatsappNumber || '',
        displayLocation: profile.displayLocation || '',
        conflictStyle: profile.psychology?.conflictStyle || 'collaborator',
        loveLanguage: profile.psychology?.loveLanguage || 'quality_time',
      });
    }
  }, [user]);

  // Generic handler for text and select inputs
  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // --- REAL FILE UPLOAD HANDLER ---
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);
    
    // ** IMPORTANT: Replace with your Cloudinary Upload Preset **
      uploadFormData.append('upload_preset', 'ml_default'); // Common default, but check yours

    try {
      // ** IMPORTANT: Replace with your Cloudinary Cloud Name **
      const cloudName = 'dnjvq2aza'; 
        const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        uploadFormData
      );

      // Get the secure URL from the Cloudinary response
      const imageUrl = response.data.secure_url;
      
      // Update the form state with the new image URL
       setFormData(prev => ({ ...prev, profilePictureUrl: imageUrl }));
      
    } catch (error) {
      console.error("Image upload failed:", error);
      alert("Sorry, there was an error uploading your image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  // Handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        profile: {
          profilePictureUrl: formData.profilePictureUrl,
          bio: formData.bio,
          gender: formData.gender,
          interestedIn: formData.interestedIn,
          whatsappNumber: formData.whatsappNumber,
          displayLocation: formData.displayLocation,
          psychology: {
            conflictStyle: formData.conflictStyle,
            loveLanguage: formData.loveLanguage,
          },
        },
      };

      await api.put('/users/onboarding', payload);
      
      alert('Profile updated successfully!');
      // Optional: Force a refresh of user data in context if needed
      // This is an advanced step, but useful if you want the header to update instantly
      // const updatedUserRes = await api.get('/users/me');
      // setUser(updatedUserRes.data); 
      
      navigate('/');
    } catch (error) {
      console.error('Profile update failed', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  return (
    <div className="edit-profile-container">
      {/* --- Left Column: Profile Picture --- */}
      <div className="profile-picture-column">
        <h3>Your Profile Picture</h3>
        <img 
          src={formData.profilePictureUrl || placeholderAvatar} 
          alt="Profile" 
          className="profile-picture-preview"
          onError={(e) => { e.target.onerror = null; e.target.src = placeholderAvatar; }}
        />
        <label htmlFor="imageUpload" className={`image-upload-label ${isUploading ? 'disabled' : ''}`}>
          {isUploading ? 'Uploading...' : 'Upload New Image'}
        </label>
        <input 
          id="imageUpload" 
          type="file" 
          accept="image/png, image/jpeg" 
          onChange={handleImageChange} 
          style={{ display: 'none' }}
          disabled={isUploading}
        />
      </div>

      {/* --- Right Column: Form Details --- */}
      <div className="profile-details-column">
        <form onSubmit={handleSubmit} className="profile-form">
          <h2>Edit Your Profile</h2>
          
          <div className="form-group">
            <label htmlFor="bio">Your Bio</label>
            <textarea id="bio" name="bio" value={formData.bio} onChange={handleChange} rows="4" placeholder="Tell us something about yourself..."></textarea>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="displayLocation">Your Location</label>
              <input id="displayLocation" type="text" name="displayLocation" value={formData.displayLocation} onChange={handleChange} placeholder="e.g., San Francisco, CA" />
            </div>
            <div className="form-group">
              <label htmlFor="whatsappNumber">WhatsApp (Optional)</label>
              <input id="whatsappNumber" type="tel" name="whatsappNumber" value={formData.whatsappNumber} onChange={handleChange} placeholder="e.g., 919876543210" />
            </div>
          </div>
          
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="gender">I am a...</label>
              <select id="gender" name="gender" value={formData.gender} onChange={handleChange}>
                <option value="male">Man</option>
                <option value="female">Woman</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="interestedIn">Looking for...</label>
              <select id="interestedIn" name="interestedIn" value={formData.interestedIn} onChange={handleChange}>
                <option value="male">Men</option>
                <option value="female">Women</option>
                <option value="everyone">Everyone</option>
              </select>
            </div>
          </div>
          
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="conflictStyle">My Conflict Style</label>
              <select id="conflictStyle" name="conflictStyle" value={formData.conflictStyle} onChange={handleChange}>
                <option value="confronter">Address issues head-on</option>
                <option value="avoider">Need space to think first</option>
                <option value="collaborator">Seek a compromise</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="loveLanguage">My Love Language</label>
              <select id="loveLanguage" name="loveLanguage" value={formData.loveLanguage} onChange={handleChange}>
                <option value="quality_time">Quality Time</option>
                <option value="acts_of_service">Acts of Service</option>
                <option value="words_of_affirmation">Words of Affirmation</option>
                <option value="physical_touch">Physical Touch</option>
                <option value="receiving_gifts">Receiving Gifts</option>
              </select>
            </div>
          </div>

          <button type="submit">Save Changes</button>
        </form>
      </div>
    </div>
  );
};

export default EditProfilePage;