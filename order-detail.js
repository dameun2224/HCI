// 주문 상세 페이지 기능 구현
document.addEventListener('DOMContentLoaded', function() {
    // URL 파라미터에서 주문 번호 가져오기
    const urlParams = new URLSearchParams(window.location.search);
    const orderNumParam = urlParams.get('order'); // 주문 번호 파라미터
    
    // 필수 파라미터가 없으면 로그만 출력
    if (!orderNumParam) {
        console.log('주문 번호 파라미터가 없습니다');
        // 임시 비활성화: window.location.href = 'order-history.html';
        document.body.innerHTML = '<div style="padding: 20px; text-align: center;">주문 번호가 없습니다. <a href="order-history.html">주문 내역으로 돌아가기</a></div>';
        return;
    }
    
    // UI 요소 참조
    const backBtn = document.getElementById('back-btn');
    const orderNumber = document.getElementById('order-number');
    const orderTime = document.getElementById('order-time');
    const menuName = document.getElementById('menu-name');
    const menuPriceElem = document.querySelector('.menu-price');
    const progressDots = document.querySelectorAll('.progress-dot');
    
    // 로컬 스토리지에서 주문 정보 가져오기
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    
    // 더미 주문 데이터가 없는 경우 생성 (테스트 목적)
    if (orders.length === 0) {
        const now = new Date();
        const dummyOrder = {
            id: 'order1234',
            time: now.getTime(),
            totalAmount: 8500,
            items: [{
                id: '1',
                name: '비빔밥',
                price: 4300,
                orderNumber: parseInt(orderNumParam) || 1234, // URL에 있는 번호 사용
                options: ['일반']
            }]
        };
        orders.push(dummyOrder);
        localStorage.setItem('orders', JSON.stringify(orders));
    }
    
    // 확인용 로그
    console.log('찾고 있는 주문 번호:', orderNumParam);
    console.log('전체 주문 데이터:', orders);
    
    // 해당 주문 번호를 가진 아이템을 찾기
    let foundOrder = null;
    let orderItem = null;
    
    // 모든 주문에서 orderNumber가 일치하는 메뉴 찾기 - 숫자 형식으로 변환하여 비교
    const orderNumParamInt = parseInt(orderNumParam, 10);
    
    for (const order of orders) {
        if (order.items && order.items.length > 0) {
            for (const item of order.items) {
                console.log('현재 검색중인 아이템:', item);
                // 미리 반복문내에서 로그출력하여 어떤 데이터가 있는지 확인
                if (item.orderNumber) {
                    console.log('비교: ', typeof item.orderNumber, item.orderNumber, 'vs', typeof orderNumParamInt, orderNumParamInt);
                    // 숫자, 문자열 형식 둘 다 비교
                    if (item.orderNumber === orderNumParamInt || item.orderNumber.toString() === orderNumParam) {
                        orderItem = item;
                        foundOrder = order;
                        console.log('일치하는 주문 및 아이템 발견:', orderItem, foundOrder);
                        break;
                    }
                }
            }
            if (foundOrder) break; // 해당 주문을 찾았으면 반복문 중단
        }
    }
    
    // 주문을 찾지 못한 경우 - 임시 테스트 데이터로 대체
    if (!foundOrder || !orderItem) {
        console.log('주문 번호에 해당하는 주문을 찾지 못했습니다:', orderNumParam);
        // 테스트를 위한 가지 주문 데이터 사용
        const now = new Date();
        foundOrder = {
            id: 'order' + orderNumParam,
            time: now.getTime(),
            totalAmount: 8500
        };
        
        orderItem = {
            id: '1',
            name: '비빔밥',
            price: 4300,
            orderNumber: parseInt(orderNumParam) || 1234,
            options: ['일반']
        };
        
        console.log('테스트용 데이터 생성:', foundOrder, orderItem);
    }
    
    // foundOrder를 order로 대입하여 이후 코드에서 사용할 수 있도록 함
    const order = foundOrder;
    
    // 주문 상태 정보 계산
    const orderStatus = getOrderStatus(order.time);
    
    // UI 업데이트
    function updateUI() {
        // 주문 번호 표시
        orderNumber.textContent = 'A' + orderItem.orderNumber;
        
        // 주문 시간 포맷팅
        const orderDate = new Date(order.time);
        orderTime.textContent = `${orderDate.getFullYear()}-${String(orderDate.getMonth() + 1).padStart(2, '0')}-${String(orderDate.getDate()).padStart(2, '0')} ${String(orderDate.getHours()).padStart(2, '0')}:${String(orderDate.getMinutes()).padStart(2, '0')}`;
        
        // 메뉴 이름과 가격 설정
        menuName.textContent = orderItem.name;
        menuPriceElem.textContent = `${orderItem.price.toLocaleString()}원`;
        
        // 진행 상태 표시 - 진행 단계에 따른 표시
        const activeSteps = orderStatus.step; // step을 직접 사용
        
        // 동그라미 활성화 - 현재 단계까지만 활성화 (0부터 시작하는 인덱스 고려)
        progressDots.forEach((dot, index) => {
            if (index + 1 <= activeSteps) { // 인덱스는 0부터, 단계는 1부터 시작하므로 +1 해서 비교
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
        
        // 도트 컨테이너에 has-active 클래스 추가
        const progressDotsContainer = document.querySelector('.progress-dots');
        if (activeSteps > 0) {
            progressDotsContainer.classList.add('has-active');
            // 활성화된 선의 비율 계산 - 현재 단계에 맞게 조정
            const activeWidth = ((activeSteps - 1) / 3) * 100; // 1부터 4까지의 단계를 0%~100% 범위로 변환
            progressDotsContainer.style.setProperty('--active-width', `${activeWidth}%`);
        } else {
            progressDotsContainer.classList.remove('has-active');
        }
        
        // 텍스트 라벨 활성화 - 현재 단계까지만 활성화
        const progressLabels = document.querySelectorAll('.progress-labels span');
        progressLabels.forEach((label, index) => {
            if (index + 1 <= activeSteps) { // 인덱스는 0부터, 단계는 1부터 시작하므로 +1 해서 비교
                label.classList.add('active');
            } else {
                label.classList.remove('active');
            }
        });
    }
    
    // 주문 상태 정보 반환 함수
    function getOrderStatus(orderTime) {
        const time = new Date(orderTime);
        const now = new Date();
        const diffMinutes = Math.floor((now - time) / (1000 * 60));
        
        if (diffMinutes < 5) {
            return {
                text: '주문 접수',
                timeText: '약 25분 소요 예정',
                progress: 25,
                step: 1
            };
        } else if (diffMinutes < 15) {
            return {
                text: '준비 중',
                timeText: '약 15분 소요 예정',
                progress: 50,
                step: 2
            };
        } else if (diffMinutes < 25) {
            return {
                text: '픽업 대기',
                timeText: '잠시 후 픽업 가능',
                progress: 75,
                step: 3
            };
        } else {
            return {
                text: '완료',
                timeText: '픽업 완료',
                progress: 100,
                step: 4
            };
        }
    }
    
    // QR 코드 생성 함수 (가상 QR 코드)
    function createQRCode() {
        // 캔버스 생성
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 180;
        canvas.height = 180;
        
        // 배경을 흰색으로 설정
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, 180, 180);
        
        // QR 코드 테두리
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.strokeRect(10, 10, 160, 160);
        
        // 세 모서리에 큰 사각형 그리기 (QR 코드 위치 마커)
        // 왼쪽 상단
        ctx.fillStyle = 'black';
        ctx.fillRect(20, 20, 40, 40);
        ctx.fillStyle = 'white';
        ctx.fillRect(25, 25, 30, 30);
        ctx.fillStyle = 'black';
        ctx.fillRect(30, 30, 20, 20);
        
        // 오른쪽 상단
        ctx.fillStyle = 'black';
        ctx.fillRect(120, 20, 40, 40);
        ctx.fillStyle = 'white';
        ctx.fillRect(125, 25, 30, 30);
        ctx.fillStyle = 'black';
        ctx.fillRect(130, 30, 20, 20);
        
        // 왼쪽 하단
        ctx.fillStyle = 'black';
        ctx.fillRect(20, 120, 40, 40);
        ctx.fillStyle = 'white';
        ctx.fillRect(25, 125, 30, 30);
        ctx.fillStyle = 'black';
        ctx.fillRect(30, 130, 20, 20);
        
        // 간단한 QR 코드 패턴 그리기
        ctx.fillStyle = 'black';
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                if (Math.random() > 0.6) {
                    ctx.fillRect(60 + i * 7, 60 + j * 7, 6, 6);
                }
            }
        }
        
        // 주문번호와 메뉴 ID를 QR 데이터에 포함 (실제로는 암호화됨)
        ctx.font = '8px Arial';
        ctx.fillStyle = 'black';
        ctx.fillText(`ORD:${orderItem.orderNumber}:${menuId}`, 60, 150);
        
        // 이미지를 QR 코드 요소에 설정
        qrCode.style.backgroundImage = `url(${canvas.toDataURL()})`;
    }
    
    // 메뉴 ID로 메뉴 정보 조회 함수
    function getMenuById(id) {
        // data.js에 정의된 menuData 배열을 사용
        if (typeof menuData !== 'undefined') {
            return menuData.find(menu => menu.id === id);
        }
        return null;
    }
    
    // 뒤로가기 버튼 클릭 이벤트
    backBtn.addEventListener('click', function() {
        window.location.href = 'order-history.html';
    });
    
    // UI 초기화
    updateUI();
});
