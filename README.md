# VIRALYZE

Landing page e dashboard da VIRALYZE, um SaaS de analise de produtos, videos virais, creators e GMV para TikTok Shop.

## Rodar localmente

Este projeto e estatico. Com Node disponivel:

```bash
node scripts/serve-static.mjs
```

Acesse:

- Landing: `http://127.0.0.1:4173/`
- Dashboard: `http://127.0.0.1:4173/dashboard.html`

## Configurar Supabase no frontend

Crie um arquivo `supabase-config.js` a partir do exemplo:

```js
window.SUPABASE_URL = "https://SEU_PROJECT_REF.supabase.co";
window.SUPABASE_ANON_KEY = "SUA_SUPABASE_ANON_KEY";
```

Nao coloque `SUPABASE_SERVICE_ROLE_KEY` no frontend.

## Variaveis para scripts locais

Crie `.env` a partir de `.env.example` quando precisar rodar scripts locais.

```bash
SUPABASE_URL=
SUPABASE_ANON_KEY=
```

## Banco

As migrations estao em:

- `supabase/schema.sql`
- `supabase/landing-schema.sql`
- `supabase/pricing-schema.sql`

Os scripts de seed estao em `scripts/`.
