import React, { useState, useEffect, useCallback } from 'react';
import { ControlPanel } from './components/ControlPanel';
import { AsciiOutput } from './components/AsciiOutput';
import { QRMode, ErrorCorrectionLevel, AsciiTheme } from './types';
import { getQRMatrix, toAsciiText, toAsciiBlocks } from './utils/qrLogic';
import { Terminal, QrCode, Share2, Check } from 'lucide-react';

const App: React.FC = () => {
  // Check system preference for initial colors
  const systemPrefersDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  const DEFAULT_DARK_FG = '#4ade80'; // Green-400
  const DEFAULT_DARK_BG = '#000000';
  const DEFAULT_LIGHT_FG = '#000000';
  const DEFAULT_LIGHT_BG = '#ffffff';

  // Helper to parse URL params
  const getInitialState = useCallback(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      // Determine initial colors based on URL or System Pref
      const urlFg = params.get('fg');
      const urlBg = params.get('bg');
      
      const defaultFg = systemPrefersDark ? DEFAULT_DARK_FG : DEFAULT_LIGHT_FG;
      const defaultBg = systemPrefersDark ? DEFAULT_DARK_BG : DEFAULT_LIGHT_BG;

      return {
        text: params.get('text') || 'https://example.com',
        mode: (params.get('mode') as QRMode) || QRMode.BLOCK,
        ecLevel: (params.get('ecLevel') as ErrorCorrectionLevel) || ErrorCorrectionLevel.L,
        invert: params.get('invert') === 'true',
        theme: {
          name: params.get('themeName') || 'Classic',
          darkChar: params.get('darkChar') || '#',
          lightChar: params.get('lightChar') || '.',
        },
        fgColor: urlFg || defaultFg,
        bgColor: urlBg || defaultBg
      };
    } catch (e) {
      return {
        text: 'https://example.com',
        mode: QRMode.BLOCK,
        ecLevel: ErrorCorrectionLevel.L,
        invert: false,
        theme: { name: 'Classic', darkChar: '#', lightChar: '.' },
        fgColor: systemPrefersDark ? DEFAULT_DARK_FG : DEFAULT_LIGHT_FG,
        bgColor: systemPrefersDark ? DEFAULT_DARK_BG : DEFAULT_LIGHT_BG
      };
    }
  }, [systemPrefersDark]);

  const initialState = getInitialState();

  // State
  const [text, setText] = useState<string>(initialState.text);
  const [mode, setMode] = useState<QRMode>(initialState.mode);
  const [theme, setTheme] = useState<AsciiTheme>(initialState.theme);
  const [ecLevel, setEcLevel] = useState<ErrorCorrectionLevel>(initialState.ecLevel);
  const [invert, setInvert] = useState<boolean>(initialState.invert);
  
  // Color State
  const [fgColor, setFgColor] = useState<string>(initialState.fgColor);
  const [bgColor, setBgColor] = useState<string>(initialState.bgColor);
  
  const [ascii, setAscii] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const resetToSystemTheme = () => {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setFgColor(isDark ? DEFAULT_DARK_FG : DEFAULT_LIGHT_FG);
    setBgColor(isDark ? DEFAULT_DARK_BG : DEFAULT_LIGHT_BG);
  };

  // Handle Browser Back/Forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const s = getInitialState();
      setText(s.text);
      setMode(s.mode);
      setEcLevel(s.ecLevel);
      setInvert(s.invert);
      setTheme(s.theme);
      setFgColor(s.fgColor);
      setBgColor(s.bgColor);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [getInitialState]);

  // Sync state to URL
  useEffect(() => {
    const params = new URLSearchParams();
    params.set('text', text);
    params.set('mode', mode);
    params.set('ecLevel', ecLevel);
    params.set('invert', invert.toString());
    params.set('themeName', theme.name);
    params.set('darkChar', theme.darkChar);
    params.set('lightChar', theme.lightChar);
    params.set('fg', fgColor);
    params.set('bg', bgColor);

    try {
      const newUrl = `${window.location.pathname}?${params.toString()}`;
      if (window.location.search !== `?${params.toString()}`) {
          window.history.replaceState({}, '', newUrl);
      }
    } catch (err) {
      console.debug('History API unavailable:', err);
    }
  }, [text, mode, ecLevel, invert, theme, fgColor, bgColor]);

  // QR Generation Effect
  useEffect(() => {
    let active = true;

    const generate = async () => {
      if (!text) {
        setAscii('');
        return;
      }
      setLoading(true);
      try {
        await new Promise(r => setTimeout(r, 50)); 
        const matrix = await getQRMatrix(text, ecLevel);
        
        if (!active) return;

        let result = '';
        if (mode === QRMode.BLOCK) {
          result = toAsciiBlocks(matrix, invert);
        } else {
          result = toAsciiText(matrix, theme.darkChar, theme.lightChar, invert);
        }

        setAscii(result);
      } catch (err) {
        console.error("QR Gen Error", err);
        setAscii("Error generating QR code. Try shorter text.");
      } finally {
        if (active) setLoading(false);
      }
    };

    const timeoutId = setTimeout(generate, 300); // Debounce
    return () => {
      active = false;
      clearTimeout(timeoutId);
    };
  }, [text, mode, theme, ecLevel, invert]);

  const handleShareLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (err) {
      console.warn('Clipboard access denied:', err);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-gray-950 to-black transition-colors duration-500">
      
      {/* Title */}
      <header className="mb-8 text-center space-y-2 relative w-full max-w-2xl">
        <button 
          onClick={handleShareLink}
          className="absolute right-0 top-0 md:right-[-2rem] p-2 text-gray-500 hover:text-green-400 transition-colors"
          title="Copy configuration link"
        >
          {copiedLink ? <Check size={20} /> : <Share2 size={20} />}
        </button>

        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 font-mono tracking-tighter flex items-center justify-center gap-4">
          <Terminal size={40} className="text-green-500" />
          ASCII QR FORGE
          <QrCode size={40} className="text-blue-500" />
        </h1>
        <p className="text-gray-400 text-sm md:text-base font-mono">
          Generate scannable ASCII art QR codes.
        </p>
      </header>

      {/* Main Content Grid */}
      <main className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-6 h-[800px] lg:h-[600px]">
        
        {/* Left: Controls */}
        <section className="lg:col-span-4 h-full order-2 lg:order-1">
          <ControlPanel 
            text={text}
            setText={setText}
            mode={mode}
            setMode={setMode}
            theme={theme}
            setTheme={setTheme}
            ecLevel={ecLevel}
            setEcLevel={setEcLevel}
            invert={invert}
            setInvert={setInvert}
            fgColor={fgColor}
            setFgColor={setFgColor}
            bgColor={bgColor}
            setBgColor={setBgColor}
            resetToSystemTheme={resetToSystemTheme}
          />
        </section>

        {/* Right: Output */}
        <section className="lg:col-span-8 h-full order-1 lg:order-2 flex flex-col space-y-4">
           <AsciiOutput 
             ascii={ascii} 
             loading={loading} 
             fgColor={fgColor}
             bgColor={bgColor}
           />
        </section>

      </main>

    </div>
  );
};

export default App;