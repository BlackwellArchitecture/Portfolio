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
    }
  });
});
