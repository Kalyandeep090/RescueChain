import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  ShieldAlert, Home, LayoutDashboard, Map as MapIcon, 
  Siren, Users, BarChart3, Settings, LogOut 
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import styles from './Sidebar.module.css';

const Sidebar = () => {
  const { currentUser, alerts, signOutUser } = useAppContext();
  
  const activeAlertsCount = alerts.filter(a => a.status === 'active').length;

  return (
    <div className={styles.sidebar}>
      <div className={styles.logo}>
        <ShieldAlert size={28} className={styles.logoIcon} />
        <h2>RescueChain</h2>
      </div>

      <nav className={styles.nav}>
        <div className={styles.navSection}>
          <span className={styles.sectionTitle}>Overview</span>
          <NavLink to="/" className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem} end>
            <Home size={20} />
            <span>Home</span>
          </NavLink>
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>
        </div>

        <div className={styles.navSection}>
          <span className={styles.sectionTitle}>Operations</span>
          <NavLink to="/map" className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}>
            <MapIcon size={20} />
            <span>Live Map</span>
          </NavLink>
          <NavLink to="/alerts/new" className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}>
            <Siren size={20} />
            <span>Create Alert</span>
          </NavLink>
          {currentUser?.role === 'Admin' && (
            <NavLink to="/responses" className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}>
              <Users size={20} />
              <span>Response Teams</span>
            </NavLink>
          )}
        </div>

        {currentUser?.role === 'Admin' && (
          <div className={styles.navSection}>
            <span className={styles.sectionTitle}>Management</span>
            <NavLink to="/reports" className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}>
              <BarChart3 size={20} />
              <span>Reports</span>
            </NavLink>
            <NavLink to="/admin" className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}>
              <Settings size={20} />
              <span>Control Panel</span>
            </NavLink>
          </div>
        )}
      </nav>

      <div className={styles.bottomNav}>
        <button className={styles.navItem} onClick={signOutUser}>
          <LogOut size={20} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
