import React from 'react';

export type StatIconType = 'trophy' | 'ball' | 'shoe' | 'flag' | 'card' | 'whistle' | 'target' | 'shield' | 'chart';

interface StatCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  color?: "emerald" | "blue" | "rose" | "amber" | "purple";
  icon?: StatIconType;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, subValue, color = "emerald", icon }) => {
  const colorClasses = {
    emerald: "border-emerald-500/50 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-900/10",
    blue: "border-blue-500/50 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/10",
    rose: "border-rose-500/50 text-rose-600 dark:text-rose-400 bg-rose-50/50 dark:bg-rose-900/10",
    amber: "border-amber-500/50 text-amber-600 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-900/10",
    purple: "border-purple-500/50 text-purple-600 dark:text-purple-400 bg-purple-50/50 dark:bg-purple-900/10",
  };

  const renderIcon = () => {
    switch (icon) {
      case 'trophy':
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z M9.75 17h4.5c.621 0 1.125.504 1.125 1.125V21h-6.75v-2.875c0-.621.504-1.125 1.125-1.125z" />; // Simplified trophy idea or just general award
      case 'ball':
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" />; 
      case 'shoe': // Representing goals/kicks
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 13l-7 7-7-7m14-8l-7 7-7-7" />; // Placeholder arrow, custom SVGs below
      case 'flag':
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 21v-8a2 2 0 012-2h14a2 2 0 012 2v8M3 13V6a2 2 0 012-2h14a2 2 0 012 2v7" />; // Using generic shapes, better below
      default:
        return null;
    }
  };

  // Inline SVGs for better control
  const icons: Record<StatIconType, React.ReactNode> = {
    trophy: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.504-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0V5.625a2.25 2.25 0 10-4.5 0v5.75m4.5 0v3.25a2.25 2.25 0 01-2.25 2.25H11.75a2.25 2.25 0 01-2.25-2.25v-3.25" />
      </svg>
    ),
    ball: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 21a9 9 0 110-18 9 9 0 010 18z" />
         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 7a5 5 0 00-4 6.3 5 5 0 008 0A5 5 0 0012 7z" />
      </svg>
    ),
    shoe: (
       <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
       </svg>
    ),
    flag: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 21v-8a2 2 0 012-2h14a2 2 0 012 2v8M3 21h18M5 11V3a2 2 0 012-2h14a2 2 0 012 2v8" />
      </svg>
    ),
    card: (
       <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
       </svg>
    ),
    whistle: (
       <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
       </svg>
    ),
    target: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    shield: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    chart: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
      </svg>
    )
  };

  return (
    <div className={`bg-white dark:bg-slate-800 border-l-4 ${colorClasses[color]} p-4 rounded-r-lg shadow-sm dark:shadow-md border border-slate-100 dark:border-transparent transition-transform hover:scale-[1.02] flex items-center justify-between`}>
      <div>
        <h4 className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">{label}</h4>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-slate-800 dark:text-white">{value}</span>
          {subValue && <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">{subValue}</span>}
        </div>
      </div>
      {icon && (
        <div className={`p-2 rounded-full ${colorClasses[color].split(' ')[2]}`}>
           {icons[icon]}
        </div>
      )}
    </div>
  );
};

export default StatCard;