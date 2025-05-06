import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { kanas } from "./constants";
import { web3Service } from "./services/web3Service";

export const gameStates = {
  MENU: "MENU",
  GAME: "GAME",
  GAME_OVER: "GAME_OVER",
  WAITING_CONFIRMATION: "WAITING_CONFIRMATION",
};

export const playAudio = (path, callback) => {
  const audio = new Audio(`./sounds/${path}.mp3`);
  if (callback) {
    audio.addEventListener("ended", callback);
  }
  audio.play();
};

export const generateGameLevel = ({ nbStages }) => {
  const level = [];
  const goodKanas = [];

  for (let i = 0; i < nbStages; i++) {
    const stage = [];
    const nbOptions = 3 + i;
    for (let j = 0; j < nbOptions; j++) {
      let kana = null;
      while (!kana || stage.includes(kana) || goodKanas.includes(kana)) {
        kana = kanas[Math.floor(Math.random() * kanas.length)];
      }
      stage.push(kana);
    }
    const goodKana = stage[Math.floor(Math.random() * stage.length)];
    goodKana.correct = true;
    goodKanas.push(goodKana);
    level.push(stage);
  }
  return level;
};

export const useGameStore = create(
  subscribeWithSelector((set, get) => ({
    level: null,
    currentStage: 0,
    currentKana: null,
    lastWrongKana: null,
    mode: "hiragana",
    gameState: gameStates.MENU,
    wrongAnswers: 0,
    lives: 3,
    maxLives: 3,
    isProcessingWin: false,
    hasProcessedWin: false,

    startGame: async ({ mode }) => {
      const level = generateGameLevel({ nbStages: 5 });
      const currentKana = level[0].find((kana) => kana.correct);
      playAudio("start", () => {
        playAudio(`kanas/${currentKana.name}`);
      });
      set({
        level,
        currentStage: 0,
        currentKana,
        gameState: gameStates.GAME,
        mode,
        wrongAnswers: 0,
        lives: 3,
        hasProcessedWin: false,
      });
    },

    nextStage: () => {
      set((state) => {
        if (state.currentStage + 1 === state.level.length) {
          playAudio("congratulations");
          set({ isProcessingWin: true });
          
          // Handle game win
          const gameType = state.mode === "hiragana" ? 0 : 1;
          web3Service.onGameWon(window.ethereum.selectedAddress, gameType)
            .then(() => {
              set({ 
                isProcessingWin: false,
                hasProcessedWin: true
              });
            })
            .catch((error) => {
              console.error("Error processing win:", error);
              set({ 
                isProcessingWin: false,
                hasProcessedWin: false
              });
            });

          return {
            currentStage: 0,
            currentKana: null,
            level: null,
            gameState: gameStates.GAME_OVER,
            lastWrongKana: null,
          };
        }
        const currentStage = state.currentStage + 1;
        const currentKana = state.level[currentStage].find(
          (kana) => kana.correct
        );
        playAudio("good");
        playAudio(`correct${currentStage % 3}`, () => {
          playAudio(`kanas/${currentKana.name}`);
        });
        return { currentStage, currentKana, lastWrongKana: null };
      });
    },

    goToMenu: () => {
      set({
        gameState: gameStates.MENU,
        hasProcessedWin: false,
      });
    },

    loseLife: () => {
      set((state) => {
        const newLives = state.lives - 1;
        if (newLives <= 0) {
          playAudio("fall", () => {
            playAudio("fail");
          });
          return {
            lives: 0,
            gameState: gameStates.GAME_OVER,
            currentStage: 0,
            currentKana: null,
            level: null,
            lastWrongKana: null,
          };
        }
        return { lives: newLives };
      });
    },

    kanaTouched: (kana) => {
      const currentKana = get().currentKana;
      if (currentKana.name === kana.name) {
        get().nextStage();
      } else {
        playAudio("wrong");
        playAudio(`kanas/${kana.name}`, () => {
          playAudio("fail");
        });
        set((state) => {
          const newLives = state.lives - 1;
          if (newLives <= 0) {
            return {
              lives: 0,
              gameState: gameStates.GAME_OVER,
              currentStage: 0,
              currentKana: null,
              level: null,
              lastWrongKana: null,
              wrongAnswers: state.wrongAnswers + 1,
            };
          }
          return {
            lives: newLives,
            wrongAnswers: state.wrongAnswers + 1,
            lastWrongKana: kana,
          };
        });
      }
    },

    // CHARACTER CONTROLLER
    characterState: "Idle",
    setCharacterState: (characterState) =>
      set({
        characterState,
      }),
  }))
);
