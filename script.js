let cart = [];

const cartCounter = document.querySelector(".cart-btn span");
const productCards = document.querySelectorAll(".product-card");

const productModal = document.getElementById("productModal");
const modalProductImage = document.getElementById("modalProductImage");
const modalProductCategory = document.getElementById("modalProductCategory");
const modalProductName = document.getElementById("modalProductName");
const modalProductPrice = document.getElementById("modalProductPrice");
const modalProductDescription = document.getElementById("modalProductDescription");

const cartPanel = document.getElementById("cartPanel");
const cartOverlay = document.getElementById("cartOverlay");
const cartItems = document.getElementById("cartItems");
const cartSubtotal = document.getElementById("cartSubtotal");

let selectedProduct = null;


/* PRODUCT DESCRIPTIONS */

const productDescriptions = {

    "Baby Socks":
        "Soft and comfortable baby socks designed to keep little feet warm and cozy throughout the day.",

    "Little Bloom Bottle":
        "A practical feeding bottle designed for comfortable and convenient everyday feeding.",

    "Cloud Soft Romper":
        "A soft and comfortable romper made for everyday wear and gentle comfort.",

    "Gentle Bath Set":
        "A gentle baby care set designed to make everyday bath time simple and comfortable."

};


/* PRODUCT DETAILS */

document.querySelectorAll(".product-card").forEach(card => {

    card.addEventListener("click", function(event) {

        if (event.target.classList.contains("add-btn")) {
            return;
        }

        const image = card.querySelector(".product-image img");
        const name = card.querySelector(".product-details h3");
        const category = card.querySelector(".product-category");
        const price = card.querySelector(".product-bottom strong");

        selectedProduct = {
            name: name.textContent,
            price: price.textContent,
            category: category.textContent,
            image: image.src
        };

        modalProductImage.src = selectedProduct.image;
        modalProductImage.alt = selectedProduct.name;
        modalProductName.textContent = selectedProduct.name;
        modalProductCategory.textContent = selectedProduct.category;
        modalProductPrice.textContent = selectedProduct.price;
        modalProductDescription.textContent =
            productDescriptions[selectedProduct.name] ||
            "A thoughtfully selected baby essential made for everyday comfort.";

        productModal.classList.add("active");
        document.body.style.overflow = "hidden";
    });

});


/* PRODUCT CARD QUANTITY */

productCards.forEach(card => {

    const plusButton = card.querySelector(".quantity-plus");
    const minusButton = card.querySelector(".quantity-minus");
    const quantityValue = card.querySelector(".quantity-value");
    const addButton = card.querySelector(".add-btn");
    const quantityBox = card.querySelector(".product-quantity");


    /* FIRST ADD */

    addButton.addEventListener("click", function(event) {

        event.stopPropagation();

        const name =
            card.querySelector(".product-details h3").textContent;

        const category =
            card.querySelector(".product-category").textContent;

        const priceText =
            card.querySelector(".product-bottom strong").textContent;

        const image =
            card.querySelector(".product-image img").src;

        const price = parseInt(
            priceText.replace(/[^\d]/g, "")
        );

        addProductToCart({
            name,
            category,
            price,
            image
        });

        quantityValue.textContent = "1";

        addButton.style.display = "none";
        quantityBox.classList.add("active");
    });


    /* PLUS */

    plusButton.addEventListener("click", function(event) {

        event.stopPropagation();

        const name =
            card.querySelector(".product-details h3").textContent;

        const category =
            card.querySelector(".product-category").textContent;

        const priceText =
            card.querySelector(".product-bottom strong").textContent;

        const image =
            card.querySelector(".product-image img").src;

        const price = parseInt(
            priceText.replace(/[^\d]/g, "")
        );

        addProductToCart({
            name,
            category,
            price,
            image
        });

        updateProductQuantity(card, name);
    });


    /* MINUS */

    minusButton.addEventListener("click", function(event) {

        event.stopPropagation();

        const name =
            card.querySelector(".product-details h3").textContent;

        const existingProduct = cart.find(
            item => item.name === name
        );

        if (!existingProduct) return;

        existingProduct.quantity--;

        if (existingProduct.quantity <= 0) {

            const index = cart.findIndex(
                item => item.name === name
            );

            cart.splice(index, 1);

            quantityBox.classList.remove("active");
            addButton.style.display = "grid";
            quantityValue.textContent = "0";

        } else {

            quantityValue.textContent =
                existingProduct.quantity;
        }

        updateCart();
    });

});


function updateProductQuantity(card, productName) {

    const quantityValue =
        card.querySelector(".quantity-value");

    const product =
        cart.find(item => item.name === productName);

    quantityValue.textContent =
        product ? product.quantity : 0;
}


function updateProductQuantity(card, productName) {

    const quantityValue =
        card.querySelector(".quantity-value");

    const product = cart.find(
        item => item.name === productName
    );

    quantityValue.textContent =
        product ? product.quantity : 0;
}


function addProductToCart(product) {

    const existingProduct = cart.find(
        item => item.name === product.name
    );

    if (existingProduct) {

        existingProduct.quantity++;

    } else {

        cart.push({
            ...product,
            quantity: 1
        });

    }

    updateCart();
}


/* CART UPDATE */

function updateCart() {

    const totalQuantity = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    cartCounter.textContent = totalQuantity;

    renderCart();
}


/* RENDER CART */

function renderCart() {

    if (cart.length === 0) {

        cartItems.innerHTML = `
            <p class="empty-cart">
                Your cart is empty.
            </p>
        `;

        cartSubtotal.textContent = "৳ 0";

        return;
    }

    cartItems.innerHTML = "";

    let subtotal = 0;

    cart.forEach((item, index) => {

        subtotal += item.price * item.quantity;

        const cartItem = document.createElement("div");

        cartItem.className = "cart-item";

        cartItem.innerHTML = `

            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>

            <div class="cart-item-info">

                <h3>${item.name}</h3>

                <p>${item.category}</p>

                <div class="quantity-controls">

                    <button onclick="changeQuantity(${index}, -1)">
                        −
                    </button>

                    <span>${item.quantity}</span>

                    <button onclick="changeQuantity(${index}, 1)">
                        +
                    </button>

                </div>

                <button
                    class="remove-item"
                    onclick="removeFromCart(${index})">
                    Remove
                </button>

            </div>

            <strong class="cart-item-price">
                ৳ ${item.price * item.quantity}
            </strong>

        `;

        cartItems.appendChild(cartItem);
    });

    cartSubtotal.textContent =
        "৳ " + subtotal.toLocaleString("en-BD");
}


/* QUANTITY */

function changeQuantity(index, change) {

    const productName = cart[index].name;

    cart[index].quantity += change;

    const productCard = [...productCards].find(card => {
        return card.querySelector(".product-details h3").textContent === productName;
    });

    if (cart[index].quantity <= 0) {

        cart.splice(index, 1);

        if (productCard) {
            const addButton = productCard.querySelector(".add-btn");
            const quantityBox = productCard.querySelector(".product-quantity");
            const quantityValue = productCard.querySelector(".quantity-value");

            quantityBox.classList.remove("active");
            addButton.style.display = "grid";
            quantityValue.textContent = "0";
        }

    } else {

        if (productCard) {
            const quantityValue =
                productCard.querySelector(".quantity-value");

            quantityValue.textContent = cart[index].quantity;
        }
    }

    updateCart();
}


/* REMOVE */

function removeFromCart(index) {

    cart.splice(index, 1);

    updateCart();
}


/* OPEN CART */

function openCart() {

    cartPanel.classList.add("active");
    cartOverlay.classList.add("active");

    document.body.style.overflow = "hidden";
}


/* CLOSE CART */

function closeCart() {

    cartPanel.classList.remove("active");
    cartOverlay.classList.remove("active");

    document.body.style.overflow = "";
}


/* CART BUTTON */

document.querySelector(".cart-btn").addEventListener(
    "click",
    openCart
);


/* MODAL ADD TO CART */

function addToCartFromModal() {

    if (!selectedProduct) return;

    const price = parseInt(
        selectedProduct.price.replace(/[^\d]/g, "")
    );

    addProductToCart({
        name: selectedProduct.name,
        category: selectedProduct.category,
        price: price,
        image: selectedProduct.image
    });

    closeProductModal();

    openCart();
}


/* CLOSE PRODUCT MODAL */

function closeProductModal() {

    productModal.classList.remove("active");

    if (!cartPanel.classList.contains("active")) {
        document.body.style.overflow = "";
    }
}


/* ESC KEY */

document.addEventListener("keydown", function(event) {

    if (event.key === "Escape") {

        closeProductModal();
        closeCart();

    }

});/* ========================================
   CHECKOUT
======================================== */

const checkoutPanel =
    document.getElementById("checkoutPanel");

const checkoutOverlay =
    document.getElementById("checkoutOverlay");

const checkoutItems =
    document.getElementById("checkoutItems");

const checkoutTotal =
    document.getElementById("checkoutTotal");

const checkoutForm =
    document.getElementById("checkoutForm");


/* OPEN CHECKOUT */

document.querySelector(".checkout-btn").addEventListener(
    "click",
    function() {

        if (cart.length === 0) {

            alert("Your cart is empty.");

            return;
        }

        renderCheckout();

        closeCart();

        checkoutPanel.classList.add("active");

        checkoutOverlay.classList.add("active");

        document.body.style.overflow = "hidden";
    }
);


/* RENDER CHECKOUT */

function renderCheckout() {

    checkoutItems.innerHTML = "";

    let total = 0;


    cart.forEach(item => {

        const itemTotal =
            item.price * item.quantity;

        total += itemTotal;


        const div =
            document.createElement("div");

        div.className = "checkout-item";


        div.innerHTML = `

            <div class="checkout-item-info">

                <strong>
                    ${item.name}
                </strong>

                <span>
                    × ${item.quantity}
                </span>

            </div>


            <strong>
                ৳ ${itemTotal.toLocaleString("en-BD")}
            </strong>

        `;


        checkoutItems.appendChild(div);

    });


    checkoutTotal.textContent =
        "৳ " + total.toLocaleString("en-BD");
}


/* CLOSE CHECKOUT */

function closeCheckout() {

    checkoutPanel.classList.remove("active");

    checkoutOverlay.classList.remove("active");

    document.body.style.overflow = "";

}


/* BACK TO CART */

function backToCart() {

    checkoutPanel.classList.remove("active");

    checkoutOverlay.classList.remove("active");

    cartPanel.classList.add("active");

    cartOverlay.classList.add("active");

    document.body.style.overflow = "hidden";

}


/* PLACE ORDER */

checkoutForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();

        openPlaceOrderConfirmation();

    }
);
/* ========================================
   ORDER CONFIRMATION
======================================== */

const confirmationPanel =
    document.getElementById("confirmationPanel");

const confirmationOverlay =
    document.getElementById("confirmationOverlay");

const confirmationName =
    document.getElementById("confirmationName");

const confirmationItems =
    document.getElementById("confirmationItems");

const confirmationTotal =
    document.getElementById("confirmationTotal");


/* SHOW ORDER CONFIRMATION */

function showOrderConfirmation(name) {

    confirmationName.textContent = name;

    confirmationItems.innerHTML = "";

    let total = 0;


    cart.forEach(item => {

        const itemTotal =
            item.price * item.quantity;

        total += itemTotal;


        const div =
            document.createElement("div");

        div.className = "confirmation-item";


        div.innerHTML = `

            <div class="confirmation-item-info">

                <strong>
                    ${item.name}
                </strong>

                <span>
                    × ${item.quantity}
                </span>

            </div>

            <strong>
                ৳ ${itemTotal.toLocaleString("en-BD")}
            </strong>

        `;


        confirmationItems.appendChild(div);

    });


    confirmationTotal.textContent =
        "৳ " + total.toLocaleString("en-BD");


    confirmationPanel.classList.add("active");

    confirmationOverlay.classList.add("active");

    document.body.style.overflow = "hidden";
}


/* CONTINUE SHOPPING */

function continueShopping() {

    /* Close confirmation */

    confirmationPanel.classList.remove("active");

    confirmationOverlay.classList.remove("active");


    /* Close checkout */

    checkoutPanel.classList.remove("active");

    checkoutOverlay.classList.remove("active");


    /* Close cart just in case */

    cartPanel.classList.remove("active");

    cartOverlay.classList.remove("active");


    /* Return to main page */

    document.body.style.overflow = "";

}
/* ========================================
   PLACE ORDER CONFIRMATION
======================================== */

const placeOrderConfirmPanel =
    document.getElementById("placeOrderConfirmPanel");

const placeOrderConfirmOverlay =
    document.getElementById("placeOrderConfirmOverlay");

const confirmOrderTotal =
    document.getElementById("confirmOrderTotal");


/* OPEN CONFIRMATION */

function openPlaceOrderConfirmation() {

    let total = 0;


    cart.forEach(item => {

        total += item.price * item.quantity;

    });


    confirmOrderTotal.textContent =
        "৳ " + total.toLocaleString("en-BD");


    placeOrderConfirmPanel.classList.add("active");

    placeOrderConfirmOverlay.classList.add("active");

    document.body.style.overflow = "hidden";
}


/* CANCEL */

function closePlaceOrderConfirmation() {

    placeOrderConfirmPanel.classList.remove("active");

    placeOrderConfirmOverlay.classList.remove("active");

    document.body.style.overflow = "hidden";
}


/* YES, PLACE ORDER */

function confirmPlaceOrder() {

    const name =
        document.getElementById("customerName").value.trim();


    /* Close confirmation window */

    placeOrderConfirmPanel.classList.remove("active");

    placeOrderConfirmOverlay.classList.remove("active");


    /* Show order confirmation */

    showOrderConfirmation(name);


    /* Clear cart */

    resetCart();

}
/* ========================================
   RESET CART AFTER SUCCESSFUL ORDER
======================================== */

function resetCart() {

    /* Empty cart */

    cart = [];


    /* Reset cart counter */

    cartCounter.textContent = "0";


    /* Reset all product cards */

    productCards.forEach(card => {

        const addButton =
            card.querySelector(".add-btn");

        const quantityBox =
            card.querySelector(".product-quantity");

        const quantityValue =
            card.querySelector(".quantity-value");


        if (quantityBox) {
            quantityBox.classList.remove("active");
        }


        if (addButton) {
            addButton.style.display = "grid";
        }


        if (quantityValue) {
            quantityValue.textContent = "0";
        }

    });


    /* Refresh cart panel */

    renderCart();


    /* Reset checkout form */

    checkoutForm.reset();

}