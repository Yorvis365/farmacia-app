import { useEffect, useRef, useState } from 'react';
import {
  FaCloudArrowUp, FaImage, FaXmark, FaPlus, FaFloppyDisk,
  FaArrowLeft, FaCircleCheck, FaTrash, FaTag, FaWandMagicSparkles,
  FaPalette, FaChild, FaUsers, FaCheck, FaPenToSquare,
  FaCropSimple,
} from 'react-icons/fa6';
import ImageAdjuster from './ImageAdjuster';
import { CATEGORY_GROUPS, PURPOSE_TAGS } from '../data/medications';
import { BADGE_STYLES, DEFAULT_BADGE, AVAILABLE_BADGES } from '../data/badgeStyles';
import { getContrastColor, PRESET_COLORS } from '../utils/color';
import MedicationCard from './MedicationCard';
import { supabase } from '../lib/supabase';

const initialForm = {
  name: '',
  activeIngredient: '',
  laboratory: '',
  systemCode: '',
  barCode: '',
  category: 'Analgésico',
  purpose: '',
  description: '',
  badges: [],
  customBadges: [],
  ageGroup: null,
  keywords: [],
  image: null,
};

const AGE_OPTIONS = [
  { key: 'pediatric', label: 'Uso Pediátrico',    desc: 'Apto para niños',          icon: FaChild, bg: '#facc15', fg: '#78350f' },
  { key: 'allAges',   label: 'Todas las Edades',  desc: 'Apto para cualquier edad', icon: FaUsers, bg: '#dc2626', fg: '#ffffff' },
];

/** Formatea un código a XX-XX-XXXX mientras el usuario escribe */
const formatCode = (value) => {
  const digits = String(value || '').replace(/\D/g, '').slice(0, 8);
  const parts = [];
  if (digits.length > 0) parts.push(digits.slice(0, 2));
  if (digits.length > 2) parts.push(digits.slice(2, 4));
  if (digits.length > 4) parts.push(digits.slice(4, 8));
  return parts.join('-');
};

/** Conserva solo números y limita el código de barras a 12 dígitos */
const formatBarcode = (value) =>
  String(value || '').replace(/\D/g, '').slice(0, 12);

const normalizeCode = (value) =>
  String(value ?? '').replace(/\D/g, '');

/** Valida que un código tenga los 8 dígitos completos */
const isCompleteCode = (value) =>
  String(value || '').replace(/\D/g, '').length === 8;

export default function AddMedication({
  initialMed = null,
  medications = [],
  onAdd,
  onUpdate,
  onCancel,
}) {
  const isEdit = Boolean(initialMed);

  const [form, setForm] = useState(() =>
    initialMed
      ? { ...initialForm, ...initialMed, systemCode: formatCode(initialMed.systemCode) }
      : initialForm
  );
  const [keywordInput, setKeywordInput] = useState('');
  const [customLabel, setCustomLabel] = useState('');
  const [customColor, setCustomColor] = useState(PRESET_COLORS[10]);
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [adjustingSrc, setAdjustingSrc] = useState(null);
  const fileInputRef = useRef(null);

  // Si cambia el medicamento a editar, recargamos el formulario
  useEffect(() => {
    if (initialMed) {
      setForm({
        ...initialForm,
        ...initialMed,
        systemCode: formatCode(initialMed.systemCode),
      });
    }
    setAdjustingSrc(null);
  }, [initialMed?.id]);

  /* ---------- helpers ---------- */
  const setField = (name, value) => {
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }));
  };

  const handleFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setErrors((p) => ({ ...p, image: 'Solo se permiten imágenes (JPG, PNG, WEBP)' }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors((p) => ({ ...p, image: 'La imagen no debe superar 5 MB' }));
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setErrors((p) => ({ ...p, image: '' }));
      setAdjustingSrc(e.target.result);   // ← abre el modal de ajuste
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  const toggleBadge = (b) =>
    setField('badges',
      form.badges.includes(b)
        ? form.badges.filter((x) => x !== b)
        : [...form.badges, b]
    );

  const addCustomBadge = () => {
    const label = customLabel.trim().toUpperCase();
    if (!label) return;
    if (form.customBadges.some((b) => b.label === label)) { setCustomLabel(''); return; }
    setField('customBadges', [...form.customBadges, { label, color: customColor }]);
    setCustomLabel('');
  };

  const removeCustomBadge = (label) =>
    setField('customBadges', form.customBadges.filter((b) => b.label !== label));

  const handleCustomKeyDown = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); addCustomBadge(); }
  };

  const addKeyword = (raw) => {
    const v = (raw ?? keywordInput)
      .trim().toUpperCase()
      .replace(/\s+/g, '_')
      .replace(/[^A-Z0-9_]/g, '');
    if (!v || form.keywords.includes(v)) { setKeywordInput(''); return; }
    setField('keywords', [...form.keywords, v]);
    setKeywordInput('');
  };

  const removeKeyword = (k) =>
    setField('keywords', form.keywords.filter((x) => x !== k));

  const handleKeywordKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',' || e.key === '+') {
      e.preventDefault();
      addKeyword();
    }
    if (e.key === 'Backspace' && !keywordInput && form.keywords.length) {
      removeKeyword(form.keywords[form.keywords.length - 1]);
    }
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())             e.name = 'El nombre es obligatorio';
    if (!form.activeIngredient.trim()) e.activeIngredient = 'El principio activo es obligatorio';
    if (!form.purpose.trim())          e.purpose = 'Indica la finalidad terapéutica';
    if (!form.description.trim())      e.description = 'Añade una descripción breve';

    // Solo validamos si el usuario empezó a escribir
    if (form.systemCode && !isCompleteCode(form.systemCode)) {
      e.systemCode = 'El código debe tener 8 dígitos (XX-XX-XXXX)';
    }
    if (String(form.barCode || '').replace(/\D/g, '').length > 12) {
      e.barCode = 'El código de barras debe tener máximo 12 dígitos';
    }

    const systemCode = normalizeCode(form.systemCode);
    if (systemCode && medications.some((medication) =>
      String(medication.id) !== String(initialMed?.id) &&
      normalizeCode(medication.systemCode) === systemCode
    )) {
      e.systemCode = 'Ese código del sistema ya está registrado en otro medicamento';
    }

    const barCode = normalizeCode(form.barCode);
    if (barCode && medications.some((medication) =>
      String(medication.id) !== String(initialMed?.id) &&
      normalizeCode(medication.barCode) === barCode
    )) {
      e.barCode = 'Ese código de barras ya está registrado en otro medicamento';
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!validate()) return;

      setErrors((p) => ({ ...p, general: '' }));
      setSaved(false);

      let finalImageUrl = form.image;

      // Si la imagen es un Base64, la subimos a Supabase Storage
      if (finalImageUrl && finalImageUrl.startsWith('data:image')) {
        try {
          const res = await fetch(finalImageUrl);
          const blob = await res.blob();
          const fileExt = blob.type.split('/')[1] || 'jpg';
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

          const { error: uploadError } = await supabase.storage
            .from('medication-images')
            .upload(fileName, blob, { contentType: blob.type });

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from('medication-images')
            .getPublicUrl(fileName);

          finalImageUrl = publicUrl; // Guardamos la URL en lugar del Base64
        } catch (err) {
          console.error('Error al subir imagen:', err);
          setErrors((p) => ({ ...p, general: 'Error al subir la imagen. Revisa la consola o permisos.' }));
          return;
        }
      }

      const payload = {
        name: form.name.trim(),
        activeIngredient: form.activeIngredient.trim(),
        laboratory: form.laboratory?.trim() || '',
        systemCode: formatCode(form.systemCode),
        barCode: formatBarcode(form.barCode),
        category: form.category,
        purpose: form.purpose.trim(),
        description: form.description.trim(),
        badges: form.badges,
        customBadges: form.customBadges,
        ageGroup: form.ageGroup,
        keywords: form.keywords,
        image: finalImageUrl, // Aquí va la URL de Supabase
      };

      let result;
      if (isEdit) {
        result = await onUpdate(initialMed.id, payload);
      } else {
        result = await onAdd(payload);
      }

      if (!result) {
        setErrors((p) => ({ ...p, general: 'No se pudo guardar en la base de datos.' }));
        return;
      }

      setSaved(true);
      if (!isEdit) {
        setForm(initialForm);
        setCustomLabel('');
        setCustomColor(PRESET_COLORS[10]);
        setAdjustingSrc(null);
      }
      setTimeout(() => setSaved(false), 3000);
    };

  const previewMed = {
    id: 'preview',
    name: form.name || 'Nombre del medicamento',
    activeIngredient: form.activeIngredient || 'Principio activo',
    laboratory: form.laboratory,
    systemCode: form.systemCode,
    barCode: form.barCode,
    category: form.category,
    purpose: form.purpose || 'Finalidad terapéutica',
    description: form.description || 'Descripción del medicamento…',
    badges: form.badges.length ? form.badges : ['Venta libre'],
    customBadges: form.customBadges,
    ageGroup: form.ageGroup,
    image: form.image,
  };

  return (
    <>
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-1 flex items-center gap-2">
            {isEdit && <FaPenToSquare className="text-pharma-600 dark:text-pharma-400 text-lg" />}
            {isEdit ? 'Editar Medicamento' : 'Añadir Medicamento'}
          </h1>
          <nav className="text-sm text-slate-500 dark:text-slate-400 flex gap-2">
            <span>FarmaConsulta</span><span>/</span>
            <span>Gestión</span><span>/</span>
            <span className="text-pharma-700 dark:text-pharma-400 font-medium">
              {isEdit ? 'Editar' : 'Nuevo'}
            </span>
          </nav>
        </div>
        <button
          onClick={onCancel}
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300
                     hover:text-pharma-700 dark:hover:text-pharma-400 transition-colors"
        >
          <FaArrowLeft className="text-xs" /> Volver al catálogo
        </button>
      </div>

      {saved && (
        <div className="mb-5 flex items-center gap-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10
                        border border-emerald-200 dark:border-emerald-500/20 px-4 py-3
                        text-emerald-700 dark:text-emerald-400 text-sm font-medium">
          <FaCircleCheck className="text-lg" />
          {isEdit
            ? 'Cambios guardados correctamente.'
            : 'Medicamento guardado correctamente. Ya está disponible en el catálogo.'}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="bg-white dark:bg-slate-900 rounded-2xl
                                                          shadow-sm border border-gray-100 dark:border-slate-800 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* ==== COLUMNA 1: IMAGEN ==== */}
          <div className="lg:col-span-3">
            <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Imagen del medicamento
            </label>

            {form.image ? (
              <div className="relative w-full h-64 rounded-2xl overflow-hidden border border-gray-200 dark:border-slate-700 bg-gray-50">
                <img src={form.image} alt="Vista previa" className="w-full h-full object-contain" />

                {/* Reajustar imagen */}
                <button
                  type="button"
                  onClick={() => setAdjustingSrc(form.image)}
                  aria-label="Reajustar imagen"
                  title="Reajustar"
                  className="absolute top-3 right-14 w-8 h-8 rounded-full bg-white/90 dark:bg-slate-800/90
                             flex items-center justify-center text-pharma-600 dark:text-pharma-400
                             hover:bg-pharma-50 dark:hover:bg-pharma-500/10 transition shadow-sm"
                >
                  <FaCropSimple className="text-sm" />
                </button>

                {/* Eliminar */}
                <button
                  type="button"
                  onClick={() => setField('image', null)}
                  aria-label="Quitar imagen"
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 dark:bg-slate-800/90
                             flex items-center justify-center text-red-500 hover:bg-red-50 transition shadow-sm"
                >
                  <FaTrash className="text-sm" />
                </button>
              </div>
            ) : (
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`w-full h-64 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center
                            cursor-pointer group transition-colors
                            ${dragOver
                              ? 'border-pharma-500 bg-pharma-50 dark:bg-pharma-500/10'
                              : 'border-gray-200 dark:border-slate-700 bg-gray-50/60 dark:bg-slate-800/40 hover:bg-pharma-50 hover:border-pharma-300 dark:hover:bg-pharma-500/10'}`}
              >
                <div className="w-14 h-14 bg-white dark:bg-slate-800 rounded-full shadow-sm flex items-center justify-center mb-3
                                group-hover:scale-110 transition-transform">
                  <FaCloudArrowUp className="text-pharma-600 dark:text-pharma-400 text-2xl" />
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm font-medium text-center px-4">
                  Arrastra una imagen o{' '}
                  <span className="text-pharma-700 dark:text-pharma-400 font-semibold">explora</span>
                </p>
                <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">JPG · PNG · WEBP — máx. 3 MB</p>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />

            {errors.image && <p className="mt-2 text-xs text-red-600">{errors.image}</p>}

            {!form.image && (
              <div className="flex gap-3 mt-4">
                {[0, 1].map((i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 h-24 border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-xl
                               bg-gray-50/50 dark:bg-slate-800/40 flex flex-col items-center justify-center
                               text-gray-400 dark:text-gray-500 hover:bg-pharma-50 hover:border-pharma-300
                               dark:hover:bg-pharma-500/10 transition-colors"
                  >
                    <FaImage className="mb-1.5" />
                    <span className="text-[11px] font-medium">Explorar</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ==== COLUMNA 2: FORMULARIO ==== */}
          <div className="lg:col-span-6 flex flex-col gap-5">

            <Field label="Nombre del medicamento" error={errors.name}>
              <input
                type="text"
                value={form.name || ''}
                onChange={(e) => setField('name', e.target.value)}
                placeholder="Ej: Paracetamol"
                className={inputCls(errors.name)}
              />
            </Field>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Principio activo" error={errors.activeIngredient}>
                <input
                  type="text"
                  value={form.activeIngredient || ''}
                  onChange={(e) => setField('activeIngredient', e.target.value)}
                  placeholder="Ej: Acetaminofén"
                  className={inputCls(errors.activeIngredient)}
                />
              </Field>

              <Field label="Categoría">
                <div className="relative">
                  <select
                    value={form.category}
                    onChange={(e) => setField('category', e.target.value)}
                    className={`${inputCls()} appearance-none pr-10`}
                  >
                    {CATEGORY_GROUPS.map((group) => (
                      <optgroup key={group.label} label={group.label}>
                        {group.options.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                    ▾
                  </span>
                </div>
              </Field>
            </div>

            {/* Laboratorio */}
            <Field label="Laboratorio">
              <input
                type="text"
                value={form.laboratory || ''}
                onChange={(e) => setField('laboratory', e.target.value)}
                placeholder="Ej: La Santé, Genfar, Bayer…"
                className={inputCls()}
              />
            </Field>

            {/* Códigos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Código del sistema" error={errors.systemCode}>
                <input
                  type="text"
                  inputMode="numeric"
                  value={form.systemCode || ''}
                  onChange={(e) => setField('systemCode', formatCode(e.target.value))}
                  placeholder="XX-XX-XXXX"
                  maxLength={10}
                  className={`${inputCls(errors.systemCode)} font-mono tracking-wider`}
                />
              </Field>

              <Field label="Código de barras" error={errors.barCode}>
                <input
                  type="text"
                  inputMode="numeric"
                  value={formatBarcode(form.barCode)}
                  onChange={(e) => setField('barCode', formatBarcode(e.target.value))}
                  placeholder="Hasta 12 números"
                  maxLength={12}
                  className={`${inputCls(errors.barCode)} font-mono tracking-wider`}
                />
              </Field>
            </div>

            <Field label="Finalidad terapéutica" error={errors.purpose}>
              <input
                type="text"
                value={form.purpose || ''}
                onChange={(e) => setField('purpose', e.target.value)}
                placeholder="Ej: Dolor leve a moderado y fiebre"
                className={inputCls(errors.purpose)}
              />
            </Field>

            <Field label="Descripción" error={errors.description}>
              <textarea
                rows={4}
                value={form.description || ''}
                onChange={(e) => setField('description', e.target.value)}
                placeholder="Describe brevemente el medicamento…"
                className={`${inputCls(errors.description)} resize-none`}
              />
            </Field>

            {/* Palabras clave */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Palabras clave <span className="text-xs font-normal text-gray-400">(para búsqueda por finalidad)</span>
              </label>

              <div className="w-full border border-gray-200 dark:border-slate-700 rounded-xl px-3 py-2
                              bg-white dark:bg-slate-800 flex flex-wrap gap-1.5 items-center min-h-[52px]
                              focus-within:border-pharma-500 focus-within:ring-1 focus-within:ring-pharma-500 transition">
                {form.keywords.map((k) => (
                  <span
                    key={k}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold
                               bg-pharma-50 text-pharma-700 border border-pharma-200
                               dark:bg-pharma-500/10 dark:text-pharma-400 dark:border-pharma-500/20"
                  >
                    <FaTag className="text-[8px]" /> {k}
                    <button
                      type="button"
                      onClick={() => removeKeyword(k)}
                      className="ml-0.5 hover:text-red-500 transition-colors"
                      aria-label={`Quitar ${k}`}
                    >
                      <FaXmark className="text-[10px]" />
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyDown={handleKeywordKeyDown}
                  onBlur={() => keywordInput && addKeyword()}
                  placeholder={form.keywords.length ? '' : 'DOLOR, CABEZA, FIEBRE… (Enter para agregar)'}
                  className="flex-1 min-w-[120px] outline-none bg-transparent text-sm font-medium
                             text-gray-700 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 py-1"
                />
              </div>

              <div className="mt-2 flex flex-wrap gap-1.5">
                <span className="text-[11px] text-gray-400 mr-1">Sugerencias:</span>
                {PURPOSE_TAGS.filter((t) => !form.keywords.includes(t)).slice(0, 8).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => addKeyword(t)}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold
                               bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300
                               hover:bg-pharma-50 hover:text-pharma-700 dark:hover:bg-pharma-500/10
                               dark:hover:text-pharma-400 transition-colors"
                  >
                    <FaPlus className="text-[7px]" /> {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Grupo de edad */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Grupo de edad
              </label>
              <p className="text-xs text-gray-400 mb-3">
                Se mostrará como una banda de color sobre la imagen.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {AGE_OPTIONS.map(({ key, label, desc, icon: Icon, bg, fg }) => {
                  const checked = form.ageGroup === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setField('ageGroup', checked ? null : key)}
                      className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all
                                  ${checked
                                    ? 'border-gray-800 dark:border-white shadow-md'
                                    : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-pharma-300'}`}
                    >
                      <span
                        className="mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors"
                        style={{
                          backgroundColor: checked ? bg : 'transparent',
                          borderColor: checked ? bg : undefined,
                          color: fg,
                        }}
                      >
                        {checked && <FaCheck className="text-[10px]" />}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5">
                          <Icon className="text-sm text-gray-500 dark:text-gray-400" />
                          <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{label}</p>
                        </div>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">{desc}</p>

                        {checked && (
                          <div
                            style={{ backgroundColor: bg, color: fg }}
                            className="mt-2 w-full py-1 px-2 rounded text-center text-[9px] font-extrabold
                                       uppercase tracking-[0.15em]"
                          >
                            {label}
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Badges predefinidos */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Etiquetas predefinidas
              </label>

              <div className="flex flex-wrap gap-1.5">
                {AVAILABLE_BADGES.map((b) => {
                  const active = form.badges.includes(b);
                  return (
                    <button
                      key={b}
                      type="button"
                      onClick={() => toggleBadge(b)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px]
                                  font-semibold uppercase tracking-wider border transition-all
                                  ${active
                                    ? `${BADGE_STYLES[b] || DEFAULT_BADGE} ring-1 ring-pharma-400/40`
                                    : 'bg-white dark:bg-slate-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-slate-700 hover:border-pharma-300 hover:text-pharma-700 dark:hover:text-pharma-400'}`}
                    >
                      {active && <FaCircleCheck className="text-[9px]" />}
                      {b}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Creador de badge personalizado */}
            <div className="rounded-xl border border-dashed border-gray-300 dark:border-slate-700 p-4 bg-gray-50/60 dark:bg-slate-800/40">
              <div className="flex items-center gap-2 mb-3">
                <FaPalette className="text-pharma-600 dark:text-pharma-400 text-sm" />
                <label className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Crear etiqueta personalizada
                </label>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={customLabel}
                  onChange={(e) => setCustomLabel(e.target.value)}
                  onKeyDown={handleCustomKeyDown}
                  maxLength={20}
                  placeholder="Ej: Uso veterinario"
                  className="flex-1 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2.5
                             text-sm font-medium bg-white dark:bg-slate-800
                             text-gray-700 dark:text-gray-100 placeholder:text-gray-400
                             focus:outline-none focus:border-pharma-500 focus:ring-1 focus:ring-pharma-500 transition"
                />

                <div className="flex items-center gap-2">
                  <label
                    className="relative w-12 h-11 rounded-xl border border-gray-200 dark:border-slate-700
                               overflow-hidden cursor-pointer flex-shrink-0"
                    style={{ backgroundColor: customColor }}
                  >
                    <input
                      type="color"
                      value={customColor}
                      onChange={(e) => setCustomColor(e.target.value)}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      aria-label="Elegir color"
                    />
                    <span className="absolute inset-0 flex items-center justify-center"
                          style={{ color: getContrastColor(customColor) }}>
                      <FaPalette className="text-sm" />
                    </span>
                  </label>

                  <button
                    type="button"
                    onClick={addCustomBadge}
                    disabled={!customLabel.trim()}
                    className="inline-flex items-center gap-1.5 bg-pharma-600 hover:bg-pharma-700
                               disabled:opacity-50 disabled:cursor-not-allowed
                               text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition
                               shadow-sm shadow-pharma-500/20"
                  >
                    <FaPlus className="text-xs" /> Añadir
                  </button>
                </div>
              </div>

              <div className="mt-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Paleta rápida</p>
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_COLORS.map((c) => {
                    const active = c.toLowerCase() === customColor.toLowerCase();
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setCustomColor(c)}
                        aria-label={`Color ${c}`}
                        className={`w-6 h-6 rounded-md border-2 transition-transform hover:scale-110
                                    ${active ? 'border-gray-800 dark:border-white scale-110' : 'border-white dark:border-slate-700'}`}
                        style={{ backgroundColor: c }}
                      />
                    );
                  })}
                </div>
              </div>

              {customLabel.trim() && (
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Previsualización:</span>
                  <span
                    style={{ backgroundColor: customColor, color: getContrastColor(customColor), borderColor: customColor }}
                    className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md border"
                  >
                    {customLabel.trim().toUpperCase()}
                  </span>
                </div>
              )}

              {form.customBadges.length > 0 && (
                <div className="mt-4 pt-3 border-t border-gray-200 dark:border-slate-700">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-2">
                    Personalizadas ({form.customBadges.length})
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {form.customBadges.map((b) => (
                      <span
                        key={b.label}
                        style={{ backgroundColor: b.color, color: getContrastColor(b.color), borderColor: b.color }}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase
                                   tracking-wider px-2.5 py-1 rounded-md border"
                      >
                        {b.label}
                        <button
                          type="button"
                          onClick={() => removeCustomBadge(b.label)}
                          className="ml-0.5 opacity-70 hover:opacity-100 transition-opacity"
                          aria-label={`Quitar ${b.label}`}
                        >
                          <FaXmark className="text-[10px]" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Botones */}
            <div className="flex flex-col sm:flex-row gap-3 mt-2">
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 bg-pharma-600 hover:bg-pharma-700
                           text-white font-semibold py-3 px-6 rounded-xl text-sm transition
                           shadow-lg shadow-pharma-500/30"
              >
                {isEdit ? <><FaFloppyDisk /> Guardar cambios</> : <><FaFloppyDisk /> Guardar medicamento</>}
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="inline-flex items-center justify-center gap-2 bg-white dark:bg-slate-800
                           border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700
                           text-gray-700 dark:text-gray-200 font-semibold py-3 px-6 rounded-xl text-sm transition"
              >
                Cancelar
              </button>
              {!isEdit && (
                <button
                  type="button"
                  onClick={() => {
                    setForm(initialForm);
                    setCustomLabel('');
                    setCustomColor(PRESET_COLORS[10]);
                    setKeywordInput('');
                    setAdjustingSrc(null);
                  }}
                  className="inline-flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400
                             hover:text-red-500 text-sm font-medium px-2 py-3 transition ml-auto"
                >
                  <FaTrash className="text-xs" /> Limpiar
                </button>
              )}
            </div>
          </div>

          {/* ==== COLUMNA 3: VISTA PREVIA ==== */}
          <div className="lg:col-span-3">
            <div className="flex items-center gap-2 mb-3">
              <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100">Vista previa</label>
              <FaWandMagicSparkles className="text-pharma-500 text-xs" />
            </div>

            <div className="sticky top-4">
              <MedicationCard med={previewMed} />

              {form.keywords.length > 0 && (
                <div className="mt-4 p-4 rounded-xl bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-800">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-2">
                    Palabras clave registradas
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {form.keywords.map((k) => (
                      <span key={k} className="text-[10px] font-semibold px-2 py-0.5 rounded bg-pharma-50
                                               text-pharma-700 dark:bg-pharma-500/10 dark:text-pharma-400">
                        {k}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </form>

      {/* Modal de ajuste de imagen */}
      {adjustingSrc && (
        <ImageAdjuster
          src={adjustingSrc}
          aspect={4 / 3}
          onConfirm={(cropped) => {
            setField('image', cropped);
            setAdjustingSrc(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
          }}
          onCancel={() => {
            setAdjustingSrc(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
          }}
        />
      )}
    </>
  );
}

const inputCls = (error) =>
  `w-full border rounded-xl px-4 py-3 text-sm font-medium
   bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-100
   placeholder:text-gray-400 dark:placeholder:text-gray-500
   focus:outline-none focus:ring-1 transition
   ${error
     ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
     : 'border-gray-200 dark:border-slate-700 focus:border-pharma-500 focus:ring-pharma-500'}`;

function Field({ label, error, children }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
        {label}
      </label>
      {children}
      {error && <p className="mt-1.5 ml-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}