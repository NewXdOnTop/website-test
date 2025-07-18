let cartItemsContainer = null;
let totalPriceElement = null;
let cartSummary = null;


function loadCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  cartItemsContainer.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
            <div class="empty-cart">
              <i class="fas fa-shopping-cart"></i>
              <h3>Your cart is empty</h3>
              <p>Add some delicious items to get started!</p>
            </div>
          `;
    cartSummary.style.display = "none";
  } else {
    cart.forEach((item, index) => {
      total += item.price * item.quantity;

      const itemElement = document.createElement("div");
      itemElement.className = "cart-item";
      itemElement.innerHTML = `
              <div class="item-image">
                <i class="fas fa-utensils"></i>
              </div>
              <div class="item-info">
                <h4>${item.name}</h4>
                <div class="item-unit-price">₹${item.price} each</div>
                <div class="quantity-controls">
                  <button onclick="updateQuantity(${index}, -1)" title="Decrease quantity">
                    <i class="fas fa-minus"></i>
                  </button>
                  <span class="quantity">${item.quantity}</span>
                  <button onclick="updateQuantity(${index}, 1)" title="Increase quantity">
                    <i class="fas fa-plus"></i>
                  </button>
                </div>
              </div>
              <div class="item-price">₹${item.price * item.quantity}</div>
              <button class="remove-btn" onclick="removeItem(${index})" title="Remove item">
                <i class="fas fa-trash"></i>
                Remove
              </button>
            `;
      cartItemsContainer.appendChild(itemElement);
    });
    cartSummary.style.display = "block";
  }

  totalPriceElement.textContent = `₹${total}`;
}

function updateQuantity(index, delta) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart[index].quantity += delta;
  if (cart[index].quantity < 1) cart[index].quantity = 1;
  localStorage.setItem("cart", JSON.stringify(cart));
  loadCart();
}

function removeItem(index) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  loadCart();
}

function checkout() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }


  alert("Redirecting to checkout...");

  // TODO: Implement logic
}

// Load cart when page loads
document.addEventListener('DOMContentLoaded', function () {
  cartItemsContainer = document.getElementById("cart-items");
  totalPriceElement = document.getElementById("total-price");
  cartSummary = document.getElementById("cart-summary");

  // Load cart items immediately after DOM elements are found
  if (cartItemsContainer) {
    loadCart();
  }
});
