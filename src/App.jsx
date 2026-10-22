import { useEffect, useState } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { supabase } from './lib/supabase';

export default function App() {
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Tema global — se inicializa con localStorage o preferencia del sistema
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('pharma_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('pharma_theme', dark ? 'dark' : 'light');
  }, [dark]);

  useEffect(() => {
    let active = true;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!active) return;
      setSession(nextSession);
      setAuthLoading(false);
    });

    supabase.auth.getSession()
      .then(({ data, error }) => {
        if (!active) return;
        if (error) console.error('Error al recuperar la sesión:', error);
        setSession(data.session);
        setAuthLoading(false);
      })
      .catch((error) => {
        if (!active) return;
        console.error('No se pudo recuperar la sesión de Supabase:', error);
        setAuthLoading(false);
      });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error al cerrar sesión:', error);
      window.alert(`No se pudo cerrar la sesión: ${error.message}`);
    }
  };

  const user = session?.user
    ? {
        ...session.user,
        name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Usuario',
        role: 'Usuario autenticado',
      }
    : null;

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-950">
        <div className="w-10 h-10 border-4 border-pharma-200 border-t-pharma-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <Login
        onLogin={setSession}
        dark={dark}
        onToggleDark={() => setDark((v) => !v)}
      />
    );
  }

  return (
    <Dashboard
      user={user}
      onLogout={handleLogout}
      dark={dark}
      onToggleDark={() => setDark((v) => !v)}
    />
  );
}