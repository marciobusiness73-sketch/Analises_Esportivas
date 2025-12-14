import React from 'react';
import { MatchData, FullTimeResult } from '../types';

interface RecentMatchesProps {
  teamName: string;
  matches: MatchData[];
  context: 'HOME' | 'AWAY'; // Filtra apenas jogos em casa ou fora
}

const RecentMatches: React.FC<RecentMatchesProps> = ({ teamName, matches, context }) => {
  // 1. Filtrar as partidas baseadas no contexto (Casa ou Fora)
  // 2. Pegar as últimas 5 partidas (assumindo que o CSV está em ordem cronológica)
  // 3. Inverter para mostrar a mais recente no topo
  const recentGames = matches
    .filter(m => context === 'HOME' ? m.HomeTeam === teamName : m.AwayTeam === teamName)
    .slice(-5)
    .reverse();

  const getResult = (match: MatchData) => {
    // Se o contexto é HOME, vitória é 'H'. Se é AWAY, vitória é 'A'.
    if (match.FTR === FullTimeResult.D) return 'E';
    
    if (context === 'HOME') {
      return match.FTR === FullTimeResult.H ? 'V' : 'D';
    } else {
      return match.FTR === FullTimeResult.A ? 'V' : 'D';
    }
  };

  const getBadgeStyle = (result: string) => {
    switch (result) {
      case 'V': return 'bg-emerald-400 text-white border-emerald-500'; // Verde Claro
      case 'E': return 'bg-amber-300 text-amber-900 border-amber-400'; // Amarelo Claro
      case 'D': return 'bg-rose-400 text-white border-rose-500'; // Vermelho Claro
      default: return 'bg-slate-200 text-slate-600';
    }
  };

  if (recentGames.length === 0) return null;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="bg-slate-50 dark:bg-slate-800/80 px-4 py-2 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Últimos 5 Jogos ({context === 'HOME' ? 'Em Casa' : 'Fora'})
        </h4>
      </div>
      <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
        {recentGames.map((game, idx) => {
          const result = getResult(game);
          
          return (
            <div key={idx} className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors text-sm">
              
              {/* Times e Placar */}
              <div className="flex-1 grid grid-cols-[1fr,auto,1fr] gap-2 items-center">
                <div className={`text-right truncate font-medium ${game.HomeTeam === teamName ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-500 dark:text-slate-400'}`}>
                  {game.HomeTeam}
                </div>
                
                <div className="bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded text-xs font-mono font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
                  {game.FTHG} - {game.FTAG}
                </div>
                
                <div className={`text-left truncate font-medium ${game.AwayTeam === teamName ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-500 dark:text-slate-400'}`}>
                  {game.AwayTeam}
                </div>
              </div>

              {/* Indicador de Resultado */}
              <div className="ml-4">
                <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold border ${getBadgeStyle(result)}`}>
                  {result}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentMatches;
