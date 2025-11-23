import React from 'react';
import { QRMode, ErrorCorrectionLevel, AsciiTheme } from '../types';
import { Settings2 } from 'lucide-react';

interface ControlPanelProps {
  text: string;
  setText: (s: string) => void;
  mode: QRMode;
  setMode: (m: QRMode) => void;
  theme: AsciiTheme;
  setTheme: (t: AsciiTheme) => void;
  ecLevel: ErrorCorrectionLevel;
  setEcLevel: (l: ErrorCorrectionLevel) => void;
  invert: boolean;
  setInvert: (b: boolean) => void;
}

const PRESET_THEMES: AsciiTheme[] = [
  { name: 'Classic', darkChar: '#', lightChar: '.' },
  { name: 'Binary', darkChar: '1', lightChar: '0' },
  { name: 'Slashes', darkChar: '/', lightChar: '\\' },
  { name: 'Oceans', darkChar: '@', lightChar: '~' },
  { name: 'Minimal', darkChar: 'X', lightChar: ' ' },
];

export const ControlPanel: React.FC<ControlPanelProps> = ({
  text,
  setText,
  mode,
  setMode,
  theme,
  setTheme,
  ecLevel,
  setEcLevel,
  invert,
  setInvert,
}) => {

  return (
    <div className="w-full h-full flex flex-col space-y-6 p-6 bg-gray-900 border border-gray-700 rounded-lg shadow-xl overflow-y-auto">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Settings2 className="text-green-400" />
          Configuration
        </h2>
        <p className="text-xs text-gray-500 mt-1">Adjust parameters to generate your matrix.</p>
      </div>

      {/* Input Section */}
      <div className="space-y-2">
        <label className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Content</label>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text or URL..."
          className="w-full bg-gray-950 border border-gray-700 text-white p-3 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all font-mono"
        />
      </div>

      {/* Mode Selection */}
      <div className="space-y-2">
        <label className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Render Mode</label>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setMode(QRMode.BLOCK)}
            className={`p-2 text-sm font-mono border rounded transition-all ${
              mode === QRMode.BLOCK
                ? 'bg-green-900/30 border-green-500 text-green-400'
                : 'bg-gray-950 border-gray-700 text-gray-400 hover:bg-gray-800'
            }`}
          >
            Block (Unicode)
          </button>
          <button
            onClick={() => setMode(QRMode.TEXT)}
            className={`p-2 text-sm font-mono border rounded transition-all ${
              mode === QRMode.TEXT
                ? 'bg-green-900/30 border-green-500 text-green-400'
                : 'bg-gray-950 border-gray-700 text-gray-400 hover:bg-gray-800'
            }`}
          >
            Text (ASCII)
          </button>
        </div>
      </div>

      {/* Standard Settings */}
      <div className="space-y-4 pt-2">
        {mode === QRMode.TEXT && (
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Presets</label>
          <div className="flex flex-wrap gap-2">
            {PRESET_THEMES.map((t) => (
              <button
                key={t.name}
                onClick={() => setTheme(t)}
                className={`px-3 py-1 text-xs border rounded transition-all font-mono ${
                  theme.name === t.name
                    ? 'bg-gray-700 border-white text-white'
                    : 'bg-gray-950 border-gray-700 text-gray-400 hover:border-gray-500'
                }`}
              >
                {t.darkChar}{t.lightChar}
              </button>
            ))}
          </div>
        </div>
        )}

        <div className="grid grid-cols-2 gap-4">
            <div>
                 <label className="text-xs text-gray-400 block mb-1">Error Correction</label>
                 <select 
                   value={ecLevel}
                   onChange={(e) => setEcLevel(e.target.value as ErrorCorrectionLevel)}
                   className="w-full bg-gray-950 text-white text-xs border border-gray-700 rounded p-2"
                 >
                    <option value={ErrorCorrectionLevel.L}>Low (7%)</option>
                    <option value={ErrorCorrectionLevel.M}>Medium (15%)</option>
                    <option value={ErrorCorrectionLevel.Q}>Quartile (25%)</option>
                    <option value={ErrorCorrectionLevel.H}>High (30%)</option>
                 </select>
            </div>

            <div>
               <label className="text-xs text-gray-400 block mb-1">Invert Colors</label>
               <button 
                 onClick={() => setInvert(!invert)}
                 className={`w-full h-[34px] rounded border transition-colors flex items-center justify-center gap-2 text-xs font-mono ${invert ? 'bg-white text-black border-white' : 'bg-black text-white border-gray-700'}`}
               >
                  {invert ? 'Dark on Light' : 'Light on Dark'}
               </button>
            </div>
        </div>
      </div>
      
      <div className="mt-auto pt-6 text-[10px] text-gray-600 font-mono text-center">
         ASCII QR FORGE v1.1.0
      </div>

    </div>
  );
};