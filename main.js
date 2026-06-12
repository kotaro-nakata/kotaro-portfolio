// ── Background gradient follows cursor ────────────────
(function () {
  let tx = 15, ty = 15;
  let cx = 15, cy = 15;

  document.addEventListener("mousemove", (e) => {
    tx = (e.clientX / window.innerWidth)  * 100;
    ty = (e.clientY / window.innerHeight) * 100;
  });

  const root = document.documentElement;
  (function tick() {
    cx += (tx - cx) * 0.055;
    cy += (ty - cy) * 0.055;
    root.style.setProperty("--gx", cx.toFixed(2) + "%");
    root.style.setProperty("--gy", cy.toFixed(2) + "%");
    root.style.setProperty("--ax", (100 - cx).toFixed(2) + "%");
    root.style.setProperty("--ay", (100 - cy).toFixed(2) + "%");
    requestAnimationFrame(tick);
  })();
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

function showSlide(i) {
  currentIndex = (i + currentImages.length) % currentImages.length;
  slideImg.classList.add("is-fading");
  setTimeout(() => {
    slideImg.src = currentImages[currentIndex];
    slideImg.classList.remove("is-fading");
  }, 180);
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
    dotsContainer.innerHTML = currentImages.length > 1
      ? currentImages.map((_, i) => `<button class="dot${i === 0 ? " active" : ""}" aria-label="画像${i + 1}"></button>`).join("")
      : "";
    slidePrev.hidden = currentImages.length <= 1;
    slideNext.hidden = currentImages.length <= 1;
    slideImg.src = currentImages[0];
    slideImg.classList.remove("is-fading");
    slideshow.hidden = false;
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

  detailOpenBtn.hidden = currentImages.length === 0;

  modalOverlay.removeAttribute("hidden");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modalOverlay.setAttribute("hidden", "");
  document.body.style.overflow = "";
}

document.querySelectorAll(".work-card, .aside-item").forEach((card) => {
  card.addEventListener("click", () => openModal(card));
});

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
const detailGallery = detailOverlay.querySelector(".detail-gallery");

detailOpenBtn.addEventListener("click", () => {
  if (!currentCard) return;

  const { period, badge, title, desc, chips } = getCardContent(currentCard);
  detailPeriod.textContent = period;
  detailTitle.textContent  = title;
  detailDesc.textContent   = desc;
  detailBadge.textContent  = badge;
  detailBadge.hidden       = !badge;
  detailChips.innerHTML    = chips.map((c) => `<span>${c}</span>`).join("");

  detailGallery.innerHTML = currentImages
    .map((src, i) => `<img src="${src}" alt="photo ${i + 1}" loading="lazy">`)
    .join("");

  closeModal();
  detailOverlay.removeAttribute("hidden");
  detailOverlay.scrollTop = 0;
  document.body.style.overflow = "hidden";
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
