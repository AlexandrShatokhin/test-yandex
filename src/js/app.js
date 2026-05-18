const stagesInit = () => {
  const carousel = document.querySelector(".stages__carousel");
  const grid = document.querySelector(".stages__grid");
  const dotsContainer = document.querySelector(".stages__dots");
  const prevBtn = document.getElementById("stages-prev");
  const nextBtn = document.getElementById("stages-next");

  if (!carousel || !grid || !dotsContainer) return;

  const state = {
    mode: null,
    current: 0,
  };

  let track = null;
  let dots = [];
  let handlers = null;

  const sourceCards = Array.from(document.querySelectorAll(".stages__card")).map((el) => el.cloneNode(true));

  const createEl = (tag, className) => {
    const el = document.createElement(tag);
    if (className) el.className = className;
    return el;
  };

  const groupCards = (cards) => [[cards[0], cards[1]], [cards[2]], [cards[3], cards[4]], [cards[5]], [cards[6]]];

  const buildSlides = (groups) =>
    groups.map((group) => {
      const slide = createEl("div", "stages__slide stages__mobile-group");
      group.forEach((card) => slide.appendChild(card));
      return slide;
    });

  const updateButtons = (index, totalSlides) => {
    if (prevBtn) prevBtn.disabled = index === 0;
    if (nextBtn) nextBtn.disabled = index === totalSlides - 1;
  };

  const renderDots = (count) =>
    Array.from({ length: count }, (_, i) => {
      const dot = createEl("button", "stages__dot");
      dot.type = "button";
      dot.dataset.index = i;
      return dot;
    });

  const setActive = (index, slidesCount) => {
    track.style.transform = `translateX(-${index * 100}%)`;

    dots.forEach((d, i) => d.classList.toggle("active", i === index));

    updateButtons(index, slidesCount);
  };

  const mountMobile = () => {
    track = createEl("div", "stages__track");

    const slides = buildSlides(groupCards(sourceCards));

    slides.forEach((s) => track.appendChild(s));
    carousel.insertBefore(track, grid);

    dots = renderDots(slides.length);
    dots.forEach((d) => dotsContainer.appendChild(d));

    const update = (i) => {
      state.current = (i + slides.length) % slides.length;
      setActive(state.current, slides.length);
    };

    const next = () => update(state.current + 1);
    const prev = () => update(state.current - 1);
    const dot = (e) => update(Number(e.target.dataset.index));

    nextBtn.addEventListener("click", next);
    prevBtn.addEventListener("click", prev);
    dots.forEach((d) => d.addEventListener("click", dot));

    handlers = { next, prev, dot };

    update(0);
  };

  const unmountMobile = () => {
    if (track) {
      track.remove();
      track = null;
    }

    dots.forEach((d) => d.remove());
    dots = [];

    if (handlers) {
      nextBtn.removeEventListener("click", handlers.next);
      prevBtn.removeEventListener("click", handlers.prev);
    }

    handlers = null;
  };

  const setMode = (mode) => {
    if (state.mode === mode) return;

    if (mode === "mobile") {
      grid.style.display = "none";
      mountMobile();
    }

    if (mode === "desktop") {
      unmountMobile();
      grid.style.display = "grid";
    }

    state.mode = mode;
  };

  const mq = window.matchMedia("(max-width: 1365px)");

  const handleMedia = (e) => {
    setMode(e.matches ? "mobile" : "desktop");
  };

  handleMedia(mq);
  mq.addEventListener("change", handleMedia);
};

document.addEventListener("DOMContentLoaded", stagesInit);

const participantsInit = () => {
  const wrapper = document.querySelector(".participants__wrapper");
  const carousel = document.querySelector(".participants__carousel");
  const cards = Array.from(document.querySelectorAll(".participants__card"));
  const prevBtn = document.getElementById("participants-prev");
  const nextBtn = document.getElementById("participants-next");
  const currentSpan = document.querySelector(".participants__current");
  const totalSpan = document.querySelector(".participants__total");

  if (!wrapper || !carousel || !cards.length) return;

  const state = {
    currentIndex: 0,
    cardsPerView: 0,
    totalCards: cards.length,
  };

  const getCardsPerView = () => (window.innerWidth >= 1366 ? 3 : 1);

  const getTotalSlides = () => Math.ceil(state.totalCards / state.cardsPerView);

  const setPosition = (index) => {
    const cardWidth = cards[0].offsetWidth;
    const shift = index * cardWidth * state.cardsPerView;
    wrapper.style.transform = `translateX(-${shift}px)`;
  };

  const updateCounter = () => {
    const endCard = Math.min((state.currentIndex + 1) * state.cardsPerView, state.totalCards);

    if (currentSpan) {
      currentSpan.textContent = endCard;
    }
  };

  const updateCarousel = () => {
    setPosition(state.currentIndex);
    updateCounter();
  };

  const next = () => {
  const totalSlides = getTotalSlides();

  state.currentIndex =
    (state.currentIndex + 1) % totalSlides;

  updateCarousel();
};

const prev = () => {
  const totalSlides = getTotalSlides();

  state.currentIndex =
    (state.currentIndex - 1 + totalSlides) % totalSlides;

  updateCarousel();
};

  const adjustIndex = () => {
    const totalSlides = getTotalSlides();
    const maxIndex = Math.max(0, totalSlides - 1);

    state.currentIndex = Math.min(state.currentIndex, maxIndex);
  };

  const handleResize = () => {
    const newCardsPerView = getCardsPerView();

    if (newCardsPerView !== state.cardsPerView) {
      state.cardsPerView = newCardsPerView;
      adjustIndex();
      updateCarousel();
    }
  };

  const init = () => {
    state.cardsPerView = getCardsPerView();

    if (totalSpan) {
      totalSpan.textContent = `/ ${state.totalCards}`;
    }

    if (prevBtn) prevBtn.addEventListener("click", prev);
    if (nextBtn) nextBtn.addEventListener("click", next);

    window.addEventListener("resize", handleResize);

    updateCarousel();
  };

  init();
};

document.addEventListener("DOMContentLoaded", participantsInit);

const moveSpan = () => {
  const span = document.querySelector(".lecture__heading--remove");
  const mobileContainer = document.querySelector(".lecture__heading--mobile");
  const originalContainer = document.querySelector(".lecture__heading:not(.lecture__heading--mobile)");

  if (!span || !mobileContainer || !originalContainer) return;

  if (window.innerWidth < 1366) {
    if (!mobileContainer.contains(span)) {
      mobileContainer.appendChild(span);
    }
  } else {
    if (!originalContainer.contains(span)) {
      originalContainer.appendChild(span);
    }
  }
};

moveSpan();
window.addEventListener("resize", moveSpan);
