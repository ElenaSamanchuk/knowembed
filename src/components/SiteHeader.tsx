import { Link } from 'react-router-dom';

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link to="/" className="brand">
        KnowEmbed
      </Link>
      <nav className="site-nav">
        <Link to="/pricing">Pricing</Link>
        <Link to="/login" className="btn btn-secondary">
          Sign in
        </Link>
        <Link to="/app" className="btn btn-primary">
          Open app
        </Link>
      </nav>
    </header>
  );
}
