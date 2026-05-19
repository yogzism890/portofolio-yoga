import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

const About = () => {
  const { t } = useLanguage();
  const [lineHeight, setLineHeight] = useState(0);
  const timelineRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!timelineRef.current) return;
      
      const rect = timelineRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Garis mulai terisi saat timeline berada 70% dari atas layar
      const startDrawPos = windowHeight * 0.7;
      
      if (rect.top < startDrawPos) {
        const distance = startDrawPos - rect.top;
        const totalHeight = rect.height;
        
        let percentage = distance / totalHeight;
        percentage = Math.max(0, Math.min(1, percentage));
        
        setLineHeight(percentage * 100);
      } else {
        setLineHeight(0);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="about-section" id="about">
      <div className="about-container">
        {/* MY STORY */}
        <div className="story-container">
          <div className="story-left">
            <h2>{t("MY STORY", "私の物語")}</h2>
            <img src="https://placehold.co/600x500/111/fff?text=WORKSPACE&font=Montserrat" alt="Workspace" className="story-img neo-shadow" />
          </div>
          <div className="story-right">
            <p>
              {t("I build digital experiences that refuse to be ignored. My approach is rooted in structural clarity and unapologetic aesthetics. Rejecting the soft, blurred edges of modern web design, I embrace hard lines, high contrast, and mechanical precision.", "私は無視されることを拒むデジタル体験を構築します。私のアプローチは構造的な明確さと妥協のない美学に根ざしています。現代のWebデザインの柔らかくぼやけたエッジを拒絶し、ハードなライン、高コントラスト、機械的な精度を取り入れます。")}
            </p>
            <p>
              {t("With a background in architecture and systems engineering, I see code as a physical material. Every div is a structural beam, every CSS class a coat of industrial paint.", "建築とシステムエンジニアリングの背景を持つ私は、コードを物理的な素材として捉えています。すべてのdivは構造梁であり、すべてのCSSクラスは工業用塗料の層です。")}
            </p>
            <button className="neo-btn primary">{t("DOWNLOAD CV", "履歴書をダウンロード")}</button>
          </div>
        </div>

        {/* SKILLSET */}
        <div className="skillset-container">
          <h2>{t("SKILLSET", "スキルセット")}</h2>
          <div className="skills-flex">
            <span className="skill-tag" style={{backgroundColor: 'var(--lime)'}}>REACT</span>
            <span className="skill-tag">TYPESCRIPT</span>
            <span className="skill-tag" style={{backgroundColor: 'var(--cyan)'}}>TAILWIND CSS</span>
            <span className="skill-tag">NEXT.JS</span>
            <span className="skill-tag" style={{backgroundColor: '#ffe1e1'}}>THREE.JS</span>
            <span className="skill-tag">NODE.JS</span>
            <span className="skill-tag" style={{backgroundColor: 'var(--lime)'}}>FIGMA</span>
            <span className="skill-tag">WEBGL</span>
            <span className="skill-tag" style={{backgroundColor: '#99ddff'}}>PYTHON</span>
          </div>
        </div>

        {/* EXPERIENCE */}
        <div className="experience-container">
          <h2>{t("EXPERIENCE", "経験")}</h2>
          <div className="timeline" ref={timelineRef}>
            <div className="timeline-line-bg"></div>
            <div className="timeline-line-fill" style={{ height: `${lineHeight}%` }}></div>
            
            {/* Item 1 - Right */}
            <div className="timeline-item right-side">
              <div className="time-date">{t("2022 - PRESENT", "2022 - 現在")}</div>
              <div className="timeline-marker" style={{
                backgroundColor: lineHeight > 5 ? 'var(--lime)' : 'var(--bg-secondary)',
                transform: lineHeight > 5 ? 'scale(1)' : 'scale(0.5)'
              }}></div>
              <div className="time-content bracket-right" style={{
                opacity: lineHeight > 10 ? 1 : 0,
                transform: lineHeight > 10 ? 'translateY(0)' : 'translateY(20px)',
                transition: 'all 0.4s ease-out'
              }}>
                <h3>{t("SENIOR FRONTEND ENGINEER", "シニアフロントエンドエンジニア")}</h3>
                <div className="company" style={{color: 'var(--cyan)'}}>TECH_CORP INC.</div>
                <p>{t("Lead architecture for core enterprise platforms. Implemented strict design system tokens and reduced build times by 40%.", "コアエンタープライズプラットフォームのアーキテクチャを主導。厳格なデザインシステムトークンを実装し、ビルド時間を40％短縮しました。")}</p>
              </div>
            </div>

            {/* Item 2 - Left */}
            <div className="timeline-item left-side">
              <div className="time-content bracket-left" style={{
                opacity: lineHeight > 35 ? 1 : 0,
                transform: lineHeight > 35 ? 'translateY(0)' : 'translateY(20px)',
                transition: 'all 0.4s ease-out'
              }}>
                <h3>{t("UI DEVELOPER", "UI 開発者")}</h3>
                <div className="company" style={{color: '#ff5722'}}>CREATIVE AGENCY X</div>
                <p>{t("Developed high-impact marketing sites using WebGL and advanced CSS animations for top-tier clients.", "トップクラスのクライアント向けに、WebGLと高度なCSSアニメーションを使用したインパクトの高いマーケティングサイトを開発。")}</p>
              </div>
              <div className="timeline-marker" style={{
                backgroundColor: lineHeight > 30 ? 'var(--cyan)' : 'var(--bg-secondary)',
                transform: lineHeight > 30 ? 'scale(1)' : 'scale(0.5)'
              }}></div>
              <div className="time-date">2019 - 2022</div>
            </div>

            {/* Item 3 - Right */}
            <div className="timeline-item right-side">
              <div className="time-date">2017 - 2019</div>
              <div className="timeline-marker" style={{
                backgroundColor: lineHeight > 60 ? 'var(--pink)' : 'var(--bg-secondary)',
                transform: lineHeight > 60 ? 'scale(1)' : 'scale(0.5)'
              }}></div>
              <div className="time-content bracket-right" style={{
                opacity: lineHeight > 65 ? 1 : 0,
                transform: lineHeight > 65 ? 'translateY(0)' : 'translateY(20px)',
                transition: 'all 0.4s ease-out'
              }}>
                <h3>{t("WEB DESIGNER", "ウェブデザイナー")}</h3>
                <div className="company" style={{color: 'var(--lime)'}}>NEON STUDIO</div>
                <p>{t("Crafted experimental web interfaces and brutalist UI concepts for underground music festivals.", "アンダーグラウンドの音楽フェスティバル向けに、実験的なWebインターフェースとブルータリズムのUIコンセプトを制作。")}</p>
              </div>
            </div>

            {/* Item 4 - Left */}
            <div className="timeline-item left-side">
              <div className="time-content bracket-left" style={{
                opacity: lineHeight > 90 ? 1 : 0,
                transform: lineHeight > 90 ? 'translateY(0)' : 'translateY(20px)',
                transition: 'all 0.4s ease-out'
              }}>
                <h3>{t("JUNIOR DEVELOPER", "ジュニア開発者")}</h3>
                <div className="company" style={{color: '#99ddff'}}>STARTUP Z</div>
                <p>{t("Built responsive landing pages and learned the core foundations of vanilla JavaScript and CSS architecture.", "レスポンシブなランディングページを構築し、バニラJavaScriptとCSSアーキテクチャのコアとなる基礎を学びました。")}</p>
              </div>
              <div className="timeline-marker" style={{
                backgroundColor: lineHeight > 85 ? 'var(--white)' : 'var(--bg-secondary)',
                transform: lineHeight > 85 ? 'scale(1)' : 'scale(0.5)'
              }}></div>
              <div className="time-date">2015 - 2017</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
