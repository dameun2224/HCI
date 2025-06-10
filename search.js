// 검색 페이지 기능 구현
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-input');
    const clearSearchBtn = document.getElementById('clear-search');
    const searchResults = document.querySelector('.search-results');
    const noResults = document.querySelector('.no-results');
    const indexItems = document.querySelectorAll('.index-item');
    
    // 초성 매핑 (첫 글자의 초성 추출용)
    const CHOSUNG_MAP = {
        'ㄱ': /^[가-깋]/,
        'ㄴ': /^[나-닣]/,
        'ㄷ': /^[다-딯]/,
        'ㄹ': /^[라-맇]/,
        'ㅁ': /^[마-밓]/,
        'ㅂ': /^[바-빟]/,
        'ㅅ': /^[사-싷]/,
        'ㅇ': /^[아-잏]/,
        'ㅈ': /^[자-짛]/,
        'ㅊ': /^[차-칳]/,
        'ㅋ': /^[카-킿]/,
        'ㅌ': /^[타-팋]/,
        'ㅍ': /^[파-핗]/,
        'ㅎ': /^[하-힣]/
    };
    
    // 메뉴 데이터 초성별로 그룹화
    function groupMenusByChosung(menuList) {
        const groups = {};
        
        // 초성 그룹 초기화
        Object.keys(CHOSUNG_MAP).forEach(chosung => {
            groups[chosung] = [];
        });
        
        // 메뉴를 초성별로 분류
        menuList.forEach(menu => {
            const menuName = menu.name;
            const firstChar = menuName.charAt(0);
            
            // 해당 글자의 초성 찾기
            let foundChosung = null;
            for (const [chosung, pattern] of Object.entries(CHOSUNG_MAP)) {
                if (pattern.test(firstChar)) {
                    foundChosung = chosung;
                    break;
                }
            }
            
            // 초성 그룹에 추가
            if (foundChosung) {
                groups[foundChosung].push(menu);
            } else {
                // 한글이 아닌 경우 (영어 등)는 'ㄱ' 그룹에 임시로 넣음
                groups['ㄱ'].push(menu);
            }
        });
        
        return groups;
    }
    
    // 초성별로 그룹화된 데이터를 사용해 결과 렌더링
    function renderGroupedMenus(groupedMenus, container) {
        container.innerHTML = '';
        
        // 그룹이 있는지 확인용 플래그
        let hasAnyResults = false;
        
        // 각 초성 그룹에 대해 DOM 요소 생성
        Object.keys(groupedMenus).forEach(chosung => {
            const menus = groupedMenus[chosung];
            
            // 해당 초성에 메뉴가 있는 경우에만 표시
            if (menus.length > 0) {
                hasAnyResults = true;
                
                const groupDiv = document.createElement('div');
                groupDiv.className = 'result-group';
                groupDiv.id = `group-${chosung}`;
                
                const headerDiv = document.createElement('div');
                headerDiv.className = 'group-header';
                headerDiv.textContent = chosung;
                
                const itemsDiv = document.createElement('div');
                itemsDiv.className = 'group-items';
                
                // 해당 초성의 메뉴들 렌더링
                menus.sort((a, b) => a.name.localeCompare(b.name, 'ko')).forEach(menu => {
                    const menuItem = document.createElement('div');
                    menuItem.className = 'menu-item';
                    menuItem.dataset.id = menu.id;
                    
                    menuItem.innerHTML = `
                        <div class="menu-item-info">
                            <div class="menu-item-name">${menu.name}</div>
                            <div class="menu-item-name-eng">${menu.nameEng || ""}</div>
                            <div class="menu-item-category">${menu.corner || ""}</div>
                        </div>
                        <div class="menu-item-price">${menu.price.toLocaleString()}원</div>
                    `;
                    
                    itemsDiv.appendChild(menuItem);
                });
                
                groupDiv.appendChild(headerDiv);
                groupDiv.appendChild(itemsDiv);
                container.appendChild(groupDiv);
            }
        });
        
        // 검색 결과가 없는 경우
        if (!hasAnyResults) {
            noResults.style.display = 'flex';
        } else {
            noResults.style.display = 'none';
        }
    }
    
    // 검색어에 따라 메뉴 필터링
    function filterMenus(keyword) {
        if (!keyword) {
            // 검색어가 없으면 전체 메뉴를 초성별로 그룹화하여 표시
            renderGroupedMenus(groupMenusByChosung(menuData), searchResults);
            highlightActiveIndex();
            return;
        }
        
        // 검색어를 소문자로 변환하여 검색
        const normalizedKeyword = keyword.toLowerCase();
        
        // 메뉴 필터링
        const filteredMenus = menuData.filter(menu => {
            const nameMatch = menu.name.toLowerCase().includes(normalizedKeyword);
            const nameEngMatch = menu.nameEng && menu.nameEng.toLowerCase().includes(normalizedKeyword);
            return nameMatch || nameEngMatch;
        });
        
        // 필터링된 메뉴를 초성별로 그룹화하여 표시
        renderGroupedMenus(groupMenusByChosung(filteredMenus), searchResults);
        highlightActiveIndex();
    }
    
    // 초성 인덱스 활성화 표시
    function highlightActiveIndex() {
        const visibleGroups = document.querySelectorAll('.result-group');
        const visibleChosungs = Array.from(visibleGroups).map(group => {
            return group.id.replace('group-', '');
        });
        
        // 모든 인덱스 항목의 활성화 상태 초기화
        indexItems.forEach(item => {
            item.classList.remove('active');
            const chosung = item.dataset.index;
            
            // 해당 초성 그룹이 표시 중이면 활성화
            if (visibleChosungs.includes(chosung)) {
                item.classList.add('active');
            }
        });
    }
    
    // 초기 렌더링 (모든 메뉴를 초성별로 그룹화)
    filterMenus('');
    
    // 검색 입력 처리
    searchInput.addEventListener('input', function() {
        filterMenus(this.value);
        
        // 검색어가 있으면 클리어 버튼 표시
        if (this.value) {
            clearSearchBtn.style.display = 'block';
        } else {
            clearSearchBtn.style.display = 'none';
        }
    });
    
    // 검색어 지우기 버튼
    clearSearchBtn.addEventListener('click', function() {
        searchInput.value = '';
        filterMenus('');
        this.style.display = 'none';
        searchInput.focus();
    });
    
    // 초성 인덱스 클릭 시 해당 그룹으로 스크롤
    indexItems.forEach(item => {
        item.addEventListener('click', function() {
            const chosung = this.dataset.index;
            const targetGroup = document.getElementById(`group-${chosung}`);
            
            if (targetGroup) {
                targetGroup.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    // 메뉴 항목 클릭 시 상세 페이지로 이동
    searchResults.addEventListener('click', function(event) {
        const menuItem = event.target.closest('.menu-item');
        if (menuItem) {
            const menuId = menuItem.dataset.id;
            window.location.href = `detail.html?id=${menuId}`;
        }
    });
});
