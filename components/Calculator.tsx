
import React, { useState, useEffect, useCallback } from 'react';
import CalculatorButton from './CalculatorButton';
import { Calculation, Language } from '../types';
import { translations } from '../translations';

interface CalculatorProps {
  onCalculate: (calc: Calculation) => void;
  isDarkMode?: boolean;
  lang: Language;
}

const Calculator: React.FC<CalculatorProps> = ({ onCalculate, isDarkMode = true, lang }) => {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [isScientific, setIsScientific] = useState(false);

  const t = translations[lang];

  const evaluate = useCallback(() => {
    try {
      if (!expression) return;
      let sanitized = expression
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/π/g, 'Math.PI')
        .replace(/e/g, 'Math.E')
        .replace(/sin\(/g, 'Math.sin(')
        .replace(/cos\(/g, 'Math.cos(')
        .replace(/tan\(/g, 'Math.tan(')
        .replace(/sqrt\(/g, 'Math.sqrt(')
        .replace(/log\(/g, 'Math.log10(')
        .replace(/ln\(/g, 'Math.log(')
        .replace(/\^/g, '**');

      const openCount = (sanitized.match(/\(/g) || []).length;
      const closeCount = (sanitized.match(/\)/g) || []).length;
      if (openCount > closeCount) {
        sanitized += ')'.repeat(openCount - closeCount);
      }

      const res = new Function(`return ${sanitized}`)();
      const formattedRes = Number.isInteger(res) ? res.toString() : Number(res).toFixed(8).replace(/\.?0+$/, "");
      
      setResult(formattedRes);
      onCalculate({
        id: Date.now().toString(),
        expression,
        result: formattedRes,
        timestamp: Date.now()
      });
    } catch (err) {
      setResult('Error');
    }
  }, [expression, onCalculate]);

  const handleInput = (val: string) => {
    if (val === 'AC') {
      setExpression('');
      setResult(null);
    } else if (val === 'C') {
      setExpression(prev => prev.slice(0, -1));
    } else if (val === '=') {
      evaluate();
    } else {
      if (['sin', 'cos', 'tan', 'sqrt', 'log', 'ln'].includes(val)) {
        setExpression(prev => prev + val + '(');
      } else {
        setExpression(prev => prev + val);
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') handleInput(e.key);
      if (['+', '-', '*', '/', '.', '(', ')'].includes(e.key)) {
        const keyMap: Record<string, string> = { '*': '×', '/': '÷' };
        handleInput(keyMap[e.key] || e.key);
      }
      if (e.key === 'Enter') handleInput('=');
      if (e.key === 'Backspace') handleInput('C');
      if (e.key === 'Escape') handleInput('AC');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleInput]);

  return (
    <div className="flex flex-col h-full">
      {/* Display Area */}
      <div className={`rounded-3xl p-6 mb-6 min-h-[140px] flex flex-col justify-end items-end border transition-all ${isDarkMode ? 'bg-slate-900/30 border-slate-800 shadow-inner' : 'bg-slate-100 border-slate-200 shadow-inner'}`}>
        <div className={`text-lg mono truncate w-full text-right h-8 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          {expression || '0'}
        </div>
        <div className={`text-5xl md:text-6xl font-bold mono truncate w-full text-right mt-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          {result !== null ? result : '0'}
        </div>
      </div>

      <div className="flex justify-between items-center mb-4 px-2">
        <h3 className={`font-medium uppercase tracking-wider text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          {isScientific ? t.scientific : t.standard}
        </h3>
        <button 
          onClick={() => setIsScientific(!isScientific)}
          className={`text-xs px-3 py-1 rounded-full border transition-all ${isScientific ? 'bg-blue-600 border-blue-500 text-white' : isDarkMode ? 'border-slate-700 text-slate-500' : 'border-slate-300 text-slate-400'}`}
        >
          {isScientific ? `${t.scientific} ${t.on}` : `${t.scientific} ${t.off}`}
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-4 gap-3">
        {isScientific && (
          <>
            <CalculatorButton label="sin" variant="operator" onClick={handleInput} isDarkMode={isDarkMode} />
            <CalculatorButton label="cos" variant="operator" onClick={handleInput} isDarkMode={isDarkMode} />
            <CalculatorButton label="tan" variant="operator" onClick={handleInput} isDarkMode={isDarkMode} />
            <CalculatorButton label="^" variant="operator" onClick={handleInput} isDarkMode={isDarkMode} />
            <CalculatorButton label="sqrt" variant="operator" onClick={handleInput} isDarkMode={isDarkMode} />
            <CalculatorButton label="log" variant="operator" onClick={handleInput} isDarkMode={isDarkMode} />
            <CalculatorButton label="ln" variant="operator" onClick={handleInput} isDarkMode={isDarkMode} />
            <CalculatorButton label="π" variant="operator" onClick={handleInput} isDarkMode={isDarkMode} />
          </>
        )}
        
        <CalculatorButton label="AC" variant="action" onClick={handleInput} isDarkMode={isDarkMode} />
        <CalculatorButton label="(" variant="action" onClick={handleInput} isDarkMode={isDarkMode} />
        <CalculatorButton label=")" variant="action" onClick={handleInput} isDarkMode={isDarkMode} />
        <CalculatorButton label="÷" variant="operator" onClick={handleInput} isDarkMode={isDarkMode} />

        <CalculatorButton label="7" onClick={handleInput} isDarkMode={isDarkMode} />
        <CalculatorButton label="8" onClick={handleInput} isDarkMode={isDarkMode} />
        <CalculatorButton label="9" onClick={handleInput} isDarkMode={isDarkMode} />
        <CalculatorButton label="×" variant="operator" onClick={handleInput} isDarkMode={isDarkMode} />

        <CalculatorButton label="4" onClick={handleInput} isDarkMode={isDarkMode} />
        <CalculatorButton label="5" onClick={handleInput} isDarkMode={isDarkMode} />
        <CalculatorButton label="6" onClick={handleInput} isDarkMode={isDarkMode} />
        <CalculatorButton label="-" variant="operator" onClick={handleInput} isDarkMode={isDarkMode} />

        <CalculatorButton label="1" onClick={handleInput} isDarkMode={isDarkMode} />
        <CalculatorButton label="2" onClick={handleInput} isDarkMode={isDarkMode} />
        <CalculatorButton label="3" onClick={handleInput} isDarkMode={isDarkMode} />
        <CalculatorButton label="+" variant="operator" onClick={handleInput} isDarkMode={isDarkMode} />

        <CalculatorButton label="C" variant="action" onClick={handleInput} isDarkMode={isDarkMode} />
        <CalculatorButton label="0" onClick={handleInput} isDarkMode={isDarkMode} />
        <CalculatorButton label="." onClick={handleInput} isDarkMode={isDarkMode} />
        <CalculatorButton label="=" variant="equal" onClick={handleInput} isDarkMode={isDarkMode} />
      </div>
    </div>
  );
};

export default Calculator;
