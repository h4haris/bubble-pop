//Canvas setup
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 500;

let score = 0;
let gameFrame = 0;
ctx.font = '50px Georgia';

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
class Player {
    constructor() {
        this.x = canvas.width;
        this.y = canvas.height / 2;
        this.radius = 50;
    }

    draw() {
        if (mouse.click) {
            ctx.lineWidth = 0.2;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
        }

        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }

    update() {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;

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
class Bubble {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 100;
        this.radius = 50;
        this.speed = Math.random() * 5 + 1;
        this.distance;
        this.counted = false;
    }

    draw() {
        ctx.fillStyle = 'blue';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        ctx.stroke();
    }

    update() {
        this.y -= this.speed;
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        this.distance = Math.sqrt(dx * dx + dy * dy); //pythagoras theorem to calculate distance (distance will be hypotenuse)
    }
}

function handleBubbles() {
    if (gameFrame % 50 == 0) //for every 50th frame add new bubble
    {
        bubblesArray.push(new Bubble());
    }

    for (let index = 0; index < bubblesArray.length; index++) {
        bubblesArray[index].update();
        bubblesArray[index].draw();

        if (bubblesArray[index].y < 0 - bubblesArray[index].radius * 2) {
            bubblesArray.splice(index, 1);
            index--;
        }
        else if  (bubblesArray[index].distance < bubblesArray[index].radius + player.radius) {
            if (!bubblesArray[index].counted) {
                score++;
                bubblesArray[index].counted = true;
                bubblesArray.splice(index, 1);
                index--;
            }
        }
    }
}

const player = new Player();

//Animation Loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    handleBubbles();
    player.update();
    player.draw();
    ctx.fillStyle = 'black';
    ctx.fillText('score: ' + score, 10, 50);
    gameFrame++;
    requestAnimationFrame(animate);
}

animate();