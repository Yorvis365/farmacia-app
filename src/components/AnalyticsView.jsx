import { useEffect, useMemo, useState } from 'react';
import { FaChartLine, FaChartPie, FaChartBar } from 'react-icons/fa6';
import { supabase } from '../lib/supabase';
import {
  PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';

// Paleta de colores para los gráficos
const COLORS = ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe', '#eff6ff'];

export default function AnalyticsView({ medications }) {
  const [timeRange, setTimeRange] = useState('week');
  const [views, setViews] = useState([]);
  const [loadingViews, setLoadingViews] = useState(true);
  const [viewsError, setViewsError] = useState('');
  const [referenceTime, setReferenceTime] = useState(null);
  const [chartType, setChartType] = useState('pie'); // 'pie' | 'bar'

  useEffect(() => {
    let active = true;

    const fetchViews = async () => {
      const fetchedAt = new Date();
      const startDate = new Date(fetchedAt.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
      const pageSize = 1000;
      const allViews = [];
      let from = 0;

      try {
        while (true) {
          const { data, error } = await supabase
            .from('medication_views')
            .select('medication_id, created_at')
            .gte('created_at', startDate)
            .order('created_at', { ascending: false })
            .range(from, from + pageSize - 1);

          if (error) throw error;
          allViews.push(...(data ?? []));
          if (!data || data.length < pageSize) break;
          from += pageSize;
        }

        if (active) {
          setViews(allViews);
          setReferenceTime(fetchedAt.getTime());
        }
      } catch (error) {
        console.error('Error al cargar estadísticas:', error);
        if (active) setViewsError('No se pudieron cargar las estadísticas. Verifica la tabla y las políticas de Supabase.');
      } finally {
        if (active) setLoadingViews(false);
      }
    };

    fetchViews();
    return () => { active = false; };
  }, []);

  // Procesar datos
  const { topMedications, totalConsultations } = useMemo(() => {
    if (referenceTime === null) return { topMedications: [], totalConsultations: 0 };
    
    const rangeInDays = { day: 1, week: 7, month: 30 }[timeRange];
    const cutoff = referenceTime - rangeInDays * 24 * 60 * 60 * 1000;
    const counts = new Map();

    for (const view of views) {
      if (new Date(view.created_at).getTime() < cutoff) continue;
      const medicationId = String(view.medication_id);
      counts.set(medicationId, (counts.get(medicationId) ?? 0) + 1);
    }

    const sorted = [...counts.entries()]
      .map(([id, count]) => ({
        med: medications.find((medication) => String(medication.id) === id),
        count,
      }))
      .filter((item) => item.med)
      .sort((a, b) => b.count - a.count);

    const total = sorted.reduce((acc, item) => acc + item.count, 0);

    return {
      totalConsultations: total,
      topMedications: sorted.slice(0, 10), // Top 10 para el gráfico
    };
  }, [views, medications, timeRange, referenceTime]);

  // Adaptar datos para Recharts
  const chartData = topMedications.map((item, index) => ({
    name: item.med.name,
    value: item.count,
    color: COLORS[index % COLORS.length],
  }));

  // Tooltip personalizado para que se vea bien en modo oscuro
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-800 p-3 rounded-xl shadow-lg border border-gray-100 dark:border-slate-700">
          <p className="font-bold text-gray-800 dark:text-white text-sm">{payload[0].name}</p>
          <p className="text-pharma-600 dark:text-pharma-400 font-semibold text-sm">
            {payload[0].value} {payload[0].value === 1 ? 'consulta' : 'consultas'}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">
            Medicamentos más consultados
          </h1>
          <nav className="text-sm text-slate-500 dark:text-slate-400 flex gap-2">
            <span>FarmaConsulta</span><span>/</span>
            <span>Estadísticas</span><span>/</span>
            <span className="text-pharma-700 dark:text-pharma-400 font-medium">Ranking</span>
          </nav>
        </div>
      </div>

      {/* Controles superiores */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        {/* Selector de Tiempo */}
        <div className="flex bg-gray-100 dark:bg-slate-800 p-1 rounded-xl w-full md:max-w-md">
          {[
            { id: 'day', label: 'Últimas 24h' },
            { id: 'week', label: 'Últimos 7 días' },
            { id: 'month', label: 'Últimos 30 días' },
          ].map((range) => (
            <button
              key={range.id}
              type="button"
              onClick={() => setTimeRange(range.id)}
              className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                timeRange === range.id
                  ? 'bg-white dark:bg-slate-700 text-pharma-700 dark:text-pharma-300 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>

        {/* Selector de Gráfico */}
        {topMedications.length > 0 && !loadingViews && (
          <div className="flex bg-gray-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setChartType('pie')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                chartType === 'pie'
                  ? 'bg-white dark:bg-slate-700 text-pharma-700 dark:text-pharma-300 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <FaChartPie /> Torta
            </button>
            <button
              onClick={() => setChartType('bar')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                chartType === 'bar'
                  ? 'bg-white dark:bg-slate-700 text-pharma-700 dark:text-pharma-300 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <FaChartBar /> Barras
            </button>
          </div>
        )}
      </div>

      {loadingViews ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-pharma-200 border-t-pharma-600 rounded-full animate-spin" />
        </div>
      ) : viewsError ? (
        <div role="alert" className="text-center py-12 bg-red-50 dark:bg-red-500/10 rounded-2xl text-red-700 dark:text-red-400">
          {viewsError}
        </div>
      ) : topMedications.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800">
          <FaChartLine className="text-4xl text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">Aún no hay consultas registradas en este período.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Tarjetas de resumen rápido */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-gray-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-pharma-50 dark:bg-pharma-500/10 flex items-center justify-center text-pharma-600 dark:text-pharma-400">
                <FaChartLine className="text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Total consultas</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">{totalConsultations}</p>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-gray-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <span className="font-bold text-xl">1º</span>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Más consultado</p>
                <p className="text-lg font-bold text-gray-800 dark:text-white truncate">
                  {topMedications[0]?.med.name}
                </p>
              </div>
            </div>
          </div>

          {/* Contenedor del Gráfico */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 p-6">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-6">
              Top {topMedications.length} medicamentos
            </h2>
            
            <div className="w-full h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === 'pie' ? (
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={140}
                      fill="#8884d8"
                      dataKey="value"
                      stroke="none"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip content={<CustomTooltip />} />
                  </PieChart>
                ) : (
                  <BarChart
                    data={chartData}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#334155" opacity={0.2} />
                    <XAxis type="number" allowDecimals={false} stroke="#94a3b8" />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      width={130} 
                      stroke="#94a3b8"
                      tick={{ fontSize: 12, fill: 'currentColor' }}
                    />
                    <RechartsTooltip content={<CustomTooltip />} cursor={{fill: 'transparent'}} />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </>
  );
}