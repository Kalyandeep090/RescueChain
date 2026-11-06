import React from 'react';
import { ShieldAlert, Users, Activity, MapPin } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const { alerts } = useAppContext();
  const activeAlerts = alerts.filter(a => a.status === 'active');
  const criticalAlerts = activeAlerts.filter(a => a.severity === 'critical');
  const totalIncidents = alerts.length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ 
        background: 'linear-gradient(135deg, var(--accent-primary), #991b1b)',
        color: 'white',
        padding: '3rem 2rem',
        borderRadius: '12px',
        boxShadow: 'var(--shadow-md)'
      }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', border: 'none' }}>RescueChain Command Center</h1>
        <p style={{ fontSize: '1.2rem', opacity: 0.9, maxWidth: '600px' }}>
          Real-time emergency coordination platform tailored for Indian mass gatherings.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
      <div className="card" style={{
  padding: '1.5rem',
  display: 'flex',
  alignItems: 'center',
  gap: '1.5rem'
}}>
  <div style={{
    background: 'rgba(22, 163, 74, 0.1)',
    padding: '1rem',
    borderRadius: '50%',
    color: 'var(--accent-success)'
  }}>
    <Users size={32} />
  </div>

  <div>
    <h3 style={{
      color: 'var(--text-secondary)',
      fontSize: '0.9rem',
      textTransform: 'uppercase'
    }}>
      Total Incidents
    </h3>

    <p style={{
      fontSize: '2rem',
      fontWeight: '700',
      color: 'var(--text-primary)'
    }}>
      {totalIncidents}
    </p>
  </div>
</div>
        <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ background: 'rgba(220, 38, 38, 0.1)', padding: '1rem', borderRadius: '50%', color: 'var(--accent-primary)' }}>
            <ShieldAlert size={32} />
          </div>
          <div>
            <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase' }}>Active Critical</h3>
            <p style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-primary)' }}>{criticalAlerts.length}</p>
          </div>
        </div>

        <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ background: 'rgba(37, 99, 235, 0.1)', padding: '1rem', borderRadius: '50%', color: 'var(--accent-secondary)' }}>
            <Activity size={32} />
          </div>
          <div>
            <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase' }}>Total Active</h3>
            <p style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-primary)' }}>{activeAlerts.length}</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <Link to="/map" style={{ textDecoration: 'none' }}>
          <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={20} /> Open Live Map
          </button>
        </Link>
        <Link to="/alerts/new" style={{ textDecoration: 'none' }}>
          <button className="btn-primary" style={{ background: 'var(--accent-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldAlert size={20} /> Report Incident
          </button>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
