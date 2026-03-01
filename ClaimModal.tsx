import React, { useState } from 'react';
import { Trash2, AlertTriangle, ShieldAlert, X, Users, RefreshCw, Search, List, Plus, Phone, Calendar, Clock, MapPin, Edit2, Check } from 'lucide-react';
import { GuildMember, Respawn, BlockedUser, FixedRespawn, Warning } from '../types';
import { formatEndTime, formatTimeRemaining } from '../utils/time';
import { supabase } from '../utils/supabaseClient';

interface AdminPanelProps {
  claims: any[]; // Raw claims from DB
  respawns: Respawn[];
  blockedUsers: BlockedUser[];
  fixedRespawns: FixedRespawn[];
  warnings: Warning[];
  onClose: () => void;
  onForceDelete: (claimId: string) => Promise<void>;
  onRefreshData: () => Promise<void>;
}

type Tab = 'CLAIMS' | 'MEMBERS' | 'RESPAWNS' | 'BLOCKS' | 'USERS' | 'FIXED' | 'WARNINGS';

const AdminPanel: React.FC<AdminPanelProps> = ({ claims, respawns, blockedUsers, fixedRespawns, warnings, onClose, onForceDelete, onRefreshData }) => {
  const [activeTab, setActiveTab] = useState<Tab>('CLAIMS');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [registeredUsers, setRegisteredUsers] = useState<any[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  
  // Fixed Respawns Management State
  const [newFixed, setNewFixed] = useState({ respawnName: '', playerName: '', dayOfWeek: 'Segunda', endDay: '', startTime: '14:00', endTime: '16:00' });
  const [isSavingFixed, setIsSavingFixed] = useState(false);
  const [deletingFixedId, setDeletingFixedId] = useState<string | null>(null);
  const [editingFixedId, setEditingFixedId] = useState<string | null>(null);
  const [editFixedData, setEditFixedData] = useState<any>(null);

  // Warning Management State
  const [newWarning, setNewWarning] = useState({ playerName: '', reason: '', date: '' });
  const [isSavingWarning, setIsSavingWarning] = useState(false);
  const [deletingWarningId, setDeletingWarningId] = useState<string | null>(null);
  
  // Guild Member State
  const [members, setMembers] = useState<GuildMember[]>([]);
  const [syncing, setSyncing] = useState(false);
  const [memberSearch, setMemberSearch] = useState('');
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);

  // Respawn Management State
  const [newRespawn, setNewRespawn] = useState({ id: '', name: '', category: 'Darashia', tier: 1, isSpecial: false });
  const [isSavingRespawn, setIsSavingRespawn] = useState(false);
  const [deletingRespawnId, setDeletingRespawnId] = useState<string | null>(null);

  // Block Management State
  const [blockName, setBlockName] = useState('');
  const [blockReason, setBlockReason] = useState('');
  const [isBlocking, setIsBlocking] = useState(false);

  // Maintenance State
  const [isCleaningUp, setIsCleaningUp] = useState(false);

  const handleDelete = async (id: string) => {
    console.log("Attempting to delete claim:", id);
    setDeletingId(id);
    try {
        await onForceDelete(id);
        console.log("Claim deleted successfully");
    } catch (err) {
        console.error("Error in handleDelete:", err);
    } finally {
        setDeletingId(null);
    }
  };

  const fetchRegisteredUsers = async () => {
    setIsLoadingUsers(true);
    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const response = await fetch('/api/admin/users', {
            headers: {
                'Authorization': `Bearer ${session.access_token}`
            }
        });
        if (!response.ok) throw new Error("Failed to fetch users");
        const data = await response.json();
        setRegisteredUsers(data);
    } catch (err: any) {
        console.error("Fetch users error:", err);
    } finally {
        setIsLoadingUsers(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('AVISO CRÍTICO: Isso excluirá permanentemente a conta do jogador. Ele precisará se cadastrar novamente. Continuar?')) return;
    
    setDeletingUserId(userId);
    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const response = await fetch(`/api/admin/users/${userId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${session.access_token}`
            }
        });
        if (!response.ok) throw new Error("Failed to delete user");
        
        await fetchRegisteredUsers();
        alert("Cadastro cancelado com sucesso!");
    } catch (err: any) {
        console.error("Delete user error:", err);
        alert("Erro ao excluir usuário: " + err.message);
    } finally {
        setDeletingUserId(null);
    }
  };

  const handleAddRespawn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRespawn.id || !newRespawn.name) return;
    
    setIsSavingRespawn(true);
    try {
        const { error } = await supabase.from('respawns').insert({
            id: newRespawn.id,
            name: newRespawn.name,
            category: newRespawn.category,
            tier: newRespawn.tier,
            is_special: newRespawn.isSpecial
        });
        if (error) throw error;
        setNewRespawn({ id: '', name: '', category: 'Darashia', tier: 1, isSpecial: false });
        await onRefreshData();
    } catch (err: any) {
        alert("Erro ao adicionar respawn: " + err.message);
    } finally {
        setIsSavingRespawn(false);
    }
  };

  const handleDeleteRespawn = async (id: string) => {
    console.log("Attempting to delete respawn:", id);
    setDeletingRespawnId(id);
    try {
        const { error } = await supabase.from('respawns').delete().eq('id', id);
        if (error) throw error;
        console.log("Respawn deleted successfully");
        await onRefreshData();
    } catch (err: any) {
        console.error("Delete respawn error:", err);
        alert("Erro ao excluir respawn: " + (err.message || "Erro desconhecido"));
    } finally {
        setDeletingRespawnId(null);
    }
  };

  const handleAddFixed = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFixed.respawnName || !newFixed.playerName) return;
    
    setIsSavingFixed(true);
    try {
        let dayLabel = newFixed.dayOfWeek;
        if (newFixed.endDay && newFixed.endDay !== 'Nenhum' && newFixed.endDay !== newFixed.dayOfWeek && newFixed.dayOfWeek !== 'Diário') {
            dayLabel = `${newFixed.dayOfWeek} a ${newFixed.endDay}`;
        }

        const { error } = await supabase.from('fixed_respawns').insert({
            respawn_name: newFixed.respawnName,
            player_name: newFixed.playerName,
            day_of_week: dayLabel,
            start_time: newFixed.startTime,
            end_time: newFixed.endTime
        });
        if (error) throw error;
        setNewFixed({ respawnName: '', playerName: '', dayOfWeek: 'Segunda', endDay: '', startTime: '14:00', endTime: '16:00' });
        await onRefreshData();
    } catch (err: any) {
        alert("Erro ao adicionar horário fixo: " + err.message);
    } finally {
        setIsSavingFixed(false);
    }
  };

  const handleDeleteFixed = async (id: string) => {
    setDeletingFixedId(id);
    try {
        const { error } = await supabase.from('fixed_respawns').delete().eq('id', id);
        if (error) throw error;
        await onRefreshData();
    } catch (err: any) {
        alert("Erro ao excluir horário fixo: " + err.message);
    } finally {
        setDeletingFixedId(null);
    }
  };

  const handleStartEditFixed = (fixed: FixedRespawn) => {
    setEditingFixedId(fixed.id);
    setEditFixedData({ ...fixed });
  };

  const handleUpdateFixed = async () => {
    if (!editFixedData) return;
    
    setIsSavingFixed(true);
    try {
        const { error } = await supabase
            .from('fixed_respawns')
            .update({
                respawn_name: editFixedData.respawnName,
                player_name: editFixedData.playerName,
                day_of_week: editFixedData.dayOfWeek,
                start_time: editFixedData.startTime,
                end_time: editFixedData.endTime
            })
            .eq('id', editingFixedId);
            
        if (error) throw error;
        setEditingFixedId(null);
        setEditFixedData(null);
        await onRefreshData();
    } catch (err: any) {
        alert("Erro ao atualizar horário fixo: " + err.message);
    } finally {
        setIsSavingFixed(false);
    }
  };

  const handleBlockUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blockName.trim()) return;

    setIsBlocking(true);
    try {
        const { error } = await supabase.from('blocked_users').insert({
            player_name: blockName.trim(),
            reason: blockReason,
            blocked_by: 'Admin'
        });
        if (error) throw error;
        setBlockName('');
        setBlockReason('');
        await onRefreshData();
    } catch (err: any) {
        alert("Erro ao bloquear usuário: " + err.message);
    } finally {
        setIsBlocking(false);
    }
  };

  const handleUnblockUser = async (id: string) => {
    try {
        const { error } = await supabase.from('blocked_users').delete().eq('id', id);
        if (error) throw error;
        await onRefreshData();
    } catch (err: any) {
        alert("Erro ao desbloquear usuário: " + err.message);
    }
  };

  const handleCleanupOldClaims = async () => {
    setIsCleaningUp(true);
    try {
        const now = new Date().toISOString();
        
        // Deleta todos os claims que já terminaram (histórico)
        const { error, count } = await supabase
            .from('claims')
            .delete()
            .lt('end_time', now);
            
        if (error) throw error;
        
        alert(`Limpeza concluída! ${count || 0} registros de histórico foram removidos.`);
        await onRefreshData();
    } catch (err: any) {
        console.error("Cleanup error:", err);
        alert("Erro ao realizar limpeza: " + err.message);
    } finally {
        setIsCleaningUp(false);
    }
  };

  const handleAddWarning = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWarning.playerName || !newWarning.reason) return;
    
    setIsSavingWarning(true);
    try {
        const { error } = await supabase.from('warnings').insert({
            player_name: newWarning.playerName,
            reason: newWarning.reason,
            date: newWarning.date || new Date().toLocaleDateString('pt-BR')
        });
        if (error) throw error;
        setNewWarning({ playerName: '', reason: '', date: '' });
        await onRefreshData();
    } catch (err: any) {
        alert("Erro ao adicionar warning: " + err.message);
    } finally {
        setIsSavingWarning(false);
    }
  };

  const handleDeleteWarning = async (id: string) => {
    if (!confirm('Excluir este aviso permanentemente?')) return;
    setDeletingWarningId(id);
    try {
        const { error } = await supabase.from('warnings').delete().eq('id', id);
        if (error) throw error;
        await onRefreshData();
    } catch (err: any) {
        alert("Erro ao excluir warning: " + err.message);
    } finally {
        setDeletingWarningId(null);
    }
  };

  // Sync Guild Data from TibiaData API
  const handleSyncGuild = async (guildName: string) => {
    setSyncing(true);
    try {
        const response = await fetch(`https://api.tibiadata.com/v4/guild/${guildName}`);
        const data = await response.json();
        
        if (data && data.guild && data.guild.members) {
            // Se já houver membros, podemos mesclar ou substituir. 
            // Para simplificar, vamos substituir pela guilda selecionada ou mesclar se o usuário preferir.
            // Aqui vamos apenas definir os membros da guilda selecionada.
            setMembers(data.guild.members);
            const now = new Date();
            setLastSyncTime(`${guildName} @ ${now.toLocaleTimeString()}`);
        }
    } catch (error: any) {
        console.error(`Failed to sync guild ${guildName} data`, error);
        if (error.message === 'Failed to fetch') {
            alert(`Erro de conexão: Não foi possível alcançar a API do TibiaData para ${guildName}.`);
        } else {
            alert(`Falha ao sincronizar com a API da guilda ${guildName}.`);
        }
    } finally {
        setSyncing(false);
    }
  };

  // Sort claims: Active first, then by time
  const sortedClaims = [...claims].sort((a, b) => {
      // Put "Next" queues at the bottom
      if (a.is_next !== b.is_next) return a.is_next ? 1 : -1;
      return a.end_time - b.end_time;
  });

  // Filter Members
  const filteredMembers = members.filter(m => 
      m.name.toLowerCase().includes(memberSearch.toLowerCase()) || 
      m.vocation.toLowerCase().includes(memberSearch.toLowerCase())
  );

  return (
    <div className="bg-[#0b1121] min-h-screen p-4 md:p-8 animate-in fade-in duration-300">
      
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Admin - Green Theme */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-emerald-950/20 border border-emerald-900/50 p-6 rounded-lg relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>

            <div className="flex items-center gap-4 z-10">
                <div className="p-3 bg-emerald-950/50 rounded-lg border border-emerald-800 text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                    <ShieldAlert size={32} />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-emerald-100 tracking-widest digital-font">PAINEL ADMINISTRATIVO</h2>
                    <p className="text-emerald-400 text-xs font-mono uppercase tracking-widest mt-1">Acesso Restrito</p>
                </div>
            </div>

            <div className="flex items-center gap-4">
                 <div className="flex bg-slate-900/80 p-1 rounded-lg border border-slate-700">
                    <button 
                        onClick={() => setActiveTab('CLAIMS')}
                        className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${activeTab === 'CLAIMS' ? 'bg-emerald-900/50 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        <List size={12} /> Claims
                    </button>
                    <button 
                        onClick={() => setActiveTab('MEMBERS')}
                        className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${activeTab === 'MEMBERS' ? 'bg-emerald-900/50 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        <Users size={12} /> Membros
                    </button>
                    <button 
                        onClick={() => setActiveTab('RESPAWNS')}
                        className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${activeTab === 'RESPAWNS' ? 'bg-emerald-900/50 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        <Plus size={12} /> Respawns
                    </button>
                    <button 
                        onClick={() => setActiveTab('BLOCKS')}
                        className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${activeTab === 'BLOCKS' ? 'bg-emerald-900/50 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        <ShieldAlert size={12} /> Bloqueios
                    </button>
                    <button 
                        onClick={() => {
                            setActiveTab('USERS');
                            fetchRegisteredUsers();
                        }}
                        className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${activeTab === 'USERS' ? 'bg-emerald-900/50 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        <Users size={12} /> Registros
                    </button>
                    <button 
                        onClick={() => setActiveTab('FIXED')}
                        className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${activeTab === 'FIXED' ? 'bg-emerald-900/50 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        <Calendar size={12} /> Fixos
                    </button>
                    <button 
                        onClick={() => setActiveTab('WARNINGS')}
                        className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${activeTab === 'WARNINGS' ? 'bg-emerald-900/50 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        <AlertTriangle size={12} /> Warnings
                    </button>
                 </div>

                <button 
                    onClick={onClose}
                    className="p-2 hover:bg-emerald-900/50 rounded-full text-emerald-500 hover:text-emerald-100 transition-colors"
                    title="Fechar Painel"
                >
                    <X size={24} />
                </button>
            </div>
        </div>

        {/* --- CLAIMS TAB --- */}
        {activeTab === 'CLAIMS' && (
            <>
                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-in slide-in-from-bottom-2 fade-in">
                    <div className="bg-slate-900/50 p-4 rounded border border-slate-800 flex items-center justify-between">
                        <span className="text-slate-500 text-xs font-bold uppercase">Total Claims</span>
                        <span className="text-2xl font-mono text-white">{claims.length}</span>
                    </div>
                    <div className="bg-slate-900/50 p-4 rounded border border-slate-800 flex items-center justify-between">
                        <span className="text-slate-500 text-xs font-bold uppercase">Active Hunts</span>
                        <span className="text-2xl font-mono text-cyan-400">{claims.filter(c => !c.is_next).length}</span>
                    </div>
                    <div className="bg-slate-900/50 p-4 rounded border border-slate-800 flex items-center justify-between">
                        <span className="text-slate-500 text-xs font-bold uppercase">Queued (Next)</span>
                        <span className="text-2xl font-mono text-amber-400">{claims.filter(c => c.is_next).length}</span>
                    </div>
                    <div className="bg-slate-900/50 p-4 rounded border border-slate-800 flex flex-col justify-center items-center gap-2">
                        <button 
                            onClick={handleCleanupOldClaims}
                            disabled={isCleaningUp}
                            className="w-full h-full flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest text-red-400 hover:text-red-300 transition-colors"
                        >
                            {isCleaningUp ? (
                                <RefreshCw size={14} className="animate-spin" />
                            ) : (
                                <Trash2 size={14} />
                            )}
                            Limpar Histórico
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-slate-900/30 border border-slate-800 rounded-lg overflow-hidden backdrop-blur-sm animate-in slide-in-from-bottom-4 fade-in">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-950 border-b border-slate-800 text-xs text-slate-500 uppercase tracking-widest font-bold">
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Respawn</th>
                                    <th className="p-4">Player Name</th>
                                    <th className="p-4">User ID (Auth)</th>
                                    <th className="p-4">Start Time</th>
                                    <th className="p-4">End Time</th>
                                    <th className="p-4 text-right">Ação</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800 text-sm">
                                {sortedClaims.length > 0 ? (
                                    sortedClaims.map((claim) => (
                                        <tr key={claim.id} className="hover:bg-slate-800/30 transition-colors group">
                                            <td className="p-4">
                                                {claim.is_next ? (
                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold bg-amber-950/30 text-amber-500 border border-amber-900/50">
                                                        NEXT
                                                    </span>
                                                ) : (
                                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold border ${claim.released_early ? 'bg-yellow-950/30 text-yellow-500 border-yellow-900/50' : 'bg-emerald-950/30 text-emerald-500 border-emerald-900/50'}`}>
                                                        {claim.released_early ? 'SAIU' : 'ATIVO'}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-4 font-bold text-slate-200">
                                                {respawns.find(r => r.id === claim.respawn_id)?.name || claim.respawn_id}
                                                <span className="block text-[10px] text-slate-600 font-mono mt-0.5">{claim.respawn_id}</span>
                                            </td>
                                            <td className="p-4 text-cyan-300 font-medium">
                                                <div className="flex items-center gap-2">
                                                    {claim.player_name}
                                                    {claim.phone && (
                                                        <a 
                                                            href={`https://wa.me/${claim.phone.replace(/\D/g, '')}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-emerald-500 hover:text-emerald-400"
                                                            title={`WhatsApp: ${claim.phone}`}
                                                        >
                                                            <Phone size={14} />
                                                        </a>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className="font-mono text-[10px] text-slate-500 bg-slate-950 px-1 py-0.5 rounded">
                                                    {claim.user_id.substring(0, 8)}...
                                                </span>
                                            </td>
                                            <td className="p-4 text-slate-400 font-mono text-xs">
                                                {formatEndTime(claim.start_time)}
                                            </td>
                                            <td className="p-4 text-slate-300 font-mono text-xs">
                                                {formatEndTime(claim.end_time)}
                                                <span className="block text-[10px] text-slate-600">
                                                    {formatTimeRemaining(claim.end_time)} left
                                                </span>
                                            </td>
                                            <td className="p-4 text-right pr-8">
                                                <button 
                                                    onClick={() => handleDelete(claim.id)}
                                                    disabled={deletingId === claim.id}
                                                    className="p-3 bg-red-600/20 hover:bg-red-600 text-red-500 hover:text-white border border-red-500/30 rounded-lg transition-all flex items-center justify-center ml-auto"
                                                    title="Forçar Exclusão"
                                                >
                                                    {deletingId === claim.id ? (
                                                        <RefreshCw size={18} className="animate-spin" />
                                                    ) : (
                                                        <Trash2 size={18} />
                                                    )}
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="p-12 text-center text-slate-600">
                                            <AlertTriangle size={32} className="mx-auto mb-3 opacity-20" />
                                            <p className="uppercase tracking-widest font-bold text-xs">Nenhum registro encontrado no banco de dados.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </>
        )}

        {/* --- RESPAWNS TAB --- */}
        {activeTab === 'RESPAWNS' && (
            <div className="space-y-6 animate-in slide-in-from-bottom-2 fade-in">
                {/* Add Respawn Form */}
                <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-800">
                    <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-widest mb-4">Adicionar Novo Respawn</h3>
                    <form onSubmit={handleAddRespawn} className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <input 
                            type="text" 
                            placeholder="ID (ex: D22)" 
                            value={newRespawn.id}
                            onChange={e => setNewRespawn({...newRespawn, id: e.target.value})}
                            className="bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
                            required
                        />
                        <input 
                            type="text" 
                            placeholder="Nome do Respawn" 
                            value={newRespawn.name}
                            onChange={e => setNewRespawn({...newRespawn, name: e.target.value})}
                            className="bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
                            required
                        />
                        <select 
                            value={newRespawn.category}
                            onChange={e => setNewRespawn({...newRespawn, category: e.target.value})}
                            className="bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
                        >
                            {["Ab'Dendriel", "Ankrahmun", "Carlin", "Darashia", "Edron", "Farmine", "Feyrist", "Gnomprona", "Gray Island", "Issavi", "Marapur", "Oramond", "Port Hope", "Roshamuul", "Rotten Blood", "Venore", "Warzone", "Yalahar", "Criatura Boostada"].map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                        <div className="flex items-center gap-4 px-2">
                            <label className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase">
                                <input 
                                    type="checkbox" 
                                    checked={newRespawn.isSpecial}
                                    onChange={e => setNewRespawn({...newRespawn, isSpecial: e.target.checked})}
                                /> Special
                            </label>
                        </div>
                        <button 
                            type="submit"
                            disabled={isSavingRespawn}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase py-2 rounded transition-all disabled:opacity-50"
                        >
                            {isSavingRespawn ? 'Salvando...' : 'Adicionar'}
                        </button>
                    </form>
                </div>

                {/* Respawns List */}
                <div className="bg-slate-900/30 border border-slate-800 rounded-lg overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-950 border-b border-slate-800 text-xs text-slate-500 uppercase tracking-widest font-bold">
                                <th className="p-4">ID</th>
                                <th className="p-4">Nome</th>
                                <th className="p-4">Categoria</th>
                                <th className="p-4">Tipo</th>
                                <th className="p-4 text-right">Ação</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800 text-sm">
                            {respawns.map(r => (
                                <tr key={r.id} className="hover:bg-slate-800/30 transition-colors">
                                    <td className="p-4 font-mono text-xs text-slate-400">{r.id}</td>
                                    <td className="p-4 font-bold text-slate-200">{r.name}</td>
                                    <td className="p-4 text-slate-400 text-xs">{r.category}</td>
                                    <td className="p-4">
                                        {r.isSpecial ? (
                                            <span className="text-[10px] font-bold text-purple-400 bg-purple-950/30 px-2 py-0.5 rounded border border-purple-900/50">SPECIAL (3h15)</span>
                                        ) : (
                                            <span className="text-[10px] font-bold text-slate-500 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">NORMAL (2h20)</span>
                                        )}
                                    </td>
                                    <td className="p-4 text-right pr-8">
                                        <button 
                                            onClick={() => handleDeleteRespawn(r.id)}
                                            disabled={deletingRespawnId === r.id}
                                            className="p-3 bg-red-600/20 hover:bg-red-600 text-red-500 hover:text-white border border-red-500/30 rounded-lg transition-all flex items-center justify-center ml-auto"
                                        >
                                            {deletingRespawnId === r.id ? (
                                                <RefreshCw size={18} className="animate-spin" />
                                            ) : (
                                                <Trash2 size={18} />
                                            )}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {/* --- BLOCKS TAB --- */}
        {activeTab === 'BLOCKS' && (
            <div className="space-y-6 animate-in slide-in-from-bottom-2 fade-in">
                {/* Add Block Form */}
                <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-800">
                    <h3 className="text-sm font-bold text-red-400 uppercase tracking-widest mb-4">Bloquear Jogador</h3>
                    <form onSubmit={handleBlockUser} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input 
                            type="text" 
                            placeholder="Nome do Personagem" 
                            value={blockName}
                            onChange={e => setBlockName(e.target.value)}
                            className="bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-white outline-none focus:border-red-500"
                            required
                        />
                        <input 
                            type="text" 
                            placeholder="Motivo (opcional)" 
                            value={blockReason}
                            onChange={e => setBlockReason(e.target.value)}
                            className="bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-white outline-none focus:border-red-500"
                        />
                        <button 
                            type="submit"
                            disabled={isBlocking}
                            className="bg-red-700 hover:bg-red-600 text-white text-xs font-bold uppercase py-2 rounded transition-all disabled:opacity-50"
                        >
                            {isBlocking ? 'Bloqueando...' : 'Bloquear'}
                        </button>
                    </form>
                </div>

                {/* Blocked Users List */}
                <div className="bg-slate-900/30 border border-slate-800 rounded-lg overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-950 border-b border-slate-800 text-xs text-slate-500 uppercase tracking-widest font-bold">
                                <th className="p-4">Jogador</th>
                                <th className="p-4">Motivo</th>
                                <th className="p-4">Data</th>
                                <th className="p-4 text-right">Ação</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800 text-sm">
                            {blockedUsers.length > 0 ? (
                                blockedUsers.map(b => (
                                    <tr key={b.id} className="hover:bg-slate-800/30 transition-colors">
                                        <td className="p-4 font-bold text-red-400">{b.playerName}</td>
                                        <td className="p-4 text-slate-400 text-xs">{b.reason || 'Sem motivo especificado'}</td>
                                        <td className="p-4 text-slate-500 font-mono text-[10px]">
                                            {new Date(b.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="p-4 text-right">
                                            <button 
                                                onClick={() => handleUnblockUser(b.id)}
                                                className="px-3 py-1 bg-emerald-950/30 text-emerald-500 border border-emerald-900/50 hover:bg-emerald-900 hover:text-emerald-100 rounded text-[10px] font-bold uppercase tracking-wider transition-all"
                                            >
                                                Desbloquear
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="p-12 text-center text-slate-600">
                                        <p className="uppercase tracking-widest font-bold text-xs">Nenhum jogador bloqueado.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {/* --- MEMBERS TAB --- */}
        {activeTab === 'MEMBERS' && (
            <div className="space-y-4 animate-in slide-in-from-bottom-2 fade-in">
                
                {/* Control Bar */}
                <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                        <input 
                            type="text" 
                            placeholder="Buscar membro ou vocação..." 
                            value={memberSearch}
                            onChange={(e) => setMemberSearch(e.target.value)}
                            className="w-full bg-slate-900/30 hover:bg-slate-900/50 border border-slate-700/50 rounded py-2 pl-9 pr-4 text-slate-300 placeholder-slate-600 text-xs font-bold uppercase tracking-wider focus:border-emerald-500/50 focus:outline-none transition-all"
                        />
                    </div>
                    
                    <div className="flex items-center gap-2">
                        {lastSyncTime && (
                            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mr-2">
                                Última: <span className="text-slate-300">{lastSyncTime}</span>
                            </span>
                        )}
                        <button 
                            onClick={() => handleSyncGuild('Missclick')}
                            disabled={syncing}
                            className="px-3 py-2 bg-cyan-900/30 hover:bg-cyan-900/50 text-cyan-400 border border-cyan-800/50 rounded flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <RefreshCw size={12} className={syncing ? 'animate-spin' : ''} />
                            Sync Missclick
                        </button>
                        <button 
                            onClick={() => handleSyncGuild('Caxambu')}
                            disabled={syncing}
                            className="px-3 py-2 bg-emerald-900/30 hover:bg-emerald-900/50 text-emerald-400 border border-emerald-800/50 rounded flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <RefreshCw size={12} className={syncing ? 'animate-spin' : ''} />
                            Sync Caxambu
                        </button>
                    </div>
                </div>

                {/* Members Table */}
                <div className="bg-slate-900/30 border border-slate-800 rounded-lg overflow-hidden backdrop-blur-sm h-[600px] flex flex-col">
                    <div className="overflow-y-auto custom-scrollbar flex-grow">
                        <table className="w-full text-left border-collapse relative">
                            <thead className="sticky top-0 z-10">
                                <tr className="bg-slate-950 border-b border-slate-800 text-xs text-slate-500 uppercase tracking-widest font-bold">
                                    <th className="p-4">Nome</th>
                                    <th className="p-4">Rank</th>
                                    <th className="p-4">Vocação</th>
                                    <th className="p-4">Level</th>
                                    <th className="p-4 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800 text-sm">
                                {filteredMembers.length > 0 ? (
                                    filteredMembers.map((member, idx) => (
                                        <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                                            <td className="p-3 pl-4 font-bold text-slate-200">
                                                {member.name}
                                                {member.title && <span className="block text-[10px] text-slate-500 font-normal italic">"{member.title}"</span>}
                                            </td>
                                            <td className="p-3 text-slate-400 text-xs font-medium">
                                                {member.rank}
                                            </td>
                                            <td className="p-3 text-slate-400 text-xs">
                                                {member.vocation}
                                            </td>
                                            <td className="p-3 text-slate-200 font-mono">
                                                {member.level}
                                            </td>
                                            <td className="p-3 pr-4 text-right">
                                                <div className="flex flex-col items-end gap-1">
                                                    <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${member.status === 'online' ? 'bg-emerald-950/30 text-emerald-400 border-emerald-900/50' : 'bg-slate-800 text-slate-500 border-slate-700'}`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${member.status === 'online' ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`}></span>
                                                        {member.status}
                                                    </div>
                                                    {blockedUsers.some(b => b.playerName.toLowerCase() === member.name.toLowerCase()) && (
                                                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-red-950/30 text-red-500 border border-red-900/50 text-[9px] font-bold uppercase tracking-tighter">
                                                            <ShieldAlert size={10} /> BLOQUEADO
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="p-12 text-center text-slate-600">
                                            {members.length === 0 ? (
                                                <div className="flex flex-col items-center">
                                                    <RefreshCw size={32} className="mb-3 opacity-20" />
                                                    <p className="uppercase tracking-widest font-bold text-xs mb-2">Lista vazia</p>
                                                    <p className="text-[10px] text-slate-600">Clique em Sync para carregar os dados da guilda.</p>
                                                </div>
                                            ) : (
                                                <p className="uppercase tracking-widest font-bold text-xs">Nenhum membro encontrado na busca.</p>
                                            )}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    
                    {/* Footer Stats */}
                    <div className="bg-slate-950 border-t border-slate-800 p-3 flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-slate-500">
                        <span>Total: {members.length}</span>
                        <span className="flex gap-3">
                            <span className="text-emerald-500">Online: {members.filter(m => m.status === 'online').length}</span>
                            <span className="text-red-500">Bloqueados: {members.filter(m => blockedUsers.some(b => b.playerName.toLowerCase() === m.name.toLowerCase())).length}</span>
                            <span>Offline: {members.filter(m => m.status === 'offline').length}</span>
                        </span>
                    </div>
                </div>
            </div>
        )}

                {/* USERS TAB */}
                {activeTab === 'USERS' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="flex justify-between items-center">
                            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <Users size={16} className="text-cyan-500" /> Usuários Cadastrados
                            </h4>
                            <button 
                                onClick={fetchRegisteredUsers}
                                className="p-2 text-slate-400 hover:text-cyan-400 transition-colors"
                                title="Atualizar Lista"
                            >
                                <RefreshCw size={16} className={isLoadingUsers ? 'animate-spin' : ''} />
                            </button>
                        </div>

                        <div className="bg-slate-900/50 border border-slate-800 rounded-lg overflow-hidden">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-950 text-[10px] uppercase tracking-widest text-slate-500 border-b border-slate-800">
                                        <th className="p-4">Personagem</th>
                                        <th className="p-4">Email</th>
                                        <th className="p-4">WhatsApp</th>
                                        <th className="p-4">Criado em</th>
                                        <th className="p-4 text-right">Ação</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800 text-sm">
                                    {registeredUsers.length > 0 ? (
                                        registeredUsers.map((user) => (
                                            <tr key={user.id} className="hover:bg-slate-800/30 transition-colors group">
                                                <td className="p-4 font-bold text-slate-200">
                                                    {user.user_metadata?.name || 'N/A'}
                                                </td>
                                                <td className="p-4 text-slate-400 text-xs">
                                                    {user.email}
                                                </td>
                                                <td className="p-4">
                                                    {user.user_metadata?.phone ? (
                                                        <div className="flex items-center gap-2 text-emerald-500 text-xs font-medium">
                                                            <Phone size={12} /> {user.user_metadata.phone}
                                                        </div>
                                                    ) : (
                                                        <span className="text-slate-600 text-[10px]">NÃO INFORMADO</span>
                                                    )}
                                                </td>
                                                <td className="p-4 text-slate-500 text-xs font-mono">
                                                    {new Date(user.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="p-4 text-right pr-8">
                                                    <button 
                                                        onClick={() => handleDeleteUser(user.id)}
                                                        disabled={deletingUserId === user.id}
                                                        className="p-2 bg-red-950/10 hover:bg-red-600 text-red-700 hover:text-white border border-red-900/50 rounded transition-all"
                                                        title="Excluir Cadastro"
                                                    >
                                                        {deletingUserId === user.id ? (
                                                            <RefreshCw size={14} className="animate-spin" />
                                                        ) : (
                                                            <Trash2 size={14} />
                                                        )}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="p-12 text-center text-slate-600">
                                                {isLoadingUsers ? (
                                                    <div className="flex flex-col items-center">
                                                        <RefreshCw size={32} className="mb-3 animate-spin opacity-20" />
                                                        <p className="uppercase tracking-widest font-bold text-xs">Carregando usuários...</p>
                                                    </div>
                                                ) : (
                                                    <p className="uppercase tracking-widest font-bold text-xs">Nenhum usuário encontrado.</p>
                                                )}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* FIXED RESPAWNS TAB */}
                {activeTab === 'FIXED' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
                            <h4 className="text-sm font-bold text-slate-200 uppercase tracking-widest flex items-center gap-2 mb-6">
                                <Plus size={16} className="text-cyan-500" /> Adicionar Horário Fixo
                            </h4>
                            <form onSubmit={handleAddFixed} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Respawn</label>
                                    <select 
                                        value={newFixed.respawnName}
                                        onChange={(e) => setNewFixed({...newFixed, respawnName: e.target.value})}
                                        className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-200 focus:border-cyan-500 outline-none"
                                        required
                                    >
                                        <option value="">Selecionar...</option>
                                        {respawns.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Jogador</label>
                                    <input 
                                        type="text"
                                        value={newFixed.playerName}
                                        onChange={(e) => setNewFixed({...newFixed, playerName: e.target.value})}
                                        placeholder="Nome do Personagem"
                                        className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-200 focus:border-cyan-500 outline-none"
                                        required
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">De (Dia)</label>
                                    <select 
                                        value={newFixed.dayOfWeek}
                                        onChange={(e) => setNewFixed({...newFixed, dayOfWeek: e.target.value})}
                                        className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-200 focus:border-cyan-500 outline-none"
                                    >
                                        {["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo", "Diário"].map(d => (
                                            <option key={d} value={d}>{d}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Até (Opcional)</label>
                                    <select 
                                        value={newFixed.endDay}
                                        onChange={(e) => setNewFixed({...newFixed, endDay: e.target.value})}
                                        disabled={newFixed.dayOfWeek === 'Diário'}
                                        className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-200 focus:border-cyan-500 outline-none disabled:opacity-30"
                                    >
                                        <option value="">Nenhum</option>
                                        {["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"].map(d => (
                                            <option key={d} value={d}>{d}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex gap-2">
                                    <div className="space-y-1.5 flex-1">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Início</label>
                                        <input 
                                            type="time"
                                            value={newFixed.startTime}
                                            onChange={(e) => setNewFixed({...newFixed, startTime: e.target.value})}
                                            className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-200 focus:border-cyan-500 outline-none"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1.5 flex-1">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Fim</label>
                                        <input 
                                            type="time"
                                            value={newFixed.endTime}
                                            onChange={(e) => setNewFixed({...newFixed, endTime: e.target.value})}
                                            className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-200 focus:border-cyan-500 outline-none"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="flex items-end">
                                    <button 
                                        type="submit"
                                        disabled={isSavingFixed}
                                        className="w-full bg-cyan-600 hover:bg-cyan-500 text-white text-[10px] font-bold uppercase tracking-widest py-2.5 rounded transition-all flex items-center justify-center gap-2"
                                    >
                                        {isSavingFixed ? <RefreshCw size={14} className="animate-spin" /> : <Plus size={14} />}
                                        Adicionar
                                    </button>
                                </div>
                            </form>
                        </div>

                        <div className="bg-slate-900/50 border border-slate-800 rounded-lg overflow-hidden">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-950 text-[10px] uppercase tracking-widest text-slate-500 border-b border-slate-800">
                                        <th className="p-4">Dia</th>
                                        <th className="p-4">Respawn</th>
                                        <th className="p-4">Jogador</th>
                                        <th className="p-4">Horário</th>
                                        <th className="p-4 text-right">Ação</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800 text-sm">
                                    {fixedRespawns.length > 0 ? (
                                        [...fixedRespawns].sort((a, b) => a.dayOfWeek.localeCompare(b.dayOfWeek) || a.startTime.localeCompare(b.startTime)).map((fixed) => (
                                            <tr key={fixed.id} className="hover:bg-slate-800/30 transition-colors group">
                                                <td className="p-4">
                                                    {editingFixedId === fixed.id ? (
                                                        <select 
                                                            value={editFixedData.dayOfWeek}
                                                            onChange={(e) => setEditFixedData({...editFixedData, dayOfWeek: e.target.value})}
                                                            className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200 outline-none"
                                                        >
                                                            {["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo", "Diário"].map(d => (
                                                                <option key={d} value={d}>{d}</option>
                                                            ))}
                                                        </select>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold bg-cyan-950/30 text-cyan-500 border border-cyan-900/50">
                                                            {fixed.dayOfWeek}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="p-4 font-bold text-slate-200">
                                                    {editingFixedId === fixed.id ? (
                                                        <select 
                                                            value={editFixedData.respawnName}
                                                            onChange={(e) => setEditFixedData({...editFixedData, respawnName: e.target.value})}
                                                            className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200 outline-none"
                                                        >
                                                            {respawns.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
                                                        </select>
                                                    ) : (
                                                        fixed.respawnName
                                                    )}
                                                </td>
                                                <td className="p-4 text-cyan-300 font-medium">
                                                    {editingFixedId === fixed.id ? (
                                                        <input 
                                                            type="text"
                                                            value={editFixedData.playerName}
                                                            onChange={(e) => setEditFixedData({...editFixedData, playerName: e.target.value})}
                                                            className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200 outline-none w-full"
                                                        />
                                                    ) : (
                                                        fixed.playerName
                                                    )}
                                                </td>
                                                <td className="p-4 text-slate-400 font-mono text-xs">
                                                    {editingFixedId === fixed.id ? (
                                                        <div className="flex items-center gap-1">
                                                            <input 
                                                                type="time"
                                                                value={editFixedData.startTime}
                                                                onChange={(e) => setEditFixedData({...editFixedData, startTime: e.target.value})}
                                                                className="bg-slate-950 border border-slate-800 rounded px-1 py-0.5 text-[10px] text-slate-200 outline-none"
                                                            />
                                                            <span>-</span>
                                                            <input 
                                                                type="time"
                                                                value={editFixedData.endTime}
                                                                onChange={(e) => setEditFixedData({...editFixedData, endTime: e.target.value})}
                                                                className="bg-slate-950 border border-slate-800 rounded px-1 py-0.5 text-[10px] text-slate-200 outline-none"
                                                            />
                                                        </div>
                                                    ) : (
                                                        `${fixed.startTime} - ${fixed.endTime}`
                                                    )}
                                                </td>
                                                <td className="p-4 text-right pr-8">
                                                    <div className="flex items-center justify-end gap-2">
                                                        {editingFixedId === fixed.id ? (
                                                            <>
                                                                <button 
                                                                    onClick={handleUpdateFixed}
                                                                    disabled={isSavingFixed}
                                                                    className="p-2 bg-emerald-950/10 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-900/50 rounded transition-all"
                                                                    title="Salvar Alterações"
                                                                >
                                                                    {isSavingFixed ? <RefreshCw size={14} className="animate-spin" /> : <Check size={14} />}
                                                                </button>
                                                                <button 
                                                                    onClick={() => {
                                                                        setEditingFixedId(null);
                                                                        setEditFixedData(null);
                                                                    }}
                                                                    className="p-2 bg-slate-950/10 hover:bg-slate-600 text-slate-500 hover:text-white border border-slate-800 rounded transition-all"
                                                                    title="Cancelar"
                                                                >
                                                                    <X size={14} />
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <button 
                                                                    onClick={() => handleStartEditFixed(fixed)}
                                                                    className="p-2 bg-cyan-950/10 hover:bg-cyan-600 text-cyan-700 hover:text-white border border-cyan-900/50 rounded transition-all"
                                                                    title="Editar Horário Fixo"
                                                                >
                                                                    <Edit2 size={14} />
                                                                </button>
                                                                <button 
                                                                    onClick={() => handleDeleteFixed(fixed.id)}
                                                                    disabled={deletingFixedId === fixed.id}
                                                                    className="p-2 bg-red-950/10 hover:bg-red-600 text-red-700 hover:text-white border border-red-900/50 rounded transition-all"
                                                                    title="Excluir Horário Fixo"
                                                                >
                                                                    {deletingFixedId === fixed.id ? (
                                                                        <RefreshCw size={14} className="animate-spin" />
                                                                    ) : (
                                                                        <Trash2 size={14} />
                                                                    )}
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="p-12 text-center text-slate-600 uppercase tracking-widest font-bold text-xs">
                                                Nenhum horário fixo registrado.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* WARNINGS TAB */}
                {activeTab === 'WARNINGS' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
                            <h4 className="text-sm font-bold text-slate-200 uppercase tracking-widest flex items-center gap-2 mb-6">
                                <Plus size={16} className="text-cyan-500" /> Adicionar Warning
                            </h4>
                            <form onSubmit={handleAddWarning} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Jogador</label>
                                    <input 
                                        type="text"
                                        value={newWarning.playerName}
                                        onChange={(e) => setNewWarning({...newWarning, playerName: e.target.value})}
                                        placeholder="Nome do Personagem"
                                        className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-200 focus:border-cyan-500 outline-none"
                                        required
                                    />
                                </div>
                                <div className="space-y-1.5 lg:col-span-2">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Motivo</label>
                                    <input 
                                        type="text"
                                        value={newWarning.reason}
                                        onChange={(e) => setNewWarning({...newWarning, reason: e.target.value})}
                                        placeholder="Descreva o ocorrido"
                                        className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-200 focus:border-cyan-500 outline-none"
                                        required
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Data</label>
                                    <input 
                                        type="text"
                                        value={newWarning.date}
                                        onChange={(e) => setNewWarning({...newWarning, date: e.target.value})}
                                        placeholder="DD/MM/AAAA"
                                        className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-200 focus:border-cyan-500 outline-none"
                                    />
                                </div>
                                <div className="flex items-end lg:col-start-4">
                                    <button 
                                        type="submit"
                                        disabled={isSavingWarning}
                                        className="w-full bg-cyan-600 hover:bg-cyan-500 text-white text-[10px] font-bold uppercase tracking-widest py-2.5 rounded transition-all flex items-center justify-center gap-2"
                                    >
                                        {isSavingWarning ? <RefreshCw size={14} className="animate-spin" /> : <Plus size={14} />}
                                        Adicionar
                                    </button>
                                </div>
                            </form>
                        </div>

                        <div className="bg-slate-900/50 border border-slate-800 rounded-lg overflow-hidden">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-950 text-[10px] uppercase tracking-widest text-slate-500 border-b border-slate-800">
                                        <th className="p-4">Data</th>
                                        <th className="p-4">Jogador</th>
                                        <th className="p-4">Motivo</th>
                                        <th className="p-4 text-right">Ação</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800 text-sm">
                                    {warnings.length > 0 ? (
                                        [...warnings].sort((a, b) => b.createdAt?.localeCompare(a.createdAt || '') || 0).map((warning) => (
                                            <tr key={warning.id} className="hover:bg-slate-800/30 transition-colors group">
                                                <td className="p-4 text-slate-400 font-mono text-xs whitespace-nowrap">
                                                    {warning.date}
                                                </td>
                                                <td className="p-4 font-bold text-red-400">
                                                    {warning.playerName}
                                                </td>
                                                <td className="p-4 text-slate-300 text-xs leading-relaxed">
                                                    {warning.reason}
                                                </td>
                                                <td className="p-4 text-right pr-8">
                                                    <button 
                                                        onClick={() => handleDeleteWarning(warning.id)}
                                                        disabled={deletingWarningId === warning.id}
                                                        className="p-2 bg-red-950/10 hover:bg-red-600 text-red-700 hover:text-white border border-red-900/50 rounded transition-all"
                                                        title="Excluir Warning"
                                                    >
                                                        {deletingWarningId === warning.id ? (
                                                            <RefreshCw size={14} className="animate-spin" />
                                                        ) : (
                                                            <Trash2 size={14} />
                                                        )}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="p-12 text-center text-slate-600 uppercase tracking-widest font-bold text-xs">
                                                Nenhum warning registrado.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}


      </div>
    </div>
  );
};

export default AdminPanel;