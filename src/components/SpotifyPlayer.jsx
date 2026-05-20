import React, { useState, useEffect, useRef } from 'react';

const PLAYLIST_ID = '7GJ9GdvbVMZleCo6guStVd';
const PLAYLIST_URL = `https://open.spotify.com/embed/playlist/${PLAYLIST_ID}?utm_source=generator&theme=0`;

const SpotifyPlayer = () => {
  const [isOpen, setIsOpen]       = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 }); // cumulative drag delta
  const [isLoaded, setIsLoaded]   = useState(false);
  const startPos = useRef({ x: 0, y: 0 });
  const playerRef = useRef(null);

  // Show widget after short delay (so loading screen can finish first)
  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), 1800);
    return () => clearTimeout(t);
  }, []);

  // ── Pointer drag on header ──────────────────────────────────────
  const handlePointerDown = (e) => {
    // Don't drag when clicking controls
    if (e.target.closest('.sp-controls')) return;
    setIsDragging(true);
    playerRef.current?.setPointerCapture(e.pointerId);
    startPos.current = {
      x: e.clientX - dragOffset.x,
      y: e.clientY - dragOffset.y,
    };
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    setDragOffset({
      x: e.clientX - startPos.current.x,
      y: e.clientY - startPos.current.y,
    });
  };

  const handlePointerUp = (e) => {
    setIsDragging(false);
    playerRef.current?.releasePointerCapture(e.pointerId);
  };

  const toggleOpen = () => {
    setIsOpen(prev => !prev);
    if (!isLoaded) setIsLoaded(true);
  };

  if (!isVisible) return null;

  return (
    <div
      ref={playerRef}
      className={`sp-container neo-border ${isOpen ? 'sp-open' : 'sp-closed'} ${isDragging ? 'sp-dragging' : ''}`}
      style={{
        // Nudge from default bottom-right by drag delta
        transform: `translate(${dragOffset.x}px, ${dragOffset.y}px)`,
      }}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* ── HEADER / DRAG HANDLE ── */}
      <div
        className="sp-header"
        onPointerDown={handlePointerDown}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <div className="sp-header-left">
          {/* Vinyl disc icon */}
          <div className={`sp-vinyl-icon ${isOpen ? 'sp-vinyl-spinning' : ''}`}>
            <span className="sp-vinyl-disc" />
          </div>

          <div className="sp-title-area">
            <span className="sp-label">NOW PLAYING</span>
            <div className="sp-marquee-wrap">
              <div className="sp-marquee-inner">
                <span>MY PLAYLIST ♪ YOGZNOVACHRONO ♫ SPOTIFY ★ MY PLAYLIST ♪ YOGZNOVACHRONO ♫ SPOTIFY ★ </span>
              </div>
            </div>
          </div>
        </div>

        <div className="sp-controls">
          {/* Spotify logo dot */}
          <div className="sp-spotify-dot" title="Powered by Spotify">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white" aria-hidden="true">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
          </div>

          <button
            className="sp-toggle-btn"
            onClick={toggleOpen}
            aria-label={isOpen ? 'Minimize player' : 'Expand player'}
          >
            {isOpen ? '▼ MIN' : '▲ PLAY'}
          </button>
        </div>
      </div>

      {/* ── EXPANDABLE BODY ── */}
      <div className="sp-body">
        <div className="sp-iframe-wrap">
          {isLoaded ? (
            <iframe
              src={PLAYLIST_URL}
              width="100%"
              height="352"
              frameBorder="0"
              allowFullScreen
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              title="Spotify Playlist — Yogznovachrono"
              className="sp-iframe"
            />
          ) : (
            <div className="sp-placeholder">
              <div className="sp-placeholder-inner">
                <div className="sp-placeholder-icon">♫</div>
                <p>LOADING VIBES...</p>
              </div>
            </div>
          )}
        </div>

        <div className="sp-footer">
          <span className="sp-footer-tag">★ MY VIBE ★</span>
          <a
            href={`https://open.spotify.com/playlist/${PLAYLIST_ID}`}
            target="_blank"
            rel="noopener noreferrer"
            className="sp-open-link"
          >
            OPEN IN SPOTIFY ↗
          </a>
        </div>
      </div>
    </div>
  );
};

export default SpotifyPlayer;
