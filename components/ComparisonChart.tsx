import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TeamStats } from '../types';

interface ComparisonChartProps {
  homeStats: TeamStats;
  awayStats: TeamStats;
  darkMode: boolean;
}

const ComparisonChart: React.FC<ComparisonChartProps> = ({ homeStats, awayStats, darkMode }) => {
  const data = [
    { name: 'Gols/Jogo', Home: (homeStats.goalsFor / homeStats.matchesPlayed).toFixed(2), Away: (awayStats.goalsFor / awayStats.matchesPlayed).toFixed(2) },
    { name: 'Finalizações', Home: homeStats.avgShots, Away: awayStats.avgShots },
    { name: 'No Alvo', Home: homeStats.avgShotsOnTarget, Away: awayStats.avgShotsOnTarget },
    { name: 'Escanteios', Home: homeStats.avgCorners, Away: awayStats.avgCorners },
    { name: 'Cartões Am.', Home: homeStats.avgYellowCards, Away: awayStats.avgYellowCards },
  ];

  // Colors based on theme
  const axisColor = darkMode ? "#94a3b8" : "#64748b";
  const gridColor = darkMode ? "#334155" : "#e2e8f0";
  const tooltipBg = darkMode ? '#1e293b' : '#ffffff';
  const tooltipBorder = darkMode ? '#475569' : '#cbd5e1';
  const tooltipText = darkMode ? '#f8fafc' : '#1e293b';

  return (
    <div className="h-80 w-full bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md dark:shadow-lg border border-slate-200 dark:border-slate-700/50">
      <h3 className="text-slate-800 dark:text-white font-bold mb-4">Comparação Estatística</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis dataKey="name" stroke={axisColor} tick={{fontSize: 12}} />
          <YAxis stroke={axisColor} tick={{fontSize: 12}} />
          <Tooltip 
            contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, color: tooltipText }}
            itemStyle={{ color: tooltipText }}
            cursor={{fill: gridColor, opacity: 0.4}}
          />
          <Legend wrapperStyle={{ paddingTop: '10px' }} />
          <Bar dataKey="Home" name={homeStats.teamName} fill="#10b981" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Away" name={awayStats.teamName} fill="#3b82f6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ComparisonChart;