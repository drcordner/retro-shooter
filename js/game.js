class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Set canvas size based on screen size
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // Game state
        this.score = 0;
        this.lives = 3;
        this.currentLevel = 1;
        this.gameOver = false;
        this.paused = false;
        
        // Initialize game objects
        this.player = new Player(this);
        this.enemies = [];
        this.projectiles = [];
        this.platforms = [];
        this.powerUps = [];
        
        // Input handling
        this.keys = {};
        this.touchControls = {
            left: false,
            right: false,
            jump: false,
            shoot: false
        };
        this.setupInputHandlers();
        
        // Start game loop
        this.lastTime = 0;
        this.accumulator = 0;
        this.timeStep = 1000 / 60; // 60 FPS
        
        // Load first level
        this.loadLevel(this.currentLevel);
        
        // Start game loop
        requestAnimationFrame(this.gameLoop.bind(this));
    }
    
    resizeCanvas() {
        // Get the container size
        const container = this.canvas.parentElement;
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;
        
        // Calculate the scale to fit the game while maintaining aspect ratio
        const gameAspectRatio = 1280 / 960;
        const containerAspectRatio = containerWidth / containerHeight;
        
        let width, height;
        if (containerAspectRatio > gameAspectRatio) {
            // Container is wider than game
            height = containerHeight;
            width = height * gameAspectRatio;
        } else {
            // Container is taller than game
            width = containerWidth;
            height = width / gameAspectRatio;
        }
        
        // Set canvas size
        this.canvas.style.width = `${width}px`;
        this.canvas.style.height = `${height}px`;
        this.canvas.width = 1280;
        this.canvas.height = 960;
        
        // Calculate scale for touch controls
        this.scaleX = width / 1280;
        this.scaleY = height / 960;
    }
    
    setupInputHandlers() {
        // Keyboard controls
        window.addEventListener('keydown', (e) => {
            const key = e.key.toLowerCase();
            this.keys[key] = true;
            if ((key === 'r') && this.gameOver) {
                window.location.reload();
            }
            if ((key === 'z') && !this.gameOver && !this.paused) {
                this.player.shoot();
            }
        });
        
        window.addEventListener('keyup', (e) => {
            const key = e.key.toLowerCase();
            this.keys[key] = false;
        });
        
        // Touch controls
        const touchControls = document.getElementById('touch-controls');
        
        // Movement controls
        touchControls.querySelector('.left-btn').addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.touchControls.left = true;
        });
        touchControls.querySelector('.left-btn').addEventListener('touchend', (e) => {
            e.preventDefault();
            this.touchControls.left = false;
        });
        
        touchControls.querySelector('.right-btn').addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.touchControls.right = true;
        });
        touchControls.querySelector('.right-btn').addEventListener('touchend', (e) => {
            e.preventDefault();
            this.touchControls.right = false;
        });
        
        // Jump button
        touchControls.querySelector('.jump-btn').addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.touchControls.jump = true;
        });
        touchControls.querySelector('.jump-btn').addEventListener('touchend', (e) => {
            e.preventDefault();
            this.touchControls.jump = false;
        });
        
        // Shoot button
        touchControls.querySelector('.shoot-btn').addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.touchControls.shoot = true;
            if (!this.gameOver && !this.paused) {
                this.player.shoot();
            }
        });
        touchControls.querySelector('.shoot-btn').addEventListener('touchend', (e) => {
            e.preventDefault();
            this.touchControls.shoot = false;
        });
        
        // Prevent default touch behavior on game canvas
        this.canvas.addEventListener('touchstart', (e) => e.preventDefault());
        this.canvas.addEventListener('touchmove', (e) => e.preventDefault());
        this.canvas.addEventListener('touchend', (e) => e.preventDefault());
    }
    
    loadLevel(levelNumber) {
        // Clear existing level
        this.enemies = [];
        this.platforms = [];
        this.powerUps = [];
        
        // Load level data
        const levelData = LEVELS[levelNumber - 1];
        if (!levelData) {
            console.error(`Level ${levelNumber} not found!`);
            return;
        }
        
        // Create platforms
        levelData.platforms.forEach(platform => {
            this.platforms.push(new Platform(platform.x, platform.y, platform.width, platform.height));
        });
        
        // Create enemies
        levelData.enemies.forEach(enemy => {
            this.enemies.push(new Enemy(enemy.type, enemy.x, enemy.y, this));
        });
        
        // Create power-ups (fix: default to empty array)
        (levelData.powerUps || []).forEach(powerUp => {
            this.powerUps.push(new PowerUp(powerUp.type, powerUp.x, powerUp.y, this));
        });
        
        // Update UI
        document.getElementById('levelValue').textContent = levelNumber;
    }
    
    update(deltaTime) {
        if (this.gameOver || this.paused) return;
        
        // Update player
        this.player.update(deltaTime, this.keys, this.platforms);
        
        // Update enemies
        this.enemies.forEach(enemy => {
            enemy.update(deltaTime, this.player, this.platforms);
        });
        
        // Update projectiles
        this.projectiles.forEach(projectile => {
            projectile.update(deltaTime);
        });
        
        // Update power-ups
        this.powerUps.forEach(powerUp => {
            powerUp.update(deltaTime);
        });
        
        // Check collisions
        this.checkCollisions();
        
        // Remove dead enemies and projectiles
        this.cleanup();

        // Advance to next level if all enemies are defeated
        if (this.enemies.length === 0) {
            this.currentLevel++;
            if (this.currentLevel > LEVELS.length) {
                this.showWinScreen();
            } else {
                this.loadLevel(this.currentLevel);
            }
        }
    }
    
    checkCollisions() {
        // Player-Enemy collisions
        this.enemies.forEach(enemy => {
            if (this.player.checkCollision(enemy)) {
                // Only take damage if enemy is not jumping or if player is above enemy
                if (!enemy.isJumping || this.player.y + this.player.height < enemy.y + enemy.height * 0.7) {
                    this.player.takeDamage();
                    if (this.player.health <= 0) {
                        this.gameOver = true;
                    }
                }
            }
        });
        
        // EnemyProjectile-Player collisions
        this.projectiles.forEach(projectile => {
            if (projectile instanceof EnemyProjectile && projectile.checkCollision(this.player)) {
                this.player.takeDamage(projectile.damage);
                projectile.destroy();
                if (this.player.health <= 0) {
                    this.gameOver = true;
                }
            }
        });
        
        // Projectile-Enemy collisions
        this.projectiles.forEach(projectile => {
            this.enemies.forEach(enemy => {
                if (projectile.checkCollision(enemy)) {
                    enemy.takeDamage(projectile.damage);
                    projectile.destroy();
                }
            });
        });
        
        // Player-PowerUp collisions
        this.powerUps.forEach(powerUp => {
            if (powerUp.checkCollision(this.player)) {
                powerUp.applyEffect(this.player, this);
                powerUp.collected = true;
            }
        });
    }
    
    cleanup() {
        this.enemies = this.enemies.filter(enemy => !enemy.isDead);
        this.projectiles = this.projectiles.filter(projectile => !projectile.destroyed);
        this.powerUps = this.powerUps.filter(powerUp => !powerUp.collected);
    }
    
    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw platforms
        this.platforms.forEach(platform => platform.draw(this.ctx));
        
        // Draw power-ups
        this.powerUps.forEach(powerUp => powerUp.draw(this.ctx));
        
        // Draw enemies
        this.enemies.forEach(enemy => enemy.draw(this.ctx));
        
        // Draw projectiles
        this.projectiles.forEach(projectile => projectile.draw(this.ctx));
        
        // Draw player
        this.player.draw(this.ctx);
        
        // Draw game over screen
        if (this.gameOver) {
            this.drawGameOver();
        }
    }
    
    drawGameOver() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '48px "Press Start 2P"';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('GAME OVER', this.canvas.width / 2, this.canvas.height / 2 - 50);
        
        this.ctx.font = '24px "Press Start 2P"';
        this.ctx.fillText('Press R or tap to Restart', this.canvas.width / 2, this.canvas.height / 2 + 50);
        
        // Add restart button for mobile
        const restartBtn = document.getElementById('restart-btn');
        if (restartBtn) {
            restartBtn.style.display = 'block';
        }
    }
    
    showWinScreen() {
        this.paused = true;
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '48px "Press Start 2P"';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('YOU WIN!', this.canvas.width / 2, this.canvas.height / 2);
    }
    
    gameLoop(currentTime) {
        if (!this.lastTime) this.lastTime = currentTime;
        
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        this.accumulator += deltaTime;
        
        let steps = 0;
        const maxSteps = 5;
        while (this.accumulator >= this.timeStep && steps < maxSteps) {
            this.update(this.timeStep);
            this.accumulator -= this.timeStep;
            steps++;
        }
        // If we hit the cap, drop the rest to avoid spiral of death
        if (steps === maxSteps) {
            this.accumulator = 0;
        }
        
        this.draw();
        requestAnimationFrame(this.gameLoop.bind(this));
    }
}

class PowerUp {
    constructor(type, x, y, game) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.width = 32;
        this.height = 32;
        this.collected = false;
        this.game = game;
    }
    update(deltaTime) {}
    checkCollision(player) {
        return (
            this.x < player.x + player.width &&
            this.x + this.width > player.x &&
            this.y < player.y + player.height &&
            this.y + this.height > player.y
        );
    }
    applyEffect(player, game) {
        switch (this.type) {
            case 'banana':
                player.heal(1);
                break;
            case 'golden_banana':
                player.addLife();
                player.heal(2);
                break;
            case 'fire_flower':
                player.enableFire(7000);
                break;
            case 'speed_vine':
                player.enableSpeed(7000);
                break;
            case 'shield_coconut':
                player.enableShield(7000);
                break;
            case 'multi_shot':
                player.enableMultiShot(7000);
                break;
        }
    }
    draw(ctx) {
        switch (this.type) {
            case 'banana':
                ctx.fillStyle = '#ffe135';
                ctx.fillRect(this.x, this.y, this.width, this.height);
                ctx.strokeStyle = '#b8860b';
                ctx.strokeRect(this.x, this.y, this.width, this.height);
                break;
            case 'golden_banana':
                ctx.fillStyle = '#ffd700';
                ctx.fillRect(this.x, this.y, this.width, this.height);
                ctx.strokeStyle = '#b8860b';
                ctx.strokeRect(this.x, this.y, this.width, this.height);
                break;
            case 'fire_flower':
                ctx.fillStyle = '#ff4500';
                ctx.beginPath();
                ctx.arc(this.x + 16, this.y + 16, 16, 0, 2 * Math.PI);
                ctx.fill();
                ctx.strokeStyle = '#fff';
                ctx.stroke();
                break;
            case 'speed_vine':
                ctx.fillStyle = '#32cd32';
                ctx.fillRect(this.x, this.y, this.width, this.height);
                ctx.strokeStyle = '#006400';
                ctx.strokeRect(this.x, this.y, this.width, this.height);
                break;
            case 'shield_coconut':
                ctx.fillStyle = '#8b4513';
                ctx.beginPath();
                ctx.arc(this.x + 16, this.y + 16, 16, 0, 2 * Math.PI);
                ctx.fill();
                ctx.strokeStyle = '#fff';
                ctx.stroke();
                break;
            case 'multi_shot':
                ctx.fillStyle = '#00bfff';
                ctx.fillRect(this.x, this.y, this.width, this.height);
                ctx.strokeStyle = '#fff';
                ctx.strokeRect(this.x, this.y, this.width, this.height);
                break;
        }
    }
}

// Start the game when the window loads
window.addEventListener('load', () => {
    const startOverlay = document.getElementById('start-overlay');
    const gameContainer = document.querySelector('.game-container');
    const startBtn = document.getElementById('start-btn');
    const restartBtn = document.getElementById('restart-btn');
    
    const startGame = () => {
        startOverlay.style.display = 'none';
        gameContainer.style.display = 'block';
        new Game();
    };
    
    startBtn.addEventListener('click', startGame);
    
    // Add keyboard shortcut for 'S' key
    window.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === 's' && startOverlay.style.display !== 'none') {
            startGame();
        }
    });
    
    // Add restart button functionality
    restartBtn.addEventListener('click', () => {
        window.location.reload();
    });
}); 