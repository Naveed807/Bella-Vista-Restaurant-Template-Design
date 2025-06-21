// =================================
// UTILITY FUNCTIONS
// =================================

// Unified Intersection Observer utility
function createObserver(options = {}, callback) {
  const defaultOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observerOptions = { ...defaultOptions, ...options };

  return new IntersectionObserver(callback, observerOptions);
}

// Smooth scrolling utility
function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
}

// Generic fade-in animation observer
function initFadeInObserver() {
  const observer = createObserver({ threshold: 0.1 }, (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  });

  return observer;
}

// Generic animation play state observer
function initAnimationObserver() {
  const observer = createObserver({ threshold: 0.1 }, (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = "running";
      }
    });
  });

  return observer;
}

// Generic hover effects utility
function addHoverEffects(
  selector,
  hoverTransform = "translateY(-5px)",
  normalTransform = "translateY(0)"
) {
  document.querySelectorAll(selector).forEach((element) => {
    element.addEventListener("mouseenter", function () {
      this.style.transform = hoverTransform;
    });

    element.addEventListener("mouseleave", function () {
      this.style.transform = normalTransform;
    });
  });
}

// =================================
// NAVIGATION & HEADER
// =================================

class NavigationManager {
  constructor() {
    this.mobileMenuToggle = document.getElementById("mobileMenuToggle");
    this.mobileMenu = document.getElementById("mobileMenu");
    this.mobileMenuIcon = this.mobileMenuToggle?.querySelector("i");
    this.header = document.querySelector(".header");
    this.navLinks = document.querySelectorAll(".nav-link, .mobile-nav-link");
    this.lastScrollTop = 0;

    this.init();
  }

  init() {
    this.initMobileMenu();
    this.initScrollHeader();
    this.initActiveNavigation();
    this.initClickOutside();
  }

  initMobileMenu() {
    if (!this.mobileMenuToggle) return;

    this.mobileMenuToggle.addEventListener("click", () => {
      this.toggleMobileMenu();
    });
  }

  toggleMobileMenu() {
    this.mobileMenu.classList.toggle("active");
    this.mobileMenuIcon.className = this.mobileMenu.classList.contains("active")
      ? "fas fa-times"
      : "fas fa-bars";
  }

  closeMobileMenu() {
    if (this.mobileMenu.classList.contains("active")) {
      this.mobileMenu.classList.remove("active");
      this.mobileMenuIcon.className = "fas fa-bars";
    }
  }

  initScrollHeader() {
    if (!this.header) return;

    window.addEventListener("scroll", () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;

      if (scrollTop > this.lastScrollTop && scrollTop > 100) {
        this.header.classList.add("hidden");
      } else {
        this.header.classList.remove("hidden");
      }

      this.lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });
  }

  initActiveNavigation() {
    this.navLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        this.navLinks.forEach((l) => l.classList.remove("active"));
        e.target.classList.add("active");
        this.closeMobileMenu();
      });
    });
  }

  initClickOutside() {
    document.addEventListener("click", (e) => {
      if (
        !this.mobileMenu.contains(e.target) &&
        !this.mobileMenuToggle.contains(e.target)
      ) {
        this.closeMobileMenu();
      }
    });
  }
}

// =================================
// ANIMATION SYSTEM
// =================================

class AnimationManager {
  constructor() {
    this.fadeInObserver = initFadeInObserver();
    this.animationObserver = initAnimationObserver();
    this.init();
  }

  init() {
    this.initScrollAnimations();
    this.initHoverEffects();
    this.initStarAnimations();
    this.initGalleryAnimations();
  }

  initScrollAnimations() {
    // Observe all fade-in elements
    document.querySelectorAll(".fade-in").forEach((el) => {
      this.animationObserver.observe(el);
    });

    // Observe gallery cards
    document.querySelectorAll(".gallery-card").forEach((card) => {
      this.fadeInObserver.observe(card);
    });

    // Setup staggered animations for various sections
    this.setupStaggeredAnimation(".benefit-item");
    this.setupStaggeredAnimation(".gallery-item", 100);
    this.setupStaggeredAnimation(".footer-section");
  }

  setupStaggeredAnimation(selector, delay = 100) {
    document.querySelectorAll(selector).forEach((item, index) => {
      item.style.opacity = "0";
      item.style.transform = "translateY(30px)";
      item.style.transition = `var(--transition) ${index * 0.1}s`;
      setTimeout(() => {
        item.style.transition = "var(--transition)";
        item.style.opacity = "1";
        item.style.transform = "translateY(0)";
      }, index * delay);
    });
  }

  initHoverEffects() {
    // Apply hover effects to various elements
    addHoverEffects(
      ".review-card, .social-mention, .event-card, .promotion-card"
    );
    addHoverEffects(
      ".social-link",
      "translateY(-3px) scale(1.1)",
      "translateY(0) scale(1)"
    );
  }

  initStarAnimations() {
    document.querySelectorAll(".rating-stars").forEach((ratingContainer) => {
      const stars = ratingContainer.querySelectorAll(".fa-star");
      stars.forEach((star, index) => {
        star.style.animationDelay = `${index * 0.1}s`;
        star.style.animation = "starGlow 2s ease-in-out infinite alternate";
      });
    });

    // Add star glow keyframes if not already added
    if (!document.querySelector("#star-glow-styles")) {
      const style = document.createElement("style");
      style.id = "star-glow-styles";
      style.textContent = `
                @keyframes starGlow {
                    0% { filter: brightness(1); }
                    100% { filter: brightness(1.3); }
                }
            `;
      document.head.appendChild(style);
    }
  }

  initGalleryAnimations() {
    // Initialize gallery items with fade-in animation
    document.querySelectorAll(".gallery-item").forEach((item, index) => {
      item.style.opacity = "0";
      item.style.transform = "translateY(30px)";
      setTimeout(() => {
        item.style.transition = "var(--transition)";
        item.style.opacity = "1";
        item.style.transform = "translateY(0)";
      }, index * 100);
    });
  }
}

// =================================
// STATISTICS COUNTER
// =================================

class StatsCounter {
  constructor() {
    this.init();
  }

  init() {
    this.animateNumbers();
  }

  animateNumbers() {
    const stats = document.querySelectorAll(".stat-number");
    const observer = createObserver({ threshold: 0.3 }, (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.animateNumber(entry.target);
          observer.unobserve(entry.target);
        }
      });
    });

    stats.forEach((stat) => observer.observe(stat));
  }

  animateNumber(target) {
    const finalValue = parseInt(target.textContent.replace(/\D/g, ""));
    const suffix = target.textContent.replace(/[\d,]/g, "");
    let current = 0;
    const increment = finalValue / 100;
    const timer = setInterval(() => {
      current += increment;
      if (current >= finalValue) {
        current = finalValue;
        clearInterval(timer);
      }
      target.textContent = Math.floor(current).toLocaleString() + suffix;
    }, 20);
  }
}

// =================================
// GALLERY SYSTEM
// =================================

class GalleryManager {
  constructor() {
    this.navButtons = document.querySelectorAll(".nav-btn");
    this.galleryItems = document.querySelectorAll(".gallery-item");
    this.init();
  }

  init() {
    this.initFiltering();
  }

  initFiltering() {
    this.navButtons.forEach((button) => {
      button.addEventListener("click", () => {
        this.filterGallery(button);
      });
    });
  }

  filterGallery(activeButton) {
    const category = activeButton.getAttribute("data-category");

    // Update active button
    this.navButtons.forEach((btn) => btn.classList.remove("active"));
    activeButton.classList.add("active");

    // Filter gallery items with smooth animation
    this.galleryItems.forEach((item) => {
      const itemCategory = item.getAttribute("data-category");

      if (category === "all" || itemCategory === category) {
        item.style.display = "block";
        setTimeout(() => {
          item.style.opacity = "1";
          item.style.transform = "translateY(0)";
        }, 50);
      } else {
        item.style.opacity = "0";
        item.style.transform = "translateY(20px)";
        setTimeout(() => {
          item.style.display = "none";
        }, 300);
      }
    });
  }
}

// =================================
// RESERVATION SYSTEM
// =================================

class ReservationManager {
  constructor() {
    this.dateInput = document.getElementById("reservationDate");
    this.form = document.getElementById("reservationForm");
    this.partySizeOptions = document.querySelectorAll(".party-size-option");
    this.timeSlots = document.querySelectorAll(".time-slot:not(.unavailable)");
    this.init();
  }

  init() {
    this.initDateInput();
    this.initPartySizeSelection();
    this.initTimeSlotSelection();
    this.initFormSubmission();
    // this.initReservationButtons();
    this.initScrollAnimations();
  }

  initDateInput() {
    if (!this.dateInput) return;
    const today = new Date().toISOString().split("T")[0];
    this.dateInput.setAttribute("min", today);
  }

  initPartySizeSelection() {
    this.partySizeOptions.forEach((option) => {
      option.addEventListener("click", () => {
        this.partySizeOptions.forEach((opt) =>
          opt.classList.remove("selected")
        );
        option.classList.add("selected");
      });
    });
  }

  initTimeSlotSelection() {
    this.timeSlots.forEach((slot) => {
      slot.addEventListener("click", () => {
        this.timeSlots.forEach((s) => s.classList.remove("selected"));
        slot.classList.add("selected");
      });
    });
  }

  initFormSubmission() {
    if (!this.form) return;

    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleFormSubmission();
    });
  }

  // initReservationButtons() {
  //   document.querySelectorAll(".reservation-btn").forEach((btn) => {
  //     btn.addEventListener("click", () => {
  //       alert("Redirecting to reservation system...");
  //     });
  //   });
  // }

  handleFormSubmission() {
    const selectedDate = this.dateInput.value;
    const selectedPartySize = document.querySelector(
      ".party-size-option.selected"
    )?.dataset.size;
    const selectedTime = document.querySelector(".time-slot.selected")?.dataset
      .time;

    if (!selectedDate || !selectedPartySize || !selectedTime) {
      alert("Please select a date, party size, and time slot.");
      return;
    }

    this.simulateSubmission();
  }

  simulateSubmission() {
    const submitBtn = this.form.querySelector(".btn-reserve");
    const originalText = submitBtn.innerHTML;

    submitBtn.innerHTML =
      '<i class="fas fa-spinner fa-spin me-2"></i>Processing...';
    submitBtn.disabled = true;

    setTimeout(() => {
      alert(
        "Reservation request submitted successfully! We will contact you shortly to confirm your booking."
      );
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      this.form.reset();
      document
        .querySelectorAll(".selected")
        .forEach((el) => el.classList.remove("selected"));
    }, 2000);
  }

  initScrollAnimations() {
    const observer = initFadeInObserver();
    document
      .querySelectorAll(
        ".booking-card, .contact-card, .reservation-btn, .container"
      )
      .forEach((el) => {
        el.style.opacity = "0";
        el.style.transform = "translateY(30px)";
        el.style.transition = "all 0.6s ease-out";
        observer.observe(el);
      });
  }
}

// =================================
// NEWSLETTER SYSTEM
// =================================

class NewsletterManager {
  constructor() {
    this.form = document.getElementById("newsletterForm");
    this.footerForm = document.querySelector(".newsletter-form form");
    this.successMessage = document.getElementById("successMessage");
    this.init();
  }

  init() {
    this.initMainForm();
    this.initFormAnimations();
    this.initCheckboxAnimations();
  }

  initMainForm() {
    if (!this.form) return;

    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleMainFormSubmission();
    });
  }

  handleMainFormSubmission() {
    const formData = new FormData(this.form);
    const firstName = formData.get("firstName");
    const lastName = formData.get("lastName");
    const email = formData.get("email");
    const preferences = formData.getAll("preferences");

    if (!firstName || !lastName || !email) {
      alert("Please fill in all required fields.");
      return;
    }

    if (preferences.length === 0) {
      alert("Please select at least one subscription preference.");
      return;
    }

    this.simulateMainFormSubmission(firstName, lastName, email, preferences);
  }

  simulateMainFormSubmission(firstName, lastName, email, preferences) {
    const submitBtn = this.form.querySelector(".submit-btn");
    const originalText = submitBtn.innerHTML;

    submitBtn.innerHTML =
      '<i class="fas fa-spinner fa-spin" style="margin-right: 0.5rem;"></i>Subscribing...';
    submitBtn.disabled = true;

    setTimeout(() => {
      this.successMessage.style.display = "block";
      this.form.reset();
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;

      setTimeout(() => {
        this.successMessage.style.display = "none";
      }, 5000);

      console.log("Newsletter Subscription:", {
        firstName,
        lastName,
        email,
        preferences,
        timestamp: new Date().toISOString(),
      });
    }, 2000);
  }

  initFormAnimations() {
    const formInputs = document.querySelectorAll(".form-control");

    formInputs.forEach((input) => {
      input.addEventListener("focus", function () {
        this.parentElement.style.transform = "scale(1.02)";
      });

      input.addEventListener("blur", function () {
        this.parentElement.style.transform = "scale(1)";
      });
    });
  }

  initCheckboxAnimations() {
    const checkboxItems = document.querySelectorAll(".checkbox-item");

    checkboxItems.forEach((item) => {
      const checkbox = item.querySelector('input[type="checkbox"]');

      item.addEventListener("click", (e) => {
        if (e.target !== checkbox) {
          checkbox.checked = !checkbox.checked;
        }

        this.updateCheckboxStyles(item, checkbox);
      });

      // Initial state
      if (checkbox.checked) {
        this.updateCheckboxStyles(item, checkbox);
      }
    });
  }

  updateCheckboxStyles(item, checkbox) {
    if (checkbox.checked) {
      item.style.background = "var(--gradient-gold)";
      item.style.color = "var(--text-dark)";
      item.style.transform = "scale(1.02)";
    } else {
      item.style.background = "transparent";
      item.style.color = "var(--text-color)";
      item.style.transform = "scale(1)";
    }
  }
}

// =================================
// SOCIAL MEDIA MANAGER
// =================================

class SocialMediaManager {
  constructor() {
    this.init();
  }

  init() {
    this.initInstagramPosts();
    this.initSocialLinks();
    this.initUGCPosts();
    this.initLazyLoading();
    this.initScrollAnimations();
  }

  initInstagramPosts() {
    document.querySelectorAll(".instagram-post").forEach((post) => {
      post.addEventListener("click", () => {
        console.log("Instagram post clicked");
      });
    });
  }

  initSocialLinks() {
    document.querySelectorAll(".social-link").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const platform = link.querySelector("i").className;
        console.log(`Social link clicked: ${platform}`);
      });
    });
  }

  initUGCPosts() {
    document.querySelectorAll(".ugc-post").forEach((post) => {
      const heartBtn = post.querySelector(".fa-heart");
      if (heartBtn) {
        heartBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          heartBtn.classList.toggle("text-danger");
        });
      }
    });
  }

  initLazyLoading() {
    const images = document.querySelectorAll("img");
    const imageObserver = createObserver({ threshold: 0.1 }, (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.classList.remove("lazy");
            imageObserver.unobserve(img);
          }
        }
      });
    });

    images.forEach((img) => {
      if (img.dataset.src) {
        imageObserver.observe(img);
      }
    });
  }

  initScrollAnimations() {
    const observer = createObserver({ threshold: 0.1 }, (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-on-scroll");
        }
      });
    });

    document.querySelectorAll(".social-card").forEach((card) => {
      observer.observe(card);
    });
  }
}

// =================================
// CONTACT MANAGER
// =================================

class ContactManager {
  constructor() {
    this.init();
  }

  init() {
    this.initMapClick();
    this.initContactLinks();
  }

  initMapClick() {
    const mapContainer = document.querySelector(".map-container");
    if (mapContainer) {
      mapContainer.addEventListener("click", () => {
        alert(
          "Opening map in new window...\n(In a real implementation, this would open Google Maps or your preferred mapping service)"
        );
      });
    }
  }

  initContactLinks() {
    document.querySelectorAll(".contact-link").forEach((link) => {
      link.addEventListener("click", function (e) {
        console.log("Contact interaction:", this.textContent.trim());
      });
    });
  }
}

// =================================
// MAIN APPLICATION INITIALIZATION
// =================================

class RestaurantApp {
  constructor() {
    this.managers = {};
    this.init();
  }

  init() {
    // Wait for DOM to be ready
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () =>
        this.initializeManagers()
      );
    } else {
      this.initializeManagers();
    }
  }

  initializeManagers() {
    // Initialize all managers
    this.managers.navigation = new NavigationManager();
    this.managers.animation = new AnimationManager();
    this.managers.stats = new StatsCounter();
    this.managers.gallery = new GalleryManager();
    this.managers.reservation = new ReservationManager();
    this.managers.newsletter = new NewsletterManager();
    this.managers.socialMedia = new SocialMediaManager();
    this.managers.contact = new ContactManager();

    // Initialize smooth scrolling
    initSmoothScrolling();

    // Initialize button state
    toggleGoToTopButton();

    console.log("Restaurant App initialized successfully");
  }
}

// Go to Top Button Functionality
const goToTopBtn = document.getElementById("goToTopBtn");

// Show/hide button based on scroll position with progress animation
function toggleGoToTopButton() {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const scrollHeight =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;
  const scrollPercentage = (scrollTop / scrollHeight) * 100;

  // Calculate scroll progress for border animation (0deg to 360deg)
  const scrollProgress = (scrollPercentage / 100) * 360;
  goToTopBtn.style.setProperty("--scroll-progress", `${scrollProgress}deg`);

  // Show button after scrolling 200px
  if (scrollTop > 200) {
    goToTopBtn.classList.add("show");
  } else {
    goToTopBtn.classList.remove("show");
  }
}

// Smooth scroll to top with animation
function scrollToTop() {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  if (scrollTop > 0) {
    // Add click animation
    goToTopBtn.style.transform = "translateY(-5px) scale(0.95)";

    // Smooth scroll to top
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    // Reset button transform after animation
    setTimeout(() => {
      goToTopBtn.style.transform = "translateY(0) scale(1)";
    }, 150);

    // Add sparkle effect on click
    createSparkleEffect();
  }
}

// Create sparkle effect for restaurant ambiance
function createSparkleEffect() {
  //   const sparkles = ["✨", "🌟", "⭐", "💫"];
  const sparkles = ["B", "e", "l", "a"];
  const randomSparkle = sparkles[Math.floor(Math.random() * sparkles.length)];

  const sparkleEl = document.createElement("div");
  sparkleEl.textContent = randomSparkle;
  sparkleEl.style.cssText = `
                position: fixed;
                bottom: 60px;
                right: 60px;
                font-size: 1.5rem;
                pointer-events: none;
                z-index: 1001;
                animation: sparkleFloat 1.5s ease-out forwards;
            `;

  document.body.appendChild(sparkleEl);

  // Remove sparkle after animation
  setTimeout(() => {
    if (sparkleEl.parentNode) {
      sparkleEl.parentNode.removeChild(sparkleEl);
    }
  }, 1500);
}

// Optimized scroll handler with throttling
let ticking = false;
function handleScroll() {
  if (!ticking) {
    requestAnimationFrame(() => {
      toggleGoToTopButton();
      ticking = false;
    });
    ticking = true;
  }
}

// Event listeners
window.addEventListener("scroll", handleScroll);
goToTopBtn.addEventListener("click", scrollToTop);

// Keyboard accessibility
goToTopBtn.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    scrollToTop();
  }
});

// =================================
// APP STARTUP
// =================================

// Initialize the application
const restaurantApp = new RestaurantApp();
