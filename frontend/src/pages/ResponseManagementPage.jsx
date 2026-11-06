import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Users, CheckCircle, Clock, MapPin, Shield } from 'lucide-react';
import styles from './MapDashboard.module.css'; // Reusing some shared styles or I can create new ones

const ResponseManagementPage = () => {
  const { alerts, updateAlertStatus } = useAppContext();

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateAlertStatus(id, status);
    } catch (err) {
      console.error('Update failed', err);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return '#ef4444';
      case 'high': return '#f97316';
      case 'medium': return '#eab308';
      case 'low': return '#3b82f6';
      default: return '#64748b';
    }
  };

  const getLocationText = (location) => {
    if (!location) return 'Location unavailable';
  
    // Handle location stored as an array: [latitude, longitude]
    if (Array.isArray(location)) {
      const [lat, lng] = location;
  
      if (lat == null || lng == null) {
        return 'Location unavailable';
      }
  
      if (Number(lat) === 0 && Number(lng) === 0) {
        return 'Location not recorded';
      }
  
      return `${Number(lat).toFixed(5)}, ${Number(lng).toFixed(5)}`;
    }
  
    // Handle location stored as an object
    if (typeof location === 'object') {
      const lat = location.lat ?? location.latitude;
      const lng = location.lng ?? location.longitude;
  
      if (lat == null || lng == null) {
        return 'Location unavailable';
      }
  
      if (Number(lat) === 0 && Number(lng) === 0) {
        return 'Location not recorded';
      }
  
      return `${Number(lat).toFixed(5)}, ${Number(lng).toFixed(5)}`;
    }
  
    return typeof location === 'string'
      ? location
      : 'Location unavailable';
  };
  
  const getAlertTime = (alert) => {
    const value = alert.timestamp || alert.createdAt || alert.updatedAt;
  
    if (!value) return 'Time unavailable';
  
    const date = value?.toDate
      ? value.toDate()
      : new Date(value);
  
    return isNaN(date.getTime())
      ? 'Time unavailable'
      : date.toLocaleString();
  };

  return (
    <div style={{ padding: '2rem' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Users size={32} color="#3b82f6" />
          Response Management
        </h1>
        <p style={{ color: '#64748b' }}>Monitor and coordinate active emergency responses across all units.</p>
      </header>

      <div style={{ display: 'grid', gap: '1.5rem' }}>
      {alerts.filter(alert => ['active', 'in_progress'].includes(alert.status)).length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', background: 'white', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
            <p style={{ color: '#94a3b8' }}>No active incidents requiring response.</p>
          </div>
        ) : (
          alerts
          .filter(alert => ['active', 'in_progress'].includes(alert.status))
          .map((alert) => (
            <div key={alert.id} style={{ 
              background: 'white', 
              borderRadius: '12px', 
              padding: '1.5rem', 
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              borderLeft: `6px solid ${getSeverityColor(alert.severity)}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '600' }}>
  {alert.title || alert.type || 'Emergency Incident'}
</h3>
                  <span style={{ 
                    padding: '0.25rem 0.75rem', 
                    borderRadius: '9999px', 
                    fontSize: '0.75rem', 
                    fontWeight: '600',
                    background: `${getSeverityColor(alert.severity)}20`,
                    color: getSeverityColor(alert.severity),
                    textTransform: 'uppercase'
                  }}>
                    {alert.severity}
                  </span>
                </div>
                <p style={{ margin: '0 0 1rem 0', color: '#475569' }}>
  {alert.description || 'No additional description provided.'}
</p>
<div style={{
  display: 'flex',
  flexWrap: 'wrap',
  gap: '1.5rem',
  fontSize: '0.875rem',
  color: '#64748b'
}}>
  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
    <MapPin size={14} />
    {getLocationText(alert.location)}
  </span>

  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
    <Clock size={14} />
    {getAlertTime(alert)}
  </span>

  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
    <Shield size={14} />
    {alert.status || 'Unknown status'}
  </span>
</div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                {alert.status === 'active' && (
                  <button 
                    onClick={() => handleStatusUpdate(alert.id, 'in_progress')}
                    style={{ 
                      padding: '0.625rem 1.25rem', 
                      background: '#3b82f6', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '8px', 
                      fontWeight: '600', 
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <Clock size={18} /> Assign Units
                  </button>
                )}
                {alert.status === 'in_progress' && (
                  <button 
                    onClick={() => handleStatusUpdate(alert.id, 'resolved')}
                    style={{ 
                      padding: '0.625rem 1.25rem', 
                      background: '#10b981', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '8px', 
                      fontWeight: '600', 
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <CheckCircle size={18} /> Mark Resolved
                  </button>
                )}
                {alert.status === 'resolved' && (
                  <span style={{ color: '#10b981', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <CheckCircle size={20} /> Resolved
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ResponseManagementPage;
