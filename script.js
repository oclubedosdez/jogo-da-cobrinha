const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const score = document.querySelector(".score--value");
const finalScore = document.querySelector(".final-score > span");
const menu = document.querySelector(".menu-screen");
const buttonPlay = document.querySelector(".btn-play");

const audio = new Audio('./src/audio.mp3');

const size = 30;

const initialPosition = { x: 270, y: 240 };

let snake = [initialPosition];

const incrementScore = () => {
    score.innerText = +score.innerText + 10;
};

const randomNumber = (min, max) => Math.round(Math.random() * (max - min) + min);

const randomPosition = () => Math.round(randomNumber(0, canvas.width - size) / 30) * 30;

const randomColor = () => `rgb(${randomNumber(0, 255)}, ${randomNumber(0, 255)}, ${randomNumber(0, 255)})`;

const food = {
    x: randomPosition(),
    y: randomPosition(),
    color: randomColor(),
};

let direction, loopId;

const drawFood = () => {
    const { x, y, color } = food;

    ctx.shadowColor = color;
    ctx.shadowBlur = 6;

    ctx.fillStyle = color;
    ctx.fillRect(x, y, size, size);
    ctx.shadowBlur = 0;
};

const drawSnake = () => {
    ctx.fillStyle = "#ddd";

    snake.forEach((position, index) => {
        if (index === snake.length - 1) {
            ctx.fillStyle = "white";
        }

        ctx.fillRect(position.x, position.y, size, size);
    });
};

const moveSnake = () => {
    if (!direction) return;

    const head = snake[snake.length - 1];

    switch (direction) {
        case "right":
            snake.push({ x: head.x + size, y: head.y });
            break;
        case "left":
            snake.push({ x: head.x - size, y: head.y });
            break;
        case "down":
            snake.push({ x: head.x, y: head.y + size });
            break;
        case "up":
            snake.push({ x: head.x, y: head.y - size });
            break;
        default:
            break;
    }

    snake.shift();
};

const drawGrid = () => {
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#191919";

    for (let i = 30; i < canvas.width; i += 30) {
        ctx.beginPath();
        ctx.lineTo(i, 0);
        ctx.lineTo(i, 600);
        ctx.stroke();

        ctx.beginPath();
        ctx.lineTo(0, i);
        ctx.lineTo(600, i);
        ctx.stroke();
    }
};

const checkEat = () => {
    const head = snake[snake.length - 1];

    if (head.x === food.x && head.y === food.y) {
        incrementScore();
        snake.push({ ...head }); // Clone the head
        audio.play();

        let x, y;

        do {
            x = randomPosition();
            y = randomPosition();
        } while (snake.some((position) => position.x === x && position.y === y));

        food.x = x;
        food.y = y;
        food.color = randomColor();
    }
};

const checkCollision = () => {
    const head = snake[snake.length - 1];
    const canvasLimit = canvas.width - size;
    const neckIndex = snake.length - 2;

    const wallCollision = head.x < 0 || head.x > canvasLimit || head.y < 0 || head.y > canvasLimit;

    const selfCollision = snake.slice(0, neckIndex).some((position) => position.x === head.x && position.y === head.y);

    if (wallCollision || selfCollision) {
        gameOver();
    }
};

const gameOver = () => {
    direction = undefined;

    menu.style.display = 'flex';
    finalScore.innerText = score.innerText;
    canvas.style.filter = "blur(10px)";

    snake = [initialPosition];
};

const gameLoop = () => {
    clearTimeout(loopId);

    ctx.clearRect(0, 0, 600, 600);
    drawGrid();
    drawFood();
    moveSnake();
    drawSnake();
    checkEat();
    checkCollision();

    loopId = setTimeout(gameLoop, 200);
};

gameLoop();

document.addEventListener("keydown", ({ key }) => {
    if (key === "ArrowRight" && direction !== "left") {
        direction = "right";
    } else if (key === "ArrowLeft" && direction !== "right") {
        direction = "left";
    } else if (key === "ArrowDown" && direction !== "up") {
        direction = "down";
    } else if (key === "ArrowUp" && direction !== "down") {
        direction = "up";
    }
});

buttonPlay.addEventListener("click", () => {
    score.innerText = "00";
    menu.style.display = "none";
    canvas.style.filter = "none";
});
