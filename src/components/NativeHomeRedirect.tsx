import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import { isNativeApp } from '../lib/native';
import { LandingPage } from '../pages/LandingPage';

/** On Android/iOS the app opens the workspace — not the marketing landing */
export function NativeHomeRedirect() {
  const { session, loading } = useAuth();

  if (!isNativeApp()) {
    return <LandingPage />;
  }

  if (loading) {
    return (
      <div className="native-boot" role="status" aria-live="polite">
        <div className="native-boot-mark" aria-hidden="true" />
        <p>Loading workspace…</p>
      </div>
    );
  }

  return <Navigate to={session ? '/app' : '/login'} replace />;
}
