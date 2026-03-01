import React, { useState } from 'react';
import { ScrollText, Shield, AlertCircle, Clock, Award, Info, Zap, ChevronRight, Calendar, Target, Plus, RefreshCw, Coins, TrendingUp, User } from 'lucide-react';

type RuleView = 'GENERAL' | 'BOSS_CHECK' | 'FIXED_SCHEDULE' | 'GUILD_BANK' | 'RANK_PROMOTION';

const GuildRulesTab: React.FC = () => {
  const [activeSubView, setActiveSubView] = useState<RuleView>('GENERAL');

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <div className="inline-flex p-3 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-2">
          <ScrollText size={40} className="text-cyan-400" />
        </div>
        <h2 className="text-4xl font-bold text-white tracking-tight digital-font">Regras MissClick</h2>
        <p className="text-slate-400 uppercase tracking-[0.3em] text-xs font-bold">Código de Conduta e Operação</p>
      </div>

      {/* Sub-Navigation Buttons */}
      <div className="flex flex-wrap justify-center gap-4">
        <button 
          onClick={() => setActiveSubView('GENERAL')}
          className={`px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs transition-all border flex items-center gap-2 ${activeSubView === 'GENERAL' ? 'bg-cyan-600 text-white border-cyan-500 shadow-[0_0_20px_rgba(8,145,178,0.3)]' : 'bg-slate-900/50 text-slate-400 border-slate-800 hover:border-slate-600'}`}
        >
          <ScrollText size={16} /> Regras Gerais
        </button>
        <button 
          onClick={() => setActiveSubView('BOSS_CHECK')}
          className={`px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs transition-all border flex items-center gap-2 ${activeSubView === 'BOSS_CHECK' ? 'bg-emerald-600 text-white border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 'bg-slate-900/50 text-slate-400 border-slate-800 hover:border-slate-600'}`}
        >
          <Target size={16} /> Regras Boss Check
        </button>
        <button 
          onClick={() => setActiveSubView('FIXED_SCHEDULE')}
          className={`px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs transition-all border flex items-center gap-2 ${activeSubView === 'FIXED_SCHEDULE' ? 'bg-indigo-600 text-white border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.3)]' : 'bg-slate-900/50 text-slate-400 border-slate-800 hover:border-slate-600'}`}
        >
          <Calendar size={16} /> Regras Horário Fixo
        </button>
        <button 
          onClick={() => setActiveSubView('GUILD_BANK')}
          className={`px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs transition-all border flex items-center gap-2 ${activeSubView === 'GUILD_BANK' ? 'bg-amber-600 text-white border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.3)]' : 'bg-slate-900/50 text-slate-400 border-slate-800 hover:border-slate-600'}`}
        >
          <Coins size={16} /> Regras Guild Bank
        </button>
        <button 
          onClick={() => setActiveSubView('RANK_PROMOTION')}
          className={`px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs transition-all border flex items-center gap-2 ${activeSubView === 'RANK_PROMOTION' ? 'bg-rose-600 text-white border-rose-500 shadow-[0_0_20px_rgba(225,29,72,0.3)]' : 'bg-slate-900/50 text-slate-400 border-slate-800 hover:border-slate-600'}`}
        >
          <TrendingUp size={16} /> Regras Promoção de Rank
        </button>
      </div>

      {activeSubView === 'GENERAL' && (
        <div className="space-y-8 animate-in fade-in duration-500">
          {/* Intro Card */}
          <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl backdrop-blur-sm shadow-xl">
            <div className="flex items-center gap-3 text-cyan-400 mb-4">
              <Shield size={20} />
              <h3 className="font-bold uppercase tracking-wider">Princípio Fundamental</h3>
            </div>
            <p className="text-slate-200 text-lg font-medium italic">"Respeito com os membros da guilda."</p>
          </div>

          {/* Rules Grid */}
          <div className="grid grid-cols-1 gap-6">
            
            {/* Section 1 */}
            <div className="bg-slate-900/30 border border-slate-800 rounded-xl overflow-hidden">
              <div className="bg-slate-800/50 p-4 border-b border-slate-700 flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-cyan-600 flex items-center justify-center text-white font-bold">1</div>
                <h3 className="font-bold text-white uppercase tracking-wider">Sobre Respaws Fechados</h3>
              </div>
              <div className="p-6 space-y-4 text-slate-300 text-sm leading-relaxed">
                <p><strong className="text-cyan-400">1.1.</strong> Atualmente os seguintes respawns são fechados e exclusivos para a guild Missclick: <br/>
                <span className="text-white font-mono bg-slate-950 px-2 py-1 rounded mt-2 inline-block">Roshamuul West, Energy Library, Fire Library, DT-2 Ferumbras, Pumin Ferumbras, Todos os Selos da Soul War, Toda Gnomprona, Todo Rotten Blood.</span></p>
                <p><strong className="text-cyan-400">1.2.</strong> Não é permitido caçar com random em respawn fechado.</p>
                <p><strong className="text-cyan-400">1.3.</strong> Todos os integrantes da Party devem ser membros da Missclick.</p>
                <p><strong className="text-cyan-400">1.4.</strong> É obrigatório no momento da hunt que a party esteja com todos os membros no TS. <br/>
                <span className="text-red-400 font-bold">(Fica terminantemente proibido o uso de Discord.)</span></p>
                <p><strong className="text-cyan-400">1.5.</strong> Caso encontrem um random caçando em respawn fechado, avisem sobre a indisponibilidade do respawn e encaminhem o print da conversa para a liderança ou nos grupos da guilda.</p>
              </div>
            </div>

            {/* Section 2 */}
            <div className="bg-slate-900/30 border border-slate-800 rounded-xl overflow-hidden">
              <div className="bg-slate-800/50 p-4 border-b border-slate-700 flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-cyan-600 flex items-center justify-center text-white font-bold">2</div>
                <h3 className="font-bold text-white uppercase tracking-wider">Sobre o Claimed</h3>
              </div>
              <div className="p-6 space-y-4 text-slate-300 text-sm leading-relaxed">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-950/50 p-4 rounded border border-slate-800">
                    <p><strong className="text-cyan-400">2.1. Tempo:</strong> Ficar atento ao tempo de claimed</p>
                  </div>
                  <div className="bg-slate-950/50 p-4 rounded border border-slate-800">
                    <p><strong className="text-cyan-400">2.2. Obrigatoriedade:</strong> É permitido qualquer rank caçar em qualquer respawn sem o uso do claimed, mas você fica sujeito ao claimed caso alguém decida caçar no respawn.</p>
                  </div>
                </div>
                <p><strong className="text-cyan-400">2.3. Funcionamento:</strong> Os respawns foram classificados em dois níveis, que são chamados de tiers (tier 1 e tier 3), que podem ser visualizados no channel Resplist ou no próprio Claimed Respawn.</p>
                <p><strong className="text-cyan-400">2.4.</strong> Não é permitido marcar um respawn como next para o mesmo tier enquanto estiver caçando.</p>
                <p><strong className="text-cyan-400">2.5.</strong> Não é permitido marcar mais de um respawn como next.</p>
                <div className="bg-cyan-950/20 border-l-4 border-cyan-500 p-4 text-xs italic">
                  Exemplo: Um jogador que estiver caçando Cobra (Tier 1) não pode marcar next para Roshamuul West ou Asura Espelho (Tier 1). Mas pode marcar para Tier 3 (ex: Livraria de Fogo).
                </div>
                <p><strong className="text-cyan-400">2.7. Relação com Randoms:</strong> É importante sempre perguntar quanto tempo o random ainda tem de hunt e solicitar o respawn. <span className="text-white font-bold">Observação: não é obrigatório respeitar o tempo de término da hunt. A prioridade é da guilda.</span></p>
                
                <div className="bg-red-950/20 border border-red-900/50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-red-400 mb-2 font-bold uppercase text-xs">
                    <AlertCircle size={14} /> 2.8. Punições (Warnings)
                  </div>
                  <ul className="list-disc list-inside space-y-2 text-xs">
                    <li><span className="text-white">1º Warning:</span> Aviso.</li>
                    <li><span className="text-white">2º Warning:</span> 2 semanas sem claimed + sem respawn na próxima double.</li>
                    <li><span className="text-white">3º Warning:</span> Multa de 50 TCs (paga no próximo Guild Bank).</li>
                    <li><span className="text-white">4º Warning:</span> Rebaixamento de rank (ou 1 mês de block para newcomers).</li>
                  </ul>
                  <p className="mt-3 text-[10px] text-slate-500 italic">Motivos: Perder claimed sem justificativa, manipulação de claimed, comportamento inadequado, etc.</p>
                </div>

                <p><strong className="text-cyan-400">2.8.3.</strong> Permitida repetição de até dois membros em hunts 4x/5x se necessário para completar a party seguinte.</p>
                <p><strong className="text-cyan-400">2.8.4.</strong> Permitido "resetar" o tempo se a hunt não começou OU se falta menos de 30 min para o fim. Proibido resetar no meio da hunt.</p>
                <p><strong className="text-cyan-400">2.8.5.</strong> Proibido usar macro/bot para segurar respawns (sujeito a perda de desc/rank).</p>
                <p><strong className="text-cyan-400">2.8.6.</strong> “Second Chars” fora da guild não têm direitos de membros.</p>
                <p><strong className="text-cyan-400">2.9.</strong> Jogador claimado não tem obrigação de segurar KS, mas deve avisar a liderança ao sair.</p>
                <p><strong className="text-cyan-400">2.10.</strong> Respawns planilhados: dar claimed APENAS após o fim do horário planilhado.</p>
              </div>
            </div>

            {/* Section 3 & 4 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-900/30 border border-slate-800 rounded-xl overflow-hidden">
                <div className="bg-slate-800/50 p-4 border-b border-slate-700 flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-cyan-600 flex items-center justify-center text-white font-bold">3</div>
                  <h3 className="font-bold text-white uppercase tracking-wider">Sobre Bosses</h3>
                </div>
                <div className="p-6 space-y-3 text-slate-300 text-sm">
                  <p><strong className="text-cyan-400">3.1.</strong> Proibido fazer com RANDONS: Soulwar, Rotten Blood, Magma Bubble.</p>
                  <p><strong className="text-cyan-400">3.2.</strong> Verificar no claimed se há alguém caçando para não atrapalhar.</p>
                </div>
              </div>
              <div className="bg-slate-900/30 border border-slate-800 rounded-xl overflow-hidden">
                <div className="bg-slate-800/50 p-4 border-b border-slate-700 flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-cyan-600 flex items-center justify-center text-white font-bold">4</div>
                  <h3 className="font-bold text-white uppercase tracking-wider">Início da Hunt</h3>
                </div>
                <div className="p-6 space-y-3 text-slate-300 text-sm">
                  <p><strong className="text-cyan-400">4.</strong> Tempo máximo de <span className="text-white font-bold">15 minutos</span> para chegar e estar efetivamente caçando.</p>
                  <p><strong className="text-cyan-400">4.2.</strong> Pausas maiores que 15 min devem ser avisadas ao líder Dark.</p>
                </div>
              </div>
            </div>

            {/* Section 5 */}
            <div className="bg-slate-900/30 border border-slate-800 rounded-xl overflow-hidden">
              <div className="bg-slate-800/50 p-4 border-b border-slate-700 flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-cyan-600 flex items-center justify-center text-white font-bold">5</div>
                <h3 className="font-bold text-white uppercase tracking-wider">Horários Planilhados</h3>
              </div>
              <div className="p-6 space-y-3 text-slate-300 text-sm">
                <p><strong className="text-cyan-400">5.1.</strong> Ranking Lider, Challenger, Guardian podem marcar qualquer respawn x4.</p>
                <p><strong className="text-cyan-400">5.2. Prioridade:</strong> Líder &gt; Challenger &gt; Guardians.</p>
                <p><strong className="text-cyan-400">5.3.</strong> Conflito de horários: revezamento de 7 dias se não houver acordo.</p>
              </div>
            </div>

            {/* Section 6 & 7 */}
            <div className="bg-slate-900/30 border border-slate-800 rounded-xl overflow-hidden">
              <div className="bg-slate-800/50 p-4 border-b border-slate-700 flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-cyan-600 flex items-center justify-center text-white font-bold">6/7</div>
                <h3 className="font-bold text-white uppercase tracking-wider">Específicas & Orientações</h3>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-300 text-sm">
                <div className="space-y-2">
                  <p><strong className="text-cyan-400">6.2.</strong> Gelo e Goanas: liberados para caçar com neutros (obrigatório TS).</p>
                  <p><strong className="text-cyan-400">6.3.</strong> Char alternativo permitido se level 600+ na mesma conta.</p>
                  <p><strong className="text-cyan-400">7.2.</strong> Erros no TS: enviar forms (link no grupo de avisos).</p>
                </div>
                <div className="space-y-2">
                  <p><strong className="text-cyan-400">7.4.</strong> Rank limitado pelo level (checar Guild Bank).</p>
                  <p><strong className="text-cyan-400">7.6. Lives:</strong> Tenha bom senso. Provocações desnecessárias podem gerar punição interna (kick/perda de rank).</p>
                </div>
              </div>
            </div>

            {/* Section 8, 9, 10, 11 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-900/30 border border-slate-800 rounded-xl overflow-hidden">
                <div className="bg-slate-800/50 p-4 border-b border-slate-700 flex items-center gap-3">
                  <Award size={18} className="text-cyan-400" />
                  <h3 className="font-bold text-white uppercase tracking-wider">Ranking & Chars</h3>
                </div>
                <div className="p-6 space-y-3 text-slate-300 text-sm">
                  <p><strong className="text-cyan-400">8.2.</strong> Sem char main? Deve ter um level 8 na guild para acesso ao claimed.</p>
                  <p><strong className="text-cyan-400">8.3. Retired:</strong> Informe à liderança. Quitar sem avisar remove privilégios.</p>
                  <p><strong className="text-cyan-400">10.1. TS:</strong> Nome de usuário no TS deve ser igual ao do char no site.</p>
                </div>
              </div>
              <div className="bg-slate-900/30 border border-slate-800 rounded-xl overflow-hidden">
                <div className="bg-slate-800/50 p-4 border-b border-slate-700 flex items-center gap-3">
                  <Zap size={18} className="text-cyan-400" />
                  <h3 className="font-bold text-white uppercase tracking-wider">Outros Servidores</h3>
                </div>
                <div className="p-6 space-y-3 text-slate-300 text-sm">
                  <p><strong className="text-cyan-400">11.1.</strong> Proibido envolvimento em conflitos (KS, mortes) em outros servidores.</p>
                  <p><strong className="text-cyan-400">11.2.</strong> Exceção: Services de XP ou Quests.</p>
                  <p className="text-red-400 font-bold text-xs uppercase">Descumprimento = Kick ou Rebaixamento.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {activeSubView === 'BOSS_CHECK' && (
        <div className="space-y-8 animate-in fade-in duration-500">
          {/* Intro Card */}
          <div className="bg-emerald-950/20 border border-emerald-900/50 p-6 rounded-xl backdrop-blur-sm shadow-xl">
            <div className="flex items-center gap-3 text-emerald-400 mb-4">
              <Target size={24} />
              <h3 className="font-bold uppercase tracking-widest text-lg">Implantação Grupo de Boss Missclick</h3>
            </div>
            <p className="text-slate-200 text-sm leading-relaxed">
              Chegou um novo benefício <span className="text-emerald-400 font-bold uppercase">Gratuito</span> para você membro da Missclick que curte fazer boss points ou tem interesse em começar fazer bosses.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="bg-slate-900/50 p-4 rounded border border-slate-800 text-xs text-slate-300 space-y-2">
                <p><strong className="text-emerald-400">1.</strong> Criamos uma réplica do site Boss Check chamada <span className="text-white">Boss Check Missclick</span> exclusiva para membros.</p>
                <p><strong className="text-emerald-400">2.</strong> Grupo exclusivo: <span className="text-white">Boss Encontrado Missclick</span>.</p>
                <p><strong className="text-emerald-400">3.</strong> Senha individual para cada player participante.</p>
              </div>
              <div className="bg-slate-900/50 p-4 rounded border border-slate-800 text-xs text-slate-300 space-y-2">
                <p><strong className="text-emerald-400">4.</strong> Entre no grupo temporário para receber credenciais.</p>
                <p><strong className="text-emerald-400">5.</strong> Informe apenas o <span className="text-white">Nick</span> do personagem (validado via WhatsApp).</p>
                <p><strong className="text-emerald-400">6.</strong> Grupo não é bate-papo. Use apenas frases padrão.</p>
              </div>
            </div>
          </div>

          {/* Instructions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Site Instructions */}
            <div className="bg-slate-900/30 border border-slate-800 rounded-xl overflow-hidden">
              <div className="bg-slate-800/50 p-4 border-b border-slate-700 flex items-center gap-3">
                <Info size={18} className="text-emerald-400" />
                <h3 className="font-bold text-white uppercase tracking-wider">Instruções Site</h3>
              </div>
              <div className="p-6 space-y-3 text-slate-300 text-sm">
                <p><strong className="text-emerald-400">1.</strong> Acesse a aba <span className="text-white font-bold">TUTORIAL</span> com 21 passos de como usar as funções.</p>
                <p><strong className="text-emerald-400">2.</strong> Aba Regras possui todas as informações detalhadas.</p>
              </div>
            </div>

            {/* Game Instructions */}
            <div className="bg-slate-900/30 border border-slate-800 rounded-xl overflow-hidden">
              <div className="bg-slate-800/50 p-4 border-b border-slate-700 flex items-center gap-3">
                <Target size={18} className="text-emerald-400" />
                <h3 className="font-bold text-white uppercase tracking-wider">Instruções Jogo</h3>
              </div>
              <div className="p-6 space-y-3 text-slate-300 text-xs leading-relaxed">
                <p><strong className="text-emerald-400">1. Tempo:</strong> 5 a 30 min para morte (escolha de quem encontrou).</p>
                <p><strong className="text-emerald-400">2. Contribuição:</strong> Obrigatório <span className="text-white font-bold">1 Silver Token</span> para quem encontrou o boss.</p>
                <p><strong className="text-emerald-400">3. Como Hitar:</strong> Use Fields, Wands ou Rods (Ornate mayhem/remedy).</p>
                <p><strong className="text-emerald-400">4. Loot:</strong> Pertence a quem encontrou (ou quem avisou primeiro no Bank Robbery).</p>
                <p><strong className="text-emerald-400">5. Sacolas:</strong> Envie print do loot no grupo após a morte.</p>
                <p><strong className="text-red-400 font-bold">6. Proibido:</strong> Participar de outros grupos de check ou compartilhar informações externas.</p>
              </div>
            </div>
          </div>

          {/* Warnings & Expulsion */}
          <div className="bg-red-950/20 border border-red-900/50 rounded-xl overflow-hidden">
            <div className="bg-red-900/20 p-4 border-b border-red-900/50 flex items-center gap-3">
              <AlertCircle size={20} className="text-red-400" />
              <h3 className="font-bold text-white uppercase tracking-wider">Warnings & Punições</h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="text-red-400 font-bold text-xs uppercase tracking-widest">Warnings (2 = Suspensão 1 Mês)</h4>
                <ul className="list-disc list-inside text-[11px] text-slate-300 space-y-1">
                  <li>Matar boss "sem querer" (acidentes, summons).</li>
                  <li>Fragar ou bater mais que o necessário.</li>
                  <li>Levar gente de fora da guild/grupo.</li>
                  <li>Não seguir o horário da morte.</li>
                  <li>Ativar mecânica sem permissão.</li>
                  <li>Não realizar a contribuição do Silver Token.</li>
                  <li>Não aceitar PT do dono do boss.</li>
                  <li>Live: Obrigatório esconder a tela do Tibia.</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="text-red-400 font-bold text-xs uppercase tracking-widest">Expulsão (2 Suspensões = Expulsão)</h4>
                <ul className="list-disc list-inside text-[11px] text-slate-300 space-y-1">
                  <li>Não enviar print do loot corretamente.</li>
                  <li>Roubo comprovado de loot.</li>
                  <li>Uso indevido do site (checks fake, compartilhar conta).</li>
                </ul>
                <div className="bg-red-950/40 p-3 rounded border border-red-900/30 mt-2">
                  <p className="text-[10px] text-red-200 italic">Warnings de Boss podem levar a Kick da Guild dependendo da gravidade.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Benefits Card */}
          <div className="bg-emerald-900/10 border border-emerald-900/30 p-6 rounded-xl">
            <div className="flex items-center gap-3 text-emerald-400 mb-4">
              <Award size={20} />
              <h3 className="font-bold uppercase tracking-wider">Benefícios & Ranking</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2"><ChevronRight size={12} className="text-emerald-500" /> Comunidade Bosshunters Missclick</li>
                <li className="flex items-center gap-2"><ChevronRight size={12} className="text-emerald-500" /> Farm de Silver Tokens e Itens</li>
                <li className="flex items-center gap-2"><ChevronRight size={12} className="text-emerald-500" /> Melhora de Boss Points e Drops</li>
                <li className="flex items-center gap-2"><ChevronRight size={12} className="text-emerald-500" /> Benefício gratuito para membros</li>
              </ul>
              <div className="bg-emerald-950/30 p-4 rounded border border-emerald-900/50">
                <p className="text-white font-bold text-xs uppercase mb-2">📢 Mudança de Rank</p>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  A pontuação de Bosses Encontrados conta para subida de Rank. <br/>
                  <span className="text-emerald-400 font-bold">Top Pontuador:</span> Sobe um Rank. <br/>
                  <span className="text-emerald-400 font-bold">Top Loyal:</span> Sobe para Guardian por 1 mês.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSubView === 'FIXED_SCHEDULE' && (
        <div className="space-y-8 animate-in fade-in duration-500">
          {/* Requirements Card */}
          <div className="bg-indigo-950/20 border border-indigo-900/50 p-6 rounded-xl backdrop-blur-sm shadow-xl">
            <div className="flex items-center gap-3 text-indigo-400 mb-4">
              <Award size={24} />
              <h3 className="font-bold uppercase tracking-widest text-lg">Requerimento para Horário Fixo</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-900/50 p-4 rounded border border-slate-800 space-y-2">
                <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Ranks Permitidos</p>
                <p className="text-sm text-slate-200">Líder, Challenger, Guardian</p>
              </div>
              <div className="bg-slate-900/50 p-4 rounded border border-slate-800 space-y-2">
                <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Frequência Mínima</p>
                <p className="text-sm text-slate-200">5 dias por semana</p>
              </div>
              <div className="bg-slate-900/50 p-4 rounded border border-slate-800 space-y-2">
                <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Número de Players</p>
                <p className="text-sm text-slate-200">Pelo menos 4 jogadores</p>
              </div>
              <div className="bg-slate-900/50 p-4 rounded border border-slate-800 space-y-2">
                <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Respawns Válidos</p>
                <p className="text-sm text-slate-200">Qualquer respawn <span className="text-indigo-400 font-bold">Tier 3</span></p>
                <p className="text-[10px] text-slate-500 italic">(Ver channel REQUERIMENTO RESPAWNS no TS)</p>
              </div>
            </div>
          </div>

          {/* How to Mark & Disputes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900/30 border border-slate-800 rounded-xl overflow-hidden">
              <div className="bg-slate-800/50 p-4 border-b border-slate-700 flex items-center gap-3">
                <Plus size={18} className="text-indigo-400" />
                <h3 className="font-bold text-white uppercase tracking-wider">Como Marcar</h3>
              </div>
              <div className="p-6 text-slate-300 text-sm leading-relaxed">
                <p>Para marcar um horário fixo você precisa pedir para algum <span className="text-white font-bold">líder ativo</span> da guild.</p>
              </div>
            </div>

            <div className="bg-slate-900/30 border border-slate-800 rounded-xl overflow-hidden">
              <div className="bg-slate-800/50 p-4 border-b border-slate-700 flex items-center gap-3">
                <RefreshCw size={18} className="text-indigo-400" />
                <h3 className="font-bold text-white uppercase tracking-wider">Disputa de Horário</h3>
              </div>
              <div className="p-6 space-y-4 text-slate-300 text-xs leading-relaxed">
                <p><strong className="text-indigo-400">Prioridade:</strong> O horário fica com o jogador de rank mais alto.</p>
                <p><strong className="text-indigo-400">Mesmo Rank:</strong> Será feito um revezamento de 15 em 15 dias, contado a partir do dia que o segundo time pediu o horário.</p>
                <p><strong className="text-indigo-400">Rank Superior:</strong> Caso um rank superior queira o respawn, você pode permanecer por <span className="text-white font-bold">15 dias</span> antes de ter que sair.</p>
                <div className="bg-indigo-950/30 p-3 rounded border border-indigo-900/30">
                  <p className="text-[10px] italic">Lembrando que o rank mais alto não reveza respawn com o rank mais baixo.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Obligations & Penalties */}
          <div className="bg-red-950/20 border border-red-900/50 rounded-xl overflow-hidden shadow-lg">
            <div className="bg-red-900/20 p-4 border-b border-red-900/50 flex items-center gap-3">
              <AlertCircle size={20} className="text-red-400" />
              <h3 className="font-bold text-white uppercase tracking-wider">Obrigações e Punições</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-red-900/30 rounded border border-red-800 text-red-400">
                  <Clock size={20} />
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-slate-200 font-bold uppercase tracking-wider">Aviso de Ausência</p>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Quando não for caçar no dia em que tem um horário marcado, é <span className="text-white font-bold underline">obrigado</span> a avisar no grupo da guild.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="bg-slate-950/50 p-4 rounded border border-slate-800">
                  <p className="text-[11px] text-red-400 font-bold uppercase mb-1">1ª Falha</p>
                  <p className="text-xs text-slate-400">O jogador/party receberá um <span className="text-white">Warning</span>.</p>
                </div>
                <div className="bg-slate-950/50 p-4 rounded border border-slate-800">
                  <p className="text-[11px] text-red-400 font-bold uppercase mb-1">Reincidência</p>
                  <p className="text-xs text-slate-400">Punição de <span className="text-white">15 dias</span> sem poder marcar nenhum horário fixo (válido para todos os membros da pt).</p>
                </div>
              </div>

              <div className="bg-red-950/40 p-3 rounded border border-red-900/30">
                <p className="text-[10px] text-red-200 font-bold uppercase tracking-widest text-center">Observação: O warning não reseta.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSubView === 'GUILD_BANK' && (
        <div className="space-y-8 animate-in fade-in duration-500">
          {/* Main Info Card */}
          <div className="bg-amber-950/20 border border-amber-900/50 p-6 rounded-xl backdrop-blur-sm shadow-xl">
            <div className="flex items-center gap-3 text-amber-400 mb-4">
              <Coins size={24} />
              <h3 className="font-bold uppercase tracking-widest text-lg">Contribuição Guild Bank (GB)</h3>
            </div>
            <p className="text-slate-200 text-sm leading-relaxed mb-6">
              O Guild Bank deve ser enviado até o <span className="text-amber-400 font-bold">dia 15 de cada mês</span>, nos seguintes valores:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { rank: 'Newcomer', value: '125 TC' },
                { rank: 'Beginner', value: '75 TC' },
                { rank: 'Member', value: '50 TC' },
                { rank: 'Loyal', value: '25 TC' }
              ].map((item) => (
                <div key={item.rank} className="bg-slate-900/50 p-4 rounded border border-slate-800 text-center">
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">{item.rank}</p>
                  <p className="text-xl font-bold text-white">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-amber-900/10 border border-amber-900/30 rounded-lg">
              <p className="text-xs text-slate-300 flex items-start gap-2">
                <Info size={14} className="text-amber-400 shrink-0 mt-0.5" />
                <span>* Os Players <span className="text-white font-bold">Level 1600+</span> dos ranks Member e Loyal estão isentos de pagar o GB.</span>
              </p>
            </div>
          </div>

          {/* Payment & Penalties */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900/30 border border-slate-800 rounded-xl overflow-hidden">
              <div className="bg-slate-800/50 p-4 border-b border-slate-700 flex items-center gap-3">
                <User size={18} className="text-amber-400" />
                <h3 className="font-bold text-white uppercase tracking-wider">Destinatário</h3>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-sm text-slate-300">Enviar para o personagem:</p>
                <div className="bg-slate-950 p-3 rounded border border-slate-800 text-center">
                  <span className="text-amber-400 font-mono font-bold text-lg">Missclick Bank</span>
                </div>
                <p className="text-[10px] text-slate-500 italic text-center">Obs: O char está na guild, confira antes de enviar.</p>
              </div>
            </div>

            <div className="bg-red-950/20 border border-red-900/50 rounded-xl overflow-hidden shadow-lg">
              <div className="bg-red-900/20 p-4 border-b border-red-900/50 flex items-center gap-3">
                <AlertCircle size={18} className="text-red-400" />
                <h3 className="font-bold text-white uppercase tracking-wider">Atrasos</h3>
              </div>
              <div className="p-6 text-sm text-slate-300 leading-relaxed">
                <p>Quem não pagar o GB até a data aprazada receberá:</p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-red-200">
                  <li>Respawn Block</li>
                  <li>Multa</li>
                  <li>Possível retirada da Guild</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Level Requirements */}
          <div className="bg-slate-900/30 border border-slate-800 rounded-xl overflow-hidden">
            <div className="bg-slate-800/50 p-4 border-b border-slate-700 flex items-center gap-3">
              <TrendingUp size={18} className="text-amber-400" />
              <h3 className="font-bold text-white uppercase tracking-wider">Level Mínimo por Rank</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4">
                {[
                  { rank: 'Newcomer', lvl: 'Sem Level' },
                  { rank: 'Second', lvl: '600' },
                  { rank: 'Beginner', lvl: '600' },
                  { rank: 'Member', lvl: '800' },
                  { rank: 'Loyal', lvl: '900' },
                  { rank: 'Challenger', lvl: '1400' },
                  { rank: 'Isenção GB', lvl: '1650 (Member+)' }
                ].map((item) => (
                  <div key={item.rank} className="space-y-1">
                    <p className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">{item.rank}</p>
                    <p className="text-sm text-white font-bold">{item.lvl}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSubView === 'RANK_PROMOTION' && (
        <div className="space-y-8 animate-in fade-in duration-500">
          {/* KS Promotion */}
          <div className="bg-rose-950/20 border border-rose-900/50 p-6 rounded-xl backdrop-blur-sm shadow-xl">
            <div className="flex items-center gap-3 text-rose-400 mb-4">
              <Zap size={24} />
              <h3 className="font-bold uppercase tracking-widest text-lg">Promoção por KS</h3>
            </div>
            <div className="space-y-4 text-sm text-slate-300">
              <p>Para ser promovido por KS você precisa acumular pontos no grupo de KS.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-900/50 p-4 rounded border border-slate-800">
                  <p className="text-xs text-rose-400 font-bold uppercase mb-1">Número de Promovidos</p>
                  <p className="text-xs">Sem limite. Atingiu a meta, é promovido no mês seguinte.</p>
                </div>
                <div className="bg-slate-900/50 p-4 rounded border border-slate-800">
                  <p className="text-xs text-rose-400 font-bold uppercase mb-1">Vagas Guardian</p>
                  <p className="text-xs">2 vagas por mês (requer rank Loyal). O atual Guardian também compete.</p>
                </div>
              </div>
              
              <div className="bg-rose-900/10 p-4 rounded border border-rose-900/30 space-y-3">
                <p className="font-bold text-white text-xs uppercase tracking-wider">Dúvidas Frequentes:</p>
                <div className="space-y-2 text-xs">
                  <p><strong className="text-rose-400">Como começar?</strong> Peça para Cirok ou Eder te adicionar no grupo de WhatsApp de KS.</p>
                  <p><strong className="text-rose-400">Minha pontuação?</strong> Consulte em: <a href="https://missclic-ks.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">missclic-ks.vercel.app</a></p>
                </div>
              </div>
            </div>
          </div>

          {/* XP & Referral Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900/30 border border-slate-800 rounded-xl overflow-hidden">
              <div className="bg-slate-800/50 p-4 border-b border-slate-700 flex items-center gap-3">
                <TrendingUp size={18} className="text-rose-400" />
                <h3 className="font-bold text-white uppercase tracking-wider">Promoção por XP</h3>
              </div>
              <div className="p-6 space-y-4 text-xs text-slate-300 leading-relaxed">
                <p>Ser o <span className="text-white font-bold">Top XP mensal</span> da guild no seu rank atual.</p>
                <p>Requisito: Char na guild e sob sua posse por pelo menos <span className="text-white font-bold">30 dias</span>.</p>
                <div className="bg-slate-950/50 p-3 rounded border border-slate-800">
                  <p className="text-rose-400 font-bold uppercase text-[10px] mb-1">Vagas Mensais:</p>
                  <p>1 Newcomer, 1 Beginner, 1 Member, 2 Guardians (Loyal+).</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/30 border border-slate-800 rounded-xl overflow-hidden">
              <div className="bg-slate-800/50 p-4 border-b border-slate-700 flex items-center gap-3">
                <User size={18} className="text-rose-400" />
                <h3 className="font-bold text-white uppercase tracking-wider">Promoção por Indicação</h3>
              </div>
              <div className="p-6 space-y-3 text-[11px] text-slate-300">
                <p>Aumente sua chance trazendo amigos:</p>
                <ul className="space-y-1">
                  <li className="flex justify-between border-b border-slate-800 pb-1"><span>Newcomer &gt; Beginner</span> <span className="text-white font-bold">5 indicações</span></li>
                  <li className="flex justify-between border-b border-slate-800 pb-1"><span>Beginner &gt; Member</span> <span className="text-white font-bold">8 indicações</span></li>
                  <li className="flex justify-between border-b border-slate-800 pb-1"><span>Member &gt; Loyal</span> <span className="text-white font-bold">12 indicações</span></li>
                  <li className="flex justify-between"><span>Loyal &gt; Guardian</span> <span className="text-white font-bold">3 indicações (1 mês)</span></li>
                </ul>
                <p className="text-[9px] text-slate-500 italic mt-2">* A contagem zera após subir de rank.</p>
              </div>
            </div>
          </div>

          {/* Events & Bosses */}
          <div className="bg-slate-900/30 border border-slate-800 rounded-xl overflow-hidden">
            <div className="bg-slate-800/50 p-4 border-b border-slate-700 flex items-center gap-3">
              <Target size={18} className="text-rose-400" />
              <h3 className="font-bold text-white uppercase tracking-wider">Promoção por Eventos & Bosses</h3>
            </div>
            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">Eventos</h4>
                <p className="text-xs text-slate-400">Funcionam de forma diferente para cada evento. Os elegíveis serão avisados no grupo de avisos.</p>
              </div>
              
              <div className="space-y-4 border-t border-slate-800 pt-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">Bosses Encontrados</h4>
                  <span className="text-[10px] bg-rose-600 text-white px-2 py-0.5 rounded-full font-bold">NOVO</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
                  <ul className="list-disc list-inside space-y-1">
                    <li>Top Pontuador: Sobe um Rank.</li>
                    <li>Top Loyal: Guardian por 1 mês.</li>
                  </ul>
                  <div className="bg-slate-950/50 p-3 rounded border border-slate-800">
                    <p className="text-[10px] text-slate-500 mb-1">Planilha de Pontuação:</p>
                    <a href="https://docs.google.com/spreadsheets/d/1XB7Op4peBboyYdUYMujerRokKS3XCp06CgMhLeTVo-8/edit?gid=1160625591#gid=1160625591" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline break-all text-[10px]">Ver Planilha de Bosses</a>
                  </div>
                </div>

                {/* Boss Points Table - Compact */}
                <div className="mt-4">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Tabela de Pontos por Boss:</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-[9px] text-slate-400 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                    {[
                      { n: 'Albino Dragon', p: 4 }, { n: 'Arachir the Ancient One', p: 8 }, { n: 'Arthom The Hunter', p: 4 }, { n: 'Bank Robbery', p: 13 },
                      { n: 'Barbaria', p: 5 }, { n: 'Battlemaster Zunzu', p: 6 }, { n: 'Big Boss Trolliver', p: 5 }, { n: 'Burster', p: 9 },
                      { n: 'Captain Jones', p: 7 }, { n: 'Countess Sorrow', p: 11 }, { n: 'Dharalion', p: 7 }, { n: 'Diblis the Fair', p: 6 },
                      { n: 'Dire Penguin', p: 3 }, { n: 'Dracola', p: 11 }, { n: 'Dreadful Disruptor', p: 9 }, { n: 'Dreadmaw', p: 7 },
                      { n: 'Flamecaller Zazrak', p: 6 }, { n: 'Fleabringer', p: 4 }, { n: 'Foreman Kneebiter', p: 5 }, { n: 'Furyosa', p: 15 },
                      { n: 'General Murius', p: 5 }, { n: 'Grandfather Tridian', p: 7 }, { n: 'Gravelord Oshuran', p: 8 }, { n: 'Groam', p: 5 },
                      { n: 'Grorlam', p: 7 }, { n: 'Hairman the Huge', p: 7 }, { n: 'Hatebreeder', p: 9 }, { n: 'High Templar Cobrass', p: 7 },
                      { n: 'Hirintror', p: 7 }, { n: 'Hive Outpost', p: 14 }, { n: 'Mahatheb', p: 8 }, { n: 'Man In The Cave', p: 8 },
                      { n: 'Massacre', p: 11 }, { n: 'Midnight Panthers', p: 7 }, { n: 'Mr. Punish', p: 11 }, { n: 'Ocyakao', p: 7 },
                      { n: 'Omrafir', p: 9 }, { n: 'Oodok Witchmaster', p: 4 }, { n: 'Rotworm Queen', p: 5 }, { n: 'Rukor Zad', p: 5 },
                      { n: 'Shlorg', p: 8 }, { n: 'Sir Valorcrest', p: 7 }, { n: 'Smuggler Baron Silvertoe', p: 5 }, { n: 'The Big Bad One', p: 5 },
                      { n: 'The Evil Eye', p: 5 }, { n: 'The Frog Prince', p: 6 }, { n: 'The Handmaiden', p: 11 }, { n: 'The Imperor', p: 11 },
                      { n: 'The Old Whopper', p: 5 }, { n: 'The Plasmother', p: 11 }, { n: 'The Voice Of Ruin', p: 7 }, { n: 'The Welter', p: 9 },
                      { n: 'Tyrn', p: 7 }, { n: 'Tzumrah The Dazzler', p: 9 }, { n: 'Warlord Ruzad', p: 7 }, { n: 'White Pale', p: 6 },
                      { n: 'Xenia', p: 7 }, { n: 'Yaga the Crone', p: 5 }, { n: 'Yakchal', p: 8 }, { n: 'Yetis', p: 7 },
                      { n: 'Zarabustor', p: 8 }, { n: 'Zevelon Duskbringer', p: 6 }, { n: 'Zushuka', p: 10 }, { n: 'Cublarc the Plunderer', p: 5 }
                    ].map((b) => (
                      <div key={b.n} className="flex justify-between bg-slate-950/30 p-1 rounded px-2 border border-slate-900/50">
                        <span className="truncate mr-1">{b.n}</span>
                        <span className="text-rose-400 font-bold">{b.p}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer Note */}
      <div className="flex items-center gap-4 bg-cyan-950/20 border border-cyan-900/50 p-6 rounded-xl">
        <Info className="text-cyan-400 shrink-0" size={24} />
        <p className="text-slate-400 text-xs leading-relaxed">
          <span className="text-white font-bold uppercase block mb-1">Aviso aos Membros</span>
          TODOS em situações de conflitos, evitem tomar atitudes por conta própria, sempre consultem a liderança. O bom senso deve prevalecer em todas as interações.
        </p>
      </div>
    </div>
  );
};

export default GuildRulesTab;
