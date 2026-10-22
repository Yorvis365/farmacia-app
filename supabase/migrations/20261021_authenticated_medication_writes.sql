ALTER TABLE public.medications ENABLE ROW LEVEL SECURITY;
GRANT INSERT, UPDATE, DELETE ON TABLE public.medications TO authenticated;

DO $$
DECLARE
  existing_policy RECORD;
  policy_roles TEXT;
  select_policy_name TEXT;
BEGIN
  FOR existing_policy IN
    SELECT policyname, roles, qual
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'medications'
      AND cmd = 'ALL'
      AND ('anon' = ANY(roles) OR 'public' = ANY(roles))
  LOOP
    SELECT string_agg(
      CASE
        WHEN role_name = 'public' THEN 'PUBLIC'
        ELSE format('%I', role_name)
      END,
      ', '
    )
    INTO policy_roles
    FROM unnest(existing_policy.roles) AS policy_role(role_name);

    select_policy_name := existing_policy.policyname || '_select';
    EXECUTE format(
      'DROP POLICY %I ON public.medications',
      existing_policy.policyname
    );
    EXECUTE format(
      'DROP POLICY IF EXISTS %I ON public.medications',
      select_policy_name
    );
    EXECUTE format(
      'CREATE POLICY %I ON public.medications FOR SELECT TO %s USING (%s)',
      select_policy_name,
      policy_roles,
      COALESCE(existing_policy.qual, 'true')
    );
  END LOOP;

  FOR existing_policy IN
    SELECT policyname
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'medications'
      AND cmd IN ('INSERT', 'UPDATE', 'DELETE')
      AND ('anon' = ANY(roles) OR 'public' = ANY(roles))
  LOOP
    EXECUTE format(
      'DROP POLICY %I ON public.medications',
      existing_policy.policyname
    );
  END LOOP;
END
$$;

DROP POLICY IF EXISTS medications_authenticated_insert ON public.medications;
CREATE POLICY medications_authenticated_insert
  ON public.medications
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS medications_authenticated_update ON public.medications;
CREATE POLICY medications_authenticated_update
  ON public.medications
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS medications_authenticated_delete ON public.medications;
CREATE POLICY medications_authenticated_delete
  ON public.medications
  FOR DELETE
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS authenticated_upload_medication_images ON storage.objects;
CREATE POLICY authenticated_upload_medication_images
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'medication-images');
