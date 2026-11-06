import React from 'react';
import { useAppContext } from '../context/AppContext';
import { BarChart3, FileText, Download, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';

const ReportsPage = () => {
  const { alerts } = useAppContext();
  
  const stats = {
    total: alerts.length,
    active: alerts.filter(a => a.status === 'active').length,
    resolved: alerts.filter(a => a.status === 'resolved').length,
    inProgress: alerts.filter(a => a.status === 'in_progress').length,
  };

  const severityData = alerts.reduce((acc, cur) => {
    const sev = cur.severity || 'unknown';
    acc[sev] = (acc[sev] || 0) + 1;
    return acc;
  }, {});

  return (
    <div style={{ padding: '2rem' }}>
      <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <BarChart3 size={32} color="#8b5cf6" />
            Incident Analytics & Reports
          </h1>
          <p style={{ color: '#64748b' }}>Comprehensive overview of system performance and incident response metrics.</p>
        </div>
        <button style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem', 
          padding: '0.75rem 1.25rem', 
          background: 'white', 
          border: '1px solid #e2e8f0', 
          borderRadius: '8px', 
          fontWeight: '600',
          cursor: 'pointer'
        }}>
          <Download size={18} /> Export Data
        </button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
        {[
          { label: 'Total Incidents', value: stats.total, icon: FileText, color: '#3b82f6' },
          { label: 'Active Alerts', value: stats.active, icon: AlertTriangle, color: '#ef4444' },
          { label: 'In Progress', value: stats.inProgress, icon: TrendingUp, color: '#f59e0b' },
          { label: 'Resolved', value: stats.resolved, icon: CheckCircle2, color: '#10b981' },
        ].map((card, i) => (
          <div key={i} style={{ background: 'white', padding: '1.5rem', borderRadius: '16px', boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{ color: '#64748b', fontWeight: '500' }}>{card.label}</span>
              <card.icon size={20} color={card.color} />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#1e293b' }}>{card.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.125rem', fontWeight: '600' }}>Incident Log Summary</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid #f1f5f9' }}>
                <th style={{ padding: '1rem 0.5rem', color: '#64748b', fontWeight: '500' }}>Date</th>
                <th style={{ padding: '1rem 0.5rem', color: '#64748b', fontWeight: '500' }}>Incident</th>
                <th style={{ padding: '1rem 0.5rem', color: '#64748b', fontWeight: '500' }}>Severity</th>
                <th style={{ padding: '1rem 0.5rem', color: '#64748b', fontWeight: '500' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {alerts.slice(0, 10).map((alert) => (
                <tr key={alert.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                  <td style={{ padding: '1rem 0.5rem', fontSize: '0.875rem' }}>{new Date(alert.timestamp).toLocaleDateString()}</td>
                  <td style={{ padding: '1rem 0.5rem', fontWeight: '500' }}>{alert.title}</td>
                  <td style={{ padding: '1rem 0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: '600', textTransform: 'capitalize' }}>{alert.severity}</span>
                  </td>
                  <td style={{ padding: '1rem 0.5rem' }}>
                    <span style={{ 
                      fontSize: '0.75rem', 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '4px',
                      background: alert.status === 'resolved' ? '#dcfce7' : '#fee2e2',
                      color: alert.status === 'resolved' ? '#166534' : '#991b1b'
                    }}>
                      {alert.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.125rem', fontWeight: '600' }}>Severity Distribution</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {Object.entries(severityData).map(([sev, count]) => (
              <div key={sev}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                  <span style={{ textTransform: 'capitalize' }}>{sev}</span>
                  <span style={{ fontWeight: '600' }}>{count}</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ 
                    width: `${(count / stats.total) * 100}%`, 
                    height: '100%', 
                    background: sev === 'critical' ? '#ef4444' : sev === 'high' ? '#f97316' : '#3b82f6' 
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
