import { App as CapApp } from '@capacitor/app';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isNativeApp } from '../lib/native';

export function NativeAppInit() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isNativeApp()) return;

    document.documentElement.classList.add('native-app');

    void (async () => {
      try {
        await StatusBar.setStyle({ style: Style.Light });
        await StatusBar.setBackgroundColor({ color: '#5089fd' });
      } catch {
        /* StatusBar unavailable on some WebViews */
      }
      await SplashScreen.hide();
    })();

    const sub = CapApp.addListener('backButton', ({ canGoBack }) => {
      if (canGoBack) {
        navigate(-1);
        return;
      }
      void CapApp.exitApp();
    });

    return () => {
      void sub.then((handle) => handle.remove());
    };
  }, [navigate]);

  return null;
}
