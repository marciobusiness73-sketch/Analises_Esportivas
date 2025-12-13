import { GoogleGenAI, Type } from "@google/genai";
import { TeamStats } from "../types";

const initGenAI = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }
  return new GoogleGenAI({ apiKey });
};

export interface PredictionResult {
  winner: string;
  confidenceScore: number;
  reasoning: string;
  keyFactors: string[];
  bettingTips: string[]; // Added betting tips
}

export const analyzeMatchup = async (homeStats: TeamStats, awayStats: TeamStats): Promise<PredictionResult> => {
  try {
    const ai = initGenAI();
    
    // Updated prompt to request betting tips
    const prompt = `
      Atue como um especialista em análise de dados de futebol e apostas esportivas. Analise as estatísticas abaixo para uma partida, considerando especificamente o fator CASA vs FORA.
      
      Time Mandante (Baseado APENAS em jogos em Casa): ${homeStats.teamName}
      - Taxa de Vitória em Casa: ${((homeStats.wins / homeStats.matchesPlayed) * 100).toFixed(1)}%
      - Média de Gols Pró (em Casa): ${(homeStats.goalsFor / homeStats.matchesPlayed).toFixed(2)}
      - Média de Gols Sofridos (em Casa): ${(homeStats.goalsAgainst / homeStats.matchesPlayed).toFixed(2)}
      - Média de Chutes no Alvo: ${homeStats.avgShotsOnTarget}
      - Média de Escanteios: ${homeStats.avgCorners}
      
      Time Visitante (Baseado APENAS em jogos Fora): ${awayStats.teamName}
      - Taxa de Vitória Fora: ${((awayStats.wins / awayStats.matchesPlayed) * 100).toFixed(1)}%
      - Média de Gols Pró (Fora): ${(awayStats.goalsFor / awayStats.matchesPlayed).toFixed(2)}
      - Média de Gols Sofridos (Fora): ${(awayStats.goalsAgainst / awayStats.matchesPlayed).toFixed(2)}
      - Média de Chutes no Alvo: ${awayStats.avgShotsOnTarget}
      - Média de Escanteios: ${awayStats.avgCorners}

      1. Retorne um JSON prevendo o vencedor e fornecendo insights.
      2. GERE 4 SUGESTÕES DE APOSTAS (bettingTips) com alta probabilidade baseadas nos números.
         Exemplos de sugestões: "Mais de 2.5 Gols", "Ambas Marcam: Sim", "Vitória do Time A", "Mais de 9.5 Escanteios", "Dupla Chance Time B".
         Seja específico.

      IMPORTANTE: Os campos 'reasoning', 'keyFactors' e 'bettingTips' DEVEM estar em Português do Brasil (PT-BR).
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            winner: { type: Type.STRING, description: "O nome do time vencedor previsto, ou 'Empate'" },
            confidenceScore: { type: Type.NUMBER, description: "Porcentagem de confiança (0-100)" },
            reasoning: { type: Type.STRING, description: "Um parágrafo curto explicando a previsão em Português" },
            keyFactors: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Lista de 3 fatores estatísticos chave"
            },
            bettingTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Lista de 4 sugestões de mercado de aposta curtas e diretas"
            }
          },
          required: ["winner", "confidenceScore", "reasoning", "keyFactors", "bettingTips"]
        }
      }
    });

    const result = JSON.parse(response.text);
    return result as PredictionResult;

  } catch (error) {
    console.error("Gemini analysis failed:", error);
    // Fallback if API fails or key is missing
    return {
      winner: homeStats.wins > awayStats.wins ? homeStats.teamName : awayStats.teamName,
      confidenceScore: 50,
      reasoning: "Previsão automática baseada no número de vitórias (Serviço de IA indisponível).",
      keyFactors: ["Histórico de Vitórias"],
      bettingTips: ["Mercado de Vencedor", "Over/Under Gols"]
    };
  }
};