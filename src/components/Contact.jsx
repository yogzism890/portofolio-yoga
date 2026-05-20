import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

const Contact = () => {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle', 'submitting', 'success', 'error'

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');

    // Mengambil key Web3Forms secara aman dari file .env
    const accessKey = import.meta.env.VITE_WEB3FORMS_KEY;

    if (!accessKey || accessKey === 'your_access_key_here') {
      console.warn("Web3Forms Access Key is missing. Please add VITE_WEB3FORMS_KEY to your .env file.");
      setStatus('error');
      return;
    }

    const formData = {
      name: name,
      email: email,
      message: message,
      access_key: accessKey,
      subject: `New Portfolio Message from ${name}`
    };

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(formData)
      });

      const result = await res.json();
      if (result.success) {
        setStatus('success');
        setName('');
        setEmail('');
        setMessage('');
      } else {
        setStatus('error');
      }
    } catch (err) {
      console.error("Web3Forms submission error:", err);
      setStatus('error');
    }
  };

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
          {status === 'success' ? (
            <div className="neo-border neo-shadow" style={{
              backgroundColor: 'var(--lime)',
              padding: '2.5rem',
              textAlign: 'center',
              fontFamily: 'monospace'
            }}>
              <h3 style={{ fontSize: '1.8rem', marginBottom: '1.2rem', textTransform: 'uppercase', letterSpacing: '-1px' }}>
                TRANSMISSION_SUCCESSFUL!
              </h3>
              <p style={{ fontSize: '1.1rem', marginBottom: '2rem', lineHeight: '1.6' }}>
                Terima kasih! Pesan Anda telah terkirim langsung ke email saya. Saya akan segera menghubungi Anda kembali.
              </p>
              <button 
                onClick={() => setStatus('idle')} 
                className="neo-btn" 
                style={{ padding: '0.8rem 1.5rem', fontWeight: 'bold', cursor: 'pointer', backgroundColor: 'white' }}
              >
                KIRIM PESAN LAIN
              </button>
            </div>
          ) : (
            <form className="contact-form neo-border neo-shadow-lg" onSubmit={handleSubmit}>
              {status === 'error' && (
                <div className="neo-border" style={{
                  backgroundColor: 'var(--pink)',
                  padding: '1rem',
                  marginBottom: '1.5rem',
                  fontWeight: 'bold',
                  fontFamily: 'monospace'
                }}>
                  ERROR: Gagal mengirim pesan. Pastikan VITE_WEB3FORMS_KEY di file .env Anda sudah benar.
                </div>
              )}

              <div className="form-group">
                <label>{t("FULL NAME", "氏名")}</label>
                <input 
                  type="text" 
                  placeholder={t("John Doe", "山田太郎")} 
                  className="neo-input" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>{t("EMAIL ADDRESS", "メールアドレス")}</label>
                <input 
                  type="email" 
                  placeholder={t("john@example.com", "taro@example.com")} 
                  className="neo-input" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>{t("PROJECT DETAILS", "プロジェクト詳細")}</label>
                <textarea 
                  rows="4" 
                  placeholder={t("Tell me about your vision, timeline, and goals...", "あなたのビジョン、タイムライン、目標について教えてください...")} 
                  className="neo-input"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="neo-btn cyan-btn neo-shadow" 
                disabled={status === 'submitting'}
                style={{ cursor: 'pointer' }}
              >
                <div className="btn-text">
                  {status === 'submitting' ? (
                    <span>TRANSMITTING...</span>
                  ) : (
                    <span>{t("SEND", "送信")}<br />{t("TRANSMISSION", "伝送")}</span>
                  )}
                </div>
                <span className="arrow">→</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default Contact;
