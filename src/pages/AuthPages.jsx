import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function AuthForm({ mode }) {
  const isRegister = mode === 'register';
  const { login, register, configured } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setNotice('');
    if (!email.trim() || !password) {
      setError('Попълни имейл и парола.');
      return;
    }
    if (password.length < 6) {
      setError('Паролата трябва да е поне 6 символа.');
      return;
    }
    if (isRegister && password !== confirmPassword) {
      setError('Паролите не съвпадат.');
      return;
    }
    setSubmitting(true);
    try {
      if (isRegister) {
        const result = await register(email.trim(), password);
        if (result.session) navigate('/my-diary', { replace: true });
        else setNotice('Регистрацията е изпратена. Провери имейла си за потвърждение.');
      } else {
        await login(email.trim(), password);
        const destination = location.state?.from;
        navigate(destination ? `${destination.pathname}${destination.search ?? ''}` : '/my-diary', { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Възникна грешка. Опитай отново.');
    } finally {
      setSubmitting(false);
    }
  }

  return <section className="entry-page">
    <h1>{isRegister ? 'Регистрация' : 'Вход'}</h1>
    {!configured && <p className="field-error" role="alert">Връзката със Supabase още не е настроена.</p>}
    <form className="entry-form" onSubmit={handleSubmit}>
      <label htmlFor={`${mode}-email`}>Имейл</label>
      <input id={`${mode}-email`} type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} required />
      <label htmlFor={`${mode}-password`}>Парола</label>
      <input id={`${mode}-password`} type="password" autoComplete={isRegister ? 'new-password' : 'current-password'} value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
      {isRegister && <>
        <label htmlFor="register-confirm">Потвърди паролата</label>
        <input id="register-confirm" type="password" autoComplete="new-password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
      </>}
      {error && <p className="field-error" role="alert">{error}</p>}
      {notice && <p role="status">{notice}</p>}
      <button className="button" type="submit" disabled={submitting || !configured}>{submitting ? 'Моля, изчакай...' : isRegister ? 'Регистрирай се' : 'Влез'}</button>
    </form>
    <p>{isRegister ? 'Вече имаш профил?' : 'Нямаш профил?'} <Link to={isRegister ? '/login' : '/register'}>{isRegister ? 'Влез' : 'Регистрирай се'}</Link></p>
  </section>;
}

export function Login() {
  return <AuthForm mode="login" />;
}

export function Register() {
  return <AuthForm mode="register" />;
}
