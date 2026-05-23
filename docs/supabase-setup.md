# Supabase setup for Dr. Purrfect registrations

This app is a Vite React single-page app. The public form must only use the Supabase anon/publishable key in the browser. Never put the service role key in frontend code.

## 1. Create or open a Supabase project

Go to Supabase, open the project, then use SQL Editor.

## 2. Create the table and insert policy

Run:

```sql
-- paste the contents of supabase/pet_registrations.sql
```

The table is `public.pet_registrations`.

Current write path:
- public website form can `INSERT` only
- public website cannot `SELECT`, `UPDATE`, or `DELETE`
- you can view rows in Supabase Table Editor
- service role/database owner can manage everything

## 3. Add frontend environment variables

Create `.env.local` for local dev:

```bash
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_SUPABASE_PUBLISHABLE_OR_ANON_KEY
```

For production deployment, add the same variables in the host dashboard.

## 4. What to give Hermes for complete table control

Best options, safest first:

1. **Supabase project URL + anon key**
   - lets me wire/test public inserts from the website
   - does not let me alter tables

2. **Pooler database connection string** from Supabase Connect → Direct → Transaction pooler
   - lets me run SQL migrations directly
   - avoids IPv6-only direct database access from this runtime
   - can create/alter schema and verify rows
   - do not expose it in frontend code

3. **Service role key**
   - lets me use Supabase Admin APIs/server-side scripts
   - extremely powerful; never browser-safe
   - if shared, I will store it only in a local secret file, not memory or repo

For this task, the ideal handoff is:

```text
Supabase project URL: <url>
Supabase anon key: <anon key>
Supabase database connection string OR service role key: <secret>
```

## 5. Verification

After deploying env vars and table:

1. Open website.
2. Click **Register Today**.
3. Fill guardian and pet fields.
4. Submit.
5. Confirm a new row appears in Supabase → Table Editor → `pet_registrations`.

If submit fails, browser will show a visible error message in the registration modal.
