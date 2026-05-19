import React, { useState, useEffect, useRef } from 'react';
import { toKatakana } from 'wanakana';
import html2canvas from 'html2canvas';
import { useLanguage } from '../context/LanguageContext';
import avatarCowo from '../assets/avatar/cowo.png';
import avatarCewe from '../assets/avatar/cewe.png';

// ─── DRAGGABLE TAPE COMPONENT ───
const DraggableTape = ({ text, color, rotation = 0, top, left, zIndex = 5 }) => {
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
      className="draggable-tape neo-border"
      style={{
        backgroundColor: color,
        transform: `translate(${position.x}px, ${position.y}px) rotate(${rotation}deg)`,
        top: top,
        left: left,
        cursor: isDragging ? 'grabbing' : 'grab',
        zIndex: isDragging ? 50 : zIndex,
        touchAction: 'none'
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <div className="tape-pattern"></div>
      <span className="tape-text">{text}</span>
    </div>
  );
};

// ─── CYBER-GLITCH TEXT COMPONENT ───
const GlitchText = ({ text, isActive }) => {
  const [displayText, setDisplayText] = useState('');
  
  useEffect(() => {
    if (!isActive) {
      setDisplayText('');
      return;
    }

    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    let iterations = 0;
    const maxIterations = 20;
    
    const interval = setInterval(() => {
      setDisplayText(prev => {
        return text.split('').map((char, index) => {
          if (index < iterations / 2) return char;
          return chars[Math.floor(Math.random() * chars.length)];
        }).join('');
      });
      
      iterations++;
      if (iterations >= maxIterations * 2) {
        clearInterval(interval);
        setDisplayText(text);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [text, isActive]);

  return <>{displayText}</>;
};

const Services = () => {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [katakana, setKatakana] = useState('');
  const [isFlipped, setIsFlipped] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [stats, setStats] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  
  const cardRef = useRef(null);
  const [tiltStyle, setTiltStyle] = useState({});
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const customToKatakana = (str) => {
    let processed = str.trim().toLowerCase();
    processed = processed.replace(/h$/g, ''); 
    processed = processed.replace(/v/g, 'b'); 
    
    let result = toKatakana(processed);
    result = result.replace(/[a-zA-Z]/g, ''); 
    return result || 'エラー'; 
  };

  const generateStats = (seedName) => {
    let hash = 0;
    for (let i = 0; i < seedName.length; i++) {
      hash = seedName.charCodeAt(i) + ((hash << 5) - hash);
    }
    const seed = Math.abs(hash);
    const classes = ['NETRUNNER', 'ST. SAMURAI', 'CORPO', 'TECHIE', 'NOMAD', 'MEDTECH'];
    const roles = ['HACKER', 'BOUNTY HUNTER', 'SMUGGLER', 'FIXER', 'MERCENARY'];
    
    return {
      classType: classes[seed % classes.length],
      role: roles[seed % roles.length],
      str: 40 + (seed % 60), 
      int: 40 + ((seed >> 2) % 60),
      agi: 40 + ((seed >> 4) % 60),
      serial: 'NX-' + seed.toString(16).toUpperCase().padStart(8, '0'),
      bounty: (seed % 1000) * 1000 + 50000 
    };
  };

  const handleGenerate = () => {
    if (name.trim() === '') return;
    
    const randomAvatar = Math.random() > 0.5 ? avatarCowo : avatarCewe;
    setPhoto(randomAvatar);
    setStats(generateStats(name.trim()));
    setKatakana(customToKatakana(name));
    setIsFlipped(true);
  };

  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      setIsCameraOpen(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      }, 100);
    } catch (err) {
      console.warn("Webcam access denied or unavailable", err);
      alert("Kamera tidak diizinkan atau tidak tersedia!");
    }
  };

  const takeSnapshot = (e) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = 180;
    canvas.height = 220;
    const ctx = canvas.getContext('2d');
    
    const size = Math.min(video.videoWidth, video.videoHeight);
    const x = (video.videoWidth - size) / 2;
    const y = (video.videoHeight - size) / 2;
    ctx.drawImage(video, x, y, size, size, 0, 0, canvas.width, canvas.height);
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    setPhoto(canvas.toDataURL('image/jpeg'));
    setIsCameraOpen(false);
  };

  const handleReset = (e) => {
    e.stopPropagation(); 
    setIsFlipped(false);
    setTiltStyle({});
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraOpen(false);
    
    setTimeout(() => {
      setName('');
      setKatakana('');
      setPhoto(null);
      setStats(null);
    }, 400);
  };

  const handleDownload = async (e) => {
    e.stopPropagation();
    setIsDownloading(true);
    
    const oldTilt = tiltStyle;
    setTiltStyle({}); // Reset tilt temporariily so html2canvas captures it flat
    
    setTimeout(async () => {
      const element = document.querySelector('.flip-card-back');
      
      // Create a clone to render without any 3D transforms interfering
      const clone = element.cloneNode(true);
      document.body.appendChild(clone);
      
      const rect = element.getBoundingClientRect();
      
      // Style the clone so it's visible to html2canvas but flat and off-screen
      clone.style.position = 'fixed';
      clone.style.top = '0';
      clone.style.left = '-9999px';
      clone.style.transform = 'none';
      clone.style.margin = '0';
      clone.style.width = `${rect.width}px`;
      clone.style.height = `${rect.height}px`;
      
      // Hide buttons on the clone
      const buttons = clone.querySelectorAll('.action-btn');
      buttons.forEach(b => b.style.display = 'none');
      
      const canvas = await html2canvas(clone, {
        backgroundColor: null,
        scale: 2 // High res
      });
      
      // Cleanup clone
      document.body.removeChild(clone);
      
      const link = document.createElement('a');
      link.download = `cyber-id-${name.replace(/\s+/g, '-').toLowerCase()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      setTiltStyle(oldTilt);
      setIsDownloading(false);
    }, 300); // give time for css transform to reset
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleGenerate();
    }
  };

  // ─── 3D TILT EFFECT ───
  const handleMouseMove = (e) => {
    if (!isFlipped || !cardRef.current || isDownloading) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -15; 
    const rotateY = ((x - centerX) / centerX) * 15;
    
    setTiltStyle({
      transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
      transition: 'none'
    });
  };

  const handleMouseLeave = () => {
    if (!isFlipped) return;
    setTiltStyle({
      transform: `rotateX(0deg) rotateY(0deg)`,
      transition: 'transform 0.5s ease'
    });
  };

  return (
    <section id="services" className="services-section" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* ─── DRAGGABLE DECORATIONS ─── */}
      <DraggableTape text="CAUTION // DO NOT CROSS" color="var(--yellow, #ffeb3b)" rotation={-25} top="20%" left="-5%" />
      <DraggableTape text="RESTRICTED AREA" color="var(--yellow, #ffeb3b)" rotation={35} top="60%" left="-10%" />
      <DraggableTape text="TOP SECRET // CLASSIFIED" color="var(--pink)" rotation={15} top="15%" left="75%" />
      <DraggableTape text="DANGER // HIGH VOLTAGE" color="var(--orange)" rotation={-40} top="70%" left="80%" />
      <DraggableTape text="NO ENTRY" color="var(--white)" rotation={80} top="40%" left="90%" zIndex={4} />

      <div className="services-header" style={{ position: 'relative', zIndex: 10 }}>
        <h2>{t("CYBER-ID STATION", "サイバーIDステーション")}</h2>
        <p>{t("Generate your official Neo-Tokyo resident card. Perfect for your next trip to the cyberspace.", "公式のネオ東京住民カードを作成します。次のサイバースペースへの旅行に最適です。")}</p>
      </div>

      <div className="id-generator-container">
        <div 
          className={`flip-card ${isFlipped ? 'flipped' : ''}`}
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={tiltStyle}
        >
          <div className="flip-card-inner">
            
            {/* FRONT: FORM INPUT */}
            <div className="flip-card-front neo-border card-shadow">
              <h3 className="form-title">{t("ENTER YOUR NAME", "名前を入力")}</h3>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t("e.g. JOHN DOE", "例: 山田 太郎")} 
                className="neo-input"
                maxLength={20}
              />
              <button 
                onClick={handleGenerate} 
                className="neo-btn primary"
              >
                {t("GENERATE ID", "IDを生成")}
              </button>
            </div>

            {/* BACK: GENERATED ID CARD */}
            <div className="flip-card-back neo-border card-shadow holo-effect">
              {/* Action Buttons (Hidden during download) */}
              <div className="action-buttons-group action-btn">
                <button onClick={handleDownload} className="download-btn" title="Download Card">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                </button>
                <button onClick={handleReset} className="reset-btn" title="Reset">↺</button>
              </div>
              
              <div className="id-card-header">
                <span className="id-logo">CYBER_ID //</span>
                <span className="id-status blink">VERIFIED</span>
              </div>
              
              <div className="id-card-body">
                <div className="id-photo-container">
                  {isCameraOpen ? (
                    <div className="camera-view">
                      <video ref={videoRef} className="id-video" muted autoPlay playsInline></video>
                      <button onClick={takeSnapshot} className="snap-btn">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>
                      </button>
                    </div>
                  ) : (
                    <div className="photo-view" onClick={openCamera} title="Click to use Webcam">
                      {photo ? (
                        <img src={photo} className="id-photo" alt="mugshot" />
                      ) : (
                        <div className="id-photo-placeholder"></div>
                      )}
                      <div className="photo-overlay">CHANGE</div>
                    </div>
                  )}
                </div>
                
                <div className="id-details">
                  <div className="id-katakana">
                    <GlitchText text={katakana} isActive={isFlipped} />
                  </div>
                  <div className="id-romaji">{name.toUpperCase() || 'UNKNOWN'}</div>
                  
                  {stats && (
                    <div className="id-stats-grid">
                      <div className="stat-col">
                        <div className="meta-item"><span>CLASS:</span> {stats.classType}</div>
                        <div className="meta-item"><span>ROLE:</span> {stats.role}</div>
                        <div className="meta-item"><span>SN:</span> {stats.serial}</div>
                      </div>
                      <div className="stat-col">
                        <div className="meta-item"><span>STR:</span> {stats.str}</div>
                        <div className="meta-item"><span>INT:</span> {stats.int}</div>
                        <div className="meta-item"><span>AGI:</span> {stats.agi}</div>
                      </div>
                    </div>
                  )}
                  {stats && (
                    <div className="meta-item bounty"><span>BOUNTY:</span> Ƶ {stats.bounty.toLocaleString()}</div>
                  )}
                </div>
              </div>

              <div className="id-card-footer">
                <div className="fake-barcode-new">
                  {/* Dynamic generated barcode stripes */}
                  {Array.from({ length: 30 }).map((_, i) => (
                    <div key={i} className="bar" style={{ 
                      width: `${(Math.sin((stats?.bounty || 1) * i) * 3 + 4)}px`,
                      marginRight: `${(Math.cos((stats?.str || 1) * i) * 2 + 2)}px`
                    }}></div>
                  ))}
                </div>
                <div className="hanko-stamp">承認</div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
