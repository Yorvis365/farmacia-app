// src/hooks/useMedications.js
import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const normalizeCode = (value) => String(value ?? '').replace(/\D/g, '');

export function useMedications() {
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar medicamentos desde Supabase
  const fetchMedications = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from('medications')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error al cargar medicamentos:', error);
      setError(error.message);
      setLoading(false);
      return;
    }

    setMedications(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('medications').select('*').order('name', { ascending: true });
      if (!active) return;
      if (error) setError(error.message);
      else setMedications(data ?? []);
      setLoading(false);
    })();
    return () => { active = false; };
  }, []);

  const getDuplicateCodeError = (medication, excludeId = null) => {
    const systemCode = normalizeCode(medication.systemCode);
    const barCode = normalizeCode(medication.barCode);
    const duplicateSystemCode = systemCode && medications.some((item) =>
      String(item.id) !== String(excludeId) &&
      normalizeCode(item.systemCode) === systemCode
    );
    if (duplicateSystemCode) return 'Ese código del sistema ya está registrado en otro medicamento.';

    const duplicateBarCode = barCode && medications.some((item) =>
      String(item.id) !== String(excludeId) &&
      normalizeCode(item.barCode) === barCode
    );
    if (duplicateBarCode) return 'Ese código de barras ya está registrado en otro medicamento.';

    return null;
  };

  // Agregar un medicamento
  const addMedication = async (med) => {
    setError(null);
    const duplicateError = getDuplicateCodeError(med);
    if (duplicateError) {
      setError(duplicateError);
      return null;
    }

    const { data, error } = await supabase
      .from('medications')
      .insert([med])
      .select()
      .single();

    if (error) {
      console.error('Error al agregar:', error);
      setError(error.code === '23505'
        ? 'El código del sistema o el código de barras ya está registrado en otro medicamento.'
        : error.message);
      return null;
    }

    setMedications((prev) => [...prev, data]);
    return data.id;
  };

  // Actualizar un medicamento
  const updateMedication = async (id, updates) => {
    setError(null);
    const duplicateError = getDuplicateCodeError(updates, id);
    if (duplicateError) {
      setError(duplicateError);
      return null;
    }

    const { data, error } = await supabase
      .from('medications')
      .update({ ...updates, updatedAt: Date.now() })
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) {
      console.error('Error al actualizar:', error);
      setError(error.code === '23505'
        ? 'El código del sistema o el código de barras ya está registrado en otro medicamento.'
        : error.message);
      return null;
    }

    if (!data) {
      const message =
        'No se actualizó ningún medicamento. Verifica que el registro exista y que Supabase permita UPDATE mediante sus políticas RLS.';
      console.error('No se actualizó ningún medicamento:', { id });
      setError(message);
      return null;
    }

    setMedications((prev) => prev.map((m) => (m.id === id ? data : m)));
    return data;
  };

  // Eliminar un medicamento
  const removeMedication = async (id) => {
    setError(null);
    const { error } = await supabase
      .from('medications')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error al eliminar:', error);
      setError(error.message);
      return false;
    }

    setMedications((prev) => prev.filter((m) => m.id !== id));
    return true;
  };

  const recordConsultation = async (medicationId) => {
    try {
      const { error } = await supabase
        .from('medication_views')
        .insert({ medication_id: medicationId });

      if (error) throw error;
      return true;
    } catch (consultationError) {
      console.error('Error al registrar consulta:', consultationError);
      setError('No se pudo registrar esta consulta en las estadísticas.');
      return false;
    }
  };

  // Restaurar catálogo (opcional: vaciar y recargar desde un seed o desde MEDICATIONS)
  const resetCatalog = async () => {
    if (!confirm('¿Restaurar el catálogo original? Se perderán tus cambios.')) return;

    // Opción A: simplemente recargar desde la base de datos (si ya tiene el catálogo base)
    // Opción B: borrar todo y volver a insertar desde el array estático MEDICATIONS
    // Por ahora, recargamos desde la nube:
    await fetchMedications();
  };

  return {
    medications,
    loading,
    error,
    addMedication,
    updateMedication,
    removeMedication,
    resetCatalog,
    recordConsultation,
    refetch: fetchMedications,
  };
}