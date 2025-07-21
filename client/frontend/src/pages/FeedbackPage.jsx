// frontend/src/pages/FeedbackPage.jsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

const FeedbackPage = () => {
  const { matchId } = useParams();
  const [reason, setReason] = useState('no_spark');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason) {
      alert('Please select a reason.');
      return;
    }
    try {
      await api.post(`/matches/${matchId}/unpin`, { reason });
      alert("Feedback submitted. Your profile is now in a 24-hour reflection period.");
      navigate('/');
      window.location.reload(); // Force a refresh to update user state
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      alert('Failed to submit feedback. Please try again.');
    }
  };

  return (
    <div className="form-container">
      <h2>Why didn't it work out?</h2>
      <p>Your feedback helps us improve future matches for everyone.</p>
      <form onSubmit={handleSubmit}>
        <div className="radio-group">
            <label>
                <input type="radio" value="no_spark" checked={reason === 'no_spark'} onChange={e => setReason(e.target.value)} />
                The chemistry wasn't there
            </label>
            <label>
                <input type="radio" value="values_mismatch" checked={reason === 'values_mismatch'} onChange={e => setReason(e.target.value)} />
                Our core values didn't align
            </label>
            <label>
                <input type="radio" value="communication_style" checked={reason === 'communication_style'} onChange={e => setReason(e.target.value)} />
                Different communication styles
            </label>
            <label>
                <input type="radio" value="other" checked={reason === 'other'} onChange={e => setReason(e.target.value)} />
                Other
            </label>
        </div>
        <button type="submit">Confirm and End Match</button>
      </form>
    </div>
  );
};

export default FeedbackPage;