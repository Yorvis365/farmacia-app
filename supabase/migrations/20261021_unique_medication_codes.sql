DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM public.medications
    WHERE regexp_replace(COALESCE("systemCode"::text, ''), '[^0-9]', '', 'g') <> ''
    GROUP BY regexp_replace(COALESCE("systemCode"::text, ''), '[^0-9]', '', 'g')
    HAVING COUNT(*) > 1
  ) THEN
    RAISE EXCEPTION 'Duplicate system codes exist. Resolve them before applying the unique medication code indexes.';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM public.medications
    WHERE regexp_replace(COALESCE("barCode"::text, ''), '[^0-9]', '', 'g') <> ''
    GROUP BY regexp_replace(COALESCE("barCode"::text, ''), '[^0-9]', '', 'g')
    HAVING COUNT(*) > 1
  ) THEN
    RAISE EXCEPTION 'Duplicate barcodes exist. Resolve them before applying the unique medication code indexes.';
  END IF;
END
$$;

CREATE UNIQUE INDEX IF NOT EXISTS medications_system_code_unique
  ON public.medications (
    (regexp_replace(COALESCE("systemCode"::text, ''), '[^0-9]', '', 'g'))
  )
  WHERE regexp_replace(COALESCE("systemCode"::text, ''), '[^0-9]', '', 'g') <> '';

CREATE UNIQUE INDEX IF NOT EXISTS medications_bar_code_unique
  ON public.medications (
    (regexp_replace(COALESCE("barCode"::text, ''), '[^0-9]', '', 'g'))
  )
  WHERE regexp_replace(COALESCE("barCode"::text, ''), '[^0-9]', '', 'g') <> '';
