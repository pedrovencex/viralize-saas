import { loadEnv, postgrest } from "./supabase-utils.mjs";

loadEnv();

const settings = {
  id: "00000000-0000-0000-0000-000000000001",
  brand_name: "VIRALYZE",
  logo_url: null,
  hero_title: "Descubra produtos e vídeos virais antes de todo mundo.",
  hero_subtitle:
    "A VIRALYZE transforma sinais do TikTok Shop em rankings, GMV, creators e links acionáveis para você encontrar oportunidades antes do mercado.",
  primary_cta_text: "Acessar plataforma",
  primary_cta_url: "dashboard.html",
  secondary_cta_text: "Ver recursos",
  secondary_cta_url: "#recursos",
};

const sections = [
  {
    section_key: "benefits",
    title: "Inteligência viral para decisões rápidas",
    subtitle:
      "Tudo que importa em um radar visual: produto, vídeo, creator, engajamento, faturamento e próximos passos.",
    content: {
      eyebrow: "Benefícios",
      items: [
        "Encontre produtos com tração real no TikTok Shop.",
        "Veja creators com histórico de vendas e vídeos que puxam demanda.",
        "Compare GMV, views, likes e vendas sem planilhas soltas.",
      ],
    },
    order_index: 10,
    is_active: true,
  },
  {
    section_key: "how_it_works",
    title: "Como funciona",
    subtitle: "Quatro passos para transformar ruído de feed em decisão comercial.",
    content: {
      steps: [
        {
          title: "Mapeie categorias",
          description: "Escolha nichos e acompanhe rankings de produtos e vídeos em alta.",
        },
        {
          title: "Analise os sinais",
          description: "Cruze views, curtidas, GMV, vendas e creators em uma visão única.",
        },
        {
          title: "Abra links acionáveis",
          description: "Acesse vídeo, creator e produto sem perder contexto da análise.",
        },
        {
          title: "Priorize apostas",
          description: "Monte uma lista de oportunidades para testar campanhas e parcerias.",
        },
      ],
    },
    order_index: 20,
    is_active: true,
  },
  {
    section_key: "visual",
    title: "Feeds reais, leitura premium",
    subtitle:
      "A landing usa os cards já salvos no Supabase para mostrar o tipo de inteligência que a plataforma organiza.",
    content: {
      eyebrow: "TikTok Shop intelligence",
      badges: ["Cards reais", "Creators", "Produtos", "GMV"],
    },
    order_index: 30,
    is_active: true,
  },
  {
    section_key: "resources",
    title: "Recursos para operar como time grande",
    subtitle:
      "Ranking por categoria, filtros, transcrição, GMV, insights e links de produto prontos para ação.",
    content: {
      eyebrow: "Recursos",
      items: [
        "Ranking por categoria e nicho",
        "Filtros por faturamento, visualizações e engajamento",
        "Transcrições e links de vídeos",
        "Links diretos de produtos e creators",
        "Métricas históricas no Supabase",
        "Base pronta para scraping diário",
      ],
    },
    order_index: 40,
    is_active: true,
  },
  {
    section_key: "final_cta",
    title: "Construa sua vantagem antes da tendência saturar.",
    subtitle:
      "Entre no radar da VIRALYZE e acompanhe produtos, vídeos e creators com dados estruturados.",
    content: {
      cta_text: "Começar agora",
      cta_url: "dashboard.html",
    },
    order_index: 50,
    is_active: true,
  },
];

const features = [
  {
    title: "Produtos virais",
    description: "Identifique itens com demanda crescente, thumbnail forte e sinal de compra.",
    icon: "grid",
    order_index: 10,
    is_active: true,
  },
  {
    title: "Vídeos em alta",
    description: "Compare vídeos por views, likes, comentários e velocidade de tração.",
    icon: "play",
    order_index: 20,
    is_active: true,
  },
  {
    title: "Creators com potencial",
    description: "Encontre perfis que já conseguem atenção e conversão em categorias específicas.",
    icon: "user",
    order_index: 30,
    is_active: true,
  },
  {
    title: "Dados de GMV",
    description: "Veja faturamento estimado, vendas e métricas de performance por card.",
    icon: "chart",
    order_index: 40,
    is_active: true,
  },
  {
    title: "Insights acionáveis",
    description: "Transforme sinais do feed em ideias de campanha, produto e parceria.",
    icon: "spark",
    order_index: 50,
    is_active: true,
  },
];

const stats = [
  {
    label: "GMV analisado",
    value: "R$ 239 mil+",
    description: "Base inicial carregada no Supabase para demonstração real.",
    order_index: 10,
    is_active: true,
  },
  {
    label: "Vídeos rastreados",
    value: "30+",
    description: "Cards com thumbnails, métricas, links e produtos.",
    order_index: 20,
    is_active: true,
  },
  {
    label: "Creators monitorados",
    value: "29+",
    description: "Perfis organizados por categoria e performance.",
    order_index: 30,
    is_active: true,
  },
  {
    label: "Nichos mapeados",
    value: "15",
    description: "Categorias prontas para expansão diária.",
    order_index: 40,
    is_active: true,
  },
];

const testimonials = [
  {
    name: "Operador TikTok Shop",
    role: "E-commerce",
    testimonial:
      "A VIRALYZE centraliza o que antes ficava espalhado em abas, prints e planilhas. O time decide mais rápido.",
    avatar_url: null,
    is_active: true,
  },
];

const upsert = async (table, payload, conflict) => {
  const rows = Array.isArray(payload) ? payload : [payload];
  return postgrest({
    method: "POST",
    path: `${table}?on_conflict=${conflict}`,
    body: rows,
    serviceRole: true,
  });
};

const run = async () => {
  console.log("[VIRALYZE] Inserindo dados da landing no Supabase.");
  await upsert("landing_settings", settings, "id");
  await upsert("landing_sections", sections, "section_key");
  await upsert("landing_features", features, "title");
  await upsert("landing_stats", stats, "label");
  await upsert("landing_testimonials", testimonials, "name,role");

  console.log("[VIRALYZE] Landing seed concluído.");
  console.log("[VIRALYZE] Campos carregados: settings, sections, features, stats, testimonials.");
};

run().catch((error) => {
  console.error("[VIRALYZE] Erro no seed da landing:");
  console.error(error.message);
  process.exit(1);
});
