// script.js

const products = [
    { id: 1, name: "Apple", price: 0.5 },
    { id: 2, name: "Banana", price: 0.3 },
    { id: 3, name: "Milk", price: 1.2 },
    { id: 4, name: "Bread", price: 2.5 },
];

let cart = [];
let orderHistory = [];

// Load products into the product list
function loadProducts() {
    const productList = document.getElementById("product-list");
    products.forEach((product) => {
        const productDiv = document.createElement("div");
        productDiv.className =
            "product bg-gray-100 p-4 rounded shadow-md text-center";
        productDiv.innerHTML = `
            <h3 class="font-bold">${product.name}</h3>
            <p class="text-sm">Price: $${product.price.toFixed(2)}</p>
            <button class="bg-blue-500 text-white px-4 py-2 rounded mt-2 hover:bg-blue-600" 
                    onclick="addToCart(${product.id})">
                Add to Cart
            </button>
        `;
        productList.appendChild(productDiv);
    });
}

// Add a product to the cart
function addToCart(productId) {
    const product = products.find((p) => p.id === productId);
    const cartItem = cart.find((item) => item.id === productId);

    if (cartItem) {
        cartItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCart();
}

// Update cart display
function updateCart() {
    const cartTableBody = document.getElementById("cart-table");
    cartTableBody.innerHTML = "";

    let subtotal = 0;

    cart.forEach((item, index) => {
        const total = item.price * item.quantity;
        subtotal += total;

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.name}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td class="text-center">
                <button class="px-2" onclick="changeQuantity(${index}, -1)">-</button>
                ${item.quantity}
                <button class="px-2" onclick="changeQuantity(${index}, 1)">+</button>
            </td>
            <td>$${total.toFixed(2)}</td>
            <td><button class="text-red-500" onclick="removeFromCart(${index})">Remove</button></td>
        `;
        cartTableBody.appendChild(row);
    });

    const tax = subtotal * 0.05;
    const total = subtotal + tax;

    document.getElementById("subtotal").textContent = subtotal.toFixed(2);
    document.getElementById("tax").textContent = tax.toFixed(2);
    document.getElementById("total").textContent = total.toFixed(2);
}

// Change quantity of a cart item
function changeQuantity(index, delta) {
    cart[index].quantity += delta;

    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }

    updateCart();
}

// Remove an item from the cart
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

// Checkout functionality
document.getElementById("checkout-btn").addEventListener("click", () => {
    if (cart.length === 0) {
        alert("Cart is empty!");
        return;
    }

    const currentTime = new Date();
    const order = {
        id: orderHistory.length + 1,
        time: currentTime.toLocaleString(),
        items: cart,
        subtotal: parseFloat(document.getElementById("subtotal").textContent),
        tax: parseFloat(document.getElementById("tax").textContent),
        total: parseFloat(document.getElementById("total").textContent),
    };

    orderHistory.push(order);
    displayOrder(order);

    cart = []; // Clear cart
    updateCart();
});

// Display order in Order History
function displayOrder(order) {
    const orderList = document.getElementById("order-list");
    const orderCard = document.createElement("div");
    orderCard.className = "p-4 bg-gray-100 rounded shadow-md";

    const itemsList = order.items
        .map(
            (item) =>
                `<li>${item.quantity}x ${item.name} - $${(item.quantity * item.price).toFixed(2)}</li>`
        )
        .join("");

    orderCard.innerHTML = `
        <h3 class="font-bold">Order #${order.id}</h3>
        <p><strong>Time:</strong> ${order.time}</p>
        <ul>${itemsList}</ul>
        <p><strong>Subtotal:</strong> $${order.subtotal.toFixed(2)}</p>
        <p><strong>Tax:</strong> $${order.tax.toFixed(2)}</p>
        <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>
    `;

    orderList.appendChild(orderCard);
}

// Initialize the app
loadProducts();
