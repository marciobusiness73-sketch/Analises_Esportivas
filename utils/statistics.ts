import { MatchData, TeamStats, FullTimeResult } from '../types';

export const getUniqueTeams = (matches: MatchData[]): string[] => {
  const teams = new Set<string>();
  matches.forEach(m => {
    teams.add(m.HomeTeam);
    teams.add(m.AwayTeam);
  });
  return Array.from(teams).sort();
};

export const calculateTeamStats = (
  teamName: string, 
  matches: MatchData[], 
  context: 'HOME' | 'AWAY' | 'ALL' = 'ALL'
): TeamStats => {
  
  // Filter matches based on the context (Home Only, Away Only, or All)
  const teamMatches = matches.filter(m => {
    if (context === 'HOME') return m.HomeTeam === teamName;
    if (context === 'AWAY') return m.AwayTeam === teamName;
    return m.HomeTeam === teamName || m.AwayTeam === teamName;
  });
  
  const stats: TeamStats = {
    teamName,
    matchesPlayed: teamMatches.length,
    wins: 0,
    draws: 0,
    losses: 0,
    points: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    avgShots: 0,
    avgShotsOnTarget: 0,
    avgCorners: 0,
    avgFouls: 0,
    avgYellowCards: 0,
    avgRedCards: 0,
    cleanSheets: 0
  };

  if (stats.matchesPlayed === 0) return stats;

  let totalShots = 0;
  let totalShotsOnTarget = 0;
  let totalCorners = 0;
  let totalFouls = 0;
  let totalYellow = 0;
  let totalRed = 0;

  teamMatches.forEach(m => {
    // Determine if the team is playing home or away in this specific match
    // If context is 'HOME', isHome is always true. If 'AWAY', always false.
    const isHome = m.HomeTeam === teamName;
    
    // Goals
    const gf = isHome ? m.FTHG : m.FTAG;
    const ga = isHome ? m.FTAG : m.FTHG;
    stats.goalsFor += gf;
    stats.goalsAgainst += ga;

    // Result
    if (m.FTR === FullTimeResult.D) {
      stats.draws++;
    } else if ((isHome && m.FTR === FullTimeResult.H) || (!isHome && m.FTR === FullTimeResult.A)) {
      stats.wins++;
    } else {
      stats.losses++;
    }

    // Clean Sheets
    if (ga === 0) stats.cleanSheets++;

    // Metrics
    totalShots += isHome ? m.HS : m.AS;
    totalShotsOnTarget += isHome ? m.HST : m.AST;
    totalCorners += isHome ? m.HC : m.AC;
    totalFouls += isHome ? m.HF : m.AF;
    totalYellow += isHome ? m.HY : m.AY;
    totalRed += isHome ? m.HR : m.AR;
  });

  // Calculate Points (3 for win, 1 for draw)
  stats.points = (stats.wins * 3) + stats.draws;

  // Averages
  stats.avgShots = parseFloat((totalShots / stats.matchesPlayed).toFixed(2));
  stats.avgShotsOnTarget = parseFloat((totalShotsOnTarget / stats.matchesPlayed).toFixed(2));
  stats.avgCorners = parseFloat((totalCorners / stats.matchesPlayed).toFixed(2));
  stats.avgFouls = parseFloat((totalFouls / stats.matchesPlayed).toFixed(2));
  stats.avgYellowCards = parseFloat((totalYellow / stats.matchesPlayed).toFixed(2));
  stats.avgRedCards = parseFloat((totalRed / stats.matchesPlayed).toFixed(2));

  return stats;
};
