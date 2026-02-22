import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Layout.module.css';

export default function Layout({ children }) {
  const location = useLocation();
  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link to="/" className={styles.logo}>
            <span className={styles.logoMark}>▸</span>
            <span>USER_MGMT</span>
          </Link>
          <nav className={styles.nav}>
            <Link to="/" className={`${styles.navLink} ${location.pathname === '/' ? styles.active : ''}`}>
              /users
            </Link>
            <Link to="/add" className={`${styles.navLink} ${location.pathname === '/add' ? styles.active : ''}`}>
              /add_user
            </Link>
          </nav>
          <div className={styles.statusBar}>
            <span className={styles.statusDot}></span>
            <span>SYSTEM ONLINE</span>
          </div>
        </div>
      </header>
      <main className={styles.main}>{children}</main>
      <footer className={styles.footer}>
        <span>USER MANAGEMENT SYSTEM v1.0.0</span>
        <span>DATA: jsonplaceholder.typicode.com</span>
      </footer>
    </div>
  );
}
