// Theme Management
const themeToggle = document.getElementById("themeToggle");
const body = document.body;
const themeIcon = themeToggle.querySelector("i");

// Load saved theme or default to light
const savedTheme = localStorage.getItem("theme") || "light";
body.setAttribute("data-theme", savedTheme);
updateThemeIcon(savedTheme);

themeToggle.addEventListener("click", () => {
  const currentTheme = body.getAttribute("data-theme");
  const newTheme = currentTheme === "light" ? "dark" : "light";

  body.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
  updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
  themeIcon.className = theme === "light" ? "fas fa-moon" : "fas fa-sun";
}

// order
// Cart management
let cart = [];
let orderCounter = 1000;

// Enhanced function to extract item data from card structure
function addToCartFromCard(button) {
  const menuItem = button.closest(".menu-item");
  if (!menuItem) return;

  // Extract item information from card elements
  const title = menuItem.querySelector(".menu-item-title")?.textContent?.trim();
  const description = menuItem
    .querySelector(".menu-item-description")
    ?.textContent?.trim();
  const priceText = menuItem.querySelector(".price-badge")?.textContent?.trim();
  const price = parseFloat(priceText?.replace("$", "") || "0");

  // Extract additional details
  const prepTime = menuItem
    .querySelector(".prep-time span")
    ?.textContent?.trim();
  const rating = menuItem.querySelector(".rating span")?.textContent?.trim();
  const dietaryBadges = Array.from(
    menuItem.querySelectorAll(".dietary-badge")
  ).map((badge) => badge.textContent.trim());
  const isChefsPick = menuItem.querySelector(".chef-pick-badge") !== null;
  const isPopular =
    menuItem
      .querySelector(".chef-pick-badge")
      ?.textContent?.includes("Popular") || false;

  if (!title || !price) {
    console.error("Could not extract item information from card");
    return;
  }

  // Check if item already exists in cart
  const existingItem = cart.find((item) => item.name === title);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: Date.now(),
      name: title,
      price: price,
      description: description,
      prepTime: prepTime,
      rating: rating,
      dietaryInfo: dietaryBadges,
      isChefsPick: isChefsPick,
      isPopular: isPopular,
      quantity: 1,
    });
  }

  updateCartDisplay();
  showAddToCartFeedback(button);
}

function showAddToCartFeedback(button) {
  const originalText = button.innerHTML;
  button.innerHTML = '<i class="fas fa-check"></i> Added!';
  button.style.background = "linear-gradient(135deg, #27ae60, #2ecc71)";
  button.disabled = true;

  setTimeout(() => {
    button.innerHTML = originalText;
    button.style.background = "";
    button.disabled = false;
  }, 1500);
}

// Initialize order buttons with event listeners
function initializeOrderButtons() {
  document.querySelectorAll(".order-btn").forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();
      addToCartFromCard(this);
    });
  });
}

function removeFromCart(id) {
  cart = cart.filter((item) => item.id !== id);
  updateCartDisplay();
}

function updateQuantity(id, change) {
  const item = cart.find((item) => item.id === id);
  if (item) {
    item.quantity += change;
    if (item.quantity <= 0) {
      removeFromCart(id);
    } else {
      updateCartDisplay();
    }
  }
}

function updateCartDisplay() {
  const cartCount = document.getElementById("cartCount");
  const cartContent = document.getElementById("cartContent");
  const cartTotal = document.getElementById("cartTotal");

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems;

  cartCount.classList.add("animate");
  setTimeout(() => cartCount.classList.remove("animate"), 600);

  if (cart.length === 0) {
    cartContent.innerHTML = `
                    <div class="empty-cart">
                        <i class="fas fa-shopping-cart"></i>
                        <p>Your cart is empty</p>
                        <p>Add some delicious items to get started!</p>
                    </div>
                `;
    cartTotal.style.display = "none";
  } else {
    cartContent.innerHTML = cart
      .map(
        (item) => `
                    <div class="cart-item">
                        <div class="cart-item-info">
                            <h4>${item.name}</h4>
                            ${
                              item.isChefsPick
                                ? '<span class="mini-badge chef">Chef\'s Pick</span>'
                                : ""
                            }
                            ${
                              item.isPopular
                                ? '<span class="mini-badge popular">Popular</span>'
                                : ""
                            }
                            <p class="cart-item-price">$${item.price.toFixed(
                              2
                            )}</p>
                            ${
                              item.prepTime
                                ? `<p class="cart-item-meta"><i class="fas fa-clock"></i> ${item.prepTime}</p>`
                                : ""
                            }
                            ${
                              item.dietaryInfo.length > 0
                                ? `<p class="cart-item-dietary">${item.dietaryInfo.join(
                                    ", "
                                  )}</p>`
                                : ""
                            }
                            <div class="quantity-controls">
                                <button class="qty-btn" onclick="updateQuantity(${
                                  item.id
                                }, -1)">-</button>
                                <span>Qty: ${item.quantity}</span>
                                <button class="qty-btn" onclick="updateQuantity(${
                                  item.id
                                }, 1)">+</button>
                                <button class="remove-item" onclick="removeFromCart(${
                                  item.id
                                })">Remove</button>
                            </div>
                        </div>
                    </div>
                `
      )
      .join("");

    const subtotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const tax = subtotal * 0.085;
    const deliveryFee = 3.99;
    const total = subtotal + tax + deliveryFee;

    document.getElementById("subtotal").textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById("tax").textContent = `$${tax.toFixed(2)}`;
    document.getElementById(
      "deliveryFee"
    ).textContent = `$${deliveryFee.toFixed(2)}`;
    document.getElementById("finalTotal").textContent = `$${total.toFixed(2)}`;

    cartTotal.style.display = "block";
  }
}

function toggleCart() {
  const cartSidebar = document.getElementById("cartSidebar");
  const overlay = document.getElementById("overlay");

  // Add ripple effect
  const cartSummary = document.querySelector(".cart-summary");
  cartSummary.classList.add("ripple");
  setTimeout(() => cartSummary.classList.remove("ripple"), 600);

  console.log("Cart toggled");

  cartSidebar.classList.toggle("open");
  overlay.classList.toggle("show");
}

function closeCart() {
  const cartSidebar = document.getElementById("cartSidebar");
  const overlay = document.getElementById("overlay");

  cartSidebar.classList.remove("open");
  overlay.classList.remove("show");
}

function showCheckout() {
  if (cart.length === 0) return;

  document.getElementById("checkoutModal").classList.add("show");
  closeCart();
}

function closeModal() {
  document.getElementById("checkoutModal").classList.remove("show");
}

function closeSuccessModal() {
  document.getElementById("successModal").classList.remove("show");
  cart = [];
  updateCartDisplay();
}

// Form submission
function initializeFormSubmission() {
  const checkoutForm = document.getElementById("checkoutForm");
  if (checkoutForm) {
    checkoutForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const formData = new FormData(e.target);
      const orderData = {
        orderNumber: `BV-${String(orderCounter++).padStart(4, "0")}`,
        customerName: formData.get("customerName"),
        customerEmail: formData.get("customerEmail"),
        customerPhone: formData.get("customerPhone"),
        deliveryAddress: formData.get("deliveryAddress"),
        orderType: formData.get("orderType"),
        paymentMethod: formData.get("paymentMethod"),
        specialInstructions: formData.get("specialInstructions"),
        items: cart,
        subtotal: cart.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        ),
        tax:
          cart.reduce((sum, item) => sum + item.price * item.quantity, 0) *
          0.085,
        deliveryFee: formData.get("orderType") === "delivery" ? 3.99 : 0,
        timestamp: new Date().toISOString(),
      };

      orderData.total =
        orderData.subtotal + orderData.tax + orderData.deliveryFee;

      // Simulate order processing
      processOrder(orderData);
    });
  }
}

function processOrder(orderData) {
  // Show loading state
  const submitBtn = document.querySelector(".submit-order-btn");
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
  submitBtn.disabled = true;

  // Simulate API call delay
  setTimeout(() => {
    // Hide checkout modal
    document.getElementById("checkoutModal").classList.remove("show");

    // Show success modal
    document.getElementById(
      "orderNumber"
    ).textContent = `Order #${orderData.orderNumber}`;
    document.getElementById("successModal").classList.add("show");
    // Log order data (in real implementation, this would be sent to server)
    console.log("Order placed:", orderData);

    // Reset form and button
    document.getElementById("checkoutForm").reset();
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;

    // Send confirmation email (simulated)
    sendOrderConfirmation(orderData);
  }, 2000);
}

function sendOrderConfirmation(orderData) {
  // Simulate sending confirmation email/SMS
  console.log(
    `Sending confirmation to ${orderData.customerEmail} and ${orderData.customerPhone}`
  );

  //Show success message
  document.getElementsByClassName('success-message').item(0).style.display = 'block';
  // In a real implementation, you would:
  // 1. Send order data to your backend API
  // 2. Process payment if using card
  // 3. Send confirmation email/SMS
  // 4. Notify restaurant staff
  // 5. Update order tracking system
}

// Update delivery fee based on order type
function initializeOrderTypeHandler() {
  const orderTypeElement = document.getElementById("orderType");
  if (orderTypeElement) {
    orderTypeElement.addEventListener("change", function (e) {
      const deliveryFeeElement = document.getElementById("deliveryFee");
      const finalTotalElement = document.getElementById("finalTotal");

      if (cart.length > 0) {
        const subtotal = cart.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
        const tax = subtotal * 0.085;
        const deliveryFee = e.target.value === "delivery" ? 3.99 : 0;
        const total = subtotal + tax + deliveryFee;

        deliveryFeeElement.textContent = `$${deliveryFee.toFixed(2)}`;
        finalTotalElement.textContent = `$${total.toFixed(2)}`;
      }

      // Show/hide delivery address based on order type
      const addressField =
        document.getElementById("deliveryAddress").parentElement;
      if (e.target.value === "pickup") {
        addressField.style.display = "none";
        document.getElementById("deliveryAddress").required = false;
      } else {
        addressField.style.display = "block";
        document.getElementById("deliveryAddress").required = true;
      }
    });
  }
}

// Initialize the page
document.addEventListener("DOMContentLoaded", function () {
  updateCartDisplay();
  initializeOrderButtons();
  initializeFormSubmission();
  initializeOrderTypeHandler();
  initializeFormValidation();

  // Add some animation to menu items
  const menuItems = document.querySelectorAll(".menu-item");
  menuItems.forEach((item, index) => {
    item.style.opacity = "0";
    item.style.transform = "translateY(20px)";

    setTimeout(() => {
      item.style.transition = "all 0.5s ease";
      item.style.opacity = "1";
      item.style.transform = "translateY(0)";
    }, index * 100);
  });
});

// Close modals when clicking outside
window.addEventListener("click", function (e) {
  const checkoutModal = document.getElementById("checkoutModal");
  const successModal = document.getElementById("successModal");

  if (e.target === checkoutModal) {
    closeModal();
  }
  if (e.target === successModal) {
    closeSuccessModal();
  }
});

// Keyboard shortcuts
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    closeCart();
    closeModal();
    closeSuccessModal();
  }
});

// Form validation
function validateForm() {
  const form = document.getElementById("checkoutForm");
  if (!form) return true;

  const inputs = form.querySelectorAll(
    "input[required], select[required], textarea[required]"
  );
  let isValid = true;

  inputs.forEach((input) => {
    if (!input.value.trim()) {
      input.style.borderColor = "#e74c3c";
      isValid = false;
    } else {
      input.style.borderColor = "#ddd";
    }
  });

  // Email validation
  const email = document.getElementById("customerEmail");
  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.value && !emailRegex.test(email.value)) {
      email.style.borderColor = "#e74c3c";
      isValid = false;
    }
  }

  // Phone validation
  const phone = document.getElementById("customerPhone");
  if (phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (phone.value && !phoneRegex.test(phone.value.replace(/\s/g, ""))) {
      phone.style.borderColor = "#e74c3c";
      isValid = false;
    }
  }

  return isValid;
}

// Add real-time validation
function initializeFormValidation() {
  const formElements = document.querySelectorAll(
    "#checkoutForm input, #checkoutForm select, #checkoutForm textarea"
  );
  formElements.forEach((input) => {
    input.addEventListener("blur", validateForm);
    input.addEventListener("input", function () {
      if (this.style.borderColor === "rgb(231, 76, 60)") {
        this.style.borderColor = "#ddd";
      }
    });
  });
}
