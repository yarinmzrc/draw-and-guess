export enum GameStatus {
  notStarted = "NOT STARTED",
  playerOneConnected = "PLAYER ONE CONNECTED",
  playerTwoConnected = "PLAYER TWO CONNECTED",
}

export interface DrawingProps {
  setCurrentView: React.Dispatch<React.SetStateAction<string>>;
  setImage: React.Dispatch<React.SetStateAction<string>>;
  currentWord: string | null;
  role: string;
}

export interface GuessingProps {
  image: string;
  currentWord: null | string;
  gameDifficulty: string;
  playerDrawing: string;
  points: number[];
  setPoints: React.Dispatch<React.SetStateAction<number[]>>;
  resetGame: () => void;
}

export interface CanvasProps {
  role: string;
  setImage: React.Dispatch<React.SetStateAction<string>>;
  handleSave?: () => void;
}
