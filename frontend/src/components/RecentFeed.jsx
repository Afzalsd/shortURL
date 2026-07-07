import { Link } from 'react-router-dom';

export default function RecentFeed({ links, loading }) {
  if (loading) {
    return <p className="font-mono text-xs text-slate">loading…</p>;
  }

  if (!links.length) {
    return (
      <div className="border border-dashed border-mist rounded-lg px-6 py-8 text-center">
        <p className="font-mono text-sm text-slate">nothing shortened yet — be the first.</p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-mist/60 border border-mist rounded-lg overflow-hidden">
      {links.map((link) => (
        <li
          key={link.shortcode}
          className="px-4 py-3 flex items-center justify-between gap-3 bg-inkSoft/40"
        >
          <div className="min-w-0">
            <p className="font-mono text-signal text-sm truncate">/{link.shortcode}</p>
            <p className="text-slate text-xs truncate mt-0.5">{link.originalUrl}</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="font-mono text-xs text-paper">{link.totalClicks} clicks</span>
            <span
              className={`font-mono text-[10px] uppercase px-2 py-1 rounded border ${
                link.isActive ? 'border-signal/40 text-signal' : 'border-amber/40 text-amber'
              }`}
            >
              {link.isActive ? 'active' : 'expired'}
            </span>
            <Link to={`/stats/${link.shortcode}`} className="font-mono text-xs text-slate hover:text-signal">
              stats →
            </Link>
          </div>
        </li>
      ))}
    </ul>
  );
}
