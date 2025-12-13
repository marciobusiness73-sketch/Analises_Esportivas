import React, { useState, useMemo, useEffect } from 'react';
import { MatchData, TeamStats } from './types';
import FileUpload from './components/FileUpload';
import StatCard from './components/StatCard';
import ComparisonChart from './components/ComparisonChart';
import PredictionPanel from './components/PredictionPanel';
import { getUniqueTeams, calculateTeamStats } from './utils/statistics';

const App: React.FC = () => {
  const [matchData, setMatchData] = useState<MatchData[]>([]);
  const [homeTeam, setHomeTeam] = useState<string>('');
  const [awayTeam, setAwayTeam] = useState<string>('');
  const [view, setView] = useState<'upload' | 'dashboard'>('upload');
  
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

  // CRITICAL UPDATE: Calculate Home stats using ONLY 'HOME' games context
  const homeStats = useMemo(() => 
    homeTeam ? calculateTeamStats(homeTeam, matchData, 'HOME') : null, 
    [homeTeam, matchData]
  );
  
  // CRITICAL UPDATE: Calculate Away stats using ONLY 'AWAY' games context
  const awayStats = useMemo(() => 
    awayTeam ? calculateTeamStats(awayTeam, matchData, 'AWAY') : null, 
    [awayTeam, matchData]
  );

  const handleDataLoaded = (data: MatchData[]) => {
    setMatchData(data);
    setView('dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-200 font-sans selection:bg-emerald-500 selection:text-white pb-20 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 backdrop-blur-md bg-opacity-80 dark:bg-opacity-80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="bg-emerald-500 p-2 rounded-lg shadow-lg shadow-emerald-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white dark:text-slate-900" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                </svg>
             </div>
             <h1 className="text-2xl font-black tracking-tighter text-slate-800 dark:text-white">
               FUTEBOL <span className="text-emerald-500 dark:text-emerald-400">SHOW</span>
             </h1>
          </div>
          
          <div className="flex items-center gap-4">
             {/* Theme Toggle */}
             <button 
               onClick={() => setDarkMode(!darkMode)}
               className="p-2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
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
                <div className="text-sm text-slate-500 dark:text-slate-400 font-medium hidden md:block">
                  Base de dados: <span className="text-slate-900 dark:text-white">{matchData.length} Partidas</span>
                </div>
             )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {view === 'upload' ? (
          <div className="max-w-2xl mx-auto mt-10 animate-fade-in-up">
             <div className="text-center mb-10">
               <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4">Analise o Jogo.</h2>
               <p className="text-slate-600 dark:text-slate-400 text-lg">Carregue os dados históricos das partidas para gerar estatísticas profissionais e previsões com IA.</p>
             </div>
             <FileUpload onDataLoaded={handleDataLoaded} />
          </div>
        ) : (
          <div className="animate-fade-in">
            {/* Team Selector */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 mb-8">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex-1 w-full">
                   <label className="block text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-2">Time Mandante (Home)</label>
                   <select 
                     className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-colors"
                     value={homeTeam}
                     onChange={(e) => setHomeTeam(e.target.value)}
                   >
                     <option value="">Selecionar Time</option>
                     {teams.map(t => <option key={t} value={t}>{t}</option>)}
                   </select>
                </div>

                <div className="text-2xl font-black text-slate-400 dark:text-slate-600 hidden md:block">VS</div>

                <div className="flex-1 w-full">
                   <label className="block text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">Time Visitante (Away)</label>
                   <select 
                     className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
                     value={awayTeam}
                     onChange={(e) => setAwayTeam(e.target.value)}
                   >
                     <option value="">Selecionar Time</option>
                     {teams.map(t => <option key={t} value={t}>{t}</option>)}
                   </select>
                </div>
              </div>
            </div>

            {homeStats && awayStats ? (
              <div className="space-y-8">
                 {/* Main Dashboard Grid */}
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* Home Stats Column */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
                        <div>
                          <h2 className="text-xl font-bold text-slate-800 dark:text-white">{homeStats.teamName}</h2>
                          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">Jogando em Casa</p>
                        </div>
                      </div>
                      
                      {/* Pontuação Destaque */}
                      <div className="mb-4">
                         <StatCard label="Pontuação Total" value={homeStats.points} color="amber" />
                      </div>

                      {/* Vitórias, Empates, Derrotas */}
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        <StatCard label="Vitórias" value={homeStats.wins} color="emerald" />
                        <StatCard label="Empates" value={homeStats.draws} color="blue" />
                        <StatCard label="Derrotas" value={homeStats.losses} color="rose" />
                      </div>

                      {/* Outras Estatísticas */}
                      <div className="grid grid-cols-2 gap-3">
                        <StatCard label="Taxa de Vitória" value={`${((homeStats.wins / homeStats.matchesPlayed) * 100).toFixed(0)}%`} color="emerald" />
                        <StatCard label="Média de Gols Pró" value={(homeStats.goalsFor / homeStats.matchesPlayed).toFixed(2)} color="emerald" />
                        <StatCard label="Sem Sofrer Gols" value={homeStats.cleanSheets} color="emerald" />
                        <StatCard label="Chutes no Alvo (Méd)" value={homeStats.avgShotsOnTarget} color="emerald" />
                      </div>
                    </div>

                    {/* Away Stats Column */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-4 justify-end text-right">
                        <div>
                          <h2 className="text-xl font-bold text-slate-800 dark:text-white">{awayStats.teamName}</h2>
                          <p className="text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider">Jogando Fora</p>
                        </div>
                        <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                      </div>

                      {/* Pontuação Destaque */}
                      <div className="mb-4">
                         <StatCard label="Pontuação Total" value={awayStats.points} color="amber" />
                      </div>

                      {/* Vitórias, Empates, Derrotas */}
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        <StatCard label="Vitórias" value={awayStats.wins} color="blue" />
                        <StatCard label="Empates" value={awayStats.draws} color="purple" />
                        <StatCard label="Derrotas" value={awayStats.losses} color="rose" />
                      </div>

                      {/* Outras Estatísticas */}
                      <div className="grid grid-cols-2 gap-3">
                         <StatCard label="Taxa de Vitória" value={`${((awayStats.wins / awayStats.matchesPlayed) * 100).toFixed(0)}%`} color="blue" />
                         <StatCard label="Média de Gols Pró" value={(awayStats.goalsFor / awayStats.matchesPlayed).toFixed(2)} color="blue" />
                         <StatCard label="Sem Sofrer Gols" value={awayStats.cleanSheets} color="blue" />
                         <StatCard label="Chutes no Alvo (Méd)" value={awayStats.avgShotsOnTarget} color="blue" />
                      </div>
                    </div>
                 </div>

                 {/* Comparison Chart */}
                 <ComparisonChart homeStats={homeStats} awayStats={awayStats} darkMode={darkMode} />

                 {/* Prediction Panel */}
                 <PredictionPanel homeStats={homeStats} awayStats={awayStats} />

                 {/* Head to Head Table (Simplified Recent Form) */}
                 <div className="mt-8">
                    <h3 className="text-slate-800 dark:text-white font-bold mb-4">Comparação (Casa vs Fora)</h3>
                    <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
                      <table className="w-full text-sm text-left text-slate-600 dark:text-slate-400">
                        <thead className="text-xs text-slate-500 dark:text-slate-200 uppercase bg-slate-100 dark:bg-slate-800">
                          <tr>
                            <th className="px-6 py-3">Métrica</th>
                            <th className="px-6 py-3 text-emerald-600 dark:text-emerald-400">
                              {homeStats.teamName} <span className="text-slate-400 dark:text-slate-500 text-[10px]">(CASA)</span>
                            </th>
                            <th className="px-6 py-3 text-blue-600 dark:text-blue-400">
                              {awayStats.teamName} <span className="text-slate-400 dark:text-slate-500 text-[10px]">(FORA)</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-800">
                          <tr><td className="px-6 py-3 font-medium text-amber-500 dark:text-amber-400">Pontuação Total</td><td className="px-6 py-3 font-bold text-slate-800 dark:text-white">{homeStats.points}</td><td className="px-6 py-3 font-bold text-slate-800 dark:text-white">{awayStats.points}</td></tr>
                          <tr><td className="px-6 py-3 font-medium">Partidas Analisadas</td><td className="px-6 py-3">{homeStats.matchesPlayed}</td><td className="px-6 py-3">{awayStats.matchesPlayed}</td></tr>
                          <tr><td className="px-6 py-3 font-medium">Vitórias / Empates / Derrotas</td><td className="px-6 py-3">{homeStats.wins} / {homeStats.draws} / {homeStats.losses}</td><td className="px-6 py-3">{awayStats.wins} / {awayStats.draws} / {awayStats.losses}</td></tr>
                          <tr><td className="px-6 py-3 font-medium">Gols Pró (Total)</td><td className="px-6 py-3">{homeStats.goalsFor}</td><td className="px-6 py-3">{awayStats.goalsFor}</td></tr>
                          <tr><td className="px-6 py-3 font-medium">Gols Sofridos (Total)</td><td className="px-6 py-3">{homeStats.goalsAgainst}</td><td className="px-6 py-3">{awayStats.goalsAgainst}</td></tr>
                          <tr><td className="px-6 py-3 font-medium">Média Escanteios</td><td className="px-6 py-3">{homeStats.avgCorners}</td><td className="px-6 py-3">{awayStats.avgCorners}</td></tr>
                        </tbody>
                      </table>
                    </div>
                 </div>

              </div>
            ) : (
              <div className="text-center py-20 bg-slate-50 dark:bg-slate-800/50 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700">
                <p className="text-slate-500 font-medium">Selecione um time Mandante e um Visitante para visualizar o painel de confronto.</p>
              </div>
            )}
            
            <button 
              onClick={() => { setMatchData([]); setView('upload'); setHomeTeam(''); setAwayTeam(''); }}
              className="mt-8 text-sm text-slate-500 hover:text-slate-800 dark:hover:text-white underline underline-offset-4"
            >
              Carregar outra base de dados
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;