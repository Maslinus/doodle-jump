//board
let board;
let boardWidth = 360;
let boardHeight = 650;
let context;

//doodler
let doodlerWidth = 46;
let doodlerHeight = 46;
let doodlerX = boardWidth/2 - doodlerWidth/2;
let doodlerY = boardHeight-50 - doodlerHeight;
let doodler = {
    img : null,
    x : doodlerX,
    y : doodlerY,
    width : doodlerWidth,
    height : doodlerHeight
}

//physics
let velocityX = 0; // Скорость преремещение по оси x
let velocityY = 0; // Скорость прыжка
let initialVelocityY = -3.5; // Стартовая скорость
let gravity = 0.1;

//platforms
let platformArray = [];
let platformWidth = 60;
let platformHeight = 18;
let platformImg;

//score
let score = 0;
let maxScore = 0;
let gameOver = false;

//audio
const jump_audio = new Audio();
jump_audio.src = "audio/jump.mp3";
const W5000_audio = new Audio();
W5000_audio.src = "audio/Win.mp3";
const Lose_audio = new Audio();
Lose_audio.src = "audio/Lose.mp3";

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    //load images
    doodlerRightImg = new Image();
    doodlerRightImg.src = "./img/doodler-right.png";
    doodler.img = doodlerRightImg;
    doodlerRightImg.onload = function() {
        context.drawImage(doodler.img, doodler.x, doodler.y, doodler.width, doodler.height);
    }

    doodlerLeftImg = new Image();
    doodlerLeftImg.src = "./img/doodler-left.png";

    ProLeftImg = new Image();
    ProLeftImg.src = "./img/Girl-left.png";
    ProRightImg = new Image();
    ProRightImg.src = "./img/Girl-right.png";

    platformImg = new Image();
    platformImg.src = "./img/platform.png";

    velocityY = initialVelocityY;
    placePlatforms();
    requestAnimationFrame(update);
    document.addEventListener("keydown", moveDoodler);
}

function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    // Обновление положения по x коордмнате
    if(velocityX>0){
        velocityX-=gravity/10
    }
    else if(velocityX<0){
        velocityX+=gravity/10
    }
    doodler.x += velocityX;
    if (doodler.x > boardWidth) {
        doodler.x = 0;
    }
    else if (doodler.x + doodler.width < 0) {
        doodler.x = boardWidth;
    }

    // Обновление положения по y коордмнате, проверка на проигрыш
    velocityY += gravity;
    doodler.y += velocityY;
    if (doodler.y > board.height) {
        gameOver = true;
    }
    context.drawImage(doodler.img, doodler.x, doodler.y, doodler.width, doodler.height);

    //platforms
    for (let i = 0; i < platformArray.length; i++) {
        let platform = platformArray[i];
        if (velocityY < 0 && doodler.y < boardHeight*3/4) {
            platform.y -= initialVelocityY+2; // сдвигаем платформу вниз
        }
        if (detectCollision(doodler, platform) && velocityY >= 0) {
            jump_audio.play();

            velocityY = initialVelocityY; // Прыжок
        }
        context.drawImage(platform.img, platform.x, platform.y, platform.width, platform.height);
    }

    // удаляем платформу снизу и добавляем новую платформу сверх
    while (platformArray.length > 0 && platformArray[0].y >= boardHeight) {
        platformArray.shift(); // удаляем первый элемент из массива
        newPlatform(); // заменяем новой платформой сверху
    }

    //score
    updateScore();
    if(score>=5000 && score<=6600){
        W5000_audio.play()
        context.fillStyle = "green"; // Цвет текста
        context.font = "16px sans-serif"; // Шрифт и размер текста
        context.fillText("Поздравляем вы true DOOLER!", 65, 20, boardWidth-10); // Отображение надписи о победе
    }
    context.fillStyle = "black";
    context.font = "16px sans-serif";
    context.shadowBlur = 0;
    context.fillText(score, 5, 20, 60);
    if (gameOver) {
        Lose_audio.play()
        context.shadowOffsetX = 1;
        context.shadowOffsetY = 1;
        context.shadowBlur = 10;
        context.shadowColor = "#f00";
        context.font = "20px sans-serif";
        context.fillText("Нажмите «Пробел», чтобы начать заново", 2 , boardHeight/2+50, 356);
        context.shadowColor = "#222";
        context.fillText("Points: "+score, 60, boardHeight/2,);
        context.font = "60px sans-serif";
        context.fillStyle = "red";
        context.fillText("Игра окончена", 60 , boardHeight/2-30, 240);

    }
}

function moveDoodler(e) {
    
if(score <= 5000){Y=doodlerLeftImg}
  else{Y=ProLeftImg
    doodler.width = 30
    doodler.height = 60

  }
  
  if(score <= 5000){X=doodlerRightImg}
  else{X=ProRightImg}
  
  
    if (e.code == "ArrowRight" || e.code == "KeyD") {
        velocityX = 4;
        doodler.img = X;
    }
    else if (e.code == "ArrowLeft" ||  e.code == "KeyA") {
        velocityX = -4;
        doodler.img = Y;
    }

    else if (e.code == "Space" && gameOver) {
        //перезагрузка игры
        doodler = {
            img : doodlerRightImg,
            x : doodlerX,
            y : doodlerY,
            width : doodlerWidth,
            height : doodlerHeight
        }

        velocityX = 0;
        velocityY = initialVelocityY;
        score = 0;
        maxScore = 0;
        gameOver = false;
        placePlatforms();
    }
}

// Начальная выкладка платформ
function placePlatforms() {
    platformArray = [];

    //Начальная платформа
    let platform = {
        img : platformImg,
        x : boardWidth/2-35,
        y : boardHeight - 50,
        width : platformWidth,
        height : platformHeight
    }

    platformArray.push(platform);

    for (let i = 0; i < 7; i++) {
        let randomX = Math.floor(Math.random() * boardWidth*3/4);
        let platform = {
            img : platformImg,
            x : randomX,
            y : boardHeight - 75*i - 150,
            width : platformWidth,
            height : platformHeight
        }
    
        platformArray.push(platform);
    }
}

function newPlatform() {
    let randomX = Math.floor(Math.random() * boardWidth*3/4);
    let platform = {
        img : platformImg,
        x : randomX,
        y : -platformHeight,
        width : platformWidth,
        height : platformHeight
    }

    platformArray.push(platform);
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&   //верхний левый угол a не достигает верхнего правого угла b
           a.x + a.width > b.x &&   //верхний правый угол игрока А проходит через верхний левый угол игрока Б
           a.y < b.y + b.height &&  //левый верхний угол а не достигает левого нижнего угла б
           a.y + a.height > b.y;    //левый нижний угол А проходит левый верхний угол Б
}

function updateScore() {
    let points = 22;
    if (velocityY < 0) { 
        maxScore += points;
        if (score < maxScore) {
            score = maxScore;
        }
    }
    else if (velocityY >= 0) {
        maxScore -= points;
    }
}