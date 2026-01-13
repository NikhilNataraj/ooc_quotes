import { useEffect, useState } from "react";
import "./styles.css";

export default function App() {
  const [quotes, setQuotes] = useState([]);
  const [current, setCurrent] = useState("");
  const [setup, setSetup] = useState("");
  const [chaosLevel, setChaosLevel] = useState(5);
  const [isDark, setIsDark] = useState(false);

  const setups = [
    "Brace yourself for:", "Your brain cannot unhear:", "Gold incoming:",
    "Prepare your soul:", "We present you with chaos:", "Here comes trouble:",
    "This goes straight into the archives:", "Academically unacceptable but hilarious:"
  ];

  const scoreChaos = (quote) => {
    const strong = ["penetration", "hard", "soft", "drugs", "cream", "squeeze", "touch"];
    const medium = ["delivery", "gentle", "stretch", "young", "size"];
    let score = 0;
    strong.forEach((w) => quote.toLowerCase().includes(w) && (score += 3));
    medium.forEach((w) => quote.toLowerCase().includes(w) && (score += 1));
    return Math.min(score, 10);
  };

  useEffect(() => {
    fetch("/quotes.txt")
      .then((res) => res.text())
      .then((text) => {
        const list = text.split("\n").map((q) => q.trim()).filter((q) => q.length > 0);
        const enriched = list.map((q) => ({ text: q, chaos: scoreChaos(q) }));
        setQuotes(enriched);
      });
  }, []);

  useEffect(() => {
    if (quotes.length === 0) return;
    const rotate = () => {
      const idx = Math.floor(Math.random() * quotes.length);
      const sIdx = Math.floor(Math.random() * setups.length);
      const chosen = quotes[idx];
      setCurrent(chosen.text);
      setSetup(setups[sIdx]);
      setChaosLevel(chosen.chaos);
    };
    rotate();
    const interval = setInterval(rotate, 3000);
    return () => clearInterval(interval);
  }, [quotes]);

  return (
    /* This outer div now handles the full background color */
    <div className="app-wrapper" data-theme={isDark ? "dark" : "light"}>
      <div className="container">
        <button className="theme-toggle" onClick={() => setIsDark(!isDark)}>
          {isDark ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>

        <h1 className="header">Out-of-Context ADSA Quotes</h1>

        <div className="rotation-card" style={{ boxShadow: `0 0 ${chaosLevel * 4}px var(--accent)` }}>
          <p className="setup">{setup}</p>
          <p className="punchline animated-text">“{current}”</p>
        </div>

        <h2 className="all-header">All Quotes</h2>
        <div className="quote-grid">
          {quotes.map((q, i) => (
            <div className="quote-card" key={i}>{q.text}</div>
          ))}
        </div>
      </div>
    </div>
  );
}