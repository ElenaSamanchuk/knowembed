import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';

export function SiteHeader() {
  const { user, loading } = useAuth();

  return (
    <header className="site-header">
      <Link to="/" className="brand">
        KnowEmbed
      </Link>
      <nav className="site-nav">
        <Link to="/pricing">Pricing</Link>
        <Link to="/guide">Demo guide</Link>
        {!loading && user ? (
          <Link to="/app" className="btn btn-primary nav-cta">
            Dashboard
          </Link>
        ) : (
          <>
            <Link to="/login" className="btn btn-secondary nav-cta">
              Sign in
            </Link>
            <Link to="/login" className="btn btn-primary nav-cta">
              Start free
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
