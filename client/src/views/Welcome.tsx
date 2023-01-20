interface WelcomeProps {
  goToWordChoosing: () => void;
  waitingForSecondPlayer: boolean;
  role: string;
}

export const Welcome = ({
  goToWordChoosing,
  role,
  waitingForSecondPlayer,
}: WelcomeProps) => {
  return (
    <div>
      <h1>Welcome {role}</h1>
      <button
        className={`${waitingForSecondPlayer ? "welcome-button-disabled" : ""}`}
        disabled={waitingForSecondPlayer}
        onClick={goToWordChoosing}
      >
        Start Game
      </button>
    </div>
  );
};
