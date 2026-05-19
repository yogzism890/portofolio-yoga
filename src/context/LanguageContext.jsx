import React, { createContext, useState, useContext, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
  const [isJp, setIsJp] = useState(() => {
    const saved = localStorage.getItem('isJp');
    return saved === 'true';
  });
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isJp) {
      document.body.classList.add('jp-mode');
    } else {
      document.body.classList.remove('jp-mode');
    }
  }, [isJp]);

  const toggleLanguage = () => {
    setIsAnimating(true);
    
    // Animate logic: Add a class to body or wrapper to trigger CSS animation
    document.body.classList.add('glitch-transition');
    
    setTimeout(() => {
      setIsJp(prev => {
        const nextState = !prev;
        localStorage.setItem('isJp', nextState);
        return nextState;
      });
    }, 400); // Change state in the middle of animation

    setTimeout(() => {
      document.body.classList.remove('glitch-transition');
      setIsAnimating(false);
    }, 1000); // End of animation
  };

  const t = (en, jp) => isJp ? jp : en;

  return (
    <LanguageContext.Provider value={{ isJp, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
