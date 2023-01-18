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
        disabled={waitingForSecondPlayer ? true : false}
        onClick={goToWordChoosing}
      >
        Start Game
      </button>
    </div>
  );
};
