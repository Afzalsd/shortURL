import { useEffect, useState, useCallback, useRef } from 'react';
import ShortenForm from '../components/ShortenForm.jsx';
import RecentFeed from '../components/RecentFeed.jsx';
import { api } from '../api/client.js';

const POLL_MS = 5000;

export default function Home() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef(null);

  const refresh = useCallback(async () => {
    try {
      const data = await api.listUrls(10);
      setLinks(data);
    } catch {
      // best-effort; keep showing last known list
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    intervalRef.current = setInterval(refresh, POLL_MS);
    return () => clearInterval(intervalRef.current);
  }, [refresh]);

  return (
    <main className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="font-display text-2xl text-paper mb-1">relay</h1>
      <p className="text-slate text-sm mb-8">Shorten a link. It works for 4 hours, then turns off.</p>

      <ShortenForm onCreated={refresh} />

      <section className="mt-12">
        <h2 className="font-mono text-xs text-slate uppercase tracking-wider mb-3">
          recently shortened worldwide
        </h2>
        <RecentFeed links={links} loading={loading} />
      </section>
    </main>
  );
}
