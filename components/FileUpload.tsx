import React, { useState } from 'react';
import { MatchData } from '../types';
import { parseCSV } from '../utils/csvParser';

interface FileUploadProps {
  onDataLoaded: (data: MatchData[]) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onDataLoaded }) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = event.target.files?.[0];
    
    if (!file) return;

    if (file.type !== "text/csv" && !file.name.endsWith('.csv')) {
      setError("Por favor, envie um arquivo .csv válido.");
      return;
    }

    setLoading(true);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (text) {
        const parsedData = parseCSV(text);
        if (parsedData.length > 0) {
          onDataLoaded(parsedData);
        } else {
          setError("Não foi possível processar os dados. Verifique se o CSV está no formato correto.");
        }
      }
      setLoading(false);
    };

    reader.onerror = () => {
      setError("Erro ao ler o arquivo.");
      setLoading(false);
    };

    reader.readAsText(file);
  };

  return (
    <div className="relative flex flex-col items-center justify-center p-12 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all group overflow-hidden">
      
      {/* Decorative soccer field lines background */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
         <svg width="100%" height="100%">
            <rect x="0" y="0" width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth="2" />
            <circle cx="50%" cy="50%" r="20%" fill="none" stroke="currentColor" strokeWidth="2" />
            <line x1="50%" y1="0" x2="50%" y2="100%" stroke="currentColor" strokeWidth="2" />
         </svg>
      </div>

      <div className="bg-emerald-100 dark:bg-emerald-900/50 p-6 rounded-full mb-4 group-hover:scale-110 transition-transform z-10">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-emerald-600 dark:text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
          <path d="M12 14h.01"></path>
          <path d="M12 6h.01"></path>
          <path d="M12 18h.01"></path>
          <path d="M8 10h.01"></path>
          <path d="M16 10h.01"></path>
          <path d="M9 2v2"></path>
          <path d="M15 2v2"></path>
          <path d="M12 2v2"></path>
        </svg>
      </div>
      <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2 z-10">Carregar Dados da Partida</h3>
      <p className="text-slate-500 dark:text-slate-400 mb-6 text-center max-w-md z-10">
        Arraste e solte seu CSV de estatísticas de futebol aqui, ou clique para navegar.
        <br/><span className="text-xs text-slate-400 dark:text-slate-500">(Deve conter HomeTeam, AwayTeam, FTHG, FTAG, HS, AS, etc.)</span>
      </p>
      
      <label className="z-10 cursor-pointer bg-emerald-500 hover:bg-emerald-600 text-white dark:text-slate-900 font-bold py-3 px-8 rounded-lg shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
        Selecionar Arquivo CSV
        <input type="file" className="hidden" accept=".csv" onChange={handleFileChange} />
      </label>

      {loading && <p className="mt-4 text-emerald-500 dark:text-emerald-400 animate-pulse z-10">Processando dados...</p>}
      {error && <p className="mt-4 text-rose-500 dark:text-red-400 font-semibold z-10">{error}</p>}
    </div>
  );
};

export default FileUpload;