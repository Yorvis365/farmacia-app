import { FaPills, FaFlaskVial, FaCircleCheck, FaBookmark, FaBarcode } from 'react-icons/fa6';
import { BADGE_STYLES, DEFAULT_BADGE, AGE_GROUPS } from '../data/badgeStyles';
import { getContrastColor } from '../utils/color';

const LEGACY_AGE_LABELS = ['PEDIÁTRICO', 'TODAS LAS EDADES', 'USO PEDIÁTRICO'];

export default function MedicationCard({ med, onClick }) {
  const ageGroup = med.ageGroup ? AGE_GROUPS[med.ageGroup] : null;

  // Quitamos cualquier etiqueta de edad antigua del array de badges
  const safeBadges = (med.badges ?? []).filter((b) => !LEGACY_AGE_LABELS.includes(b));

  return (
    <article
      onClick={onClick ? (event) => {
        if (!event.target.closest('button')) onClick(med.id);
      } : undefined}
      className={`group bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800
                        shadow-sm hover:shadow-xl hover:-translate-y-0.5 hover:border-pharma-200
                        dark:hover:border-pharma-800 transition-all duration-200 overflow-hidden flex flex-col
                        ${onClick ? 'cursor-pointer' : ''}`}
    >

      {/* ===== Imagen de portada ===== */}
      <div className="relative w-full aspect-[4/3] bg-gradient-to-br from-pharma-50 to-pharma-100
                      dark:from-pharma-900/30 dark:to-pharma-800/20 overflow-hidden">
        {med.image ? (
          <img
            src={med.image}
            alt={med.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-pharma-500/40 dark:text-pharma-400/30">
            <FaPills className="text-6xl" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0
                        group-hover:opacity-100 transition-opacity duration-300" />

        <button
          aria-label="Guardar"
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm
                     flex items-center justify-center text-gray-400 hover:text-pharma-600
                     dark:text-slate-400 dark:hover:text-pharma-400 shadow-sm transition-colors"
        >
          <FaBookmark className="text-sm" />
        </button>

        <span className="absolute top-3 left-3 text-[10px] font-semibold uppercase tracking-wider
                         px-2.5 py-1 rounded-full border backdrop-blur-sm
                         bg-white/90 text-pharma-700 border-pharma-200
                         dark:bg-slate-900/80 dark:text-pharma-400 dark:border-pharma-500/30">
          {med.category}
        </span>
      </div>

      {/* ===== Banda de grupo de edad ===== */}
      {ageGroup && (
        <div
          style={{ backgroundColor: ageGroup.bg, color: ageGroup.color }}
          className="w-full py-2 px-3 text-center text-[11px] font-extrabold uppercase tracking-[0.15em]
                     shadow-sm"
        >
          {ageGroup.label}
        </div>
      )}

      {/* ===== Contenido ===== */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white leading-tight">
          {med.name}
        </h3>

        <div className="flex items-center gap-1.5 mt-1 text-xs text-pharma-700 dark:text-pharma-400 font-medium">
          <FaFlaskVial className="text-[10px]" />
          <span>{med.activeIngredient}</span>
        </div>

        {/* Código del sistema */}
        {med.systemCode && (
          <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-gray-500 dark:text-gray-400">
            <FaBarcode className="text-[10px] text-gray-400 dark:text-slate-500" />
            <span className="font-mono tracking-wider">{med.systemCode}</span>
          </div>
        )}

        <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 leading-relaxed flex-1">
          {med.description}
        </p>

        <div className="mt-4 flex items-start gap-2 text-xs">
          <FaCircleCheck className="text-pharma-500 mt-0.5 flex-shrink-0" />
          <div>
            <span className="font-semibold text-gray-700 dark:text-gray-300">Finalidad: </span>
            <span className="text-gray-500 dark:text-gray-400">{med.purpose}</span>
          </div>
        </div>

        {/* ===== Badges ===== */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {safeBadges.map((b) => (
            <span
              key={b}
              className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-md border ${
                BADGE_STYLES[b] || DEFAULT_BADGE
              }`}
            >
              {b}
            </span>
          ))}

          {med.customBadges?.map((b, i) => (
            <span
              key={`custom-${i}-${b.label}`}
              style={{
                backgroundColor: b.color,
                color: getContrastColor(b.color),
                borderColor: b.color,
              }}
              className="text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-md border"            >
              {b.label}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}