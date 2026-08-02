import { Link } from 'react-router-dom';
import { publicPath } from '../lib/paths';

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-brand">
          <Link to="/" className="brand">
            KnowEmbed
          </Link>
          <p className="muted">
            Upload docs, test AI answers, embed a support widget on any site — in minutes.
          </p>
        </div>
        <nav className="site-footer-nav" aria-label="Footer">
          <div>
            <p className="footer-label">Product</p>
            <Link to="/pricing">Pricing</Link>
            <Link to="/guide">Demo guide</Link>
            <a href={publicPath('embed-demo.html')}>Live embed demo</a>
          </div>
          <div>
            <p className="footer-label">Get started</p>
            <Link to="/signup">Sign up free</Link>
            <Link to="/login">Sign in</Link>
            <a
              href="https://github.com/ElenaSamanchuk/knowembed"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </div>
        </nav>
      </div>
      <p className="site-footer-copy muted">
        © {new Date().getFullYear()} KnowEmbed · Built by{' '}
        <a href="https://elenasamanchuk.github.io/elena-samanchuk/" target="_blank" rel="noopener noreferrer">
          Elena Samanchuk
        </a>
      </p>
    </footer>
  );
}
