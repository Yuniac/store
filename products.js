const nameToProductInStockMap = new Map([
    ["Dell", { category: "Laptop", count: 12, price: 4200 }],
    ["Sony curve", { category: "TV", count: 7, price: 8900 }],
    ["LG abc", { category: "Screen", count: 21, price: 3100 }],
    ["Dell", { category: "Laptop", count: 12, price: 4200 }],
    ["Sony curve", { category: "TV", count: 7, price: 8900 }],
    ["LG abc", { category: "Screen", count: 21, price: 3100 }],
    ["Mxyz n1", { category: "Mouse", count: 9, price: 210 }],
    ["Dell xyz", { category: "Laptop", count: 12, price: 5700 }],
    ["STT b51", { category: "Power", count: 17, price: 130 }],
    ["Samsung s5", { category: "Mobile", count: 11, price: 6700 }],
    ["iPad Pro", { category: "Tablet", count: 3, price: 9500 }],
    ["Toshiba xyz", { category: "TV", count: 5, price: 4800 }],
    ["LG Max", { category: "Screen", count: 21, price: 3400 }],
    ["Acer", { category: "Laptop", count: 12, price: 2200 }],
    ["MM Mouse", { category: "Mouse", count: 9, price: 190 }],
    ["HTC abc", { category: "Mobile", count: 11, price: 7700 }],
    ["Casper", { category: "Laptop", count: 12, price: 2600 }],
    ["iPad 6", { category: "Tablet", count: 3, price: 3900 }],
    ["BSY ggg", { category: "Screen", count: 21, price: 2100 }],
    ["Power abc", { category: "Power", count: 17, price: 150 }],
    ["Lenovo", { category: "Laptop", count: 12, price: 4400 }],
    ["FAR 22", { category: "Mouse", count: 9, price: 310 }],
    ["Sharp abc", { category: "TV", count: 7, price: 5300 }],
    ["iPad mini", { category: "Tablet", count: 3, price: 2400 }],
    ["iPhone 7", { category: "Mobile", count: 11, price: 7900 }],
    ["Apple TV", { category: "TV", count: 7, price: 8800 }],
    ["LG xyz", { category: "Screen", count: 21, price: 3900 }],
]);

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
    productInStock.count--;
}

function removeFromCart(name) {

}