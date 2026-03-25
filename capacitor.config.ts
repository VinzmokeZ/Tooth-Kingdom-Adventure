import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.toothkingdom.adventure',
  appName: 'Tooth Kingdom Adventure',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    cleartext: true,
    allowNavigation: ["180.235.121.253"]
  }
};

export default config;
