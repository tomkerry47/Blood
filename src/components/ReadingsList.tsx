import { useEffect, useState } from 'react';
import { supabase, type ReadingWithUser } from '../lib/supabase';
import { format } from 'date-fns';
import './ReadingsList.css';

export const ReadingsList = ({ refreshTrigger }: { refreshTrigger: number }) => {
  const [readings, setReadings] = useState<ReadingWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | string>('all');

  useEffect(() => {
    loadReadings();
  }, [refreshTrigger]);

  const loadReadings = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from('readings')
      .select(`
        *,
        users!inner (
          name,
          email
        )
      `)
      .order('recorded_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error loading readings:', error);
    } else {
      // Transform the data to match our ReadingWithUser type
      const transformedData = data?.map((reading: any) => ({
        ...reading,
        user_name: reading.users.name,
        user_email: reading.users.email,
      })) || [];
      
      setReadings(transformedData);
    }

    setLoading(false);
  };

  const filteredReadings = filter === 'all' 
    ? readings 
    : readings.filter(r => r.user_id === filter);

  const uniqueUsers = Array.from(new Set(readings.map(r => r.user_id))).map(userId => {
    const reading = readings.find(r => r.user_id === userId);
    return { id: userId, name: reading?.user_name || '' };
  });

  const getBPCategory = (systolic: number, diastolic: number) => {
    if (systolic < 120 && diastolic < 80) return { label: 'Normal', color: '#48bb78' };
    if (systolic < 130 && diastolic < 80) return { label: 'Elevated', color: '#ecc94b' };
    if (systolic < 140 || diastolic < 90) return { label: 'High BP (Stage 1)', color: '#ed8936' };
    if (systolic < 180 || diastolic < 120) return { label: 'High BP (Stage 2)', color: '#f56565' };
    return { label: 'Hypertensive Crisis', color: '#c53030' };
  };

  if (loading) {
    return (
      <div className="readings-card">
        <h2>📊 Reading History</h2>
        <div className="loading">Loading readings...</div>
      </div>
    );
  }

  return (
    <div className="readings-card">
      <div className="readings-header">
        <h2>📊 Reading History</h2>
        
        {uniqueUsers.length > 1 && (
          <div className="filter-buttons">
            <button 
              className={filter === 'all' ? 'active' : ''}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            {uniqueUsers.map(user => (
              <button
                key={user.id}
                className={filter === user.id ? 'active' : ''}
                onClick={() => setFilter(user.id)}
              >
                {user.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {filteredReadings.length === 0 ? (
        <div className="empty-state">
          <p>No readings yet. Add your first reading above!</p>
        </div>
      ) : (
        <div className="readings-list">
          {filteredReadings.map((reading) => {
            const category = getBPCategory(reading.systolic, reading.diastolic);
            
            return (
              <div key={reading.id} className="reading-item">
                <div className="reading-header-row">
                  <span className="reading-user">{reading.user_name}</span>
                  <span className="reading-date">
                    {format(new Date(reading.recorded_at), 'MMM d, yyyy h:mm a')}
                  </span>
                </div>
                
                <div className="reading-values">
                  <div className="bp-value">
                    <span className="value">{reading.systolic}/{reading.diastolic}</span>
                    <span className="label">mmHg</span>
                  </div>
                  
                  {reading.pulse && (
                    <div className="pulse-value">
                      <span className="value">{reading.pulse}</span>
                      <span className="label">bpm</span>
                    </div>
                  )}
                  
                  <div className="bp-category" style={{ backgroundColor: category.color }}>
                    {category.label}
                  </div>
                </div>
                
                {reading.notes && (
                  <div className="reading-notes">
                    <strong>Notes:</strong> {reading.notes}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
