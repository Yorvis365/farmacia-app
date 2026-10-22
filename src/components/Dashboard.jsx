import { useMemo, useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import SearchBar from './SearchBar';
import MedicationCard from './MedicationCard';
import AddMedication from './AddMedication';
import ManageMedications from './ManageMedications';
import AnalyticsView from './AnalyticsView'; // 👈 Importamos la nueva vista
import { useMedications } from '../hooks/useMedications';
import { FaMagnifyingGlass, FaBoxOpen, FaPlus } from 'react-icons/fa6';

/* ================================================================
   Normalizador unificado
   ================================================================ */
const norm = (s = '') =>
  s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[_-]+/g, ' ')
    .trim();

/* Para códigos: quitamos TODO lo que no sea dígito. */
const normalizeCode = (s = '') => String(s).replace(/\D/g, '');

const formatSystemCode = (value) => {
  const digits = String(value || '').replace(/\D/g, '').slice(0, 8);
  const parts = [];
  if (digits.length > 0) parts.push(digits.slice(0, 2));
  if (digits.length > 2) parts.push(digits.slice(2, 4));
  if (digits.length > 4) parts.push(digits.slice(4, 8));
  return parts.join('-');
};

export default function Dashboard({ user, onLogout, dark, onToggleDark }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [page, setPage] = useState('search');
  const [editingId, setEditingId] = useState(null);

  const {
    medications,
    loading,
    error,
    addMedication,
    updateMedication,
    removeMedication,
    resetCatalog,
    recordConsultation,
  } = useMedications();

  const today = useMemo(
    () =>
      new Date().toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
    []
  );

  const handleNavigate = (target) => {
    if (target === 'edit') return;
    setEditingId(null);
    setPage(target);
  };

  return (
    <div className="h-screen flex overflow-hidden bg-slate-50 dark:bg-slate-950
                    font-sans text-slate-800 dark:text-slate-200 transition-colors duration-300">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currentPage={page}
        onNavigate={handleNavigate}
      />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header
          user={user}
          onToggleSidebar={() => setSidebarOpen((v) => !v)}
          dark={dark}
          onToggleDark={onToggleDark}
          onLogout={onLogout}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {/* Mensaje de error global (si falla Supabase) */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 rounded-xl text-sm font-medium flex items-center gap-2">
              <span className="font-bold">Error de conexión:</span> {error}
            </div>
          )}

          {/* Spinner de carga mientras trae los datos de Supabase */}
          {loading && (page === 'search' || page === 'advanced') ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
              <div className="w-10 h-10 border-4 border-pharma-200 border-t-pharma-600 rounded-full animate-spin mb-4"></div>
              <p className="text-sm font-medium">Cargando catálogo desde el servidor...</p>
            </div>
          ) : (
            <>
              {page === 'search' && (
                <SearchView
                  medications={medications}
                  today={today}
                  onNavigate={setPage}
                  onConsult={recordConsultation}
                />
              )}

              {page === 'advanced' && (
                <AdvancedSearchView
                  medications={medications}
                  onNavigate={setPage}
                  onConsult={recordConsultation}
                />
              )}

              {page === 'analytics' && (
                <AnalyticsView medications={medications} />
              )}

              {page === 'add' && (
                <AddMedication
                  medications={medications}
                  onAdd={async (med) => {
                    const newId = await addMedication(med);
                    if (newId) setPage('manage');
                    return newId;
                  }}
                  onCancel={() => setPage('search')}
                />
              )}

              {page === 'manage' && (
                <ManageMedications
                  medications={medications}
                  onCreate={() => setPage('add')}
                  onEdit={(id) => {
                    setEditingId(id);
                    setPage('edit');
                  }}
                  onDelete={async (id) => await removeMedication(id)}
                  onReset={resetCatalog}
                />
              )}

              {page === 'edit' && (
                <AddMedication
                  initialMed={medications.find((m) => m.id === editingId) || null}
                  medications={medications}
                  onUpdate={async (id, updates) => {
                    const updated = await updateMedication(id, updates);
                    if (updated) setPage('manage');
                    return updated;
                  }}
                  onCancel={() => setPage('manage')}
                />
              )}
            </>
          )}

          <footer className="mt-10 pt-4 border-t border-gray-200 dark:border-slate-800
                             text-xs text-gray-500 dark:text-slate-500 flex flex-col sm:flex-row gap-2 justify-between">
            <p>© {new Date().getFullYear()} FarmaConsulta · Sistema de consulta farmacéutica</p>
            <p>Información orientativa — no reemplaza el criterio médico</p>
          </footer>
        </main>
      </div>
    </div>
  );
}

/* =============================================================== */
/* ============ Vista de búsqueda (catálogo) ===================== */
/* =============================================================== */

function SearchView({ medications, today, onNavigate, onConsult }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Todas');
  const [scope, setScope] = useState('name');
  
  const [showAll, setShowAll] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);

  const categories = useMemo(
    () => [
      'Todas',
      ...new Set(
        medications
          .map((med) => med.category?.trim())
          .filter(Boolean)
          .sort((a, b) => a.localeCompare(b, 'es'))
      ),
    ],
    [medications]
  );

  const filtered = useMemo(() => {
    return medications.filter((m) => {
      const matchesCategory = category === 'Todas' || m.category === category;
      if (!matchesCategory) return false;

      const q = norm(query);
      const codeQ = normalizeCode(query);

      if (!q && !codeQ) return true;

      const keywords = (m.keywords ?? []).map(norm);
      const matchesKeyword = q ? keywords.some((k) => k.includes(q)) : false;

      const matchesCode =
        codeQ.length > 0 &&
        (
          normalizeCode(m.systemCode).includes(codeQ) ||
          normalizeCode(m.barCode).includes(codeQ)
        );

      if (codeQ && !q.replace(/\d/g, '').trim()) {
        return matchesCode;
      }

      if (scope === 'name') {
        return norm(m.name).includes(q) || matchesKeyword || matchesCode;
      }

      if (scope === 'active') {
        return norm(m.activeIngredient).includes(q) || matchesKeyword || matchesCode;
      }

      if (scope === 'purpose') {
        const terms = q.split(/[+,\s]+/).filter(Boolean);
        if (!terms.length) return matchesCode;
        const haystack = [
          ...keywords,
          norm(m.purpose),
          norm(m.category),
          norm(m.description),
        ].join(' ');
        return terms.every((t) => haystack.includes(t)) || matchesCode;
      }

      return true;
    });
  }, [medications, query, category, scope]);

  const isSearching = query.trim().length > 0 || category !== 'Todas';
  const shouldShowGrid = isSearching || showAll;

  const handleShowAll = () => {
    setIsRevealing(true);
    setTimeout(() => {
      setShowAll(true);
      setIsRevealing(false);
    }, 1000);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">
            Consulta de Medicamentos
          </h1>
          <nav className="text-sm text-slate-500 dark:text-slate-400 flex gap-2">
            <span>FarmaConsulta</span>
            <span>/</span>
            <span>Catálogo</span>
            <span>/</span>
            <span className="text-pharma-700 dark:text-pharma-400 font-medium">Búsqueda</span>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('add')}
            className="inline-flex items-center gap-2 bg-pharma-600 hover:bg-pharma-700 text-white
                       text-sm font-semibold px-4 py-2 rounded-lg shadow-sm shadow-pharma-500/30 transition-colors"
          >
            <FaPlus className="text-xs" /> Agregar medicamento
          </button>

          <div className="bg-white dark:bg-slate-900 px-4 py-2 rounded-lg border border-gray-200
                          dark:border-slate-800 text-sm font-medium text-pharma-700 dark:text-pharma-400
                          shadow-sm flex items-center gap-2">
            <FaMagnifyingGlass className="text-xs" /> Hoy: <span>{today}</span>
          </div>
        </div>
      </div>

      <SearchBar
        query={query}
        onQueryChange={setQuery}
        category={category}
        onCategoryChange={setCategory}
        scope={scope}
        onScopeChange={setScope}
        categories={categories}
        resultCount={filtered.length}
      />

      {shouldShowGrid ? (
        filtered.length > 0 ? (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
            {filtered.map((med) => (
              <MedicationCard key={med.id} med={med} onClick={onConsult} />
            ))}
          </div>
        ) : (
          <div className="mt-10 flex flex-col items-center justify-center text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center
                            text-gray-400 dark:text-slate-500 text-2xl mb-4">
              <FaBoxOpen />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
              No se encontraron medicamentos
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-md">
              Estás buscando en{' '}
              <span className="font-semibold text-pharma-700 dark:text-pharma-400">
                {scope === 'name'
                  ? 'Nombre'
                  : scope === 'active'
                    ? 'Principio activo'
                    : 'Finalidad'}
              </span>
              . Prueba con otro término o cambia el modo de búsqueda.
            </p>
            <button
              onClick={() => {
                setQuery('');
                setCategory('Todas');
                setScope('name');
              }}
              className="mt-4 text-sm font-semibold text-pharma-700 dark:text-pharma-400 hover:underline"
            >
              Limpiar filtros
            </button>
          </div>
        )
      ) : (
        <div className="mt-10 flex flex-col items-center justify-center text-center py-20 animate-in fade-in duration-500">
          {isRevealing ? (
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-pharma-200 border-t-pharma-600 rounded-full animate-spin mb-4"></div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Preparando catálogo...</p>
            </div>
          ) : (
            <>
              <div className="w-20 h-20 rounded-2xl bg-pharma-50 dark:bg-pharma-500/10 flex items-center justify-center text-pharma-600 dark:text-pharma-400 mb-6 shadow-sm">
                <FaBoxOpen className="text-4xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                Catálogo listo para explorar
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-md leading-relaxed">
                Para optimizar el rendimiento, los medicamentos no se cargan todos de golpe.
                Usa el buscador superior para encontrar lo que necesitas al instante, o explora todo el catálogo.
              </p>
              <button
                onClick={handleShowAll}
                className="inline-flex items-center gap-2 bg-pharma-600 hover:bg-pharma-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-pharma-500/30 transition-all hover:-translate-y-0.5"
              >
                <FaBoxOpen /> Mostrar todo el catálogo
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}

/* =============================================================== */
/* ============ Vista de Búsqueda Avanzada ======================= */
/* =============================================================== */

function AdvancedSearchView({ medications, onNavigate, onConsult }) {
  const [systemCode, setSystemCode] = useState('');
  const [barCode, setBarCode] = useState('');

  const filtered = useMemo(() => {
    return medications.filter((m) => {
      const qSystem = normalizeCode(systemCode);
      const qBar = normalizeCode(barCode);

      if (!qSystem && !qBar) {
        return false;
      }

      const matchesSystem = qSystem ? normalizeCode(m.systemCode).includes(qSystem) : false;
      const matchesBar = qBar ? normalizeCode(m.barCode).includes(qBar) : false;

      if (qSystem && qBar) return matchesSystem && matchesBar;
      return matchesSystem || matchesBar;
    });
  }, [medications, systemCode, barCode]);

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">
            Búsqueda Avanzada
          </h1>
          <nav className="text-sm text-slate-500 dark:text-slate-400 flex gap-2">
            <span>FarmaConsulta</span>
            <span>/</span>
            <span>Herramientas</span>
            <span>/</span>
            <span className="text-pharma-700 dark:text-pharma-400 font-medium">Códigos</span>
          </nav>
        </div>
        
        <button
          onClick={() => onNavigate('search')}
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300
                     hover:text-pharma-700 dark:hover:text-pharma-400 transition-colors"
        >
          Volver al catálogo
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 p-6 mb-6">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Puedes buscar un medicamento escaneando o ingresando su código de sistema o su código de barras.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Código del sistema
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaMagnifyingGlass className="text-gray-400" />
              </span>
              <input
                type="text"
                inputMode="numeric"
                value={systemCode}
                onChange={(e) => setSystemCode(formatSystemCode(e.target.value))}
                placeholder="Ej: 12-34-5678 (puedes escribir 12345678)"
                maxLength={10}
                className="w-full pl-11 pr-4 py-3 border border-gray-200 dark:border-slate-700 
                           rounded-xl text-sm font-medium font-mono bg-gray-50 dark:bg-slate-800 
                           text-gray-700 dark:text-gray-100 placeholder:text-gray-400 
                           focus:outline-none focus:border-pharma-500 focus:ring-1 
                           focus:ring-pharma-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Código de barras
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaMagnifyingGlass className="text-gray-400" />
              </span>
              <input
                type="text"
                inputMode="numeric"
                value={barCode}
                onChange={(e) => setBarCode(e.target.value)}
                placeholder="Ej: 770123456789"
                className="w-full pl-11 pr-4 py-3 border border-gray-200 dark:border-slate-700 
                           rounded-xl text-sm font-medium font-mono bg-gray-50 dark:bg-slate-800 
                           text-gray-700 dark:text-gray-100 placeholder:text-gray-400 
                           focus:outline-none focus:border-pharma-500 focus:ring-1 
                           focus:ring-pharma-500 transition"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          Resultados ({filtered.length})
        </h2>
        {(systemCode || barCode) && (
          <button
            onClick={() => { setSystemCode(''); setBarCode(''); }}
            className="text-sm font-semibold text-pharma-700 dark:text-pharma-400 hover:underline"
          >
            Limpiar búsqueda
          </button>
        )}
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
          {filtered.map((med) => (
            <MedicationCard key={med.id} med={med} onClick={onConsult} />
          ))}
        </div>
      ) : (
        <div className="mt-10 flex flex-col items-center justify-center text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center
                          text-gray-400 dark:text-slate-500 text-2xl mb-4">
            <FaBoxOpen />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
            {systemCode || barCode
              ? 'No se encontraron medicamentos'
              : 'Ingresa un código para buscar'}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-md">
            {systemCode || barCode
              ? 'No hay medicamentos que coincidan con los códigos ingresados. Verifica los dígitos y vuelve a intentarlo.'
              : 'Escribe un código del sistema o un código de barras para mostrar coincidencias.'}
          </p>
        </div>
      )}
    </>
  );
}