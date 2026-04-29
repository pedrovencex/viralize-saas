(function () {
  const fallback = {
    settings: {
      brand_name: "VIRALYZE",
      hero_title: "Descubra produtos e vídeos virais antes de todo mundo.",
      hero_subtitle:
        "A VIRALYZE transforma sinais do TikTok Shop em rankings, GMV, creators e links acionáveis para encontrar oportunidades antes do mercado.",
      primary_cta_text: "Acessar plataforma",
      primary_cta_url: "dashboard.html",
      secondary_cta_text: "Ver recursos",
      secondary_cta_url: "#recursos",
    },
    sections: [
      {
        section_key: "benefits",
        title: "Inteligência viral para decisões rápidas",
        subtitle: "Tudo que importa em um radar visual para produto, vídeo, creator e faturamento.",
        content: {
          items: [
            "Encontre produtos com tração real no TikTok Shop.",
            "Veja creators com histórico de vendas.",
            "Compare GMV, views, likes e vendas sem planilhas soltas.",
          ],
        },
      },
      {
        section_key: "how_it_works",
        title: "Como funciona",
        subtitle: "Quatro passos para transformar ruído de feed em decisão comercial.",
        content: {
          steps: [
            { title: "Mapeie categorias", description: "Escolha nichos e acompanhe rankings." },
            { title: "Analise os sinais", description: "Cruze views, GMV, vendas e creators." },
            { title: "Abra links acionáveis", description: "Acesse vídeo, creator e produto." },
            { title: "Priorize apostas", description: "Monte sua lista de oportunidades." },
          ],
        },
      },
      {
        section_key: "visual",
        title: "Feeds reais, leitura premium",
        subtitle: "Cards salvos no banco mostram o tipo de inteligência organizada pela plataforma.",
        content: { eyebrow: "TikTok Shop intelligence", badges: ["Cards reais", "Creators", "Produtos", "GMV"] },
      },
      {
        section_key: "resources",
        title: "Recursos para operar como time grande",
        subtitle: "Ranking, filtros, transcrição, GMV, insights e links prontos para ação.",
        content: {
          items: [
            "Ranking por categoria",
            "Filtros por faturamento",
            "Transcrições e links de vídeos",
            "Links diretos de produtos",
            "Métricas históricas",
            "Base para rotina diária",
          ],
        },
      },
      {
        section_key: "final_cta",
        title: "Construa sua vantagem antes da tendência saturar.",
        subtitle: "Entre no radar da VIRALYZE e acompanhe produtos, vídeos e creators com dados estruturados.",
        content: { cta_text: "Começar agora", cta_url: "dashboard.html" },
      },
    ],
    features: [
      {
        title: "Produtos virais",
        description: "Identifique itens com demanda crescente, thumbnail forte e sinal de compra.",
        icon: "grid",
      },
      {
        title: "Vídeos em alta",
        description: "Compare vídeos por views, likes, comentários e velocidade de tração.",
        icon: "play",
      },
      {
        title: "Creators com potencial",
        description: "Encontre perfis que já conseguem atenção e conversão por categoria.",
        icon: "user",
      },
      {
        title: "Dados de GMV",
        description: "Veja faturamento estimado, vendas e métricas de performance por card.",
        icon: "chart",
      },
      {
        title: "Insights acionáveis",
        description: "Transforme sinais do feed em ideias de campanha, produto e parceria.",
        icon: "spark",
      },
    ],
    stats: [
      { label: "GMV analisado", value: "R$ 239 mil+", description: "Base inicial carregada no Supabase." },
      { label: "Vídeos rastreados", value: "30+", description: "Cards com métricas, links e produtos." },
      { label: "Creators monitorados", value: "29+", description: "Perfis organizados por categoria." },
      { label: "Nichos mapeados", value: "15", description: "Categorias prontas para expansão." },
    ],
    plans: [
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
        badge_text: "",
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
      },
    ],
    videos: [],
  };

  const iconMap = {
    grid: "▦",
    play: "▶",
    user: "◉",
    chart: "↗",
    spark: "✦",
  };

  const hasClient =
    window.supabase &&
    typeof window.supabase.createClient === "function" &&
    window.SUPABASE_URL &&
    window.SUPABASE_ANON_KEY;

  const client = hasClient
    ? window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY, {
        auth: { persistSession: false },
      })
    : null;

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => Array.from(document.querySelectorAll(selector));

  const money = (value) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 0,
    }).format(Number(value) || 0);

  const compact = (value) => {
    const number = Number(value) || 0;
    if (number >= 1000000) return `${(number / 1000000).toFixed(number >= 10000000 ? 0 : 1)}M`;
    if (number >= 1000) return `${(number / 1000).toFixed(number >= 10000 ? 0 : 1)}K`;
    return String(number);
  };

  const planMoney = (value) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(value) || 0);

  const safeContent = (section) => {
    if (!section?.content) return {};
    if (typeof section.content === "string") {
      try {
        return JSON.parse(section.content);
      } catch {
        return {};
      }
    }
    return section.content;
  };

  const sectionByKey = (sections, key) => sections.find((section) => section.section_key === key) || {};

  const metricFor = (video) => {
    const metrics = Array.isArray(video.metrics) ? video.metrics : [];
    return metrics
      .slice()
      .sort((a, b) => new Date(b.extracted_at || 0) - new Date(a.extracted_at || 0))[0] || {};
  };

  const fallbackImage =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='560' height='760' viewBox='0 0 560 760'%3E%3Crect width='560' height='760' fill='%23111111'/%3E%3Cpath d='M0 610C120 530 198 584 304 488c82-74 124-158 256-190v462H0Z' fill='%23222222'/%3E%3Ccircle cx='394' cy='188' r='78' fill='%23d4ff00' opacity='.76'/%3E%3Ctext x='42' y='92' fill='%23d4ff00' font-family='Arial' font-size='34' font-weight='700'%3EVIRALYZE%3C/text%3E%3C/svg%3E";

  const loadLanding = async () => {
    if (!client) return fallback;

    try {
      const [settingsResult, sectionsResult, featuresResult, statsResult, videosResult, plansResult] = await Promise.all([
        client.from("landing_settings").select("*").limit(1).maybeSingle(),
        client.from("landing_sections").select("*").eq("is_active", true).order("order_index", { ascending: true }),
        client.from("landing_features").select("*").eq("is_active", true).order("order_index", { ascending: true }),
        client.from("landing_stats").select("*").eq("is_active", true).order("order_index", { ascending: true }),
        client
          .from("videos")
          .select(
            "id,title,thumbnail_url,video_url,views,likes,comments,creators(name,username,avatar_url),products(name,category,product_url,image_url),metrics(revenue,sales,extracted_at)"
          )
          .order("views", { ascending: false })
          .limit(6),
        client
          .from("pricing_plans")
          .select("*")
          .eq("is_active", true)
          .order("is_highlighted", { ascending: true })
          .order("price", { ascending: true }),
      ]);

      const error = [
        settingsResult.error,
        sectionsResult.error,
        featuresResult.error,
        statsResult.error,
        videosResult.error,
        plansResult.error,
      ].find(Boolean);

      if (error) throw error;

      return {
        settings: settingsResult.data || fallback.settings,
        sections: sectionsResult.data?.length ? sectionsResult.data : fallback.sections,
        features: featuresResult.data?.length ? featuresResult.data : fallback.features,
        stats: statsResult.data?.length ? statsResult.data : fallback.stats,
        videos: videosResult.data?.length ? videosResult.data : fallback.videos,
        plans: plansResult.data?.length ? plansResult.data : fallback.plans,
      };
    } catch (error) {
      console.warn("[VIRALYZE] Landing usando fallback local:", error.message);
      return fallback;
    }
  };

  const setText = (selector, value) => {
    const element = $(selector);
    if (element && value) element.textContent = value;
  };

  const setHref = (selector, value) => {
    const element = $(selector);
    if (element && value) element.href = value;
  };

  const renderSettings = (settings) => {
    setText("[data-brand-name]", settings.brand_name);
    setText("[data-hero-title]", settings.hero_title);
    setText("[data-hero-subtitle]", settings.hero_subtitle);
    setText("[data-primary-cta]", settings.primary_cta_text);
    setText("[data-hero-primary]", settings.primary_cta_text);
    setText("[data-hero-secondary]", settings.secondary_cta_text);
    setHref("[data-primary-cta]", settings.primary_cta_url);
    setHref("[data-hero-primary]", settings.primary_cta_url);
    setHref("[data-hero-secondary]", settings.secondary_cta_url);
  };

  const renderSections = (sections) => {
    for (const section of sections) {
      setText(`[data-section-title="${section.section_key}"]`, section.title);
      setText(`[data-section-subtitle="${section.section_key}"]`, section.subtitle);
    }

    const visualContent = safeContent(sectionByKey(sections, "visual"));
    setText('[data-section-eyebrow="visual"]', visualContent.eyebrow);
    const badges = $("[data-visual-badges]");
    if (badges) {
      badges.innerHTML = "";
      (visualContent.badges || []).forEach((badge) => {
        const span = document.createElement("span");
        span.textContent = badge;
        badges.appendChild(span);
      });
    }

    const finalContent = safeContent(sectionByKey(sections, "final_cta"));
    setText("[data-final-cta]", finalContent.cta_text);
    setHref("[data-final-cta]", finalContent.cta_url);
  };

  const renderStats = (stats) => {
    const container = $("[data-stats]");
    if (!container) return;
    container.innerHTML = "";
    stats.forEach((stat) => {
      const article = document.createElement("article");
      article.className = "stat-card";
      article.innerHTML = `<strong>${stat.value}</strong><span>${stat.label}</span><p>${stat.description || ""}</p>`;
      container.appendChild(article);
    });
  };

  const renderFeatures = (features) => {
    const container = $("[data-features]");
    if (!container) return;
    container.innerHTML = "";
    features.forEach((feature) => {
      const article = document.createElement("article");
      article.className = "feature-card";
      article.innerHTML = `
        <div class="feature-icon">${iconMap[feature.icon] || "✦"}</div>
        <h3>${feature.title}</h3>
        <p>${feature.description}</p>
      `;
      container.appendChild(article);
    });
  };

  const renderSteps = (sections) => {
    const container = $("[data-steps]");
    const content = safeContent(sectionByKey(sections, "how_it_works"));
    if (!container) return;
    container.innerHTML = "";
    (content.steps || []).forEach((step, index) => {
      const article = document.createElement("article");
      article.className = "step-card";
      article.innerHTML = `
        <span class="step-number">${String(index + 1).padStart(2, "0")}</span>
        <h3>${step.title}</h3>
        <p>${step.description}</p>
      `;
      container.appendChild(article);
    });
  };

  const renderResources = (sections) => {
    const container = $("[data-resources]");
    const content = safeContent(sectionByKey(sections, "resources"));
    if (!container) return;
    container.innerHTML = "";
    (content.items || []).forEach((item, index) => {
      const article = document.createElement("article");
      article.className = "resource-card";
      article.innerHTML = `<div class="resource-icon">${index + 1}</div><h3>${item}</h3><p>Disponível para leitura rápida dentro do radar VIRALYZE.</p>`;
      container.appendChild(article);
    });
  };

  const previewTitle = (video) => video.title || video.products?.name || "Produto viral";

  const renderVideoPreviews = (videos) => {
    const preview = $("[data-preview-cards]");
    const showcase = $("[data-showcase]");
    const cards = videos.length ? videos : fallback.videos;
    const visible = cards.length
      ? cards
      : [
          { title: "Produto com sinal viral", thumbnail_url: fallbackImage, views: 421300, metrics: [{ revenue: 28688 }] },
          { title: "Creator puxando demanda", thumbnail_url: fallbackImage, views: 11700000, metrics: [{ revenue: 21817 }] },
          { title: "Vídeo com produto em alta", thumbnail_url: fallbackImage, views: 2000000, metrics: [{ revenue: 21546 }] },
        ];

    if (preview) {
      preview.innerHTML = "";
      visible.slice(0, 4).forEach((video) => {
        const metric = metricFor(video);
        const card = document.createElement("article");
        card.className = "preview-card";
        card.innerHTML = `
          <div class="preview-media">
            <img src="${video.thumbnail_url || video.products?.image_url || fallbackImage}" alt="${previewTitle(video)}" />
            <span class="play-icon">▶</span>
          </div>
          <div class="preview-body">
            <strong>${previewTitle(video)}</strong>
            <div class="preview-meta"><span>${compact(video.views)}</span><span>${money(metric.revenue)}</span></div>
          </div>
        `;
        preview.appendChild(card);
      });
    }

    if (showcase) {
      showcase.innerHTML = "";
      visible.slice(0, 3).forEach((video) => {
        const metric = metricFor(video);
        const creator = video.creators?.name || video.creators?.username || "Creator monitorado";
        const card = document.createElement("article");
        card.className = "showcase-card";
        card.innerHTML = `
          <img src="${video.thumbnail_url || video.products?.image_url || fallbackImage}" alt="${creator}" />
          <div>
            <h3>${creator}</h3>
            <span>${money(metric.revenue)} em GMV</span>
          </div>
        `;
        showcase.appendChild(card);
      });
    }
  };

  const periodLabel = (period) => {
    if (period === "mensal") return "/mês";
    if (period === "anual") return "/ano";
    return `/${period || "período"}`;
  };

  const renderPlanCard = (plan, compactCard = false) => {
    const article = document.createElement("article");
    article.className = `pricing-card${plan.is_highlighted ? " is-highlighted" : ""}${compactCard ? " is-compact" : ""}`;
    const features = Array.isArray(plan.features) ? plan.features : [];
    const ctaText = plan.is_highlighted ? "Garantir plano anual" : "Começar agora";

    article.innerHTML = `
      ${
        plan.badge_text
          ? `<span class="plan-badge">${plan.badge_text}</span>`
          : `<span class="plan-kicker">Flexível</span>`
      }
      <h3>${plan.name}</h3>
      <p>${plan.description || ""}</p>
      <div class="plan-price">
        <strong>${planMoney(plan.price)}</strong>
        <span>${periodLabel(plan.billing_period)}</span>
      </div>
      <ul>
        ${features.map((feature) => `<li>${feature}</li>`).join("")}
      </ul>
      <a class="button ${plan.is_highlighted ? "button-primary" : "button-secondary"} plan-button" href="${
        plan.checkout_url
      }">${ctaText}</a>
    `;
    return article;
  };

  const renderPricing = (plans) => {
    const ordered = plans.slice().sort((a, b) => Number(a.is_highlighted) - Number(b.is_highlighted));
    const containers = [$("[data-pricing-plans]"), $("[data-modal-pricing-plans]")].filter(Boolean);

    containers.forEach((container) => {
      container.innerHTML = "";
      ordered.forEach((plan) => container.appendChild(renderPlanCard(plan, container.matches(".modal-pricing-grid"))));
    });
  };

  const openPlanChooser = () => {
    const dialog = $("[data-plan-dialog]");
    if (!dialog) return;
    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
    }
  };

  const closePlanChooser = () => {
    const dialog = $("[data-plan-dialog]");
    if (!dialog) return;
    if (typeof dialog.close === "function") {
      dialog.close();
    } else {
      dialog.removeAttribute("open");
    }
  };

  const bindAccessFlow = () => {
    $$("[data-plan-trigger]").forEach((trigger) => {
      trigger.addEventListener("click", (event) => {
        event.preventDefault();
        openPlanChooser();
      });
    });

    const closeButton = $("[data-plan-close]");
    closeButton?.addEventListener("click", closePlanChooser);

    const dialog = $("[data-plan-dialog]");
    dialog?.addEventListener("click", (event) => {
      if (event.target === dialog) closePlanChooser();
    });
  };

  let refreshTimer;
  let didHonorHash = false;

  const init = async () => {
    const data = await loadLanding();
    renderSettings(data.settings);
    renderSections(data.sections);
    renderStats(data.stats);
    renderFeatures(data.features);
    renderSteps(data.sections);
    renderResources(data.sections);
    renderVideoPreviews(data.videos);
    renderPricing(data.plans);
    console.log(
      `[VIRALYZE] Landing carregada com ${data.features.length} recursos, ${data.stats.length} estatísticas, ${data.videos.length} vídeos e ${data.plans.length} planos do Supabase.`
    );

    if (!didHonorHash && window.location.hash) {
      didHonorHash = true;
      window.setTimeout(() => {
        document.querySelector(window.location.hash)?.scrollIntoView({ block: "start" });
      }, 50);
    }
  };

  const scheduleRefresh = () => {
    window.clearTimeout(refreshTimer);
    refreshTimer = window.setTimeout(init, 350);
  };

  const subscribeRealtime = () => {
    if (!client || typeof client.channel !== "function") return;

    client
      .channel("viralyze-landing")
      .on("postgres_changes", { event: "*", schema: "public", table: "landing_settings" }, scheduleRefresh)
      .on("postgres_changes", { event: "*", schema: "public", table: "landing_sections" }, scheduleRefresh)
      .on("postgres_changes", { event: "*", schema: "public", table: "landing_features" }, scheduleRefresh)
      .on("postgres_changes", { event: "*", schema: "public", table: "landing_stats" }, scheduleRefresh)
      .on("postgres_changes", { event: "*", schema: "public", table: "pricing_plans" }, scheduleRefresh)
      .on("postgres_changes", { event: "*", schema: "public", table: "videos" }, scheduleRefresh)
      .subscribe();
  };

  document.addEventListener("DOMContentLoaded", () => {
    bindAccessFlow();
    init();
    subscribeRealtime();
  });
})();
