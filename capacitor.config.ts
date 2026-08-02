import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.knowembed.app',
  appName: 'KnowEmbed',
  webDir: 'dist',
  android: {
    allowMixedContent: false,
    backgroundColor: '#f4f6fa',
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      launchShowDuration: 1800,
      backgroundColor: '#5089fd',
      androidSplashResourceName: 'splash',
      showSpinner: false,
    },
    StatusBar: {
      style: 'LIGHT',
      backgroundColor: '#5089fd',
    },
  },
};

export default config;
