import React, { useState, useEffect } from 'react';
import { X, Clock, User, CheckCircle } from 'lucide-react';
import { NewClaimData, Respawn } from '../types';

interface ClaimModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: NewClaimData) => void;
  respawn: Respawn | null;
  mode: 'CLAIM' | 'NEXT';
  initialPlayerName: string;
}

const ClaimModal: React.FC<ClaimModalProps> = ({ isOpen, onClose, onSubmit, respawn, mode, initialPlayerName }) => {
  const [playerName, setPlayerName] = useState(initialPlayerName);
  const [duration, setDuration] = useState(60); // Default 1 hour
  const [error, setError] = useState('');

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setPlayerName(initialPlayerName);
      setDuration(60);
      setError('');
    }
  }, [isOpen, initialPlayerName]);

  if (!isOpen || !respawn) return null;

  // Constraints defined by user
  const MIN_MINUTES = 30;
  // Special: 3h 15m (195m)
  // Others: 2h 20m (140m)
  const MAX_MINUTES = respawn.isSpecial ? 195 : 140; 
  const MAX_DISPLAY = respawn.isSpecial ? "3h 15m" : "2h 20m";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim()) {
      setError('Nome do personagem é obrigatório.');
      return;
    }
    if (duration < MIN_MINUTES || duration > MAX_MINUTES) {
      setError(`A duração deve ser entre 30 min e ${MAX_DISPLAY}.`);
      return;
    }
    onSubmit({ playerName, durationMinutes: duration });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050b14]/80 backdrop-blur-sm p-4">
      <div className="bg-[#0f172a] border border-cyan-500/30 rounded shadow-[0_0_40px_-10px_rgba(8,145,178,0.3)] w-full max-w-md animate-in fade-in zoom-in duration-200 relative overflow-hidden">
        
        {/* Top Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-600 to-blue-600"></div>

        <div className="flex justify-between items-center p-5 border-b border-slate-800 bg-slate-900/50">
          <div>
             <h3 className="text-xl font-bold text-white digital-font tracking-wider">
                {mode === 'CLAIM' ? 'AGENDAR HORÁRIO' : 'ENTRAR NA FILA'}
             </h3>
             <p className="text-[10px] text-cyan-500 uppercase tracking-widest font-bold">Protocolo: {mode === 'CLAIM' ? 'AGENDAMENTO' : 'NEXT'}</p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-cyan-400 transition-colors bg-slate-800/50 p-1.5 rounded-full hover:bg-slate-800">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-1 pb-2 border-b border-slate-800 border-dashed">
            <h4 className="text-lg font-bold text-cyan-100">{respawn.name}</h4>
            <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">{respawn.category}</span>
                {respawn.isSpecial && <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider border border-purple-900/50 px-1 rounded bg-purple-900/10">Special Limit: 3h 15m</span>}
            </div>
          </div>

          <div className="space-y-5">
            {/* Player Name - Read Only */}
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wide flex items-center gap-2">
                <User size={14} className="text-cyan-500" /> Nome do Personagem
              </label>
              <div className="w-full bg-[#0b1121]/50 border border-slate-800 rounded px-4 py-2.5 text-cyan-400 font-bold flex items-center justify-between">
                <span>{playerName}</span>
                <span className="text-[9px] text-slate-600 border border-slate-800 px-1 rounded uppercase">Auto-preenchido</span>
              </div>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wide flex items-center gap-2">
                <Clock size={14} className="text-cyan-500" /> Tempo de Hunt
              </label>
              <div className="flex items-center gap-4 bg-[#0b1121] p-3 rounded border border-slate-700">
                <input
                  type="range"
                  min={MIN_MINUTES}
                  max={MAX_MINUTES}
                  step={5}
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="flex-grow h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
                <div className="flex items-center bg-slate-800 rounded px-2 py-1 border border-slate-700 w-24 justify-center">
                    <span className="text-cyan-300 font-mono text-lg font-bold">{duration}</span>
                    <span className="text-xs text-slate-500 ml-1">min</span>
                </div>
              </div>
              <div className="flex justify-between mt-2 text-[10px] text-slate-500 font-mono">
                <span>MIN: 30m</span>
                <span className="text-cyan-600">MAX: {Math.floor(MAX_MINUTES/60)}h {MAX_MINUTES%60}m</span>
              </div>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-rose-950/30 border-l-2 border-rose-500 text-rose-200 text-xs font-medium">
              ! {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500 rounded text-sm font-bold uppercase tracking-wide transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-[2] bg-gradient-to-r from-cyan-700 to-blue-600 hover:from-cyan-600 hover:to-blue-500 text-white text-sm font-bold uppercase tracking-wide py-2.5 rounded shadow-lg shadow-cyan-900/20 transition-all flex justify-center items-center gap-2"
            >
              <CheckCircle size={16} /> Confirmar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClaimModal;
