import React, { useState, useEffect, useRef } from 'react';

const PLAYLIST_ID = '7GJ9GdvbVMZleCo6guStVd';

// SVG Icons — clean, no emoji
const IconVinyl = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <circle cx="12" cy="12" r="3"/>
    <line x1="12" y1="2" x2="12" y2="5"/>
    <line x1="12" y1="19" x2="12" y2="22"/>
    <line x1="2" y1="12" x2="5" y2="12"/>
    <line x1="19" y1="12" x2="22" y2="12"/>
  </svg>
);

const IconSpotify = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
  </svg>
);

const IconChevronUp = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
    <polyline points="18 15 12 9 6 15"/>
  </svg>
);

const IconChevronDown = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

const IconMusicNote = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M9 18V5l12-2v13"/>
    <circle cx="6" cy="18" r="3"/>
    <circle cx="18" cy="16" r="3"/>
  </svg>
);

// ── MAIN COMPONENT ─────────────────────────────────────────────────
const SpotifyPlayer = ({ isLoaded }) => {
  const [isOpen, setIsOpen]         = useState(false);
  const [isVisible, setIsVisible]   = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const startPos = useRef({ x: 0, y: 0 });
  const playerRef = useRef(null);

  // Appear only after loading screen is fully done
  useEffect(() => {
    if (!isLoaded) return;
    // Small extra delay for smooth entrance after page appears
    const t = setTimeout(() => {
      setIsVisible(true);
      // Auto-expand after appearing
      setTimeout(() => {
        setIsOpen(true);
        setIframeLoaded(true);
      }, 600);
    }, 400);
    return () => clearTimeout(t);
  }, [isLoaded]);

  // ── DRAG ─────────────────────────────────────────────────────────
  const handlePointerDown = (e) => {
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

  const toggleOpen = (e) => {
    e.stopPropagation();
    if (!iframeLoaded) setIframeLoaded(true);
    setIsOpen(prev => !prev);
  };

  if (!isVisible) return null;

  // Autoplay param in URL
  const embedUrl = `https://open.spotify.com/embed/playlist/${PLAYLIST_ID}?utm_source=generator&theme=0&autoplay=1`;

  return (
    <div
      ref={playerRef}
      className={`sp-container neo-border ${isOpen ? 'sp-open' : 'sp-closed'} ${isDragging ? 'sp-dragging' : ''}`}
      style={{
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
        {/* Left: Vinyl + marquee */}
        <div className="sp-header-left">
          <div className={`sp-vinyl-icon ${isOpen ? 'sp-vinyl-spinning' : ''}`}>
            <IconVinyl />
          </div>
          <div className="sp-title-area">
            <span className="sp-label">NOW PLAYING</span>
            <div className="sp-marquee-wrap">
              <div className="sp-marquee-inner">
                <span>MY PLAYLIST · YOGZNOVACHRONO · SPOTIFY · MY PLAYLIST · YOGZNOVACHRONO · SPOTIFY · </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Controls */}
        <div className="sp-controls">
          <div className="sp-spotify-dot" title="Powered by Spotify">
            <IconSpotify />
          </div>
          <button
            className="sp-toggle-btn"
            onClick={toggleOpen}
            aria-label={isOpen ? 'Minimize player' : 'Expand player'}
          >
            {isOpen ? <IconChevronDown /> : <IconChevronUp />}
          </button>
        </div>
      </div>

      {/* ── EXPANDABLE BODY ── */}
      <div className="sp-body">
        <div className="sp-iframe-wrap">
          {iframeLoaded ? (
            <iframe
              src={embedUrl}
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
                <div className="sp-placeholder-icon">
                  <IconMusicNote />
                </div>
                <p>LOADING VIBES...</p>
              </div>
            </div>
          )}
        </div>

        <div className="sp-footer">
          <span className="sp-footer-tag">MY VIBE</span>
          <a
            href={`https://open.spotify.com/playlist/${PLAYLIST_ID}`}
            target="_blank"
            rel="noopener noreferrer"
            className="sp-open-link"
          >
            OPEN IN SPOTIFY
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

export default SpotifyPlayer;
