import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="neo-footer">
      <div className="footer-logo">YOGA - ヨガです</div>
      <div className="footer-center">
        {t("©2026NEO_BRUTAL_LABS. BUILT WITH RAW ENERGY.", "©2026 ネオ・ブルータル・ラボ。生のエネルギーで構築されています。")}
      </div>
      <div className="footer-links">
        <a href="https://github.com/yogzism890/">Github</a>
        <a href="#">LinkedIn</a>
        <a href="#">Dribbble</a>
        <a href="#">{t("Source", "ソース")}</a>
      </div>
    </footer>
  );
};

export default Footer;
