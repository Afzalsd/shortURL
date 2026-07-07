import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { api } from '../api/client.js';

function groupBy(items, keyFn) {
  const map = {};
  items.forEach((item) => {
    const key = keyFn(item) || 'Unknown';
    map[key] = (map[key] || 0) + 1;
  });
  return Object.entries(map)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);
}

export default function Stats() {
  const { shortcode } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .getStats(shortcode)
      .then(setData)
      .catch((err) => setError(err.message));
  }, [shortcode]);

  if (error) {
    return (
      <main className="max-w-2xl mx-auto px-6 py-20 text-center">
        <p className="font-mono text-amber">{error}</p>
        <Link to="/" className="font-mono text-xs text-signal mt-4 inline-block hover:underline">
          ← back
        </Link>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="max-w-2xl mx-auto px-6 py-20 text-center">
        <p className="font-mono text-xs text-slate">loading…</p>
      </main>
    );
  }

  const byCountry = groupBy(data.clicks, (c) => c.country);
  const byReferrer = groupBy(data.clicks, (c) => c.referrer);

  return (
    <main className="max-w-3xl mx-auto px-6 pb-24 pt-12">
      <Link to="/" className="font-mono text-xs text-slate hover:text-signal transition-colors">
        ← back to relay
      </Link>

      <div className="mt-6 mb-10">
        <p className="font-mono text-xs text-signal uppercase tracking-wider mb-2">/{data.shortcode}</p>
        <h1 className="font-display text-2xl text-paper break-all">{data.originalUrl}</h1>
        <div className="flex flex-wrap gap-3 mt-4">
          <Stat label="total clicks" value={data.totalClicks} />
          <Stat label="status" value={data.isActive ? 'active' : 'expired'} accent={data.isActive} />
          <Stat label="expires" value={new Date(data.expiryDate).toLocaleDateString()} />
        </div>
      </div>

      {data.clicks.length === 0 ? (
        <div className="border border-dashed border-mist rounded-xl px-6 py-14 text-center">
          <p className="font-mono text-sm text-slate">no clicks recorded yet — share the link to see data here.</p>
        </div>
      ) : (
        <div className="space-y-10">
          <ChartBlock title="clicks by country" rows={byCountry} />
          <ChartBlock title="clicks by referrer" rows={byReferrer} />

          <div>
            <h3 className="font-display text-sm text-slate uppercase tracking-wider mb-4">recent activity</h3>
            <ul className="divide-y divide-mist/60 border border-mist rounded-xl overflow-hidden">
              {data.clicks
                .slice()
                .reverse()
                .slice(0, 10)
                .map((c, i) => (
                  <li key={i} className="px-5 py-3 flex items-center justify-between text-xs font-mono bg-inkSoft/50">
                    <span className="text-slate">{new Date(c.timestamp).toLocaleString()}</span>
                    <span className="text-paper">{c.city}, {c.country}</span>
                    <span className="text-signal">{c.referrer}</span>
                    <span className="text-slate">{c.browser} · {c.deviceType}</span>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      )}
    </main>
  );
}

function Stat({ label, value, accent }) {
  return (
    <div className="border border-mist rounded-lg px-4 py-2">
      <p className="font-mono text-[10px] text-slate uppercase tracking-wider">{label}</p>
      <p className={`font-display text-lg ${accent === false ? 'text-amber' : accent ? 'text-signal' : 'text-paper'}`}>
        {value}
      </p>
    </div>
  );
}

function ChartBlock({ title, rows }) {
  return (
    <div>
      <h3 className="font-display text-sm text-slate uppercase tracking-wider mb-4">{title}</h3>
      <div className="border border-mist rounded-xl p-4 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={rows} layout="vertical" margin={{ left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1B2740" horizontal={false} />
            <XAxis type="number" stroke="#8B98B3" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis
              type="category"
              dataKey="name"
              stroke="#8B98B3"
              fontSize={11}
              width={90}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{ background: '#111A2E', border: '1px solid #1B2740', borderRadius: 8, fontSize: 12 }}
              labelStyle={{ color: '#F5F3EE' }}
              cursor={{ fill: 'rgba(94,234,212,0.06)' }}
            />
            <Bar dataKey="count" fill="#5EEAD4" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
