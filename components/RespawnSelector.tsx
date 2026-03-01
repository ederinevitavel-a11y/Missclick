import React, { useState, useMemo } from 'react';
import { Search, Map, ChevronRight, X, ShieldCheck } from 'lucide-react';
import { Respawn } from '../types';

interface RespawnSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  respawns: Respawn[]; // Should receive only FREE respawns
  onSelect: (respawnId: string) => void;
}

const RespawnSelector: React.FC<RespawnSelectorProps> = ({ isOpen, onClose, respawns, onSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = useMemo(() => {
    const cats = new Set(respawns.map(r => r.category));
    return ['ALL', ...Array.from(cats).sort()];
  }, [respawns]);

  const filteredList = respawns.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || r.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050b14]/95 backdrop-blur-md p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#0f172a] border-0 sm:border border-cyan-500/30 rounded-none sm:rounded-lg shadow-2xl w-full max-w-4xl h-full sm:h-[80vh] flex flex-col relative overflow-hidden">
        
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-900/60 backdrop-blur-sm flex justify-between items-center shrink-0">
            <div>
              <h2 className="text-lg sm:text-2xl font-bold text-white digital-font tracking-wider flex items-center gap-2">
                <ShieldCheck className="text-emerald-400" size={20} />
                RESPAWS DISPONÍVEIS
              </h2>
              <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold mt-1">Selecione um local para caçar</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors">
              <X size={24} />
            </button>
          </div>

          {/* Filters */}
          <div className="p-3 sm:p-4 bg-[#0b1121]/40 backdrop-blur-sm border-b border-slate-800 flex flex-col md:flex-row gap-3 sm:gap-4 shrink-0">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-700" size={18} />
              <input 
                type="text" 
                placeholder="BUSCAR POR NOME..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#1e293b]/60 border border-slate-700 rounded-md py-2.5 sm:py-3 pl-10 pr-4 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none uppercase font-medium"
                autoFocus
              />
            </div>
            <div className="relative w-full md:w-64">
              <Map className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-700" size={18} />
              <select 
                className="w-full bg-[#1e293b]/60 border border-slate-700 rounded-md py-2.5 sm:py-3 pl-10 pr-8 text-xs sm:text-sm text-white appearance-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none cursor-pointer uppercase font-medium"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
          </div>

          {/* List */}
          <div className="flex-grow overflow-y-auto p-3 sm:p-4 space-y-2 custom-scrollbar bg-transparent">
            {filteredList.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3">
                {filteredList.map(respawn => (
                  <button 
                    key={respawn.id}
                    onClick={() => onSelect(respawn.id)}
                    className="flex items-center justify-between p-3 sm:p-4 rounded bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 hover:bg-cyan-950/40 hover:border-cyan-500/50 transition-all group text-left"
                  >
                    <div>
                      <div className="font-bold text-slate-200 group-hover:text-cyan-300 transition-colors flex items-center gap-2 text-sm sm:text-base">
                        {respawn.name}
                        <span className="text-[8px] sm:text-[9px] bg-slate-900 text-cyan-500 px-1.5 rounded border border-cyan-900/50 font-mono">
                          T{respawn.tier}
                        </span>
                      </div>
                      <div className="text-[8px] sm:text-[10px] text-slate-500 uppercase tracking-widest mt-1 font-bold">
                        {respawn.category} {respawn.isSpecial && <span className="text-purple-400 ml-1 sm:ml-2">• Regra Especial</span>}
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-600 py-12">
                <Search size={48} className="opacity-20 mb-4" />
                <p className="uppercase tracking-widest font-bold text-xs sm:text-sm">Nenhum respawn encontrado</p>
              </div>
            )}
          </div>

          {/* Footer Stats */}
          <div className="p-3 bg-slate-900/60 backdrop-blur-sm border-t border-slate-800 flex justify-between items-center text-[8px] sm:text-[10px] text-slate-500 uppercase font-bold tracking-widest shrink-0">
            <span>Mostrando {filteredList.length} resultados</span>
            <span className="text-emerald-500">Sistema Pronto</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RespawnSelector;