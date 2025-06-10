// 주간 메뉴 페이지 기능 구현
document.addEventListener('DOMContentLoaded', function() {
    // 주간 메뉴 데이터 (6/9 ~ 6/13)
    const weeklyMenuData = [
        {
            day: '월',
            date: '6/9',
            korean: [
                { name: '오삼불고기덮밥', price: 5000 }
            ],
            stew: [
                { name: '부대찌개', price: 5000 }
            ],
            salad: [
                { name: '치킨샐러드', price: 5000 }
            ]
        },
        {
            day: '화',
            date: '6/10',
            korean: [
                { name: '닭갈비덮밥', price: 5000 }
            ],
            stew: [
                { name: '김치찌개', price: 5000 }
            ],
            salad: [
                { name: '케이준치킨샐러드', price: 5000 }
            ]
        },
        {
            day: '수',
            date: '6/11',
            korean: [
                { name: '제육볶음', price: 5000 }
            ],
            stew: [
                { name: '돼지국밥', price: 5000 }
            ],
            salad: [
                { name: '쉬림프샐러드', price: 5500 }
            ]
        },
        {
            day: '목',
            date: '6/12',
            korean: [
                { name: '고추장불고기', price: 5000 }
            ],
            stew: [
                { name: '순두부찌개', price: 5000 }
            ],
            salad: [
                { name: '그린샐러드', price: 4500 }
            ]
        },
        {
            day: '금',
            date: '6/13',
            korean: [
                { name: '쭈꾸미볶음', price: 5500 }
            ],
            stew: [
                { name: '된장찌개', price: 5000 }
            ],
            salad: [
                { name: '참치샐러드', price: 5000 }
            ]
        }
    ];

    // 주간 메뉴 렌더링 - 테이블 형태
    function renderWeeklyMenu() {
        const weeklyMenuBody = document.getElementById('weekly-menu-body');
        weeklyMenuBody.innerHTML = '';

        // 모든 요일의 메뉴를 테이블로 출력
        weeklyMenuData.forEach(dayMenu => {
            // 한식 메뉴 행
            const koreanRow = document.createElement('tr');
            
            // 요일 셀
            const koreanDayCell = document.createElement('td');
            koreanDayCell.rowSpan = 3; // 한식, 찌개/돌솥, 샐러드 행을 하나로 합치기
            koreanDayCell.className = 'date-cell';
            koreanDayCell.innerHTML = `${dayMenu.day}<br>${dayMenu.date}`;
            koreanRow.appendChild(koreanDayCell);
            
            // 종류 셀
            const koreanTypeCell = document.createElement('td');
            koreanTypeCell.textContent = '한식';
            koreanRow.appendChild(koreanTypeCell);
            
            // 한식 메뉴 셀
            const koreanMenuCell = document.createElement('td');
            dayMenu.korean.forEach((menu, idx) => {
                koreanMenuCell.innerHTML += `<div class="menu-item">${menu.name}</div>`;
                if (idx < dayMenu.korean.length - 1) {
                    koreanMenuCell.innerHTML += '<hr style="border:0;border-top:1px solid #f0f0f0;margin:8px 0">';
                }
            });
            koreanRow.appendChild(koreanMenuCell);
            
            weeklyMenuBody.appendChild(koreanRow);
            
            // 찌개/돌솥 메뉴 행
            const stewRow = document.createElement('tr');
            
            // 종류 셀
            const stewTypeCell = document.createElement('td');
            stewTypeCell.textContent = '찌개/돌솥';
            stewRow.appendChild(stewTypeCell);
            
            // 찌개/돌솥 메뉴 셀
            const stewMenuCell = document.createElement('td');
            dayMenu.stew.forEach((menu, idx) => {
                stewMenuCell.innerHTML += `<div class="menu-item">${menu.name}</div>`;
                if (idx < dayMenu.stew.length - 1) {
                    stewMenuCell.innerHTML += '<hr style="border:0;border-top:1px solid #f0f0f0;margin:8px 0">';
                }
            });
            stewRow.appendChild(stewMenuCell);
            
            weeklyMenuBody.appendChild(stewRow);
            
            // 샐러드 메뉴 행
            const saladRow = document.createElement('tr');
            
            // 종류 셀
            const saladTypeCell = document.createElement('td');
            saladTypeCell.textContent = '샐러드';
            saladRow.appendChild(saladTypeCell);
            
            // 샐러드 메뉴 셀
            const saladMenuCell = document.createElement('td');
            dayMenu.salad.forEach((menu, idx) => {
                saladMenuCell.innerHTML += `<div class="menu-item">${menu.name}</div>`;
                if (idx < dayMenu.salad.length - 1) {
                    saladMenuCell.innerHTML += '<hr style="border:0;border-top:1px solid #f0f0f0;margin:8px 0">';
                }
            });
            saladRow.appendChild(saladMenuCell);
            
            weeklyMenuBody.appendChild(saladRow);
            
            // 구분선 추가 (가장 마지막 요일이 아닌 경우)
            // if (dayMenu.day !== '금') {
            //     const separatorRow = document.createElement('tr');
            //     const separatorCell = document.createElement('td');
            //     separatorCell.colSpan = 3;
            //     separatorCell.style.padding = '8px 0';
            //     separatorCell.style.borderBottom = '1px solid #ddd';
            //     separatorRow.appendChild(separatorCell);
            //     weeklyMenuBody.appendChild(separatorRow);
            // }
        });
    }

    // 뒤로 가기 버튼
    document.getElementById('back-btn').addEventListener('click', function() {
        window.location.href = 'index.html';
    });
    
    // 하단 탭 메뉴 이벤트
    document.getElementById('home-tab').addEventListener('click', function() {
        window.location.href = 'index.html';
    });
    
    document.getElementById('search-tab').addEventListener('click', function() {
        // 검색 기능은 아직 구현되지 않음
    });
    
    document.getElementById('cart-tab').addEventListener('click', function() {
        window.location.href = 'cart.html';
    });
    
    document.getElementById('orders-tab').addEventListener('click', function() {
        window.location.href = 'order-history.html';
    });
    
    document.getElementById('weekly-menu-tab').addEventListener('click', function() {
        // 이미 주간메뉴 페이지에 있음
    });

    // 초기 로딩 시 메뉴 렌더링
    renderWeeklyMenu();
});
