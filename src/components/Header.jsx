import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Header() {
  const { user, logout } = useAuth();
  const [error, setError] = useState('');
  async function handleLogout() {
    setError('');
    try { await logout(); }
    catch (err) { setError(err.message || 'Неуспешен изход.'); }
  }
  return (
    <header className="site-header">
      <nav className="container nav" aria-label="Основна навигация">
        <NavLink className="logo" to="/">📺 MyShowsList</NavLink>
        <div className="nav-links">
          <NavLink to="/catalog">Каталог</NavLink>
          {user ? <>
            <NavLink to="/my-diary">Моят дневник</NavLink>
            <NavLink to="/entries/create">Добави запис</NavLink>
            <button className="nav-button" type="button" onClick={handleLogout}>Изход</button>
          </> : <>
            <NavLink to="/login">Вход</NavLink>
            <NavLink to="/register">Регистрация</NavLink>
          </>}
        </div>
      </nav>
      {error && <p className="container field-error" role="alert">{error}</p>}
    </header>
  );
}
