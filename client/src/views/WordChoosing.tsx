import randomWords from "random-words";
import { useEffect, useState } from "react";
import { wordList, wordsArr } from "../words";

interface WordChoosingProps {
  startGame: (difficulty: string) => void;
}

export const WordChoosing = ({ startGame }: WordChoosingProps) => {
  const [words, setWords] = useState<string[]>([]);
  useEffect(() => {
    const wordsToSet = wordsArr.map(
      (arr) => arr[Math.floor(Math.random() * arr.length)]
    );
    setWords(wordsToSet);
  }, []);

  const pointsToShow = (word) =>
    word.length >= 6 ? "5 Points" : word.length >= 5 ? "3 Points" : "1 Point";

  return (
    <div>
      <h1>WordChoosing</h1>
      <main>
        <h3>Please Choose Difficulty:</h3>
        <div className="word-choosing-container">
          {words.map((word) => (
            <div className="word-choosing-button-container" key={word}>
              <button onClick={() => startGame(word)}>{word}</button>
              <p>{pointsToShow(word)}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};
