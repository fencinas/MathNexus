
export interface Calculation {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
}

export enum AppTab {
  CALCULATOR = 'CALCULATOR',
  AI_SOLVER = 'AI_SOLVER',
  UNIT_CONVERTER = 'UNIT_CONVERTER',
  HISTORY = 'HISTORY'
}

export enum Language {
  EN = 'en',
  ES = 'es'
}

export interface AIResponse {
  solution: string;
  explanation: string;
  steps: string[];
}
