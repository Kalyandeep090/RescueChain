import React from 'react';
import { useAppContext } from '../context/AppContext';
import { AlertTriangle, Clock, CheckCircle2, MapPin } from 'lucide-react';
import styles from './AlertsPage.module.css';

const AlertsPage = () => {
  const { alerts, updateAlertStatus } = useAppContext();

  // Sort alerts: critical first, then newest first
  const sortedAlerts = [...alerts].sort((a, b) => {
    const severityScore = { critical: 3, high: 2, medium: 1, low: 0 };
    if (severityScore[b.severity] !== severityScore[a.severity]) {
      return severityScore[b.severity] - severityScore[a.severity];
    }
    return new Date(b.timestamp) - new Date(a.timestamp);
  });

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'critical': return styles.critical;
      case 'high': return styles.high;
      case 'medium': return styles.medium;
      case 'low': return styles.low;
      default: return '';
    }
  };

  const getSeverityIcon = (severity) => {
    const color = 
      severity === 'critical' ? '#ef4444' : 
      severity === 'high' ? '#f59e0b' : 
      severity === 'medium' ? '#eab308' : '#3b82f6';
    return <AlertTriangle color={color} size={20} />;
  };

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Active Incident Feed</h1>
          <p className={styles.subtitle}>Real-time synchronization across all units</p>
        </div>
      </header>

      <div className={styles.alertsList}>
        {sortedAlerts.length === 0 ? (
          <div className={`${styles.emptyState} glass-panel`}>
            <CheckCircle2 size={48} color="var(--accent-success)" />
            <h2>All Clear</h2>
            <p>No active incidents reported at this time.</p>
          </div>
        ) : (
          sortedAlerts.map(alert => (
            <div 
              key={alert.id} 
              className={`${styles.alertCard} glass-panel ${alert.status === 'resolved' ? styles.resolved : ''}`}
            >
              <div className={`${styles.severityIndicator} ${getSeverityColor(alert.severity)}`}></div>
              
              <div className={styles.alertContent}>
                <div className={styles.alertHeader}>
                  <div className={styles.alertTitleGroup}>
                    {getSeverityIcon(alert.severity)}
                    <span className={styles.alertTitle}>{alert.title || 'Incident Report'}</span>
                    <span className={`${styles.badge} ${getSeverityColor(alert.severity)}`}>
                      {alert.severity.toUpperCase()}
                    </span>
                  </div>
                  <div className={styles.alertTime}>
                    <Clock size={14} />
                    {new Date(alert.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                </div>
                
                <p className={styles.alertDescription}>{alert.description}</p>
                
                <div className={styles.alertFooter}>
                  <div className={styles.alertMeta}>
                    <span className={styles.metaItem}>
                      <MapPin size={14} />
                      {alert.location[0].toFixed(4)}, {alert.location[1].toFixed(4)}
                    </span>
                    <span className={styles.metaItem}>
                      Reported by: <strong>{alert.reporterRole}</strong>
                    </span>
                  </div>
                  
                  {alert.status === 'active' ? (
                    <button 
                      className={styles.resolveBtn}
                      onClick={() => updateAlertStatus(alert.id, 'resolved')}
                    >
                      <CheckCircle2 size={16} /> Mark Resolved
                    </button>
                  ) : (
                    <span className={styles.resolvedText}>Resolved</span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AlertsPage;
