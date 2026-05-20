import React, { useEffect, useState, useRef } from 'react';
import yogaPhoto from '../assets/yoga.jpeg';
import { useLanguage } from '../context/LanguageContext';

// Draggable Sticker Component
const DraggableSticker = ({ text, className, color, rotation = 0 }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const startPos = useRef({ x: 0, y: 0 });

  const handlePointerDown = (e) => {
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    startPos.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - startPos.current.x,
      y: e.clientY - startPos.current.y,
    });
  };

  const handlePointerUp = (e) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  return (
    <div
      className={`draggable-sticker neo-border neo-shadow ${className}`}
      style={{
        backgroundColor: color,
        transform: `translate(${position.x}px, ${position.y}px) rotate(${rotation}deg)`,
        cursor: isDragging ? 'grabbing' : 'grab',
        zIndex: isDragging ? 50 : 15,
        touchAction: 'none'
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <div className="sticker-tape"></div>
      <span className="sticker-text">{text}</span>
    </div>
  );
};

const Hero = () => {
  const [scrollY, setScrollY] = useState(0);
  const [time, setTime] = useState(new Date());
  const { t, toggleLanguage } = useLanguage();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });

    const timer = setInterval(() => setTime(new Date()), 1000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(timer);
    };
  }, []);

  const localTime = time.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' }).replace('.', ':');
  const tokyoTime = time.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Tokyo' });

  return (
    <section className="hero-wrapper">

      {/* ── SCATTERED KANJI — menunjukkan belajar 日本語 ── */}
      {/* 日 — hari/matahari, dari 日本語 */}
      <span aria-hidden="true" className="ks ks-1" style={{ transform: `translateY(${scrollY * -0.04}px) rotate(-6deg)` }}>日</span>
      {/* 本 — akar/buku, dari 日本語 */}
      <span aria-hidden="true" className="ks ks-2" style={{ transform: `translateY(${scrollY * 0.05}px) rotate(5deg)` }}>本</span>
      {/* 語 — bahasa */}
      <span aria-hidden="true" className="ks ks-3" style={{ transform: `translateY(${scrollY * -0.03}px) rotate(10deg)` }}>語</span>
      {/* 文 — tulisan/kalimat */}
      <span aria-hidden="true" className="ks ks-4" style={{ transform: `translateY(${scrollY * 0.04}px) rotate(-5deg)` }}>文</span>
      {/* 字 — karakter/huruf */}
      <span aria-hidden="true" className="ks ks-5" style={{ transform: `translateY(${scrollY * -0.06}px) rotate(3deg)` }}>字</span>
      {/* 学 — belajar */}
      <span aria-hidden="true" className="ks ks-6" style={{ transform: `translateY(${scrollY * 0.03}px) rotate(-12deg)` }}>学</span>

      {/* ── DRAGGABLE STICKERS ── */}
      <DraggableSticker text={t("100% RAW", "100% 生")} className="sticker-1" color="var(--pink)" rotation={-5} />
      <DraggableSticker text={t("NO RULES", "ルールなし")} className="sticker-2" color="var(--cyan)" rotation={8} />
      <DraggableSticker text={t("DRAG ME :)", "ドラッグして :)")} className="sticker-3" color="var(--lime)" rotation={-12} />

      {/* ── EASTER EGG TRIGGER ── */}
      <div
        className="easter-egg-zone"
        onClick={toggleLanguage}
        title="Secret Button"
      >
        <svg className="egg-icon-svg" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="40" stroke="var(--black)" strokeWidth="6" strokeDasharray="10 5" />
          <circle cx="50" cy="50" r="15" fill="var(--black)" />
          <path d="M50 0V20M50 80V100M0 50H20M80 50H100" stroke="var(--black)" strokeWidth="6" />
        </svg>
      </div>

      {/* ── LEFT COLUMN ── */}
      <div className="hero-left">
        <h1 className="hero-title">
          <span>{t("VIBE CODER", "ヴァイブコーダー")}</span>
          <span className="text-outline">{t("DEV &", "開発者 &")}</span>
          <span>{t("DESIGNER", "デザイナー")}</span>
        </h1>

        {/* Badge: sedang belajar 日本語 */}
        <div className="jp-learning-badge">
          <span className="jp-badge-flag">🇯🇵</span>
          <div className="jp-badge-text">
            <span className="jp-badge-label">{t("CURRENTLY LEARNING", "現在学習中")}</span>
            <span className="jp-badge-value">{t("日本語 · NIHONGO", "日本語 · JAPANESE")}</span>
          </div>
          <span className="jp-badge-level">N5→N4</span>
        </div>

        <div className="hero-footer-content">
          <div className="hero-desc-box neo-border neo-shadow">
            <p>{t("Building raw digital experiences with energy and precision. Breaking the rules to create something truly unforgettable.", "エネルギーと精度をもって生のデジタル体験を構築します。ルールを破り、本当に忘れられないものを作り出します。")}</p>
          </div>
          <div className="hero-actions">
            <button className="neo-btn primary">{t("View Projects", "プロジェクトを見る")} <span>↓</span></button>
            <button className="neo-btn secondary">{t("My Resume", "履歴書")} <span>↗</span></button>
          </div>
        </div>

        {/* ── LIVE TIME WIDGET ── */}
        <div className="time-widget neo-border neo-shadow">
          <div className="time-row">
            <span className="time-label">JKT</span>
            <span className="time-value">{localTime}</span>
            <div className="status-dot blink"></div>
          </div>
          <div className="time-row">
            <span className="time-label">TKY</span>
            <span className="time-value">{tokyoTime}</span>
            <div className="status-dot" style={{ backgroundColor: 'var(--purple)' }}></div>
          </div>
        </div>
      </div>

      {/* ── RIGHT COLUMN — Photo & Decor ── */}
      <div className="hero-right">
        {/* Decor to fill empty space */}
        <div className="hero-right-decor">
          <div className="decor-badge neo-border neo-shadow">
            <div className="status-dot blink"></div>
            <span>{t("AVAILABLE FOR WORK", "お仕事募集中")}</span>
          </div>
          <div className="decor-star">✺</div>
        </div>

        <div className="hero-photo-wrap">
          <div className="hero-photo-frame neo-shadow">
            <img src={yogaPhoto} alt="Prayoga Affandi" className="hero-photo" />
          </div>
          <div className="hero-photo-label neo-border">
            <span>{t("PRAYOGA AFFANDI", "プラヨガ・アファンディ")}</span>
            <span className="label-arrow">↗</span>
          </div>
        </div>
      </div>

    </section>
  );
};

export default Hero;
