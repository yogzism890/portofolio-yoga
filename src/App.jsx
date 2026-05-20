import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import Services from './components/Services';
import Projects from './components/Projects';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';
import AdminDashboard from './components/AdminDashboard';
import CustomCursor from './components/CustomCursor';
import './index.css';

function App() {
  const [loaded, setLoaded] = useState(false);
  const [hash, setHash] = useState(window.location.hash);

  useEffect(() => {
    const handleHashChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const isAdmin = hash === '#admin';

  if (isAdmin) {
    return <AdminDashboard />;
  }

  return (
    <>
      <CustomCursor />
      {!loaded && <LoadingScreen onFinish={() => setLoaded(true)} />}
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <Projects />
        <About />
        <Services />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

export default App;
