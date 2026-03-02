import React, { useState } from 'react';
import { Lock, RefreshCw, CheckCircle } from 'lucide-react';
import { supabase } from '../utils/supabaseClient';

interface ResetPasswordPageProps {
  onComplete: () => void;
}

const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({ onComplete }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setIsLoading(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password
      });

      if (updateError) throw updateError;
      
      setSuccess(true);
      setTimeout(() => {
        onComplete();
      }, 3000);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Falha ao atualizar a senha');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b1121] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#0f172a] border border-slate-800 rounded-2xl p-8 shadow-2xl text-center">
        {success ? (
          <div className="animate-in zoom-in-95 duration-500">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/30">
              <CheckCircle size={32} className="text-emerald-500" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2 uppercase tracking-widest digital-font">Senha Atualizada</h1>
            <p className="text-slate-400 text-sm mb-6">Sua senha foi alterada com sucesso. Você será redirecionado em instantes.</p>
          </div>
        ) : (
          <>
            <div className="w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-cyan-500/30">
              <Lock size={32} className="text-cyan-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2 uppercase tracking-widest digital-font">Nova Senha</h1>
            <p className="text-slate-400 text-sm mb-8">Defina sua nova senha de acesso.</p>

            <form onSubmit={handleReset} className="space-y-4">
              <div className="space-y-2 text-left">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Nova Senha</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#0b1121] border border-slate-700 rounded-lg py-3 px-4 text-sm text-slate-200 focus:border-cyan-500 outline-none transition-all"
                  required
                />
              </div>
              <div className="space-y-2 text-left">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Confirmar Senha</label>
                <input 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#0b1121] border border-slate-700 rounded-lg py-3 px-4 text-sm text-slate-200 focus:border-cyan-500 outline-none transition-all"
                  required
                />
              </div>

              {error && (
                <div className="p-3 rounded bg-rose-950/30 border border-rose-900/50 text-rose-400 text-xs font-medium">
                  {error}
                </div>
              )}

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-700 text-white font-bold py-3.5 rounded-lg shadow-lg transition-all flex items-center justify-center gap-2 mt-4"
              >
                {isLoading ? (
                  <RefreshCw className="animate-spin" size={18} />
                ) : (
                  <span className="uppercase tracking-widest text-xs">Atualizar Senha</span>
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
