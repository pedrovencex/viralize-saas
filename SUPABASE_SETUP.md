# VIRALYZE Supabase Setup

## 1. Criar o banco

1. Abra seu projeto no Supabase.
2. Vá em SQL Editor.
3. Rode o arquivo:

```sql
supabase/schema.sql
```

Esse SQL cria:

- `creators`
- `products`
- `videos`
- `metrics`

Também cria índices, foreign keys, RLS e políticas de leitura pública.

## 2. Configurar variáveis locais

Crie um arquivo `.env` baseado em `.env.example`:

```bash
SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

Para rodar seeds administrativos localmente, adicione `SUPABASE_SERVICE_ROLE_KEY` apenas no seu `.env` local. Nunca envie essa chave para GitHub, frontend ou arquivos públicos.

Depois preencha `supabase-config.js` apenas com:

```js
window.SUPABASE_URL = "https://YOUR_PROJECT_REF.supabase.co";
window.SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";
```

Nunca coloque `SUPABASE_SERVICE_ROLE_KEY` no frontend.

## 3. Testar conexão

```bash
npm run supabase:test
```

## 4. Enviar dados atuais para o Supabase

```bash
npm run supabase:seed
```

O seed usa os dados atuais do projeto e grava creators, products, videos e metrics com upsert.

## 5. Rodar localmente

```bash
npm run serve
```

Abra:

```text
http://127.0.0.1:4173
```

Se o Supabase estiver configurado e tiver dados, o feed vem do banco. Se não estiver configurado, o site usa os dados locais como fallback.
