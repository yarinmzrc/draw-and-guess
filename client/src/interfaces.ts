export enum GameStatus {
  notStarted = "NOT STARTED",
  playerOneConnected = "PLAYER ONE CONNECTED",
  playerTwoConnected = "PLAYER TWO CONNECTED",
}

export interface DrawingProps {
  setCurrentView: any;
  setImage: any;
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
  resetGame: any;
}

export interface CanvasProps {
  role: string;
  setImage: any;
  handleSave?: () => void;
}
