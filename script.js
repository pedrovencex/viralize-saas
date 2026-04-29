const grid = document.querySelector("[data-creator-grid]");
const nicheContainer = document.querySelector("[data-niches]");
const sortSelect = document.querySelector("[data-sort]");
const clearButton = document.querySelector("[data-clear]");
const totalCreators = document.querySelector("[data-total-creators]");
const topViews = document.querySelector("[data-top-views]");
const totalGmv = document.querySelector("[data-total-gmv]");
const template = document.querySelector("#creator-card-template");
const videoDialog = document.querySelector("[data-video-dialog]");
const dialogMedia = document.querySelector("[data-dialog-media]");
const dialogClose = document.querySelector("[data-dialog-close]");

const nicheTopics = [
  { label: "Todos", icon: "▦", pulse: "" },
  { label: "Beleza & Cuidados Pessoais", icon: "✧", pulse: "+1" },
  { label: "Roupas Femininas", icon: "▣", pulse: "+1" },
  { label: "Casa & Decoracao", icon: "⌂", pulse: "+1" },
  { label: "Esportes & Fitness", icon: "⌘", pulse: "+1" },
  { label: "Saude & Bem-Estar", icon: "♡", pulse: "+2" },
  { label: "Eletronicos & Gadgets", icon: "▭", pulse: "+1" },
  { label: "Malas, Bolsas & Sapatos", icon: "▥", pulse: "+1" },
  { label: "Eletrodomesticos", icon: "▤", pulse: "+1" },
  { label: "Ferramentas & Construcao", icon: "⌁", pulse: "+1" },
  { label: "Cozinha & Utensilios", icon: "▦", pulse: "+1" },
  { label: "Automotivo", icon: "◇", pulse: "+2" },
  { label: "Acessorios de Moda", icon: "⌬", pulse: "+2" },
  { label: "Pet Shop", icon: "✣", pulse: "+1" },
  { label: "Livros & Papelaria", icon: "▧", pulse: "+1" },
];

let creators = [];
let activeNiche = "Todos";

const normalizeText = (value) =>
  String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const parseCompactNumber = (value) => {
  const text = String(value || "").replace(/\s/g, "").replace(",", ".");
  const number = Number(text.replace(/[^\d.]/g, "")) || 0;

  if (/m/i.test(text)) {
    return number * 1000000;
  }

  if (/k/i.test(text) || /mil/i.test(text)) {
    return number * 1000;
  }

  return number;
};

const parseLocaleNumber = (value) => {
  const text = String(value || "").replace(/\s/g, "");
  const compact = text.replace(/[^\d.,]/g, "");

  if (compact.includes(",")) {
    return Number(compact.replace(/\./g, "").replace(",", ".")) || 0;
  }

  return Number(compact.replace(/[^\d.]/g, "")) || 0;
};

const parseMoney = (value) => {
  const text = String(value || "").toLowerCase().replace(/\s/g, "");
  const number = parseLocaleNumber(text);

  if (text.includes("mil")) {
    return number * 1000;
  }

  if (text.includes("k")) {
    return number * 1000;
  }

  return number;
};

const categoryFromNiche = (niche) => {
  const text = normalizeText(niche);

  if (text.includes("beleza")) return "Beleza & Cuidados Pessoais";
  if (text.includes("roupas")) return "Roupas Femininas";
  if (text.includes("casa") || text.includes("decor")) return "Casa & Decoracao";
  if (text.includes("esporte") || text.includes("fitness")) return "Esportes & Fitness";
  if (text.includes("eletrodomest")) return "Eletrodomesticos";
  if (text.includes("eletron")) return "Eletronicos & Gadgets";
  if (text.includes("mala") || text.includes("bolsa") || text.includes("sapato")) return "Malas, Bolsas & Sapatos";
  if (text.includes("ferrament") || text.includes("construcao")) return "Ferramentas & Construcao";
  if (text.includes("cozinha") || text.includes("utensilio")) return "Cozinha & Utensilios";
  if (text.includes("auto")) return "Automotivo";
  if (text.includes("acessor")) return "Acessorios de Moda";
  if (text.includes("pet")) return "Pet Shop";
  if (text.includes("livro") || text.includes("papelaria")) return "Livros & Papelaria";
  if (text.includes("suplement") || text.includes("saude")) return "Saude & Bem-Estar";

  return "Saude & Bem-Estar";
};

const getProduct = (creator) => creator.produtos?.[0] || {};
const getVideo = (creator) => creator.video_modal || {};

const mapVyralCreator = (item) => {
  const username = item.creator || item.username_criador || item.nome_criador || "creator";
  const category = item.categoria || "VIRALYZE";
  const productName = item.produto || item.titulo_video_produto || "Produto nao identificado";
  const sales = item.vendas || item.vendas_quantidade_vendida || "Nao encontrado";
  const videoUrl = item.video_url || item.link_video || "";
  const creatorUrl = item.creator_url || item.link_criador || `https://www.tiktok.com/@${username}`;
  const thumbnailUrl = item.thumbnail_url || item.thumbnail_imagem_principal || "";
  const avatarUrl = item.avatar_url || item.avatar_criador_url || thumbnailUrl;
  const productImageUrl = item.produto_imagem_url || thumbnailUrl;
  const productUrl = item.link_produto && item.link_produto !== "Não encontrado" ? item.link_produto : "";

  return {
    fonte: "VIRALYZE",
    ranking_origem: item.ranking,
    arroba: username,
    nome: username,
    nivel: "VIRALYZE",
    nicho: category,
    audiencia: `Categoria ${category}`,
    tags: ["VIRALYZE", category],
    gmv: item.gmv || item.faturamento_gmv || "R$ 0",
    unidades_vendidas: sales,
    media_visualizacoes_video: item.visualizacoes || "0",
    taxa_engajamento: item.curtidas || "0",
    link_tiktok: creatorUrl,
    url_foto: avatarUrl,
    video_public_url: videoUrl,
    video_ids_virais: item.video_id ? [item.video_id] : [],
    urls_thumbnails_videos_virais: thumbnailUrl ? [thumbnailUrl] : [],
    videos_tiktok_urls: [],
    produtos: [
      {
        nome: productName,
        preco: `${sales} vendas`,
        imagem_url: productImageUrl,
        produto_url: productUrl,
        observacao: productUrl
          ? "Produto com URL publica extraida pelo VIRALYZE."
          : "O VIRALYZE exibiu imagem e nome do produto, mas nao encontrou URL publica do produto no feed.",
      },
    ],
    video_modal: {
      texto_completo: [item.descricao_video, productName, "Ver video no TikTok"].filter(
        (line) => line && line !== "Não encontrado"
      ),
      video_views: item.visualizacoes || "0",
      video_likes: item.curtidas || "0",
      video_comments: item.comentarios && item.comentarios !== "Não encontrado" ? item.comentarios : sales,
      produto_nome: productName,
      produto_preco: `${sales} vendas`,
    },
  };
};

const sortCreators = (items) => {
  const sortValue = sortSelect.value;
  const scoring = {
    gmv: (creator) => parseMoney(creator.gmv),
    views: (creator) => parseCompactNumber(getVideo(creator).video_views),
    units: (creator) => parseCompactNumber(creator.unidades_vendidas),
    engagement: (creator) => parseCompactNumber(creator.taxa_engajamento),
  };

  return [...items].sort((a, b) => scoring[sortValue](b) - scoring[sortValue](a));
};

const updateSummary = (items) => {
  totalCreators.textContent = String(items.length).padStart(2, "0");
  topViews.textContent = sortCreators(items)[0]?.video_modal?.video_views || "0";

  const total = items.reduce((sum, creator) => sum + parseMoney(creator.gmv), 0);
  totalGmv.textContent = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(total);
};

const renderNiches = () => {
  nicheContainer.innerHTML = nicheTopics
    .map(
      (topic) => `
        <button class="niche-button ${topic.label === activeNiche ? "is-active" : ""}" type="button" data-niche="${topic.label}">
          <span class="niche-icon">${topic.icon}</span>
          <span class="niche-label">${topic.label}</span>
          ${topic.pulse ? `<span class="niche-pulse">${topic.pulse}</span>` : ""}
        </button>
      `
    )
    .join("");
};

const productLinkFor = (creator) => {
  const product = getProduct(creator);
  return product.produto_url || product.imagem_url || "";
};

const videoCaptionFor = (creator) => {
  const product = getProduct(creator);
  return (
    getVideo(creator).texto_completo?.find(
      (line) =>
        line.length > 20 &&
        !line.startsWith("Link do produto") &&
        line !== product.nome
    ) ||
    product.nome ||
    "Video viral"
  );
};

const openVideoDialog = (creator) => {
  const product = getProduct(creator);
  const video = getVideo(creator);
  const playableUrl = creator.videos_tiktok_urls?.[0] || "";
  const publicVideoUrl = creator.video_public_url || "";
  const publicVideoId = creator.video_ids_virais?.[0] || "";
  const embedUrl = publicVideoId
    ? `https://www.tiktok.com/player/v1/${publicVideoId}?controls=1&autoplay=0&loop=0`
    : "";
  const thumbUrl = creator.urls_thumbnails_videos_virais?.[0] || product.imagem_url || creator.url_foto;

  dialogMedia.innerHTML = playableUrl
    ? `<video src="${playableUrl}" controls autoplay playsinline poster="${thumbUrl}"></video>`
    : embedUrl
      ? `
        <iframe
          src="${embedUrl}"
          title="Video TikTok de ${creator.nome}"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowfullscreen
          loading="lazy"
        ></iframe>
        ${
          publicVideoUrl
            ? `<a class="preview-video-link" href="${publicVideoUrl}" target="_blank" rel="noreferrer">Abrir video no TikTok</a>`
            : ""
        }
      `
    : `
      <img src="${thumbUrl}" alt="Preview do video viral de ${creator.nome}" />
      <div class="play-button" aria-hidden="true"><span></span></div>
      <p class="preview-note">
        ${
          publicVideoUrl
            ? "O VIRALYZE trouxe o link publico do video no TikTok."
            : "Este painel trouxe thumbnail e ID do video, mas nao trouxe uma URL MP4/publica tocavel."
        }
        Video ID: ${creator.video_ids_virais?.[0] || "indisponivel"}.
      </p>
      ${
        publicVideoUrl
          ? `<a class="preview-video-link" href="${publicVideoUrl}" target="_blank" rel="noreferrer">Abrir video no TikTok</a>`
          : ""
      }
    `;

  document.querySelector("[data-dialog-avatar]").src = creator.url_foto;
  document.querySelector("[data-dialog-avatar]").alt = creator.nome;
  document.querySelector("[data-dialog-name]").textContent = creator.nome;
  document.querySelector("[data-dialog-handle]").textContent = `@${creator.arroba}`;
  document.querySelector("[data-dialog-handle]").href = creator.link_tiktok;
  document.querySelector("[data-dialog-caption]").textContent = videoCaptionFor(creator);
  document.querySelector("[data-dialog-views]").textContent = video.video_views || creator.media_visualizacoes_video;
  document.querySelector("[data-dialog-likes]").textContent = video.video_likes || "-";
  document.querySelector("[data-dialog-comments]").textContent = video.video_comments || "-";
  document.querySelector("[data-dialog-product-image]").src = product.imagem_url || creator.url_foto;
  document.querySelector("[data-dialog-product-image]").alt = product.nome || "Produto";
  document.querySelector("[data-dialog-product-name]").textContent = product.nome || "Produto nao identificado";
  document.querySelector("[data-dialog-product-price]").textContent = product.preco || "Preco indisponivel";

  const productLink = document.querySelector("[data-dialog-product-link]");
  productLink.href = productLinkFor(creator) || "#";
  productLink.title = product.produto_url
    ? "Abrir produto"
    : "A tabela nao trouxe URL publica do produto; abrindo a imagem do produto.";

  videoDialog.showModal();
};

const renderCards = () => {
  renderNiches();

  const filtered =
    activeNiche === "Todos"
      ? creators
      : creators.filter((creator) => categoryFromNiche(creator.nicho) === activeNiche);
  const sorted = sortCreators(filtered);

  updateSummary(sorted);
  grid.innerHTML = "";

  sorted.forEach((creator, index) => {
    const product = getProduct(creator);
    const video = getVideo(creator);
    const card = template.content.firstElementChild.cloneNode(true);
    const productHref = productLinkFor(creator);

    card.querySelector(".video-thumb").src = creator.urls_thumbnails_videos_virais?.[0] || product.imagem_url || creator.url_foto;
    card.querySelector(".video-thumb").alt = `Video viral de ${creator.nome}`;
    card.querySelector(".rank-badge").textContent = `#${index + 1}`;
    card.querySelector(".niche-pill").textContent = categoryFromNiche(creator.nicho);
    card.querySelector(".video-title").textContent = videoCaptionFor(creator);

    card.querySelector(".product-image").src = product.imagem_url || creator.url_foto;
    card.querySelector(".product-image").alt = product.nome || "Produto";
    card.querySelector(".product-name").textContent = product.nome || "Produto nao identificado";
    card.querySelector(".product-price").textContent = product.preco || "Preco indisponivel";

    card.querySelector(".avatar").src = creator.url_foto;
    card.querySelector(".avatar").alt = creator.nome;
    card.querySelector(".creator-name").textContent = creator.nome;
    card.querySelector(".creator-handle").textContent = `@${creator.arroba}`;
    card.querySelector(".creator-handle").href = creator.link_tiktok;

    card.querySelector(".metric-views").textContent = video.video_views || creator.media_visualizacoes_video;
    card.querySelector(".metric-likes").textContent = video.video_likes || "-";
    card.querySelector(".metric-gmv").textContent = creator.gmv;
    card.querySelector(".metric-units").textContent = creator.unidades_vendidas;

    const productLink = card.querySelector(".product-link");
    productLink.href = productHref || "#";
    if (!product.produto_url) {
      productLink.classList.add("is-muted");
      productLink.textContent = "Ver produto";
      productLink.title = productHref
        ? "A tabela tem imagem do produto, mas nao trouxe URL publica do produto."
        : "A tabela nao trouxe URL publica do produto.";
    }

    card.querySelector(".creator-link").href = creator.link_tiktok;
    card.querySelector(".video-panel").addEventListener("click", () => openVideoDialog(creator));
    card.querySelector(".play-button").addEventListener("click", (event) => {
      event.stopPropagation();
      openVideoDialog(creator);
    });
    grid.append(card);
  });
};

dialogClose.addEventListener("click", () => videoDialog.close());
videoDialog.addEventListener("click", (event) => {
  if (event.target === videoDialog) {
    videoDialog.close();
  }
});

videoDialog.addEventListener("close", () => {
  dialogMedia.innerHTML = "";
});

nicheContainer.addEventListener("click", (event) => {
  const button = event.target.closest("[data-niche]");
  if (!button) return;

  activeNiche = button.dataset.niche;
  renderCards();
});

sortSelect.addEventListener("change", renderCards);
clearButton.addEventListener("click", () => {
  activeNiche = "Todos";
  sortSelect.value = "gmv";
  renderCards();
});

const loadCreators = async () => {
  const vyralCreators = [
    ...(Array.isArray(window.VYRAL_ROUPAS_FEMININAS_DATA)
      ? window.VYRAL_ROUPAS_FEMININAS_DATA.map(mapVyralCreator)
      : []),
    ...(Array.isArray(window.VYRAL_BELEZA_CUIDADOS_DATA)
      ? window.VYRAL_BELEZA_CUIDADOS_DATA.map(mapVyralCreator)
      : []),
  ];

  if (window.VIRALYZE_SUPABASE?.isConfigured) {
    try {
      const supabaseCreators = await window.VIRALYZE_SUPABASE.listVideoFeed();
      if (supabaseCreators.length) {
        creators = supabaseCreators;
        renderCards();
        console.info(`[VIRALYZE] ${supabaseCreators.length} cards carregados do Supabase.`);
        return;
      }

      console.info("[VIRALYZE] Supabase conectado, mas sem videos. Usando dados locais.");
    } catch (error) {
      console.warn("[VIRALYZE] Falha ao carregar Supabase. Usando dados locais.", error);
    }
  } else {
    console.info("[VIRALYZE] Supabase ainda nao configurado. Usando dados locais.");
  }

  if (Array.isArray(window.CREATOR_DATA)) {
    creators = [...window.CREATOR_DATA, ...vyralCreators];
    renderCards();
    return;
  }

  try {
    const response = await fetch("tiktok-creators-10-completo.json");
    creators = [...(await response.json()), ...vyralCreators];
    renderCards();
  } catch {
    grid.innerHTML = '<p class="load-error">Nao foi possivel carregar os dados dos creators.</p>';
  }
};

loadCreators();
