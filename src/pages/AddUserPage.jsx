import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addUser } from '../store/usersSlice';
import UserForm from '../components/UserForm';

export default function AddUserPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const users = useSelector(s => s.users.list);

  const handleSubmit = (form) => {
    const maxId = users.reduce((max, u) => Math.max(max, u.id || 0), 0);
    const newUser = {
      ...form,
      id: maxId + 1,
      username: form.username || form.name.toLowerCase().replace(/\s+/g, '.'),
    };
    dispatch(addUser(newUser));
    navigate('/');
  };

  return (
    <UserForm
      title="ADD NEW USER"
      submitLabel="CREATE USER →"
      onSubmit={handleSubmit}
    />
  );
}
