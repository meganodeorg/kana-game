import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useEffect } from 'react';
import { useAccount, useConnect } from 'wagmi';
import styled from 'styled-components';

const StyledConnectButton = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
`;

export function WalletConnect() {
  const { isConnected } = useAccount();
  const { connect, connectors } = useConnect();

  useEffect(() => {
    // Check if there's a previously connected wallet
    const lastConnector = localStorage.getItem('lastConnector');
    if (!isConnected && lastConnector) {
      const connector = connectors.find(c => c.id === lastConnector);
      if (connector) {
        connect({ connector });
      }
    }
  }, [isConnected, connect, connectors]);

  // Save the last used connector
  useEffect(() => {
    if (isConnected) {
      const currentConnector = connectors.find(c => c.connected);
      if (currentConnector) {
        localStorage.setItem('lastConnector', currentConnector.id);
      }
    }
  }, [isConnected, connectors]);

  return (
    <StyledConnectButton>
      <ConnectButton 
        chainStatus="icon"
        showBalance={false}
      />
    </StyledConnectButton>
  );
} 