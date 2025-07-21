// frontend/src/components/MilestoneTracker.js
import React from 'react';

const MilestoneTracker = ({ current, goal }) => {
    const percentage = Math.min((current / goal) * 100, 100);
    return (
        <div>
            <p>Progress to Video Call: {current}/{goal} messages</p>
            <div style={{ width: '100%', backgroundColor: '#eee' }}>
                <div style={{
                    width: `${percentage}%`,
                    height: '20px',
                    backgroundColor: 'green',
                    textAlign: 'center',
                    color: 'white',
                    lineHeight: '20px'
                }}>
                    {Math.round(percentage)}%
                </div>
            </div>
        </div>
    );
};

export default MilestoneTracker;