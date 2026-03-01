import React, { useState } from 'react';
import { Mail, Lock, ChevronRight, RefreshCw, ChevronUp, User, UserPlus } from 'lucide-react';
import { supabase } from '../utils/supabaseClient';

interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [isRegister, setIsRegister] = useState(false);
  
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const toggleMode = (mode: 'LOGIN' | 'REGISTER' | 'FORGOT') => {
    setIsRegister(mode === 'REGISTER');
    setIsForgotPassword(mode === 'FORGOT');
    setError('');
    setSuccessMessage('');
    setIsLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      if (!email) throw new Error("O email é obrigatório para recuperar a senha");
      
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin,
      });

      if (resetError) throw resetError;
      
      setSuccessMessage('Email de recuperação enviado! Verifique sua caixa de entrada.');
      setIsForgotPassword(false);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Falha ao enviar email de recuperação');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isForgotPassword) return handleForgotPassword(e);
    setError('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      if (isRegister) {
        if (!name) throw new Error("O nome do personagem é obrigatório para o cadastro");
        
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name: name,
              phone: phone,
            },
          },
        });

        if (signUpError) throw signUpError;
        
        // Verifica se a sessão foi criada imediatamente (login automático)
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
            onLogin();
        } else {
            // Caso exija confirmação de email, exibe mensagem de sucesso em verde
            setSuccessMessage('Cadastro realizado! Verifique seu email para confirmar a conta antes de entrar.');
            setIsRegister(false); // Volta para a tela de login para o usuário ver a mensagem
        }

      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) throw signInError;
        onLogin();
      }
    } catch (err: any) {
      console.error(err);
      let msg = err.message || 'Authentication failed';
      
      // Traduz erros comuns do Supabase para melhor UX
      if (msg.includes('Failed to fetch')) {
         msg = 'Erro de conexão: Verifique sua internet ou se o serviço está temporariamente indisponível.';
      } else if (msg.includes('Email not confirmed')) {
         msg = 'Email pendente de confirmação. Verifique sua caixa de entrada.';
      } else if (msg.includes('Invalid login credentials')) {
         msg = 'Email ou senha incorretos.';
      } else if (msg.includes('User already registered')) {
         msg = 'Este email já está cadastrado.';
      }
      
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b1121] flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-500/5 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/5 rounded-full blur-[100px]"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        
        {/* Logo / Header */}
        <div className="text-center mb-8 animate-in slide-in-from-top-4 fade-in duration-700">
          
          {/* Symbol */}
          <div className="relative w-16 h-16 bg-[#0f172a] rounded-xl border border-cyan-800 flex flex-col items-center justify-center shadow-[0_0_30px_rgba(8,145,178,0.2)] mx-auto mb-4 group">
             <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
             <ChevronUp size={36} className="text-cyan-400 -mb-2" strokeWidth={3} />
             <span className="text-[12px] font-bold text-cyan-500 tracking-wider">MJR</span>
          </div>

          {/* Title - ONLY CLAIMED */}
          <h1 className="text-4xl font-bold text-white tracking-wider digital-font drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
            CLAIMED
          </h1>
          <div className="flex items-center justify-center gap-2 mt-2 opacity-70">
            <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-cyan-500"></div>
            <p className="text-[10px] text-cyan-400 uppercase tracking-[0.3em] font-bold">Acesso Restrito</p>
            <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-cyan-500"></div>
          </div>
        </div>

        {/* Login/Register Box */}
        <div className="bg-[#0f172a]/80 backdrop-blur-md border border-slate-800 rounded-2xl shadow-2xl p-6 md:p-8 animate-in zoom-in-95 fade-in duration-500 relative overflow-hidden">
            
            {/* Top Accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>

            {/* Tab Switcher */}
            {!isForgotPassword && (
                <div className="flex p-1 bg-[#0b1121] rounded-lg mb-6 border border-slate-800 relative">
                    <button 
                        onClick={() => toggleMode('LOGIN')}
                        className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest rounded-md transition-all duration-300 ${!isRegister ? 'bg-slate-700 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        Entrar
                    </button>
                    <button 
                        onClick={() => toggleMode('REGISTER')}
                        className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest rounded-md transition-all duration-300 ${isRegister ? 'bg-slate-700 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        Cadastrar
                    </button>
                </div>
            )}

            {isForgotPassword && (
                <div className="mb-6 text-center">
                    <h3 className="text-white font-bold uppercase tracking-widest text-sm mb-2">Recuperar Senha</h3>
                    <p className="text-slate-500 text-[10px] uppercase tracking-wider">Enviaremos um link para o seu email</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* NAME FIELD (Only for Register) */}
                {isRegister && !isForgotPassword && (
                    <div className="space-y-2 animate-in slide-in-from-left-2 fade-in duration-300">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wide ml-1">NOME DO PERSONAGEM</label>
                        <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={18} />
                            <input 
                                type="text" 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Seu nome"
                                className="w-full bg-[#0b1121] border border-slate-700 rounded-lg py-3 pl-12 pr-4 text-sm text-slate-200 placeholder-slate-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
                            />
                        </div>
                    </div>
                )}

                {/* PHONE FIELD (Only for Register) */}
                {isRegister && !isForgotPassword && (
                    <div className="space-y-2 animate-in slide-in-from-left-2 fade-in duration-300">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wide ml-1">WHATSAPP (OPCIONAL)</label>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l2.27-2.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                            </div>
                            <input 
                                type="text" 
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="DDD + Numero (Ex: 11999999999)"
                                className="w-full bg-[#0b1121] border border-slate-700 rounded-lg py-3 pl-12 pr-4 text-sm text-slate-200 placeholder-slate-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
                            />
                        </div>
                    </div>
                )}

                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wide ml-1">EMAIL</label>
                    <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={18} />
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="seu@email.com"
                            className="w-full bg-[#0b1121] border border-slate-700 rounded-lg py-3 pl-12 pr-4 text-sm text-slate-200 placeholder-slate-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
                        />
                    </div>
                </div>

                {!isForgotPassword && (
                    <div className="space-y-2">
                        <div className="flex justify-between items-center ml-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">SENHA</label>
                            <button 
                                type="button"
                                onClick={() => toggleMode('FORGOT')}
                                className="text-[10px] text-cyan-500 hover:text-cyan-400 uppercase font-bold tracking-widest transition-colors"
                            >
                                Esqueci minha senha
                            </button>
                        </div>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={18} />
                            <input 
                                type="password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-[#0b1121] border border-slate-700 rounded-lg py-3 pl-12 pr-4 text-sm text-slate-200 placeholder-slate-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
                            />
                        </div>
                    </div>
                )}

                {successMessage && (
                    <div className="p-3 rounded bg-emerald-950/30 border border-emerald-900/50 text-emerald-400 text-xs text-center font-medium animate-in slide-in-from-top-2">
                        {successMessage}
                    </div>
                )}

                {error && (
                    <div className="p-3 rounded bg-rose-950/30 border border-rose-900/50 text-rose-400 text-xs text-center font-medium animate-in slide-in-from-top-2">
                        {error}
                    </div>
                )}

                <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-lg shadow-lg shadow-cyan-900/20 hover:shadow-cyan-500/20 transition-all transform active:scale-[0.99] flex items-center justify-center gap-2 group relative overflow-hidden mt-2"
                >
                    {isLoading ? (
                        <>
                            <RefreshCw className="animate-spin" size={18} />
                            <span className="uppercase tracking-widest text-xs">Processando...</span>
                        </>
                    ) : (
                        <>
                            {isForgotPassword ? (
                                <>
                                    <span className="uppercase tracking-widest text-xs">RECUPERAR SENHA</span>
                                    <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            ) : isRegister ? (
                                <>
                                    <span className="uppercase tracking-widest text-xs">CRIAR CONTA</span>
                                    <UserPlus size={16} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            ) : (
                                <>
                                    <span className="uppercase tracking-widest text-xs">ENTRAR NO SISTEMA</span>
                                    <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </>
                    )}
                    
                    {/* Shine Effect */}
                    {!isLoading && <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent z-10"></div>}
                </button>

                {isForgotPassword && (
                    <button 
                        type="button"
                        onClick={() => toggleMode('LOGIN')}
                        className="w-full text-center text-[10px] text-slate-500 hover:text-slate-300 uppercase font-bold tracking-[0.2em] transition-colors"
                    >
                        Voltar para o Login
                    </button>
                )}

            </form>

            <div className="mt-6 text-center">
                <p className="text-[10px] text-slate-600 uppercase tracking-widest font-mono">
                    System Version 3.0.4 <span className="mx-2">•</span> Secure Access
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;