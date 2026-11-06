import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useAppContext } from '../context/AppContext';
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
    html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px ${color};"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

const icons = {
  critical: createCustomIcon('#dc2626'), // Red
  high: createCustomIcon('#ea580c'), // Orange
  medium: createCustomIcon('#eab308'), // Yellow
  low: createCustomIcon('#2563eb'), // Blue
};

const MapClickHandler = ({ onMapClick }) => {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng);
    },
  });
  return null;
};

const LiveMapPage = () => {
  const { alerts, createAlert } = useAppContext();
  const [showNewAlertModal, setShowNewAlertModal] = useState(false);
  const [newAlertLocation, setNewAlertLocation] = useState(null);
  const [alertDescription, setAlertDescription] = useState('');
  const [alertTitle, setAlertTitle] = useState('');

  // Default center: Hyderabad, India
  const defaultCenter = [17.3850, 78.4867]; 

  const handleMapClick = (latlng) => {
    setNewAlertLocation([latlng.lat, latlng.lng]);
    setShowNewAlertModal(true);
  };

  const handleSubmitAlert = (e) => {
    e.preventDefault();
    if (!alertDescription.trim() || !newAlertLocation) return;

    createAlert({
      title: alertTitle || 'Field Incident',
      location: newAlertLocation,
      description: alertDescription,
      status: 'active',
      severity: 'medium'
    });

    setShowNewAlertModal(false);
    setAlertDescription('');
    setAlertTitle('');
    setNewAlertLocation(null);
  };

  const activeAlerts = alerts.filter(a => a.status === 'active' && Array.isArray(a.location));

  return (
    <div style={{ height: 'calc(100vh - 120px)', position: 'relative', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-md)' }}>
      <MapContainer 
        center={defaultCenter} 
        zoom={13} 
        style={{ height: '100%', width: '100%', zIndex: 1 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" // Standard light theme map
        />
        <MapClickHandler onMapClick={handleMapClick} />
        
        {activeAlerts.map(alert => (
          <Marker 
            key={alert.id} 
            position={alert.location}
            icon={icons[alert.severity] || icons.low}
          >
            <Popup>
              <div style={{ minWidth: '200px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #eee', paddingBottom: '8px', marginBottom: '8px' }}>
                  <AlertTriangle size={16} color={
                    alert.severity === 'critical' ? '#dc2626' : 
                    alert.severity === 'high' ? '#ea580c' : '#2563eb'
                  } />
                  <strong style={{ color: '#0f172a' }}>{alert.severity.toUpperCase()} ALERT</strong>
                </div>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#0f172a' }}>{alert.title}</h4>
                <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: '#64748b' }}>{alert.description}</p>
                <div style={{ fontSize: '11px', color: '#94a3b8', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Rep: {alert.reporterRole}</span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 1000, background: 'white', padding: '10px 15px', borderRadius: '8px', boxShadow: 'var(--shadow-md)', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', fontWeight: '500' }}>
        <Crosshair size={18} color="var(--accent-primary)" />
        Click anywhere on map to report incident
      </div>

      {showNewAlertModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card" style={{ width: '100%', maxWidth: '450px', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Report New Incident</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Coordinates: {newAlertLocation[0].toFixed(4)}, {newAlertLocation[1].toFixed(4)}
            </p>
            
            <form onSubmit={handleSubmitAlert} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input 
                type="text"
                placeholder="Short Title (e.g., Gate Stampede)"
                value={alertTitle}
                onChange={(e) => setAlertTitle(e.target.value)}
                style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '1rem' }}
                required
              />
              <textarea
                placeholder="Describe the incident details and required response..."
                value={alertDescription}
                onChange={(e) => setAlertDescription(e.target.value)}
                style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '1rem', minHeight: '100px', resize: 'vertical' }}
                required
              />
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                <button 
                  type="button" 
                  onClick={() => setShowNewAlertModal(false)}
                  style={{ background: 'transparent', border: '1px solid var(--border-color)', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
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

export default LiveMapPage;
