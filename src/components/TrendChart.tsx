import { useEffect, useState } from 'react';
import { supabase, type Reading } from '../lib/supabase';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import './TrendChart.css';

export const TrendChart = ({ refreshTrigger }: { refreshTrigger: number }) => {
  const [readings, setReadings] = useState<Reading[]>([]);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(7);

  useEffect(() => {
    loadReadings();
  }, [refreshTrigger, days]);

  const loadReadings = async () => {
    setLoading(true);

    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - days);

    const { data, error } = await supabase
      .from('readings')
      .select('*')
      .gte('recorded_at', daysAgo.toISOString())
      .order('recorded_at', { ascending: true });

    if (error) {
      console.error('Error loading readings:', error);
    } else {
      setReadings(data || []);
    }

    setLoading(false);
  };

  const chartData = readings.map(reading => ({
    date: format(new Date(reading.recorded_at), 'MMM d'),
    time: format(new Date(reading.recorded_at), 'h:mm a'),
    systolic: reading.systolic,
    diastolic: reading.diastolic,
    pulse: reading.pulse,
  }));

  if (loading) {
    return (
      <div className="chart-card">
        <h2>📈 Trends</h2>
        <div className="loading">Loading chart...</div>
      </div>
    );
  }

  if (readings.length === 0) {
    return (
      <div className="chart-card">
        <h2>📈 Trends</h2>
        <div className="empty-state">
          <p>Not enough data to show trends yet. Add more readings!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chart-card">
      <div className="chart-header">
        <h2>📈 Trends</h2>
        <div className="time-filter">
          <button 
            className={days === 7 ? 'active' : ''}
            onClick={() => setDays(7)}
          >
            7 Days
          </button>
          <button 
            className={days === 14 ? 'active' : ''}
            onClick={() => setDays(14)}
          >
            14 Days
          </button>
          <button 
            className={days === 30 ? 'active' : ''}
            onClick={() => setDays(30)}
          >
            30 Days
          </button>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis 
            dataKey="date" 
            stroke="#718096"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#718096"
            style={{ fontSize: '12px' }}
            domain={[40, 180]}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'white',
              border: '2px solid #e2e8f0',
              borderRadius: '8px',
              padding: '12px'
            }}
            labelFormatter={(label) => label}
          />
          <Legend 
            wrapperStyle={{ fontSize: '14px' }}
          />
          <Line 
            type="monotone" 
            dataKey="systolic" 
            stroke="#f56565" 
            strokeWidth={2}
            dot={{ fill: '#f56565', r: 4 }}
            name="Systolic"
          />
          <Line 
            type="monotone" 
            dataKey="diastolic" 
            stroke="#4299e1" 
            strokeWidth={2}
            dot={{ fill: '#4299e1', r: 4 }}
            name="Diastolic"
          />
          {chartData.some(d => d.pulse) && (
            <Line 
              type="monotone" 
              dataKey="pulse" 
              stroke="#48bb78" 
              strokeWidth={2}
              dot={{ fill: '#48bb78', r: 4 }}
              name="Pulse"
            />
          )}
        </LineChart>
      </ResponsiveContainer>

      <div className="chart-legend-custom">
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: '#f56565' }}></span>
          <span>Systolic (top number)</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: '#4299e1' }}></span>
          <span>Diastolic (bottom number)</span>
        </div>
        {chartData.some(d => d.pulse) && (
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#48bb78' }}></span>
            <span>Pulse (heart rate)</span>
          </div>
        )}
      </div>
    </div>
  );
};
