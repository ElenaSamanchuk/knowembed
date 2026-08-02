import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import { publicPath } from '../lib/paths';

export function SiteHeader() {
  const { user, loading } = useAuth();
  const location = useLocation();

  const navClass = (path: string) =>
    location.pathname === path || location.pathname.startsWith(`${path}/`) ? 'is-active' : '';

  return (
    <header className="site-header-wrap">
      <div className="site-header-bar">
        <Link to="/" className="brand">
          KnowEmbed
        </Link>
        <nav className="site-nav-pill" aria-label="Primary">
          <Link to="/pricing" className={navClass('/pricing')} aria-current={navClass('/pricing') ? 'page' : undefined}>
            Pricing
          </Link>
          <Link to="/guide" className={navClass('/guide')} aria-current={navClass('/guide') ? 'page' : undefined}>
            User guide
          </Link>
          <a
            href={publicPath('embed-demo.html')}
            className={location.pathname.includes('embed-demo') ? 'is-active' : ''}
          >
            Embed demo
          </a>
        </nav>
        <div className="site-nav-actions">
          {!loading && user ? (
            <Link to="/app" className="btn btn-primary nav-cta">
              Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary nav-cta">
                Sign in
              </Link>
              <Link to="/signup" className="btn btn-primary nav-cta">
                Ship your first bot
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
