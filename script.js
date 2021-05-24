const productsContainer = document.querySelector("#products");
const searchElementdiv = document.querySelector("#search");
const cartElementdiv = document.querySelector(".cart");
const cartElement = document.querySelector("#cart");


// the populating function;
function productElement(name, product, eventFunction) {
    let div = document.createElement("div");
    let h2 = document.createElement("h2");
    h2.classList.add("item-name")
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
nameToProductInCartMap = new Map();

function addToCart(name) {
    let productInStock = nameToProductInStockMap.get(name);
    if (nameToProductInCartMap.has(name)) {
        // Add to existing product.
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
    if (productInStock.count > 0) {
        productInStock.count--;
    } else {
        productInStock.count = 0;
    }
}
rebuildProductsInDOM();
// Remove from cart;
function removeProductFromCartEvent() {
    let productName = this.textContent
    let productInStock = nameToProductInStockMap.get(productName);
    console.log(productInStock);
    if (nameToProductInCartMap.has(productName)) {
        let productInCart = nameToProductInCartMap.get(productName);
        if (productInCart.count > 0) {
            productInCart.count--;
            productInCart.price = productInCart.count * productInStock.price;
            rebuildCartInDOM();
        } else {
            removeProductElementFromCartEvent(this.parentNode);
        }
    } else {
        console.log(nameToProductInCartMap);
    }
}

function handleAddProductToCartEvent() {
    let productName = this.textContent;
    addToCart(productName);
    rebuildCartInDOM();
    rebuildProductsInDOM();
}

function removeProductElementFromCartEvent(div) {
    div.remove();
}

// the search bar;
const search = document.querySelector("input");
search.addEventListener("keyup", () => {
    let term = search.value;
    const itemNames = Array.from(document.querySelectorAll(".item-name"));
    if (term === "") {
        productsContainer.childNodes.forEach(product => {
            product.classList.remove("hide");
        })
    }
    itemNames.forEach(item => {
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

// cart counter functionality;

const cartElementCounter = [];