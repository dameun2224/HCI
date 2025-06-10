// 주간 메뉴 페이지 기능 구현
document.addEventListener('DOMContentLoaded', function() {
    // 주간 메뉴 데이터 (6/9 ~ 6/13)
    const weeklyMenuData = [
        {
            day: '월',
            date: '6/9',
            breakfast: [
                { name: '미역국, 닭갈비, 감자채볶음, 꽈리멸치조림', price: 3500 }
            ],
            korean: [
                { name: '반계백숙', price: 5000 }
            ],
            omurice: [
                { name: '고구마치즈돈까스*오므라이스', price: 4500 }
            ],
            stew: [
                { name: '목살필라프', price: 5000 }
            ],
            salad: [
                { name: '버터새우샐러드', price: 5000 }
            ]
        },
        {
            day: '화',
            date: '6/10',
            breakfast: [
                { name: '물만두떡국, 떡갈비구이, 부추샐러드, 김치볶음, 열무김치', price: 3500 }
            ],
            korean: [
                { name: '돈육짜글이*계란후라이', price: 5000 }
            ],
            omurice: [
                { name: '등심돈까스*오므라이스', price: 4500 }
            ],
            stew: [
                { name: '추억의도시락덮밥', price: 5000 }
            ],
            salad: [
                { name: '목살샐러드', price: 5000 }
            ]
        },
        {
            day: '수',
            date: '6/11',
            breakfast: [
                { name: '근대감자된장국, 치킨까스*카레소스, 새송이피망볶음, 도토리묵무침', price: 3800 }
            ],
            korean: [
                { name: '로제리조또*브레드, 함박스테이크', price: 5000 }
            ],
            omurice: [
                { name: '치킨스테이크*오므라이스', price: 4800 }
            ],
            stew: [
                { name: '치킨데리마요덮밥, 치킨가라아게', price: 5000 }
            ],
            salad: [
                { name: '리코타치즈샐러드', price: 5500 }
            ]
        },
        {
            day: '목',
            date: '6/12',
            breakfast: [
                { name: '돈육콩나물김치찌개, 소시지어묵볶음, 계란스크램블, 치커리토마토샐러드팬케이크', price: 3500 }
            ],
            korean: [
                { name: '국산소불고기뚝배기', price: 5000 }
            ],
            omurice: [
                { name: '치즈함박*오므라이스', price: 4500 }
            ],
            stew: [
                { name: '돈삼겹김치볶음밥, 핫도그', price: 5000 }
            ],
            salad: [
                { name: '폴드포크샐러드', price: 4500 }
            ]
        },
        {
            day: '금',
            date: '6/13',
            breakfast: [
                { name: '황태해장국, 오삼돈불고기, 고구마고로케, 깻잎순볶음', price: 3800 }
            ],
            korean: [
                { name: '한우육개장칼국수, 찐만두', price: 5500 }
            ],
            omurice: [
                { name: '에그마니카츠&피자돈까스*오므라이스', price: 5000 }
            ],
            stew: [
                { name: '치즈닭갈비볶음밥, 팝콘치킨', price: 5000 }
            ],
            salad: [
                { name: '베이컨샐러드', price: 5000 }
            ]
        }
    ];

    // 주간 메뉴 렌더링 - 테이블 형태
    function renderWeeklyMenu() {
        const weeklyMenuBody = document.getElementById('weekly-menu-body');
        weeklyMenuBody.innerHTML = '';

        // 모든 요일의 메뉴를 테이블로 출력
        weeklyMenuData.forEach(dayMenu => {
            // 조식 메뉴 행
            const breakfastRow = document.createElement('tr');
            
            // 요일 셀
            const dayCell = document.createElement('td');
            dayCell.rowSpan = 5; // 조식, 한식, 오므라이스, 찌개/돌솥, 샐러드 행을 하나로 합치기
            dayCell.className = 'date-cell';
            dayCell.innerHTML = `${dayMenu.day}<br>${dayMenu.date}`;
            breakfastRow.appendChild(dayCell);
            
            // 종류 셀
            const breakfastTypeCell = document.createElement('td');
            breakfastTypeCell.textContent = '조식';
            breakfastRow.appendChild(breakfastTypeCell);
            
            // 조식 메뉴 셀
            const breakfastMenuCell = document.createElement('td');
            dayMenu.breakfast.forEach((menu, idx) => {
                breakfastMenuCell.innerHTML += `<div class="menu-item">${menu.name}</div>`;
                if (idx < dayMenu.breakfast.length - 1) {
                    breakfastMenuCell.innerHTML += '<hr style="border:0;border-top:1px solid #f0f0f0;margin:8px 0">';
                }
            });
            breakfastRow.appendChild(breakfastMenuCell);
            
            weeklyMenuBody.appendChild(breakfastRow);
            
            // 한식 메뉴 행
            const koreanRow = document.createElement('tr');
            
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
            
            // 오므라이스 메뉴 행
            const omuriceRow = document.createElement('tr');
            
            // 종류 셀
            const omuriceTypeCell = document.createElement('td');
            omuriceTypeCell.textContent = '오므라이스';
            omuriceRow.appendChild(omuriceTypeCell);
            
            // 오므라이스 메뉴 셀
            const omuriceMenuCell = document.createElement('td');
            dayMenu.omurice.forEach((menu, idx) => {
                omuriceMenuCell.innerHTML += `<div class="menu-item">${menu.name}</div>`;
                if (idx < dayMenu.omurice.length - 1) {
                    omuriceMenuCell.innerHTML += '<hr style="border:0;border-top:1px solid #f0f0f0;margin:8px 0">';
                }
            });
            omuriceRow.appendChild(omuriceMenuCell);
            
            weeklyMenuBody.appendChild(omuriceRow);
            
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
    
    // 하단 탭 메뉴 제거됨

    // 초기 로딩 시 메뉴 렌더링
    renderWeeklyMenu();
});
