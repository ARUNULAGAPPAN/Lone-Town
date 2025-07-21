// frontend/src/components/ProfileHub.jsx - DYNAMIC VERSION

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import placeholderAvatar from '../assets/images/placeholder-avatar.png';

const ProfileCard = ({ profile }) => (
  <div className="profile-card">
    <img 
      src={profile.profile.profilePictureUrl || placeholderAvatar} 
      alt={profile.name} 
      className="card-profile-picture"
    />
    <h3 className="card-name">{profile.name}</h3>
    <p className="card-bio">{profile.profile.bio}</p>
    {/* Use a Link styled as a button */}
    <Link to={`/profile/${profile._id}`} className="btn-primary view-profile-btn">
      View Profile
    </Link>
  </div>
);

const ProfileHub = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const res = await api.get('/users/available');
        setProfiles(res.data);
      } catch (error) {
        console.error("Failed to fetch profiles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []); // Empty array means this runs once on component mount

  if (loading) {
    return <div className="status-container"><h2>Loading potential connections...</h2></div>;
  }

  return (
    <div className="profile-hub">
      <h2>Potential Connections</h2>
      <p>These profiles share a high compatibility with you. Click on a profile to learn more.</p>
      
      {profiles.length > 0 ? (
        <div className="profile-grid">
          {profiles.map(p => <ProfileCard key={p._id} profile={p} />)}
        </div>
      ) : (
        <p>No available users at the moment. Please check back later!</p>
      )}
    </div>
  );
};

export default ProfileHub;