// ── Living background: blobs drift on their own + react to cursor ──
(function () {
  const root = document.documentElement;
  const set = (k, v) => root.style.setProperty(k, v.toFixed(2) + "%");

  // Reduced-motion: place blobs once, statically, and bail.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    set("--gx", 16); set("--gy", 12);
    set("--ax", 86); set("--ay", 88);
    set("--bx", 78); set("--by", 22);
    return;
  }

  // Cursor target as a -1..1 offset from screen centre (eased).
  let tmx = 0, tmy = 0, mx = 0, my = 0;
  window.addEventListener("mousemove", (e) => {
    tmx = (e.clientX / window.innerWidth  - 0.5) * 2;
    tmy = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  const t0 = performance.now();
  (function tick(now) {
    const t = (now - t0) / 1000;
    mx += (tmx - mx) * 0.05;
    my += (tmy - my) * 0.05;

    // Each blob: a slow Lissajous drift + gentle parallax pull from cursor.
    set("--gx", 16 + Math.sin(t * 0.17)        * 13 + mx * 20);
    set("--gy", 14 + Math.cos(t * 0.13)        * 10 + my * 20);
    set("--ax", 86 + Math.sin(t * 0.12 + 2.1)  * 13 - mx * 20);
    set("--ay", 86 + Math.cos(t * 0.15 + 1.3)  * 11 - my * 20);
    set("--bx", 78 + Math.sin(t * 0.09 + 4.2)  * 15 + mx * 12);
    set("--by", 24 + Math.cos(t * 0.11 + 0.7)  * 13 - my * 12);

    requestAnimationFrame(tick);
  })(t0);
})();

// Language toggle
const langButtons = document.querySelectorAll(".lang-button");

function setLang(lang) {
  document.querySelectorAll("[data-ja]").forEach((el) => {
    const value = el.dataset[lang];
    if (value) el.textContent = value;
  });
  document.documentElement.lang = lang === "ja" ? "ja" : "en";
  localStorage.setItem("lang", lang);
  langButtons.forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.lang === lang);
  });
  // sync show-more button labels
  document.querySelectorAll(".show-more-btn").forEach((btn) => {
    const collapsed = btn.previousElementSibling?.classList.contains("collapsed");
    btn.textContent = collapsed
      ? (lang === "ja" ? "もっと見る ▾" : "Show more ▾")
      : (lang === "ja" ? "閉じる ▴"   : "Show less ▴");
  });
  // sync chapter toggle labels
  document.querySelectorAll(".chapter-toggle").forEach((btn) => {
    const events = btn.previousElementSibling;
    const hidden = events?.hasAttribute("hidden");
    btn.textContent = hidden
      ? (lang === "ja" ? "詳細を見る ▾" : "Details ▾")
      : (lang === "ja" ? "閉じる ▴"    : "Close ▴");
  });
}

langButtons.forEach((btn) => btn.addEventListener("click", () => setLang(btn.dataset.lang)));

const savedLang = localStorage.getItem("lang");
const browserLang = navigator.language?.startsWith("ja") ? "ja" : "en";
setLang(savedLang || browserLang);

const portfolioSections = {
  works: document.querySelector('[data-section="works"]'),
  projects: document.querySelector('[data-section="projects"]'),
  aside: document.querySelector('[data-section="aside"]'),
};
const articleCache = new Map();

function localizedText(value, lang = getActiveLang()) {
  if (!value || typeof value !== "object") return value || "";
  return value[lang] || value.ja || value.en || "";
}

function parseArticleMarkdown(markdown) {
  if (!markdown.startsWith("---\n")) return { meta: {}, body: markdown };

  const end = markdown.indexOf("\n---\n", 4);
  if (end === -1) return { meta: {}, body: markdown };

  const rawMeta = markdown.slice(4, end).trim();
  const body = markdown.slice(end + 5).replace(/^\s+/, "");
  try {
    return { meta: JSON.parse(rawMeta), body };
  } catch (error) {
    console.warn("Invalid article frontmatter", error);
    return { meta: {}, body };
  }
}

async function fetchArticleFile(slug, lang) {
  const key = `${slug}.${lang}`;
  if (articleCache.has(key)) return articleCache.get(key);

  const candidates = [`articles/${slug}.${lang}.md`, `articles/${slug}.ja.md`];
  for (const url of [...new Set(candidates)]) {
    try {
      const response = await fetch(`${url}?v=20260614-2`);
      if (!response.ok) continue;
      const parsed = parseArticleMarkdown(await response.text());
      articleCache.set(key, parsed);
      return parsed;
    } catch (error) {
      // Try the fallback candidate below.
    }
  }

  const empty = { meta: {}, body: "" };
  articleCache.set(key, empty);
  return empty;
}

async function getArticleData(slug) {
  const [ja, en] = await Promise.all([
    fetchArticleFile(slug, "ja"),
    fetchArticleFile(slug, "en"),
  ]);

  return {
    slug,
    ja: ja.meta,
    en: en.meta,
  };
}

function setJsonData(element, name, value) {
  if (!value || (Array.isArray(value) && value.length === 0)) return;
  element.dataset[name] = JSON.stringify(value);
}

function applyArticleDataset(element, item) {
  element.dataset.article = item.slug;
  setJsonData(element, "images", item.ja.images || item.en.images || []);
  setJsonData(element, "captionsJa", item.ja.captions || []);
  setJsonData(element, "captionsEn", item.en.captions || []);
}

function renderWorkCard(item) {
  const active = item[getActiveLang()] || item.ja || item.en || {};
  const card = document.createElement("article");
  card.className = "work-card";
  applyArticleDataset(card, item);

  const image = document.createElement("img");
  image.className = "work-media";
  image.src = active.images?.[0] || item.ja.images?.[0] || item.en.images?.[0] || "";
  image.alt = active.alt || item.ja.alt || item.en.alt || active.title || "";

  const body = document.createElement("div");
  body.className = "work-body";

  const period = document.createElement("span");
  period.className = "period";
  period.textContent = active.period || item.ja.period || item.en.period || "";

  const title = document.createElement("h3");
  title.dataset.ja = item.ja.title || "";
  title.dataset.en = item.en.title || "";
  title.textContent = localizedText({ ja: item.ja.title, en: item.en.title });

  const desc = document.createElement("p");
  desc.dataset.ja = item.ja.summary || "";
  desc.dataset.en = item.en.summary || "";
  desc.textContent = localizedText({ ja: item.ja.summary, en: item.en.summary });

  body.append(period, title, desc);
  card.append(image, body);
  return card;
}

function renderAsideCard(item) {
  const active = item[getActiveLang()] || item.ja || item.en || {};
  const card = document.createElement("figure");
  card.className = "aside-item";
  applyArticleDataset(card, item);
  card.dataset.titleJa = item.ja.title || "";
  card.dataset.titleEn = item.en.title || "";
  card.dataset.descJa = item.ja.summary || "";
  card.dataset.descEn = item.en.summary || "";

  const image = document.createElement("img");
  image.src = active.images?.[0] || item.ja.images?.[0] || item.en.images?.[0] || "";
  image.alt = active.alt || item.ja.alt || item.en.alt || active.title || "";

  const caption = document.createElement("figcaption");
  const title = document.createElement("strong");
  title.dataset.ja = item.ja.title || "";
  title.dataset.en = item.en.title || "";
  title.textContent = localizedText({ ja: title.dataset.ja, en: title.dataset.en });

  const desc = document.createElement("span");
  desc.dataset.ja = item.ja.summary || "";
  desc.dataset.en = item.en.summary || "";
  desc.textContent = localizedText({ ja: desc.dataset.ja, en: desc.dataset.en });

  caption.append(title, desc);
  card.append(image, caption);
  return card;
}

async function loadPortfolioIndex() {
  const response = await fetch("articles.json?v=20260614-2");
  if (!response.ok) throw new Error(`Failed to load articles.json: ${response.status}`);
  return response.json();
}

async function renderPortfolioCards() {
  const data = await loadPortfolioIndex();
  for (const [section, container] of Object.entries(portfolioSections)) {
    if (!container) continue;
    container.innerHTML = "";
    const renderer = section === "aside" ? renderAsideCard : renderWorkCard;
    const articles = await Promise.all((data.sections?.[section] || []).map(getArticleData));
    articles.forEach((item) => container.append(renderer(item)));
  }
  setLang(getActiveLang());
}

function showPortfolioLoadError(error) {
  console.error(error);
  Object.values(portfolioSections).forEach((container) => {
    if (!container) return;
    container.innerHTML = `<p class="content-load-error">${getActiveLang() === "ja" ? "記事一覧を読み込めませんでした。" : "Could not load article cards."}</p>`;
  });
}

// ── Mobile hamburger menu ──────────────────────────────
(function () {
  const nav = document.querySelector(".nav");
  const toggle = document.querySelector(".nav-toggle");
  if (!nav || !toggle) return;

  const close = () => {
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  };

  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
  });

  // Close after tapping a link, or pressing Escape, or clicking outside.
  nav.querySelectorAll(".nav-links a").forEach((a) =>
    a.addEventListener("click", close)
  );
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
  document.addEventListener("click", (e) => {
    if (nav.classList.contains("is-open") && !nav.contains(e.target)) close();
  });
})();

// ── Horizontal card sliders (Works / Projects) ─────────
function initCardSliders() {
  document.querySelectorAll(".work-grid, .aside-grid").forEach((grid) => {
    const cards = [...grid.children];
    if (!cards.length) return;

    // Build a dot per card
    const dots = document.createElement("div");
    dots.className = "slider-dots";
    cards.forEach((_, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "sdot";
      b.setAttribute("aria-label", `${i + 1}枚目へ`);
      b.addEventListener("click", () =>
        grid.scrollTo({ left: cards[i].offsetLeft, behavior: "smooth" })
      );
      dots.appendChild(b);
    });
    grid.after(dots);

    const scrollable = () => grid.scrollWidth - grid.clientWidth > 4;

    const update = () => {
      const on = scrollable();
      dots.hidden = !on;
      grid.classList.toggle("is-scrollable", on);
      if (!on) return;
      let best = 0, bestDist = Infinity;
      cards.forEach((c, i) => {
        const d = Math.abs(c.offsetLeft - grid.scrollLeft);
        if (d < bestDist) { bestDist = d; best = i; }
      });
      [...dots.children].forEach((d, i) => d.classList.toggle("active", i === best));
    };

    let raf = null;
    grid.addEventListener("scroll", () => {
      if (raf) return;
      raf = requestAnimationFrame(() => { raf = null; update(); });
    }, { passive: true });
    window.addEventListener("resize", update);
    update();

    // Drag-to-scroll for mouse; touch/trackpad scroll natively.
    // A real drag suppresses the card's click (so we don't open the modal).
    let down = false, startX = 0, startScroll = 0, moved = false;
    grid.addEventListener("pointerdown", (e) => {
      if (e.pointerType !== "mouse" || !scrollable()) return;
      down = true; moved = false;
      startX = e.clientX; startScroll = grid.scrollLeft;
      grid.classList.add("is-grabbing");
    });
    window.addEventListener("pointermove", (e) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 4) moved = true;
      grid.scrollLeft = startScroll - dx;
    });
    window.addEventListener("pointerup", () => {
      if (!down) return;
      down = false;
      grid.classList.remove("is-grabbing");
      if (moved) {
        grid.dataset.dragging = "1";
        setTimeout(() => { grid.dataset.dragging = "0"; }, 0);
      }
    });
  });
}

// ── Modal ──────────────────────────────────────────────
const modalOverlay  = document.getElementById("modal");
const slideshow     = modalOverlay.querySelector(".modal-slideshow");
const slideImg      = modalOverlay.querySelector(".modal-slide-img");
const slidePrev     = modalOverlay.querySelector(".slide-prev");
const slideNext     = modalOverlay.querySelector(".slide-next");
const dotsContainer = modalOverlay.querySelector(".slide-dots");
const modalPeriod   = modalOverlay.querySelector(".modal-period");
const modalBadge    = modalOverlay.querySelector(".modal-badge");
const modalTitle    = modalOverlay.querySelector(".modal-title");
const modalDesc     = modalOverlay.querySelector(".modal-desc");
const modalChips    = modalOverlay.querySelector(".modal-chips");
const detailOpenBtn = modalOverlay.querySelector(".detail-open-btn");

let currentImages = [];
let currentIndex  = 0;
let currentCard   = null;
let slideRequestId = 0;
const preloadedImages = new Map();

function preloadImage(src) {
  if (!src) return Promise.reject(new Error("Image source is empty."));
  if (preloadedImages.has(src)) return preloadedImages.get(src);

  const promise = new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(src);
    image.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    image.src = src;
  });

  preloadedImages.set(src, promise);
  return promise;
}

function preloadSlides(images) {
  images.forEach((src) => {
    preloadImage(src).catch(() => {
      preloadedImages.delete(src);
    });
  });
}

function showSlide(i) {
  if (currentImages.length === 0) return;

  currentIndex = (i + currentImages.length) % currentImages.length;
  const nextSrc = currentImages[currentIndex];
  const requestId = ++slideRequestId;

  slideImg.classList.add("is-fading");
  preloadImage(nextSrc)
    .catch(() => nextSrc)
    .then((src) => {
      if (requestId !== slideRequestId) return;
      slideImg.src = src;
    })
    .finally(() => {
      if (requestId !== slideRequestId) return;
      slideImg.classList.remove("is-fading");
    });

  setTimeout(() => {
    if (requestId !== slideRequestId) return;
    slideImg.classList.remove("is-fading");
  }, 900);

  dotsContainer.querySelectorAll(".dot").forEach((d, j) => {
    d.classList.toggle("active", j === currentIndex);
  });
}

slidePrev.addEventListener("click", (e) => { e.stopPropagation(); showSlide(currentIndex - 1); });
slideNext.addEventListener("click", (e) => { e.stopPropagation(); showSlide(currentIndex + 1); });
dotsContainer.addEventListener("click", (e) => {
  if (!e.target.classList.contains("dot")) return;
  showSlide([...dotsContainer.querySelectorAll(".dot")].indexOf(e.target));
});

function getCardContent(card) {
  if (card.classList.contains("aside-item")) {
    const lang = localStorage.getItem("lang") || "ja";
    return {
      period: "",
      badge:  "",
      title:  card.dataset[`title${lang.charAt(0).toUpperCase() + lang.slice(1)}`] || card.querySelector("figcaption strong")?.textContent || "",
      desc:   card.dataset[`desc${lang.charAt(0).toUpperCase() + lang.slice(1)}`]  || card.querySelector("figcaption span")?.textContent  || "",
      chips:  [],
    };
  }
  return {
    period: card.querySelector(".period")?.textContent ?? "",
    badge:  card.querySelector(".launch-badge")?.textContent ?? "",
    title:  card.querySelector("h3")?.textContent ?? "",
    desc:   card.querySelector(".work-body p")?.textContent ?? "",
    chips:  [...card.querySelectorAll(".chips span")].map((s) => s.textContent),
  };
}

function openModal(card) {
  currentCard   = card;
  currentImages = JSON.parse(card.dataset.images || "[]");

  if (currentImages.length > 0) {
    currentIndex = 0;
    slideRequestId += 1;
    dotsContainer.innerHTML = currentImages.length > 1
      ? currentImages.map((_, i) => `<button class="dot${i === 0 ? " active" : ""}" aria-label="画像${i + 1}"></button>`).join("")
      : "";
    slidePrev.hidden = currentImages.length <= 1;
    slideNext.hidden = currentImages.length <= 1;
    slideImg.src = currentImages[0];
    slideImg.classList.remove("is-fading");
    slideshow.hidden = false;
    preloadSlides(currentImages);
  } else {
    slideshow.hidden = true;
  }

  const { period, badge, title, desc, chips } = getCardContent(card);
  modalPeriod.textContent = period;
  modalTitle.textContent  = title;
  modalDesc.textContent   = desc;
  modalBadge.textContent  = badge;
  modalBadge.hidden       = !badge;
  modalChips.innerHTML    = chips.map((c) => `<span>${c}</span>`).join("");
  modalChips.hidden       = chips.length === 0;

  detailOpenBtn.hidden = currentImages.length === 0;

  modalOverlay.removeAttribute("hidden");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modalOverlay.setAttribute("hidden", "");
  document.body.style.overflow = "";
}

function initCardModals() {
  document.querySelectorAll(".work-card, .aside-item").forEach((card) => {
    card.addEventListener("click", () => {
      if (card.closest(".work-grid, .aside-grid")?.dataset.dragging === "1") return;
      openModal(card);
    });
  });
}

modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) closeModal();
});
modalOverlay.querySelector(".modal-close").addEventListener("click", closeModal);

// ── Detail View ────────────────────────────────────────
const detailOverlay = document.getElementById("detail");
const detailPeriod  = detailOverlay.querySelector(".detail-period");
const detailBadge   = detailOverlay.querySelector(".detail-badge");
const detailTitle   = detailOverlay.querySelector(".detail-title");
const detailDesc    = detailOverlay.querySelector(".detail-desc");
const detailChips   = detailOverlay.querySelector(".detail-chips");
const detailArticle = detailOverlay.querySelector(".detail-article");
const detailGallery = detailOverlay.querySelector(".detail-gallery");

function getActiveLang() {
  return localStorage.getItem("lang") || "ja";
}

function escapeHtml(value) {
  return value.replace(/[&<>"]/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
  }[char]));
}

async function fetchArticleMarkdown(slug, lang) {
  const article = await fetchArticleFile(slug, lang);
  return article.body;
}


function isSingleImageParagraph(paragraph) {
  return paragraph.children.length === 1 && paragraph.firstElementChild?.tagName === "IMG";
}

function isCaptionParagraph(paragraph) {
  return paragraph?.children.length === 1 && paragraph.firstElementChild?.tagName === "EM";
}

function classifyArticleFigure(figure, image) {
  const apply = () => {
    const isPortrait = image.naturalHeight > image.naturalWidth * 1.12;
    figure.classList.toggle("is-portrait", isPortrait);
    figure.classList.toggle("is-landscape", !isPortrait);
  };

  if (image.complete && image.naturalWidth) {
    apply();
  } else {
    image.addEventListener("load", apply, { once: true });
  }
}

function enhanceArticleMedia() {
  detailArticle.querySelectorAll("p").forEach((paragraph) => {
    if (!isSingleImageParagraph(paragraph)) return;

    const image = paragraph.firstElementChild;
    const captionParagraph = paragraph.nextElementSibling;
    const figure = document.createElement("figure");
    figure.className = "article-figure is-landscape";

    paragraph.before(figure);
    figure.append(image);

    if (isCaptionParagraph(captionParagraph)) {
      const caption = document.createElement("figcaption");
      caption.textContent = captionParagraph.textContent.trim();
      figure.append(caption);
      captionParagraph.remove();
    }

    paragraph.remove();
    classifyArticleFigure(figure, image);
  });
}

function processInstagramEmbeds() {
  if (!detailArticle.querySelector(".instagram-media")) return;
  window.instgrm?.Embeds?.process();
}

async function loadDetailArticle(card) {
  const slug = card.dataset.article;
  if (!slug) {
    detailArticle.hidden = true;
    detailArticle.innerHTML = "";
    return;
  }

  detailArticle.hidden = false;
  detailArticle.innerHTML = `<p class="article-loading">${getActiveLang() === "ja" ? "記事を読み込んでいます..." : "Loading article..."}</p>`;

  const markdown = await fetchArticleMarkdown(slug, getActiveLang());
  if (!markdown.trim()) {
    detailArticle.innerHTML = `<p class="article-loading">${getActiveLang() === "ja" ? "記事は準備中です。" : "Article coming soon."}</p>`;
    return;
  }

  detailArticle.innerHTML = window.marked
    ? marked.parse(markdown)
    : `<pre>${escapeHtml(markdown)}</pre>`;

  enhanceArticleMedia();
  processInstagramEmbeds();
}


function parseJsonList(value) {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function getGalleryCaptions(card) {
  const lang = getActiveLang();
  return parseJsonList(card.dataset[`captions${lang.charAt(0).toUpperCase() + lang.slice(1)}`]);
}

async function openDetailView(card) {
  const { period, badge, title, desc, chips } = getCardContent(card);
  detailPeriod.textContent = period;
  detailTitle.textContent  = title;
  detailDesc.textContent   = desc;
  detailBadge.textContent  = badge;
  detailBadge.hidden       = !badge;
  detailChips.innerHTML    = chips.map((c) => `<span>${c}</span>`).join("");
  detailChips.hidden       = chips.length === 0;

  const galleryCaptions = getGalleryCaptions(card);
  detailGallery.innerHTML = currentImages
    .map((src, i) => {
      const caption = galleryCaptions[i] || "";
      return `
        <figure class="detail-gallery-item">
          <img src="${src}" alt="${caption || `photo ${i + 1}`}" loading="lazy">
          ${caption ? `<figcaption>${caption}</figcaption>` : ""}
        </figure>
      `;
    })
    .join("");

  closeModal();
  detailOverlay.removeAttribute("hidden");
  detailOverlay.scrollTop = 0;
  document.body.style.overflow = "hidden";
  await loadDetailArticle(card);
}

detailOpenBtn.addEventListener("click", () => {
  if (!currentCard) return;
  openDetailView(currentCard);
});

langButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (!detailOverlay.hasAttribute("hidden") && currentCard) {
      openDetailView(currentCard);
    }
  });
});

detailOverlay.querySelector(".detail-back").addEventListener("click", () => {
  detailOverlay.setAttribute("hidden", "");
  document.body.style.overflow = "";
  if (currentCard) openModal(currentCard);
});

// ── Skill tags: show-more toggle ──────────────────────
document.querySelectorAll(".skill-tags").forEach((tags) => {
  if (tags.querySelectorAll("span").length <= 5) return;

  tags.classList.add("collapsed");

  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "show-more-btn";

  const update = (collapsed) => {
    const l = localStorage.getItem("lang") || "ja";
    btn.textContent = collapsed
      ? (l === "ja" ? "もっと見る ▾" : "Show more ▾")
      : (l === "ja" ? "閉じる ▴"   : "Show less ▴");
  };

  update(true);

  btn.addEventListener("click", () => {
    const collapsed = tags.classList.toggle("collapsed");
    update(collapsed);
  });

  tags.after(btn);
});

// ── Story chapter toggles ─────────────────────────────
document.querySelectorAll(".chapter-toggle").forEach((btn) => {
  const events = btn.previousElementSibling; // .chapter-events
  btn.addEventListener("click", () => {
    const isHidden = events.hasAttribute("hidden");
    if (isHidden) {
      events.removeAttribute("hidden");
      const l = localStorage.getItem("lang") || "ja";
      btn.textContent = l === "ja" ? "閉じる ▴" : "Close ▴";
    } else {
      events.setAttribute("hidden", "");
      const l = localStorage.getItem("lang") || "ja";
      btn.textContent = l === "ja" ? "詳細を見る ▾" : "Details ▾";
    }
  });
});


renderPortfolioCards()
  .then(() => {
    initCardSliders();
    initCardModals();
  })
  .catch(showPortfolioLoadError);

// ── Keyboard ───────────────────────────────────────────
document.addEventListener("keydown", (e) => {
  if (!modalOverlay.hasAttribute("hidden")) {
    if (e.key === "Escape")      closeModal();
    if (e.key === "ArrowLeft")   showSlide(currentIndex - 1);
    if (e.key === "ArrowRight")  showSlide(currentIndex + 1);
  }
  if (!detailOverlay.hasAttribute("hidden") && e.key === "Escape") {
    detailOverlay.setAttribute("hidden", "");
    document.body.style.overflow = "";
    if (currentCard) openModal(currentCard);
  }
});
