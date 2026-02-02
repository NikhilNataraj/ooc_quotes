import { useEffect, useState } from "react";
import "./styles.css";

const logs = [
  "Scanning for awkward silence...",
  "Extracting questionable context...",
  "Calibrating social friction...",
  "Redacting sensitive logic...",
  "Indexing ADSA archives..."
];

const ScrambleText = ({ text }) => {
  const [display, setDisplay] = useState(text);
  const chars = "!<>-_\\/[]{}—=+*^?#________";

  useEffect(() => {
    let frame = 0;
    const interval = setInterval(() => {
      setDisplay(text.split('').map((char, i) => {
        if (char === " ") return " ";
        if (frame > i + 5) return char;
        return chars[Math.floor(Math.random() * chars.length)];
      }).join(''));
      
      frame++;
      if (frame > text.length + 10) clearInterval(interval);
    }, 40);
    return () => clearInterval(interval);
  }, [text]);

  return <span>{display}</span>;
};

export default function App() {
  const [quotes, setQuotes] = useState([]);
  const [current, setCurrent] = useState("");
  const [status, setStatus] = useState("System Standby...");
  const [isDark, setIsDark] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [isAgreed, setIsAgreed] = useState(false); // New state for disclaimer

  useEffect(() => {
    fetch("/quotes.txt")
      .then((res) => res.text())
      .then((text) => {
        const list = text.split("\n").map(q => q.trim()).filter(q => q.length > 0);
        setQuotes(list.map(q => ({
          text: q,
          tilt: Math.random() * 4 - 2 
        })));
      });
  }, []);

  useEffect(() => {
    if (quotes.length === 0 || !isAgreed) return;

    const rotate = () => {
      const chosen = quotes[Math.floor(Math.random() * quotes.length)];
      setCurrent(chosen.text);
      setStatus(logs[Math.floor(Math.random() * logs.length)]);
    };

    rotate(); 
    const interval = setInterval(rotate, 4000);
    return () => clearInterval(interval);
  }, [quotes, isAgreed]);

  const triggerReset = () => {
    const chosen = quotes[Math.floor(Math.random() * quotes.length)];
    setCurrent(chosen.text);
    setStatus(logs[Math.floor(Math.random() * logs.length)]);
    setQuotes(prev => prev.map(q => ({ ...q, tilt: Math.random() * 4 - 2 })));
    setResetKey(k => k + 1);
  };

  const handleDecline = () => {
    window.location.href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"; // Redirect website
  };

  // 1. Render Disclaimer if not agreed
  if (!isAgreed) {
    return (
      <div className="disclaimer-overlay" data-theme={isDark ? "dark" : "light"}>
        <div className="disclaimer-modal physics-bounce">
          <h2 className="header">ACCESS_WARNING</h2>
          <p className="disclaimer-text">
            You are about to enter the <strong>Out-of-Context ADSA Archives</strong>. 
            The content within is strictly for entertainment purposes and lacks any 
            intended professional context. 
            <br /><br />
            By clicking <strong>AGREE</strong>, you acknowledge that you have a sense of humor 
            and will not hold the archive-keepers (or the Professor) liable for any 
            uncontrollable laughter or confusion.
          </p>
          <div className="disclaimer-actions">
            <button className="brutal-btn agree-btn" onClick={() => setIsAgreed(true)}>I_AGREE</button>
            <button className="brutal-btn decline-btn" onClick={handleDecline}>EXIT_SYSTEM</button>
          </div>
        </div>
      </div>
    );
  }

  // 2. Render Main Website
  return (
    <div className="app-wrapper" data-theme={isDark ? "dark" : "light"}>
      <div className="noise-overlay"></div>
      <div className="status-bar">{status}</div>
      
      <div className="nav-controls">
        <button className="brutal-btn" onClick={triggerReset}>SYSTEM_RESET</button>
        <button className="brutal-btn" onClick={() => setIsDark(!isDark)}>
          {isDark ? "LIGHT_MODE" : "DARK_MODE"}
        </button>
      </div>

      <div className="container">
        <h1 className="header">Out-of-Context_ADSA_Quotes</h1>

        <div className="rotation-card physics-bounce" key={`rot-${resetKey}`}>
          <div className="rotation-content">
            <div className="prof-avatar-container">
              <img 
                src={isDark ? "/adsa_img_gen.png" : "/adsa_img.jpg"} 
                alt="Redacted Prof" 
                className="prof-avatar" 
              />
              <div className="eye-redaction-bar"></div>
            </div>
            <div className="quote-text-area">
              <p className="setup">SYSTEM_LOG // {status}</p>
              <p className="punchline">
                “<ScrambleText text={current} />”
              </p>
            </div>
          </div>
        </div>

        <h2 className="all-header">ARCHIVE_COLLECTION</h2>
        
        <div className="quote-grid" key={`grid-${resetKey}`}>
          {quotes.map((q, i) => (
            <div 
              className="quote-card fade-in-item physics-bounce" 
              key={`${resetKey}-${i}`}
              style={{ 
                animationDelay: `${i * 0.05}s`,
                "--original-tilt": `${q.tilt}deg`
              }}
            >
              <span className="redacted-reveal">{q.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}