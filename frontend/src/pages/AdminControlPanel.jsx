import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Settings, User, Shield, Key, Bell, Database, LogOut } from 'lucide-react';

const AdminControlPanel = () => {
  const { currentUser, signOutUser } = useAppContext();

  return (
    <div style={{ padding: '2rem' }}>
      <header style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Settings size={32} color="#64748b" />
          System Control Panel
        </h1>
        <p style={{ color: '#64748b' }}>Manage system configurations, user permissions, and security protocols.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {[
            { icon: User, label: 'Account Profile', active: true },
            { icon: Shield, label: 'Security & Auth' },
            { icon: Bell, label: 'Notification Settings' },
            { icon: Database, label: 'System Logs' },
            { icon: Key, label: 'API Access' },
          ].map((item, i) => (
            <button key={i} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.75rem', 
              padding: '1rem', 
              borderRadius: '8px',
              border: 'none',
              background: item.active ? '#f1f5f9' : 'transparent',
              color: item.active ? '#1e293b' : '#64748b',
              fontWeight: item.active ? '600' : '500',
              cursor: 'pointer',
              textAlign: 'left'
            }}>
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
          <hr style={{ margin: '1rem 0', border: 'none', borderTop: '1px solid #e2e8f0' }} />
          <button 
            onClick={signOutUser}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.75rem', 
              padding: '1rem', 
              borderRadius: '8px',
              border: 'none',
              background: 'transparent',
              color: '#ef4444',
              fontWeight: '600',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </aside>

        <main style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2.5rem', paddingBottom: '2.5rem', borderBottom: '1px solid #f1f5f9' }}>
            <div style={{ width: '80px', height: '80px', background: '#3b82f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '2rem', fontWeight: '700' }}>
              {currentUser?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 style={{ margin: '0 0 0.25rem 0', fontSize: '1.5rem' }}>{currentUser?.name}</h2>
              <p style={{ margin: 0, color: '#64748b' }}>System Administrator • {currentUser?.email || 'admin@rescuechain.io'}</p>
            </div>
          </div>

          <section>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1.5rem' }}>Personal Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#64748b', marginBottom: '0.5rem' }}>Full Name</label>
                <input type="text" defaultValue={currentUser?.name} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#64748b', marginBottom: '0.5rem' }}>Role</label>
                <input type="text" defaultValue="Administrator" disabled style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc' }} />
              </div>
            </div>
          </section>

          <section style={{ marginTop: '2.5rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1.5rem' }}>Security Settings</h3>
            <div style={{ padding: '1.25rem', borderRadius: '12px', background: '#fff7ed', border: '1px solid #ffedd5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ margin: '0 0 0.25rem 0', color: '#9a3412' }}>Two-Factor Authentication</h4>
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#c2410c' }}>Add an extra layer of security to your admin account.</p>
              </div>
              <button style={{ padding: '0.5rem 1rem', background: '#9a3412', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>
                Enable
              </button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default AdminControlPanel;
