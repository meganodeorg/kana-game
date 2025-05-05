// wagmi.ts hoặc trong file setup chính
import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, sepolia } from 'wagmi/chains';
import { http, createConfig } from 'wagmi';

export const config = getDefaultConfig({
  appName: 'Kana Game',
  projectId: 'd057bc1fd9c61c8829800d326fe01250', // Your existing project ID
  chains: [sepolia, mainnet], // Using Sepolia for testing and mainnet
  transports: {
    [sepolia.id]: http(),
    [mainnet.id]: http(),
  },
  ssr: false // Since this is not a SSR app
});