export const BADGE_STYLES = {
  'Venta libre':    'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20',
  'Receta':         'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20',
  'Adultos':        'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20',
  'Pediatría':      'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-500/10 dark:text-violet-400 dark:border-violet-500/20',
  'Embarazo':       'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20',
  'Con alimentos':  'bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-500/10 dark:text-cyan-400 dark:border-cyan-500/20',
  'Antes de comer': 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-500/10 dark:text-teal-400 dark:border-teal-500/20',
  'Crónico':        'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-500/10 dark:text-slate-300 dark:border-slate-500/20',
  'Inhalador':      'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-500/10 dark:text-sky-400 dark:border-sky-500/20',
  'Rescate':        'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20',
  'Tópico':         'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20',
  'Hospitalario':   'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200 dark:bg-fuchsia-500/10 dark:text-fuchsia-400 dark:border-fuchsia-500/20',
  'No sedante':     'bg-lime-50 text-lime-700 border-lime-200 dark:bg-lime-500/10 dark:text-lime-400 dark:border-lime-500/20',
  'Sedante':        'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20',
};

export const DEFAULT_BADGE =
  'bg-gray-100 text-gray-700 border-gray-200 dark:bg-slate-500/10 dark:text-slate-300 dark:border-slate-500/20';

/** Badges seleccionables como chips */
export const AVAILABLE_BADGES = Object.keys(BADGE_STYLES);

/**
 * Grupos de edad — se muestran como banda/ribbon sobre la tarjeta,
 * NO como badge dentro del cuerpo.
 */
export const AGE_GROUPS = {
  pediatric: {
    label: 'Uso Pediátrico',
    bg: '#facc15',   // amarillo
    color: '#78350f', // marrón oscuro para contraste
  },
  allAges: {
    label: 'Todas las Edades',
    bg: '#dc2626',   // rojo
    color: '#ffffff', // blanco
  },
};