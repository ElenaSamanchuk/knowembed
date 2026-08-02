import { Link } from 'react-router-dom';
import { publicPath } from '../lib/paths';

export function HeroSocialProof() {
  return (
    <div className="hero-social-proof" aria-label="Project links">
      <span className="hero-social-proof__pill">Paralect Academy project</span>
      <a
        href="https://github.com/ElenaSamanchuk/knowembed"
        target="_blank"
        rel="noopener noreferrer"
        className="hero-social-proof__link"
      >
        GitHub
      </a>
      <Link to="/guide" className="hero-social-proof__link">
        User guide
      </Link>
      <a href={publicPath('embed-demo.html')} className="hero-social-proof__link">
        Embed demo
      </a>
    </div>
  );
}
