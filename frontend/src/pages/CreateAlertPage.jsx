import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { AlertCircle, MapPin, Type, AlignLeft, Send } from 'lucide-react';
import styles from './CreateAlertPage.module.css';

const CreateAlertPage = () => {
  const { createAlert } = useAppContext();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    severity: 'medium',
    type: 'Emergency'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Attempt to parse coordinates if the string looks like "lat, lng"
    let locationValue = formData.location;
    const coordRegex = /^(-?\d+(\.\d+)?),\s*(-?\d+(\.\d+)?)$/;
    const match = formData.location.trim().match(coordRegex);
    if (match) {
      locationValue = [parseFloat(match[1]), parseFloat(match[3])];
    }

    try {
      await createAlert({ 
        ...formData, 
        location: locationValue,
        timestamp: Date.now(),
        status: 'active'
      });
      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to submit alert', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <AlertCircle className={styles.icon} size={32} />
          <h1>Create New Emergency Alert</h1>
        </div>
        <p className={styles.subtitle}>Broadcast an emergency alert to all units and response teams immediately.</p>
      </header>

      <form onSubmit={handleSubmit} className={styles.formCard}>
        <div className={styles.formGrid}>
          <div className={styles.inputGroup}>
            <label><Type size={16} /> Alert Title</label>
            <input 
              name="title"
              placeholder="e.g. Fire - 5th Avenue" 
              value={formData.title} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className={styles.inputGroup}>
            <label><MapPin size={16} /> Location</label>
            <input 
              name="location"
              placeholder="Address or coordinates" 
              value={formData.location} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label>Severity Level</label>
              <select name="severity" value={formData.severity} onChange={handleChange}>
                <option value="low">Low - Routine</option>
                <option value="medium">Medium - Urgent</option>
                <option value="high">High - Immediate Threat</option>
                <option value="critical">Critical - Catastrophic</option>
              </select>
            </div>

            <div className={styles.inputGroup}>
              <label>Incident Type</label>
              <select name="type" value={formData.type} onChange={handleChange}>
                <option value="Emergency">General Emergency</option>
                <option value="Fire">Fire Department</option>
                <option value="Medical">Medical / Ambulance</option>
                <option value="Police">Police / Security</option>
                <option value="Disaster">Natural Disaster</option>
              </select>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label><AlignLeft size={16} /> Situation Description</label>
            <textarea 
              name="description"
              placeholder="Provide detailed information about the incident..." 
              value={formData.description} 
              onChange={handleChange} 
              required 
            />
          </div>
        </div>

        <div className={styles.actions}>
          <button type="button" className={styles.cancelBtn} onClick={() => navigate(-1)}>
            Cancel
          </button>
          <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
            {isSubmitting ? 'Dispatching...' : <><Send size={18} /> Broadcast Alert</>}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateAlertPage;
