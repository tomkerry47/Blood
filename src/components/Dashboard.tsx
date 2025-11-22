import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AddReading } from './AddReading';
import { ReadingsList } from './ReadingsList';
import { TrendChart } from './TrendChart';
import './Dashboard.css';

export const Dashboard = () => {
  const { user, signOut } = useAuth();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showUserId, setShowUserId] = useState(false);

  const handleReadingAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const copyUserId = () => {
    if (user?.id) {
      navigator.clipboard.writeText(user.id);
      alert('User ID copied to clipboard!');
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>🩺 Blood Pressure Tracker</h1>
          <div className="user-info">
            <span className="welcome-text">Welcome, {user?.name}</span>
            <button onClick={signOut} className="btn-secondary">
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {showUserId && user?.id && (
        <div className="user-id-banner">
          <div className="user-id-content">
            <strong>Your User ID (for Apple Shortcut):</strong>
            <code>{user.id}</code>
            <button onClick={copyUserId} className="btn-copy">Copy</button>
            <button onClick={() => setShowUserId(false)} className="btn-close">✕</button>
          </div>
        </div>
      )}

      <div className="shortcut-helper">
        <button onClick={() => setShowUserId(!showUserId)} className="btn-link">
          {showUserId ? 'Hide' : 'Show'} User ID for Apple Shortcut
        </button>
      </div>

      <main className="dashboard-main">
        <div className="dashboard-container">
          <AddReading onReadingAdded={handleReadingAdded} />
          <TrendChart refreshTrigger={refreshTrigger} />
          <ReadingsList refreshTrigger={refreshTrigger} />
        </div>
      </main>
    </div>
  );
};
