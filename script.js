let cartCount = 0;

const cartCounter = document.querySelector(".cart-btn span");
const addButtons = document.querySelectorAll(".add-btn");

addButtons.forEach(button => {
    button.addEventListener("click", () => {

        cartCount++;

        cartCounter.textContent = cartCount;

        button.textContent = "✓";

        setTimeout(() => {
            button.textContent = "+";
        }, 700);

    });
});