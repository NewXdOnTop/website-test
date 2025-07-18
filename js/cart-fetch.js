function cartItemNumber() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartUpdateElement = document.getElementById('cart-update');
  cartUpdateElement.textContent = itemCount > 0 ? "Cart(" + itemCount + ")" : 'Cart';
}
