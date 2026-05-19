import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();
  
  return (
    <footer className="neo-footer">
      <div className="footer-logo">PORTFOLIO_OS</div>
      <div className="footer-center">
        {t("©2024 NEO_BRUTAL_LABS. BUILT WITH RAW ENERGY.", "©2024 ネオ・ブルータル・ラボ。生のエネルギーで構築されています。")}
      </div>
      <div className="footer-links">
        <a href="#">Github</a>
        <a href="#">LinkedIn</a>
        <a href="#">Dribbble</a>
        <a href="#">{t("Source", "ソース")}</a>
      </div>
    </footer>
  );
};

export default Footer;
