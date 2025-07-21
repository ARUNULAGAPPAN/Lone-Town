// frontend/src/components/ChatWindow.js
import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import MilestoneTracker from './MilestoneTracker';

const ChatWindow = ({ matchData }) => {
  const [messages, setMessages] = useState(matchData.messages || []);
  const [newMessage, setNewMessage] = useState('');
  const [videoUnlocked, setVideoUnlocked] = useState(matchData.videoCallUnlocked);
  const socket = useSocket();
  const { user } = useAuth();
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (!socket) return;
    
    // Join the specific room for this match
    socket.emit('joinMatch', matchData._id);

    // Listen for incoming messages
    socket.on('receiveMessage', (message) => {
      setMessages(prev => [...prev, message]);
    });

    // Listen for video call unlock event
    socket.on('videoCallUnlocked', () => {
        setVideoUnlocked(true);
        alert("Congratulations! You've unlocked video calling.");
    });

    // Cleanup listeners on component unmount
    return () => {
      socket.off('receiveMessage');
      socket.off('videoCallUnlocked');
    };
  }, [socket, matchData._id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !socket) return;

    const messagePayload = {
      matchId: matchData._id,
      senderId: user.user._id,
      text: newMessage,
    };

    socket.emit('sendMessage', messagePayload);
    // Add our own message to state immediately for better UX
    setMessages(prev => [...prev, { ...messagePayload, timestamp: new Date() }]);
    setNewMessage('');
  };

  return (
    <div>
      <h3>Conversation</h3>
      <MilestoneTracker current={messages.length} goal={100} />
      {videoUnlocked && <p style={{color: 'green'}}>Video Call Unlocked!</p>}

      <div className="message-list" style={{ height: '300px', overflowY: 'scroll', border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ textAlign: msg.sender === user.user._id ? 'right' : 'left' }}>
            <p style={{
                background: msg.sender === user.user._id ? '#dcf8c6' : '#fff',
                padding: '5px 10px',
                borderRadius: '10px',
                display: 'inline-block'
            }}>
              {msg.text}
            </p>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          style={{ width: '80%', padding: '10px' }}
        />
        <button type="submit" style={{ width: '18%', padding: '10px' }}>Send</button>
      </form>
    </div>
  );
};

export default ChatWindow;