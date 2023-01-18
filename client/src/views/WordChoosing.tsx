import randomWords from "random-words";
import { useEffect, useState } from "react";
import { wordList } from "../words";

interface WordChoosingProps {
  startGame: (difficulty: string) => void;
}

export const WordChoosing = ({ startGame }: WordChoosingProps) => {
  const [words, setWords] = useState<string[]>([]);
  useEffect(() => {
    const originalArr = wordList;
    const difficulty = [
      [3, 4],
      [5, 5],
      [6, 20],
    ];
    const words = difficulty.map((diff) => {
      return originalArr.filter(
        (word) => word.length >= diff[0] && word.length <= diff[1]
      );
    });

    const wordsArr = words.map(
      (arr) => arr[Math.floor(Math.random() * arr.length)]
    );

    setWords(wordsArr);
  }, []);

  return (
    <div>
      <h1>WordChoosing</h1>
      <main>
        <h3>Please Choose Difficulty:</h3>
        {words.map((word) => (
          <button key={word} onClick={() => startGame(word)}>
            {word}
          </button>
        ))}
      </main>
    </div>
  );
};
