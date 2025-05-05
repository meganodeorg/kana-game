import { gameStates, useGameStore } from "../store";

export const Menu = () => {
  const { startGame, gameState, goToMenu, lives } = useGameStore((state) => ({
    startGame: state.startGame,
    gameState: state.gameState,
    goToMenu: state.goToMenu,
    lives: state.lives,
  }));

  return (
    <>
      <div
        className={`menu ${
          gameState !== gameStates.MENU ? "menu--hidden" : ""
        }`}
      >
        <div>
          <h1>Kana Game</h1>
          <p>What do you want to practice today?</p>
        </div>
        <button
          disabled={gameState !== gameStates.MENU}
          onClick={() => startGame({ mode: "hiragana" })}
        >
          Hiragana
        </button>
        <button
          disabled={gameState !== gameStates.MENU}
          onClick={() => startGame({ mode: "katakana" })}
        >
          Katakana
        </button>
        <div>
          <p>
            Forked from{" "}
            <a href="https://github.com/wass08" target="_blank">
              Wawa Sensei
            </a>
          </p>
        </div>
      </div>
      <div
        className={`scores ${
          gameState !== gameStates.GAME_OVER ? "scores--hidden" : ""
        }`}
      >
        {lives <= 0 ? (
          <>
            <h1>Game Over!</h1>
            <p>You lose all your lives.</p>
            <div className="game-over-buttons">
              <button onClick={() => startGame({ mode: "hiragana" })}>
                Play again Hiragana
              </button>
              <button onClick={() => startGame({ mode: "katakana" })}>
                Play again Katakana
              </button>
              <button onClick={goToMenu}>Back to Menu</button>
            </div>
          </>
        ) : (
          <>
            <h1>Congratulations!</h1>
            <p>You have completed the lesson!</p>
            <div className="game-over-buttons">
              <button onClick={() => startGame({ mode: "hiragana" })}>
                Play again Hiragana
              </button>
              <button onClick={() => startGame({ mode: "katakana" })}>
                Play again Katakana
              </button>
              <button onClick={goToMenu}>Back to Menu</button>
            </div>
          </>
        )}
      </div>
    </>
  );
};
