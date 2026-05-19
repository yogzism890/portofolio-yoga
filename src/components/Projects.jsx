import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const Projects = () => {
  const { t } = useLanguage();

  const PROJECT_DATA = [
    {
      title: t("NEXUS PAY SYSTEM", "ネクサス・ペイ・システム"),
      tags: [t("FINTECH", "フィンテック"), "2024"],
      color: "var(--lime)",
      desc: t("A brutalist redesign of a banking dashboard. Rejecting soft shadows for hard data visualization and uncompromising clarity.", "銀行ダッシュボードのブルータリズム的再設計。柔らかい影を拒絶し、ハードなデータ視覚化と妥協のない明確さを実現。"),
      img: "https://placehold.co/600x400/111/fff?text=NEXUS+PAY&font=Montserrat"
    },
    {
      title: t("BLOCK GRID API", "ブロックグリッド API"),
      tags: [t("WEB3", "ウェブ3"), t("PROTOCOL", "プロトコル")],
      color: "var(--cyan)",
      desc: t("Developer documentation built like a physical manual. Heavy typography, stark contrasts, and zero fluff.", "物理的なマニュアルのように構築された開発者ドキュメント。重いタイポグラフィ、はっきりとしたコントラスト、無駄のなさ。"),
      img: "https://placehold.co/600x400/111/fff?text=BLOCK+GRID&font=Montserrat"
    },
    {
      title: t("STREET MARKET", "ストリートマーケット"),
      tags: [t("E-COMMERCE", "Eコマース"), t("APPAREL", "アパレル")],
      color: "#ffe1e1",
      desc: t("An experimental storefront for underground streetwear. Navigation is treated as a spatial puzzle with heavy borders.", "アンダーグラウンド・ストリートウェアの実験的な店舗。ナビゲーションは太い境界線を持つ空間パズルとして扱われる。"),
      img: "https://placehold.co/600x400/111/fff?text=STREET+MARKET&font=Montserrat"
    },
    {
      title: t("SYNTH OS CORE", "シンセ OS コア"),
      tags: [t("HARDWARE", "ハードウェア"), t("DASHBOARD", "ダッシュボード")],
      color: "#ffe1e1",
      desc: t("Control interface for a hardware synthesizer. Designed to mimic the tactile, chunky feel of physical knobs and switches.", "ハードウェア・シンセサイザーの制御インターフェース。物理的なノブとスイッチの触覚的で分厚い感触を模倣するよう設計。"),
      img: "https://placehold.co/600x400/111/fff?text=SYNTH+OS&font=Montserrat"
    },
    {
      title: t("VOID MAGAZINE", "ヴォイドマガジン"),
      tags: [t("BRANDING", "ブランディング"), t("PRINT", "プリント")],
      color: "var(--white)",
      desc: t("An editorial layout system built on a rigid 12-column grid. Emphasizes void space and overwhelming typographical scale.", "厳密な12カラムグリッドに基づく編集レイアウトシステム。空白と圧倒的なタイポグラフィのスケールを強調。"),
      img: "https://placehold.co/600x400/111/fff?text=VOID+MAGAZINE&font=Montserrat"
    },
    {
      title: t("TERMINAL THEME", "ターミナルテーマ"),
      tags: [t("OPEN SOURCE", "オープンソース")],
      color: "var(--lime)",
      desc: t("A high-contrast code editor theme designed for maximum legibility and zero distraction. Strictly black, white, and primary colors.", "最大の可読性と気を散らさないよう設計された高コントラストのコードエディタテーマ。厳密に黒、白、原色のみ。"),
      img: "https://placehold.co/600x400/111/fff?text=TERMINAL&font=Montserrat"
    }
  ];

  return (
    <section className="projects-section" id="work">
      <div className="projects-header">
        <h2>{t("SELECTED", "選ばれた")}<br/>{t("WORKS", "作品")}</h2>
        <p>
          {t("A collection of high-impact digital products, brutalist experiments, and unapologetic UI engineering. Built with raw energy.", "インパクトの強いデジタル製品、ブルータリズムの実験、妥協のないUIエンジニアリングのコレクション。生のエネルギーで作られています。")}
        </p>
      </div>
      
      <div className="projects-grid">
        {PROJECT_DATA.map((project, idx) => (
          <div key={idx} className="project-card neo-border neo-shadow">
            <img src={project.img} alt={project.title} className="project-img" />
            <div className="project-content" style={{ backgroundColor: project.color }}>
              <div className="project-tags">
                {project.tags.map((tag, i) => (
                  <span key={i} className="tag">{tag}</span>
                ))}
              </div>
              <h3>{project.title}</h3>
              <p>{project.desc}</p>
              <a href="#" className="view-case">{t("View Case", "ケースを見る")} <span>→</span></a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Projects;
