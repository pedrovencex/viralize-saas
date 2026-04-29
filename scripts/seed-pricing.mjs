import { loadEnv, postgrest } from "./supabase-utils.mjs";

loadEnv();

const plans = [
  {
    name: "Plano Mensal",
    price: 37.9,
    billing_period: "mensal",
    description: "Acesso completo ao radar VIRALYZE com cobrança mensal.",
    features: [
      "Radar de produtos e vídeos virais",
      "Creators, GMV, views e links em um só lugar",
      "Acesso às categorias monitoradas",
      "Ideal para testar a plataforma",
    ],
    checkout_url: "CHECKOUT_MENSAL_URL",
    is_highlighted: false,
    badge_text: null,
    is_active: true,
  },
  {
    name: "Plano Anual",
    price: 247.9,
    billing_period: "anual",
    description: "Economize pagando uma vez por ano e acompanhe tendências com consistência.",
    features: [
      "Tudo do plano mensal",
      "Melhor custo-benefício para operação contínua",
      "Acesso anual ao radar de oportunidades",
      "Economize pagando uma vez por ano",
    ],
    checkout_url: "CHECKOUT_ANUAL_URL",
    is_highlighted: true,
    badge_text: "Mais vendido",
    is_active: true,
  },
];

const run = async () => {
  console.log("[VIRALYZE] Inserindo planos no Supabase.");
  await postgrest({
    method: "POST",
    path: "pricing_plans?on_conflict=name",
    body: plans,
    serviceRole: true,
  });
  console.log("[VIRALYZE] Planos carregados: Plano Mensal, Plano Anual.");
};

run().catch((error) => {
  console.error("[VIRALYZE] Erro no seed de planos:");
  console.error(error.message);
  process.exit(1);
});
