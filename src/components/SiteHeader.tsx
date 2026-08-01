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
        <Link to="/docs/demo.html">Demo guide</Link>
        {!loading && user ? (
          <Link to="/app" className="btn btn-primary">
            Dashboard
          </Link>
        ) : (
          <>
            <Link to="/login" className="btn btn-secondary">
              Sign in
            </Link>
            <Link to="/login" className="btn btn-primary">
              Start free
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
