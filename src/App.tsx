import { Navigate, Route, Routes } from 'react-router-dom';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { BotWorkspacePage } from './pages/BotWorkspacePage';
import { CheckoutPage } from './pages/CheckoutPage';
import { DashboardPage } from './pages/DashboardPage';
import { DemoGuidePage } from './pages/DemoGuidePage';
import { LandingPage } from './pages/LandingPage';
import { SignInPage, SignUpPage } from './pages/LoginPage';
import { PricingPage } from './pages/PricingPage';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/guide" element={<DemoGuidePage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/login" element={<SignInPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/app" element={<DashboardPage />} />
      <Route path="/app/analytics" element={<AnalyticsPage />} />
      <Route path="/app/bots/:botId" element={<BotWorkspacePage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
