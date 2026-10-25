# Next authentication adapter

`@evenkit/auth-next` is an unpublished, opt-in adapter for Supabase SSR authentication. It has four explicit entry points:

- `/server`: per-request server clients, configuration validation, origin checks and verified identity checks. The `server-only` marker rejects client imports in Next.
- `/client`: a browser client factory with a client boundary. Load it only in provider-enabled application code.
- `/paths`: local continuation-path validation, including normalized path checks.
- `/policy`: a verified-user contract and application-owned eligibility callback.

There is no root barrel. `@evenkit/ui` and `@evenkit/tokens` do not depend on this package, Next, or Supabase. Configure only a publishable key or legacy `anon` key. Secret and service-role keys are rejected.

Read [the application guide](../../docs/auth-adapter.md) for routes, setup, policy, recovery, tests and customization. This package does not create memberships, tables or authorization policies. An authenticated identity is not automatically eligible for an application.
