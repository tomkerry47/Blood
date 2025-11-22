import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import './AddReading.css';

export const AddReading = ({ onReadingAdded }: { onReadingAdded: () => void }) => {
  const { user } = useAuth();
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [pulse, setPulse] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setError('');
    setSuccess(false);
    setLoading(true);

    const { error: insertError } = await supabase.from('readings').insert({
      user_id: user.id,
      systolic: parseInt(systolic),
      diastolic: parseInt(diastolic),
      pulse: pulse ? parseInt(pulse) : null,
      notes: notes || null,
      recorded_at: new Date().toISOString(),
    });

    if (insertError) {
      setError(insertError.message);
    } else {
      setSuccess(true);
      setSystolic('');
      setDiastolic('');
      setPulse('');
      setNotes('');
      onReadingAdded();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    }

    setLoading(false);
  };

  return (
    <div className="add-reading-card">
      <h2>📝 Add Reading</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="reading-inputs">
          <div className="form-group">
            <label htmlFor="systolic">Systolic (top)</label>
            <input
              id="systolic"
              type="number"
              value={systolic}
              onChange={(e) => setSystolic(e.target.value)}
              required
              min="50"
              max="250"
              placeholder="120"
            />
            <span className="unit">mmHg</span>
          </div>

          <div className="form-group">
            <label htmlFor="diastolic">Diastolic (bottom)</label>
            <input
              id="diastolic"
              type="number"
              value={diastolic}
              onChange={(e) => setDiastolic(e.target.value)}
              required
              min="30"
              max="150"
              placeholder="80"
            />
            <span className="unit">mmHg</span>
          </div>

          <div className="form-group">
            <label htmlFor="pulse">Pulse (optional)</label>
            <input
              id="pulse"
              type="number"
              value={pulse}
              onChange={(e) => setPulse(e.target.value)}
              min="30"
              max="200"
              placeholder="72"
            />
            <span className="unit">bpm</span>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="notes">Notes (optional)</label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any additional notes..."
            rows={2}
          />
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">✓ Reading saved successfully!</div>}

        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Saving...' : 'Save Reading'}
        </button>
      </form>
    </div>
  );
};
