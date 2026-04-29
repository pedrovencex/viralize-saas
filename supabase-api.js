(function () {
  const hasBrowserClient =
    window.supabase &&
    typeof window.supabase.createClient === "function" &&
    window.SUPABASE_URL &&
    window.SUPABASE_ANON_KEY;

  const client = hasBrowserClient
    ? window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY, {
        auth: { persistSession: false },
      })
    : null;

  const parseCompactNumber = (value) => {
    const text = String(value || "").replace(/\s/g, "").replace(",", ".");
    const number = Number(text.replace(/[^\d.]/g, "")) || 0;

    if (/m/i.test(text)) return number * 1000000;
    if (/k/i.test(text) || /mil/i.test(text)) return number * 1000;
    return number;
  };

  const formatCompact = (value) => {
    const number = Number(value) || 0;
    if (number >= 1000000) return `${(number / 1000000).toFixed(number >= 10000000 ? 0 : 1)}M`;
    if (number >= 1000) return `${(number / 1000).toFixed(number >= 10000 ? 0 : 1)}K`;
    return String(number);
  };

  const formatMoney = (value) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 0,
    }).format(Number(value) || 0);

  const metricFor = (video) => {
    const metrics = Array.isArray(video.metrics) ? video.metrics : [];
    return metrics
      .slice()
      .sort((a, b) => new Date(b.extracted_at || 0) - new Date(a.extracted_at || 0))[0] || {};
  };

  const mapFeedVideoToCreatorCard = (video) => {
    const creator = video.creators || {};
    const product = video.products || {};
    const metric = metricFor(video);
    const username = creator.username || "creator";
    const sales = metric.sales ?? 0;

    return {
      fonte: "Supabase",
      arroba: username,
      nome: creator.name || username,
      nivel: "VIRALYZE",
      nicho: product.category || "VIRALYZE",
      audiencia: product.category ? `Categoria ${product.category}` : "Supabase",
      tags: ["Supabase", product.category || "VIRALYZE"],
      gmv: formatMoney(metric.revenue),
      unidades_vendidas: String(sales),
      media_visualizacoes_video: formatCompact(video.views),
      taxa_engajamento: formatCompact(video.likes),
      link_tiktok: creator.username ? `https://www.tiktok.com/@${creator.username}` : "#",
      url_foto: creator.avatar_url || video.thumbnail_url || product.image_url || "",
      video_public_url: video.video_url || "",
      video_ids_virais: video.video_url?.match(/video\/(\d+)/)?.[1] ? [video.video_url.match(/video\/(\d+)/)[1]] : [],
      urls_thumbnails_videos_virais: video.thumbnail_url ? [video.thumbnail_url] : [],
      videos_tiktok_urls: [],
      produtos: [
        {
          nome: product.name || video.title || "Produto nao identificado",
          preco: `${sales} vendas`,
          imagem_url: product.image_url || video.thumbnail_url || "",
          produto_url: product.product_url || "",
        },
      ],
      video_modal: {
        texto_completo: [video.title, product.name, "Fonte Supabase"].filter(Boolean),
        video_views: formatCompact(video.views),
        video_likes: formatCompact(video.likes),
        video_comments: formatCompact(video.comments || sales),
        produto_nome: product.name,
        produto_preco: `${sales} vendas`,
      },
    };
  };

  const assertClient = () => {
    if (!client) {
      throw new Error("Supabase nao configurado. Preencha supabase-config.js.");
    }
  };

  const listVideoFeed = async ({ limit = 200 } = {}) => {
    assertClient();
    const { data, error } = await client
      .from("videos")
      .select(
        `
          id,
          title,
          thumbnail_url,
          video_url,
          views,
          likes,
          comments,
          created_at,
          creators(id, name, username, avatar_url, followers),
          products(id, name, category, product_url, image_url),
          metrics(id, revenue, sales, conversion_rate, extracted_at)
        `
      )
      .order("views", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return (data || []).map(mapFeedVideoToCreatorCard);
  };

  const searchCreators = async (query = "") => {
    assertClient();
    const term = `%${query}%`;
    const { data, error } = await client
      .from("creators")
      .select("id, name, username, avatar_url, followers, created_at")
      .or(`name.ilike.${term},username.ilike.${term}`)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) throw error;
    return data || [];
  };

  const insertData = async (table, payload) => {
    assertClient();
    const { data, error } = await client.from(table).insert(payload).select();
    if (error) throw error;
    return data;
  };

  const upsertData = async (table, payload, onConflict) => {
    assertClient();
    const { data, error } = await client.from(table).upsert(payload, { onConflict }).select();
    if (error) throw error;
    return data;
  };

  window.VIRALYZE_SUPABASE = {
    client,
    isConfigured: Boolean(client),
    insertData,
    listVideoFeed,
    mapFeedVideoToCreatorCard,
    parseCompactNumber,
    searchCreators,
    upsertData,
  };
})();
