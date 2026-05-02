import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addLog } from '../api';

function LogData() {
  const [formData, setFormData] = useState({
    weight: '',
    calories_intake: '',
    steps: '',
    sleep_hours: '',
    water_intake: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {};
      Object.keys(formData).forEach(key => {
        if (formData[key] !== '') {
          payload[key] = Number(formData[key]);
        }
      });
      await addLog(payload);
      navigate('/');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-content">
      <div className="glass-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h2>Log Daily Data</h2>
        <p>Keep track of your daily health metrics to get AI insights.</p>
        
        <form onSubmit={handleSubmit} style={{ marginTop: '2rem' }}>
          <div className="form-group">
            <label className="form-label">Weight (kg)</label>
            <input 
              type="number" 
              step="0.1"
              name="weight"
              className="form-input" 
              value={formData.weight} 
              onChange={handleChange} 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Calories Intake (kcal)</label>
            <input 
              type="number" 
              name="calories_intake"
              className="form-input" 
              value={formData.calories_intake} 
              onChange={handleChange} 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Steps Count</label>
            <input 
              type="number" 
              name="steps"
              className="form-input" 
              value={formData.steps} 
              onChange={handleChange} 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Sleep (hours)</label>
            <input 
              type="number" 
              step="0.1"
              name="sleep_hours"
              className="form-input" 
              value={formData.sleep_hours} 
              onChange={handleChange} 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Water Intake (liters)</label>
            <input 
              type="number" 
              step="0.1"
              name="water_intake"
              className="form-input" 
              value={formData.water_intake} 
              onChange={handleChange} 
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Saving...' : 'Save Log'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LogData;
