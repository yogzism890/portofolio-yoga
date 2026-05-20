import React, { useEffect, useState, useRef } from 'react';

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [trailPosition, setTrailPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [hoverType, setHoverType] = useState(''); // 'link', 'btn', 'input'
  const [isVisible, setIsVisible] = useState(false);

  const requestRef = useRef();
  const previousTimeRef = useRef();

  // Easing factor untuk efek spring trailing (0.15 = pegas halus tapi responsif)
  const EASING = 0.15; 

  useEffect(() => {
    // 1. Tampilkan kursor saat mouse pertama kali bergerak masuk ke layar
    const onMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const onMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);

    // 2. Loop Animasi Pegas (Spring Animation) menggunakan requestAnimationFrame untuk FPS 60+ mulus
    const animateTrail = (time) => {
      setTrailPosition((prev) => {
        const dx = position.x - prev.x;
        const dy = position.y - prev.y;
        return {
          x: prev.x + dx * EASING,
          y: prev.y + dy * EASING
        };
      });
      requestRef.current = requestAnimationFrame(animateTrail);
    };

    requestRef.current = requestAnimationFrame(animateTrail);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      cancelAnimationFrame(requestRef.current);
    };
  }, [position, isVisible]);

  // 3. Deteksi hover pada elemen clickable
  useEffect(() => {
    const handleMouseOver = (e) => {
      const target = e.target;
      
      // Deteksi tombol, link, input, textarea, kartu proyek, atau custom hover-target
      const isClickable = 
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.closest('a') || 
        target.closest('button') ||
        target.closest('.neo-btn') || 
        target.closest('.project-card') ||
        target.closest('.view-case') ||
        target.closest('.sticker-tape') ||
        target.tagName === 'INPUT' || 
        target.tagName === 'TEXTAREA';

      if (isClickable) {
        setIsHovered(true);
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
          setHoverType('input');
        } else if (target.closest('.neo-btn') || target.tagName === 'BUTTON') {
          setHoverType('btn');
        } else {
          setHoverType('link');
        }
      } else {
        setIsHovered(false);
        setHoverType('');
      }
    };

    document.addEventListener('mouseover', handleMouseOver);
    return () => {
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  if (!isVisible) return null;

  // Tentukan warna latar kotak cursor trail berdasarkan hover state
  let trailBg = 'var(--lime)';
  if (isHovered) {
    if (hoverType === 'link') trailBg = 'var(--pink)';
    else if (hoverType === 'btn') trailBg = 'var(--cyan)';
    else if (hoverType === 'input') trailBg = 'var(--white)';
  }

  return (
    <>
      {/* 1. Titik Pusat (Dot Cursor) */}
      <div 
        className="custom-cursor-dot"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '8px',
          height: '8px',
          backgroundColor: 'var(--black)',
          borderRadius: '50%',
          transform: `translate3d(${position.x - 4}px, ${position.y - 4}px, 0)`,
          pointerEvents: 'none',
          zIndex: 99999,
          transition: 'transform 0.05s ease-out'
        }}
      />

      {/* 2. Kotak Pegas Pengikut (Chunky Follower Box) */}
      <div 
        className={`custom-cursor-trail ${isHovered ? 'hovered' : ''}`}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: isHovered ? '32px' : '20px',
          height: isHovered ? '32px' : '20px',
          backgroundColor: trailBg,
          border: '3px solid var(--black)',
          boxShadow: isHovered ? '4px 4px 0px 0px var(--black)' : '2px 2px 0px 0px var(--black)',
          transform: `translate3d(${trailPosition.x - (isHovered ? 16 : 10)}px, ${trailPosition.y - (isHovered ? 16 : 10)}px, 0) rotate(${isHovered ? '45deg' : '0deg'})`,
          pointerEvents: 'none',
          zIndex: 99998,
          transition: 'width 0.2s, height 0.2s, background-color 0.25s, box-shadow 0.2s, transform 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }}
      />

      {/* 3. Global CSS Injection untuk mematikan kursor default browser (hanya pada desktop) */}
      <style dangerouslySetInnerHTML={{__html: `
        @media (pointer: fine) {
          body, a, button, input, textarea, select, .neo-btn, .project-card, .view-case {
            cursor: none !important;
          }
        }
      `}} />
    </>
  );
};

export default CustomCursor;
