import { TeamStats } from '../types';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const exportToJSON = (homeStats: TeamStats, awayStats: TeamStats) => {
  const data = {
    generatedAt: new Date().toISOString(),
    matchup: `${homeStats.teamName} vs ${awayStats.teamName}`,
    homeStats,
    awayStats
  };
  
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  link.href = url;
  link.download = `analise_${homeStats.teamName}_vs_${awayStats.teamName}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToXLSX = (homeStats: TeamStats, awayStats: TeamStats) => {
  const wb = XLSX.utils.book_new();
  
  const comparisonData = [
    ["Métrica", `${homeStats.teamName} (Casa)`, `${awayStats.teamName} (Fora)`],
    ["Partidas Jogadas", homeStats.matchesPlayed, awayStats.matchesPlayed],
    ["Pontos", homeStats.points, awayStats.points],
    ["Vitórias", homeStats.wins, awayStats.wins],
    ["Empates", homeStats.draws, awayStats.draws],
    ["Derrotas", homeStats.losses, awayStats.losses],
    ["Gols Pró (Total)", homeStats.goalsFor, awayStats.goalsFor],
    ["Gols Sofridos (Total)", homeStats.goalsAgainst, awayStats.goalsAgainst],
    ["Gols/Jogo (Média)", (homeStats.goalsFor / homeStats.matchesPlayed).toFixed(2), (awayStats.goalsFor / awayStats.matchesPlayed).toFixed(2)],
    ["Chutes/Jogo", homeStats.avgShots, awayStats.avgShots],
    ["Chutes no Alvo/Jogo", homeStats.avgShotsOnTarget, awayStats.avgShotsOnTarget],
    ["Escanteios/Jogo", homeStats.avgCorners, awayStats.avgCorners],
    ["Cartões Amarelos/Jogo", homeStats.avgYellowCards, awayStats.avgYellowCards],
    ["Clean Sheets", homeStats.cleanSheets, awayStats.cleanSheets],
  ];

  const ws = XLSX.utils.aoa_to_sheet(comparisonData);
  
  // Largura das colunas
  ws['!cols'] = [{ wch: 25 }, { wch: 25 }, { wch: 25 }];

  XLSX.utils.book_append_sheet(wb, ws, "Comparação");
  XLSX.writeFile(wb, `analise_${homeStats.teamName}_vs_${awayStats.teamName}.xlsx`);
};

export const exportToPDF = (homeStats: TeamStats, awayStats: TeamStats) => {
  const doc = new jsPDF();

  // Título
  doc.setFontSize(18);
  doc.text("Relatório de Análise - Futebol Show", 14, 22);
  
  doc.setFontSize(14);
  doc.text(`${homeStats.teamName} (Casa) vs ${awayStats.teamName} (Fora)`, 14, 32);
  
  doc.setFontSize(10);
  doc.text(`Gerado em: ${new Date().toLocaleDateString()} às ${new Date().toLocaleTimeString()}`, 14, 40);

  const tableColumn = ["Métrica", homeStats.teamName, awayStats.teamName];
  const tableRows = [
    ["Pontos", homeStats.points, awayStats.points],
    ["Vitórias", homeStats.wins, awayStats.wins],
    ["Empates", homeStats.draws, awayStats.draws],
    ["Derrotas", homeStats.losses, awayStats.losses],
    ["Gols Pró", homeStats.goalsFor, awayStats.goalsFor],
    ["Gols Sofridos", homeStats.goalsAgainst, awayStats.goalsAgainst],
    ["Média Escanteios", homeStats.avgCorners, awayStats.avgCorners],
    ["Média Chutes no Alvo", homeStats.avgShotsOnTarget, awayStats.avgShotsOnTarget],
    ["Clean Sheets", homeStats.cleanSheets, awayStats.cleanSheets],
  ];

  // Use the imported autoTable function directly
  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 50,
    theme: 'grid',
    headStyles: { fillColor: [16, 185, 129] }, // Emerald color
  });

  doc.save(`analise_${homeStats.teamName}_vs_${awayStats.teamName}.pdf`);
};