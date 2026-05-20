import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const Navbar = () => {
  const { t } = useLanguage();
  return (
    <nav className="navbar">
      <div className="nav-logo">{t("YOGA － ヨガです", "YOGA － ヨガです")}</div>
      <div className="nav-links">
        <a href="#home">{t("Home", "ホーム")}</a>
        <a href="#work">{t("Work", "ワーク")}</a>
        <a href="#about">{t("About", "アバウト")}</a>
        <a href="#services">{t("Services", "サービス")}</a>
        <a href="#contact">{t("Contact", "コンタクト")}</a>
      </div>
      <button className="neo-btn">
        {t("Let's Talk", "話しましょう")}
      </button>
    </nav>
  );
};

export default Navbar;
