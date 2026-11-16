import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase.js';
import { useAuth } from '../context/AuthContext.jsx';

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
  const { user } = useAuth();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    async function loadEntries() {
      if (!supabase || !user) {
        if (active) setLoading(false);
        return;
      }
      const { data, error: requestError } = await supabase
        .from('entries')
        .select('id, title, genre, status, rating, notes, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (!active) return;
      setEntries(data ?? []);
      setError(requestError?.message ?? '');
      setLoading(false);
    }
    loadEntries();
    return () => { active = false; };
  }, [user]);

  return <section><h1>Моят дневник</h1>
    {loading ? <p>Зареждане...</p> : error ? <p role="alert" className="field-error">{error}</p> : entries.length === 0 ?
      <div className="empty">Все още няма добавени сериали. <Link to="/entries/create">Добави първия</Link></div> :
      <div className="entries-list">{entries.map((entry) => <article className="entry-preview" key={entry.id}>
        <h2>{entry.title}</h2>
        <p><strong>Статус:</strong> {statuses[entry.status]}</p>
        {entry.genre && <p><strong>Жанр:</strong> {entry.genre}</p>}
        {entry.rating != null && <p><strong>Оценка:</strong> {entry.rating}/10</p>}
        {entry.notes && <p><strong>Впечатления:</strong> {entry.notes}</p>}
      </article>)}</div>}
  </section>;
}
const emptyEntry = { title: '', genre: '', status: 'planned', rating: '', notes: '' };

const statuses = {
  planned: 'Планирам да гледам',
  watching: 'Гледам',
  completed: 'Изгледан',
};

export function CreateEntry() {
  const [entry, setEntry] = useState(emptyEntry);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  function handleChange(event) {
    const { name, value } = event.target;
    setEntry((current) => ({ ...current, [name]: value }));
    setErrors({});
    setSubmitError('');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = {};

    if (entry.title.trim().length < 2) {
      nextErrors.title = 'Въведи заглавие с поне 2 символа.';
    }
    if (entry.rating !== '' && (!Number.isInteger(Number(entry.rating)) || Number(entry.rating) < 1 || Number(entry.rating) > 10)) {
      nextErrors.rating = 'Оценката трябва да е между 1 и 10.';
    }
    if (entry.notes.length > 500) {
      nextErrors.notes = 'Бележките не могат да надвишават 500 символа.';
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length !== 0) return;
    if (!supabase || !user) {
      setSubmitError('Трябва да влезеш в профила си, за да добавиш сериал.');
      return;
    }
    setSaving(true);
    setSubmitError('');
    const { error: requestError } = await supabase.from('entries').insert({
      user_id: user.id,
      title: entry.title.trim(),
      genre: entry.genre.trim(),
      status: entry.status,
      rating: entry.rating === '' ? null : Number(entry.rating),
      notes: entry.notes.trim(),
    });
    setSaving(false);
    if (requestError) {
      setSubmitError(requestError.message);
      return;
    }
    navigate('/my-diary');
  }

  return (
    <section className="entry-page">
      <h1>Добави сериал</h1>
      <form className="entry-form" onSubmit={handleSubmit} noValidate>
        <label htmlFor="title">Заглавие *</label>
        <input
          id="title"
          name="title"
          value={entry.title}
          onChange={handleChange}
          aria-invalid={Boolean(errors.title)}
          aria-describedby={errors.title ? 'title-error' : undefined}
          required
          minLength={2}
          maxLength={100}
        />
        {errors.title && <span className="field-error" id="title-error">{errors.title}</span>}

        <label htmlFor="genre">Жанр</label>
        <input
          id="genre"
          name="genre"
          value={entry.genre}
          onChange={handleChange}
          maxLength={60}
          placeholder="Напр. драма, фантастика"
        />

        <label htmlFor="status">Статус</label>
        <select id="status" name="status" value={entry.status} onChange={handleChange}>
          <option value="planned">Планирам да гледам</option>
          <option value="watching">Гледам</option>
          <option value="completed">Изгледан</option>
        </select>

        <label htmlFor="rating">Моята оценка (1–10)</label>
        <input
          id="rating"
          name="rating"
          type="number"
          min="1"
          max="10"
          step="1"
          value={entry.rating}
          onChange={handleChange}
          aria-invalid={Boolean(errors.rating)}
          aria-describedby={errors.rating ? 'rating-error' : undefined}
        />
        {errors.rating && <span className="field-error" id="rating-error">{errors.rating}</span>}

        <label htmlFor="notes">Лични впечатления</label>
        <textarea
          id="notes"
          name="notes"
          value={entry.notes}
          onChange={handleChange}
          rows="5"
          maxLength={500}
        />
        {errors.notes && <span className="field-error" id="notes-error">{errors.notes}</span>}

        {submitError && <p role="alert" className="field-error">{submitError}</p>}
        <button className="button" type="submit" disabled={saving}>{saving ? 'Запазване...' : 'Запази сериала'}</button>
      </form>


    </section>
  );
}
export function EditEntry() {
  const { id } = useParams();
  return <section><h1>Редактиране на запис</h1><p>Редактирането на запис № {id} още не е достъпно.</p></section>;
}
export function NotFound() {
  return <section><h1>404 — страницата не е намерена</h1><Link to="/">Към началото</Link></section>;
}
