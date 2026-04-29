import { loadEnv, postgrest } from "./supabase-utils.mjs";

loadEnv();

const run = async () => {
  console.log("[VIRALYZE] Testando conexão com Supabase...");
  const creators = await postgrest({
    path: "creators?select=id,username&limit=1",
    serviceRole: false,
  });

  console.log("[VIRALYZE] Conexão OK.");
  console.log(`[VIRALYZE] Leitura pública OK. Registros retornados: ${creators.length}`);
};

run().catch((error) => {
  console.error("[VIRALYZE] Erro no teste Supabase:");
  console.error(error.message);
  process.exit(1);
});
