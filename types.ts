
export type RespawnCategory = 
  | "Ab'Dendriel" | "Ankrahmun" | "Carlin" | "Darashia" | "Edron" 
  | "Farmine" | "Feyrist" | "Gnomprona" | "Gray Island" | "Issavi" 
  | "Marapur" | "Oramond" | "Port Hope" | "Roshamuul" | "Rotten Blood" 
  | "Venore" | "Warzone" | "Yalahar" | "Criatura Boostada";

export interface Claim {
  id: string;
  userId: string; // ID of the user who created the claim (Essential for RLS UI checks)
  playerName: string;
  phone?: string; // WhatsApp number
  startTime: number; // timestamp
  durationMinutes: number;
  endTime: number; // timestamp
  isNext: boolean;
  releasedEarly?: boolean; // New flag: True if user canceled but queue exists
}

export interface Respawn {
  id: string;
  name: string;
  category: RespawnCategory;
  tier: number;
  isSpecial: boolean; // True for 3h 15m max, False for 2h 20m
  currentClaim: Claim | null;
  nextQueue: Claim[];
}

export interface NewClaimData {
  playerName: string;
  phone?: string;
  durationMinutes: number;
}

export interface GuildMember {
  name: string;
  title: string;
  rank: string;
  vocation: string;
  level: number;
  joined: string;
  status: 'online' | 'offline';
}

export interface BlockedUser {
  id: string;
  playerName: string;
  reason: string;
  blockedBy: string;
  createdAt: string;
}

export interface FixedRespawn {
  id: string;
  respawnName: string;
  playerName: string;
  dayOfWeek: string; // e.g., "Segunda", "Terça", or "Diário"
  startTime: string; // e.g., "14:00"
  endTime: string;   // e.g., "16:00"
  createdAt?: string;
}

export interface Warning {
  id: string;
  playerName: string;
  reason: string;
  date: string;
  createdAt?: string;
}
