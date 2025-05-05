import { useGameStore } from "../store";

export const LivesDisplay = () => {
  const { lives, maxLives, gameState } = useGameStore((state) => ({
    lives: state.lives,
    maxLives: state.maxLives,
    gameState: state.gameState,
  }));

  if (gameState !== "GAME") return null;

  return (
    <div className="lives-display">
      {[...Array(maxLives)].map((_, index) => (
        <span 
          key={index} 
          className={`life-heart ${index < lives ? 'active' : 'inactive'}`}
        >
          ❤️
        </span>
      ))}
    </div>
  );
}; 