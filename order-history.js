// 주문내역 페이지 기능 구현
document.addEventListener('DOMContentLoaded', function() {
    // UI 요소 참조
    const backBtn = document.getElementById('back-btn');
    const tabProgress = document.getElementById('tab-progress');
    const tabAll = document.getElementById('tab-all');
    const progressOrders = document.getElementById('progress-orders');
    const allOrders = document.getElementById('all-orders');
    const noOrdersMessage = document.getElementById('no-orders-message');
    const goToMenuBtn = document.getElementById('go-to-menu-btn');
    
    // 탭 전환 이벤트
    tabProgress.addEventListener('click', function() {
        tabProgress.classList.add('active');
        tabAll.classList.remove('active');
        progressOrders.classList.add('active-list');
        allOrders.classList.remove('active-list');
    });
    
    tabAll.addEventListener('click', function() {
        tabAll.classList.add('active');
        tabProgress.classList.remove('active');
        allOrders.classList.add('active-list');
        progressOrders.classList.remove('active-list');
    });
    
    // 뒤로가기 버튼 이벤트
    backBtn.addEventListener('click', function() {
        window.location.href = 'index.html';
    });
    
    // 메뉴 보러가기 버튼 이벤트
    goToMenuBtn.addEventListener('click', function() {
        window.location.href = 'index.html';
    });
    
    // 로컬 스토리지에서 주문 내역 가져오기
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    
    // 주문 내역이 없는 경우 처리
    if (orders.length === 0) {
        noOrdersMessage.style.display = 'flex';
        return;
    }
    
    // 진행중인 주문과 전체 주문 분리
    const progressingOrders = orders.filter(order => {
        // 주문 시간이 현재로부터 30분 이내인 경우에만 '진행중'으로 처리
        const orderTime = new Date(order.time);
        const now = new Date();
        return (now - orderTime) / (1000 * 60) < 30; // 30분 이내
    });
    
    // 주문 내역 렌더링
    renderOrders(progressingOrders, progressOrders);
    renderOrders(orders, allOrders);
    
    // 주문 내역이 있지만 진행중인 주문이 없는 경우 처리
    if (progressingOrders.length === 0) {
        progressOrders.innerHTML = `
            <div class="no-progress-orders">
                <p>진행중인 주문이 없습니다</p>
            </div>
        `;
    }
    
    // 주문 내역 렌더링 함수
    function renderOrders(orderList, container) {
        container.innerHTML = '';
        
        orderList.forEach(order => {
            const orderCard = document.createElement('div');
            orderCard.className = 'order-card';
            
            const orderDate = new Date(order.time);
            const formattedDate = `${orderDate.getFullYear()}-${String(orderDate.getMonth() + 1).padStart(2, '0')}-${String(orderDate.getDate()).padStart(2, '0')} ${String(orderDate.getHours()).padStart(2, '0')}:${String(orderDate.getMinutes()).padStart(2, '0')}`;
            
            // 주문 카드 헤더 생성
            let orderCardHTML = `
                <div class="order-header">
                    <div class="restaurant-name">후생관</div>
                    <div class="order-date">${formattedDate}</div>
                </div>
                <div class="order-total">총 ${order.totalAmount.toLocaleString()}원</div>
                <div class="order-items">
            `;
            
            // 주문 항목 목록 생성
            order.items.forEach(item => {
                orderCardHTML += `
                    <div class="order-item" data-menu-id="${item.id}" data-order-id="${order.id}">
                        <div class="order-item-info">
                            <span class="order-number">A${item.orderNumber}</span>
                            <span class="order-item-name">${item.name}</span>
                        </div>
                        <div class="order-item-right">
                            <span class="order-status">${getOrderStatus(order.time)}</span>
                            <span class="order-item-arrow"><i class="fas fa-chevron-right"></i></span>
                        </div>
                    </div>
                `;
            });
            
            orderCardHTML += '</div>';
            orderCard.innerHTML = orderCardHTML;
            container.appendChild(orderCard);
            
            // 진행중인 주문의 메뉴 클릭 이벤트 추가
            if (container === progressOrders) {
                const orderItems = orderCard.querySelectorAll('.order-item');
                orderItems.forEach(item => {
                    item.addEventListener('click', function() {
                        const menuId = this.dataset.menuId;
                        const orderId = this.dataset.orderId;
                        window.location.href = `order-detail.html?menuId=${menuId}&orderId=${orderId}`;
                    });
                });
            }
        });
    }
    
    // 주문 상태 반환 함수
    function getOrderStatus(orderTime) {
        const time = new Date(orderTime);
        const now = new Date();
        const diffMinutes = Math.floor((now - time) / (1000 * 60));
        
        if (diffMinutes < 5) {
            return '주문 접수';
        } else if (diffMinutes < 15) {
            return '준비 중';
        } else if (diffMinutes < 30) {
            return '픽업 대기';
        } else {
            return '완료됨';
        }
    }
    
    // 테스트를 위한 더미 주문 데이터 생성 함수 (로컬 스토리지에 주문 데이터가 없을 경우에만 실행)
    function createDummyOrders() {
        if (orders.length === 0) {
            const now = new Date();
            
            // 1시간 전 주문
            const order1Time = new Date(now);
            order1Time.setHours(now.getHours() - 1);
            
            // 15분 전 주문
            const order2Time = new Date(now);
            order2Time.setMinutes(now.getMinutes() - 15);
            
            // 2분 전 주문
            const order3Time = new Date(now);
            order3Time.setMinutes(now.getMinutes() - 2);
            
            const dummyOrders = [
                {
                    id: 'order1',
                    time: order1Time.toISOString(),
                    totalAmount: 8500,
                    items: [
                        {
                            id: '1',
                            name: '비빔밥',
                            price: 4300,
                            orderNumber: 261,
                            options: ['일반', '배 미리 알아서 준비']
                        },
                        {
                            id: '5',
                            name: '김치찌개',
                            price: 4200,
                            orderNumber: 262,
                            options: ['일반']
                        }
                    ]
                },
                {
                    id: 'order2',
                    time: order2Time.toISOString(),
                    totalAmount: 5800,
                    items: [
                        {
                            id: '3',
                            name: '돈까스',
                            price: 5800,
                            orderNumber: 270,
                            options: ['일반', '소스 추가']
                        }
                    ]
                },
                {
                    id: 'order3',
                    time: order3Time.toISOString(),
                    totalAmount: 12600,
                    items: [
                        {
                            id: '2',
                            name: '돌솥비빔밥',
                            price: 5300,
                            orderNumber: 281,
                            options: ['매운맛']
                        },
                        {
                            id: '4',
                            name: '라면',
                            price: 3300,
                            orderNumber: 282,
                            options: ['계란 추가']
                        },
                        {
                            id: '6',
                            name: '치즈 돈까스',
                            price: 4000,
                            orderNumber: 283,
                            options: ['일반']
                        }
                    ]
                }
            ];
            
            localStorage.setItem('orders', JSON.stringify(dummyOrders));
            orders = dummyOrders;
        }
    }
    
    // 더미 데이터 생성 함수 호출
    createDummyOrders();
    
    // 주문 내역 재렌더링
    const progressingOrdersAfterDummy = orders.filter(order => {
        const orderTime = new Date(order.time);
        const now = new Date();
        return (now - orderTime) / (1000 * 60) < 30;
    });
    
    renderOrders(progressingOrdersAfterDummy, progressOrders);
    renderOrders(orders, allOrders);
    
    if (progressingOrdersAfterDummy.length === 0) {
        progressOrders.innerHTML = `
            <div class="no-progress-orders">
                <p>진행중인 주문이 없습니다</p>
            </div>
        `;
    }
});
