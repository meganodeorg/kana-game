import { useGameStore, gameStates } from "../store";
import styled from "styled-components";
import { web3Service } from "../services/web3Service";
import { useState } from "react";
import { useAccount } from "wagmi";

const Container = styled.div`
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
  color: ${props => props.$success ? '#48bb78' : '#e53e3e'};
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

const Score = styled.div`
  color: #4a5568;
  font-size: 1.2rem;
  margin: 1rem 0;
  font-weight: 600;
`;

const ErrorMessage = styled.div`
  background: #fed7d7;
  color: #c53030;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-weight: 500;
  margin-top: 1rem;
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  
  div {
    background: white;
    padding: 2rem;
    border-radius: 1rem;
    color: #2d3748;
    font-weight: 600;
  }
`;

export const Menu = () => {
  const gameState = useGameStore((state) => state.gameState);
  const startGame = useGameStore((state) => state.startGame);
  const goToMenu = useGameStore((state) => state.goToMenu);
  const wrongAnswers = useGameStore((state) => state.wrongAnswers);
  const isProcessingWin = useGameStore((state) => state.isProcessingWin);
  const hasProcessedWin = useGameStore((state) => state.hasProcessedWin);
  const lives = useGameStore((state) => state.lives);
  const { isConnected } = useAccount();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleStartGame = async (mode) => {
    if (!isConnected) {
      setError("Please connect your wallet first!");
      return;
    }

    setIsLoading(true);
    setError("");
    
    try {
      await web3Service.startGame(mode === "hiragana" ? 0 : 1);
      startGame({ mode });
    } catch (err) {
      setError(err.message || "Failed to start game. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (gameState === gameStates.MENU) {
    return (
      <Container>
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
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </Container>
    );
  }

  if (gameState === gameStates.GAME_OVER) {
    const hasWon = lives > 0;
    
    return (
      <Container>
        <Title $success={hasWon}>
          {hasWon ? "Congratulations! 🎉" : "Game Over"}
        </Title>
        <Subtitle>
          {hasWon 
            ? hasProcessedWin 
              ? "You've mastered the lesson!" 
              : "Please wait while we process your achievement..."
            : "You lost all your lives. Want to try again?"}
        </Subtitle>
        
        {wrongAnswers > 0 && (
          <Score>Wrong Answers: {wrongAnswers}</Score>
        )}

        {!hasWon && !isProcessingWin && (
          <div>
            <Subtitle>Pay 0.01 ETH to play again</Subtitle>
            <ButtonContainer>
              <Button 
                onClick={() => handleStartGame("hiragana")}
                disabled={isLoading || !isConnected}
              >
                {isLoading ? "Processing..." : "Try Hiragana"}
              </Button>
              <Button 
                onClick={() => handleStartGame("katakana")}
                disabled={isLoading || !isConnected}
              >
                {isLoading ? "Processing..." : "Try Katakana"}
              </Button>
            </ButtonContainer>
          </div>
        )}

        {hasWon && hasProcessedWin && (
          <ButtonContainer>
            <Button onClick={goToMenu}>
              Play Again
            </Button>
          </ButtonContainer>
        )}

        {error && <ErrorMessage>{error}</ErrorMessage>}
      </Container>
    );
  }

  if (isProcessingWin) {
    return (
      <LoadingOverlay>
        <div>Processing your achievement... Please confirm the transaction 🎮</div>
      </LoadingOverlay>
    );
  }

  return null;
};
