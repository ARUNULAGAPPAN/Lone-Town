// frontend/src/pages/ViewProfilePage.jsx - REVISED

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import placeholderAvatar from '../assets/images/placeholder-avatar.png';

const ViewProfilePage = () => {
    const { userId } = useParams();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get(`/users/profile/${userId}`);
                setProfile(res.data);
            } catch (error) {
                console.error("Failed to fetch profile", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [userId]);

    const getWhatsAppUrl = (number) => {
        if (!number) return null;
        const cleanedNumber = number.replace(/\D/g, '');
        return `https://wa.me/${cleanedNumber}`;
    };

    if (loading) return <div className="status-container"><h2>Loading Profile...</h2></div>;
    if (!profile) return <div className="status-container"><h2>Could not load profile.</h2></div>;

    const { name, profile: profileData } = profile;
    const whatsappUrl = getWhatsAppUrl(profileData.whatsappNumber);

    return (
        <div className="view-profile-page-wrapper"> {/* New wrapper for centering */}
            <div className="view-profile-container">
                <Link to="/" className="back-link">← Back to Hub</Link>
                
                <img 
                    src={profileData.profilePictureUrl || placeholderAvatar} 
                    alt={name} 
                    className="view-profile-picture"
                />
                <h2 className="view-profile-name">{name}</h2>
                
                {profileData.displayLocation && (
                    <p className="view-profile-location">📍 {profileData.displayLocation}</p>
                )}

                <p className="view-profile-bio">{profileData.bio}</p>
                
                <div className="profile-details-grid">
                     <div className="detail-box">
                         <h4>Love Language</h4>
                         <p>{profileData.psychology?.loveLanguage || 'N/A'}</p>
                     </div>
                     <div className="detail-box">
                         <h4>Conflict Style</h4>
                         <p>{profileData.psychology?.conflictStyle || 'N/A'}</p>
                     </div>
                </div>

                {whatsappUrl ? (
                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-primary whatsapp-button">
                        Chat on WhatsApp
                    </a>
                ) : (
                    <p className="no-contact-info">This user has not provided contact information.</p>
                )}
            </div>
        </div>
    );
};

export default ViewProfilePage;