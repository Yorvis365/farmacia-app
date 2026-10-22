import { useMemo, useState } from 'react';
import {
  FaMagnifyingGlass, FaPlus, FaPenToSquare, FaTrash, FaXmark,
  FaBoxOpen, FaPills, FaRotateLeft,
} from 'react-icons/fa6';
import { BADGE_STYLES, DEFAULT_BADGE, AGE_GROUPS } from '../data/badgeStyles';
import { getContrastColor } from '../utils/color';

const norm = (s = '') =>
  s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

export default function ManageMedications({ medications, onEdit, onDelete, onCreate, onReset }) {
  const [query, setQuery] = useState('');
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [toast, setToast] = useState('');

  const filtered = useMemo(() => {
    const q = norm(query.trim());
    if (!q) return medications;
    return medications.filter((m) =>
      [m.name, m.activeIngredient, m.category, m.purpose, m.description]
        .map(norm).join(' ').includes(q)
    );
  }, [medications, query]);

  const handleDeleteConfirmed = () => {
    if (!confirmTarget) return;
    onDelete(confirmTarget.id);
    setToast(`"${confirmTarget.name}" eliminado del catálogo.`);
    setConfirmTarget(null);
    setTimeout(() => setToast(''), 3000);
  };

  return (
    <>
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">
            Gestionar Medicamentos
          </h1>
          <nav className="text-sm text-slate-500 dark:text-slate-400 flex gap-2">
            <span>FarmaConsulta</span><span>/</span>
            <span>Gestión</span><span>/</span>
            <span className="text-pharma-700 dark:text-pharma-400 font-medium">Catálogo</span>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onReset}
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300
                       hover:text-red-600 dark:hover:text-red-400 transition-colors px-3 py-2"
          >
            <FaRotateLeft className="text-xs" /> Restaurar
          </button>
          <button
            onClick={onCreate}
            className="inline-flex items-center gap-2 bg-pharma-600 hover:bg-pharma-700 text-white
                       text-sm font-semibold px-4 py-2 rounded-lg shadow-sm shadow-pharma-500/30 transition-colors"
          >
            <FaPlus className="text-xs" /> Nuevo medicamento
          </button>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="mb-4 flex items-center gap-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10
                        border border-emerald-200 dark:border-emerald-500/20 px-4 py-3
                        text-emerald-700 dark:text-emerald-400 text-sm font-medium">
          {toast}
        </div>
      )}

      {/* Barra de búsqueda */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 p-4 mb-4">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <FaMagnifyingGlass className="text-pharma-600 dark:text-pharma-400" />
          </span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filtrar por nombre, principio activo o categoría…"
            className="w-full pl-12 pr-10 py-3 rounded-xl border border-gray-200 dark:border-slate-700
                       bg-gray-50 dark:bg-slate-800 text-sm font-medium text-gray-800 dark:text-gray-100
                       placeholder:text-gray-400 focus:outline-none focus:border-pharma-500
                       focus:ring-2 focus:ring-pharma-500/20 transition"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
              aria-label="Limpiar"
            >
              <FaXmark />
            </button>
          )}
        </div>

        <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
          {filtered.length} de {medications.length} medicamento{medications.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Listado */}
      {filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map((med) => (
            <MedicationRow
              key={med.id}
              med={med}
              onEdit={() => onEdit(med.id)}
              onDelete={() => setConfirmTarget(med)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center
                          text-gray-400 dark:text-slate-500 text-2xl mb-4">
            <FaBoxOpen />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
            No se encontraron medicamentos
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Prueba con otro término o limpia el filtro.
          </p>
        </div>
      )}

      {/* Modal de confirmación */}
      {confirmTarget && (
        <ConfirmDeleteModal
          medication={confirmTarget}
          onConfirm={handleDeleteConfirmed}
          onCancel={() => setConfirmTarget(null)}
        />
      )}
    </>
  );
}

/* ============== Fila del listado ============ */
function MedicationRow({ med, onEdit, onDelete }) {
  const ageGroup = med.ageGroup ? AGE_GROUPS[med.ageGroup] : null;

  return (
    <div className="group bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800
                    shadow-sm hover:shadow-md hover:border-pharma-200 dark:hover:border-pharma-800
                    transition-all p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center">

      {/* Thumbnail */}
      <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0
                      bg-gradient-to-br from-pharma-50 to-pharma-100 dark:from-pharma-900/30 dark:to-pharma-800/20
                      flex items-center justify-center text-pharma-500/50 dark:text-pharma-400/40">
        {med.image ? (
          <img src={med.image} alt={med.name} className="w-full h-full object-cover" />
        ) : (
          <FaPills className="text-3xl" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start flex-wrap gap-2">
          <h3 className="font-bold text-gray-800 dark:text-white leading-tight">
            {med.name}
          </h3>
          <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md border
                           bg-pharma-50 text-pharma-700 border-pharma-200
                           dark:bg-pharma-500/10 dark:text-pharma-400 dark:border-pharma-500/20">
            {med.category}
          </span>
          {ageGroup && (
            <span
              style={{ backgroundColor: ageGroup.bg, color: ageGroup.color }}
              className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md"
            >
              {ageGroup.label}
            </span>
          )}
        </div>

        <p className="text-xs text-pharma-700 dark:text-pharma-400 font-medium mt-1 truncate">
          {med.activeIngredient}
        </p>

        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
          {med.purpose}
        </p>

        {/* Badges compactos */}
        {(med.badges?.length || med.customBadges?.length) ? (
          <div className="mt-2 flex flex-wrap gap-1">
            {med.badges.slice(0, 3).map((b) => (
              <span
                key={b}
                className={`text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded border ${
                  BADGE_STYLES[b] || DEFAULT_BADGE
                }`}
              >
                {b}
              </span>
            ))}
            {med.customBadges?.slice(0, 2).map((b, i) => (
              <span
                key={`c-${i}`}
                style={{ backgroundColor: b.color, color: getContrastColor(b.color), borderColor: b.color }}
                className="text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded border"
              >
                {b.label}
              </span>
            ))}
            {(med.badges.length + (med.customBadges?.length || 0)) > 5 && (
              <span className="text-[9px] text-gray-400 font-semibold px-1.5 py-0.5">
                +{(med.badges.length + (med.customBadges?.length || 0)) - 5}
              </span>
            )}
          </div>
        ) : null}
      </div>

      {/* Acciones */}
      <div className="flex sm:flex-col gap-2 flex-shrink-0 self-end sm:self-center">
        <button
          onClick={onEdit}
          aria-label={`Editar ${med.name}`}
          className="w-9 h-9 rounded-lg bg-pharma-50 dark:bg-pharma-500/10 text-pharma-700 dark:text-pharma-400
                     hover:bg-pharma-100 dark:hover:bg-pharma-500/20 flex items-center justify-center
                     transition-colors"
          title="Editar"
        >
          <FaPenToSquare className="text-sm" />
        </button>
        <button
          onClick={onDelete}
          aria-label={`Eliminar ${med.name}`}
          className="w-9 h-9 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400
                     hover:bg-red-100 dark:hover:bg-red-500/20 flex items-center justify-center
                     transition-colors"
          title="Eliminar"
        >
          <FaTrash className="text-sm" />
        </button>
      </div>
    </div>
  );
}

/* ============== Modal de confirmación ============ */
function ConfirmDeleteModal({ medication, onConfirm, onCancel }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-100
                   dark:border-slate-800 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center
                          text-red-600 dark:text-red-400 flex-shrink-0">
            <FaTrash className="text-lg" />
          </div>

          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">
              Eliminar medicamento
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5 leading-relaxed">
              ¿Seguro que quieres eliminar <strong className="text-gray-700 dark:text-gray-200">{medication.name}</strong> del catálogo? Esta acción no se puede deshacer.
            </p>
          </div>

          <button
            onClick={onCancel}
            aria-label="Cerrar"
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <FaXmark />
          </button>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onCancel}
            className="flex-1 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800
                       hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200
                       font-semibold py-2.5 rounded-xl text-sm transition"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-xl
                       text-sm transition shadow-lg shadow-red-500/30"
          >
            Sí, eliminar
          </button>
        </div>
      </div>
    </div>
  );
}