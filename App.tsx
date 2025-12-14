import React, { useState, useMemo, useEffect } from 'react';
import { MatchData, TeamStats } from './types';
import FileUpload from './components/FileUpload';
import StatCard from './components/StatCard';
import ComparisonChart from './components/ComparisonChart';
import PredictionPanel from './components/PredictionPanel';
import RecentMatches from './components/RecentMatches';
import { getUniqueTeams, calculateTeamStats } from './utils/statistics';
import { exportToJSON, exportToXLSX, exportToPDF } from './utils/exportUtils';

const App: React.FC = () => {
  const [matchData, setMatchData] = useState<MatchData[]>([]);
  const [homeTeam, setHomeTeam] = useState<string>('');
  const [awayTeam, setAwayTeam] = useState<string>('');
  const [view, setView] = useState<'upload' | 'dashboard'>('upload');
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  
  // Theme State
  const [darkMode, setDarkMode] = useState(true);

  // Apply theme class to body/html
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const teams = useMemo(() => getUniqueTeams(matchData), [matchData]);

  const homeStats = useMemo(() => 
    homeTeam ? calculateTeamStats(homeTeam, matchData, 'HOME') : null, 
    [homeTeam, matchData]
  );
  
  const awayStats = useMemo(() => 
    awayTeam ? calculateTeamStats(awayTeam, matchData, 'AWAY') : null, 
    [awayTeam, matchData]
  );

  const handleDataLoaded = (data: MatchData[]) => {
    setMatchData(data);
    setView('dashboard');
  };

  const handleAnalyze = () => {
    if (!homeTeam || !awayTeam) {
      alert("Por favor, selecione ambos os times.");
      return;
    }
    if (homeTeam === awayTeam) {
      alert("Selecione times diferentes para a análise.");
      return;
    }
    setIsAnalyzed(true);
  };

  const handleClear = () => {
    setHomeTeam('');
    setAwayTeam('');
    setIsAnalyzed(false);
  };

  // Reset analysis if teams change manually after analysis
  useEffect(() => {
    if (isAnalyzed) {
      // Optional: keep analysis view but maybe show a warning? 
      // Or just reset analysis view to force user to click 'Analyze' again for consistency.
      // For this requirement: "1 para Analisar. Depois que eu selecionar... a analise será realizada"
      // it implies the view depends on the button click.
      setIsAnalyzed(false);
    }
  }, [homeTeam, awayTeam]);

  return (
    <div className="relative min-h-screen font-sans selection:bg-emerald-500 selection:text-white pb-20 transition-colors duration-300 text-slate-900 dark:text-slate-200">
      
      {/* Background Image with Overlay */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1522770179533-24471fcdba45?q=80&w=2560&auto=format&fit=crop")' }}
      ></div>
      <div className="fixed inset-0 z-0 bg-slate-100/90 dark:bg-slate-900/95 backdrop-blur-sm"></div>

      {/* Header */}
      <header className="relative z-50 bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 sticky top-0 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="bg-gradient-to-br from-emerald-400 to-emerald-600 p-2 rounded-lg shadow-lg shadow-emerald-500/20 transform rotate-3">
                {/* Football Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M4.93 4.93l4.24 4.24"></path>
                  <path d="M14.83 9.17l4.24-4.24"></path>
                  <path d="M14.83 14.83l4.24 4.24"></path>
                  <path d="M9.17 14.83L4.93 19.07"></path>
                  <circle cx="12" cy="12" r="2"></circle>
                </svg>
             </div>
             <div>
                <h1 className="text-2xl font-black tracking-tighter text-slate-800 dark:text-white leading-none">
                  FUTEBOL <span className="text-emerald-500 dark:text-emerald-400">SHOW</span>
                </h1>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Analytics Pro</p>
             </div>
          </div>
          
          <div className="flex items-center gap-4">
             {/* Theme Toggle */}
             <button 
               onClick={() => setDarkMode(!darkMode)}
               className="p-2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors shadow-sm"
               aria-label="Toggle Theme"
             >
               {darkMode ? (
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                 </svg>
               ) : (
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                 </svg>
               )}
             </button>

             {matchData.length > 0 && (
                <div className="text-sm text-slate-500 dark:text-slate-400 font-medium hidden md:block px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-900 dark:text-white font-bold">{matchData.length}</span> Partidas
                </div>
             )}
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {view === 'upload' ? (
          <div className="max-w-2xl mx-auto mt-10 animate-fade-in-up">
             <div className="text-center mb-10">
               <span className="inline-block py-1 px-3 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4 border border-emerald-200 dark:border-emerald-800">
                 Futebol Analytics Suite
               </span>
               <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
                 Analise o Jogo. <br/><span className="text-emerald-500 dark:text-emerald-400">Vença a Aposta.</span>
               </h2>
               <p className="text-slate-600 dark:text-slate-400 text-lg max-w-lg mx-auto">
                 Carregue os dados históricos das partidas para gerar estatísticas profissionais e previsões com IA do Google Gemini.
               </p>
             </div>
             <FileUpload onDataLoaded={handleDataLoaded} />
          </div>
        ) : (
          <div className="animate-fade-in">
            {/* Team Selector & Controls */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 mb-8 relative overflow-visible">
               <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
              
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between relative z-10 mb-6">
                <div className="flex-1 w-full">
                   <label className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-2">
                     <span className="h-2 w-2 rounded-full bg-emerald-500"></span> Time Mandante (Home)
                   </label>
                   <select 
                     className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-colors shadow-sm"
                     value={homeTeam}
                     onChange={(e) => setHomeTeam(e.target.value)}
                   >
                     <option value="">Selecionar Time</option>
                     {teams.map(t => <option key={t} value={t}>{t}</option>)}
                   </select>
                </div>

                <div className="text-2xl font-black text-slate-300 dark:text-slate-700 hidden md:block italic px-4">VS</div>

                <div className="flex-1 w-full">
                   <label className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">
                     <span className="h-2 w-2 rounded-full bg-blue-500"></span> Time Visitante (Away)
                   </label>
                   <select 
                     className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors shadow-sm"
                     value={awayTeam}
                     onChange={(e) => setAwayTeam(e.target.value)}
                   >
                     <option value="">Selecionar Time</option>
                     {teams.map(t => <option key={t} value={t}>{t}</option>)}
                   </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-center border-t border-slate-100 dark:border-slate-700/50 pt-6">
                
                <button
                  onClick={handleClear}
                  className="w-full sm:w-auto px-6 py-3 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Limpar
                </button>

                <button
                  onClick={handleAnalyze}
                  className="w-full sm:w-auto px-10 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-500/30 transform active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
                  </svg>
                  Analisar
                </button>

                {isAnalyzed && homeStats && awayStats && (
                  <div className="relative">
                    <button
                      onClick={() => setShowExportMenu(!showExportMenu)}
                      className="w-full sm:w-auto px-6 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-bold shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Exportar
                    </button>
                    
                    {/* Export Dropdown */}
                    {showExportMenu && (
                      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden animate-fade-in">
                        <button onClick={() => { exportToXLSX(homeStats, awayStats); setShowExportMenu(false); }} className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-medium flex items-center gap-2">
                          <span className="text-green-600">📊</span> Excel (.xlsx)
                        </button>
                        <button onClick={() => { exportToPDF(homeStats, awayStats); setShowExportMenu(false); }} className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-medium flex items-center gap-2 border-t border-slate-100 dark:border-slate-700">
                          <span className="text-red-500">📄</span> PDF
                        </button>
                        <button onClick={() => { exportToJSON(homeStats, awayStats); setShowExportMenu(false); }} className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-medium flex items-center gap-2 border-t border-slate-100 dark:border-slate-700">
                          <span className="text-yellow-500">code</span> JSON
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* CONTENT AREA - Only shown if Analyzed is true */}
            {isAnalyzed && homeStats && awayStats ? (
              <div className="space-y-8 animate-fade-in-up">
                 {/* Main Dashboard Grid */}
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* Home Stats Column */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 mb-4 p-3 bg-white dark:bg-slate-800 rounded-lg shadow-sm border-l-4 border-emerald-500">
                        <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
                           <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-slate-800 dark:text-white">{homeStats.teamName}</h2>
                          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">Jogando em Casa</p>
                        </div>
                      </div>
                      
                      {/* Pontuação Destaque */}
                      <div className="mb-4">
                         <StatCard label="Pontuação Total" value={homeStats.points} color="amber" icon="trophy" />
                      </div>

                      {/* Recent Matches Component */}
                      <div className="mb-4">
                        <RecentMatches teamName={homeStats.teamName} matches={matchData} context="HOME" />
                      </div>

                      {/* Vitórias, Empates, Derrotas */}
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        <StatCard label="Vitórias" value={homeStats.wins} color="emerald" icon="chart" />
                        <StatCard label="Empates" value={homeStats.draws} color="blue" />
                        <StatCard label="Derrotas" value={homeStats.losses} color="rose" />
                      </div>

                      {/* Outras Estatísticas */}
                      <div className="grid grid-cols-2 gap-3">
                        <StatCard label="Taxa de Vitória" value={`${((homeStats.wins / homeStats.matchesPlayed) * 100).toFixed(0)}%`} color="emerald" icon="target" />
                        <StatCard label="Média de Gols Pró" value={(homeStats.goalsFor / homeStats.matchesPlayed).toFixed(2)} color="emerald" icon="ball" />
                        <StatCard label="Sem Sofrer Gols" value={homeStats.cleanSheets} color="emerald" icon="shield" />
                        <StatCard label="Chutes no Alvo" value={homeStats.avgShotsOnTarget} color="emerald" icon="shoe" />
                      </div>
                    </div>

                    {/* Away Stats Column */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-end gap-3 mb-4 p-3 bg-white dark:bg-slate-800 rounded-lg shadow-sm border-r-4 border-blue-500">
                        <div className="text-right">
                          <h2 className="text-xl font-bold text-slate-800 dark:text-white">{awayStats.teamName}</h2>
                          <p className="text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider">Jogando Fora</p>
                        </div>
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                           <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                        </div>
                      </div>

                      {/* Pontuação Destaque */}
                      <div className="mb-4">
                         <StatCard label="Pontuação Total" value={awayStats.points} color="amber" icon="trophy" />
                      </div>

                      {/* Recent Matches Component */}
                      <div className="mb-4">
                        <RecentMatches teamName={awayStats.teamName} matches={matchData} context="AWAY" />
                      </div>

                      {/* Vitórias, Empates, Derrotas */}
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        <StatCard label="Vitórias" value={awayStats.wins} color="blue" icon="chart" />
                        <StatCard label="Empates" value={awayStats.draws} color="purple" />
                        <StatCard label="Derrotas" value={awayStats.losses} color="rose" />
                      </div>

                      {/* Outras Estatísticas */}
                      <div className="grid grid-cols-2 gap-3">
                         <StatCard label="Taxa de Vitória" value={`${((awayStats.wins / awayStats.matchesPlayed) * 100).toFixed(0)}%`} color="blue" icon="target" />
                         <StatCard label="Média de Gols Pró" value={(awayStats.goalsFor / awayStats.matchesPlayed).toFixed(2)} color="blue" icon="ball" />
                         <StatCard label="Sem Sofrer Gols" value={awayStats.cleanSheets} color="blue" icon="shield" />
                         <StatCard label="Chutes no Alvo" value={awayStats.avgShotsOnTarget} color="blue" icon="shoe" />
                      </div>
                    </div>
                 </div>

                 {/* Comparison Chart */}
                 <ComparisonChart homeStats={homeStats} awayStats={awayStats} darkMode={darkMode} />

                 {/* Prediction Panel */}
                 <PredictionPanel homeStats={homeStats} awayStats={awayStats} />

                 {/* Head to Head Table (Simplified Recent Form) */}
                 <div className="mt-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 flex items-center gap-2">
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                       </svg>
                       <h3 className="text-slate-800 dark:text-white font-bold">Comparação Detalhada (Casa vs Fora)</h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left text-slate-600 dark:text-slate-400">
                        <thead className="text-xs text-slate-500 dark:text-slate-200 uppercase bg-slate-100 dark:bg-slate-900/50">
                          <tr>
                            <th className="px-6 py-4">Métrica</th>
                            <th className="px-6 py-4 text-emerald-600 dark:text-emerald-400 font-bold border-l border-slate-200 dark:border-slate-700">
                              {homeStats.teamName} <span className="text-slate-400 dark:text-slate-500 text-[10px] font-normal ml-1">(CASA)</span>
                            </th>
                            <th className="px-6 py-4 text-blue-600 dark:text-blue-400 font-bold border-l border-slate-200 dark:border-slate-700">
                              {awayStats.teamName} <span className="text-slate-400 dark:text-slate-500 text-[10px] font-normal ml-1">(FORA)</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                          <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                             <td className="px-6 py-4 font-medium flex items-center gap-2"><span className="text-amber-500">🏆</span> Pontuação Total</td>
                             <td className="px-6 py-4 font-black text-slate-800 dark:text-white text-lg border-l border-slate-200 dark:border-slate-700">{homeStats.points}</td>
                             <td className="px-6 py-4 font-black text-slate-800 dark:text-white text-lg border-l border-slate-200 dark:border-slate-700">{awayStats.points}</td>
                          </tr>
                          <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                             <td className="px-6 py-4 font-medium">Partidas Analisadas</td>
                             <td className="px-6 py-4 border-l border-slate-200 dark:border-slate-700">{homeStats.matchesPlayed}</td>
                             <td className="px-6 py-4 border-l border-slate-200 dark:border-slate-700">{awayStats.matchesPlayed}</td>
                          </tr>
                          <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                             <td className="px-6 py-4 font-medium">V / E / D</td>
                             <td className="px-6 py-4 border-l border-slate-200 dark:border-slate-700">
                               <span className="text-emerald-500 font-bold">{homeStats.wins}</span> / <span className="text-blue-500 font-bold">{homeStats.draws}</span> / <span className="text-rose-500 font-bold">{homeStats.losses}</span>
                             </td>
                             <td className="px-6 py-4 border-l border-slate-200 dark:border-slate-700">
                               <span className="text-emerald-500 font-bold">{awayStats.wins}</span> / <span className="text-blue-500 font-bold">{awayStats.draws}</span> / <span className="text-rose-500 font-bold">{awayStats.losses}</span>
                             </td>
                          </tr>
                          <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                             <td className="px-6 py-4 font-medium">Gols Pró (Total)</td>
                             <td className="px-6 py-4 border-l border-slate-200 dark:border-slate-700">{homeStats.goalsFor}</td>
                             <td className="px-6 py-4 border-l border-slate-200 dark:border-slate-700">{awayStats.goalsFor}</td>
                          </tr>
                          <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                             <td className="px-6 py-4 font-medium">Gols Sofridos (Total)</td>
                             <td className="px-6 py-4 border-l border-slate-200 dark:border-slate-700">{homeStats.goalsAgainst}</td>
                             <td className="px-6 py-4 border-l border-slate-200 dark:border-slate-700">{awayStats.goalsAgainst}</td>
                          </tr>
                          <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                             <td className="px-6 py-4 font-medium flex items-center gap-2">🚩 Média Escanteios</td>
                             <td className="px-6 py-4 border-l border-slate-200 dark:border-slate-700">{homeStats.avgCorners}</td>
                             <td className="px-6 py-4 border-l border-slate-200 dark:border-slate-700">{awayStats.avgCorners}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                 </div>

              </div>
            ) : (
              // Placeholder when waiting for analysis
              <div className="text-center py-20 bg-slate-50/80 dark:bg-slate-800/80 backdrop-blur rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center animate-fade-in">
                <div className="bg-slate-200 dark:bg-slate-700 p-4 rounded-full mb-4">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
                   </svg>
                </div>
                <p className="text-slate-500 font-medium text-lg">Selecione os times e clique em "Analisar".</p>
                <p className="text-slate-400 text-sm mt-2">Escolha um Mandante e um Visitante para visualizar o confronto.</p>
              </div>
            )}
            
            <button 
              onClick={() => { setMatchData([]); setView('upload'); setHomeTeam(''); setAwayTeam(''); setIsAnalyzed(false); }}
              className="mt-8 mx-auto block text-sm font-medium text-slate-500 hover:text-slate-800 dark:hover:text-white bg-white/50 dark:bg-slate-800/50 px-4 py-2 rounded-full backdrop-blur transition-colors"
            >
              ← Carregar outra base de dados
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;