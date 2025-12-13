import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  color?: "emerald" | "blue" | "rose" | "amber" | "purple";
}

const StatCard: React.FC<StatCardProps> = ({ label, value, subValue, color = "emerald" }) => {
  const colorClasses = {
    emerald: "border-emerald-500/50 text-emerald-600 dark:text-emerald-400",
    blue: "border-blue-500/50 text-blue-600 dark:text-blue-400",
    rose: "border-rose-500/50 text-rose-600 dark:text-rose-400",
    amber: "border-amber-500/50 text-amber-600 dark:text-amber-400",
    purple: "border-purple-500/50 text-purple-600 dark:text-purple-400",
  };

  return (
    <div className={`bg-white dark:bg-slate-800 border-l-4 ${colorClasses[color]} p-4 rounded-r-lg shadow-sm dark:shadow-md border border-slate-100 dark:border-transparent`}>
      <h4 className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">{label}</h4>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-black text-slate-800 dark:text-white">{value}</span>
        {subValue && <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">{subValue}</span>}
      </div>
    </div>
  );
};

export default StatCard;