import { ConnectButton } from '@rainbow-me/rainbowkit';
import styled from 'styled-components';

const StyledConnectButton = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
`;

export function WalletConnect() {
  return (
    <StyledConnectButton>
      <ConnectButton 
        chainStatus="icon"
        showBalance={false}
      />
    </StyledConnectButton>
  );
} 