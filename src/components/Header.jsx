import { FaBars, FaMoon, FaSun, FaBell, FaCircleUser, FaRightFromBracket } from 'react-icons/fa6';

export default function Header({ user, onToggleSidebar, dark, onToggleDark, onLogout }) {
  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800
                       flex items-center justify-between px-4 md:px-6 z-10 flex-shrink-0">
      {/* ===== Izquierda ===== */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="text-gray-500 dark:text-gray-400 hover:text-pharma-600 dark:hover:text-pharma-400 md:hidden"
          aria-label="Abrir menú"
        >
          <FaBars className="text-xl" />
        </button>

        <div className="hidden sm:flex items-center gap-2 text-sm">
          <span className="font-semibold text-gray-800 dark:text-gray-100">
            Bienvenido,
          </span>
          <span className="text-pharma-700 dark:text-pharma-400 font-semibold">
            {user?.name}
          </span>
        </div>
      </div>

      {/* ===== Derecha ===== */}
      <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400">

        {/* Toggle tema */}
        <button
          onClick={onToggleDark}
          className="hover:text-pharma-600 dark:hover:text-pharma-400 transition-colors"
          aria-label="Alternar tema"
        >
          {dark ? <FaSun /> : <FaMoon />}
        </button>

        {/* Notificaciones */}
        <button className="relative hover:text-pharma-600 dark:hover:text-pharma-400 transition-colors">
          <FaBell />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-accent-500" />
          </span>
        </button>

        <div className="h-8 w-px bg-gray-200 dark:bg-slate-700" />

        {/* Avatar + info */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <FaCircleUser className="text-3xl text-pharma-600 dark:text-pharma-400" />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full
                             bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
          </div>
          <div className="hidden sm:block text-sm">
            <p className="font-semibold text-gray-800 dark:text-gray-200 leading-none">
              {user?.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {user?.role}
            </p>
          </div>
        </div>

        {/* Botón Salir con acento rojo suave */}
        <button
          onClick={onLogout}
          className="hidden sm:inline-flex items-center gap-2 text-xs font-semibold
                     text-gray-500 dark:text-gray-400
                     hover:text-accent-600 dark:hover:text-accent-400
                     hover:bg-accent-50 dark:hover:bg-accent-500/10
                     px-3 py-2 rounded-lg transition-colors"
          aria-label="Cerrar sesión"
        >
          <FaRightFromBracket className="text-xs" />
          <span>Salir</span>
        </button>
      </div>
    </header>
  );
}