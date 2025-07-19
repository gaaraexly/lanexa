
import React, { useState, useEffect, useCallback } from 'react';
import Welcome from './components/Welcome';
import Login from './components/Login';
import Generator from './components/Generator';
import RightClickPopup from './components/common/RightClickPopup';

type Page = 'welcome' | 'login' | 'main';

const App: React.FC = () => {
  const [page, setPage] = useState<Page>('welcome');
  const [userName, setUserName] = useState<string>('');
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const popupTimerRef = React.useRef<number | null>(null);

  const triggerPopup = useCallback((message: string) => {
    if (popupTimerRef.current) {
      clearTimeout(popupTimerRef.current);
    }
    setPopupMessage(message);
    setShowPopup(true);
    popupTimerRef.current = window.setTimeout(() => {
      setShowPopup(false);
    }, 2500);
  }, []);

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      triggerPopup('Klik kanan tidak diizinkan.');
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Block copy (Ctrl+C)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        triggerPopup('Menyalin konten tidak diizinkan.');
        return;
      }
      
      // Block view source, save page, and dev tools shortcuts
      const isDevShortcut = 
        e.key === 'F12' ||
        ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'u') ||
        ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && ['i', 'j', 'c'].includes(e.key.toLowerCase()));

      if (isDevShortcut) {
        e.preventDefault();
        triggerPopup('Tindakan ini tidak diizinkan.');
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      if (popupTimerRef.current) {
        clearTimeout(popupTimerRef.current);
      }
    };
  }, [triggerPopup]);

  // Aggressive dev tools detection
  useEffect(() => {
    const devToolsTrap = () => {
      // This debugger statement will be hit constantly if dev tools are open,
      // making it very difficult to inspect or use the console.
      debugger;
    };
    const intervalId = setInterval(devToolsTrap, 500);

    return () => clearInterval(intervalId);
  }, []);


  const handleLogin = (name: string) => {
    setUserName(name);
    setPage('main');
  };

  const renderPage = () => {
    switch (page) {
      case 'welcome':
        return <Welcome onGetStarted={() => setPage('login')} />;
      case 'login':
        return <Login onLogin={handleLogin} />;
      case 'main':
        return <Generator userName={userName} />;
      default:
        return <Welcome onGetStarted={() => setPage('login')} />;
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-violet-200 via-pink-200 to-blue-200 font-sans text-gray-800">
      {renderPage()}
      <RightClickPopup show={showPopup} message={popupMessage} />
    </div>
  );
};

export default App;