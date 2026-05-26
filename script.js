const yearNode = document.querySelector("#year");
if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
const reduceMotion = reduceMotionQuery.matches;
const root = document.documentElement;
const body = document.body;
const navigationEntry = performance.getEntriesByType("navigation")[0];
const isReload = navigationEntry
  ? navigationEntry.type === "reload"
  : window.performance?.navigation?.type === 1;

if (isReload && !window.location.hash) {
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  window.addEventListener(
    "load",
    () => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      });
    },
    { once: true }
  );
}

requestAnimationFrame(() => {
  body.classList.add("is-ready");
});

window.addEventListener(
  "load",
  () => {
    body.classList.add("is-ready");
  },
  { once: true }
);

const revealNodes = document.querySelectorAll(".reveal");

if (reduceMotion) {
  revealNodes.forEach((node) => node.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle("is-visible", entry.isIntersecting);
      });
    },
    {
      threshold: 0.12,
      rootMargin: "-8% 0px -8% 0px"
    }
  );

  revealNodes.forEach((node, index) => {
    node.style.transitionDelay = `${Math.min(index * 55, 220)}ms`;
    revealObserver.observe(node);
  });
}

document.addEventListener(
  "pointermove",
  (event) => {
    root.style.setProperty("--pointer-x", `${event.clientX}px`);
    root.style.setProperty("--pointer-y", `${event.clientY}px`);

    if (resumePreview) {
      const bounds = resumePreview.getBoundingClientRect();
      const isOverResumePreview =
        event.clientX >= bounds.left &&
        event.clientX <= bounds.right &&
        event.clientY >= bounds.top &&
        event.clientY <= bounds.bottom;

      body.classList.toggle("is-over-resume-preview", isOverResumePreview);
    }
  },
  { passive: true }
);

const resumePreview = document.querySelector(".resume-preview");

if (resumePreview) {
  const hideBloom = () => body.classList.add("is-over-resume-preview");
  const showBloom = () => body.classList.remove("is-over-resume-preview");

  resumePreview.addEventListener("pointerenter", hideBloom);
  resumePreview.addEventListener("pointerleave", showBloom);
  resumePreview.addEventListener("focusin", hideBloom);
  resumePreview.addEventListener("focusout", showBloom);
  window.addEventListener("scroll", showBloom, { passive: true });
}

const sceneNodes = document.querySelectorAll("[data-scene]");

if (!reduceMotion) {
  const updateScenes = () => {
    const viewportHeight = window.innerHeight;

    sceneNodes.forEach((node) => {
      const rect = node.getBoundingClientRect();
      const centered = ((rect.top + rect.height / 2) - viewportHeight / 2) / viewportHeight;
      const shift = centered * -48;
      const spin = centered * -1.8;

      node.style.setProperty("--scene-shift", `${shift.toFixed(2)}px`);
      node.style.setProperty("--scene-shift-reverse", `${(-shift).toFixed(2)}px`);
      node.style.setProperty("--scene-card-shift", `${(shift * 0.18).toFixed(2)}px`);
      node.style.setProperty("--scene-spin", `${spin.toFixed(2)}deg`);
    });

    window.requestAnimationFrame(updateScenes);
  };

  window.requestAnimationFrame(updateScenes);
}

const tiltCards = document.querySelectorAll("[data-tilt]");

tiltCards.forEach((card) => {
  const resetCard = () => {
    card.style.setProperty("--tilt-x", "0deg");
    card.style.setProperty("--tilt-y", "0deg");
    card.style.setProperty("--hover-lift", "0px");
    card.style.setProperty("--glow-x", "50%");
    card.style.setProperty("--glow-y", "50%");
  };

  resetCard();

  if (reduceMotion) {
    return;
  }

  card.addEventListener("pointermove", (event) => {
    const bounds = card.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    const rotateY = (x - 0.5) * 10;
    const rotateX = (0.5 - y) * 10;

    card.style.setProperty("--tilt-x", `${rotateY.toFixed(2)}deg`);
    card.style.setProperty("--tilt-y", `${rotateX.toFixed(2)}deg`);
    card.style.setProperty("--hover-lift", "-10px");
    card.style.setProperty("--glow-x", `${(x * 100).toFixed(2)}%`);
    card.style.setProperty("--glow-y", `${(y * 100).toFixed(2)}%`);
  });

  card.addEventListener("pointerleave", resetCard);
});
