import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpenCheck, Mail, Lock, ArrowRight } from 'lucide-react';

const bookshelfImage = 'https://images.pexels.com/photos/17144192/pexels-photo-17144192.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';
import { Button } from '@/components/ui/Button';
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
    <div className="min-h-screen flex bg-cream-100">
      {/* Left: Brand panel — dark, editorial */}
      <div className="hidden lg:flex lg:w-1/2 bg-ink-900 items-center justify-center px-16 relative">
        <div className="max-w-md">
          <BookOpenCheck className="w-10 h-10 text-accent-400 mb-12" strokeWidth={1} />
          <h1 className="font-serif text-6xl font-light text-cream-50 leading-[1.05] tracking-tight">
            BookClub<br /><span className="italic text-accent-400">Hub</span>
          </h1>
          <p className="text-sm text-ink-400 mt-8 leading-relaxed max-w-xs">
            Plataforma de gestão para clubes de leitura — uma curadoria de encontros, leituras e descobertas literárias.
          </p>
          <div className="mt-16 pt-8 border-t border-ink-700/40">
            <p className="text-[10px] text-ink-600 tracking-widest-editorial uppercase">PostgreSQL · Flask · React</p>
          </div>
        </div>
      </div>

      <div className="relative flex-1 flex items-center justify-center overflow-hidden px-8 py-16">
        <img
          src={bookshelfImage}
          alt="Estante de livros"
          className="login-bookshelf-bg absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-cream-100/95 via-cream-100/88 to-cream-50/82" />
        <div className="absolute inset-0 bg-cream-50/10 backdrop-blur-[1px]" />
        <div className="relative z-10 w-full max-w-sm rounded-lg border border-ink-100/70 bg-cream-50/95 px-8 py-10 shadow-xl shadow-ink-900/10 backdrop-blur-sm sm:px-10">
          <div className="lg:hidden mb-12">
            <BookOpenCheck className="w-8 h-8 text-accent-500 mb-4" strokeWidth={1} />
            <h1 className="font-serif text-4xl font-light text-ink-900 tracking-tight">BookClub <span className="italic text-accent-600">Hub</span></h1>
          </div>

          <p className="text-[11px] text-ink-400 tracking-widest-editorial uppercase mb-2">Acesso</p>
          <h2 className="font-serif text-3xl font-light text-ink-900 mb-12">Entrar na sua <span className="italic">conta</span></h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2.5">
              <label className="block text-[11px] font-medium text-ink-400 tracking-wider-editorial uppercase">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-300" strokeWidth={1.5} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className={`w-full rounded-md border ${errors.email ? 'border-red-400' : 'border-ink-200/60'} bg-cream-50 pl-11 pr-4 py-3 text-sm text-ink-900 placeholder-ink-300 focus:border-accent-400 focus:outline-none focus:ring-1 focus:ring-accent-400 transition-colors duration-300`}
                />
              </div>
              {errors.email && <p className="text-xs text-red-600">{errors.email}</p>}
            </div>
            <div className="space-y-2.5">
              <label className="block text-[11px] font-medium text-ink-400 tracking-wider-editorial uppercase">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-300" strokeWidth={1.5} />
                <input
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full rounded-md border ${errors.senha ? 'border-red-400' : 'border-ink-200/60'} bg-cream-50 pl-11 pr-4 py-3 text-sm text-ink-900 placeholder-ink-300 focus:border-accent-400 focus:outline-none focus:ring-1 focus:ring-accent-400 transition-colors duration-300`}
                />
              </div>
              {errors.senha && <p className="text-xs text-red-600">{errors.senha}</p>}
            </div>
            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
              {!loading && <ArrowRight className="w-4 h-4" strokeWidth={1.5} />}
            </Button>
          </form>

          <p className="text-center text-[10px] text-ink-400 mt-12 tracking-widest-editorial uppercase">
            MVP demo — Use qualquer e-mail e senha
          </p>
        </div>
      </div>
    </div>
  );
}
