
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

// Base properties common to all topics
interface BaseTopic {
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
  regionalVotes: Record<string, { support: number; oppose: number; neutral: number }>; // Typed as string key to allow partial
  pros: string[];
  cons: string[];
  aiAnalysis: string;
  hasVoted?: boolean;
}

// 1. Binary Topic (Yes/No/Neutral)
export interface BinaryTopic extends BaseTopic {
  type: 'binary';
  labelSupport?: string;
  labelOppose?: string;
  userVoteOption?: 'support' | 'oppose' | 'neutral' | null;

  // Explicitly disallow multi-option fields to strictly separate types
  options?: never;
  optionCounts?: never;
  regionalOptionCounts?: never;
}

// 2. Multiple Choice Topic (Parties, Options, etc.)
export interface MultipleChoiceTopic extends BaseTopic {
  type: 'multiple_choice';
  options: string[];
  optionCounts: Record<string, number>;
  regionalOptionCounts: Record<string, Record<string, number>>; // Region -> Option -> Count
  userVoteOption?: string | null;

  labelSupport?: never;
  labelOppose?: never;
}

// Discriminated Union
export type Topic = BinaryTopic | MultipleChoiceTopic;

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
