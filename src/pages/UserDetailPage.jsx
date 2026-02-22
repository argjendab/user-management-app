import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { deleteUser } from '../store/usersSlice';
import styles from './UserDetailPage.module.css';

const InfoRow = ({ label, value }) => (
  <div className={styles.infoRow}>
    <span className={styles.infoLabel}>{label}</span>
    <span className={styles.infoValue}>{value || '—'}</span>
  </div>
);

export default function UserDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(s => s.users.list.find(u => String(u.id) === id));

  if (!user) return (
    <div className={styles.notFound}>
      <p>USER NOT FOUND</p>
      <Link to="/" className={styles.backLink}>← BACK TO DIRECTORY</Link>
    </div>
  );

  const handleDelete = () => {
    if (window.confirm(`Delete ${user.name}?`)) {
      dispatch(deleteUser(user.id));
      navigate('/');
    }
  };

  const addressStr = user.address
    ? `${user.address.street}, ${user.address.suite}, ${user.address.city} ${user.address.zipcode}`
    : '—';

  return (
    <div className={styles.page}>
      <div className={styles.breadcrumb}>
        <Link to="/" className={styles.backLink}>← DIRECTORY</Link>
        <span className={styles.sep}>/</span>
        <span>{user.name}</span>
      </div>

      <div className={styles.heroCard}>
        <div className={styles.heroLeft}>
          <div className={styles.bigAvatar}>{user.name.charAt(0)}</div>
          <div>
            <h1 className={styles.name}>{user.name}</h1>
            <div className={styles.username}>@{user.username}</div>
            <a href={`mailto:${user.email}`} className={styles.emailLink}>{user.email}</a>
          </div>
        </div>
        <div className={styles.heroActions}>
          <button className={styles.editBtn} onClick={() => navigate(`/edit/${user.id}`)}>
            EDIT USER
          </button>
          <button className={styles.deleteBtn} onClick={handleDelete}>
            DELETE
          </button>
        </div>
      </div>

      <div className={styles.grid}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>CONTACT</h2>
          <InfoRow label="PHONE" value={user.phone} />
          <InfoRow label="EMAIL" value={user.email} />
          <InfoRow label="WEBSITE" value={
            user.website ? (
              <a href={`https://${user.website}`} target="_blank" rel="noopener noreferrer" className={styles.link}>
                {user.website} ↗
              </a>
            ) : null
          } />
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>ADDRESS</h2>
          <InfoRow label="STREET" value={user.address?.street} />
          <InfoRow label="SUITE" value={user.address?.suite} />
          <InfoRow label="CITY" value={user.address?.city} />
          <InfoRow label="ZIPCODE" value={user.address?.zipcode} />
          {user.address?.geo && (
            <InfoRow label="GEO" value={`${user.address.geo.lat}, ${user.address.geo.lng}`} />
          )}
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>COMPANY</h2>
          <InfoRow label="NAME" value={user.company?.name} />
          <InfoRow label="CATCHPHRASE" value={user.company?.catchPhrase} />
          <InfoRow label="BUSINESS" value={user.company?.bs} />
        </section>
      </div>
    </div>
  );
}
