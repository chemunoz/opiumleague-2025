export interface PlayerImages {
  shield: string;
  profile: string;
  badge: string;
  team_strip_front: string;
  team_strip_back: string;
  stadium: string;
}

export interface PlayerTrophies {
  liga_marca: string[];
  liga_futmondo: string[];
  champions: string[];
  europa_league: string[];
  fo_cup: string[];
  supercopa_europa: string[];
  supercopa_espana: string[];
}

export interface PlayerAwards {
  round_top: string[];
  rounds_regularity: string[];
}

export interface PlayerBadges {
  avg: number;
  ult: number;
  tit: number;
  alt: number;
  par: number;
  jor: number;
  baj: number;
}

export interface Player {
  id: number;
  name: string;
  team: string;
  stadium: string;
  images: PlayerImages;
  points: (number | null)[];
  seasons: string[];
  trophies: PlayerTrophies;
  awards: PlayerAwards;
  nationality: string;
  badges: PlayerBadges;

  score_general?: number;
  score_jornada?: number[];
  positions_jornada?: number[];
  positions_general?: number[];
  score_average_jornada?: number[];
  score_best?: number;
  score_worst?: number;
  score_average?: number;
  num_jornadas?: number;
  top_jornada?: number;
  top_clasificacion?: number;
  positions_general_differences?: number[];
  positions_general_differences_max?: number;
  positions_general_differences_min?: number;
  positions_general_max?: number;
  positions_general_min?: number;
  trophies_total?: number;
  awards_total?: number;
}

export interface TeamStanding {
  id: number;
  team: string;
  shield: string;
  name: string;
  image: string;
  score_jornada: number;
  score_general: number;
  position_jornada: number;
  position_general: number;
  updown?: string;
  updown_num?: number;
  pj?: number;
  pg?: number;
  pe?: number;
  pp?: number;
  pf?: number;
  pc?: number;
  dif?: number;
  max?: number;
  score_best?: number;
  score_worst?: number;
  score_average?: number;
  num_jornadas?: number;
  positions_jornada?: number[];
}

export interface Jornada {
  name: string;
  table?: TeamStanding[];
  rounds?: Match[];
  score_best?: {
    name: string;
    team: string;
    image: string;
    shield: string;
    score: number;
  };
  score_worst?: {
    name: string;
    team: string;
    image: string;
    shield: string;
    score: number;
  };
  score_average?: number;
}

export interface Match {
  match1: TeamMatch[];
  match2: TeamMatch[];
}

export interface TeamMatch {
  id: number;
  score: number | null;
}

export interface ChampionsGroup {
  name: string;
  teams: number[];
}

export interface ChampionsRound {
  round: number;
  name?: string;
}

export interface ChampionsCountdown {
  name: string;
  deadline: string;
  element: string;
  distance?: number;
}

export interface ChampionsData {
  groups: ChampionsGroup[];
  rounds: ChampionsRound[];
  countdowns: ChampionsCountdown[];
}
