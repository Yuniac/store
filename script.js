const productsContainer = document.querySelector("#products");
const searchElementdiv = document.querySelector("#search");
const cartElementdiv = document.querySelector(".cart");
const cartElement = document.querySelector("#cart");
nameToProductInCartMap = new Map();

const log = console.log;

// the populating function;
function productElement(name, product, eventFunction, priceRange = 0, category) {
    let div = document.createElement("div");
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
    // if the category parameter is presnet then use it to determine whethe we return a div to be built or not, if not, we only filter using the price;
    if (category) {
        if (priceRange <= product.price && (category === "All" || product.category === category)) {
            return div
        } else {
            return null;
        }
    } else {
        if (priceRange <= product.price) {
            return div
        } else {
            return null;
        }
    }
}


// this function rebuilds the stock;
function rebuildProductsInDOM(priceRange = 0, category = "All") {
    productsContainer.innerHTML = "";
    nameToProductInStockMap.forEach((product, name) => {
        // the productElement is the div returned by the 'productElement' function if all parameters are met;
        if (productElement(name, product, handleAddProductToCartEvent, priceRange, category) !== null) {
            productsContainer.append(
                productElement(name, product, handleAddProductToCartEvent, priceRange, category)
            );
        }
    });
}
rebuildProductsInDOM(priceRange = 0, category = "All");

// empties the cart element and repopulate the cart element accroding to the cart map;
function rebuildCartInDOM() {
    cartElement.innerHTML = "";
    nameToProductInCartMap.forEach((product, name) => {
        if (product.count > 0) {
            cartElement.append(productElement(name, product, removeProductFromCartEvent));
        }
        updateCounter();
    });

}
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
            rebuildProductsInDOM(priceRange = 0, category = "All");
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
    rebuildProductsInDOM(priceRange = 0, category = "All");
}

// the search feature;
const search = document.querySelector("input");
search.addEventListener("keyup", () => {
    let term = search.value.toLowerCase();
    // shows all products when the search field is empty;
    if (term === "") {
        productsContainer.childNodes.forEach(childContainer => {
            childContainer.classList.remove("hide");
        });
    };
    // show the only products that their name matches the search result by showing/hiding that div depending on whether it matches or not;
    productsContainer.childNodes.forEach(childContainer => {
        if (childContainer.firstChild.textContent.toLowerCase().startsWith(term) || childContainer.firstChild.textContent.toLowerCase().includes(term)) {
            childContainer.classList.add("show");
            childContainer.classList.remove("hide");
        } else {
            childContainer.classList.add("hide");
        }
    })
});


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
});
cartButton.addEventListener("click", () => {
    showSideMenu(cartElementdiv);
});
// filter products functionality;
const filterButton = document.querySelector("button");
// range functionality;
// set range min, max and value dynamically;
const range = document.querySelector("#range");

const maxPrice = Array.from(nameToProductInStockMap.values()).map(productPrice => productPrice.price).reduce((acc, nxt) => Math.max(acc, nxt), 0);
range.setAttribute("max", maxPrice);
const minPrice = Array.from(nameToProductInStockMap.values()).map(productPrice => productPrice.price).reduce((acc, nxt) => Math.min(acc, nxt), 0);
range.setAttribute("min", minPrice);

// show items based on price range;
const allPrices = Array.from(Array.from(nameToProductInStockMap.values()).map(productPrice => productPrice.price));


// categories functionality;
const catgeoriesMenu = document.querySelector("#category-menu");

// get all categories dynamically;
const fullCategoriesList = Array.from(nameToProductInStockMap.values()).map(product => product.category);
// remove duplicates;
const categoriesList = [...new Set(fullCategoriesList)];

// populate the select menu with categories names;
categoriesList.forEach(category => {
    let selectElement = document.createElement("option");
    selectElement.textContent = category;
    catgeoriesMenu.append(selectElement);
})

// show products based on filters (price range and category);
function filterProducts() {
    let priceRange = range.value;
    let category = catgeoriesMenu.value;
    rebuildProductsInDOM(priceRange, category);
};
range.addEventListener("change", filterProducts);
catgeoriesMenu.addEventListener("change", filterProducts);
filterButton.addEventListener("click", filterProducts);