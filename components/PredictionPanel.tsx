import React, { useState } from 'react';
import { TeamStats } from '../types';
import { analyzeMatchup, PredictionResult } from '../services/geminiService';

interface PredictionPanelProps {
  homeStats: TeamStats;
  awayStats: TeamStats;
}

const PredictionPanel: React.FC<PredictionPanelProps> = ({ homeStats, awayStats }) => {
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = async () => {
    setLoading(true);
    const result = await analyzeMatchup(homeStats, awayStats);
    setPrediction(result);
    setLoading(false);
  };

  if (!prediction && !loading) {
    return (
      <div className="mt-8 flex justify-center">
        <button 
          onClick={handlePredict}
          className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-black py-4 px-10 rounded-full shadow-lg shadow-emerald-500/30 transform hover:scale-105 transition-all text-lg flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          GERAR PREVISÃO COM IA
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mt-8 p-8 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 animate-pulse flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-emerald-600 dark:text-emerald-400 font-bold">Analisando dados históricos...</p>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-6">
      
      {/* Betting Tips Section - NEW */}
      <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-700/50 rounded-xl p-6 shadow-md relative overflow-hidden">
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-amber-500 p-1.5 rounded-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-black text-amber-700 dark:text-amber-400 uppercase tracking-tight">Sugestões de Aposta</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {prediction?.bettingTips?.map((tip, idx) => (
             <div key={idx} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-amber-100 dark:border-amber-800/30 shadow-sm">
                <span className="font-bold text-slate-700 dark:text-slate-200">{tip}</span>
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
             </div>
          ))}
        </div>
      </div>

      {/* Main Analysis Panel */}
      <div className="bg-white dark:bg-gradient-to-br dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-emerald-500/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 dark:opacity-10">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-40 w-40 text-slate-900 dark:text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
             <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
          </svg>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
             <span className="bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-emerald-200 dark:border-emerald-500/20">Insight da IA</span>
             <span className="text-slate-500 dark:text-slate-400 text-xs">Desenvolvido por Gemini</span>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h3 className="text-slate-500 dark:text-slate-400 font-medium mb-1">Vencedor Previsto</h3>
              <div className="text-3xl md:text-4xl font-black text-slate-800 dark:text-white tracking-tight">
                {prediction?.winner}
              </div>
            </div>
            <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
              <div className="text-right">
                <div className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase">Confiança</div>
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{prediction?.confidenceScore}%</div>
              </div>
              <div className="h-12 w-12 rounded-full border-4 border-slate-200 dark:border-slate-700 flex items-center justify-center relative">
                 <svg className="absolute top-0 left-0 w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-slate-200 dark:text-slate-700"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="text-emerald-500"
                      strokeDasharray={`${prediction?.confidenceScore}, 100`}
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                 </svg>
              </div>
            </div>
          </div>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6 border-l-4 border-emerald-500 pl-4 italic">
            "{prediction?.reasoning}"
          </p>

          <div>
            <h4 className="text-slate-800 dark:text-white font-bold mb-3">Fatores Chave</h4>
            <div className="flex flex-wrap gap-2">
              {prediction?.keyFactors.map((factor, idx) => (
                <span key={idx} className="bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-3 py-1.5 rounded-md text-sm font-medium">
                  {factor}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictionPanel;