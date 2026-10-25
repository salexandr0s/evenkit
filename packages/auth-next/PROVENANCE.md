# Authentication adapter provenance

The adapter and application integration were written for Evenkit. The React account-page presentation was adapted from the existing repository branch `codex/auth-pages` commits `6fc9302`, `0a93d90` and `e81afc0`; current controls, theme values, icons and package names remain authoritative.

Runtime dependencies are pinned. Notices are included in `licenses/`. The `server-only` tarball declares MIT but omits a license file; its notice is the React project MIT license distributed with the installed React package.

| Dependency | Version | License | Purpose |
| --- | --- | --- | --- |
| `@supabase/ssr` | 0.12.7 | MIT | Cookie-backed server/browser clients and PKCE |
| `@supabase/supabase-js` | 2.118.0 | MIT | Provider SDK |
| `server-only` | 0.0.1 | MIT | Next client-import rejection |
| `zod` | 4.6.7 | MIT | Configuration and request validation |
| Next (peer) | 16.4.3 | MIT | Application runtime and boundary enforcement |

Supabase's SDK brings its Auth, Functions, PostgREST, Realtime and Storage client packages. The starter only calls Auth APIs. The root integration report records the resolved dependency inventory and bundle measurements. Provider use is confined to the adapter and application; generic Vite consumers do not install it.

Implementation references: [Supabase SSR clients](https://supabase.com/docs/guides/auth/server-side/creating-a-client), [password authentication](https://supabase.com/docs/guides/auth/passwords), and [SSR advanced guide](https://supabase.com/docs/guides/auth/server-side/advanced-guide). These describe the provider contracts; no third-party example files were copied into the generic UI package.
