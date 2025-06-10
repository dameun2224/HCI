// 주문 상세 페이지 기능 구현
document.addEventListener('DOMContentLoaded', function() {
    // URL 파라미터에서 메뉴 ID와 주문 ID 가져오기
    const urlParams = new URLSearchParams(window.location.search);
    const menuId = urlParams.get('menuId');
    const orderId = urlParams.get('orderId');
    
    // 필수 파라미터가 없으면 주문내역 페이지로 리디렉션
    if (!menuId || !orderId) {
        window.location.href = 'order-history.html';
        return;
    }
    
    // UI 요소 참조
    const backBtn = document.getElementById('back-btn');
    const statusText = document.getElementById('status-text');
    const statusTime = document.getElementById('status-time');
    const progressFill = document.getElementById('progress-fill');
    const stepPreparing = document.getElementById('step-preparing');
    const stepReady = document.getElementById('step-ready');
    const stepComplete = document.getElementById('step-complete');
    const orderNumber = document.getElementById('order-number');
    const orderTime = document.getElementById('order-time');
    const menuImage = document.getElementById('menu-image');
    const menuName = document.getElementById('menu-name');
    const menuNameEng = document.getElementById('menu-name-eng');
    const menuOptions = document.getElementById('menu-options');
    const menuPrice = document.getElementById('menu-price');
    const optionsPrice = document.getElementById('options-price');
    const totalPrice = document.getElementById('total-price');
    const paymentMethod = document.getElementById('payment-method');
    const qrCode = document.getElementById('qr-code');
    
    // 로컬 스토리지에서 주문 정보 가져오기
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    
    // 해당 주문 찾기
    const order = orders.find(o => o.id === orderId);
    if (!order) {
        alert('주문 정보를 찾을 수 없습니다.');
        window.location.href = 'order-history.html';
        return;
    }
    
    // 해당 메뉴 찾기
    const orderItem = order.items.find(item => item.id === menuId);
    if (!orderItem) {
        alert('메뉴 정보를 찾을 수 없습니다.');
        window.location.href = 'order-history.html';
        return;
    }
    
    // 주문 상태 정보 계산
    const orderStatus = getOrderStatus(order.time);
    
    // UI 업데이트
    function updateUI() {
        // 주문 상태 표시
        statusText.textContent = orderStatus.text;
        statusTime.textContent = orderStatus.timeText;
        
        // 진행바 업데이트
        progressFill.style.width = orderStatus.progress + '%';
        
        // 진행 단계 표시
        if (orderStatus.step >= 2) {
            stepPreparing.classList.add('completed');
        }
        if (orderStatus.step >= 3) {
            stepReady.classList.add('completed');
        }
        if (orderStatus.step >= 4) {
            stepComplete.classList.add('completed');
        }
        
        // 주문 번호 및 시간 표시
        orderNumber.textContent = 'A' + orderItem.orderNumber;
        
        // 주문 시간 포맷팅
        const orderDate = new Date(order.time);
        orderTime.textContent = `${orderDate.getFullYear()}-${String(orderDate.getMonth() + 1).padStart(2, '0')}-${String(orderDate.getDate()).padStart(2, '0')} ${String(orderDate.getHours()).padStart(2, '0')}:${String(orderDate.getMinutes()).padStart(2, '0')}`;
        
        // 메뉴 이미지 설정
        const menu = getMenuById(orderItem.id);
        if (menu && menu.image) {
            menuImage.style.backgroundImage = `url('${menu.image}')`;
        } else {
            menuImage.style.backgroundImage = "url('images/default.png')";
        }
        
        // 메뉴 정보 설정
        menuName.textContent = orderItem.name;
        menuNameEng.textContent = menu ? menu.nameEng : '';
        
        // 메뉴 옵션 설정
        menuOptions.innerHTML = '';
        if (orderItem.options && orderItem.options.length > 0) {
            orderItem.options.forEach(option => {
                const optionTag = document.createElement('span');
                optionTag.className = 'option-tag';
                optionTag.textContent = option;
                menuOptions.appendChild(optionTag);
            });
        }
        
        // 가격 정보 설정
        menuPrice.textContent = `${orderItem.price.toLocaleString()}원`;
        
        // 옵션 가격 계산 (이 예제에서는 옵션 가격 없음)
        optionsPrice.textContent = '0원';
        
        // 총 가격
        totalPrice.textContent = `${orderItem.price.toLocaleString()}원`;
        
        // 결제 수단 (예시)
        paymentMethod.textContent = '계좌이체';
        
        // QR 코드 생성
        createQRCode();
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
