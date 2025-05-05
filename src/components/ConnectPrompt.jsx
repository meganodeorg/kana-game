import styled from 'styled-components';

const PromptContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 2.5rem;
  border-radius: 1.5rem;
  text-align: center;
  z-index: 1000;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  max-width: 90vw;
  width: 400px;
`;

const Title = styled.h2`
  margin: 0 0 1.5rem 0;
  color: #2d3748;
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: -0.5px;
`;

const Description = styled.p`
  margin: 0;
  color: #4a5568;
  font-size: 1.1rem;
  line-height: 1.6;
`;

const Highlight = styled.span`
  color: #805ad5;
  font-weight: 600;
`;

export function ConnectPrompt() {
  return (
    <PromptContainer>
      <Title>Welcome to Kana Game</Title>
      <Description>
        Connect your wallet to start playing and earn NFTs!
        <br />
        Click the <Highlight>Connect Wallet</Highlight> button in the top right corner.
      </Description>
    </PromptContainer>
  );
} 