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
  const [showShortcutInstructions, setShowShortcutInstructions] = useState(false);

  const handleReadingAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const copyUserId = () => {
    if (user?.id) {
      navigator.clipboard.writeText(user.id);
      alert('User ID copied to clipboard!');
    }
  };

  const copyShortcutURL = () => {
    const apiUrl = window.location.origin + `/api/check-reading`;
    navigator.clipboard.writeText(apiUrl);
    alert('API URL copied! Use this in your Apple Shortcut.');
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
        <button 
          onClick={() => setShowShortcutInstructions(!showShortcutInstructions)} 
          className="btn-link"
        >
          {showShortcutInstructions ? '📱 Hide' : '📱 Set Up'} Apple Shortcut Notifications
        </button>
        {!showShortcutInstructions && (
          <button onClick={() => setShowUserId(!showUserId)} className="btn-link" style={{ marginLeft: '16px' }}>
            {showUserId ? 'Hide' : 'Show'} User ID
          </button>
        )}
      </div>

      {showShortcutInstructions && (
        <div className="shortcut-instructions">
          <div className="instructions-content">
            <h3>📱 Set Up Apple Shortcut Notifications</h3>
            <p>Get automatic reminders at noon and every 2 hours if you haven't recorded a reading.</p>
            
            <div className="download-shortcut-section">
              <h4>One-Click Install</h4>
              <p>Tap the button below on your iPhone to install the shortcut:</p>
              <div className="download-buttons">
                <a 
                  href="/BP-Tracker.shortcut" 
                  className="btn-download"
                >
                  📲 Install Shortcut
                </a>
              </div>
              <p className="help-note">✨ Opens directly in the Shortcuts app - just tap "Add Shortcut"</p>
              <p className="help-note">💡 Works for both users - checks if <strong>either</strong> user has recorded a reading today</p>
            </div>

            <div className="instruction-steps">
              <div className="step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h4>Install the Shortcut</h4>
                  <p>Tap "Install Shortcut" above on your iPhone. It will open the Shortcuts app and prompt you to add it.</p>
                </div>
              </div>

              <div className="step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h4>Set Up Automations</h4>
                  <ol>
                    <li>Go to the <strong>Automation</strong> tab in Shortcuts</li>
                    <li>Create <strong>Time of Day</strong> automations for:
                      <ul>
                        <li>12:00 PM (noon)</li>
                        <li>2:00 PM</li>
                        <li>4:00 PM</li>
                        <li>6:00 PM</li>
                        <li>8:00 PM</li>
                      </ul>
                    </li>
                    <li>Each automation should run "Check BP Reading"</li>
                    <li>Toggle <strong>OFF</strong> "Ask Before Running"</li>
                  </ol>
                </div>
              </div>

              <div className="step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h4>Test It!</h4>
                  <p>Tap your shortcut manually to test. You should get a notification if you haven't recorded a reading today.</p>
                </div>
              </div>
            </div>

            <div className="instructions-footer">
              <button onClick={() => setShowShortcutInstructions(false)} className="btn-secondary">
                Close Instructions
              </button>
            </div>
          </div>
        </div>
      )}

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
