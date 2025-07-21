// frontend/src/components/FrozenState.js
import React, { useState, useEffect } from 'react';

const FrozenState = ({ freezeUntil }) => {
    const calculateTimeLeft = () => {
        const difference = +new Date(freezeUntil) - +new Date();
        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        }
        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        return () => clearTimeout(timer);
    });

    return (
        <div>
            <h2>Reflection Period</h2>
            <p>Your profile is frozen to encourage mindful decisions. You can receive a new match in:</p>
            {timeLeft.hours || timeLeft.minutes || timeLeft.seconds ? (
                <h3>
                    {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
                </h3>
            ) : (
                <p>Your reflection period is over! You'll be eligible for the next matchmaking round.</p>
            )}
        </div>
    );
};

export default FrozenState;