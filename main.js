document.addEventListener("DOMContentLoaded", function () {
  // Coffee Menu Carousel Code
  const categoryButtons = document.querySelectorAll(".category");
  const coffeeItems = document.querySelectorAll(".coffee-item");
  const coffeeMenu = document.querySelector(".coffee-menu");
  const prevButton = document.querySelector(".carousel-nav.prev");
  const nextButton = document.querySelector(".carousel-nav.next");
  const dots = document.querySelectorAll(".dot");
  const favoriteButtons = document.querySelectorAll(".favorite-btn");
  let currentCategory = "coffee";
  let currentSlideIndex = 0;
  let itemsPerCategory = {};
  let items = [];

  categoryButtons.forEach((btn) => {
    const category = btn.getAttribute("data-category");
    itemsPerCategory[category] = document.querySelectorAll(
      `.coffee-item[data-category="${category}"]`
    ).length;
  });

  function updateCategory(category) {
    currentCategory = category;
    currentSlideIndex = 0;

    categoryButtons.forEach((btn) => {
      if (btn.getAttribute("data-category") === category) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });

    coffeeItems.forEach((item) => {
      item.classList.remove("category-active", "active", "middle");
      item.style.display = "none";
    });

    items = Array.from(
      document.querySelectorAll(`.coffee-item[data-category="${category}"]`)
    );

    items.forEach(item => {
      item.classList.add("category-active");
    });

    if (items.length === 0) {
      console.log("No items found for category:", category);
    } else {
      console.log(`Found ${items.length} items for category: ${category}`);
    }

    updateCarousel();
    updateDots();
  }

  function updateCarousel() {
    if (items.length === 0) return;

    items.forEach((item) => {
      item.classList.remove("active", "middle");
      item.style.transform = "scale(1)";
      item.style.opacity = "0.7";
      item.style.zIndex = "1";
      item.style.display = "none";
    });

    const prevIndex = (currentSlideIndex - 1 + items.length) % items.length;
    const nextIndex = (currentSlideIndex + 1) % items.length;

    if (items[prevIndex]) {
      items[prevIndex].classList.add("active");
      items[prevIndex].style.display = "block";
      items[prevIndex].style.left = "0";
      items[prevIndex].style.transform = "translateX(0)";
    }

    if (items[currentSlideIndex]) {
      items[currentSlideIndex].classList.add("active", "middle");
      items[currentSlideIndex].style.display = "block";
      items[currentSlideIndex].style.opacity = "1";
      items[currentSlideIndex].style.zIndex = "2";
      items[currentSlideIndex].style.left = "50%";
      items[currentSlideIndex].style.transform = "translateX(-50%) scale(1.2)";
    }

    if (items[nextIndex]) {
      items[nextIndex].classList.add("active");
      items[nextIndex].style.display = "block";
      items[nextIndex].style.left = "100%";
      items[nextIndex].style.transform = "translateX(-100%)";
    }
  }

  function updateDots() {
    if (items.length === 0) return;

    for (let i = 0; i < dots.length; i++) {
      if (i < 5) {
        dots[i].style.display = "inline-block";
        const dotPosition = Math.floor(currentSlideIndex % 5);
        dots[i].classList.toggle("active", i === dotPosition);
      } else {
        dots[i].style.display = "none";
      }
    }
  }

  categoryButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const category = btn.getAttribute("data-category");
      updateCategory(category);
    });
  });

  prevButton.addEventListener("click", () => {
    if (items.length === 0) return;
    currentSlideIndex = (currentSlideIndex - 1 + items.length) % items.length;
    updateCarousel();
    updateDots();
  });

  nextButton.addEventListener("click", () => {
    if (items.length === 0) return;
    currentSlideIndex = (currentSlideIndex + 1) % items.length;
    updateCarousel();
    updateDots();
  });

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      if (items.length > 0) {
        const currentPage = Math.floor(currentSlideIndex / 5);
        currentSlideIndex = (currentPage * 5 + index) % items.length;
        updateCarousel();
        updateDots();
      }
    });
  });

  favoriteButtons.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      this.classList.toggle("active");
      const svg = this.querySelector("svg");
      if (this.classList.contains("active")) {
        svg.setAttribute("fill", "white");
      } else {
        svg.setAttribute("fill", "none");
      }
    });
  });

  updateCategory(currentCategory);

  // Testimonial Carousel Code
  const carousel = document.querySelector('.testimonial-carousel');
  const container = document.querySelector('.testimonial-carousel-container');
  const slidesNodeList = document.querySelectorAll('.testimonial-slide');
  const testimonialSection = document.querySelector('.testimonials');
  const originalSlides = Array.from(slidesNodeList);
  const slideCount = originalSlides.length;
  const slideWidth = originalSlides[0].offsetWidth;
  const slideGap = 30;
  const totalSlideWidth = slideWidth + slideGap;

  document.querySelectorAll('.testimonial-slide.clone').forEach(clone => clone.remove());

  for (let i = 0; i < slideCount; i++) {
    const endClone = originalSlides[i].cloneNode(true);
    endClone.classList.add('clone');
    carousel.appendChild(endClone);

    const startClone = originalSlides[slideCount - 1 - i].cloneNode(true);
    startClone.classList.add('clone');
    carousel.insertBefore(startClone, carousel.firstChild);
  }

  let position = -slideCount * totalSlideWidth;
  carousel.style.transform = `translateX(${position}px)`;

  let animationId = null;
  let isPaused = false;
  let lastTimestamp = 0;

  function resetPosition() {
    const currentSlideIndex = Math.round(Math.abs(position) / totalSlideWidth) % (slideCount * 3);

    if (currentSlideIndex >= slideCount * 2) {
      const newPosition = -((currentSlideIndex - slideCount) * totalSlideWidth);
      position = newPosition;
      carousel.style.transition = 'none';
      carousel.style.transform = `translateX(${position}px)`;
      void carousel.offsetWidth;
      carousel.style.transition = 'transform 0.5s ease';
    } else if (currentSlideIndex < slideCount) {
      const newPosition = -((currentSlideIndex + slideCount) * totalSlideWidth);
      position = newPosition;
      carousel.style.transition = 'none';
      carousel.style.transform = `translateX(${position}px)`;
      void carousel.offsetWidth;
      carousel.style.transition = 'transform 0.5s ease';
    }
  }

  function moveCarousel(timestamp) {
    if (!lastTimestamp || timestamp - lastTimestamp > 100) {
      lastTimestamp = timestamp;
      animationId = requestAnimationFrame(moveCarousel);
      return;
    }

    if (!isPaused) {
      const elapsed = timestamp - lastTimestamp;
      const pixelsToMove = 0.25 * (elapsed / 16.67);
      position -= pixelsToMove;
      carousel.style.transform = `translateX(${position}px)`;

      if (Math.random() < 0.05) {
        resetPosition();
      }
    }

    lastTimestamp = timestamp;
    animationId = requestAnimationFrame(moveCarousel);
  }

  carousel.style.transition = 'transform 0.5s ease';

  setTimeout(() => {
    lastTimestamp = 0;
    animationId = requestAnimationFrame(moveCarousel);
  }, 100);

  testimonialSection.addEventListener('mouseenter', () => {
    isPaused = true;
  });

  testimonialSection.addEventListener('mouseleave', () => {
    isPaused = false;
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animationId);
      animationId = null;
    } else if (!animationId) {
      lastTimestamp = 0;
      animationId = requestAnimationFrame(moveCarousel);
    }
  });

  window.addEventListener('resize', () => {
    const newSlideWidth = originalSlides[0].offsetWidth;
    const newTotalSlideWidth = newSlideWidth + slideGap;
    const currentSlideIndex = Math.round(Math.abs(position) / totalSlideWidth);
    position = -(currentSlideIndex * newTotalSlideWidth);
    carousel.style.transform = `translateX(${position}px)`;
  });
});

