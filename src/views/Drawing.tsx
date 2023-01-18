import { Canvas } from "../components/Canvas";
import { DrawingProps } from "../interfaces";

export const Drawing = ({
  setCurrentView,
  setImage,
  currentWord,
  role,
}: DrawingProps) => {
  const handleSave = () => {
    setCurrentView("guessing");
  };
  return (
    <div>
      <h3>You need to draw: {currentWord}</h3>
      <Canvas setImage={setImage} handleSave={handleSave} role={role} />
    </div>
  );
};
