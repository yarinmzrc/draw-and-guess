import { Canvas } from "../components/Canvas";
import { DrawingProps } from "../interfaces";

export const Drawing = ({ setGameState, gameState, role }: DrawingProps) => {
  const handleSave = () => {
    setGameState((prev) => ({ ...prev, currentView: "guessing" }));
  };
  return (
    <div>
      <h3>You need to draw: {gameState.currentWord}</h3>
      <Canvas
        gameState={gameState}
        setGameState={setGameState}
        handleSave={handleSave}
      />
    </div>
  );
};
