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
    
    // 옵션 렌더링
    function renderOptions() {
        optionsContainer.innerHTML = '';
        
        menu.options.forEach(option => {
            const optionBtn = document.createElement('button');
            optionBtn.className = 'option-btn';
            // 옵션 이름과 가격 표시
            optionBtn.textContent = `${option.name} (+${option.price.toLocaleString()}원)`;
            
            // 옵션 클릭 이벤트
            optionBtn.addEventListener('click', () => {
                // 옵션 토글
                // 선택된 옵션에서 옵션 객체 찾기
                const isSelected = selectedOptions.some(opt => opt.name === option.name);
                
                if (isSelected) {
                    // 이미 선택된 경우 제거
                    selectedOptions = selectedOptions.filter(opt => opt.name !== option.name);
                    optionBtn.classList.remove('selected');
                } else {
                    // 선택되지 않은 경우 추가
                    selectedOptions.push(option);
                    optionBtn.classList.add('selected');
                }
                
                // 가격 업데이트
                updatePriceInfo();
            });
            
            optionsContainer.appendChild(optionBtn);
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
            toggleFavorite(menu.id);
            menu.isFavorite = !menu.isFavorite; // 현재 페이지의 상태 업데이트
            favoriteBtn.classList.toggle('active');
        });
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
        
        // 총 가격 계산 및 표시
        const totalPrice = menu.price + optionsPrice;
        totalPriceElement.textContent = `${totalPrice.toLocaleString()}원`;
    }
    
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
            totalPrice: menu.price + optionsPrice,
            options: selectedOptions,
            quantity: 1,
            image: menu.image || 'images/default.png'
        };
        
        // 로컬 스토리지에 장바구니 추가
        addToCart(cartItem);
        
        // 사용자에게 장바구니 추가 알림 및 이동 여부 확인
        if(confirm('장바구니에 추가되었습니다. 장바구니 페이지로 이동하시겠습니까?')) {
            window.location.href = 'cart.html';
        }
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
    
    // 초기화
    displayMenuDetail();
});
