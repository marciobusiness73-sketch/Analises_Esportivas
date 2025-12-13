export enum FullTimeResult {
  H = 'H',
  D = 'D',
  A = 'A'
}

export interface MatchData {
  Date: string;
  HomeTeam: string;
  AwayTeam: string;
  FTHG: number; // Full Time Home Goals
  FTAG: number; // Full Time Away Goals
  FTR: FullTimeResult | string; // Full Time Result
  HTHG: number; // Half Time Home Goals
  HTAG: number; // Half Time Away Goals
  HTR: string; // Half Time Result
  HS: number; // Home Shots
  AS: number; // Away Shots
  HST: number; // Home Shots on Target
  AST: number; // Away Shots on Target
  HF: number; // Home Fouls
  AF: number; // Away Fouls
  HC: number; // Home Corners
  AC: number; // Away Corners
  HY: number; // Home Yellow Cards
  AY: number; // Away Yellow Cards
  HR: number; // Home Red Cards
  AR: number; // Away Red Cards
}

export interface TeamStats {
  teamName: string;
  matchesPlayed: number;
  wins: number;
  draws: number;
  losses: number;
  points: number; // Adicionado Pontos
  goalsFor: number;
  goalsAgainst: number;
  avgShots: number;
  avgShotsOnTarget: number;
  avgCorners: number;
  avgFouls: number;
  avgYellowCards: number;
  avgRedCards: number;
  cleanSheets: number;
}
