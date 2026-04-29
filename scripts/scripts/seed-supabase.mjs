import {
  categoryFromNiche,
  loadEnv,
  parseCompactNumber,
  parseMoney,
  postgrest,
  readWindowData,
} from "./supabase-utils.mjs";

loadEnv();

const mapVyralItem = (item) => ({
  creator: {
    name: item.creator || item.username_criador || item.nome_criador,
    username: item.creator || item.username_criador || item.nome_criador,
    avatar_url: item.avatar_url || item.avatar_criador_url || null,
    followers: null,
  },
  product: {
    name: item.produto || item.titulo_video_produto || "Produto nao identificado",
    category: item.categoria || "VIRALYZE",
    product_url: item.link_produto && item.link_produto !== "Não encontrado" ? item.link_produto : null,
    image_url: item.produto_imagem_url || null,
  },
  video: {
    title: item.descricao_video && item.descricao_video !== "Não encontrado"
      ? item.descricao_video
      : item.produto || item.titulo_video_produto || "Video viral",
    thumbnail_url: item.thumbnail_url || item.thumbnail_imagem_principal || null,
    video_url: item.video_url || item.link_video || null,
    views: parseCompactNumber(item.visualizacoes),
    likes: parseCompactNumber(item.curtidas),
    comments: item.comentarios && item.comentarios !== "Não encontrado"
      ? parseCompactNumber(item.comentarios)
      : 0,
  },
  metric: {
    revenue: parseMoney(item.gmv || item.faturamento_gmv),
    sales: parseCompactNumber(item.vendas || item.vendas_quantidade_vendida),
    conversion_rate: null,
  },
});

const mapTikTokSellerItem = (item) => {
  const product = item.produtos?.[0] || {};
  const video = item.video_modal || {};

  return {
    creator: {
      name: item.nome || item.arroba,
      username: item.arroba,
      avatar_url: item.url_foto || null,
      followers: parseCompactNumber(String(item.audiencia || "").split(",")[0]),
    },
    product: {
      name: product.nome || "Produto nao identificado",
      category: categoryFromNiche(item.nicho),
      product_url: product.produto_url || null,
      image_url: product.imagem_url || null,
    },
    video: {
      title:
        video.texto_completo?.find((line) => line.length > 20 && !line.startsWith("Link do produto")) ||
        product.nome ||
        "Video viral",
      thumbnail_url: item.urls_thumbnails_videos_virais?.[0] || null,
      video_url: item.video_public_url || item.videos_tiktok_urls?.[0] || null,
      views: parseCompactNumber(video.video_views || item.media_visualizacoes_video),
      likes: parseCompactNumber(video.video_likes || 0),
      comments: parseCompactNumber(video.video_comments || 0),
    },
    metric: {
      revenue: parseMoney(item.gmv),
      sales: parseCompactNumber(item.unidades_vendidas),
      conversion_rate: item.taxa_engajamento ? parseFloat(String(item.taxa_engajamento).replace(",", ".")) : null,
    },
  };
};

const upsertOne = async (record) => {
  const [creator] = await postgrest({
    method: "POST",
    path: "creators?on_conflict=username",
    body: record.creator,
    serviceRole: true,
  });

  const [product] = await postgrest({
    method: "POST",
    path: "products?on_conflict=name,category",
    body: record.product,
    serviceRole: true,
  });

  const videoPayload = {
    ...record.video,
    creator_id: creator.id,
    product_id: product.id,
  };

  const [video] = await postgrest({
    method: "POST",
    path: "videos?on_conflict=video_url",
    body: videoPayload,
    serviceRole: true,
  });

  const [metric] = await postgrest({
    method: "POST",
    path: "metrics",
    body: {
      ...record.metric,
      video_id: video.id,
    },
    serviceRole: true,
  });

  return { creator, product, video, metric };
};

const run = async () => {
  const seller = readWindowData("creators-data.js", "CREATOR_DATA").map(mapTikTokSellerItem);
  const roupas = readWindowData("vyral-roupas-femininas-data.js", "VYRAL_ROUPAS_FEMININAS_DATA").map(mapVyralItem);
  const beleza = readWindowData("vyral-beleza-cuidados-data.js", "VYRAL_BELEZA_CUIDADOS_DATA").map(mapVyralItem);
  const records = [...seller, ...roupas, ...beleza].filter((record) => record.creator.username);

  console.log(`[VIRALYZE] Iniciando seed Supabase com ${records.length} registros.`);
  let inserted = 0;

  for (const record of records) {
    await upsertOne(record);
    inserted += 1;
    console.log(`[VIRALYZE] ${inserted}/${records.length} ${record.creator.username}`);
  }

  console.log(`[VIRALYZE] Seed concluído. Registros processados: ${inserted}`);
};

run().catch((error) => {
  console.error("[VIRALYZE] Erro no seed Supabase:");
  console.error(error.message);
  process.exit(1);
});
