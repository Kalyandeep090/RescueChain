
import React from 'react';
import { useAppContext } from '../context/AppContext';
import {
  CheckCircle2,
  AlertTriangle,
  Clock,
  MapPin
} from 'lucide-react';

const getAlertDate = (alert) => {
  const value = alert.timestamp || alert.createdAt || alert.updatedAt;

  if (!value) return null;

  // Supports Firestore Timestamp and ISO date strings
  if (typeof value.toDate === 'function') {
    return value.toDate();
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const getLocationText = (location) => {
  if (!location) return 'Location unavailable';

  if (Array.isArray(location)) {
    return location.map(value => Number(value).toFixed(4)).join(', ');
  }

  if (typeof location === 'object') {
    const lat = location.lat ?? location.latitude;
    const lng = location.lng ?? location.longitude;

    if (lat != null && lng != null) {
      return `${Number(lat).toFixed(4)}, ${Number(lng).toFixed(4)}`;
    }
  }

  return typeof location === 'string'
    ? location
    : 'Location unavailable';
};

const DashboardPage = () => {
  const { alerts, updateAlertStatus, currentUser } = useAppContext();

  const sortedAlerts = [...alerts].sort((a, b) => {
    const scores = { critical: 3, high: 2, medium: 1, low: 0 };

    const scoreA = scores[a.severity?.toLowerCase()] ?? 0;
    const scoreB = scores[b.severity?.toLowerCase()] ?? 0;

    if (scoreB !== scoreA) return scoreB - scoreA;

    return (getAlertDate(b)?.getTime() || 0) -
           (getAlertDate(a)?.getTime() || 0);
  });

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return '#dc2626';
      case 'high': return '#ea580c';
      case 'medium': return '#eab308';
      case 'low': return '#2563eb';
      default: return '#64748b';
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem'
    }}>
      <h1 style={{
        fontSize: '1.8rem',
        fontWeight: '700',
        color: 'var(--text-primary)'
      }}>
        Operations Dashboard
      </h1>

      {sortedAlerts.length === 0 ? (
        <div className="card" style={{
          padding: '4rem',
          textAlign: 'center',
          color: 'var(--text-secondary)'
        }}>
          <CheckCircle2
            size={48}
            color="var(--accent-success)"
            style={{ margin: '0 auto 1rem' }}
          />
          <h2>All Clear</h2>
          <p>No incidents have been reported yet.</p>
        </div>
      ) : (
        sortedAlerts.map(alert => {
          const date = getAlertDate(alert);
          const severityColor = getSeverityColor(alert.severity);

          return (
            <div
              key={alert.id}
              className="card"
              style={{
                display: 'flex',
                overflow: 'hidden',
                opacity: alert.status === 'resolved' ? 0.7 : 1
              }}
            >
              <div style={{
                width: '8px',
                flexShrink: 0,
                backgroundColor: severityColor
              }} />

              <div style={{
                padding: '1.5rem',
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '0.75rem'
                  }}>
                    <AlertTriangle color={severityColor} size={24} />

                    <h3 style={{
                      fontSize: '1.2rem',
                      fontWeight: '600'
                    }}>
                      {alert.title || 'Emergency Incident'}
                    </h3>

                    <span style={{
                      backgroundColor: severityColor,
                      color: 'white',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: '700'
                    }}>
                      {(alert.severity || 'UNKNOWN').toUpperCase()}
                    </span>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: 'var(--text-secondary)',
                    fontSize: '0.85rem'
                  }}>
                    <Clock size={14} />
                    {date ? date.toLocaleString() : 'Date unavailable'}
                  </div>
                </div>

                <p style={{
                  color: 'var(--text-secondary)',
                  lineHeight: '1.5'
                }}>
                  {alert.description || 'No description available.'}
                </p>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  paddingTop: '1rem',
                  borderTop: '1px solid var(--border-color)'
                }}>
                  <div style={{
                    fontSize: '0.85rem',
                    color: 'var(--text-secondary)'
                  }}>
                    <p>Reported by: {alert.reporterRole || 'Volunteer'}</p>
                    <p>
                      <MapPin size={13} style={{
                        display: 'inline',
                        verticalAlign: 'middle'
                      }} />{' '}
                      {getLocationText(alert.location)}
                    </p>
                    {alert.reporterEmail && (
                      <p>Reporter: {alert.reporterEmail}</p>
                    )}
                  </div>

                  {alert.status === 'active' ? (
                    currentUser?.role === 'Admin' ? (
                      <button
                        onClick={() => updateAlertStatus(alert.id, 'resolved')}
                        style={{
                          backgroundColor: 'rgba(22,163,74,0.1)',
                          color: 'var(--accent-success)',
                          border: '1px solid rgba(22,163,74,0.2)',
                          padding: '0.5rem 1rem',
                          borderRadius: '6px',
                          fontWeight: '600',
                          cursor: 'pointer'
                        }}
                      >
                        <CheckCircle2
                          size={16}
                          style={{
                            display: 'inline',
                            verticalAlign: 'middle'
                          }}
                        /> Mark Resolved
                      </button>
                    ) : (
                      <span style={{
                        color: 'var(--accent-warning)',
                        fontWeight: '600'
                      }}>
                        Waiting for Response
                      </span>
                    )
                  ) : (
                    <span style={{
                      color: 'var(--accent-success)',
                      fontWeight: '600'
                    }}>
                      <CheckCircle2
                        size={16}
                        style={{
                          display: 'inline',
                          verticalAlign: 'middle'
                        }}
                      /> Resolved
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default DashboardPage;
