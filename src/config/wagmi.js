// wagmi.ts hoặc trong file setup chính
import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http, createConfig } from 'wagmi';

// Define Monad testnet chain
const monadTestnet = {
  id: 10143,
  name: 'Monad Testnet',
  network: 'monad-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Monad',
    symbol: 'MONAD',
  },
  rpcUrls: {
    default: { http: ['https://testnet-rpc.monad.xyz'] },
    public: { http: ['https://testnet-rpc.monad.xyz'] },
  },
  blockExplorers: {
    default: { name: 'Monad Explorer', url: 'https://testnet.monadexplorer.com/' },
  },
  contracts: {
    kanaGame: {
      address: import.meta.env.VITE_CONTRACT_ADDRESS,
    }
  },
  testnet: true,
};

const projectId = 'd057bc1fd9c61c8829800d326fe01250';

// Create RainbowKit config
const config = getDefaultConfig({
  appName: 'Kana Game',
  projectId,
  chains: [monadTestnet],
  transports: {
    [monadTestnet.id]: http()
  },
  ssr: false,
  initialChain: monadTestnet,
  modalSize: 'compact',
  metadata: {
    name: 'Kana Game',
    description: 'Learn Japanese Kana characters through gameplay',
    url: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173',
    icons: [typeof window !== 'undefined' ? window.location.origin + '/favicon.ico' : 'http://localhost:5173/favicon.ico']
  }
});

export { config };