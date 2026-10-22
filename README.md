# React + Vite

## Supabase authentication and medication permissions

1. Configure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env.local`.
2. Run `supabase/migrations/20261021_authenticated_medication_writes.sql`, `supabase/migrations/20261021_unique_medication_codes.sql`, and `supabase/migrations/20261021_medication_views.sql` in the Supabase SQL Editor.
3. In Supabase, enable email/password authentication. Configure email confirmation and the allowed redirect URLs for the deployed app.
4. Register through the app. If email confirmation is enabled, confirm the address before signing in.

The app login uses Supabase Auth sessions; the previous email-only simulated login is not an authentication mechanism. Medication write policies in this migration are available only to authenticated users. Public read policies are not changed. Open registration means anyone can create an account, and each authenticated account can add, edit, or delete any medication in the shared catalog. Restrict account creation or add role-based policies before using this setup when edits must be limited to trusted staff.

The unique-code migration prevents duplicate system codes and duplicate barcodes, comparing only their digits. It stops with an error if duplicates already exist; resolve those records in the catalog before rerunning the migration.

The medication-views migration creates the consultation event table. Authenticated users can insert consultation events and read the events used for the 24-hour, 7-day, and 30-day rankings.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
