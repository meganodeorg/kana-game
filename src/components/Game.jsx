import { useGameStore, gameStates } from "../store";
import styled from "styled-components";
import { useEffect } from "react";

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
`;

const Title = styled.h1`
  margin: 0 0 1.5rem 0;
  color: #2d3748;
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: -0.5px;
`;

const KanaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 1rem;
  margin: 1.5rem 0;
`;

const KanaButton = styled.button`
  background: ${props => props.$isWrong 
    ? 'linear-gradient(135deg, #fc8181 0%, #e53e3e 100%)'
    : 'linear-gradient(135deg, #805ad5 0%, #6b46c1 100%)'};
  border: none;
  padding: 1.5rem;
  border-radius: 12px;
  color: white;
  font-size: 2rem;
  cursor: pointer;
  font-family: "Noto Sans JP", sans-serif;
  transition: all 0.3s ease;
  box-shadow: ${props => props.$isWrong 
    ? '0 4px 15px rgba(229, 62, 62, 0.4)'
    : '0 4px 15px rgba(107, 70, 193, 0.4)'};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.$isWrong
      ? '0 8px 20px rgba(229, 62, 62, 0.5)'
      : '0 8px 20px rgba(107, 70, 193, 0.5)'};
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

const Lives = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  margin: 1rem 0;
`;

const Heart = styled.span`
  color: ${props => props.$active ? '#e53e3e' : '#a0aec0'};
  font-size: 1.5rem;
  transition: all 0.3s ease;
  transform: ${props => props.$active ? 'scale(1.1)' : 'scale(1)'};
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

export const Game = () => {
  const gameState = useGameStore((state) => state.gameState);
  const currentStage = useGameStore((state) => state.currentStage);
  const level = useGameStore((state) => state.level);
  const lives = useGameStore((state) => state.lives);
  const maxLives = useGameStore((state) => state.maxLives);
  const lastWrongKana = useGameStore((state) => state.lastWrongKana);
  const kanaTouched = useGameStore((state) => state.kanaTouched);
  const isProcessingWin = useGameStore((state) => state.isProcessingWin);

  useEffect(() => {
    if (gameState === gameStates.GAME_OVER && isProcessingWin) {
      // Handle any cleanup or state changes needed when processing win
      return () => {
        // Cleanup
      };
    }
  }, [gameState, isProcessingWin]);

  if (gameState !== gameStates.GAME) {
    return null;
  }

  return (
    <>
      <Container>
        <Title>Stage {currentStage + 1}</Title>
        <Lives>
          {Array.from({ length: maxLives }).map((_, i) => (
            <Heart key={i} $active={i < lives}>
              ❤
            </Heart>
          ))}
        </Lives>
        <KanaGrid>
          {level[currentStage].map((kana, index) => (
            <KanaButton
              key={index}
              onClick={() => kanaTouched(kana)}
              $isWrong={lastWrongKana?.name === kana.name}
              disabled={isProcessingWin}
            >
              {kana.character}
            </KanaButton>
          ))}
        </KanaGrid>
      </Container>
      
      {isProcessingWin && (
        <LoadingOverlay>
          <div>Minting your achievement NFT... 🎨</div>
        </LoadingOverlay>
      )}
    </>
  );
}; 