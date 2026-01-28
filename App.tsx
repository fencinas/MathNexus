
import React, { useState, useEffect } from 'react';
import Calculator from './components/Calculator';
import AIHelp from './components/AIHelp';
import UnitConverter from './components/UnitConverter';
import HistorySidebar from './components/HistorySidebar';
import { Calculation, AppTab, Language } from './types';
import { translations } from './translations';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.CALCULATOR);
  const [history, setHistory] = useState<Calculation[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [lang, setLang] = useState<Language>(Language.EN);

  // Initialize theme and language
  useEffect(() => {
    // History
    const savedHistory = localStorage.getItem('math_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse history");
      }
    }

    // Theme
    const savedTheme = localStorage.getItem('math_theme');
    if (savedTheme !== null) {
      setIsDarkMode(savedTheme === 'dark');
    } else {
      setIsDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }

    // Language
    const savedLang = localStorage.getItem('math_lang');
    if (savedLang && Object.values(Language).includes(savedLang as Language)) {
      setLang(savedLang as Language);
    } else {
      const browserLang = navigator.language.split('-')[0];
      setLang(browserLang === 'es' ? Language.ES : Language.EN);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('math_theme', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('math_lang', lang);
  }, [lang]);

  const t = translations[lang];

  const addHistory = (calc: Calculation) => {
    setHistory(prev => {
      const updated = [calc, ...prev].slice(0, 50);
      localStorage.setItem('math_history', JSON.stringify(updated));
      return updated;
    });
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('math_history');
  };

  const handleSelectHistory = (calc: Calculation) => {
    // Al seleccionar del historial, volvemos a la calculadora
    // En una versión futura podríamos cargar el cálculo activo
    setActiveTab(AppTab.CALCULATOR);
  };

  const toggleTheme = () => setIsDarkMode(!isDarkMode);
  const toggleLang = () => setLang(prev => prev === Language.EN ? Language.ES : Language.EN);

  const getTabButtonClass = (tab: AppTab) => `
    flex-1 py-3 px-2 sm:px-4 rounded-2xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 
    ${activeTab === tab 
      ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
      : isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-800'
    }
  `;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} p-4 md:p-8 flex items-center justify-center`}>
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Main Content Area */}
        <div className={`lg:col-span-9 backdrop-blur-xl border rounded-[40px] shadow-2xl overflow-hidden min-h-[750px] flex flex-col transition-all ${isDarkMode ? 'bg-slate-900/40 border-white/5' : 'bg-white/80 border-slate-200'}`}>
          
          {/* Tabs Navigation */}
          <nav className={`flex p-2 border-b transition-colors overflow-x-auto no-scrollbar ${isDarkMode ? 'bg-slate-950/40 border-white/5' : 'bg-slate-100/50 border-slate-200'}`}>
            <button
              onClick={() => setActiveTab(AppTab.CALCULATOR)}
              className={getTabButtonClass(AppTab.CALCULATOR)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
              <span className="hidden md:inline">{t.calculator}</span>
            </button>
            <button
              onClick={() => setActiveTab(AppTab.AI_SOLVER)}
              className={getTabButtonClass(AppTab.AI_SOLVER)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              <span className="hidden md:inline">{t.aiSolver}</span>
            </button>
            <button
              onClick={() => setActiveTab(AppTab.UNIT_CONVERTER)}
              className={getTabButtonClass(AppTab.UNIT_CONVERTER)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg>
              <span className="hidden md:inline">{t.units}</span>
            </button>
            <button
              onClick={() => setActiveTab(AppTab.HISTORY)}
              className={`lg:hidden ${getTabButtonClass(AppTab.HISTORY)}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              <span className="hidden md:inline">{t.history}</span>
            </button>

            {/* Language & Theme Controls */}
            <div className="px-2 flex items-center border-l border-slate-200/20 ml-2 gap-1">
              <button
                onClick={toggleLang}
                className={`p-2 rounded-xl text-xs font-bold transition-all ${isDarkMode ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-200'}`}
              >
                {lang.toUpperCase()}
              </button>
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-xl transition-all ${isDarkMode ? 'text-yellow-400 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-200'}`}
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDarkMode ? (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" /></svg>
                ) : (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>
                )}
              </button>
            </div>
          </nav>

          {/* Content */}
          <div className="flex-1 p-6 md:p-8 overflow-y-auto no-scrollbar">
            {activeTab === AppTab.CALCULATOR && (
              <div className="max-w-md mx-auto h-full animate-in fade-in zoom-in-95 duration-300">
                <Calculator onCalculate={addHistory} isDarkMode={isDarkMode} lang={lang} />
              </div>
            )}
            {activeTab === AppTab.AI_SOLVER && (
              <div className="max-w-2xl mx-auto h-full animate-in fade-in slide-in-from-right-4 duration-300">
                <AIHelp isDarkMode={isDarkMode} lang={lang} />
              </div>
            )}
            {activeTab === AppTab.UNIT_CONVERTER && (
              <div className="max-w-2xl mx-auto h-full animate-in fade-in slide-in-from-right-4 duration-300">
                <UnitConverter isDarkMode={isDarkMode} lang={lang} />
              </div>
            )}
            {activeTab === AppTab.HISTORY && (
               <div className="lg:hidden h-full animate-in fade-in slide-in-from-right-4 duration-300">
                  <HistorySidebar 
                    isDarkMode={isDarkMode}
                    lang={lang}
                    history={history} 
                    onClear={clearHistory} 
                    onSelect={handleSelectHistory} 
                  />
               </div>
            )}
          </div>

          <footer className={`p-4 border-t text-center transition-colors ${isDarkMode ? 'bg-slate-950/20 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
            <p className={`text-xs font-medium tracking-widest uppercase ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
              {t.poweredBy}
            </p>
          </footer>
        </div>

        {/* Desktop History Sidebar */}
        <div className={`hidden lg:block lg:col-span-3 h-full border rounded-[40px] p-8 max-h-[750px] transition-all shadow-xl ${isDarkMode ? 'bg-slate-900/20 backdrop-blur-md border-white/5' : 'bg-white/60 border-slate-200'}`}>
           <HistorySidebar 
             isDarkMode={isDarkMode}
             lang={lang}
             history={history} 
             onClear={clearHistory} 
             onSelect={handleSelectHistory} 
           />
        </div>

      </div>
    </div>
  );
};

export default App;
