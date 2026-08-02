import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import { PLANS } from '../lib/plans';

type AppShellProps = {
  children: React.ReactNode;
  active: 'bots' | 'analytics' | 'workspace';
};

export function AppShell({ children, active }: AppShellProps) {
  const navigate = useNavigate();
  const { profile, signOut } = useAuth();
  const planName = profile ? PLANS[profile.plan].name : 'Starter';

  return (
    <div className="app-layout app-layout--light">
      <aside className="app-sidebar">
        <Link to="/" className="brand">
          KnowEmbed
        </Link>
        <nav className="app-nav" aria-label="Workspace">
          <Link to="/app" className={`app-nav-item ${active === 'bots' ? 'active' : ''}`}>
            Bots
          </Link>
          <Link to="/app/analytics" className={`app-nav-item ${active === 'analytics' ? 'active' : ''}`}>
            Analytics
          </Link>
          <Link to="/pricing" className="app-nav-item">
            Upgrade
          </Link>
        </nav>
        <div className="sidebar-foot">
          <p className="plan-badge">{planName} plan</p>
          {profile ? <p className="muted">{profile.email}</p> : null}
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
    </div>
  );
}
