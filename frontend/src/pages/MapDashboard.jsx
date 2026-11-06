import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useAppContext } from '../context/AppContext';
import styles from './MapDashboard.module.css';
import { AlertTriangle, Plus, Crosshair } from 'lucide-react';

// Fix for default marker icon in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons based on severity
const createCustomIcon = (color) => {
  return new L.DivIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px ${color};"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
};

const icons = {
  critical: createCustomIcon('#ef4444'), // Red
  high: createCustomIcon('#f59e0b'), // Orange
  medium: createCustomIcon('#eab308'), // Yellow
  low: createCustomIcon('#3b82f6'), // Blue
};

// Component to handle map clicks for new alerts
const MapClickHandler = ({ onMapClick }) => {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng);
    },
  });
  return null;
};

const MapDashboard = () => {
  const { alerts, createAlert } = useAppContext();
  const [showNewAlertModal, setShowNewAlertModal] = useState(false);
  const [newAlertLocation, setNewAlertLocation] = useState(null);
  const [alertDescription, setAlertDescription] = useState('');

  // Default center (e.g., a city center or stadium location)
  const defaultCenter = [40.7128, -74.0060]; // NYC as placeholder

  const handleMapClick = (latlng) => {
    setNewAlertLocation([latlng.lat, latlng.lng]);
    setShowNewAlertModal(true);
  };

  const handleSubmitAlert = (e) => {
    e.preventDefault();
    if (!alertDescription.trim() || !newAlertLocation) return;

    createAlert({
      location: newAlertLocation,
      description: alertDescription,
      title: 'Field Report',
    });

    setShowNewAlertModal(false);
    setAlertDescription('');
    setNewAlertLocation(null);
  };

  const activeAlerts = alerts.filter(a => a.status === 'active');

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Live Coordination Map</h1>
          <p className={styles.subtitle}>Real-time situational awareness and unit tracking</p>
        </div>
        <div className={styles.headerStats}>
          <div className={`${styles.statCard} glass-panel`}>
            <span className={styles.statLabel}>Active Alerts</span>
            <span className={styles.statValue}>{activeAlerts.length}</span>
          </div>
        </div>
      </header>

      <div className={`${styles.mapWrapper} glass-panel`}>
        <MapContainer 
          center={defaultCenter} 
          zoom={14} 
          style={{ height: '100%', width: '100%', borderRadius: '11px', zIndex: 1 }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" // Dark theme map
          />
          <MapClickHandler onMapClick={handleMapClick} />
          
          {activeAlerts.map(alert => (
            <Marker 
              key={alert.id} 
              position={alert.location}
              icon={icons[alert.severity] || icons.low}
            >
              <Popup className="custom-popup">
                <div className={styles.popupContent}>
                  <div className={styles.popupHeader}>
                    <AlertTriangle size={16} color={
                      alert.severity === 'critical' ? '#ef4444' : 
                      alert.severity === 'high' ? '#f59e0b' : '#3b82f6'
                    } />
                    <strong>{alert.severity.toUpperCase()} PRIORITY</strong>
                  </div>
                  <p className={styles.popupDesc}>{alert.description}</p>
                  <div className={styles.popupFooter}>
                    <small>{new Date(alert.timestamp).toLocaleTimeString()}</small>
                    <small>Rep: {alert.reporterRole}</small>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
        
        <div className={styles.mapOverlayTopRight}>
          <div className={styles.instructions}>
            <Crosshair size={16} />
            <span>Click anywhere on the map to drop an incident pin</span>
          </div>
        </div>
      </div>

      {showNewAlertModal && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.modal} glass-panel`}>
            <h3 className={styles.modalTitle}>Report New Incident</h3>
            <p className={styles.modalSubtitle}>
              Location: {newAlertLocation[0].toFixed(4)}, {newAlertLocation[1].toFixed(4)}
            </p>
            
            <form onSubmit={handleSubmitAlert}>
              <textarea
                className={styles.textarea}
                placeholder="Describe the incident (e.g., Medical emergency at Gate 3, fire, crowd surge...)"
                value={alertDescription}
                onChange={(e) => setAlertDescription(e.target.value)}
                autoFocus
              />
              
              <div className={styles.modalActions}>
                <button 
                  type="button" 
                  className={styles.btnCancel}
                  onClick={() => setShowNewAlertModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className={styles.btnSubmit}
                  disabled={!alertDescription.trim()}
                >
                  <Plus size={16} /> Broadcast Alert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapDashboard;
