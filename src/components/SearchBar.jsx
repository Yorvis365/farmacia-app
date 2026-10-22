import { useEffect, useRef, useState } from 'react';
import {
  FaMagnifyingGlass, FaXmark, FaChevronDown, FaCheck,
  FaPills, FaFlaskVial, FaStethoscope, FaPlus,
} from 'react-icons/fa6';
import {
  PURPOSE_TAGS,
  SEARCH_SCOPES,
} from '../data/medications';

const SCOPE_ICONS = {
  pills: FaPills,
  flask: FaFlaskVial,
  stethoscope: FaStethoscope,
};

const PLACEHOLDERS = {
  name:    'Buscar por nombre (ej: Paracetamol, Ibuprofeno…)',
  active:  'Buscar por principio activo (ej: Acetaminofén, Omeprazol…)',
  purpose: 'Buscar por finalidad (ej: DOLOR+CABEZA, TOS+GRIPE, FIEBRE…)',
};

export default function SearchBar({
  query, onQueryChange,
  category, onCategoryChange,
  scope, onScopeChange,
  categories,
  resultCount,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const currentScope = SEARCH_SCOPES.find((s) => s.id === scope) ?? SEARCH_SCOPES[0];
  const CurrentIcon = SCOPE_ICONS[currentScope.icon];

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Al cambiar de scope, limpiamos la query para evitar resultados confusos
  const handleScopeChange = (id) => {
    if (id !== scope) {
      onScopeChange(id);
      onQueryChange('');
    }
    setMenuOpen(false);
  };

  // Click en una sugerencia de finalidad → añade con "+"
  const handleTagClick = (tag) => {
    const current = query.trim();
    if (!current) onQueryChange(tag);
    else if (current.endsWith('+')) onQueryChange(current + tag);
    else if (!current.toUpperCase().split('+').includes(tag)) onQueryChange(`${current}+${tag}`);
  };

  const activeTags = query
    .toUpperCase()
    .split('+')
    .map((t) => t.trim())
    .filter(Boolean);

  return (
    <section className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 p-5 md:p-6">

      {/* Fila: input + botón de scope */}
      <div className="flex flex-col sm:flex-row gap-3">

        {/* Input */}
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
            <FaMagnifyingGlass className="text-pharma-600 dark:text-pharma-400 text-lg" />
          </span>
          <input
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder={PLACEHOLDERS[scope]}
            className="w-full pl-14 pr-12 py-3.5 rounded-xl border border-gray-200 dark:border-slate-700
                       bg-gray-50 dark:bg-slate-800 text-gray-800 dark:text-gray-100
                       placeholder:text-gray-400 dark:placeholder:text-gray-500 text-sm font-medium
                       focus:outline-none focus:border-pharma-500 focus:ring-2 focus:ring-pharma-500/20
                       focus:bg-white dark:focus:bg-slate-800 transition"
          />
          {query && (
            <button
              onClick={() => onQueryChange('')}
              aria-label="Limpiar búsqueda"
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <FaXmark />
            </button>
          )}
        </div>

        {/* Botón selector de scope */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-haspopup="listbox"
            aria-expanded={menuOpen}
            className={`flex items-center gap-2.5 px-4 py-3.5 rounded-xl border text-sm font-semibold
                        transition-colors min-w-[180px] justify-between
                        ${menuOpen
                          ? 'border-pharma-500 bg-pharma-50 dark:bg-pharma-500/10 text-pharma-700 dark:text-pharma-300'
                          : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 hover:border-pharma-400'}`}
          >
            <span className="flex items-center gap-2">
              <CurrentIcon className="text-pharma-600 dark:text-pharma-400" />
              {currentScope.label}
            </span>
            <FaChevronDown
              className={`text-xs text-gray-400 transition-transform ${menuOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {menuOpen && (
            <div
              role="listbox"
              className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-xl shadow-xl
                         border border-gray-100 dark:border-slate-700 py-1.5 z-30 overflow-hidden"
            >
              <p className="px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                Buscar por
              </p>
              {SEARCH_SCOPES.map((s) => {
                const Icon = SCOPE_ICONS[s.icon];
                const active = s.id === scope;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => handleScopeChange(s.id)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors
                                ${active
                                  ? 'bg-pharma-50 dark:bg-pharma-500/10 text-pharma-700 dark:text-pharma-300'
                                  : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700/50'}`}
                  >
                    <Icon className={`text-base ${active ? 'text-pharma-600 dark:text-pharma-400' : 'text-gray-400'}`} />
                    <div className="flex-1">
                      <p className="font-semibold leading-tight">{s.label}</p>
                      <p className="text-[11px] text-gray-400 leading-tight mt-0.5">{s.hint}</p>
                    </div>
                    {active && <FaCheck className="text-pharma-600 dark:text-pharma-400 text-xs" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Sugerencias cuando el scope es "Finalidad" */}
      {scope === 'purpose' && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 mr-1">
            Sugerencias:
          </span>
          {PURPOSE_TAGS.map((tag) => {
            const isActive = activeTags.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => handleTagClick(tag)}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold
                            border transition-colors
                            ${isActive
                              ? 'bg-pharma-600 text-white border-pharma-600'
                              : 'bg-pharma-50 dark:bg-pharma-500/10 text-pharma-700 dark:text-pharma-300 border-pharma-200 dark:border-pharma-500/20 hover:bg-pharma-100 dark:hover:bg-pharma-500/20'}`}
              >
                <FaPlus className="text-[9px]" />
                {tag}
              </button>
            );
          })}
        </div>
      )}

      {/* Chips de categorías */}
      <div className="flex flex-wrap gap-2 mt-4">
        {categories.map((cat) => {
          const active = cat === category;
          return (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors border ${
                active
                  ? 'bg-pharma-600 text-white border-pharma-600 shadow-sm shadow-pharma-500/30'
                  : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-slate-700 hover:border-pharma-400 hover:text-pharma-700 dark:hover:text-pharma-400'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Contador de resultados */}
      <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
        {resultCount === 0
          ? 'Sin resultados'
          : `${resultCount} medicamento${resultCount !== 1 ? 's' : ''} encontrado${resultCount !== 1 ? 's' : ''}`}
        {scope === 'purpose' && activeTags.length > 1 && (
          <> · filtrando por <span className="font-semibold text-pharma-700 dark:text-pharma-400">{activeTags.join(' + ')}</span></>
        )}
      </p>
    </section>
  );
}