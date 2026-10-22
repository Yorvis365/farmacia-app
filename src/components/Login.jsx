import { useState } from 'react';
import {
  FaEnvelope,
  FaLock,
  FaMortarPestle,
  FaShieldHalved,
  FaBolt,
  FaUserCheck,
  FaArrowRight,
  FaMoon,
  FaSun,
} from 'react-icons/fa6';
import { supabase } from '../lib/supabase';

const FEATURES = [
  { icon: FaShieldHalved, title: 'Confiable', desc: 'Información validada' },
  { icon: FaBolt,         title: 'Rápido',    desc: 'Consultas en segundos' },
  { icon: FaUserCheck,    title: 'Completo',  desc: 'Miles de medicamentos' },
];

export default function Login({ onLogin, dark, onToggleDark }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState('login');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const value = email.trim();
    if (!value) return setError('Ingresa tu correo electrónico');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return setError('Correo no válido');
    if (password.length < 8) return setError('La contraseña debe tener al menos 8 caracteres');

    setError('');
    setMessage('');
    setLoading(true);

    try {
      const result = mode === 'signup'
        ? await supabase.auth.signUp({ email: value, password })
        : await supabase.auth.signInWithPassword({ email: value, password });

      if (result.error) {
        setError(result.error.message);
        return;
      }

      if (result.data.session) {
        onLogin(result.data.session);
      } else if (mode === 'signup') {
        setMessage('Cuenta creada. Revisa tu correo para confirmar la dirección antes de iniciar sesión.');
      } else {
        setError('No se pudo iniciar la sesión. Inténtalo de nuevo.');
      }
    } catch (authError) {
      console.error('Error de autenticación:', authError);
      setError(authError instanceof Error ? authError.message : 'No se pudo conectar con Supabase Auth.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4
                    bg-slate-100 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100
                    transition-colors duration-300">

      {/* Botón de tema flotante */}
      <button
        type="button"
        onClick={onToggleDark}
        aria-label="Alternar tema"
        className="fixed top-5 right-5 z-20 w-11 h-11 rounded-full
                   bg-white dark:bg-slate-800 shadow-lg border border-gray-200 dark:border-slate-700
                   flex items-center justify-center
                   text-gray-600 dark:text-gray-300
                   hover:text-pharma-600 dark:hover:text-pharma-400
                   hover:scale-105 transition-all"
      >
        {dark ? <FaSun /> : <FaMoon />}
      </button>

      <div className="flex flex-col lg:flex-row w-full max-w-5xl
                      bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl
                      border border-transparent dark:border-slate-800
                      transition-colors duration-300">

        {/* ================= PANEL IZQUIERDO ================= */}
        <aside className="hidden lg:flex lg:w-5/12 relative flex-col items-center justify-center
                          p-12 text-center text-white
                          bg-gradient-to-br from-pharma-800 via-pharma-900 to-pharma-950
                          dark:from-pharma-900 dark:via-pharma-950 dark:to-[#0c1a3d]
                          overflow-hidden">

          <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-pharma-400/10 blur-3xl" />
          <div className="absolute -bottom-20 -right-10 w-72 h-72 rounded-full bg-pharma-300/10 blur-3xl" />

          <div className="relative z-10 flex flex-col items-center">
            <div className="relative mb-8">
              <div className="w-32 h-32 rounded-full bg-pharma-500 flex items-center justify-center
                              shadow-[0_0_50px_rgba(59,130,246,0.55)] ring-8 ring-pharma-400/20">
                <FaMortarPestle className="text-white text-6xl" />
              </div>
              {/* Punto rojo pulsante */}
              <span className="absolute top-3 right-3 w-3 h-3 rounded-full bg-accent-500
                               ring-4 ring-pharma-900">
                <span className="absolute inset-0 rounded-full bg-accent-500 animate-ping opacity-75" />
              </span>
            </div>

            <h1 className="text-3xl font-bold mb-3 tracking-tight">
              Sistema de Consulta Farmacéutica
            </h1>
            <p className="text-pharma-200 text-sm mb-12 max-w-xs">
              Consulta medicamentos por nombre, principio activo o finalidad terapéutica.
            </p>

            <div className="grid grid-cols-3 gap-4 w-full">
              {FEATURES.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex flex-col items-center">
                  <Icon className="text-pharma-300 text-2xl mb-2" />
                  <h3 className="font-semibold text-sm">{title}</h3>
                  <p className="text-[10px] text-pharma-300/80 leading-tight">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* ================= PANEL DERECHO ================= */}
        <main className="w-full lg:w-7/12 p-8 md:p-14 bg-white dark:bg-slate-900 transition-colors duration-300">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">
              {mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {mode === 'login'
                ? 'Ingresa con tu cuenta de FarmaConsulta'
                : 'Regístrate para acceder al catálogo compartido'}
            </p>
          </div>

          {message && (
            <div role="status"
                 className="mb-5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10
                            border border-emerald-200 dark:border-emerald-500/20
                            text-emerald-700 dark:text-emerald-400 text-sm px-4 py-3">
              {message}
            </div>
          )}

          {error && (
            <div role="alert"
                 className="mb-5 rounded-xl bg-accent-50 dark:bg-accent-500/10
                            border border-accent-200 dark:border-accent-500/20
                            text-accent-700 dark:text-accent-400 text-sm px-4 py-3">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div>
              <label htmlFor="email" className="sr-only">Correo electrónico</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaEnvelope className="text-pharma-600 dark:text-pharma-400" />
                </span>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  autoFocus
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); setMessage(''); }}
                  placeholder="Correo electrónico"
                  className="w-full pl-11 pr-4 py-3 border rounded-xl text-sm font-medium
                             bg-white dark:bg-slate-800
                             text-gray-700 dark:text-gray-100
                             placeholder:text-gray-400 dark:placeholder:text-gray-500
                             border-gray-200 dark:border-slate-700
                             focus:outline-none focus:border-pharma-500 focus:ring-1
                             focus:ring-pharma-500 transition"
                />
              </div>
              <p className="mt-2 ml-1 text-xs text-gray-400 dark:text-gray-500">
                Usa un correo válido para tu cuenta.
              </p>
            </div>

            <div>
              <label htmlFor="password" className="sr-only">Contraseña</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaLock className="text-pharma-600 dark:text-pharma-400" />
                </span>
                <input
                  id="password"
                  type="password"
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  minLength={8}
                  required
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  placeholder="Contraseña (mínimo 8 caracteres)"
                  className="w-full pl-11 pr-4 py-3 border rounded-xl text-sm font-medium
                             bg-white dark:bg-slate-800
                             text-gray-700 dark:text-gray-100
                             placeholder:text-gray-400 dark:placeholder:text-gray-500
                             border-gray-200 dark:border-slate-700
                             focus:outline-none focus:border-pharma-500 focus:ring-1
                             focus:ring-pharma-500 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-pharma-600 hover:bg-pharma-700
                         disabled:opacity-60 disabled:cursor-not-allowed
                         text-white font-semibold py-3.5 rounded-xl transition duration-200
                         flex items-center justify-center gap-2 shadow-lg shadow-pharma-500/30"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Procesando…
                </>
              ) : (
                <>
                  {mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
                  <FaArrowRight className="text-sm" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-5">
            {mode === 'login' ? '¿Aún no tienes cuenta?' : '¿Ya tienes una cuenta?'}{' '}
            <button
              type="button"
              onClick={() => {
                setMode((current) => current === 'login' ? 'signup' : 'login');
                setError('');
                setMessage('');
              }}
              className="font-semibold text-pharma-700 dark:text-pharma-400 hover:underline"
            >
              {mode === 'login' ? 'Regístrate' : 'Inicia sesión'}
            </button>
          </p>

          <p className="text-center text-[11px] text-gray-400 dark:text-gray-500 mt-8">
            © {new Date().getFullYear()} FarmaConsulta · Sistema de consulta farmacéutica
          </p>
        </main>
      </div>

    </div>
  );
}