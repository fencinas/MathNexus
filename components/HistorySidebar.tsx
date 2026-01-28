
import React from 'react';
import { Calculation, Language } from '../types';
import { translations } from '../translations';

interface HistorySidebarProps {
  history: Calculation[];
  onClear: () => void;
  onSelect: (calc: Calculation) => void;
  isDarkMode?: boolean;
  lang: Language;
}

const HistorySidebar: React.FC<HistorySidebarProps> = ({ history, onClear, onSelect, isDarkMode = true, lang }) => {
  const t = translations[lang];

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>{t.history}</h2>
        {history.length > 0 && (
          <button 
            onClick={onClear}
            className="text-xs text-red-400 hover:text-red-500 transition-colors uppercase font-bold tracking-wider"
          >
            {t.clearAll}
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className={`flex-1 flex flex-col items-center justify-center space-y-2 opacity-50 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          <p>{t.noCalculations}</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 no-scrollbar">
          {history.map((calc) => (
            <button
              key={calc.id}
              onClick={() => onSelect(calc)}
              className={`w-full text-right p-4 rounded-2xl border transition-all group ${
                isDarkMode 
                  ? 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800 hover:border-blue-500/30' 
                  : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-blue-300'
              }`}
            >
              <div className={`text-sm mono truncate group-hover:text-slate-500 transition-colors ${isDarkMode ? 'text-slate-400 group-hover:text-slate-300' : 'text-slate-500'}`}>
                {calc.expression}
              </div>
              <div className={`text-xl font-bold mono mt-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {calc.result}
              </div>
              <div className={`text-[10px] mt-2 uppercase tracking-tighter ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>
                {new Date(calc.timestamp).toLocaleTimeString(lang === Language.ES ? 'es-ES' : 'en-US')}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistorySidebar;
