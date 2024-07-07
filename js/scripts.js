// 使用 JSON.stringify 将对象转换为字符串
Cookies.set("Product", JSON.stringify({
    "productName": "lamp",
    "price": 3000,
    "seller": "awee"
}));

// Fetch the JSON file and handle the response
fetch("users.json")
    .then(response => {
        if (!response.ok) {
            throw new Error("Network response was not ok " + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        data.forEach((e)=>{
            console.log(e.email)
        if(e.email==="123@gmail.com"){
            console.log(e.password)

            if(e.password===123456){
                console.log("ok")
                Cookies.set("userId",1)
            }
            
        }else {
            return "failed";
        }
        return "failed";
        })
        
    })
    .catch(error => {
        console.error("There has been a problem with your fetch operation:", error);
    });


    

// 檢查是否支援local storage
if (typeof(Storage) !== "undefined") {
    console.log("Local Storage is supported.");
} else {
    console.log("Local Storage is not supported.");
}


// 使用 JSON.parse 将字符串转换回对象
const product = JSON.parse(Cookies.get("Product"));
console.log(product.price); // 输出 3000

document.addEventListener('DOMContentLoaded', () => {
    const blocks = document.querySelectorAll('.block');
    const container = document.querySelector('.block-container');

    let draggedElement = null;

    blocks.forEach(block => {
        block.addEventListener('dragstart', (e) => {
            draggedElement = block;
            block.classList.add('dragging');
        });

        block.addEventListener('dragend', () => {
            draggedElement = null;
            block.classList.remove('dragging');
        });
    });

    // container.addEventListener('dragover', (e) => {
    //     e.preventDefault();
    //     const afterElement = getDragAfterElement(container, e.clientY);
    //     if (afterElement == null) {
    //         container.appendChild(draggedElement);
    //     } else {
    //         container.insertBefore(draggedElement, afterElement);
    //     }
    // });

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.block:not(.dragging)')];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }
});


// topBtn
window.onscroll = function () {
    toggleScrollToTopBtn();
};

function toggleScrollToTopBtn() {
    var btn = document.getElementById("scrollToTopBtn");
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        btn.style.display = "block";
    } else {
        btn.style.display = "none";
    }
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Carousal
const buttons = document.querySelectorAll("[data-carousel-button]");


buttons.forEach(button => {
    button.addEventListener("click", () => {
        const offset = button.dataset.carouselButton === "next" ? 1 : -1
        const slides = button
            .closest("[data-carousel]")
            .querySelector('[data-slides]')

        const activeSlide = slides.querySelector("[data-active]")
        let newIndex = [...slides.children].indexOf(activeSlide) + offset

        // 測試 newIndex 的第一個數值
        // let unK = [...slides.children].indexOf(activeSlide)
        // console.log(unK);  // 0 

        // 確保 newIndex 在範圍內
        if (newIndex < 0) newIndex = slides.children.length - 1;
        if (newIndex >= slides.children.length) newIndex = 0;

        // 更新活動幻燈片
        slides.children[newIndex].dataset.active = true;
        delete activeSlide.dataset.active;
    })
})


// 動態新增商品卡
document.addEventListener('DOMContentLoaded', () => {
    fetch('products.json')
        .then(response => response.json())
        .then(data => {
            displayProducts(data);
        })
        .catch(error => {
            console.error('Error fetching product data:', error);
        });
});

function displayProducts(products) {
    const container = document.getElementById('product-container');
    
    products.forEach(product => {
        // 创建商品卡元素
        const article = document.createElement('article');
        article.classList.add('product-card');
        
        // 创建商品图片元素
        const imgDiv = document.createElement('div');
        imgDiv.classList.add('product-img');
        const img = document.createElement('img');
        img.src = product.image;
        img.alt = product.name;
        const imgLink = document.createElement('a');
        imgLink.href = "#";
        imgDiv.appendChild(imgLink).appendChild(img);
        
        // 创建商品信息元素
        const productNameDiv = document.createElement('div');
        productNameDiv.classList.add('product-info');
        
        const nameLink = document.createElement('a');
        nameLink.href = "#";
        nameLink.classList.add('product-name');
        nameLink.textContent = product.name;
        
        const priceLink = document.createElement('a');
        priceLink.href = "#";
        priceLink.classList.add('product-price');
        priceLink.textContent = `NT$${product.price}`;
        
        const sellerLink = document.createElement('a');
        sellerLink.href = "#";
        sellerLink.classList.add('product-seller');
        sellerLink.textContent = product.seller;
        
        // 将信息元素添加到商品信息容器中
        productNameDiv.appendChild(nameLink);
        productNameDiv.appendChild(priceLink);
        productNameDiv.appendChild(sellerLink);
        
        // 将图片和商品信息添加到商品卡中
        article.appendChild(imgDiv);
        article.appendChild(productNameDiv);
        
        // 将商品卡添加到容器中
        container.appendChild(article);
    });
}

