import React, { useState, useEffect } from 'react';

const BOOT_LINES = [
  { text: '> INITIALIZING SYSTEM...', delay: 0 },
  { text: '> LOADING ASSETS........', delay: 300 },
  { text: '> MOUNTING COMPONENTS...', delay: 600 },
  { text: '> CALIBRATING UI.........', delay: 900 },
  { text: '> CHECKING KANJI DB......', delay: 1100 },
  { text: '> ALL SYSTEMS GO ✓', delay: 1400 },
];

export default function LoadingScreen({ onFinish }) {
  const [progress, setProgress] = useState(0);
  const [visibleLines, setVisibleLines] = useState([]);
  const [glitch, setGlitch] = useState(false);
  const [exiting, setExiting] = useState(false);

  // Boot lines appear one by one
  useEffect(() => {
    BOOT_LINES.forEach((line, i) => {
      setTimeout(() => {
        setVisibleLines((prev) => [...prev, line.text]);
      }, line.delay);
    });
  }, []);

  // Progress bar fills over 2.2s
  useEffect(() => {
    let start = null;
    const duration = 2200;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const pct = Math.min((elapsed / duration) * 100, 100);
      setProgress(pct);
      if (pct < 100) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  }, []);

  // Random glitch bursts
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 120);
    }, 700);
    return () => clearInterval(glitchInterval);
  }, []);

  // Exit after 2.6s
  useEffect(() => {
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(() => onFinish(), 700);
    }, 2600);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className={`loader-overlay ${exiting ? 'loader-exit' : ''}`}>
      {/* Background dot grid inherited via CSS */}
      
      {/* Big title glitch */}
      <div className={`loader-title ${glitch ? 'glitch' : ''}`} data-text="YOGA.DEV">
        YOGA.DEV
      </div>

      {/* Terminal window */}
      <div className="loader-terminal">
        <div className="loader-terminal-bar">
          <span className="dot dot-red" />
          <span className="dot dot-yellow" />
          <span className="dot dot-green" />
          <span className="terminal-title">SYSTEM BOOT — v1.0.0</span>
        </div>
        <div className="loader-terminal-body">
          {visibleLines.map((line, i) => (
            <div key={i} className="terminal-line">
              <span className="terminal-cursor">■</span> {line}
            </div>
          ))}
          {/* Blinking cursor on last line */}
          {visibleLines.length < BOOT_LINES.length && (
            <div className="terminal-line blink-cursor">
              <span className="terminal-cursor">■</span> _
            </div>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="loader-progress-wrap">
        <div className="loader-progress-label">
          <span>LOADING</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="loader-progress-bar">
          <div
            className="loader-progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Corner decorations */}
      <div className="loader-corner loader-corner-tl">[ TL ]</div>
      <div className="loader-corner loader-corner-tr">[ TR ]</div>
      <div className="loader-corner loader-corner-bl">[ BL ]</div>
      <div className="loader-corner loader-corner-br">[ BR ]</div>

      {/* Scattered kanji decorations */}
      <span className="loader-kanji lk-1">日</span>
      <span className="loader-kanji lk-2">本</span>
      <span className="loader-kanji lk-3">語</span>
      <span className="loader-kanji lk-4">学</span>
    </div>
  );
}
