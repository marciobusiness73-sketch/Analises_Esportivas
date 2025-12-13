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
    <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all group">
      <div className="bg-slate-200 dark:bg-slate-700 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-emerald-500 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      </div>
      <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Carregar Dados da Partida</h3>
      <p className="text-slate-500 dark:text-slate-400 mb-6 text-center max-w-md">
        Arraste e solte seu CSV de estatísticas de futebol aqui, ou clique para navegar.
        <br/><span className="text-xs text-slate-400 dark:text-slate-500">(Deve conter HomeTeam, AwayTeam, FTHG, FTAG, HS, AS, etc.)</span>
      </p>
      
      <label className="cursor-pointer bg-emerald-500 hover:bg-emerald-600 text-white dark:text-slate-900 font-bold py-3 px-8 rounded-lg shadow-lg shadow-emerald-500/20 transition-all">
        Selecionar Arquivo CSV
        <input type="file" className="hidden" accept=".csv" onChange={handleFileChange} />
      </label>

      {loading && <p className="mt-4 text-emerald-500 dark:text-emerald-400 animate-pulse">Processando dados...</p>}
      {error && <p className="mt-4 text-rose-500 dark:text-red-400 font-semibold">{error}</p>}
    </div>
  );
};

export default FileUpload;