import React from 'react';
import { Calendar, Clock, User, MapPin } from 'lucide-react';
import { FixedRespawn } from '../types';

interface FixedRespawnsTabProps {
  fixedRespawns: FixedRespawn[];
}

const FixedRespawnsTab: React.FC<FixedRespawnsTabProps> = ({ fixedRespawns }) => {
  // Group by respawn name
  const groupedByRespawn = fixedRespawns.reduce((acc, item) => {
    if (!acc[item.respawnName]) {
      acc[item.respawnName] = [];
    }
    acc[item.respawnName].push(item);
    return acc;
  }, {} as Record<string, FixedRespawn[]>);

  // Sort respawns alphabetically
  const respawnNames = Object.keys(groupedByRespawn).sort();

  // Respawn images mapping
  const respawnImages: Record<string, string> = {
    'Podzilla Roothing': 'https://i.imgur.com/jG1Ict5.gif',
    'Crystal Enigma': 'https://i.imgur.com/a8wEC1f.gif',
    'Monster Graveyard': 'https://i.imgur.com/Jqmb6j6.gif',
    'Monster Graveyard Dir': 'https://i.imgur.com/Jqmb6j6.gif',
    'Monster Graveyard Esq': 'https://i.imgur.com/Jqmb6j6.gif',
    'Sparkling Pools': 'https://i.imgur.com/4rQcJXN.gif',
    'Rotten Wasteland': 'https://i.imgur.com/VbMQoIR.gif',
    'Darklight Core': 'https://i.imgur.com/S1TeBqR.gif',
    'Unhallowed Crypt': 'https://i.imgur.com/I9jjyrp.gif',
    'Livraria de Fire': 'https://i.imgur.com/ON56Wje.gif',
    // Fallback for variations
    'Podzilla Roothing -2': 'https://i.imgur.com/jG1Ict5.gif',
    'Fire Library': 'https://i.imgur.com/ON56Wje.gif'
  };

  // Helper to get day abbreviation or full name
  const getDayLabel = (day: string) => {
    if (day === 'Diário') return '';
    return `(${day})`;
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500">
      <div className="text-center mb-6 sm:mb-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-wider digital-font mb-2">RESPAWNS FIXOS</h2>
        <p className="text-cyan-400 text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] font-bold opacity-70">Horários Reservados da Guilda</p>
      </div>

      {fixedRespawns.length === 0 ? (
        <div className="bg-[#0f172a]/50 border border-slate-800 rounded-2xl p-8 sm:p-12 text-center">
          <Calendar size={40} className="mx-auto text-slate-700 mb-4 opacity-20" />
          <p className="text-slate-500 uppercase tracking-widest font-bold text-xs sm:text-sm">Nenhum horário fixo registrado ainda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {respawnNames.map(name => (
            <div key={name} className="bg-[#0f172a]/40 border border-slate-800/50 rounded-2xl p-4 sm:p-5 hover:border-cyan-500/20 transition-all group">
              <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-5 border-b border-slate-800/50 pb-3 sm:pb-4">
                {respawnImages[name] ? (
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden border border-slate-800 shadow-lg group-hover:border-cyan-500/30 transition-colors flex-shrink-0">
                    <img 
                      src={respawnImages[name]} 
                      alt={name} 
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ) : (
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-cyan-950/30 flex items-center justify-center text-cyan-500 border border-cyan-900/30 group-hover:scale-110 transition-transform flex-shrink-0">
                    <MapPin size={20} />
                  </div>
                )}
                <div className="overflow-hidden">
                  <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-none mb-1 truncate">{name}</h3>
                  <p className="text-[9px] sm:text-[10px] text-slate-500 uppercase font-bold tracking-widest">Escala de Horários</p>
                </div>
              </div>
              
              <div className="space-y-1.5 sm:space-y-2">
                {groupedByRespawn[name]
                  .sort((a, b) => a.startTime.localeCompare(b.startTime))
                  .map((item) => (
                    <div key={item.id} className="flex items-center justify-between py-1.5 border-b border-slate-800/20 last:border-0 group/item">
                      <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
                        <div className="font-mono text-[10px] sm:text-xs text-cyan-400 bg-cyan-950/20 px-1.5 sm:px-2 py-1 rounded border border-cyan-900/30 min-w-[85px] sm:min-w-[100px] text-center flex-shrink-0">
                          {item.startTime} - {item.endTime}
                        </div>
                        <div className="flex flex-col overflow-hidden">
                          <span className="text-xs sm:text-sm font-bold text-slate-200 group-hover/item:text-white transition-colors truncate">
                            {item.playerName}
                          </span>
                          {item.dayOfWeek !== 'Diário' && (
                            <span className="text-[8px] sm:text-[10px] text-slate-500 font-medium italic truncate">
                              {item.dayOfWeek}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="opacity-0 group-hover/item:opacity-100 transition-opacity flex-shrink-0">
                        <User size={12} className="text-slate-600" />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-amber-950/20 border border-amber-900/30 rounded-xl p-4 flex items-start gap-4">
        <div className="p-2 bg-amber-900/30 rounded-lg text-amber-500 mt-1">
          <Clock size={20} />
        </div>
        <div>
          <h5 className="text-amber-200 font-bold text-sm uppercase tracking-wide">Regra de Horários Fixos</h5>
          <p className="text-amber-500/80 text-xs mt-1 leading-relaxed">
            Os horários fixos têm prioridade sobre o sistema de Claims. Se você estiver em um respawn e o dono do horário fixo chegar, você deve ceder o lugar imediatamente. Apenas administradores podem conceder ou alterar horários fixos.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FixedRespawnsTab;
