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
    const container = document.getElementById('cartItem');
    
    products.forEach(product => {
        const productCard = `
                <tr>
                <td class="px-5"><input type="checkbox" id="select-cartItem"></td>
                <td class="px-5"><img src="${product.image}" alt="${product.name}" style="width: 150px; height: 150px;"></td>
                <td class="px-5">${product.name}</td>
                <td class="px-5">${product.price}</td>
                <td class="px-5">1</td>
            </tr>
            
        `;
        container.innerHTML += productCard;

    });
    productCountElement.textContent = productCount;
}

