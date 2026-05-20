import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../utils/supabaseClient';

const Projects = () => {
  const { t, language } = useLanguage();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Data statis sebagai fallback jika Supabase belum terkonfigurasi / terjadi error
  const STATIC_PROJECTS = [
    {
      id: 'static-1',
      title_en: "NEXUS PAY SYSTEM",
      title_ja: "ネクサス・ペイ・システム",
      tags: ["FINTECH", "2024"],
      color: "var(--lime)",
      desc_en: "A brutalist redesign of a banking dashboard. Rejecting soft shadows for hard data visualization and uncompromising clarity.",
      desc_ja: "銀行ダッシュボードのブルータリズム advisers... 柔らかい影を拒絶し、ハードなデータ視覚化と妥協のない明確さを実現。",
      img_url: "https://placehold.co/600x400/111/fff?text=NEXUS+PAY&font=Montserrat"
    },
    {
      id: 'static-2',
      title_en: "BLOCK GRID API",
      title_ja: "ブロックグリッド API",
      tags: ["WEB3", "PROTOCOL"],
      color: "var(--cyan)",
      desc_en: "Developer documentation built like a physical manual. Heavy typography, stark contrasts, and zero fluff.",
      desc_ja: "物理的なマニュアルのように構築された開発者ドキュメント。重いタイポグラフィ、はっきりとしたコントラスト、無駄のなさ。",
      img_url: "https://placehold.co/600x400/111/fff?text=BLOCK+GRID&font=Montserrat"
    },
    {
      id: 'static-3',
      title_en: "STREET MARKET",
      title_ja: "ストリートマーケット",
      tags: ["E-COMMERCE", "APPAREL"],
      color: "#ffe1e1",
      desc_en: "An experimental storefront for underground streetwear. Navigation is treated as a spatial puzzle with heavy borders.",
      desc_ja: "アンダーグラウンド・ストリートウェアの実験的な店舗。ナビゲーションは太い境界線を持つ空間パズルとして扱われる。",
      img_url: "https://placehold.co/600x400/111/fff?text=STREET+MARKET&font=Montserrat"
    },
    {
      id: 'static-4',
      title_en: "SYNTH OS CORE",
      title_ja: "シンセ OS コア",
      tags: ["HARDWARE", "DASHBOARD"],
      color: "#ffe1e1",
      desc_en: "Control interface for a hardware synthesizer. Designed to mimic the tactile, chunky feel of physical knobs and switches.",
      desc_ja: "ハードウェア・シンセサイザーの制御インターフェース。物理的なノブ dan スイッチの触覚的で分厚い感触を模倣するよう設計。",
      img_url: "https://placehold.co/600x400/111/fff?text=SYNTH+OS&font=Montserrat"
    },
    {
      id: 'static-5',
      title_en: "VOID MAGAZINE",
      title_ja: "ヴォイドマガジン",
      tags: ["BRANDING", "PRINT"],
      color: "var(--white)",
      desc_en: "An editorial layout system built on a rigid 12-column grid. Emphasizes void space and overwhelming typographical scale.",
      desc_ja: "厳密な12カラムグリッドに基づく編集レイアウトシステム。空白と圧倒的なタイポグラフィのスケールを強調。",
      img_url: "https://placehold.co/600x400/111/fff?text=VOID+MAGAZINE&font=Montserrat"
    },
    {
      id: 'static-6',
      title_en: "TERMINAL THEME",
      title_ja: "ターミナルテーマ",
      tags: ["OPEN SOURCE"],
      color: "var(--lime)",
      desc_en: "A high-contrast code editor theme designed for maximum legibility and zero distraction. Strictly black, white, and primary colors.",
      desc_ja: "最大の可読性と気を散らさないよう設計された高コントラストのコードエディタテーマ。厳密に黒、白、原色のみ。",
      img_url: "https://placehold.co/600x400/111/fff?text=TERMINAL&font=Montserrat"
    }
  ];

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const isConfigured = 
          import.meta.env.VITE_SUPABASE_URL && 
          import.meta.env.VITE_SUPABASE_URL !== 'your_supabase_project_url_here' &&
          import.meta.env.VITE_SUPABASE_ANON_KEY &&
          import.meta.env.VITE_SUPABASE_ANON_KEY !== 'your_supabase_anon_key_here';

        if (!isConfigured) {
          setProjects(STATIC_PROJECTS);
          return;
        }

        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('order_index', { ascending: true });

        if (error) throw error;

        if (data && data.length > 0) {
          setProjects(data);
        } else {
          setProjects(STATIC_PROJECTS);
        }
      } catch (err) {
        console.warn("Supabase fetch failed, using local static data fallback:", err);
        setProjects(STATIC_PROJECTS);
      } finally {
        setLoading(false);
      }
    };

  }, []);

  // 💡 Memicu animasi masuk secara staggered saat di-scroll
  useEffect(() => {
    if (loading || projects.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target); // Animasi masuk cukup sekali saja saat pertama kali scroll
          }
        });
      },
      { threshold: 0.15 }
    );

    const cards = document.querySelectorAll('.project-card');
    cards.forEach((card) => observer.observe(card));

    return () => {
      cards.forEach((card) => observer.unobserve(card));
    };
  }, [projects, loading]);

  return (
    <section className="projects-section" id="work">
      <div className="projects-header">
        <h2>{t("SELECTED", "選ばれた")}<br/>{t("WORKS", "作品")}</h2>
        <p>
          {t("A collection of high-impact digital products, brutalist experiments, and unapologetic UI engineering. Built with raw energy.", "インパクトの強いデジタル製品、ブルータリズムの実験、妥協のないUIエンジニアリングのコレクション。生のエネルギーで作られています。")}
        </p>
      </div>
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', fontSize: '1.2rem', fontFamily: 'monospace' }}>
          LOADING WORKS_DATA...
        </div>
      ) : (
        <div className="projects-grid">
          {projects.map((project, idx) => {
            const title = language === 'ja' ? project.title_ja : project.title_en;
            const desc = language === 'ja' ? project.desc_ja : project.desc_en;
            const tags = Array.isArray(project.tags) ? project.tags : [];

            return (
              <div key={project.id || idx} className="project-card neo-border neo-shadow">
                <div className="project-img-wrapper">
                  <img src={project.img_url} alt={title} className="project-img" />
                  <img src={project.img_url} alt={title} className="project-img glitch-r" aria-hidden="true" />
                  <img src={project.img_url} alt={title} className="project-img glitch-b" aria-hidden="true" />
                </div>
                <div className="project-content" style={{ backgroundColor: project.color }}>
                  <div className="project-tags">
                    {tags.map((tag, i) => (
                      <span key={i} className="tag">{tag}</span>
                    ))}
                  </div>
                  <h3>{title}</h3>
                  <p>{desc}</p>
                  <a href={project.project_url || "#"} className="view-case">{t("View Case", "ケースを見る")} <span className="arrow">→</span></a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default Projects;
