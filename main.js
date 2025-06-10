// 메인 페이지 기능 구현
document.addEventListener('DOMContentLoaded', function() {
    // 페이지 요소들
    const mainPage = document.getElementById('main-page');
    const menuContainer = document.querySelector('.menu-container');
    const favoritesContainer = document.querySelector('.favorites-container');
    const categoryTabs = document.querySelectorAll('.tab-btn');
    
    // 현재 선택된 카테고리 (초기값: 조식/석식)
    let currentCategory = 'breakfast';
    
    // localStorage에서 즐겨찾기 정보 불러오기
    loadFavoritesFromLocalStorage();
    
    // 즐겨찾기 메뉴 렌더링 함수
    function renderFavorites() {
        favoritesContainer.innerHTML = '';
        const favoriteMenus = getFavoriteMenus();
        
        if (favoriteMenus.length === 0) {
            const emptyMessage = document.createElement('p');
            emptyMessage.textContent = '즐겨찾기한 메뉴가 없습니다.';
            emptyMessage.className = 'empty-message';
            favoritesContainer.appendChild(emptyMessage);
            return;
        }
        
        favoriteMenus.forEach(menu => {
            const favoriteItem = document.createElement('div');
            favoriteItem.className = 'favorite-item';
            favoriteItem.dataset.menuId = menu.id;
            favoriteItem.innerHTML = `
                <div class="favorite-img" style="background-image: url('${menu.image}'); background-size: cover;"></div>
                <h3>${menu.name}</h3>
                <p class="price">${menu.price.toLocaleString()}원</p>
                <span class="favorite-star">★</span>
            `;
            
            favoriteItem.addEventListener('click', () => showMenuDetail(menu));
            favoritesContainer.appendChild(favoriteItem);
        });
    }
    
    // 카테고리별 메뉴 렌더링 함수
    function renderMenusByCategory() {
        menuContainer.innerHTML = '';
        const menus = getMenuByCategory(currentCategory);
        
        menus.forEach(menu => {
            const menuItem = document.createElement('div');
            menuItem.className = 'menu-item';
            menuItem.dataset.menuId = menu.id;
            
            menuItem.innerHTML = `
                <div class="menu-img" style="background-image: url('${menu.image}'); background-size: cover;"></div>
                <div class="menu-info">
                    <h3>${menu.name}</h3>
                    <p>${menu.nameEng}</p>
                    <p class="price">${menu.price.toLocaleString()}원</p>
                </div>
                <button class="favorite-btn ${menu.isFavorite ? 'active' : ''}">★</button>
            `;
            
            // 메뉴 클릭 시 상세 페이지 이동
            menuItem.addEventListener('click', (e) => {
                if (!e.target.classList.contains('favorite-btn')) {
                    showMenuDetail(menu);
                }
            });
            
            // 즐겨찾기 버튼 클릭 이벤트
            const favoriteBtn = menuItem.querySelector('.favorite-btn');
            favoriteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleFavorite(menu.id);
                favoriteBtn.classList.toggle('active');
                renderFavorites(); // 즐겨찾기 섹션 업데이트
            });
            
            menuContainer.appendChild(menuItem);
        });
    }
    
    // 즐겨찾기 토글 함수
    function toggleFavorite(menuId) {
        const menuIndex = menuData.findIndex(menu => menu.id === menuId);
        if (menuIndex !== -1) {
            menuData[menuIndex].isFavorite = !menuData[menuIndex].isFavorite;
            
            // localStorage에 즐겨찾기 정보 저장
            saveFavoritesToLocalStorage();
        }
    }
    
    // 즐겨찾기 정보를 localStorage에 저장하는 함수
    function saveFavoritesToLocalStorage() {
        const favorites = menuData
            .filter(menu => menu.isFavorite)
            .map(menu => menu.id);
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }
    
    // localStorage에서 즐겨찾기 정보를 불러와 메뉴데이터에 적용하는 함수
    function loadFavoritesFromLocalStorage() {
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        
        // 모든 메뉴의 isFavorite 초기화
        menuData.forEach(menu => menu.isFavorite = false);
        
        // localStorage에 저장된 즐겨찾기 정보 적용
        favorites.forEach(id => {
            const menuIndex = menuData.findIndex(menu => menu.id === id);
            if (menuIndex !== -1) {
                menuData[menuIndex].isFavorite = true;
            }
        });
    }
    
    // 메뉴 상세 페이지로 이동 함수
    function showMenuDetail(menu) {
        window.location.href = `detail.html?id=${menu.id}`;
    }
    
    // 카테고리 탭 클릭 이벤트 처리
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            categoryTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            currentCategory = tab.dataset.category;
            renderMenusByCategory();
        });
    });
    
    // 상단 아이콘 클릭 이벤트
    document.getElementById('search-btn').addEventListener('click', function() {
        // 검색 페이지로 이동
        window.location.href = 'search.html';
    });

    document.getElementById('cart-btn').addEventListener('click', function() {
        // 장바구니 페이지로 이동
        window.location.href = 'cart.html';
    });

    document.getElementById('order-history-btn').addEventListener('click', function() {
        // 주문내역 페이지로 이동
        window.location.href = 'order-history.html';
    });

    document.getElementById('weekly-menu-btn').addEventListener('click', function() {
        // 주간 메뉴 페이지로 이동
        window.location.href = 'weekly-menu.html';
    });
    
    // 컨텐츠 초기화 실행
    renderFavorites();
    renderMenusByCategory();
});
