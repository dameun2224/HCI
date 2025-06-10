// 메뉴 상세 페이지 기능 구현
document.addEventListener('DOMContentLoaded', function() {
    // URL 파라미터에서 메뉴 ID 가져오기
    const urlParams = new URLSearchParams(window.location.search);
    const menuId = urlParams.get('id');
    
    // 메뉴 ID가 없으면 메인 페이지로 리디렉션
    if (!menuId) {
        window.location.href = 'index.html';
        return;
    }
    
    // 메뉴 정보 불러오기
    const menu = getMenuById(menuId);
    
    // 메뉴 정보가 없으면 메인 페이지로 리디렉션
    if (!menu) {
        window.location.href = 'index.html';
        return;
    }
    
    // 선택된 옵션을 저장할 배열
    let selectedOptions = [];
    
    // UI 요소 참조
    const backBtn = document.getElementById('back-btn');
    const favoriteBtn = document.getElementById('favorite-detail-btn'); // 이 버튼은 존재하지 않을 수 있음
    const detailImage = document.querySelector('.detail-image');
    const menuNameElement = document.getElementById('menu-name');
    const menuNameEngElement = document.getElementById('menu-name-eng');
    const menuCornerElement = document.getElementById('menu-corner');
    const menuPriceElement = document.getElementById('menu-price');
    const menuAllergiesElement = document.getElementById('menu-allergies');
    const optionsSection = document.getElementById('options-section');
    const optionsContainer = document.getElementById('options-container');
    
    // 수량 선택 요소
    const quantityMinusBtn = document.getElementById('quantity-minus');
    const quantityPlusBtn = document.getElementById('quantity-plus');
    const quantityNumElement = document.getElementById('quantity-num');
    let quantity = 1;
    
    // 알레르기 정보 모달 요소
    const allergyInfoBtn = document.getElementById('allergy-info-btn');
    const allergyModal = document.getElementById('allergy-modal');
    const closeBtn = document.querySelector('.close-btn');
    const confirmBtn = document.querySelector('.confirm-btn');
    
    // 가격 표시 요소
    const basePriceElement = document.getElementById('base-price');
    const optionsPriceElement = document.getElementById('options-price');
    const totalPriceElement = document.getElementById('total-price');
    const optionsPriceRow = document.getElementById('options-price-row');
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    const orderNowBtn = document.getElementById('order-now-btn');
    
    // 메뉴 정보 표시
    function displayMenuDetail() {
        // 이미지 설정
        detailImage.style.backgroundImage = `url('${menu.image}')`;
        
        // 기본 정보 설정
        menuNameElement.textContent = menu.name;
        menuNameEngElement.textContent = menu.nameEng;
        menuCornerElement.textContent = menu.corner;
        menuPriceElement.textContent = `${menu.price.toLocaleString()}원`;
        
        // 알레르기 정보 설정
        if (menu.allergens && menu.allergens !== '없음') {
            menuAllergiesElement.innerHTML = menu.allergens;
        } else {
            menuAllergiesElement.innerHTML = '<p>알레르기 정보가 없습니다.</p>';
        }
        
        // 즐겨찾기 상태 설정 - 버튼이 존재하는 경우에만 실행
        if (favoriteBtn) {
            favoriteBtn.classList.toggle('active', menu.isFavorite);
        }
        
        // 옵션 설정
        if (menu.hasOptions && menu.options.length > 0) {
            optionsSection.style.display = 'block';
            renderOptions();
        } else {
            optionsSection.style.display = 'none';
        }
        
        // 가격 정보 업데이트
        updatePriceInfo();
    }
    
    // 옵션 렌더링 - 체크박스 형식으로 변경
    function renderOptions() {
        optionsContainer.innerHTML = '';
        
        menu.options.forEach(option => {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'option-checkbox';
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `option-${option.name.replace(/\s+/g, '-').toLowerCase()}`;
            checkbox.name = 'option';
            checkbox.value = option.name;
            checkbox.dataset.price = option.price;
            
            const label = document.createElement('label');
            label.htmlFor = checkbox.id;
            label.textContent = option.name;
            
            if (option.price > 0) {
                const priceSpan = document.createElement('span');
                priceSpan.className = 'option-price';
                priceSpan.textContent = ` +${option.price.toLocaleString()}원`;
                label.appendChild(priceSpan);
            }
            
            // 옵션 체크박스 이벤트
            checkbox.addEventListener('change', () => {
                if (checkbox.checked) {
                    // 체크된 경우 추가
                    selectedOptions.push(option);
                } else {
                    // 체크 해제된 경우 제거
                    const optionIndex = selectedOptions.findIndex(item => item.name === option.name);
                    if (optionIndex !== -1) {
                        selectedOptions.splice(optionIndex, 1);
                    }
                }
                
                // 가격 정보 업데이트
                updatePriceInfo();
            });
            
            optionDiv.appendChild(checkbox);
            optionDiv.appendChild(label);
            optionsContainer.appendChild(optionDiv);
        });
    }
    
    // 뒤로 가기 버튼 클릭 이벤트
    backBtn.addEventListener('click', () => {
        window.location.href = 'index.html';
    });
    
    // 알레르기 정보 버튼 클릭 이벤트
    allergyInfoBtn.addEventListener('click', () => {
        allergyModal.style.display = 'block';
    });
    
    // 모달 닫기 버튼 클릭 이벤트
    closeBtn.addEventListener('click', () => {
        allergyModal.style.display = 'none';
    });
    
    // 모달 확인 버튼 클릭 이벤트
    confirmBtn.addEventListener('click', () => {
        allergyModal.style.display = 'none';
    });
    
    // 모달 외부 클릭 시 닫기
    window.addEventListener('click', (event) => {
        if (event.target === allergyModal) {
            allergyModal.style.display = 'none';
        }
    });
    
    // 즐겨찾기 버튼 클릭 이벤트 - 버튼이 존재하는 경우에만 이벤트 리스너 추가
    if (favoriteBtn) {
        favoriteBtn.addEventListener('click', () => {
            // 즐겨찾기 상태 변경
            menu.isFavorite = !menu.isFavorite;
            favoriteBtn.classList.toggle('active');
            
            // localStorage에 즐겨찾기 정보 저장
            saveFavoritesToLocalStorage();
        });
    }
    
    // 즐겨찾기 정보를 localStorage에 저장하는 함수
    function saveFavoritesToLocalStorage() {
        // 메뉴 데이터에서 현재 메뉴의 즐겨찾기 상태 업데이트
        const menuIndex = menuData.findIndex(item => item.id === menu.id);
        if (menuIndex !== -1) {
            menuData[menuIndex].isFavorite = menu.isFavorite;
        }
        
        // 즐겨찾기된 모든 메뉴의 ID만 추출하여 저장
        const favorites = menuData
            .filter(item => item.isFavorite)
            .map(item => item.id);
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }
    
    // localStorage에서 즐겨찾기 정보를 불러오는 함수
    function loadFavoritesFromLocalStorage() {
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        
        // 로드된 즐겨찾기 상태 적용
        const menuIndex = menuData.findIndex(item => item.id === menu.id);
        if (menuIndex !== -1) {
            menuData[menuIndex].isFavorite = favorites.includes(menu.id);
            menu.isFavorite = favorites.includes(menu.id);
        }
    }
    
    // 가격 정보 업데이트 함수
    function updatePriceInfo() {
        // 기본 가격 설정
        basePriceElement.textContent = `${menu.price.toLocaleString()}원`;
        
        // 옵션 가격 계산
        let optionsPrice = 0;
        selectedOptions.forEach(option => {
            optionsPrice += option.price;
        });
        
        // 옵션 가격 표시
        if(optionsPrice > 0) {
            optionsPriceRow.style.display = 'flex';
            optionsPriceElement.textContent = `+${optionsPrice.toLocaleString()}원`;
        } else {
            optionsPriceRow.style.display = 'none';
        }
        
        // 총 가격 계산 및 표시 (수량 반영)
        const totalPrice = (menu.price + optionsPrice) * quantity;
        totalPriceElement.textContent = `${totalPrice.toLocaleString()}원`;
    }
    
    // 수량 버튼 이벤트 리스너
    quantityMinusBtn.addEventListener('click', () => {
        if (quantity > 1) {
            quantity--;
            quantityNumElement.textContent = quantity;
            updatePriceInfo();
        }
    });
    
    quantityPlusBtn.addEventListener('click', () => {
        quantity++;
        quantityNumElement.textContent = quantity;
        updatePriceInfo();
    });
    
    // 장바구니 버튼 클릭 이벤트
    addToCartBtn.addEventListener('click', () => {
        // 추가 가격 계산
        let optionsPrice = 0;
        selectedOptions.forEach(option => {
            optionsPrice += option.price;
        });
        
        // 장바구니 정보 구성
        const cartItem = {
            id: menu.id,
            name: menu.name,
            price: menu.price,
            optionsPrice: optionsPrice,
            totalPrice: (menu.price + optionsPrice) * quantity,
            options: selectedOptions,
            quantity: quantity,
            image: menu.image || 'images/default.png'
        };
        
        // 로컬 스토리지에 장바구니 추가
        addToCart(cartItem);
        
        // 사용자에게 장바구니 추가 알림 및 이동 여부 확인
        if(confirm('장바구니에 추가되었습니다. 장바구니 페이지로 이동하시겠습니까?')) {
            window.location.href = 'cart.html';
        }
    });
    
    // 바로결제 버튼 클릭 이벤트
    orderNowBtn.addEventListener('click', () => {
        // 추가 가격 계산
        let optionsPrice = 0;
        selectedOptions.forEach(option => {
            optionsPrice += option.price;
        });
        
        // 장바구니 정보 구성
        const cartItem = {
            id: menu.id,
            name: menu.name,
            price: menu.price,
            optionsPrice: optionsPrice,
            totalPrice: (menu.price + optionsPrice) * quantity,
            options: selectedOptions,
            quantity: quantity,
            image: menu.image || 'images/default.png'
        };
        
        // 임시 장바구니에 추가 (바로 결제용)
        let directOrder = [cartItem];
        localStorage.setItem('directOrder', JSON.stringify(directOrder));
        
        // 결제 페이지로 이동
        window.location.href = 'payment.html?direct=true';
    });
    
    // 장바구니에 메뉴 추가 함수
    function addToCart(item) {
        // 로컬 스토리지에서 장바구니 데이터 가져오기
        let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
        
        // 장바구니에 추가
        cartItems.push(item);
        
        // 로컬 스토리지에 저장
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }
    
    // localStorage에서 즐겨찾기 정보 불러오기
    loadFavoritesFromLocalStorage();
    
    // 초기화
    displayMenuDetail();
});
