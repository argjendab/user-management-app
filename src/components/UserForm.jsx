import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './UserForm.module.css';

const EMPTY_FORM = {
  name: '', username: '', email: '', phone: '', website: '',
  address: { street: '', suite: '', city: '', zipcode: '' },
  company: { name: '', catchPhrase: '', bs: '' },
};

// ✅ Defined OUTSIDE the parent component so React doesn't recreate
//    it as a new component type on every render
const Field = ({ label, path, type = 'text', required, form, errors, onChange }) => {
  const value = path.includes('.')
    ? form[path.split('.')[0]][path.split('.')[1]]
    : form[path];

  return (
    <div className={styles.field}>
      <label className={styles.label}>
        {label} {required && <span className={styles.req}>*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(path, e.target.value)}
        className={`${styles.input} ${errors[path] ? styles.inputError : ''}`}
        placeholder={`ENTER ${label}...`}
      />
      {errors[path] && <span className={styles.errorMsg}>{errors[path]}</span>}
    </div>
  );
};

export default function UserForm({ initialData = {}, onSubmit, title, submitLabel }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ ...EMPTY_FORM, ...initialData });
  const [errors, setErrors] = useState({});

  const handleChange = (path, value) => {
    setForm(prev => {
      const updated = { ...prev };
      if (path.includes('.')) {
        const [parent, child] = path.split('.');
        updated[parent] = { ...updated[parent], [child]: value };
      } else {
        updated[path] = value;
      }
      return updated;
    });
    if (errors[path]) setErrors(prev => ({ ...prev, [path]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'NAME IS REQUIRED';
    if (!form.email.trim()) errs.email = 'EMAIL IS REQUIRED';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'INVALID EMAIL FORMAT';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    onSubmit(form);
  };

  const fieldProps = { form, errors, onChange: handleChange };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>← BACK</button>
        <h1 className={styles.title}>{title}</h1>
      </div>

      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>BASIC INFO</h2>
          <div className={styles.grid2}>
            <Field label="FULL NAME" path="name" required {...fieldProps} />
            <Field label="USERNAME" path="username" {...fieldProps} />
            <Field label="EMAIL ADDRESS" path="email" type="email" required {...fieldProps} />
            <Field label="PHONE" path="phone" {...fieldProps} />
            <Field label="WEBSITE" path="website" {...fieldProps} />
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>ADDRESS</h2>
          <div className={styles.grid2}>
            <Field label="STREET" path="address.street" {...fieldProps} />
            <Field label="SUITE" path="address.suite" {...fieldProps} />
            <Field label="CITY" path="address.city" {...fieldProps} />
            <Field label="ZIPCODE" path="address.zipcode" {...fieldProps} />
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>COMPANY</h2>
          <div className={styles.grid2}>
            <Field label="COMPANY NAME" path="company.name" {...fieldProps} />
            <Field label="CATCHPHRASE" path="company.catchPhrase" {...fieldProps} />
            <Field label="BUSINESS" path="company.bs" {...fieldProps} />
          </div>
        </section>

        <div className={styles.formActions}>
          <button type="button" className={styles.cancelBtn} onClick={() => navigate(-1)}>
            CANCEL
          </button>
          <button type="submit" className={styles.submitBtn}>
            {submitLabel}
          </button>
        </div>
      </form>
    </div>
  );
}