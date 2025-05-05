import {
  KeyboardControls,
  Loader,
  useFont,
  useProgress,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { Leva } from "leva";
import { Suspense, useMemo } from "react";
import { Experience } from "./components/Experience";
import { Menu } from "./components/Menu";
import { LivesDisplay } from "./components/LivesDisplay";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from './config/wagmi';
import '@rainbow-me/rainbowkit/styles.css';
import { WalletConnect } from './components/WalletConnect';
import { ConnectPrompt } from './components/ConnectPrompt';
import { useAccount } from 'wagmi';
import styled from 'styled-components';

const queryClient = new QueryClient();

const GameContainer = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #e3daf7;
`;

// Export both uppercase and lowercase versions for backward compatibility
export const Controls = {
  forward: "forward",
  back: "back",
  left: "left",
  right: "right",
  jump: "jump",
};

export const controls = Controls;

function GameContent() {
  const { isConnected } = useAccount();
  useFont.preload("./fonts/Noto Sans JP ExtraBold_Regular.json");
  const map = useMemo(
    () => [
      { name: Controls.forward, keys: ["ArrowUp", "KeyW"] },
      { name: Controls.back, keys: ["ArrowDown", "KeyS"] },
      { name: Controls.left, keys: ["ArrowLeft", "KeyA"] },
      { name: Controls.right, keys: ["ArrowRight", "KeyD"] },
      { name: Controls.jump, keys: ["Space"] },
    ],
    []
  );

  const { progress } = useProgress();

  return (
    <GameContainer>
      <WalletConnect />
      {!isConnected ? (
        <ConnectPrompt />
      ) : (
        <KeyboardControls map={map}>
          <Leva hidden />
          <LivesDisplay />
          <Canvas shadows camera={{ position: [0, 20, 14], fov: 42 }}>
            <color attach="background" args={["#e3daf7"]} />
            <Suspense>
              <Physics>
                <Experience />
              </Physics>
            </Suspense>
          </Canvas>
          <Loader />
          {progress === 100 && <Menu />}
          <Menu />
        </KeyboardControls>
      )}
    </GameContainer>
  );
}

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <GameContent />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
