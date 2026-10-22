import { useState } from 'react';
import {
  FaMortarPestle, FaHouse, FaMagnifyingGlass, FaBookmark,
  FaClockRotateLeft, FaChevronRight, FaCircleInfo,
  FaPlus, FaCapsules, FaXmark,
} from 'react-icons/fa6';

const MENU = [
  {
    id: 'principal',
    icon: FaHouse,
    label: 'Principal',
    items: [
      { id: 'search',    label: 'Consultar Medicamentos' },
      { id: 'favorites', label: 'Favoritos', disabled: true },
      { id: 'history',   label: 'Historial de búsquedas', disabled: true },
    ],
    open: true,
  },
  {
    id: 'gestion',
    icon: FaCapsules,
    label: 'Gestión de catálogo',
    items: [
      { id: 'manage', label: 'Listado de Medicamentos' },
      { id: 'add',    label: 'Agregar Medicamento' },
    ],
    open: true,
  },
  {
    id: 'recursos',
    icon: FaCircleInfo,
    label: 'Recursos',
    items: [
      { id: 'interactions', label: 'Interacciones',      disabled: true },
      { id: 'dosing',       label: 'Guía de dosis',      disabled: true },
      { id: 'analytics',    label: 'Medicamentos más consultados' },
      { id: 'about',        label: 'Acerca del sistema', disabled: true },
    ],
    open: true,
  },
];

export default function Sidebar({ open, onClose, currentPage, onNavigate }) {
  const [openMenus, setOpenMenus] = useState(
    () => new Set(MENU.filter((m) => m.open).map((m) => m.id))
  );

  const toggle = (id) =>
    setOpenMenus((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const handleNav = (itemId) => {
    if (!itemId) return;
    onNavigate?.(itemId);
    onClose?.();
  };

  return (
    <>
      {open && (
        <div onClick={onClose} className="fixed inset-0 bg-black/50 z-30 md:hidden" />
      )}

      <aside
        className={`fixed md:static inset-y-0 left-0 w-64 z-40 flex flex-col h-full flex-shrink-0
                    text-white transform transition-transform duration-300 shadow-2xl
                    bg-gradient-to-b from-pharma-900 via-pharma-950 to-[#0c1a3d]
                    ${open ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      >
        {/* Overlay decorativo */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 pointer-events-none" />

        {/* Botón cerrar mobile */}
        <button
          onClick={onClose}
          aria-label="Cerrar menú"
          className="md:hidden absolute top-4 right-4 z-20 text-gray-400 hover:text-white transition-colors"
        >
          <FaXmark />
        </button>

        {/* ====== Logo ====== */}
        <div className="h-16 flex items-center px-6 border-b border-white/10 relative z-10 flex-shrink-0">
          <div className="relative mr-3">
            <FaMortarPestle className="text-pharma-400 text-2xl" />
            {/* Punto rojo pulsante = sistema activo */}
            <span className="absolute -top-0.5 -right-1 w-2 h-2 rounded-full bg-accent-500
                             ring-2 ring-pharma-950">
              <span className="absolute inset-0 rounded-full bg-accent-500 animate-ping opacity-75" />
            </span>
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight block leading-none">FarmaConsulta</span>
            <span className="text-[10px] text-pharma-300/70 tracking-widest uppercase">Sistema</span>
          </div>
        </div>

        {/* ====== Navegación ====== */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 relative z-10">
          <p className="px-3 text-xs font-semibold text-pharma-300/60 uppercase tracking-wider mb-2 mt-2">
            Navegación
          </p>

          {MENU.map(({ id, icon: Icon, label, items }) => {
            const isOpen = openMenus.has(id);
            return (
              <div key={id}>
                <button
                  onClick={() => toggle(id)}
                  className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium
                             rounded-lg hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center">
                    <Icon className="w-6 text-center text-pharma-400" />
                    <span className="ml-2 text-gray-100">{label}</span>
                  </div>
                  <FaChevronRight
                    className={`text-xs transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`}
                  />
                </button>

                <div
                  className={`pl-11 pr-3 space-y-1 mt-1 overflow-hidden transition-all duration-300
                             ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  {items.map(({ id: itemId, label: itemLabel, disabled }) => {
                    const active = currentPage === itemId;
                    return (
                      <button
                        key={itemId}
                        disabled={disabled}
                        onClick={() => handleNav(itemId)}
                        className={`block w-full text-left py-2 text-sm transition-colors ${
                          disabled
                            ? 'text-gray-500 cursor-not-allowed'
                            : active
                              ? 'text-pharma-300 font-semibold'
                              : 'text-gray-300 hover:text-white'
                        }`}
                      >
                        {itemLabel}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          <p className="px-3 text-xs font-semibold text-pharma-300/60 uppercase tracking-wider mb-2 mt-6">
            Accesos rápidos
          </p>

          <button
            onClick={() => handleNav('add')}
            className="w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg hover:bg-white/10 transition-colors"
          >
            <FaPlus className="w-6 text-center text-pharma-400" />
            <span className="ml-2 text-gray-300">Nuevo medicamento</span>
          </button>
          <button
            onClick={() => handleNav('advanced')}
            className="w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg hover:bg-white/10 transition-colors"
          >
            <FaMagnifyingGlass className="w-6 text-center text-pharma-400" />
            <span className="ml-2 text-gray-300">Búsqueda avanzada</span>
          </button>
          <button
            disabled
            className="w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-gray-500 cursor-not-allowed"
          >
            <FaBookmark className="w-6 text-center" />
            <span className="ml-2">Guardados</span>
          </button>
          <button
            disabled
            className="w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-gray-500 cursor-not-allowed"
          >
            <FaClockRotateLeft className="w-6 text-center" />
            <span className="ml-2">Recientes</span>
          </button>
        </nav>

        {/* ====== Banner inferior ====== */}
        <div className="p-4 relative z-10 flex-shrink-0">
          <div className="bg-pharma-500/15 border border-pharma-400/30 rounded-xl p-4 text-center">
            <p className="text-sm font-semibold text-white mb-1 flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Base actualizada
            </p>
            <p className="text-xs text-pharma-200/80 mb-3 leading-snug">
              Catálogo sincronizado con la última revisión sanitaria.
            </p>
            <button className="w-full bg-pharma-500 hover:bg-pharma-400 text-white text-xs font-semibold
                               py-2 rounded-lg transition-colors">
              Ver novedades
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}