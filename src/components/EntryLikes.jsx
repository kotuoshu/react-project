import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function EntryLikes({ entryId }) {
  const { user } = useAuth();
  const userId = user?.id;
  const [likes, setLikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    async function load() {
      try {
        const { data, error } = await supabase.from('likes').select('user_id').eq('entry_id', entryId);
        if (error) throw error;
        if (active) setLikes(data ?? []);
      } catch (err) {
        if (active) setError(err.message);
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, [entryId, userId]);

  const liked = likes.some(like => like.user_id === userId);

  async function toggle() {
    if (!userId || busy || loading) return;
    setBusy(true);
    setError('');
    try {
      const { error } = liked
        ? await supabase.from('likes').delete().eq('entry_id', entryId).eq('user_id', userId)
        : await supabase.from('likes').insert({ entry_id: entryId, user_id: userId });
      if (error) throw error;
      setLikes(current => liked ? current.filter(like => like.user_id !== userId) : [...current, { user_id: userId }]);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return <div className="likes">
    {loading ? <p>Зареждане на харесвания...</p> : <><span>Харесвания: {likes.length}</span>{userId && <button type="button" className="button" onClick={toggle} aria-pressed={liked} disabled={busy || Boolean(error)}>{liked ? 'Премахни харесването' : 'Харесвам'}</button>}</>}
    {error && <p role="alert" className="field-error">{error}</p>}
  </div>;
}
