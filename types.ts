
export type RegionCode =
  | 'AN' | 'AR' | 'AS' | 'IB' | 'CN' | 'CB' | 'CM' | 'CL' | 'CT' | 'VC'
  | 'EX' | 'GA' | 'MD' | 'MC' | 'NC' | 'PV' | 'RI' | 'CE' | 'ML';

export interface RegionalVotes {
  [key: string]: {
    support: number;
    oppose: number;
    neutral: number;
  };
}

export interface Comment {
  id: string;
  topicId: string;
  userId: string;
  userName: string;
  avatar: string; // URL to avatar image
  content: string;
  region: RegionCode;
  createdAt: string;
  isFake?: boolean;
  replies?: Comment[];
  parentId?: string; // Reference to parent
  upvotes?: number;
  downvotes?: number;
  userVote?: 'up' | 'down' | null; // What the current user voted
  isOwn?: boolean; // Helper to know if current user can delete
}

export interface Topic {
  id: string;
  title: string;
  category: string;
  description: string;
  createdAt: number;
  votes: {
    support: number;
    oppose: number;
    neutral: number;
  };
  regionalVotes: RegionalVotes;
  pros: string[];
  cons: string[];
  aiAnalysis?: string;
  hasVoted?: boolean;
  labelSupport?: string;
  labelOppose?: string;
}

export interface VoteRecord {
  topicId: string;
  choice: 'support' | 'oppose' | 'neutral';
  region: RegionCode;
  timestamp: number;
}

export interface AIInsightResponse {
  summary: string;
  pros: string[];
  cons: string[];
}

export type OccupationType =
  | 'Estudiante'
  | 'Desempleado'
  | 'Trabajador Manual / Obrero'
  | 'Trabajador Servicios / Administrativo'
  | 'Profesional Técnico / Autónomo'
  | 'Directivo / Empresario'
  | 'Jubilado'
  | 'Otras';

export type GenderType = 'Masculino' | 'Femenino' | 'Otro' | 'Prefiero no decir';
