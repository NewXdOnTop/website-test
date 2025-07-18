let count = 0;

function changeCount(delta) {
  count += delta;
  if (count < 0) {
    count = 0;
  }
  document.getElementById("item-count").textContent = count;
}

function addToCart(name, price) {
  if (count === 0) {
    alert("Please select a quantity greater than 0.");
    return;
  }

  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Check if already in cart
  const existing = cart.find(item => item.name === name);
  if (existing) {
    existing.quantity += count;
  } else {
    cart.push({name, price, quantity: count});
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartNumber();
  alert(`${count} ${name}(s) added to cart.`);
}

function updateCartNumber() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartUpdateElement = document.getElementById('cart-tag');
  cartUpdateElement.textContent = itemCount > 0 ? "Cart(" + itemCount + ")" : 'Cart';
}

