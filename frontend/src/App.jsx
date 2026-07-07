import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Stats from './pages/Stats.jsx';

function Nav() {
  const location = useLocation();
  return (
    <header className="border-b border-mist/60 bg-ink/80 backdrop-blur sticky top-0 z-20">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="font-display text-lg tracking-tight text-paper flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-signal inline-block" />
          relay
        </Link>
        <nav className="font-mono text-xs text-slate flex items-center gap-6">
          <Link
            to="/"
            className={location.pathname === '/' ? 'text-signal' : 'hover:text-paper transition-colors'}
          >
            shorten
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-ink text-paper font-body">
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/stats/:shortcode" element={<Stats />} />
      </Routes>
    </div>
  );
}
