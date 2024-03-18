const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Load Player Image
const playerImage = new Image();
playerImage.src = 'spacealpha.png';

// Load gun image
const gunImage = new Image();
gunImage.src = 'spacealpha.png';

// Load enemy image
const enemyImage = new Image();
enemyImage.src = 'enemy.png';

// Player
let player = {
    x: canvas.width / 2,
    y: canvas.height - 70,
    width: 80,
    height: 80,
    speed: 20,
};

// Gun
let gun = {
    x: canvas.width / 2 - 1,
    y: canvas.height - 70,
    width: 80,
    height: 80,
    isShooting: false,
    bulletSpeed: 10,
    bullets: []
};

// Enemies
let enemies = [];
const enemyWidth = 50;
const enemyHeight = 50;

// Sound for shooting
const session = new Audio('back-sound.mp3');

function playback() {
    session.currentTime = 0;
    session.play();
}

function createEnemy() {
    const x = Math.random() * (canvas.width - enemyWidth);
    const y = -enemyHeight;
    enemies.push({ x, y });
}

function drawEnemies() {
    enemies.forEach(enemy => {
        ctx.drawImage(enemyImage, enemy.x, enemy.y, enemyWidth, enemyHeight);
    });
}

function moveEnemies() {
    enemies.forEach(enemy => {
        enemy.y += 2;
        if (enemy.y > canvas.height) {
            const index = enemies.indexOf(enemy);
            enemies.splice(index, 1);
        }
        if (
            player.x < enemy.x + enemyWidth &&
            player.x + player.width > enemy.x &&
            player.y < enemy.y + enemyHeight &&
            player.y + player.height > enemy.y
        ) {
            // Collision detected, trigger game over
            gameOver();
        }
    });
}

// Sound for shooting
const shootSound = new Audio('shoot.wav');

function playShootSound() {
    shootSound.currentTime = 0;
    shootSound.play();
}

// Player controls
function movePlayer(direction) {
    switch(direction) {
        case 'left':
            if (player.x > 0) {
                player.x -= player.speed;
                gun.x -= player.speed;
            }
            break;
        case 'right':
            if (player.x < canvas.width - player.width) {
                player.x += player.speed;
                gun.x += player.speed;
            }
            break;
    }
}

// Keyboard event listener
document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowLeft') {
        movePlayer('left');
    } else if (event.key === 'ArrowRight') {
        movePlayer('right');
    } else if (event.key === ' ') { // Space key for shooting
        shoot();
    }
});

// Update function
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawGun();
    moveEnemies();
    drawEnemies();
    moveBullets();
    drawBullets();
    checkCollisions();
    requestAnimationFrame(update);
}

function drawPlayer() {
    ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);
}

function drawGun() {
    ctx.drawImage(gunImage, gun.x, gun.y, gun.width, gun.height);
}

// Shooting
function shoot() {
    gun.isShooting = true;
    const bullet = {
        x: gun.x + gun.width / 2,
        y: gun.y,
        radius: 3,
        speed: gun.bulletSpeed
    };
    gun.bullets.push(bullet);
    playShootSound();
}

function moveBullets() {
    gun.bullets.forEach(bullet => {
        bullet.y -= bullet.speed;
    });
}

function drawBullets() {
    gun.bullets.forEach(bullet => {
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();
        ctx.closePath();
    });
}

// Sound for shooting
const destroySound = new Audio('destroy.mp3');

function playdestroySound() {
    destroySound.currentTime = 0;
    destroySound.play();
}

// Collision detection
function checkCollisions() {
    gun.bullets.forEach((bullet, bulletIndex) => {
        enemies.forEach((enemy, enemyIndex) => {
            if (
                bullet.x > enemy.x &&
                bullet.x < enemy.x + enemyWidth &&
                bullet.y > enemy.y &&
                bullet.y < enemy.y + enemyHeight
            ) {
                // Remove bullet and enemy on collision
                gun.bullets.splice(bulletIndex, 1);
                enemies.splice(enemyIndex, 1);
                playdestroySound();
            }
        });
    });
}

// Sound for game over
const gameOverSound = new Audio('gameover.wav');

function playGameOverSound() {
    gameOverSound.currentTime = 0;
    gameOverSound.play();
}

function gameOver() {
    playGameOverSound();
    // Redirect the user to the game over page
    setTimeout(function() {
      window.location.href = "index.html";
    }, 2000);
}
// Enemy spawning
setInterval(createEnemy, 1000);

update();
