import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { deleteUser, setSort, setSearch, selectFilteredSortedUsers } from '../store/usersSlice';
import styles from './UsersPage.module.css';

const SortIcon = ({ field, currentField, direction }) => {
  if (currentField !== field) return <span className={styles.sortIdle}>⇅</span>;
  return <span className={styles.sortActive}>{direction === 'asc' ? '↑' : '↓'}</span>;
};

export default function UsersPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const users = useSelector(selectFilteredSortedUsers);
  const { status, searchQuery, sortField, sortDirection } = useSelector(s => s.users);

  const handleDelete = (e, id) => {
    e.stopPropagation();
    if (window.confirm('Delete this user?')) dispatch(deleteUser(id));
  };

  const handleSort = (field) => dispatch(setSort(field));

  if (status === 'loading') return (
    <div className={styles.loading}>
      <div className={styles.loadingDots}>
        <span></span><span></span><span></span>
      </div>
      <p>FETCHING USER DATA...</p>
    </div>
  );

  if (status === 'failed') return (
    <div className={styles.error}>⚠ FAILED TO FETCH USERS</div>
  );

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>USER DIRECTORY</h1>
          <p className={styles.subtitle}>{users.length} RECORDS FOUND</p>
        </div>
        <Link to="/add" className={styles.addBtn}>+ ADD USER</Link>
      </div>

      <div className={styles.searchBar}>
        <span className={styles.searchIcon}>⌕</span>
        <input
          type="text"
          placeholder="SEARCH BY NAME OR EMAIL..."
          value={searchQuery}
          onChange={e => dispatch(setSearch(e.target.value))}
          className={styles.searchInput}
        />
        {searchQuery && (
          <button className={styles.clearSearch} onClick={() => dispatch(setSearch(''))}>✕</button>
        )}
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th} onClick={() => handleSort('id')}>
                # <SortIcon field="id" currentField={sortField} direction={sortDirection} />
              </th>
              <th className={styles.th} onClick={() => handleSort('name')}>
                NAME <SortIcon field="name" currentField={sortField} direction={sortDirection} />
              </th>
              <th className={styles.th} onClick={() => handleSort('email')}>
                EMAIL <SortIcon field="email" currentField={sortField} direction={sortDirection} />
              </th>
              <th className={styles.th} onClick={() => handleSort('company')}>
                COMPANY <SortIcon field="company" currentField={sortField} direction={sortDirection} />
              </th>
              <th className={styles.th}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className={styles.empty}>NO USERS FOUND</td>
              </tr>
            ) : users.map((user, i) => (
              <tr
                key={user.id}
                className={styles.row}
                onClick={() => navigate(`/users/${user.id}`)}
                style={{ animationDelay: `${i * 0.03}s` }}
              >
                <td className={styles.td}>
                  <span className={styles.idBadge}>{String(user.id).padStart(3, '0')}</span>
                </td>
                <td className={styles.td}>
                  <div className={styles.nameCell}>
                    <div className={styles.avatar}>
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className={styles.userName}>{user.name}</span>
                  </div>
                </td>
                <td className={styles.td}>
                  <span className={styles.email}>{user.email}</span>
                </td>
                <td className={styles.td}>
                  <span className={styles.company}>{user.company?.name || '—'}</span>
                </td>
                <td className={styles.td} onClick={e => e.stopPropagation()}>
                  <div className={styles.actions}>
                    <button className={styles.viewBtn} onClick={() => navigate(`/users/${user.id}`)}>
                      VIEW
                    </button>
                    <button className={styles.editBtn} onClick={() => navigate(`/edit/${user.id}`)}>
                      EDIT
                    </button>
                    <button className={styles.deleteBtn} onClick={(e) => handleDelete(e, user.id)}>
                      DEL
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
