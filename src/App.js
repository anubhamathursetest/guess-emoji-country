import React, { useState, useEffect, useRef } from "react";

// Emoji-country pairs
const EMOJI_COUNTRIES = [
  { emoji: "🇫🇷", country: "France" },
  { emoji: "🇯🇵", country: "Japan" },
  { emoji: "🇧🇷", country: "Brazil" },
  { emoji: "🇨🇦", country: "Canada" },
  { emoji: "🇦🇺", country: "Australia" },
  { emoji: "🇮🇳", country: "India" },
  { emoji: "🇬🇧", country: "United Kingdom" },
  { emoji: "🇺🇸", country: "United States" },
  { emoji: "🇩🇪", country: "Germany" },
  { emoji: "🇮🇹", country: "Italy" },
  { emoji: "🇪🇸", country: "Spain" },
  { emoji: "🇷🇺", country: "Russia" },
  { emoji: "🇲🇽", country: "Mexico" },
  { emoji: "🇨🇳", country: "China" },
  { emoji: "🇿🇦", country: "South Africa" }
];

// Shuffle helper
function shuffle(array) {
  let arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const TOTAL_ROUNDS = 3;
const QUESTIONS_PER_ROUND = 5;
const TIMER_SECONDS = 30;

function App() {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [timer, setTimer] = useState(TIMER_SECONDS);
  const [gameOver, setGameOver] = useState(false);
  const timerRef = useRef();

  // Start Game
  useEffect(() => {
    setQuestions(shuffle(EMOJI_COUNTRIES).slice(0, TOTAL_ROUNDS * QUESTIONS_PER_ROUND));
  }, []);

  // Timer logic
  useEffect(() => {
    if (gameOver || showAnswer) return;
    if (timer === 0) {
      setShowAnswer(true);
      return;
    }
    timerRef.current = setTimeout(() => setTimer(timer - 1), 1000);
    return () => clearTimeout(timerRef.current);
  }, [timer, gameOver, showAnswer]);

  // Next question
  const handleNext = () => {
    if (current + 1 >= questions.length) {
      setGameOver(true);
    } else {
      setCurrent(current + 1);
      setUserAnswer("");
      setShowAnswer(false);
      setTimer(TIMER_SECONDS);
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (showAnswer) return;
    if (userAnswer.trim().toLowerCase() === questions[current].country.toLowerCase()) {
      setScore(score + 1);
      setShowAnswer(true);
    } else {
      setShowAnswer(true);
    }
  };

  if (questions.length === 0) return <div>Loading...</div>;
  if (gameOver)
    return (
      <div style={{ textAlign: "center", marginTop: "2em" }}>
        <h1>Game Over!</h1>
        <h2>Your Score: {score} / {questions.length}</h2>
        <button onClick={() => { window.location.reload(); }}>Play Again</button>
      </div>
    );

  const round = Math.floor(current / QUESTIONS_PER_ROUND) + 1;
  const qNum = (current % QUESTIONS_PER_ROUND) + 1;
  const currentQ = questions[current];

  return (
    <div style={{ maxWidth: 400, margin: "2em auto", fontFamily: "sans-serif", textAlign: "center" }}>
      <h1>Guess the Country by Emoji</h1>
      <h2>Round {round} / {TOTAL_ROUNDS}</h2>
      <div>Question {qNum} / {QUESTIONS_PER_ROUND}</div>
      <div style={{ fontSize: "5em", margin: "1em" }}>{currentQ.emoji}</div>
      <div>
        <b>Time Left: {timer}s</b>
      </div>
      <form onSubmit={handleSubmit} style={{ margin: "1em 0" }}>
        <input
          type="text"
          value={userAnswer}
          disabled={showAnswer}
          onChange={e => setUserAnswer(e.target.value)}
          placeholder="Type country name"
          style={{ fontSize: "1em", padding: "0.5em", width: "80%" }}
        />
        <button type="submit" disabled={showAnswer} style={{ marginLeft: "0.5em" }}>Guess</button>
      </form>
      {showAnswer && (
        <div>
          {userAnswer.trim().toLowerCase() === currentQ.country.toLowerCase() ? (
            <div style={{ color: "green", fontWeight: "bold" }}>Correct! +1 point</div>
          ) : (
            <div style={{ color: "red", fontWeight: "bold" }}>
              Wrong or timed out! <br />
              Correct answer: {currentQ.country}
            </div>
          )}
          <button onClick={handleNext} style={{ marginTop: "1em" }}>
            {current + 1 === questions.length ? "Finish" : "Next"}
          </button>
        </div>
      )}
      <div style={{ marginTop: "2em" }}>
        Current Score: {score}
      </div>
    </div>
  );
}

export default App;