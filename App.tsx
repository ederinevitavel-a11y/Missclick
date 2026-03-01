import React, { useState, useEffect, useMemo } from 'react';
import { RefreshCw, ChevronUp, Plus, Search, LogOut, ShieldAlert, User, List, Calendar, ScrollText } from 'lucide-react';
import { INITIAL_RESPAWNS } from './data/respawns';
import { Respawn, NewClaimData, Claim, BlockedUser, FixedRespawn, Warning } from './types';
import { INITIAL_WARNINGS } from './data/warnings';
import RespawnCard from './components/RespawnCard';
import ClaimModal from './components/ClaimModal';
import RespawnSelector from './components/RespawnSelector';
import LoginPage from './components/LoginPage';
import AdminPanel from './components/AdminPanel';
import FixedRespawnsTab from './components/FixedRespawnsTab';
import GuildRulesTab from './components/GuildRulesTab';
import ResetPasswordPage from './components/ResetPasswordPage';
import { calculateEndTime } from './utils/time';
import { supabase } from './utils/supabaseClient';

function App() {
  // --- Auth State ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userPhone, setUserPhone] = useState<string | null>(null);
  
  // Admin State
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  // --- App Data State ---
  const [claims, setClaims] = useState<any[]>([]);
  const [respawnsFromDb, setRespawnsFromDb] = useState<Respawn[]>([]);
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);
  const [fixedRespawns, setFixedRespawns] = useState<FixedRespawn[]>([]);
  const [warnings, setWarnings] = useState<Warning[]>([]);
  const [guildMembers, setGuildMembers] = useState<string[]>([]);
  const [loadingClaims, setLoadingClaims] = useState(false);
  const [dataInitialized, setDataInitialized] = useState(false);
  
  // View State
  const [activeView, setActiveView] = useState<'CLAIMS' | 'FIXED' | 'RULES'>('CLAIMS');
  const [isAccessDenied, setIsAccessDenied] = useState(false);
  
  // Modal States
  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [selectorOpen, setSelectorOpen] = useState(false);
  
  const [activeRespawnId, setActiveRespawnId] = useState<string | null>(null);
  const [modalMode, setModalMode] = useState<'CLAIM' | 'NEXT'>('CLAIM');

  const [isResettingPassword, setIsResettingPassword] = useState(false);

  // --- Auth Effect ---
  useEffect(() => {
    const checkSession = async () => {
        try {
            const { data: { session }, error } = await supabase.auth.getSession();
            if (error) {
                console.error("Auth session error:", error);
            }
            if (session) {
                handleSession(session);
            }
        } catch (err) {
            console.error("Failed to check session:", err);
        } finally {
            setAuthChecking(false);
        }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'PASSWORD_RECOVERY') {
            setIsResettingPassword(true);
        }
        
        if (session) {
            handleSession(session);
        } else {
            setIsAuthenticated(false);
            setUserId(null);
            setUserName(null);
            setIsAdmin(false);
            setClaims([]);
        }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSession = async (session: any) => {
      setIsAuthenticated(true);
      setUserId(session.user.id);
      
      // Get Name and Phone from metadata or fallback
      const metaName = session.user.user_metadata?.name;
      const metaPhone = session.user.user_metadata?.phone;
      const emailName = session.user.email?.split('@')[0];
      
      const pName = metaName || emailName || 'Operator';
      setUserName(pName);
      setUserPhone(metaPhone || null);

      // Admin Check
      const isAdminUser = session.user.email === 'admissclick@gmail.com';
      setIsAdmin(isAdminUser);
      if (!isAdminUser) {
          setShowAdminPanel(false);
      }
      
      // Fetch data and check access
      await refreshAllData();
      
      // Check if user is in guild members list
      // We do this after refreshAllData to ensure guildMembers is populated
  };

  // Check access whenever guildMembers or userName changes
  useEffect(() => {
    if (isAuthenticated && userName && guildMembers.length > 0) {
        const isMember = guildMembers.some(m => m.toLowerCase() === userName.toLowerCase());
        if (!isMember && !isAdmin) {
            setIsAccessDenied(true);
        } else {
            setIsAccessDenied(false);
        }
    }
  }, [isAuthenticated, userName, guildMembers, isAdmin]);

  // --- Migration Effect ---
  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      const runMigration = async () => {
        // Update respawns table
        await supabase
          .from('respawns')
          .update({ name: 'Monster Graveyard Dir' })
          .eq('name', 'Monster Graveyard Dir.');
        
        // Update fixed_respawns table
        await supabase
          .from('fixed_respawns')
          .update({ respawn_name: 'Monster Graveyard Dir' })
          .eq('respawn_name', 'Monster Graveyard Dir.');
          
        refreshAllData();
      };
      runMigration();
    }
  }, [isAuthenticated, isAdmin]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setShowAdminPanel(false);
  };

  const refreshAllData = async () => {
    await Promise.all([
        fetchClaims(),
        fetchRespawns(),
        fetchBlockedUsers(),
        fetchFixedRespawns(),
        fetchWarnings(),
        fetchGuildMembers()
    ]);
  };

  const fetchGuildMembers = async () => {
    try {
        const { data, error } = await supabase.from('guild_members').select('player_name');
        if (error) {
            // If table doesn't exist yet, we might get an error. 
            // We'll handle it gracefully.
            console.error("Error fetching guild members:", error);
            return;
        }
        if (data) {
            setGuildMembers(data.map(m => m.player_name));
        }
    } catch (err) {
        console.error("Unexpected error fetching guild members:", err);
    }
  };

  const fetchWarnings = async () => {
    try {
        const { data, error } = await supabase.from('warnings').select('*');
        if (error) throw error;
        
        if (data && data.length > 0) {
            setWarnings(data.map(w => ({
                id: w.id,
                playerName: w.player_name,
                reason: w.reason,
                date: w.date,
                createdAt: w.created_at
            })));
        } else if (!dataInitialized) {
            console.log("Seeding initial warnings...");
            const seedData = INITIAL_WARNINGS.map(w => ({
                player_name: w.playerName,
                reason: w.reason,
                date: w.date
            }));
            await supabase.from('warnings').insert(seedData);
            fetchWarnings();
        }
    } catch (err) {
        console.error("Error fetching warnings:", err);
    }
  };

  const fetchFixedRespawns = async () => {
    try {
        const { data, error } = await supabase.from('fixed_respawns').select('*');
        if (error) throw error;
        
        if (data) {
            const mapped: FixedRespawn[] = data.map(f => ({
                id: f.id,
                respawnName: f.respawn_name,
                playerName: f.player_name,
                dayOfWeek: f.day_of_week,
                startTime: f.start_time,
                endTime: f.end_time,
                createdAt: f.created_at
            }));
            setFixedRespawns(mapped);
        }
    } catch (err) {
        console.error("Error fetching fixed respawns:", err);
    }
  };

  const fetchRespawns = async () => {
    try {
        const { data, error } = await supabase.from('respawns').select('*');
        if (error) throw error;
        
        if (data && data.length > 0) {
            const mapped: Respawn[] = data.map(r => ({
                id: r.id,
                name: r.name,
                category: r.category,
                tier: r.tier,
                isSpecial: r.is_special,
                currentClaim: null,
                nextQueue: []
            }));
            setRespawnsFromDb(mapped);
        } else if (!dataInitialized) {
            // Seed initial data if table is empty
            console.log("Seeding initial respawns...");
            const seedData = INITIAL_RESPAWNS.map(r => ({
                id: r.id,
                name: r.name,
                category: r.category,
                tier: r.tier,
                is_special: r.isSpecial
            }));
            await supabase.from('respawns').insert(seedData);
            setDataInitialized(true);
            fetchRespawns();
        }
    } catch (err) {
        console.error("Error fetching respawns:", err);
    }
  };

  const fetchBlockedUsers = async () => {
    try {
        const { data, error } = await supabase.from('blocked_users').select('*');
        if (error) throw error;
        if (data) {
            setBlockedUsers(data.map(b => ({
                id: b.id,
                playerName: b.player_name,
                reason: b.reason,
                blockedBy: b.blocked_by,
                createdAt: b.created_at
            })));
        }
    } catch (err) {
        console.error("Error fetching blocked users:", err);
    }
  };

  const fetchClaims = async () => {
    // Only show loading indicator on first load or if list is empty
    if (claims.length === 0) setLoadingClaims(true);
    
    try {
        const { data, error } = await supabase
            .from('claims')
            .select('*');

        if (error) {
            console.error("Supabase fetch error:", error);
            // If it's a network error, it might be "Failed to fetch"
            if (error.message === 'Failed to fetch') {
                console.warn("Network error detected. Please check your Supabase project status and internet connection.");
            }
        } else if (data) {
            setClaims(data);
        }
    } catch (err) {
        console.error("Unexpected error in fetchClaims:", err);
    } finally {
        setLoadingClaims(false);
    }
  };

  // --- Realtime Subscription ---
  useEffect(() => {
    if (!isAuthenticated) return;

    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'claims',
        },
        () => {
            fetchClaims();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAuthenticated]);


  // --- Derived Data (Merge Initial Respawns with DB Claims) ---
  const derivedRespawns: Respawn[] = useMemo(() => {
    // Group claims by respawn_id
    const claimsByRespawn: Record<string, Claim[]> = {};
    
    claims.forEach((c: any) => {
        if (!c.respawn_id) return;
        
        // Map DB snake_case to App camelCase
        const mappedClaim: Claim = {
            id: c.id,
            userId: c.user_id, // Map database column to Typescript interface
            playerName: c.player_name,
            phone: c.phone,
            startTime: Number(c.start_time),
            durationMinutes: Number(c.duration_minutes),
            endTime: Number(c.end_time),
            isNext: c.is_next,
            releasedEarly: c.released_early
        };

        if (!claimsByRespawn[c.respawn_id]) claimsByRespawn[c.respawn_id] = [];
        claimsByRespawn[c.respawn_id].push(mappedClaim);
    });

    const baseRespawns = respawnsFromDb.length > 0 ? respawnsFromDb : INITIAL_RESPAWNS;

    return baseRespawns.map(r => {
        const myClaims = claimsByRespawn[r.id] || [];
        
        // Logic: The "Current" claim is the active one (not isNext).
        // If there are multiple (shouldn't happen with logic), take earliest start.
        const current = myClaims.find(c => !c.isNext);
        
        // Queue: All isNext=true, sorted by end time (approx FIFO)
        const queue = myClaims
            .filter(c => c.isNext)
            .sort((a, b) => a.endTime - b.endTime);

        return {
            ...r,
            currentClaim: current || null,
            nextQueue: queue
        };
    });
  }, [claims, respawnsFromDb]);

  // --- Exact Time Cleanup Effect ---
  useEffect(() => {
    if (!isAuthenticated) return;

    const timers: ReturnType<typeof setTimeout>[] = [];

    derivedRespawns.forEach((respawn) => {
        if (respawn.currentClaim && respawn.nextQueue.length === 0) {
            const now = Date.now();
            const timeUntilExpiration = respawn.currentClaim.endTime - now;
            const claimId = respawn.currentClaim.id;

            const deleteClaim = async () => {
                console.log(`Auto-releasing respawn ${respawn.name} as time expired.`);
                await supabase.from('claims').delete().eq('id', claimId);
            };

            if (timeUntilExpiration <= 0) {
                const timer = setTimeout(deleteClaim, 0);
                timers.push(timer);
            } else {
                const timer = setTimeout(deleteClaim, timeUntilExpiration);
                timers.push(timer);
            }
        }
    });

    return () => {
        timers.forEach(clearTimeout);
    };
  }, [isAuthenticated, derivedRespawns]);


  // Main View Filters
  const occupiedRespawns = derivedRespawns.filter(r => !!r.currentClaim);
  const freeRespawns = derivedRespawns.filter(r => !r.currentClaim);

  const activeRespawn = useMemo(() => 
    derivedRespawns.find(r => r.id === activeRespawnId) || null, 
    [derivedRespawns, activeRespawnId]
  );

  // --- Handlers ---

  const handleOpenSelector = () => setSelectorOpen(true);

  const handleSelectFromList = (respawnId: string) => {
    setActiveRespawnId(respawnId);
    setModalMode('CLAIM');
    setSelectorOpen(false); 
    setClaimModalOpen(true); 
  };

  const handleOpenClaim = (respawnId: string) => {
    setActiveRespawnId(respawnId);
    setModalMode('CLAIM');
    setClaimModalOpen(true);
  };

  const handleOpenNext = (respawnId: string) => {
    setActiveRespawnId(respawnId);
    setModalMode('NEXT');
    setClaimModalOpen(true);
  };

  const handleCloseModals = () => {
    setClaimModalOpen(false);
    setSelectorOpen(false);
    setActiveRespawnId(null);
  };

  const handleModalSubmit = async (data: NewClaimData) => {
    if (!activeRespawnId || !userId) return;
    if (!activeRespawn) return;

    // Check if user is blocked
    const isBlocked = blockedUsers.some(b => b.playerName.toLowerCase() === data.playerName.toLowerCase());
    if (isBlocked) {
        alert("Você está bloqueado de realizar agendamentos. Entre em contato com um administrador.");
        return;
    }

    const now = Date.now();
    let startTime = now;
    let isNext = false;

    if (modalMode === 'NEXT') {
        isNext = true;
        let lastEndTime = activeRespawn.currentClaim ? activeRespawn.currentClaim.endTime : now;
        if (activeRespawn.nextQueue.length > 0) {
          lastEndTime = activeRespawn.nextQueue[activeRespawn.nextQueue.length - 1].endTime;
        }
        startTime = lastEndTime;
    }

    // Check if user already has an active claim in another respawn
    const userActiveClaims = claims.filter(c => 
        c.user_id === userId && 
        c.end_time > now && 
        !c.released_early
    );

    if (userActiveClaims.length > 0) {
        // Allow if it's the same respawn (maybe they are adding to the queue of their own current hunt?)
        // But usually, "two respawns at the same time" means different ones.
        const otherRespawnClaim = userActiveClaims.find(c => c.respawn_id !== activeRespawnId);
        if (otherRespawnClaim) {
            alert(`Você já possui um agendamento ativo em outro respawn. Cancele o anterior antes de pegar um novo.`);
            return;
        }
    }

    const endTime = calculateEndTime(startTime, data.durationMinutes);

    const { error } = await supabase.from('claims').insert({
        respawn_id: activeRespawnId,
        user_id: userId,
        player_name: data.playerName,
        phone: userPhone,
        start_time: startTime,
        duration_minutes: data.durationMinutes,
        end_time: endTime,
        is_next: isNext,
        released_early: false
    });

    if (error) {
        alert("Erro ao agendar: " + error.message);
    }
  };

  const handleCancel = async (respawnId: string, claimId: string, isNext: boolean) => {
    if (isNext) {
        await supabase.from('claims').delete().eq('id', claimId);
    } else {
        const respawn = derivedRespawns.find(r => r.id === respawnId);
        if (respawn && respawn.nextQueue.length > 0) {
             await supabase.from('claims').update({ released_early: true }).eq('id', claimId);
        } else {
            await supabase.from('claims').delete().eq('id', claimId);
        }
    }
  };

  const handleAnticipate = async (respawnId: string) => {
    const respawn = derivedRespawns.find(r => r.id === respawnId);
    if (!respawn || !respawn.currentClaim || respawn.nextQueue.length === 0) return;

    const oldClaim = respawn.currentClaim;
    const nextUp = respawn.nextQueue[0];
    const now = Date.now();
    const MAX_ALLOWED_MINUTES = respawn.isSpecial ? 195 : 140;

    let bonusMinutes = 0;
    if (oldClaim.endTime > now) {
        const diffMs = oldClaim.endTime - now;
        bonusMinutes = Math.floor(diffMs / (1000 * 60));
        if (bonusMinutes < 0) bonusMinutes = 0;
    }

    let potentialDuration = nextUp.durationMinutes + bonusMinutes;
    if (potentialDuration > MAX_ALLOWED_MINUTES) {
        potentialDuration = MAX_ALLOWED_MINUTES;
    }
    const newEndTime = calculateEndTime(now, potentialDuration);

    await supabase.from('claims').delete().eq('id', oldClaim.id);
    await supabase.from('claims').update({
        is_next: false,
        start_time: now,
        duration_minutes: potentialDuration,
        end_time: newEndTime,
        released_early: false
    }).eq('id', nextUp.id);

    let prevEnd = newEndTime;
    const remainingQueue = respawn.nextQueue.slice(1);
    for (const q of remainingQueue) {
        const qEnd = calculateEndTime(prevEnd, q.durationMinutes);
        await supabase.from('claims').update({
            start_time: prevEnd,
            end_time: qEnd
        }).eq('id', q.id);
        prevEnd = qEnd;
    }
  };

  // --- Admin Handler ---
  const handleAdminForceDelete = async (claimId: string) => {
      try {
          const { error } = await supabase.from('claims').delete().eq('id', claimId);
          if (error) throw error;
          await fetchClaims(); // Manually refresh to be sure
      } catch (err: any) {
          console.error("Admin delete error:", err);
          alert("Erro ao excluir: " + (err.message || "Erro desconhecido"));
      }
  };

  if (authChecking) {
    return <div className="min-h-screen bg-[#0b1121] flex items-center justify-center"><RefreshCw className="animate-spin text-cyan-500" /></div>;
  }

  if (isResettingPassword) {
    return <ResetPasswordPage onComplete={() => setIsResettingPassword(false)} />;
  }

  if (isAccessDenied) {
    return (
      <div className="min-h-screen bg-[#0b1121] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#0f172a] border border-rose-900/50 rounded-2xl p-8 text-center shadow-2xl">
          <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-rose-500/30">
            <ShieldAlert size={40} className="text-rose-500" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-4 uppercase tracking-widest digital-font">Acesso Negado</h1>
          <p className="text-slate-400 text-sm mb-8 leading-relaxed">
            O personagem <span className="text-cyan-400 font-bold">"{userName}"</span> não foi encontrado na lista de membros autorizados da guilda.
          </p>
          <div className="space-y-4">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest">Entre em contato com um administrador para solicitar acesso.</p>
            <button 
              onClick={handleLogout}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-bold uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2"
            >
              <LogOut size={16} /> Sair da Conta
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage onLogin={() => setIsAuthenticated(true)} />;
  }

  // --- RENDER ADMIN PANEL IF ACTIVE ---
  if (showAdminPanel) {
      return (
          <AdminPanel 
            claims={claims} 
            respawns={respawnsFromDb.length > 0 ? respawnsFromDb : INITIAL_RESPAWNS}
            blockedUsers={blockedUsers}
            fixedRespawns={fixedRespawns}
            warnings={warnings}
            guildMembers={guildMembers}
            onClose={() => setShowAdminPanel(false)}
            onForceDelete={handleAdminForceDelete}
            onRefreshData={refreshAllData}
          />
      );
  }

  // --- RENDER MAIN APP ---
  return (
    <div className="min-h-screen bg-[#0b1121] pb-20 selection:bg-cyan-500/30">
      
      {/* Header */}
      <header className="bg-[#0f172a]/80 backdrop-blur-md border-b border-cyan-900/30 sticky top-0 z-40 shadow-[0_4px_20px_-5px_rgba(8,145,178,0.1)]">
        <div className="container mx-auto px-4 py-3 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center justify-between w-full sm:w-auto gap-4">
            <div className="flex items-center gap-3">
              <div className="relative group shrink-0">
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg blur opacity-40 group-hover:opacity-75 transition duration-200"></div>
                <div className="relative w-10 h-10 sm:w-12 sm:h-12 bg-[#0b1121] rounded-lg border border-cyan-800 flex flex-col items-center justify-center shadow-lg">
                   <ChevronUp size={24} className="text-cyan-400 -mb-1.5 sm:-mb-2" strokeWidth={3} />
                   <span className="text-[8px] sm:text-[10px] font-bold text-cyan-500 tracking-wider">MJR</span>
                </div>
              </div>
              
              <div>
                <h1 className="text-xl sm:text-3xl font-bold text-white tracking-wider digital-font drop-shadow-[0_0_10px_rgba(34,211,238,0.3)]">
                  CLAIMED
                </h1>
                <div className="flex items-center gap-2">
                  <div className="h-[2px] w-3 sm:w-4 bg-cyan-500 rounded-full"></div>
                  <p className="text-[8px] sm:text-[10px] text-cyan-400/80 tracking-[0.2em] uppercase font-bold">Online</p>
                </div>
              </div>
            </div>

            {/* Mobile User Info */}
            <div className="flex sm:hidden items-center gap-2">
                <div className="text-right">
                    <div className="text-[8px] text-slate-500 font-bold uppercase tracking-widest leading-none">Missclick</div>
                    <div className="text-xs text-cyan-300 font-bold truncate max-w-[80px]">
                        {userName?.split(' ')[0] || 'User'}
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="p-2 text-slate-400 hover:text-white bg-slate-800/50 rounded-lg border border-slate-700/50"
                >
                    <LogOut size={16} />
                </button>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-end gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
            
            {/* ADMIN BUTTON */}
            {isAdmin && (
                <button
                    onClick={() => setShowAdminPanel(true)}
                    className="flex items-center gap-2 px-2.5 py-2 bg-emerald-950/30 text-emerald-500 border border-emerald-900/50 hover:bg-emerald-900 hover:text-emerald-100 rounded-lg transition-all shrink-0"
                    title="Painel Administrativo"
                >
                    <ShieldAlert size={16} />
                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">Admin</span>
                </button>
            )}

            {/* ABA REGRAS DA GUILD */}
            <button 
              onClick={() => setActiveView(activeView === 'RULES' ? 'CLAIMS' : 'RULES')}
              className={`flex items-center gap-2 px-2.5 py-2 rounded-lg transition-all border shrink-0 ${activeView === 'RULES' ? 'bg-amber-600 text-white border-amber-500' : 'bg-amber-950/30 text-amber-500 border-amber-900/50 hover:bg-amber-900 hover:text-amber-100'}`}
              title="Regras da Guilda"
            >
              <ScrollText size={16} />
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">Regras</span>
            </button>

            {/* ABA RESPAWS FIXOS */}
            <button 
              onClick={() => setActiveView(activeView === 'FIXED' ? 'CLAIMS' : 'FIXED')}
              className={`flex items-center gap-2 px-2.5 py-2 rounded-lg transition-all border shrink-0 ${activeView === 'FIXED' ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-indigo-950/30 text-indigo-500 border-indigo-900/50 hover:bg-indigo-900 hover:text-indigo-100'}`}
              title="Alternar para Respaws Fixos"
            >
              <Calendar size={16} />
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">Fixos</span>
            </button>

            {/* NOVO AGENDAMENTO */}
            <button 
                onClick={handleOpenSelector}
                className="flex items-center gap-2 px-2.5 py-2 bg-cyan-950/30 text-cyan-500 border border-cyan-900/50 hover:bg-cyan-900 hover:text-cyan-100 rounded-lg transition-all shrink-0"
            >
                <Plus size={16} />
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">Novo</span>
            </button>

            {/* DESKTOP USER INFO & LOGOUT GROUP */}
            <div className="hidden sm:flex items-center gap-3 pl-3 ml-2 border-l border-slate-700/50">
                <div className="text-right">
                    <div className="text-[9px] text-slate-500 font-bold uppercase tracking-widest leading-none mb-0.5">Missclick</div>
                    <div className="text-sm text-cyan-300 font-bold truncate max-w-[120px]">
                        {userName || 'User'}
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="p-2.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors border border-transparent hover:border-slate-700"
                    title="Sair / Logout"
                >
                    <LogOut size={20} />
                </button>
            </div>

          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">

        {activeView === 'CLAIMS' ? (
          <>
            {/* Info Bar */}
            <div className="flex justify-between items-center mb-6 bg-[#1e293b]/30 p-4 rounded-md border-l-4 border-cyan-500 backdrop-blur-sm shadow-lg">
               <div className="text-xs text-cyan-600/80 flex items-center gap-2 uppercase tracking-wider font-bold">
                 <RefreshCw size={12} className={`animate-spin-slow ${loadingClaims ? 'text-white' : ''}`} /> 
                 {loadingClaims ? 'Sincronizando...' : 'Sistema Ativo'}
               </div>
               <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Locais Ocupados: <span className="text-white">{occupiedRespawns.length}</span>
               </div>
            </div>

            {/* Occupied Grid */}
            {occupiedRespawns.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {occupiedRespawns.map(respawn => (
                  <RespawnCard 
                    key={respawn.id} 
                    respawn={respawn}
                    currentUserId={userId}
                    onClaim={handleOpenClaim} 
                    onNext={handleOpenNext}
                    onCancel={handleCancel}
                    onAnticipate={handleAnticipate}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-24 text-slate-600 border border-dashed border-slate-800 rounded-xl bg-slate-900/20">
                 <div className="inline-block p-4 rounded-full bg-slate-900/50 mb-4 shadow-inner">
                   <Search size={32} className="opacity-50" />
                 </div>
                 <p className="text-lg font-medium text-slate-400">NENHUMA HUNT ATIVA</p>
                 <p className="text-xs uppercase tracking-widest text-slate-600 mt-1 mb-6">Todos os respawns estão livres no momento.</p>
                 
                 <button 
                    onClick={handleOpenSelector}
                    className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 border border-cyan-900/50 hover:border-cyan-500/50 px-6 py-2 rounded uppercase font-bold text-xs tracking-widest transition-all"
                 >
                   <Plus size={14} /> Iniciar Sessão
                 </button>
              </div>
            )}
          </>
        ) : activeView === 'FIXED' ? (
          <FixedRespawnsTab fixedRespawns={fixedRespawns} />
        ) : (
          <GuildRulesTab />
        )}
      </main>

      {/* Modals */}
      <ClaimModal 
        isOpen={claimModalOpen}
        onClose={handleCloseModals}
        onSubmit={handleModalSubmit}
        respawn={activeRespawn}
        mode={modalMode}
        initialPlayerName={userName || ''}
      />

      <RespawnSelector 
        isOpen={selectorOpen}
        onClose={() => setSelectorOpen(false)}
        respawns={freeRespawns}
        onSelect={handleSelectFromList}
      />

    </div>
  );
}

export default App;