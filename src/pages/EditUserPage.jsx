import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../store/usersSlice';
import UserForm from '../components/UserForm';

export default function EditUserPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(s => s.users.list.find(u => String(u.id) === id));

  if (!user) return (
    <div style={{ padding: 80, textAlign: 'center', color: 'var(--text-dimmer)', letterSpacing: '0.1em', fontSize: '0.8rem' }}>
      USER NOT FOUND
    </div>
  );

  const handleSubmit = (form) => {
    dispatch(updateUser({ ...user, ...form, id: user.id }));
    navigate(`/users/${user.id}`);
  };

  return (
    <UserForm
      title={`EDIT: ${user.name.toUpperCase()}`}
      submitLabel="SAVE CHANGES →"
      initialData={user}
      onSubmit={handleSubmit}
    />
  );
}
