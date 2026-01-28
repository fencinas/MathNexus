
import React from 'react';

interface CalculatorButtonProps {
  label: string;
  onClick: (val: string) => void;
  className?: string;
  variant?: 'number' | 'operator' | 'action' | 'equal';
  isDarkMode?: boolean;
}

const CalculatorButton: React.FC<CalculatorButtonProps> = ({ 
  label, 
  onClick, 
  className = "", 
  variant = 'number',
  isDarkMode = true
}) => {
  const getVariantStyles = () => {
    if (isDarkMode) {
      switch (variant) {
        case 'operator':
          return 'bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 border-blue-500/30';
        case 'action':
          return 'bg-slate-700/50 text-slate-300 hover:bg-slate-700 border-slate-600/50';
        case 'equal':
          return 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-900/40 border-transparent';
        default:
          return 'bg-slate-800/50 text-slate-100 hover:bg-slate-800 border-slate-700/50';
      }
    } else {
      switch (variant) {
        case 'operator':
          return 'bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200';
        case 'action':
          return 'bg-slate-100 text-slate-500 hover:bg-slate-200 border-slate-200';
        case 'equal':
          return 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200 border-transparent';
        default:
          return 'bg-white text-slate-900 hover:bg-slate-50 border-slate-200';
      }
    }
  };

  return (
    <button
      onClick={() => onClick(label)}
      className={`
        h-14 md:h-16 flex items-center justify-center rounded-2xl border transition-all active:scale-95 
        text-xl font-medium ${getVariantStyles()} ${className}
      `}
    >
      {label}
    </button>
  );
};

export default CalculatorButton;
