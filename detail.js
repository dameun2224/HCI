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
        menuAllergiesElement.textContent = menu.allergens || '알레르기 정보가 없습니다.';
        
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
    }
    
    // 옵션 렌더링
    function renderOptions() {
        optionsContainer.innerHTML = '';
        
        menu.options.forEach(option => {
            const optionBtn = document.createElement('button');
            optionBtn.className = 'option-btn';
            optionBtn.textContent = option;
            
            // 옵션 클릭 이벤트
            optionBtn.addEventListener('click', () => {
                // 옵션 토글
                if (selectedOptions.includes(option)) {
                    // 이미 선택된 경우 제거
                    selectedOptions = selectedOptions.filter(opt => opt !== option);
                    optionBtn.classList.remove('selected');
                } else {
                    // 선택되지 않은 경우 추가
                    selectedOptions.push(option);
                    optionBtn.classList.add('selected');
                }
            });
            
            optionsContainer.appendChild(optionBtn);
        });
    }
    
    // 뒤로 가기 버튼 클릭 이벤트
    backBtn.addEventListener('click', () => {
        window.location.href = 'index.html';
    });
    
    // 즐겨찾기 버튼 클릭 이벤트 - 버튼이 존재하는 경우에만 이벤트 리스너 추가
    if (favoriteBtn) {
        favoriteBtn.addEventListener('click', () => {
            toggleFavorite(menu.id);
            menu.isFavorite = !menu.isFavorite; // 현재 페이지의 상태 업데이트
            favoriteBtn.classList.toggle('active');
        });
    }
    
    // 장바구니 담기 버튼 클릭 이벤트
    addToCartBtn.addEventListener('click', () => {
        // 장바구니 정보 구성
        const cartItem = {
            id: menu.id,
            name: menu.name,
            price: menu.price,
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
