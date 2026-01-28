
import React, { useState, useRef } from 'react';
import { solveMathProblem } from '../services/geminiService';
import { AIResponse, Language } from '../types';
import { translations } from '../translations';

interface AIHelpProps {
  isDarkMode?: boolean;
  lang: Language;
}

const AIHelp: React.FC<AIHelpProps> = ({ isDarkMode = true, lang }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<AIResponse | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const t = translations[lang];

  const handleSolve = async () => {
    if (!input && !image) return;
    setLoading(true);
    try {
      const res = await solveMathProblem(input || "Solve this problem in the image", lang, image || undefined);
      setResponse(res);
    } catch (err) {
      console.error(err);
      alert("Failed to solve. Please check your query.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className={`rounded-3xl p-6 border transition-all ${isDarkMode ? 'bg-slate-900/30 border-slate-800' : 'bg-slate-100/50 border-slate-200 shadow-sm'}`}>
        <h2 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>{t.aiAssistant}</h2>
        <p className={`text-sm mb-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{t.aiInstruction}</p>
        
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t.aiPlaceholder}
          className={`w-full border rounded-xl p-4 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none h-32 mb-4 ${
            isDarkMode 
              ? 'bg-slate-800/50 border-slate-700 text-slate-100 placeholder-slate-500' 
              : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
          }`}
        />

        <div className="flex flex-col sm:flex-row gap-2">
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleFileUpload}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className={`flex-1 px-4 py-3 rounded-xl border transition-colors flex items-center justify-center gap-2 ${
              isDarkMode 
                ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700' 
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            {image ? t.changePhoto : t.addPhoto}
          </button>
          
          <button
            onClick={handleSolve}
            disabled={loading || (!input && !image)}
            className="flex-[2] bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-500 transition-all font-semibold disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              t.solveWithAi
            )}
          </button>
        </div>

        {image && (
          <div className="mt-4 relative animate-in zoom-in-95">
            <img src={image} alt="Math Problem" className={`max-h-48 rounded-lg border mx-auto ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`} />
            <button 
              onClick={() => setImage(null)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-lg"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
        )}
      </div>

      {response && (
        <div className={`rounded-3xl p-6 border transition-all animate-in fade-in slide-in-from-bottom-4 duration-500 ${isDarkMode ? 'bg-slate-900/30 border-slate-800' : 'bg-white border-slate-200 shadow-xl'}`}>
          <div className="mb-6">
            <h4 className={`font-bold text-sm uppercase mb-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>{t.solution}</h4>
            <p className={`text-2xl font-bold mono ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{response.solution}</p>
          </div>
          
          <div className="mb-6">
            <h4 className={`font-bold text-sm uppercase mb-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{t.explanation}</h4>
            <p className={`leading-relaxed ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>{response.explanation}</p>
          </div>

          <div>
            <h4 className={`font-bold text-sm uppercase mb-3 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{t.steps}</h4>
            <div className="space-y-3">
              {response.steps.map((step, idx) => (
                <div key={idx} className="flex gap-3">
                  <span className={`flex-shrink-0 w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold ${
                    isDarkMode 
                      ? 'bg-slate-800 border-slate-700 text-blue-400' 
                      : 'bg-slate-100 border-slate-200 text-blue-600'
                  }`}>
                    {idx + 1}
                  </span>
                  <p className={`text-sm py-0.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIHelp;
