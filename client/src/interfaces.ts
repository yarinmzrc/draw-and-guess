export enum GameStatus {
  notStarted = "NOT STARTED",
  playerOneConnected = "PLAYER ONE CONNECTED",
  playerTwoConnected = "PLAYER TWO CONNECTED",
}

export interface DrawingProps {
  gameState: TGameState;
  role: string;
  setGameState: React.Dispatch<React.SetStateAction<any>>;
}

export interface TGameState {
  image: string;
  playerDrawing: string;
  currentWord: string;
  currentView: string;
  gameDifficulty: string;
}

export interface GuessingProps {
  gameState: TGameState;
  points: number[];
  setPoints: React.Dispatch<React.SetStateAction<number[]>>;
  resetGame: () => void;
}

export interface CanvasProps {
  role: string;
  setImage: React.Dispatch<React.SetStateAction<string>>;
  handleSave?: () => void;
}
