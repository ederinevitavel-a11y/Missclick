import React, { useState, useEffect } from 'react';
import { Shield, Clock, Trash2, ArrowRight, Plus, Activity, PlayCircle, Phone } from 'lucide-react';
import { Respawn } from '../types';
import { formatTimeRemaining, formatEndTime } from '../utils/time';

interface RespawnCardProps {
  respawn: Respawn;
  currentUserId: string | null;
  onClaim: (respawnId: string) => void;
  onNext: (respawnId: string) => void;
  onCancel: (respawnId: string, claimId: string, isNext: boolean) => void;
  onAnticipate?: (respawnId: string) => void;
}

const RespawnCard: React.FC<RespawnCardProps> = ({ respawn, currentUserId, onClaim, onNext, onCancel, onAnticipate }) => {
  const [timeLeft, setTimeLeft] = useState<string>('');

  // Update timer every minute
  useEffect(() => {
    const updateTimer = () => {
      if (respawn.currentClaim) {
        setTimeLeft(formatTimeRemaining(respawn.currentClaim.endTime));
      } else {
        setTimeLeft('');
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [respawn.currentClaim]);

  const isOccupied = !!respawn.currentClaim;
  const isReleased = respawn.currentClaim?.releasedEarly || false;
  
  // Dynamic styles based on state
  let containerBorder = 'border-cyan-900/30 hover:border-cyan-500/50';
  let containerBg = 'bg-gradient-to-b from-[#0f172a] to-[#0f172a]';
  let statusColor = 'text-emerald-400';
  let headerBg = 'bg-cyan-950/10';
  let statusText = "LIVRE";

  if (isOccupied) {
    if (isReleased) {
        // YELLOW / AMBER STATE
        containerBorder = 'border-amber-600/50 hover:border-amber-500/60';
        containerBg = 'bg-gradient-to-b from-[#1a1505] to-[#0f172a]';
        statusColor = 'text-amber-400';
        headerBg = 'bg-amber-950/20';
        statusText = "ABERTO PARA NEXT";
    } else {
        // RED STATE
        containerBorder = 'border-rose-900/50 hover:border-rose-700/50';
        containerBg = 'bg-gradient-to-b from-[#1a1115] to-[#0f172a]';
        statusColor = 'text-rose-500';
        headerBg = 'bg-rose-950/20';
        statusText = "OCUPADO";
    }
  }

  return (
    <div className={`relative border rounded bg-slate-900 overflow-hidden transition-all duration-300 group ${containerBorder} ${containerBg}`}>
      
      {/* Decorative corner accent */}
      {!isOccupied && <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-cyan-500/10 to-transparent -mr-8 -mt-8 rounded-full blur-xl group-hover:from-cyan-400/20 transition-all"></div>}
      
      {/* Header */}
      <div className={`p-2.5 sm:p-3 border-b border-slate-800 flex justify-between items-start ${headerBg}`}>
        <div className="z-10 overflow-hidden">
          <h4 className="font-bold text-slate-100 flex items-center gap-2 digital-font tracking-wide text-base sm:text-lg truncate">
             {respawn.name}
             {respawn.tier > 1 && <span className="text-[8px] sm:text-[9px] bg-slate-800 text-cyan-300 px-1 sm:px-1.5 py-0.5 rounded border border-cyan-900 font-mono flex-shrink-0">T{respawn.tier}</span>}
          </h4>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[8px] sm:text-[10px] text-slate-500 font-bold uppercase tracking-widest truncate">{respawn.category}</span>
            {respawn.isSpecial && <span className="text-[8px] sm:text-[9px] text-purple-400 font-bold uppercase tracking-wider border border-purple-900/50 px-1 rounded bg-purple-900/10 flex-shrink-0">Special</span>}
          </div>
        </div>
        
        {respawn.name.includes("Podzilla Roothing -2") && (
          <div className="absolute top-1 right-1 rounded-lg overflow-hidden border border-slate-800 w-8 h-8 sm:w-10 sm:h-10 shadow-lg z-20">
            <img 
              src="https://i.imgur.com/jG1Ict5.gif" 
              alt="Podzilla Roothing -2" 
              className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
              referrerPolicy="no-referrer"
            />
          </div>
        )}

        <div className={`flex items-center gap-1 sm:gap-1.5 ${statusColor} bg-slate-950/50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded border border-slate-800 shadow-inner flex-shrink-0 ml-2`}>
          <Activity size={12} className={isOccupied ? "" : "animate-pulse"} />
          <span className="text-[8px] sm:text-[10px] font-bold uppercase tracking-wider">{statusText}</span>
        </div>
      </div>

      {/* Body */}
      <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
        {isOccupied && respawn.currentClaim ? (
          <div className={`rounded border-l-2 p-2.5 sm:p-3 shadow-lg relative overflow-hidden group/card ${isReleased ? 'bg-[#1a1205] border-amber-500' : 'bg-[#0b1121] border-rose-500'}`}>
            {/* Background pattern */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none"></div>
            
            <div className="relative z-10 pl-1">
                {/* Header Row: Name & Trash Button via Flexbox (Safe Layout) */}
                <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2 overflow-hidden">
                        <span className={`font-bold truncate text-xs sm:text-sm tracking-wide ${isReleased ? 'text-amber-100 line-through opacity-70' : 'text-rose-100'}`}>
                            {respawn.currentClaim.playerName}
                        </span>
                        {respawn.currentClaim.phone && (
                            <a 
                                href={`https://wa.me/${respawn.currentClaim.phone.replace(/\D/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-emerald-500 hover:text-emerald-400 transition-colors"
                                title={`WhatsApp: ${respawn.currentClaim.phone}`}
                            >
                                <Phone size={12} />
                            </a>
                        )}
                    </div>
                    
                    {!isReleased && respawn.currentClaim.userId === currentUserId && (
                        <button 
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onCancel(respawn.id, respawn.currentClaim!.id, false);
                            }}
                            className="text-slate-400 hover:text-rose-500 hover:bg-rose-950/80 bg-slate-900/50 transition-all p-1.5 rounded cursor-pointer z-50 border border-transparent hover:border-rose-500/50 -mt-1 -mr-1"
                            title="Desmarcar / Sair da Hunt"
                        >
                            <Trash2 size={14} />
                        </button>
                    )}
                </div>

                {isReleased && (
                    <div className="text-[9px] sm:text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-2 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                        Vaga Disponível
                    </div>
                )}

                <div className="flex justify-between items-end text-[10px] sm:text-xs mt-2 sm:mt-3">
                    <div className="flex flex-col">
                        <span className="text-slate-500 text-[8px] sm:text-[10px] uppercase font-bold">Restante</span>
                        <span className={`font-mono text-base sm:text-lg leading-none ${isReleased ? 'text-amber-400' : 'text-rose-400'}`}>{timeLeft}</span>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-slate-500 text-[8px] sm:text-[10px] uppercase font-bold">Término</span>
                        <span className="text-slate-300 font-mono">{formatEndTime(respawn.currentClaim.endTime)}</span>
                    </div>
                </div>
            </div>
          </div>
        ) : (
          <div className="h-16 sm:h-20 flex flex-col items-center justify-center text-slate-700 border border-dashed border-slate-800 rounded bg-slate-900/30">
            <span className="text-xs sm:text-sm font-medium">Sistema Pronto</span>
            <span className="text-[8px] sm:text-[10px] uppercase tracking-widest opacity-60">Aguardando ação</span>
          </div>
        )}

        {/* Next Queue */}
        {respawn.nextQueue.length > 0 && (
          <div className="space-y-2 mt-3 pt-3 border-t border-slate-800/50">
            <div className="flex items-center gap-2 text-[10px] text-cyan-600 font-bold uppercase tracking-widest">
              <ArrowRight size={10} /> Fila de Espera ({respawn.nextQueue.length})
            </div>
            <div className="space-y-1.5">
                {respawn.nextQueue.map((next, index) => (
                <div key={next.id} className="bg-slate-800/40 rounded px-2 py-1.5 text-xs border border-slate-700/50 flex justify-between items-center group/item hover:border-slate-600 transition-colors">
                    <div className="flex items-center gap-2 overflow-hidden">
                        <span className="text-cyan-700 font-mono text-[10px]">{String(index + 1).padStart(2, '0')}</span>
                        <span className="text-slate-300 truncate max-w-[100px] font-medium">{next.playerName}</span>
                        {next.phone && (
                            <a 
                                href={`https://wa.me/${next.phone.replace(/\D/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-emerald-500 hover:text-emerald-400 transition-colors"
                                title={`WhatsApp: ${next.phone}`}
                            >
                                <Phone size={10} />
                            </a>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-slate-500 font-mono text-[10px] bg-slate-900 px-1 rounded">{Math.floor(next.durationMinutes / 60)}h{next.durationMinutes % 60 > 0 ? `${next.durationMinutes % 60}m` : ''}</span>
                        
                        {next.userId === currentUserId && (
                          <button 
                              type="button"
                              onClick={(e) => {
                                  e.stopPropagation();
                                  onCancel(respawn.id, next.id, true);
                              }}
                              className="text-slate-600 hover:text-rose-400 p-1 cursor-pointer"
                          >
                              <XIcon size={12} />
                          </button>
                        )}
                    </div>
                </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="p-2 bg-slate-950/30 border-t border-slate-800/50">
        {!isOccupied ? (
          <button 
            type="button"
            onClick={() => onClaim(respawn.id)}
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold uppercase tracking-wider py-2 rounded shadow-[0_0_10px_rgba(8,145,178,0.2)] hover:shadow-[0_0_15px_rgba(34,211,238,0.4)] transition-all flex justify-center items-center gap-2 group/btn"
          >
            <Shield size={14} className="group-hover/btn:scale-110 transition-transform" /> Marcar Respawn
          </button>
        ) : (
          <>
            {/* If released early and queue exists, show Anticipate Button */}
            {isReleased && respawn.nextQueue.length > 0 && onAnticipate ? (
                 <button 
                 type="button"
                 onClick={() => onAnticipate(respawn.id)}
                 className="w-full bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold uppercase tracking-wider py-2 rounded shadow-[0_0_10px_rgba(245,158,11,0.2)] animate-pulse hover:animate-none transition-all flex justify-center items-center gap-2"
               >
                 <PlayCircle size={14} /> Antecipar / Iniciar
               </button>
            ) : (
                <button 
                type="button"
                onClick={() => onNext(respawn.id)}
                className="w-full bg-slate-800 hover:bg-slate-700 text-cyan-400 hover:text-cyan-300 border border-slate-700 hover:border-cyan-500/30 text-xs font-bold uppercase tracking-wider py-2 rounded transition-all flex justify-center items-center gap-2"
              >
                <Plus size={14} /> Entrar de Next
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// Helper for the small X icon inside queue
const XIcon = ({ size }: { size: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 18 18"/></svg>
);

export default RespawnCard;