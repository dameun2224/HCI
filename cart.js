// 장바구니 기능 구현
document.addEventListener('DOMContentLoaded', function() {
    // 장바구니 데이터 불러오기
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // 장바구니 아이템 표시
    renderCartItems();
    
    // 결제 버튼 이벤트 리스너
    document.getElementById('paymentButton').addEventListener('click', function() {
        if (cart.length === 0) {
            alert('장바구니가 비어있습니다.');
            return;
        }
        
        const paymentMethod = document.getElementById('paymentMethod').value;
        alert(`${paymentMethod}로 결제가 완료되었습니다.\n주문이 접수되었습니다.`);
        
        // 장바구니 비우기
        localStorage.removeItem('cart');
        cart = [];
        
        // 메인 페이지로 이동
        window.location.href = 'index.html';
    });
    
    // 장바구니 아이템 렌더링 함수
    function renderCartItems() {
        const cartItemsContainer = document.getElementById('cartItems');
        cartItemsContainer.innerHTML = '';
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<div class="empty-cart">장바구니가 비어있습니다.</div>';
            updateTotalInfo();
            return;
        }
        
        cart.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            
            // 이미지 경로 확인 및 기본 이미지 설정
            const imagePath = item.image || 'images/default.png';
            
            cartItem.innerHTML = `
                <div class="cart-item-info">
                    <div class="cart-item-image">
                        <img src="${imagePath}" alt="${item.name}">
                    </div>
                    <div class="cart-item-details">
                        <h3>${item.name}</h3>
                        <p>${item.options && item.options.length > 0 ? item.options.join(', ') : ''}</p>
                    </div>
                </div>
                <div class="cart-item-price">
                    <div class="cart-item-quantity">
                        <button class="quantity-btn minus" data-index="${index}">-</button>
                        <span class="quantity-num">${item.quantity}</span>
                        <button class="quantity-btn plus" data-index="${index}">+</button>
                    </div>
                    <span>${(item.price * item.quantity).toLocaleString()}원</span>
                    <div class="cart-item-delete" data-index="${index}">
                        <i class="fas fa-trash"></i>
                    </div>
                </div>
            `;
            
            cartItemsContainer.appendChild(cartItem);
        });
        
        // 수량 변경 버튼 이벤트 리스너 추가
        document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                if (cart[index].quantity > 1) {
                    cart[index].quantity--;
                    saveCart();
                    renderCartItems();
                }
            });
        });
        
        document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                cart[index].quantity++;
                saveCart();
                renderCartItems();
            });
        });
        
        // 삭제 버튼 이벤트 리스너 추가
        document.querySelectorAll('.cart-item-delete').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                cart.splice(index, 1);
                saveCart();
                renderCartItems();
            });
        });
        
        // 총 금액 및 수량 업데이트
        updateTotalInfo();
    }
    
    // 장바구니 저장 함수
    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }
    
    // 총 금액 및 수량 업데이트 함수
    function updateTotalInfo() {
        const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = cart.reduce((sum, item) => {
            return sum + (item.price * item.quantity);
        }, 0);
        
        document.getElementById('totalQuantity').textContent = `총 ${totalQuantity}개 메뉴`;
        document.getElementById('totalPrice').textContent = `${totalPrice.toLocaleString()}원`;
    }
});
