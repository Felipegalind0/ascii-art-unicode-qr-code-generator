import React, { useRef, useState } from 'react';
import { Copy, Download, Check } from 'lucide-react';

interface AsciiOutputProps {
  ascii: string;
  loading: boolean;
  fgColor: string;
  bgColor: string;
}

export const AsciiOutput: React.FC<AsciiOutputProps> = ({ ascii, loading, fgColor, bgColor }) => {
  const [copied, setCopied] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const handleCopy = async () => {
    if (textAreaRef.current) {
      textAreaRef.current.select();
      
      try {
        await navigator.clipboard.writeText(ascii);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.warn('Clipboard API failed, trying fallback execCommand', err);
        // Fallback for older browsers or restricted contexts
        try {
          document.execCommand('copy');
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch (e) {
          console.error('Copy failed entirely', e);
        }
      }
    }
  };

  const handleDownload = () => {
    const blob = new Blob([ascii], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ascii-qr.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-gray-900 border border-gray-700 rounded-lg overflow-hidden shadow-2xl transition-all duration-300">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center space-x-2">
           <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
           <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
           <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
           <span className="ml-2 text-xs text-gray-400 font-mono">output.txt</span>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleCopy}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
            title="Copy to Clipboard"
          >
            {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
          </button>
          <button
            onClick={handleDownload}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
            title="Download .txt"
          >
            <Download size={16} />
          </button>
        </div>
      </div>
      
      <div 
        className="relative flex-grow p-4 overflow-auto flex items-center justify-center custom-scrollbar transition-colors duration-300"
        style={{ backgroundColor: bgColor }}
      >
        {loading ? (
            <div className="flex flex-col items-center justify-center space-y-4">
                <div 
                    className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin"
                    style={{ borderColor: fgColor, borderTopColor: 'transparent' }}
                ></div>
                <p className="font-mono animate-pulse" style={{ color: fgColor }}>Compiling Matrix...</p>
            </div>
        ) : (
             <textarea
                ref={textAreaRef}
                readOnly
                value={ascii}
                className="w-full h-full bg-transparent font-mono text-xs md:text-sm resize-none focus:outline-none cursor-text whitespace-pre text-center leading-[1em] md:leading-[1.1em] transition-colors duration-300"
                style={{ 
                    color: fgColor, 
                    lineHeight: '1em', 
                    letterSpacing: '0' 
                }}
                spellCheck={false}
              />
        )}
      </div>
      
      <div className="px-4 py-1 bg-gray-900 border-t border-gray-800 text-[10px] text-gray-500 font-mono flex justify-between">
         <span>Ln {ascii.split('\n').length}, Col {ascii.split('\n')[0]?.length || 0}</span>
         <span>UTF-8</span>
      </div>
    </div>
  );
};