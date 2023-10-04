// 退出按钮
const exit = document.getElementById('exit')
exit.addEventListener('touchstart', () => {
    exit.classList.add('touch');
})
exit.addEventListener('touchend', () => {
    window.location.href = '../pages/index.html'
    exit.classList.remove('touch')
})

// 积分
const redScore = document.getElementById('redScore');
const blueScore = document.getElementById('blueScore');

/** @type {HTMLCanvasElement} */
const cnv = document.getElementById('canvas')
const cxt = cnv.getContext('2d');
const cnvRect = cnv.getBoundingClientRect()

let redIsDragging = false;
let blueIsDragging = false;
let redWin = 0;
let blueWin = 0;
let oldX = 0;
let oldY = 0;
let final = false;

// 定义三个小球的参数

// 红球
const redBall = {
    x: cnv.width / 2,
    y: 3 * cnv.height / 4,
    radius: 40,
}

// 蓝球
const blueBall = {
    x: cnv.width / 2,
    y: cnv.height / 4,
    radius: 40,
    vx: 0,
    vy: 0,
}

// 黑球
const blackBall = {
    x: cnv.width / 2,
    y: cnv.height / 2,
    radius: 30,
    vx: 0,
    vy: 0
}

// 用来存放此时鼠标的位置

// 鼠标1
const mouse1 = {
    x: 0,
    y: 0,
}

// 鼠标2
const mouse2 = {
    x: 0,
    y: 0,
}

// 画棋盘
function drawDesk() {
    cxt.beginPath();
    cxt.lineWidth = 20;
    cxt.rect(0, 0, cnv.width, cnv.height)
    cxt.strokeStyle = 'black'
    cxt.stroke();

    cxt.beginPath();
    cxt.lineWidth = 20;
    cxt.strokeStyle = 'rgb(2, 172, 243)';
    cxt.moveTo(130, 0);
    cxt.lineTo(270, 0);
    cxt.stroke();

    cxt.beginPath();
    cxt.lineWidth = 20;
    cxt.strokeStyle = 'rgb(254, 95, 87)';
    cxt.moveTo(130, cnv.height);
    cxt.lineTo(270, cnv.height);
    cxt.stroke();

    cxt.beginPath();
    cxt.lineWidth = 15;
    cxt.strokeStyle = 'rgb(241, 53, 106)';
    cxt.moveTo(10, 350);
    cxt.lineTo(390, 350);
    cxt.stroke();

}

// 画球
function drawBall() {
    cxt.beginPath();
    cxt.arc(redBall.x, redBall.y, redBall.radius, 0, 2 * Math.PI);
    cxt.fillStyle = 'rgb(254, 95, 87)';
    cxt.fill();
    cxt.beginPath();
    cxt.strokeStyle = 'black';
    cxt.lineWidth = 10;
    cxt.arc(redBall.x, redBall.y, 35, 0, 2 * Math.PI);
    cxt.stroke();
    cxt.beginPath();
    cxt.arc(redBall.x, redBall.y, 15, 0, 2 * Math.PI);
    cxt.stroke();


    cxt.beginPath();
    cxt.arc(blueBall.x, blueBall.y, blueBall.radius, 0, 2 * Math.PI);
    cxt.fillStyle = 'rgb(2, 172, 243)';
    cxt.fill();
    cxt.beginPath();
    cxt.strokeStyle = 'black';
    cxt.lineWidth = 10;
    cxt.arc(blueBall.x, blueBall.y, 35, 0, 2 * Math.PI);
    cxt.stroke();
    cxt.beginPath();
    cxt.arc(blueBall.x, blueBall.y, 15, 0, 2 * Math.PI);
    cxt.stroke();

    cxt.beginPath();
    cxt.arc(blackBall.x, blackBall.y, blackBall.radius, 0, 2 * Math.PI);
    cxt.fillStyle = 'rgb(68, 75, 84)';
    cxt.fill();
    cxt.beginPath();
    cxt.strokeStyle = 'black';
    cxt.lineWidth = 10;
    cxt.arc(blackBall.x, blackBall.y, 25, 0, 2 * Math.PI);
    cxt.stroke();


}


// 边界检测

// 红球边界检测
function checkRedBorder() {
    if (redBall.x < redBall.radius) {
        redBall.x = redBall.radius + 10;
    }
    if (redBall.x > cnv.width - redBall.radius) {
        redBall.x = cnv.width - redBall.radius - 10;
    }
    if (redBall.y < cnv.height / 2 + redBall.radius) {
        redBall.y = cnv.height / 2 + redBall.radius
    }
    if (redBall.y > cnv.height - redBall.radius) {
        redBall.y = cnv.height - redBall.radius - 10
    }
}

// 蓝球边界检测
function checkBlueBorder() {
    if (blueBall.x < blueBall.radius) {
        blueBall.x = blueBall.radius + 10;
    }
    if (blueBall.x > cnv.width - blueBall.radius) {
        blueBall.x = cnv.width - blueBall.radius - 10;
    }
    if (blueBall.y < blueBall.radius) {
        blueBall.y = blueBall.radius + 10
    }
    if (blueBall.y > cnv.height / 2 - blueBall.radius) {
        blueBall.y = cnv.height / 2 - blueBall.radius
    }
}

//红球碰撞检测
function redCheckCollision() {
    let dx = redBall.x - blackBall.x
    let dy = redBall.y - blackBall.y
    let distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < redBall.radius + blackBall.radius) {
        blackBall.vx = -(oldX - blackBall.x) / 10;//除十是发现速度太快了，目前还没找到更好的方法。
        blackBall.vy = -(oldY - blackBall.y) / 10;
    }
}

// 小球移动
function ballMove() {
    blackBall.x += blackBall.vx;
    blackBall.y += blackBall.vy;
    blueBall.vx = blackBall.vx;
    blueBall.vy = blackBall.vy;
    blueBall.x += blueBall.vx;

}

// 小黑球的反弹
function blackBallBounce() {
    if (blackBall.x < blackBall.radius + 10) {
        blackBall.vx = -blackBall.vx
    }
    if (blackBall.x > cnv.width - blackBall.radius - 10) {
        blackBall.vx = -blackBall.vx
    }
    if (blackBall.y <= blackBall.radius + 10) {
        blackBall.vy = -blackBall.vy
    }
    if (blackBall.y > cnv.height - blackBall.radius - 10) {
        blackBall.vy = -blackBall.vy
    }

    let rx = redBall.x - blackBall.x
    let ry = redBall.y - blackBall.y
    let rdistance = Math.sqrt(rx * rx + ry * ry);
    if (rdistance < redBall.radius + blackBall.radius) {
        blackBall.vx = -(oldX - blackBall.x) / 20;//除十是发现速度太快了，目前还没找到更好的方法。
        blackBall.vy = -(oldY - blackBall.y) / 20;
    }

    let bx = blueBall.x - blackBall.x
    let by = blueBall.y - blackBall.y
    let bdistance = Math.sqrt(bx * bx + by * by);
    if (bdistance < blueBall.radius + blackBall.radius) {
        blackBall.vx = -(oldX - blackBall.x) / 20;//除十是发现速度太快了，目前还没找到更好的方法。
        blackBall.vy = -(oldY - blackBall.y) / 20;
    }
}

// 红球拖拽
function dragRedBall() {
    cnv.addEventListener('touchstart', (e) => {
        // 检测是否捕获到小红球
        const touch = e.touches[0];
        mouse1.x = touch.pageX - cnvRect.left;
        mouse1.y = touch.pageY - cnvRect.top;


        let dx = mouse1.x - redBall.x
        let dy = mouse1.y - redBall.y
        let dsitance = Math.sqrt(dx * dx + dy * dy);
        if (dsitance < redBall.radius) {
            redIsDragging = true;
        }

    })

    cnv.addEventListener('touchmove', (e) => {

        if (!redIsDragging) {
            return;
        }
        const touch = e.touches[0];
        mouse1.x = touch.pageX - cnvRect.left;
        mouse1.y = touch.pageY - cnvRect.top;
        redBall.x = mouse1.x;
        redBall.y = mouse1.y;
        oldX = redBall.x;
        oldY = redBall.y;
        checkRedBorder();
        redCheckCollision();
    })

    cnv.addEventListener('touchend', () => {
        redIsDragging = false;
        return;
    })

}

// 分数计算
function score() {
    if (blackBall.x >= 130 && blackBall.x <= 270 && blackBall.y <= blackBall.radius + 10) {
        redWin++;
        console.log("blue");
        final = true;
    }
    if (blackBall.x >= 130 && blackBall.x <= 270 && blackBall.y >= cnv.height - blackBall.radius - 10) {
        blueWin++;
        console.log("red");
        final = true;
    }
    redScore.textContent = redWin;
    blueScore.textContent = blueWin;
    if (final) {
        blackBall.vx = 0;
        blackBall.vy = 0;
        blackBall.x = cnv.width / 2;
        blackBall.y = cnv.height / 2;
        redBall.x = cnv.width / 2;
        redBall.y = 3 * cnv.height / 4;
        blueBall.x = cnv.width / 2;
        blueBall.y = cnv.height / 4;
        final = false;
    }
}


// 拖拽
dragRedBall();

(function drawFrame() {

    cxt.clearRect(0, 0, cnv.width, cnv.height)
    ballMove();
    blackBallBounce();
    //画出棋盘
    drawDesk();
    drawBall();
    score();
    if (redWin == 3 || blueWin == 3) {
        console.log('GAME OVER');
        return;
    }
    window.requestAnimationFrame(drawFrame);
})()