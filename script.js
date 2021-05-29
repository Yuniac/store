const productsContainer = document.querySelector("#products");
const searchElementdiv = document.querySelector("#search");
const cartElementdiv = document.querySelector(".cart");
const cartElement = document.querySelector("#cart");
nameToProductInCartMap = new Map();

const log = console.log;

// the populating function;
function productElement(name, product, eventFunction, outOFStockDiv) {
    let div = document.createElement("div");
    outOFStockDiv = div;
    let h2 = document.createElement("h2");
    h2.classList.add("item-name", "no-select")
    h2.textContent = name;
    let ul = document.createElement("ul");
    ul.classList.add("items-details");
    let listTexts = [
        `category: ${product.category}`,
        `count: ${product.count}`,
        `price: ${product.price}`,
    ]
    listTexts.forEach(listText => {
        let li = document.createElement("li");
        li.textContent = listText;
        ul.appendChild(li);
    })
    div.appendChild(h2);
    div.appendChild(ul);
    div.classList.add("product")
    if (product.count < 1) {
        div.classList.add("out-of-stock");
        h2.classList.add("out-of-stock-name");
    }
    h2.addEventListener("click", eventFunction);
    return div
}

// empties the cart element and repopulate the cart element accroding to the cart map;
function rebuildCartInDOM() {
    cartElement.innerHTML = "";
    nameToProductInCartMap.forEach((product, name) => {
        if (product.count > 0) {
            cartElement.appendChild(productElement(name, product, removeProductFromCartEvent));
        }
        updateCounter();
    });

}

function rebuildProductsInDOM() {
    productsContainer.innerHTML = "";
    nameToProductInStockMap.forEach((product, name) => {
        productsContainer.appendChild(
            productElement(name, product, handleAddProductToCartEvent)
        );
    });
}
rebuildProductsInDOM();

// cart counter functionality and showing the total in cart;

const quantity = document.querySelector("#quantity");
const total = document.querySelector("#total-price");

const cartElementCounter = document.querySelector("#cart-counter");



function updateCounter() {
    cartElementCounter.textContent = cartElement.childElementCount;

    function getQuantity() {
        const quantityTotalArray = Array.from(nameToProductInCartMap.values());
        let quantityTotal = quantityTotalArray.map(x => x.count).reduce((current, nxtValue) => current + nxtValue, 0);
        quantity.textContent = quantityTotal;
    }
    getQuantity();

    function getTotalPrice() {
        const totalPricesArray = Array.from(nameToProductInCartMap.values());
        let totalPrices = totalPricesArray.map(x => x.price).reduce((current, nxtValue) => current + nxtValue, 0);
        total.textContent = totalPrices + "TL";
    }
    getTotalPrice();
}

function addToCart(name) {
    let productInStock = nameToProductInStockMap.get(name);
    if (productInStock.count > 0) {
        // Add to existing products.
        if (nameToProductInCartMap.has(name)) {
            let updatedCount = nameToProductInCartMap.get(name).count + 1
            nameToProductInCartMap.set(name, {
                category: productInStock.category,
                count: updatedCount,
                price: updatedCount * productInStock.price,
            });
        } else {
            // Add new product.
            nameToProductInCartMap.set(name, {
                category: productInStock.category,
                count: 1,
                price: productInStock.price,
            });
        }
    } else {

    }
    // update the count in the prodcuts section;
    if (productInStock.count > 0) {
        productInStock.count--;
    } else {
        productInStock.count = 0;
    }
    updateCounter();

}

function removeProductFromCartEvent() {
    let productName = this.textContent
    let productInStock = nameToProductInStockMap.get(productName);
    if (nameToProductInCartMap.has(productName)) {
        let productInCart = nameToProductInCartMap.get(productName);
        if (productInCart.count > 0) {
            productInCart.count--;
            productInStock.count++;
            productInCart.price = productInCart.count * productInStock.price;
            updateCounter();
            rebuildCartInDOM();
            rebuildProductsInDOM();
        } else {
            removeProductElementFromCartEvent(this.parentNode);
            updateCounter();
        }
    }
}

function removeProductElementFromCartEvent(div) {
    div.remove();
    updateCounter();
}

function handleAddProductToCartEvent() {
    let productName = this.textContent;
    addToCart(productName);
    rebuildCartInDOM();
    rebuildProductsInDOM();
}

// the search bar;
const search = document.querySelector("input");
search.addEventListener("keyup", () => {
    let term = search.value.toLocaleLowerCase();
    const productNames = Array.from(document.querySelectorAll(".item-name"));
    if (term === "") {
        productsContainer.childNodes.forEach(product => {
            product.classList.remove("hide");
        })
    }
    productNames.forEach(item => {
        if (item.textContent.includes(term)) {
            productsContainer.childNodes.forEach(product => {
                if (product.firstChild.textContent.includes(term)) {
                    product.classList.add("show");
                } else {
                    product.classList.add("hide");
                }
            })
        }
    })
})

window.onload = function() {
    search.value = "";
}


// responsiveness functions;

const searchButton = document.querySelector("#search-button");
const cartButton = document.querySelector("#cart-button");

function showSideMenu(div) {
    if (div.classList.contains("toggle-side-menu")) {
        div.classList.remove("toggle-side-menu");
    } else {
        div.classList.add("toggle-side-menu");
    }
}

searchButton.addEventListener("click", () => {
    showSideMenu(searchElementdiv);
})
cartButton.addEventListener("click", () => {
    showSideMenu(cartElementdiv);
})