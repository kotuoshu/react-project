import { NavLink } from 'react-router-dom';

export default function Header() {
  return (
    <header className="site-header">
      <nav className="container nav" aria-label="Основна навигация">
        <NavLink className="logo" to="/">📺 MyShowsList</NavLink>
        <div className="nav-links">
          <NavLink to="/catalog">Каталог</NavLink>
          <NavLink to="/my-diary">Моят дневник</NavLink>
          <NavLink to="/entries/create">Добави запис</NavLink>
          <NavLink to="/login">Вход</NavLink>
        </div>
      </nav>
    </header>
  );
}
