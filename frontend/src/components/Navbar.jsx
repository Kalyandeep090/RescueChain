import React from 'react';
import { Bell, Search, UserCircle, LogOut } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import styles from './Navbar.module.css';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { currentUser, alerts, signOutUser } = useAppContext();
  const activeAlerts = alerts.filter(a => a.status === 'active').length;

  return (
    <header className={styles.navbar}>
      <div className={styles.searchContainer}>
        <Search size={18} className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search incidents, units, or locations..."
          className={styles.searchInput}
        />
      </div>

      <div className={styles.rightSection}>
        <button className={styles.iconButton}>
          <Bell size={20} />
          {activeAlerts > 0 && <span className={styles.notificationBadge}>{activeAlerts}</span>}
        </button>

        <div className={styles.userProfile}>
          <div className={styles.userInfo}>
            <span className={styles.userName}>{currentUser?.name}</span>
            <span className={styles.userRole}>{currentUser?.role}</span>
          </div>
          <UserCircle size={32} className={styles.avatar} />
          <button className={styles.signOutButton} onClick={signOutUser} title="Sign Out">
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
