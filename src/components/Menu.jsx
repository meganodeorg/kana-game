import { gameStates, useGameStore } from "../store";
import { useAccount } from 'wagmi';
import { web3Service } from '../services/web3Service';
import styled from 'styled-components';
import { useState } from 'react';

const MenuContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 2.5rem;
  border-radius: 1.5rem;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  max-width: 90vw;
  width: 400px;
  z-index: 1;
`;

const Title = styled.h1`
  margin: 0 0 1rem 0;
  color: #2d3748;
  font-size: 2.5rem;
  font-weight: 700;
  letter-spacing: -0.5px;
`;

const Subtitle = styled.p`
  margin: 0 0 2rem 0;
  color: #4a5568;
  font-size: 1.1rem;
  line-height: 1.6;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
`;

const Button = styled.button`
  background: linear-gradient(135deg, #805ad5 0%, #6b46c1 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(107, 70, 193, 0.4);
  min-width: 140px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(107, 70, 193, 0.5);
    background: linear-gradient(135deg, #9f7aea 0%, #805ad5 100%);
  }

  &:active {
    transform: translateY(1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const Credit = styled.p`
  margin: 0;
  color: #718096;
  font-size: 0.9rem;

  a {
    color: #6b46c1;
    text-decoration: none;
    font-weight: 500;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const ErrorMessage = styled.div`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: #fc8181;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  z-index: 1000;
  animation: slideUp 0.3s ease;

  @keyframes slideUp {
    from {
      transform: translate(-50%, 100%);
      opacity: 0;
    }
    to {
      transform: translate(-50%, 0);
      opacity: 1;
    }
  }
`;

const GameOverContainer = styled(MenuContainer)`
  h1 {
    color: ${props => props.$success ? '#48bb78' : '#e53e3e'};
  }
`;

const GameOverButtons = styled(ButtonContainer)`
  flex-wrap: wrap;
  gap: 1rem;
  
  button {
    flex: 1;
    min-width: 160px;
  }
`;

const PriceInfo = styled.div`
  margin: -1rem 0 1.5rem;
  color: #718096;
  font-size: 0.9rem;
  font-weight: 500;
`;

export function Menu() {
  const { startGame, gameState, goToMenu, lives } = useGameStore((state) => ({
    startGame: state.startGame,
    gameState: state.gameState,
    goToMenu: state.goToMenu,
    lives: state.lives,
  }));
  const { isConnected } = useAccount();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleStartGame = async (mode) => {
    if (!isConnected) {
      setError("Please connect your wallet first!");
      setTimeout(() => setError(null), 3000);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Call smart contract (0 for HIRAGANA, 1 for KATAKANA)
      const gameType = mode === "hiragana" ? 0 : 1;
      await web3Service.startGame(gameType);
      
      // If payment successful, start the game
      startGame({ mode });
    } catch (err) {
      console.error("Error starting game:", err);
      setError(err.message || "Failed to start game. Please try again.");
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  if (gameState === gameStates.MENU) {
    return (
      <MenuContainer>
        <Title>Kana Game</Title>
        <Subtitle>What do you want to practice today?</Subtitle>
        <ButtonContainer>
          <Button 
            onClick={() => handleStartGame("hiragana")}
            disabled={isLoading || !isConnected}
          >
            {isLoading ? "Processing..." : "Hiragana"}
          </Button>
          <Button 
            onClick={() => handleStartGame("katakana")}
            disabled={isLoading || !isConnected}
          >
            {isLoading ? "Processing..." : "Katakana"}
          </Button>
        </ButtonContainer>
        <Credit>
          Forked from{" "}
          <a href="https://github.com/wass08" target="_blank" rel="noopener noreferrer">
            Wawa Sensei
          </a>
        </Credit>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </MenuContainer>
    );
  }

  if (gameState === gameStates.GAME_OVER) {
    return (
      <GameOverContainer $success={lives > 0}>
        <Title>{lives > 0 ? "Congratulations!" : "Game Over!"}</Title>
        <Subtitle>
          {lives > 0 
            ? "You have completed the lesson!" 
            : "You lost all your lives."}
        </Subtitle>
        {!lives > 0 && (
          <PriceInfo>
            Pay 0.01 ETH to play again
          </PriceInfo>
        )}
        <GameOverButtons>
          <Button 
            onClick={() => handleStartGame("hiragana")}
            disabled={isLoading || !isConnected}
          >
            {isLoading ? "Processing..." : "Play Hiragana"}
          </Button>
          <Button 
            onClick={() => handleStartGame("katakana")}
            disabled={isLoading || !isConnected}
          >
            {isLoading ? "Processing..." : "Play Katakana"}
          </Button>
          <Button onClick={goToMenu}>
            Back to Menu
          </Button>
        </GameOverButtons>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </GameOverContainer>
    );
  }

  return null;
}
