const aliases = [
  "ikazune",
  "NORTHSTAR",
  "VaporWave",
  "Blackwell's"
];

let currentIndex = 0;
const aliasElement = document.getElementById("alias");
const suffixElement = document.getElementById("title-suffix");

function getSuffix(alias) {
  return alias.endsWith("'s") ? " Portfolio" : "'s Portfolio";
}

function updateTitle() {
  const currentAlias = aliases[currentIndex];
  const suffix = getSuffix(currentAlias);
  document.title = `${currentAlias}${suffix}`;
  if (suffixElement) {
    suffixElement.textContent = suffix;
  }
}

function cycleAlias() {
  // Slide current alias upward and fade out
  aliasElement.classList.add("slide-out");

  setTimeout(() => {
    // Advance index
    currentIndex = (currentIndex + 1) % aliases.length;
    const nextAlias = aliases[currentIndex];

    // Update text
    aliasElement.textContent = nextAlias;
    updateTitle();

    // Reset position to below (translateY 100%) without animation
    aliasElement.classList.remove("slide-out");
    aliasElement.classList.add("prepare-in");

    // Force browser reflow
    void aliasElement.offsetHeight;

    // Slide up into view to translateY(0)
    aliasElement.classList.remove("prepare-in");
  }, 450);
}

// Initial title setup
updateTitle();

// Change every 10 seconds
setInterval(cycleAlias, 10000);
