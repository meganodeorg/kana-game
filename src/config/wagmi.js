// wagmi.ts hoặc trong file setup chính
import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia } from 'wagmi/chains';
import { http } from 'wagmi';

// Get the current URL for WalletConnect metadata
const origin = typeof window !== 'undefined' ? window.location.origin : '';

// Create config with safe defaults
export const config = getDefaultConfig({
  appName: 'Kana Game',
  projectId: 'd057bc1fd9c61c8829800d326fe01250',
  chains: [sepolia],
  transports: {
    [sepolia.id]: http()
  },
  ssr: false,
  // Add proper WalletConnect metadata
  walletConnectProjectId: 'd057bc1fd9c61c8829800d326fe01250',
  metadata: {
    name: 'Kana Game',
    description: 'Learn Japanese Kana characters through gameplay',
    url: origin,
    icons: [`${origin}/favicon.ico`]
  }
});