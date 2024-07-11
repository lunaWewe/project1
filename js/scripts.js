let products = [];

document.addEventListener('DOMContentLoaded', () => {
    const productContainer = document.getElementById('product-container');
    const sortPriceSelect = document.getElementById('sortPrice');
    const checkoutButton = document.getElementById('checkout');

    fetchProducts().then(fetchedProducts => {
        products = fetchedProducts;
        displayProducts(products, productContainer);
        updateProductCount(products);
    });

    sortPriceSelect.addEventListener('change', (event) => {
        const sortOrder = event.target.value;
        sortProductsByPrice(products, sortOrder);
    });

    checkoutButton.addEventListener('click', handleCheckout);

    displayCart();
});

function fetchProducts() {
    return fetch('products.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .catch(error => {
            console.error('Error fetching product data:', error);
            return [];
        });
}

function displayProducts(products, container) {
    container.innerHTML = ''; // 清空現有的內容

    products.forEach(product => {
        const productCard = createProductCard(product);
        container.innerHTML += productCard;
    });
}

function createProductCard(product) {
    const formattedPrice = product.price.toLocaleString();
    return `
        <article class="product-card">
            <div class="product-img">
                <a href="#"><img src="${product.image}" alt="${product.name}"></a>
            </div>
            <div class="product-info">
                <a href="#" class="product-name">${product.name}</a>
                <a href="#" class="product-price">NT$${formattedPrice}</a>
                <a href="#" class="product-seller">${product.seller}</a>
                <button class="TocartBtn" onclick="addToCart(${product.id})">加入購物車</button>
            </div>
        </article>
    `;
}

function updateProductCount(products) {
    const productCountElement = document.getElementById('product-count');
    productCountElement.textContent = products.length; // 更新商品數量
}

function sortProductsByPrice(products, sortOrder) {
    products.sort((a, b) => {
        if (sortOrder === 'price,asc') {
            return a.price - b.price;
        } else if (sortOrder === 'price,desc') {
            return b.price - a.price;
        }
        return 0;
    });
    displayProducts(products, document.getElementById('product-container'));
}

// 購物車
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) {
        console.error('Product not found');
        return;
    }

    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItem = cartItems.find(item => item.id === product.id);

    if (cartItem) {
        cartItem.quantity += 1;
    } else {
        product.quantity = 1;
        cartItems.push(product);
    }

    localStorage.setItem('cart', JSON.stringify(cartItems));
    displayCart();
    updateCartCount();

    // 顯示成功的模態框
    var successModal = new bootstrap.Modal(document.getElementById('successModal'));
    successModal.show();
}

function displayCart() {
    const cartContainer = document.getElementById('cart');
    cartContainer.innerHTML = '';

    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    cartItems.forEach(item => {
        const cartItem = createCartItem(item);
        cartContainer.innerHTML += cartItem;
    });
}

function createCartItem(item) {
    const formattedPrice = item.price.toLocaleString(); // 添加逗号格式
    return `
         <div class="cart-item d-flex">
                <div class="row w-100">
                    <div class="col-3 d-flex align-items-center justify-content-center">
                        <img src="${item.image}" style="width: 80px;">
                    </div>
                    <div class="col-9 justify-content-between align-items-center">
                        <h4>${item.name}</h4>
                        <div class="row w-100">
                            <div class="col-8 d-flex align-items-center">
                                數量:
                                <div class="input-group input-group-sm  mx-2">
                                    <button onclick="decreaseQuantity(${item.id})" class="btn btn-secondary btn-sm">-</button>
                                    <input type="text" class="form-control text-center" value="${item.quantity}" readonly style="max-width: 50px;">
                                    <button onclick="increaseQuantity(${item.id})" class="btn btn-secondary btn-sm">+</button>
                                </div>
                            </div>
                            <p class="col-4">價格: NT$${(item.price * item.quantity).toLocaleString()}</p>
                            <div class=" d-flex align-items-end justify-content-end">
                            </div>
                            </div>
                            </div>
                            </div>
                <button onclick="removeFromCart(${item.id})" class="btn btn-danger btn-sm m-3">移除</button>
            </div>
    `;
}
function increaseQuantity(productId) {
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItem = cartItems.find(item => item.id === productId);

    if (cartItem) {
        cartItem.quantity += 1;
    }

    localStorage.setItem('cart', JSON.stringify(cartItems));
    displayCart();
    updateCartCount();
}

function decreaseQuantity(productId) {
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItem = cartItems.find(item => item.id === productId);

    if (cartItem && cartItem.quantity > 1) {
        cartItem.quantity -= 1;
    } else if (cartItem && cartItem.quantity === 1) {
        cartItems = cartItems.filter(item => item.id !== productId);
    }

    localStorage.setItem('cart', JSON.stringify(cartItems));
    displayCart();
    updateCartCount();
}

function removeFromCart(productId) {
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    cartItems = cartItems.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cartItems));
    displayCart();
    updateCartCount();
}

function handleCheckout() {
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    if (cartItems.length > 0) {
        let total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toLocaleString(); // 添加逗号格式
        alert(`總金額: NT$${total}\n感謝您的購買！`);
        localStorage.removeItem('cart');
        displayCart();
        updateCartCount();
    } else {
        alert('購物車是空的');
    }
}

function updateCartCount() {
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    document.getElementById('cartCount').textContent = cartItems.reduce((sum, item) => sum + item.quantity, 0);
}

// Carousel
const buttons = document.querySelectorAll("[data-carousel-button]")

buttons.forEach(button => {
    button.addEventListener("click", () => {
        const offset = button.dataset.carouselButton === "next" ? 1 : -1
        const slides = button
            .closest("[data-carousel]")
            .querySelector("[data-slides]")

        const activeSlide = slides.querySelector("[data-active]")
        let newIndex = [...slides.children].indexOf(activeSlide) + offset
        if (newIndex < 0) newIndex = slides.children.length - 1
        if (newIndex >= slides.children.length) newIndex = 0

        slides.children[newIndex].dataset.active = true
        delete activeSlide.dataset.active
    })
})

// topBtn
// 當用戶向下滾動 20px 顯示按鈕
window.onscroll = function () {
    scrollFunction();
};

function scrollFunction() {
    const scrollToTopBtn = document.getElementById("scrollToTopBtn");
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        scrollToTopBtn.style.display = "block";
    } else {
        scrollToTopBtn.style.display = "none";
    }
}

// 當用戶點擊按鈕時，平滑滾動回到頁面的頂部
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

function openCart() {
    var offcanvasCart = new bootstrap.Offcanvas(document.getElementById('offcanvasCart'));
    offcanvasCart.show();
}

function isUserLoggedIn() {
    // 假設這裡檢查用戶的登錄狀態，返回布爾值
    // 這裡可以檢查 cookie, localStorage, session 或其他方法來確認用戶是否已登錄
    return localStorage.getItem('loggedIn') === 'true';
}