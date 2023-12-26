const playArea = document.querySelector(".play-area");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");
let gameConfig = {
    foodX: 0,
    foodY: 0,
    snakeX: 5,
    snakeY: 10,
    velocityX: 0,
    velocityY: 0,
    snakeBody: [],
    gameOver: false,
    setIntervalId: 0,
    score: 0
}
let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerHTML = `High Score: ${highScore}`;
function changeFoodPosition() {
    gameConfig.foodX = Math.floor(Math.random() * 30) + 1;
    gameConfig.foodY = Math.floor(Math.random() * 30) + 1;
}
function afterGameOver() {
    clearInterval(gameConfig.setIntervalId);
    Swal.fire({
        icon: 'error',
        title: 'Game Over!',
        text: 'Press OK to replay...'
    }).then(result => {
        if (result.isConfirmed) {
            location.reload();
        }
    })
}
function changeDirection(e) {
    if (e.key === "ArrowUp" && gameConfig.velocityY != 1) {
        gameConfig.velocityX = 0;
        gameConfig.velocityY = -1;
    } else if (e.key === "ArrowDown" && gameConfig.velocityY != -1) {
        gameConfig.velocityX = 0;
        gameConfig.velocityY = 1;
    } else if (e.key === "ArrowLeft" && gameConfig.velocityX != 1) {
        gameConfig.velocityX = -1;
        gameConfig.velocityY = 0;
    } else if (e.key === "ArrowRight" && gameConfig.velocityX != -1) {
        gameConfig.velocityX = 1;
        gameConfig.velocityY = 0;
    }
}
controls.forEach(key => {
    key.addEventListener("click", () => changeDirection({ key: key.dataset.key }));
});
function repetableLogic() {
    if (gameConfig.gameOver) return afterGameOver();
    let htmlForm = `<div class="food" style="grid-area: ${gameConfig.foodY} / ${gameConfig.foodX}"></div>`;
    if (gameConfig.snakeX === gameConfig.foodX && gameConfig.snakeY === gameConfig.foodY) {
        changeFoodPosition();
        gameConfig.snakeBody.push([gameConfig.foodX, gameConfig.foodY]);
        gameConfig.score++;
        highScore = gameConfig.score >= highScore ? gameConfig.score : highScore;
        localStorage.setItem("high-score", highScore);
        scoreElement.innerHTML = `Score: ${gameConfig.score}`;
        highScoreElement.innerHTML = `High Score: ${highScore}`;
    }
    for (let i = gameConfig.snakeBody.length - 1; i > 0; i--) {
        gameConfig.snakeBody[i] = gameConfig.snakeBody[i - 1];
    }
    gameConfig.snakeBody[0] = [gameConfig.snakeX, gameConfig.snakeY];
    gameConfig.snakeX += gameConfig.velocityX;
    gameConfig.snakeY += gameConfig.velocityY;
    if (gameConfig.snakeX <= 0 || gameConfig.snakeX > 30 || gameConfig.snakeY <= 0 || gameConfig.snakeY > 30) {
        gameConfig.gameOver = true;
    }
    for (let i = 0; i < gameConfig.snakeBody.length; i++) {
        htmlForm += `<div class="head" style="grid-area: ${gameConfig.snakeBody[i][1]} / ${gameConfig.snakeBody[i][0]}"></div>`;
        if (i !== 0 && gameConfig.snakeBody[0][1] === gameConfig.snakeBody[i][1] && gameConfig.snakeBody[0][0] === gameConfig.snakeBody[i][0]) {
            gameConfig.gameOver = true;
        }
    }
    playArea.innerHTML = htmlForm;
}
changeFoodPosition();
gameConfig.setIntervalId = setInterval(repetableLogic, 125);
document.addEventListener("keydown", changeDirection);