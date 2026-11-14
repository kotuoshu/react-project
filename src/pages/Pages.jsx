import { Link, useParams } from 'react-router-dom';

export function Home() {
  return <section className="hero"><span className="eyebrow">Твоят дневник за сериали</span><h1>Запази всяка история, която си гледал.</h1><p>Следи гледаните сериали, оценки и впечатления — на едно място.</p><Link className="button" to="/catalog">Разгледай каталога</Link></section>;
}
export function Catalog() {
  return <section><h1>Каталог</h1><div className="empty">Все още няма публикувани сериали.</div></section>;
}
export function EntryDetails() {
  const { id } = useParams();
  return <section><h1>Подробности за сериал</h1><p>Няма информация за запис № {id}.</p></section>;
}
export function UserProfile() {
  const { userId } = useParams();
  return <section><h1>Публичен профил</h1><p>Няма публични записи за потребител {userId}.</p></section>;
}
export function MyDiary() {
  return <section><h1>Моят дневник</h1><div className="empty">Все още няма добавени сериали.</div></section>;
}
export function CreateEntry() {
  return <section><h1>Добави сериал</h1><p>Добавянето на сериали още не е достъпно.</p></section>;
}
export function EditEntry() {
  const { id } = useParams();
  return <section><h1>Редактиране на запис</h1><p>Редактирането на запис № {id} още не е достъпно.</p></section>;
}
export function Login() {
  return <section><h1>Вход</h1><p>Входът още не е достъпен.</p></section>;
}
export function Register() {
  return <section><h1>Регистрация</h1><p>Регистрацията още не е достъпна.</p></section>;
}
export function NotFound() {
  return <section><h1>404 — страницата не е намерена</h1><Link to="/">Към началото</Link></section>;
}
