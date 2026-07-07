import { useState } from 'react';
import { api } from '../api/client.js';

export default function ShortenForm({ onCreated }) {
  const [url, setUrl] = useState('');
  const [shortcode, setShortcode] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = { url };
      if (shortcode.trim()) payload.shortcode = shortcode.trim();

      const data = await api.createUrl(payload);
      setResult(data);
      setUrl('');
      setShortcode('');
      onCreated?.();
    } catch (err) {
      setError(err.message);
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="bg-inkSoft border border-mist rounded-lg p-6 space-y-4">
        <div>
          <label className="block font-mono text-xs text-slate mb-2">long url</label>
          <input
            required
            type="url"
            placeholder="https://example.com/a/very/long/path"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full bg-ink border border-mist rounded px-3 py-2 font-mono text-sm text-paper placeholder:text-slate/60 focus:outline-none focus:border-signal"
          />
        </div>

        <div>
          <label className="block font-mono text-xs text-slate mb-2">
            custom code <span className="text-slate/50">(optional)</span>
          </label>
          <input
            type="text"
            placeholder="e.g. launch"
            value={shortcode}
            onChange={(e) => setShortcode(e.target.value)}
            className="w-full bg-ink border border-mist rounded px-3 py-2 font-mono text-sm text-paper placeholder:text-slate/60 focus:outline-none focus:border-signal"
          />
        </div>

        <p className="font-mono text-xs text-slate/70">links expire automatically after 4 hours</p>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-signal text-ink font-semibold rounded py-2 hover:bg-signalDim transition-colors disabled:opacity-50"
        >
          {loading ? 'creating…' : 'shorten it'}
        </button>

        {error && <p className="font-mono text-xs text-amber">{error}</p>}
      </form>

      {result && (
        <div className="mt-4 bg-mist/40 border border-signal/30 rounded-lg px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="min-w-0">
            <p className="font-mono text-xs text-slate mb-1">
              your short link (expires {new Date(result.expiry).toLocaleTimeString()})
            </p>
            <a
              href={result.shortLink}
              target="_blank"
              rel="noreferrer"
              className="font-mono text-signal text-sm break-all hover:underline"
            >
              {result.shortLink}
            </a>
          </div>
          <a
            href={`/stats/${result.shortcode}`}
            className="font-mono text-xs shrink-0 border border-mist rounded px-3 py-2 text-paper hover:border-signal hover:text-signal transition-colors text-center"
          >
            view stats →
          </a>
        </div>
      )}
    </div>
  );
}
