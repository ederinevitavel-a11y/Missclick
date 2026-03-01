import { Respawn } from '../types';

// Exact names provided by the user for the 3h 15m rule
const SPECIAL_RESPAWNS = [
  "Gloom Pillars",
  "Jaded Roots",
  "Putrefactory",
  "Darklight",
  "Crystal Enigma",
  "Monster Graveyard", // Covers "Monster Graveyard" and "Monster Graveyard Dir" via includes check
  "Podzilla Roothing -2",
  "Sparkling Polls", // Covers "Sparkling Polls" and "Sparkling Polls Alt"
];

const generateRespawn = (id: string, name: string, category: any, tier: number = 1): Respawn => {
  // Check if the name includes any of the special keywords
  const isSpecial = SPECIAL_RESPAWNS.some(special => name.includes(special));
  return {
    id,
    name,
    category,
    tier,
    isSpecial,
    currentClaim: null,
    nextQueue: []
  };
};

export const INITIAL_RESPAWNS: Respawn[] = [
  // Ab'Dendriel
  generateRespawn('AB1', 'Forgotten Crypt', "Ab'Dendriel"),
  generateRespawn('AB2', 'Forsaken Crypt', "Ab'Dendriel"),
  generateRespawn('AB3', 'Unhallowed Crypt', "Ab'Dendriel", 3),

  // Ankrahmun
  generateRespawn('A1', 'Cobra Castelo', 'Ankrahmun'),
  generateRespawn('A2', 'Cobra Subsolo', 'Ankrahmun'),

  // Carlin
  generateRespawn('C1', 'Livraria de Fire', 'Carlin', 3),
  generateRespawn('C2', 'Livraria de Gelo', 'Carlin', 3),
  generateRespawn('C3', 'Livraria de Energy', 'Carlin', 3),

  // Criatura Boostada
  generateRespawn('X2', 'Boosted Creature', 'Criatura Boostada'),

  // Darashia
  generateRespawn('D1', 'Plague Full', 'Darashia'),
  generateRespawn('D2', 'Plague -1', 'Darashia'),
  generateRespawn('D3', 'Plague -2', 'Darashia'),
  generateRespawn('D4', 'Jugger Full', 'Darashia'),
  generateRespawn('D7', 'DT -1', 'Darashia'),
  generateRespawn('D8', 'DT -2', 'Darashia'),
  generateRespawn('D9', 'Pumin -1,-2', 'Darashia'),
  generateRespawn('D11', 'Pumin Andar do Boss', 'Darashia'),
  generateRespawn('D12', 'Infinito', 'Darashia'),
  generateRespawn('D13', 'Undead Seal', 'Darashia'),
  generateRespawn('D14', 'HFF Seal', 'Darashia'),
  generateRespawn('D15', 'Caminho Ferumbras', 'Darashia'),
  generateRespawn('D16', 'Esqueleto Darashia', 'Darashia'),
  generateRespawn('D17', 'Isles', 'Darashia'),
  generateRespawn('D18', 'Lion Sanctum -1', 'Darashia'),
  generateRespawn('D19', 'Lion Sanctum -2', 'Darashia'),
  generateRespawn('D20', 'Burster Spectre-Azul', 'Darashia'),
  generateRespawn('D21', 'Bazir Seal', 'Darashia'),

  // Edron
  generateRespawn('E1', 'DT - Inquisition', 'Edron'),
  generateRespawn('E2', 'Carnisylvans', 'Edron'),
  generateRespawn('E3', 'Azzilon Castle', 'Edron'),
  generateRespawn('E4', 'Azzilon -1', 'Edron'),
  generateRespawn('E5', 'Azzilon -2,-3', 'Edron'),
  generateRespawn('E6', 'Azzilon -4', 'Edron'),

  // Farmine
  generateRespawn('F1', 'Falcon Subsolo', 'Farmine'),
  generateRespawn('F2', 'Falcon Castle', 'Farmine'),
  generateRespawn('F4', 'Gold Token', 'Farmine'),
  generateRespawn('F5', 'Nimmersatt Dragons', 'Farmine'),
  generateRespawn('F6', 'Nimmersatt Dragons +1', 'Farmine'),

  // Feyrist
  generateRespawn('F10', 'Elfo de Fogo', 'Feyrist'),
  generateRespawn('F11', 'Elfo de Gelo', 'Feyrist'),

  // Gnomprona (SPECIAL RULES APPLY HERE)
  generateRespawn('G1', 'Monster Graveyard Esq', 'Gnomprona', 3),
  generateRespawn('G6', 'Monster Graveyard Dir', 'Gnomprona', 3),
  generateRespawn('G2', 'Crystal Enigma', 'Gnomprona', 3),
  generateRespawn('G3', 'Crystal Enigma Alt', 'Gnomprona', 3),
  generateRespawn('G4', 'Sparkling Polls', 'Gnomprona', 3),
  generateRespawn('G5', 'Sparkling Polls Alt', 'Gnomprona', 3),

  // Gray Island
  generateRespawn('GI1', 'Deathling', 'Gray Island'),

  // Issavi
  generateRespawn('I1', 'Issavi Sewer', 'Issavi'),
  generateRespawn('I2', 'Labirinto', 'Issavi'),
  generateRespawn('I3', 'Goannas', 'Issavi', 3),
  generateRespawn('I4', 'Crypt Warden -2', 'Issavi'),
  generateRespawn('I5', 'Girtablilu', 'Issavi'),
  generateRespawn('I6', 'Bashmu', 'Issavi'),

  // Marapur
  generateRespawn('M1', 'Naga', 'Marapur'),

  // Oramond
  generateRespawn('O1', 'Rathleton Catacombs', 'Oramond'),
  generateRespawn('O4', 'Podzilla-Quaras', 'Oramond'),
  generateRespawn('O5', 'Podzilla Roothing -2', 'Oramond', 3),
  generateRespawn('O6', 'Podzilla-Rootthing -1', 'Oramond', 3),

  // Port Hope
  generateRespawn('P1', 'Asura Castle', 'Port Hope'),
  generateRespawn('P2', 'Asura Espelho', 'Port Hope'),
  generateRespawn('P3', 'True Asura -1', 'Port Hope'),
  generateRespawn('P4', 'True Asura -2', 'Port Hope'),
  generateRespawn('P5', 'Gazer Spectre-Vermelho', 'Port Hope'),
  generateRespawn('P6', 'Iksupan Waterways', 'Port Hope'),
  generateRespawn('P7', 'Lost Souls Netherworld', 'Port Hope'),

  // Roshamuul
  generateRespawn('R1', 'West', 'Roshamuul'),
  generateRespawn('R2', 'Bones', 'Roshamuul'),
  generateRespawn('R3', 'Shockhead', 'Roshamuul'),
  generateRespawn('R4', 'Prison -3', 'Roshamuul'),
  generateRespawn('R5', 'Ingol Surface', 'Roshamuul'),
  generateRespawn('R6', 'Deeper Ingol -1', 'Roshamuul'),
  generateRespawn('R7', 'Deeper Ingol -2', 'Roshamuul'),
  generateRespawn('R8', 'Deeper Ingol -3', 'Roshamuul'),
  generateRespawn('R9', 'Upper Roshamuul', 'Roshamuul'),
  generateRespawn('R10', 'Bloodfire Gorge', 'Roshamuul'),

  // Rotten Blood (SPECIAL RULES APPLY HERE)
  generateRespawn('B1', 'Jaded Roots', 'Rotten Blood'),
  generateRespawn('B2', 'Putrefactory', 'Rotten Blood'),
  generateRespawn('B3', 'Gloom Pillars', 'Rotten Blood'),
  generateRespawn('B4', 'Darklight Core', 'Rotten Blood'),

  // Venore
  generateRespawn('V1', 'Ripper Spectre -Verde', 'Venore'),
  generateRespawn('V3', 'Lost Soul Brain Ground', 'Venore'),
  generateRespawn('V5', 'Cathedral -3', 'Venore'),
  generateRespawn('V6', 'Bulltaur Lair', 'Venore'),

  // Warzone / Gnomegate
  generateRespawn('T1', 'Warzone 1', 'Warzone'),
  generateRespawn('T2', 'Warzone 2', 'Warzone'),
  generateRespawn('T3', 'Warzone 3', 'Warzone'),
  generateRespawn('T4', 'Warzone 4', 'Warzone'),
  generateRespawn('T5', 'Warzone 5', 'Warzone'),
  generateRespawn('T6', 'Warzone 6', 'Warzone'),
  generateRespawn('T7', 'Warzone 7', 'Warzone'),
  generateRespawn('T8', 'Warzone 8', 'Warzone'),
  generateRespawn('T9', 'Warzone 9', 'Warzone'),

  // Yalahar
  generateRespawn('Y1', 'Souls Fire Raid', 'Yalahar', 3),
  generateRespawn('Y2', 'Souls Fear', 'Yalahar', 3),
  generateRespawn('Y4', 'Souls Earth', 'Yalahar', 3),
  generateRespawn('Y5', 'Souls Energy', 'Yalahar', 3),
  generateRespawn('Y6', 'Souls Thais', 'Yalahar', 3),
  generateRespawn('Y7', 'Souls Earth Alt', 'Yalahar', 3),
  generateRespawn('Y8', 'Yalahar Cemetery', 'Yalahar'),
  generateRespawn('Y9', 'Norceratu Fortress', 'Yalahar'),
  generateRespawn('Y10', 'Norceratu Catacombs Esq', 'Yalahar'),
  generateRespawn('Y11', 'Norceratu Catacombs Dir', 'Yalahar'),
];
