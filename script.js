const productsContainer = document.querySelector("#products");
const cart = document.querySelector("#cart");


// item is the array of items from products.js
function append(item) {
    let div = document.createElement("div");
    let h2 = document.createElement("h2");
    h2.classList.add("item-name")
    h2.textContent = `${item.name}:`;
    let ul = document.createElement("ul");
    for (let i = 1; i < 4; i++) {
        if (i === 1) {
            let li = document.createElement("li");
            li.textContent = `${Object.keys(item)[i]}: ${item.category}`
            ul.appendChild(li);
        } else if (i === 2) {
            let li = document.createElement("li");
            li.textContent = `${Object.keys(item)[i]}: ${item.count}`
            ul.appendChild(li);
        } else {
            let li = document.createElement("li");
            li.textContent = `${Object.keys(item)[i]}:${item.price}`
            ul.appendChild(li);
        }
    }
    div.appendChild(h2);
    ul.classList.add("items-details")
    div.appendChild(ul);
    div.classList.add("product")
    productsContainer.appendChild(div);
}

function addToCart() {
    const itemNames = Array.from(document.querySelectorAll(".item-name"));
    itemNames.forEach(function(itemName) {
        itemName.addEventListener("click", function() {
            let productName = this.textContent;
            let product = this.nextElementSibling;
            // this will return the ul related to the item the user clicked;
            // productDetails is the <li>s of that list, what we need to display;
            let productDetails = product.childNodes;
            let div = document.createElement("div");
            let h2 = document.createElement("h2");
            h2.classList.add("item-name-in-cart");
            h2.textContent = productName;
            let list = document.createElement("ul");
            list.classList.add("items-details-in-cart")
            productDetails.forEach(function(product) {
                let itemName = product.innerText;
                let cartItem = document.createElement("li");
                // this will return the value but not the description;
                // the breakpoint allows us to determine where the word "count" is and where is the actual count of items, its a sperator;
                let breakPoint = itemName.indexOf(":") + 2;
                if (itemName.startsWith("count")) {
                    let countWord = itemName.slice(0, breakPoint);
                    let count = itemName.slice(breakPoint);
                    cartItem.textContent = count - (count - 1);

                    function removeAnItem() {
                        let itemsCount = countWord + (count - 1);
                        // productDetails is the list of cat, count, price. We are getting the price one and working with it;
                        productDetails[1].textContent = itemsCount;

                    }
                    removeAnItem();
                } else {
                    cartItem.textContent = itemName.slice(breakPoint);
                }
                cartItem.classList.add("item-in-cart");
                list.appendChild(cartItem);
            })
            div.appendChild(h2)
            div.appendChild(list);
            div.classList.add("product-in-cart")
            cart.appendChild(div);
            cart.childNodes.forEach(item => {
                console.log(item.id);
            })

        })
    })

}
list.forEach(item => {
    append(item);
})

// remove items from in-stock;

// item here refers to the item that got added to the cart, where this function is called // the paramter passed to it is the "this" keyword;
addToCart();