import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchUsers } from './store/usersSlice';
import Layout from './components/Layout';
import UsersPage from './pages/UsersPage';
import UserDetailPage from './pages/UserDetailPage';
import AddUserPage from './pages/AddUserPage';
import EditUserPage from './pages/EditUserPage';

export default function App() {
  const dispatch = useDispatch();
  useEffect(() => { dispatch(fetchUsers()); }, [dispatch]);

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<UsersPage />} />
        <Route path="/users/:id" element={<UserDetailPage />} />
        <Route path="/add" element={<AddUserPage />} />
        <Route path="/edit/:id" element={<EditUserPage />} />
      </Routes>
    </Layout>
  );
}
