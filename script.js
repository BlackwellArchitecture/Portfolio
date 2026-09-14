// Aliases array: using base name "Blackwell" so "'s" stays with the white suffix instead of taking the blue accent
const aliases = [
  "ikazune",
  "NORTHSTAR",
  "VaporWave",
  "Blackwell"
];

let currentIndex = 0;
const aliasElement = document.getElementById("alias");

function updateDocumentTitle() {
  const currentAlias = aliases[currentIndex];
  document.title = `${currentAlias}'s Portfolio`;
}

function cycleAlias() {
  if (!aliasElement) return;

  // Slide current alias upward and fade out
  aliasElement.classList.add("slide-out");

  setTimeout(() => {
    // Advance index
    currentIndex = (currentIndex + 1) % aliases.length;
    const nextAlias = aliases[currentIndex];

    // Update text
    aliasElement.textContent = nextAlias;
    updateDocumentTitle();

    // Reset position below (translateY 100%) without animation
    aliasElement.classList.remove("slide-out");
    aliasElement.classList.add("prepare-in");

    // Force browser reflow
    void aliasElement.offsetHeight;

    // Slide up into view
    aliasElement.classList.remove("prepare-in");
  }, 450);
}

// Initial title setup
updateDocumentTitle();

// Change alias every 10 seconds
setInterval(cycleAlias, 10000);

// Tab switching
const tabButtons = document.querySelectorAll(".tab-btn");
const tabPanes = document.querySelectorAll(".tab-pane");

tabButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const targetId = btn.getAttribute("data-tab");

    // Remove active class from buttons & panes
    tabButtons.forEach((b) => b.classList.remove("active"));
    tabPanes.forEach((pane) => pane.classList.remove("active"));

    // Activate selected button and target pane
    btn.classList.add("active");
    const targetPane = document.getElementById(targetId);
    if (targetPane) {
      targetPane.classList.add("active");
      if (targetId === "tab-graphics") {
        updateArtCollageRatios();
      }
    }
  });
});

// Dynamic Star System Generator (Strictly SVG vectors, no emojis)
function generateStars(rating) {
  const maxStars = 5;
  const starPath = "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z";
  let html = "";

  for (let i = 1; i <= maxStars; i++) {
    if (rating >= i) {
      // Full star
      html += `<svg class="star-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="${starPath}" fill="var(--star-color)" /></svg>`;
    } else if (rating >= i - 0.5) {
      // Half star
      html += `<svg class="star-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="${starPath}" fill="url(#half-star-grad)" stroke="var(--border-color)" stroke-width="0.5" /></svg>`;
    } else {
      // Empty star
      html += `<svg class="star-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="${starPath}" fill="var(--star-empty)" stroke="var(--border-color)" stroke-width="0.5" /></svg>`;
    }
  }
  return html;
}

// Render stars
document.querySelectorAll(".stars-row").forEach((el) => {
  const rating = parseFloat(el.getAttribute("data-rating"));
  if (!isNaN(rating)) {
    el.innerHTML = generateStars(rating);
  }
});

// Dynamic experience calculations
function initExperienceStats() {
  const now = new Date();

  // Graphic Design: Started 2019
  const gdYears = now.getFullYear() - 2019;
  const gdElement = document.getElementById("graphic-design-meta");
  if (gdElement) {
    gdElement.textContent = `(${gdYears} years of experience)`;
  }

  // Website Development: Started August 2026 (Month 7 in 0-indexed JS Date)
  const startYear = 2026;
  const startMonth = 7;
  const totalMonths = (now.getFullYear() - startYear) * 12 + (now.getMonth() - startMonth);
  const webDevElement = document.getElementById("web-dev-meta");

  if (webDevElement) {
    if (totalMonths <= 0) {
      webDevElement.textContent = "(Started August 2026, < 1 month of experience)";
    } else if (totalMonths < 12) {
      webDevElement.textContent = `(Started August 2026, ${totalMonths} month${totalMonths > 1 ? "s" : ""} of experience)`;
    } else {
      const yrs = Math.floor(totalMonths / 12);
      const rem = totalMonths % 12;
      const remStr = rem > 0 ? `, ${rem} mo` : "";
      webDevElement.textContent = `(Started August 2026, ${yrs} yr${yrs > 1 ? "s" : ""}${remStr} of experience)`;
    }
  }
}

initExperienceStats();

// Dynamic Aspect-Ratio Collage Layout
function updateArtCollageRatios() {
  const artItems = document.querySelectorAll(".art-item");
  artItems.forEach((item) => {
    const img = item.querySelector(".art-img");
    if (!img) return;

    function applyRatio() {
      if (img.naturalWidth && img.naturalHeight) {
        const ratio = img.naturalWidth / img.naturalHeight;
        // flex: <flex-grow> <flex-shrink> <flex-basis>
        item.style.flex = `${ratio.toFixed(3)} ${ratio.toFixed(3)} ${Math.round(200 * ratio)}px`;
      }
    }

    if (img.complete && img.naturalWidth > 0) {
      applyRatio();
    } else {
      img.addEventListener("load", applyRatio, { once: true });
    }
  });
}

// Initial check for collage
updateArtCollageRatios();

// Lightbox Modal Handling
const artModal = document.getElementById("art-modal");
const modalImg = document.getElementById("modal-img");
const modalClose = document.getElementById("modal-close");
const modalBackdrop = document.getElementById("modal-backdrop");

function openArtwork(src, alt) {
  if (!artModal || !modalImg) return;
  modalImg.src = src;
  modalImg.alt = alt || "Enlarged Artwork";
  artModal.classList.add("open");
  artModal.setAttribute("aria-hidden", "false");
}

function closeArtwork() {
  if (!artModal || !modalImg) return;
  artModal.classList.remove("open");
  artModal.setAttribute("aria-hidden", "true");
  modalImg.src = "";
}

document.querySelectorAll(".art-item").forEach((item) => {
  item.addEventListener("click", () => {
    const src = item.getAttribute("data-src");
    const img = item.querySelector(".art-img");
    openArtwork(src, img ? img.alt : "");
  });
});

if (modalClose) modalClose.addEventListener("click", closeArtwork);
if (modalBackdrop) modalBackdrop.addEventListener("click", closeArtwork);

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && artModal && artModal.classList.contains("open")) {
    closeArtwork();
  }
});
