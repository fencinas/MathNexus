
import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { translations } from '../translations';

interface UnitConverterProps {
  isDarkMode?: boolean;
  lang: Language;
}

type Category = 'Length' | 'Weight' | 'Temperature' | 'Area' | 'Volume';

const units: Record<Category, { name: string; factor: number; base?: string }[]> = {
  Length: [
    { name: 'Millimeters (mm)', factor: 0.001 },
    { name: 'Centimeters (cm)', factor: 0.01 },
    { name: 'Meters (m)', factor: 1 },
    { name: 'Kilometers (km)', factor: 1000 },
    { name: 'Inches (in)', factor: 0.0254 },
    { name: 'Feet (ft)', factor: 0.3048 },
    { name: 'Yards (yd)', factor: 0.9144 },
    { name: 'Miles (mi)', factor: 1609.34 },
  ],
  Weight: [
    { name: 'Grams (g)', factor: 1 },
    { name: 'Kilograms (kg)', factor: 1000 },
    { name: 'Milligrams (mg)', factor: 0.001 },
    { name: 'Ounces (oz)', factor: 28.3495 },
    { name: 'Pounds (lb)', factor: 453.592 },
  ],
  Temperature: [
    { name: 'Celsius (°C)', factor: 1, base: 'C' },
    { name: 'Fahrenheit (°F)', factor: 1, base: 'F' },
    { name: 'Kelvin (K)', factor: 1, base: 'K' },
  ],
  Area: [
    { name: 'Square Meters (m²)', factor: 1 },
    { name: 'Square Kilometers (km²)', factor: 1000000 },
    { name: 'Square Feet (ft²)', factor: 0.092903 },
    { name: 'Acres (ac)', factor: 4046.86 },
    { name: 'Hectares (ha)', factor: 10000 },
  ],
  Volume: [
    { name: 'Liters (L)', factor: 1 },
    { name: 'Milliliters (mL)', factor: 0.001 },
    { name: 'Cubic Meters (m³)', factor: 1000 },
    { name: 'Gallons (gal)', factor: 3.78541 },
    { name: 'Cups (cup)', factor: 0.236588 },
  ]
};

const UnitConverter: React.FC<UnitConverterProps> = ({ isDarkMode = true, lang }) => {
  const [category, setCategory] = useState<Category>('Length');
  const [value, setValue] = useState<string>('1');
  const [fromUnit, setFromUnit] = useState(units['Length'][2].name); // Meters
  const [toUnit, setToUnit] = useState(units['Length'][3].name);   // Kilometers
  const [result, setResult] = useState<number>(0);

  const t = translations[lang];

  const convert = () => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      setResult(0);
      return;
    }

    if (category === 'Temperature') {
      let celsius = 0;
      if (fromUnit.includes('Celsius')) celsius = numValue;
      else if (fromUnit.includes('Fahrenheit')) celsius = (numValue - 32) * 5/9;
      else if (fromUnit.includes('Kelvin')) celsius = numValue - 273.15;

      if (toUnit.includes('Celsius')) setResult(celsius);
      else if (toUnit.includes('Fahrenheit')) setResult((celsius * 9/5) + 32);
      else if (toUnit.includes('Kelvin')) setResult(celsius + 273.15);
      return;
    }

    const fromFactor = units[category].find(u => u.name === fromUnit)?.factor || 1;
    const toFactor = units[category].find(u => u.name === toUnit)?.factor || 1;
    
    setResult((numValue * fromFactor) / toFactor);
  };

  useEffect(() => {
    convert();
  }, [value, fromUnit, toUnit, category]);

  const handleCategoryChange = (cat: Category) => {
    setCategory(cat);
    setFromUnit(units[cat][0].name);
    setToUnit(units[cat][1] ? units[cat][1].name : units[cat][0].name);
  };

  const inputClass = `w-full border rounded-2xl p-4 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
    isDarkMode 
      ? 'bg-slate-800/50 border-slate-700 text-slate-100' 
      : 'bg-white border-slate-200 text-slate-900'
  }`;

  const labelClass = `block text-xs font-bold uppercase tracking-widest mb-2 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`;

  return (
    <div className="flex flex-col h-full space-y-6 max-w-2xl mx-auto">
      <div className={`rounded-3xl p-6 border transition-all ${isDarkMode ? 'bg-slate-900/30 border-slate-800' : 'bg-slate-100/50 border-slate-200'}`}>
        <h2 className={`text-xl font-semibold mb-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>{t.unitConverter}</h2>
        
        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-8">
          {(Object.keys(units) as Category[]).map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`py-2 px-1 rounded-xl text-xs font-bold transition-all border ${
                category === cat 
                  ? 'bg-blue-600 border-blue-500 text-white' 
                  : isDarkMode 
                    ? 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200' 
                    : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
              }`}
            >
              {t.categories[cat]}
            </button>
          ))}
        </div>

        <div className="space-y-6">
          <div>
            <label className={labelClass}>{t.valueToConvert}</label>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className={inputClass}
              placeholder="..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>{t.from}</label>
              <select
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
                className={inputClass}
              >
                {units[category].map(u => (
                  <option key={u.name} value={u.name}>{u.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>{t.to}</label>
              <select
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
                className={inputClass}
              >
                {units[category].map(u => (
                  <option key={u.name} value={u.name}>{u.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Result Card */}
      <div className={`rounded-3xl p-8 border transition-all flex flex-col items-center justify-center text-center ${
        isDarkMode ? 'bg-blue-600/10 border-blue-500/20' : 'bg-blue-50 border-blue-100 shadow-sm'
      }`}>
        <span className={labelClass}>{t.result}</span>
        <div className={`text-4xl md:text-5xl font-bold mono mt-2 ${isDarkMode ? 'text-white' : 'text-blue-600'}`}>
          {result.toLocaleString(lang === Language.ES ? 'es-ES' : 'en-US', { maximumFractionDigits: 6 })}
        </div>
        <div className={`text-sm mt-2 font-medium ${isDarkMode ? 'text-blue-400/70' : 'text-blue-400'}`}>
          {toUnit}
        </div>
      </div>
    </div>
  );
};

export default UnitConverter;
