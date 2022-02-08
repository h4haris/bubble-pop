//Todo:
// Refactoring
// Animate Player
// Add new fishes
// animate bubble popup on collision

//Canvas setup
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 500;

let score = 0;
let gameFrame = 0;
ctx.font = '40px Georgia';
let gameSpeed = 1;
let gameOver = false;

//Mouse Interactivity
let canvasPosition = canvas.getBoundingClientRect();

const mouse = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    click: false
}

canvas.addEventListener('mousedown', function(event) {
    mouse.click = true;
    //subtracting canvasPosition to avoid measuring distance from edges of browser window
    mouse.x = event.x - canvasPosition.left; // mouse.x = event.x;
    mouse.y = event.y - canvasPosition.top; // mouse.y = event.y;
});

canvas.addEventListener('mouseup', function() {
    mouse.click = false;
});

//Player
const playerLeft = new Image();
playerLeft.src = 'fish_swim_left.png';
const playerRight = new Image();
playerRight.src = 'fish_swim_right.png';

class Player {
    constructor() {
        this.x = canvas.width;
        this.y = canvas.height / 2;
        this.radius = 50;
        this.angle = 0;
        this.frameX = 0;
        this.frameY = 0;
        this.frame = 0;
        this.spriteWidth = 498; //calculate from sprite sheet i.e. 1992px / 4 columns = 498 
        this.spriteHeight = 327; //calculate from sprite sheet i.e. 981px / 3 rows = 327
    }

    draw() {
        if (mouse.click) {
            ctx.lineWidth = 0.2;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
        }

        // ctx.fillStyle = 'red';
        // ctx.beginPath();
        // ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        // ctx.fill();
        // ctx.closePath();
        // // ctx.fillStyle = 'black';
        // ctx.fillRect(this.x, this.y, this.radius, 10);

        ctx.save() //save current canvas settings
        ctx.translate(this.x, this.y); //mentioning player current position for rotation
        ctx.rotate(this.angle);
        // if (this.x >= mouse.x) {
        //     ctx.drawImage(playerLeft, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.x - 60, this.y - 45, this.spriteWidth / 4, this.spriteHeight / 4)
        // } else {
        //     ctx.drawImage(playerRight, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.x - 60, this.y - 45, this.spriteWidth / 4, this.spriteHeight / 4);
        // }

        if (this.x >= mouse.x) {
            ctx.drawImage(playerLeft, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, 0 - 60, 0 - 45, this.spriteWidth / 4, this.spriteHeight / 4)
        } else {
            ctx.drawImage(playerRight, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, 0 - 60, 0 - 45, this.spriteWidth / 4, this.spriteHeight / 4);
        }

        ctx.restore(); // restore to previous state before save so changes we applied above will be only restricted to player and does not effect other things
    }

    update() {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        let theta = Math.atan2(dy, dx);
        this.angle = theta;
        if (mouse.x != this.x) {
            this.x -= dx / 10;
        }
        if (mouse.y != this.y) {
            this.y -= dy / 10;
        }
    }
}

//Bubbles
const bubblesArray = [];
const bubbleImage = new Image();
bubbleImage.src = 'bubble_pop_frame_01.png';
class Bubble {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 100;
        this.radius = 50;
        this.speed = Math.random() * 5 + 1;
        this.distance;
        this.counted = false;
        this.sound = Math.random() <= 0.5 ? 'sound1' : 'sound2';
    }

    draw() {
        // ctx.fillStyle = 'blue';
        // ctx.beginPath();
        // ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        // ctx.fill();
        // ctx.closePath();
        // ctx.stroke();
        ctx.drawImage(bubbleImage, this.x - 65, this.y - 65, this.radius * 2.6, this.radius * 2.6);
    }

    update() {
        this.y -= this.speed;
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        this.distance = Math.sqrt(dx * dx + dy * dy); //pythagoras theorem to calculate distance (distance will be hypotenuse)
    }
}

//Enemies
// const bubblesArray = [];
const enemyImage = new Image();
enemyImage.src = 'enemy1.png';
class Enemy {
    constructor() {
        this.x = canvas.width + 200;
        this.y = Math.random() * (canvas.height - 150) + 90;
        this.radius = 60;
        this.speed = Math.random() * 2 + 2;
        this.frame = 0;
        this.frameX = 0;
        this.frameY = 0;
        this.spriteWidth = 418; //calculate from sprite sheet i.e. 1672px / 4 columns = 418 
        this.spriteHeight = 397; //calculate from sprite sheet i.e. 1191px / 3 rows = 397
    }

    draw() {
        // ctx.fillStyle = 'red';
        // ctx.beginPath();
        // ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        // ctx.fill();
        // ctx.closePath();
        // ctx.stroke();
        ctx.drawImage(enemyImage, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.x - 65, this.y - 70, this.spriteWidth / 3, this.spriteHeight / 3);
    }

    update() {
        this.x -= this.speed;
        if (this.x < 0 - this.radius * 2) {
            this.x = canvas.width + 200;
            this.y = Math.random() * (canvas.height - 150) + 90;
            this.speed = Math.random() * 2 + 2;
        }

        if (gameFrame % 5 == 0) {
            this.frame++;
            if (this.frame >= 12) this.frame = 0;

            if (this.frame == 3 || this.frame == 7 || this.frame == 11) this.frameX = 0
            else this.frameX++;

            if (this.frame < 3) this.frameY = 0
            else if (this.frame < 7) this.frameY = 1
            else if (this.frame < 11) this.frameY = 2
            else this.frameY = 0;

        }

        //collision with player
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        const distance = Math.sqrt(dx * dx + dy * dy) //pythagoras theorem to calculate distance (distance will be hypotenuse)

        if (distance < this.radius + player.radius) {
            handleGameOver();
        }
    }
}

function handleGameOver() {
    ctx.fillStyle = 'white';
    ctx.fillText('GAME OVER, you reached score: ' + score, 100, 250);
    gameOver = true;
}

const bubblePop1 = document.createElement('audio');
bubblePop1.src = 'Plop.ogg';
const bubblePop2 = document.createElement('audio');
bubblePop2.src = 'bubbles-single2.wav';

function handleBubbles() {
    if (gameFrame % 50 == 0) //for every 50th frame add new bubble
    {
        bubblesArray.push(new Bubble());
    }

    // for (let index = 0; index < bubblesArray.length; index++) {

    // }
    for (let index = 0; index < bubblesArray.length; index++) {
        bubblesArray[index].update();
        bubblesArray[index].draw();

        if (bubblesArray[index].y < 0 - bubblesArray[index].radius * 2) {
            bubblesArray.splice(index, 1);
            index--;
        } else if (bubblesArray[index].distance < bubblesArray[index].radius + player.radius) {
            if (!bubblesArray[index].counted) {
                if (bubblesArray[index].sound == 'sound1') {
                    bubblePop1.play()
                } else {
                    bubblePop2.play()
                }
                score++
                bubblesArray[index].counted = true
                bubblesArray.splice(index, 1);
                index--;

            }
        }
    }
}

const player = new Player();

//Repeating backgrounds
const background = new Image();
background.src = 'background1.png';

const BG = {
    x1: 0,
    x2: canvas.width,
    y: 0,
    width: canvas.width,
    height: canvas.height,
}

function handleBackground() {
    BG.x1 -= gameSpeed;
    if (BG.x1 < -BG.width) BG.x1 = BG.width;
    BG.x2 -= gameSpeed;
    if (BG.x2 < -BG.width) BG.x2 = BG.width;
    ctx.drawImage(background, BG.x1, BG.y, BG.width, BG.height);
    ctx.drawImage(background, BG.x2, BG.y, BG.width, BG.height);
}

const enemy1 = new Enemy();

function handleEnemies() {
    enemy1.draw();
    enemy1.update();
}

//Animation Loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    handleBackground();
    handleBubbles();
    player.update();
    player.draw();
    handleEnemies();
    ctx.fillStyle = 'black';
    ctx.fillText('score: ' + score, 10, 50);
    gameFrame++;
    if (!gameOver) requestAnimationFrame(animate);
}

animate()

window.onresize = function() {
    canvasPosition = canvas.getBoundingClientRect();
}