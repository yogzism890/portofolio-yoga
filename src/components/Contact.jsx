import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const Contact = () => {
  const { t } = useLanguage();

  return (
    <section className="contact-section" id="contact">
      <div className="contact-container">
        {/* Left Column */}
        <div className="contact-left">
          <h2 className="contact-title">
            {t("LET'S", "一緒に")}<br />{t("WORK", "働き")}<br />{t("TOGETHER", "ましょう")}
          </h2>

          <div className="contact-info-card neo-border neo-shadow">
            <div className="info-label">{t("DIRECT LINE", "直通電話")}</div>
            <div className="info-value">yogznovachrono@gmail.com</div>
          </div>

          <div className="contact-info-card neo-border neo-shadow">
            <div className="info-label">{t("STATUS", "ステータス")}</div>
            <div className="info-value">
              <span className="status-dot"></span>
              {t("Accepting Projects", "プロジェクト受付中")}
            </div>
          </div>
        </div>

        {/* Right Column - Form */}
        <div className="contact-right">
          <form className="contact-form neo-border neo-shadow-lg" onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <label>{t("FULL NAME", "氏名")}</label>
              <input type="text" placeholder={t("John Doe", "山田太郎")} className="neo-input" />
            </div>

            <div className="form-group">
              <label>{t("EMAIL ADDRESS", "メールアドレス")}</label>
              <input type="email" placeholder={t("john@example.com", "taro@example.com")} className="neo-input" />
            </div>

            <div className="form-group">
              <label>{t("PROJECT DETAILS", "プロジェクト詳細")}</label>
              <textarea rows="4" placeholder={t("Tell me about your vision, timeline, and goals...", "あなたのビジョン、タイムライン、目標について教えてください...")} className="neo-input"></textarea>
            </div>

            <button type="submit" className="neo-btn cyan-btn neo-shadow">
              <div className="btn-text">
                {t("SEND", "送信")}<br />{t("TRANSMISSION", "伝送")}
              </div>
              <span className="arrow">→</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
