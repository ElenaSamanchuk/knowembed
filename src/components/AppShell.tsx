import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import { PLANS } from '../lib/plans';

type AppShellProps = {
  children: React.ReactNode;
  active: 'bots' | 'analytics' | 'workspace';
};

const TAB_ITEMS = [
  { id: 'bots' as const, label: 'Bots', to: '/app', actives: ['bots', 'workspace'] as const },
  { id: 'analytics' as const, label: 'Analytics', to: '/app/analytics', actives: ['analytics'] as const },
  { id: 'upgrade' as const, label: 'Upgrade', to: '/pricing', actives: [] as const },
];

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {open ? (
        <path
          d="M6 6l12 12M18 6 6 18"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      ) : (
        <path
          d="M4 7h16M4 12h16M4 17h16"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

export function AppShell({ children, active }: AppShellProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const planName = profile ? PLANS[profile.plan].name : 'Starter';

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [menuOpen]);

  const isTabActive = (actives: readonly string[]) =>
    actives.includes(active) || (actives.includes('bots') && active === 'workspace');

  return (
    <div className={`app-layout app-layout--light ${menuOpen ? 'app-layout--menu-open' : ''}`}>
      <header className="app-topbar">
        <button
          type="button"
          className="app-menu-toggle"
          aria-expanded={menuOpen}
          aria-controls="app-sidebar"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <MenuIcon open={menuOpen} />
        </button>
        <Link to="/app" className="brand app-topbar-brand">
          KnowEmbed
        </Link>
        <span className="app-topbar-plan">{planName}</span>
      </header>

      {menuOpen ? (
        <button
          type="button"
          className="app-backdrop"
          aria-label="Close menu"
          onClick={() => setMenuOpen(false)}
        />
      ) : null}

      <aside id="app-sidebar" className={`app-sidebar ${menuOpen ? 'is-open' : ''}`}>
        <div className="app-sidebar-head">
          <Link to="/app" className="brand" onClick={() => setMenuOpen(false)}>
            KnowEmbed
          </Link>
          <button
            type="button"
            className="app-sidebar-close"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          >
            <MenuIcon open />
          </button>
        </div>

        <nav className="app-nav" aria-label="Workspace">
          <Link
            to="/app"
            className={`app-nav-item ${active === 'bots' || active === 'workspace' ? 'active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            Bots
          </Link>
          <Link
            to="/app/analytics"
            className={`app-nav-item ${active === 'analytics' ? 'active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            Analytics
          </Link>
          <Link to="/pricing" className="app-nav-item" onClick={() => setMenuOpen(false)}>
            Upgrade
          </Link>
          <Link to="/guide" className="app-nav-item app-nav-item--secondary" onClick={() => setMenuOpen(false)}>
            User guide
          </Link>
        </nav>

        <div className="sidebar-foot">
          <p className="plan-badge">{planName} plan</p>
          {profile ? <p className="muted app-sidebar-email">{profile.email}</p> : null}
          <button
            type="button"
            className="btn btn-ghost btn-block"
            onClick={() => void signOut().then(() => navigate('/login'))}
          >
            Sign out
          </button>
        </div>
      </aside>

      <main className="app-main">{children}</main>

      <nav className="app-tabbar" aria-label="Quick navigation">
        {TAB_ITEMS.map((tab) => (
          <Link
            key={tab.id}
            to={tab.to}
            className={`app-tabbar-item ${isTabActive(tab.actives) ? 'active' : ''}`}
          >
            {tab.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
