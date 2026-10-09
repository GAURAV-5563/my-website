const products = [
  {
    id: "linen-throw",
    name: "Everyday Linen Throw",
    description: "Washed linen · Oat",
    price: 68,
    category: "home",
    badge: "A good layer",
    image: "photo-1600210492486-724fe5c67fb0",
    alt: "Soft neutral linen throw draped over a comfortable sofa",
  },
  {
    id: "stoneware-mug",
    name: "The Slow Morning Mug",
    description: "Hand-thrown stoneware · Chalk",
    price: 32,
    category: "home",
    badge: "Small batch",
    image: "photo-1514228742587-6b1558fcca3d",
    alt: "Handmade ceramic mug in a warm neutral glaze",
  },
  {
    id: "market-tote",
    name: "Weekend Market Tote",
    description: "Recycled cotton canvas · Moss",
    price: 38,
    category: "wear",
    badge: "Everyday carry",
    image: "photo-1590874103328-eac38a683ce7",
    alt: "Durable canvas tote bag ready for a weekend outing",
  },
  {
    id: "wool-slippers",
    name: "Cloud Wool Slippers",
    description: "Felted merino wool · Natural",
    price: 54,
    category: "wear",
    badge: "Made to unwind",
    image: "photo-1543163521-1bf539c55dd2",
    alt: "Comfortable neutral wool slippers",
  },
  {
    id: "ceramic-vase",
    name: "Sunday Ceramic Vase",
    description: "Hand-finished stoneware · Sand",
    price: 46,
    category: "home",
    badge: "Hand-finished",
    image: "photo-1578500494198-246f612d3b3d",
    alt: "Sculptural handmade ceramic vase in a soft sand color",
  },
  {
    id: "cotton-cap",
    name: "The Anywhere Cap",
    description: "Organic cotton twill · Olive",
    price: 34,
    category: "wear",
    badge: "New favorite",
    image: "photo-1588850561407-ed78c282e89b",
    alt: "Simple everyday cotton cap in a muted olive shade",
  },
];

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});
const grid = document.querySelector("#product-grid");
const searchInput = document.querySelector("#product-search");
const filterButtons = [...document.querySelectorAll(".filter-button")];
const resultsCount = document.querySelector(".results-count");
const emptyState = document.querySelector(".empty-state");
const cartDrawer = document.querySelector(".cart-drawer");
const cartItems = document.querySelector(".cart-items");
const cartCount = document.querySelector(".cart-count");
const drawerCount = document.querySelector(".drawer-count");
const cartSubtotal = document.querySelector(".cart-subtotal");
const cartEmpty = document.querySelector(".cart-empty");
const drawerFooter = document.querySelector(".drawer-footer");
const backdrop = document.querySelector(".drawer-backdrop");
const cart = new Map();
let activeFilter = "all";
let lastFocusedElement;

function makeElement(tagName, className, text) {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function renderProducts() {
  const query = searchInput.value.trim().toLocaleLowerCase();
  const visibleProducts = products.filter((product) => {
    const matchesCategory =
      activeFilter === "all" || product.category === activeFilter;
    const matchesSearch = `${product.name} ${product.description}`
      .toLocaleLowerCase()
      .includes(query);
    return matchesCategory && matchesSearch;
  });

  grid.replaceChildren(
    ...visibleProducts.map((product) => {
      const card = makeElement("article", "product-card");
      const imageWrap = makeElement("div", "product-image-wrap");
      const image = makeElement("img", "product-image");
      image.src = `https://images.unsplash.com/${product.image}?auto=format&fit=crop&w=900&q=80`;
      image.alt = product.alt;
      image.loading = "lazy";
      imageWrap.append(image);

      const badge = makeElement("span", "product-badge", product.badge);
      const addButton = makeElement("button", "product-add");
      addButton.type = "button";
      addButton.dataset.addToCart = product.id;
      addButton.setAttribute("aria-label", `Add ${product.name} to bag`);
      addButton.append(
        document.createTextNode("Add to bag"),
        makeElement("span", "", "+"),
      );
      imageWrap.append(badge, addButton);

      const details = makeElement("div", "product-details");
      const copy = makeElement("div");
      copy.append(
        makeElement("h3", "product-name", product.name),
        makeElement("p", "product-description", product.description),
      );
      details.append(
        copy,
        makeElement("p", "product-price", currency.format(product.price)),
      );
      card.append(imageWrap, details);
      return card;
    }),
  );

  resultsCount.textContent = `${visibleProducts.length} ${
    visibleProducts.length === 1 ? "piece" : "pieces"
  }`;
  emptyState.hidden = visibleProducts.length > 0;
}

function renderCart() {
  const items = [...cart.entries()];
  const totalQuantity = items.reduce((total, [, quantity]) => total + quantity, 0);
  const subtotal = items.reduce((total, [id, quantity]) => {
    const product = products.find((item) => item.id === id);
    return total + product.price * quantity;
  }, 0);

  cartCount.textContent = String(totalQuantity);
  drawerCount.textContent = `(${totalQuantity})`;
  cartSubtotal.textContent = currency.format(subtotal);
  cartEmpty.hidden = items.length > 0;
  drawerFooter.hidden = items.length === 0;

  cartItems.replaceChildren(
    ...items.map(([id, quantity]) => {
      const product = products.find((item) => item.id === id);
      const row = makeElement("article", "cart-line");
      const image = makeElement("img");
      image.src = `https://images.unsplash.com/${product.image}?auto=format&fit=crop&w=180&q=75`;
      image.alt = "";
      image.loading = "lazy";

      const details = makeElement("div");
      details.append(
        makeElement("h3", "", product.name),
        makeElement("p", "", product.description),
      );
      const controls = makeElement("div", "quantity-controls");
      const decrease = makeElement("button", "", "−");
      decrease.type = "button";
      decrease.dataset.cartAction = "decrease";
      decrease.dataset.productId = id;
      decrease.setAttribute("aria-label", `Remove one ${product.name}`);
      const quantityLabel = makeElement("span", "", String(quantity));
      const increase = makeElement("button", "", "+");
      increase.type = "button";
      increase.dataset.cartAction = "increase";
      increase.dataset.productId = id;
      increase.setAttribute("aria-label", `Add one ${product.name}`);
      controls.append(decrease, quantityLabel, increase);
      details.append(controls);
      row.append(
        image,
        details,
        makeElement(
          "span",
          "cart-line-price",
          currency.format(product.price * quantity),
        ),
      );
      return row;
    }),
  );
}

function openCart() {
  lastFocusedElement = document.activeElement;
  cartDrawer.classList.add("is-open");
  cartDrawer.setAttribute("aria-hidden", "false");
  backdrop.hidden = false;
  document.body.classList.add("drawer-open");
  cartDrawer.querySelector(".drawer-close").focus();
}

function closeCart() {
  cartDrawer.classList.remove("is-open");
  cartDrawer.setAttribute("aria-hidden", "true");
  backdrop.hidden = true;
  document.body.classList.remove("drawer-open");
  if (lastFocusedElement instanceof HTMLElement) lastFocusedElement.focus();
}

document.querySelector("#year").textContent = String(new Date().getFullYear());
renderProducts();
renderCart();

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    filterButtons.forEach((filterButton) => {
      const isActive = filterButton === button;
      filterButton.classList.toggle("is-active", isActive);
      filterButton.setAttribute("aria-pressed", String(isActive));
    });
    renderProducts();
  });
});

searchInput.addEventListener("input", renderProducts);

document.querySelectorAll("[data-nav-filter]").forEach((link) => {
  link.addEventListener("click", () => {
    const filter = link.dataset.navFilter;
    filterButtons.find((button) => button.dataset.filter === filter).click();
    document.querySelector(".main-nav").classList.remove("is-open");
    document.querySelector(".nav-toggle").setAttribute("aria-expanded", "false");
  });
});

grid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-add-to-cart]");
  if (!button) return;
  const id = button.dataset.addToCart;
  cart.set(id, (cart.get(id) || 0) + 1);
  renderCart();
  openCart();
});

cartItems.addEventListener("click", (event) => {
  const button = event.target.closest("[data-cart-action]");
  if (!button) return;
  const { productId, cartAction } = button.dataset;
  const quantity = cart.get(productId);
  if (cartAction === "increase") {
    cart.set(productId, quantity + 1);
  } else if (quantity === 1) {
    cart.delete(productId);
  } else {
    cart.set(productId, quantity - 1);
  }
  renderCart();
});

document.querySelector(".cart-trigger").addEventListener("click", openCart);
document.querySelector(".drawer-close").addEventListener("click", closeCart);
document.querySelector(".continue-shopping").addEventListener("click", closeCart);
backdrop.addEventListener("click", closeCart);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && cartDrawer.classList.contains("is-open")) {
    closeCart();
  }
});

document.querySelector(".nav-toggle").addEventListener("click", (event) => {
  const button = event.currentTarget;
  const expanded = button.getAttribute("aria-expanded") === "true";
  button.setAttribute("aria-expanded", String(!expanded));
  document.querySelector(".main-nav").classList.toggle("is-open", !expanded);
});

document.querySelector(".newsletter-form").addEventListener("submit", (event) => {
  event.preventDefault();
  document.querySelector(".newsletter-status").textContent =
    "Thanks! This demo form isn't connected to a mailing list yet.";
  event.currentTarget.reset();
});

document.querySelector(".checkout-button").addEventListener("click", () => {
  document.querySelector(".drawer-footer > p").textContent =
    "Demo shop: checkout is not connected to a payment provider yet.";
});
