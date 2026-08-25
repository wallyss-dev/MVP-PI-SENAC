import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpenCheck, Mail, Lock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/hooks/useToast';
import { isValidEmail } from '@/utils/format';

export function LoginPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [email, setEmail] = useState('ana.silva@email.com');
  const [senha, setSenha] = useState('password123');
  const [errors, setErrors] = useState<{ email?: string; senha?: string }>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: typeof errors = {};
    if (!email) errs.email = 'E-mail é obrigatório';
    else if (!isValidEmail(email)) errs.email = 'E-mail inválido';
    if (!senha) errs.senha = 'Senha é obrigatória';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showToast('Login realizado com sucesso!', 'success');
      navigate('/dashboard');
    }, 600);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-100 via-amber-50 to-stone-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-600 mb-4">
            <BookOpenCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-stone-800">BookClub Hub</h1>
          <p className="text-stone-500 mt-2">Gestão de Clubes de Leitura</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-stone-200 p-8">
          <h2 className="text-xl font-semibold text-stone-800 mb-6">Entrar na sua conta</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-stone-700">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className={`w-full rounded-lg border ${errors.email ? 'border-red-400' : 'border-stone-300'} pl-10 pr-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500`}
                />
              </div>
              {errors.email && <p className="text-xs text-red-600">{errors.email}</p>}
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-stone-700">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full rounded-lg border ${errors.senha ? 'border-red-400' : 'border-stone-300'} pl-10 pr-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500`}
                />
              </div>
              {errors.senha && <p className="text-xs text-red-600">{errors.senha}</p>}
            </div>
            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </Button>
          </form>
          <p className="text-center text-xs text-stone-400 mt-6">
            MVP demo - Use qualquer e-mail e senha para entrar
          </p>
        </div>
      </div>
    </div>
  );
}
