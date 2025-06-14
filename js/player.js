class Player {
    constructor(game) {
        this.game = game;
        this.width = 64;
        this.height = 96;
        this.x = 100;
        this.y = 800;
        this.velocityX = 0;
        this.velocityY = 0;
        this.speed = 400;
        this.jumpForce = -800;
        this.gravity = 1600;
        this.health = 3;
        this.isJumping = false;
        this.isDoubleJumping = false;
        this.facingRight = true;
        this.shootCooldown = 0;
        this.shootDelay = 250; // milliseconds between shots
        this.powerUpActive = false;
        this.powerUpTimer = 0;
        this.maxHealth = 5;
        this.extraLives = 0;
        this.firePower = false;
        this.firePowerTimer = 0;
        this.speedBoost = false;
        this.speedBoostTimer = 0;
        this.shield = false;
        this.shieldTimer = 0;
        this.multiShot = false;
        this.multiShotTimer = 0;
        this.invincible = false;
        this.invincibleTimer = 0;
        this.invincibleDuration = 1200; // ms
    }
    
    update(deltaTime, keys, platforms) {
        // Convert deltaTime to seconds
        const dt = deltaTime / 1000;
        
        // Handle horizontal movement (keyboard and touch)
        if (keys['ArrowLeft'] || keys['a'] || this.game.touchControls.left) {
            this.velocityX = -this.speed;
            this.facingRight = false;
        } else if (keys['ArrowRight'] || keys['d'] || this.game.touchControls.right) {
            this.velocityX = this.speed;
            this.facingRight = true;
        } else {
            this.velocityX = 0;
        }
        
        // Handle jumping (keyboard and touch)
        if ((keys['ArrowUp'] || keys[' '] || keys['w'] || this.game.touchControls.jump) && !this.isJumping) {
            this.velocityY = this.jumpForce;
            this.isJumping = true;
        } else if ((keys['ArrowUp'] || keys[' '] || keys['w'] || this.game.touchControls.jump) && this.isJumping && !this.isDoubleJumping) {
            this.velocityY = this.jumpForce * 0.8;
            this.isDoubleJumping = true;
        }
        
        // Apply gravity
        this.velocityY += this.gravity * dt;
        
        // Update position
        this.x += this.velocityX * dt;
        this.y += this.velocityY * dt;
        
        // Platform collision
        this.handlePlatformCollisions(platforms);
        
        // Screen boundaries
        if (this.x < 0) this.x = 0;
        if (this.x + this.width > this.game.canvas.width) {
            this.x = this.game.canvas.width - this.width;
        }
        
        // Update shoot cooldown
        if (this.shootCooldown > 0) {
            this.shootCooldown -= deltaTime;
        }
        
        // Update power-up timer
        if (this.powerUpActive) {
            this.powerUpTimer -= deltaTime;
            if (this.powerUpTimer <= 0) {
                this.powerUpActive = false;
            }
        }
        
        // Power-up timers
        if (this.firePower) {
            this.firePowerTimer -= deltaTime;
            if (this.firePowerTimer <= 0) this.firePower = false;
        }
        if (this.speedBoost) {
            this.speedBoostTimer -= deltaTime;
            if (this.speedBoostTimer <= 0) this.speedBoost = false;
        }
        if (this.shield) {
            this.shieldTimer -= deltaTime;
            if (this.shieldTimer <= 0) this.shield = false;
        }
        if (this.multiShot) {
            this.multiShotTimer -= deltaTime;
            if (this.multiShotTimer <= 0) this.multiShot = false;
        }
        
        // Invincibility timer
        if (this.invincible) {
            this.invincibleTimer -= deltaTime;
            if (this.invincibleTimer <= 0) {
                this.invincible = false;
            }
        }
    }
    
    handlePlatformCollisions(platforms) {
        for (const platform of platforms) {
            // Check if player is above platform and falling
            if (this.velocityY > 0 &&
                this.y + this.height > platform.y &&
                this.y + this.height < platform.y + platform.height &&
                this.x + this.width > platform.x &&
                this.x < platform.x + platform.width) {
                
                this.y = platform.y - this.height;
                this.velocityY = 0;
                this.isJumping = false;
                this.isDoubleJumping = false;
            }
        }
    }
    
    shoot() {
        if (this.shootCooldown <= 0) {
            const baseY = this.y + this.height / 2 - 6;
            const direction = this.facingRight ? 1 : -1;
            // Multi-shot
            if (this.multiShot) {
                this.game.projectiles.push(new Projectile(this.x + (this.facingRight ? this.width : 0), baseY, direction, this.powerUpActive || this.firePower));
                this.game.projectiles.push(new Projectile(this.x + (this.facingRight ? this.width : 0), baseY - 16, direction, this.powerUpActive || this.firePower));
                this.game.projectiles.push(new Projectile(this.x + (this.facingRight ? this.width : 0), baseY + 16, direction, this.powerUpActive || this.firePower));
            } else {
                this.game.projectiles.push(new Projectile(this.x + (this.facingRight ? this.width : 0), baseY, direction, this.powerUpActive || this.firePower));
            }
            this.shootCooldown = this.shootDelay;
        }
    }
    
    activatePowerUp() {
        this.powerUpActive = true;
        this.powerUpTimer = 5000; // 5 seconds
    }
    
    takeDamage(amount = 1) {
        if (this.shield || this.invincible) return;
        if (!this.powerUpActive) {
            this.health -= amount;
            document.getElementById('livesValue').textContent = this.health;
            this.invincible = true;
            this.invincibleTimer = this.invincibleDuration;
        }
    }
    
    checkCollision(enemy) {
        return this.x < enemy.x + enemy.width &&
               this.x + this.width > enemy.x &&
               this.y < enemy.y + enemy.height &&
               this.y + this.height > enemy.y;
    }
    
    draw(ctx) {
        // Draw player body
        if (this.invincible) {
            ctx.save();
            ctx.shadowColor = '#fff';
            ctx.shadowBlur = 32;
        }
        ctx.fillStyle = this.powerUpActive ? '#ff0' : '#8b4513';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        if (this.invincible) {
            ctx.restore();
        }
        
        // Draw face
        ctx.fillStyle = '#000';
        if (this.facingRight) {
            ctx.fillRect(this.x + 20, this.y + 10, 8, 8); // eye
            ctx.fillRect(this.x + 20, this.y + 25, 8, 4); // mouth
        } else {
            ctx.fillRect(this.x + 4, this.y + 10, 8, 8); // eye
            ctx.fillRect(this.x + 4, this.y + 25, 8, 4); // mouth
        }
    }
    
    heal(amount = 1) {
        this.health = Math.min(this.health + amount, this.maxHealth);
        document.getElementById('livesValue').textContent = this.health;
    }
    addLife() {
        this.extraLives++;
    }
    enableFire(duration = 5000) {
        this.firePower = true;
        this.firePowerTimer = duration;
    }
    enableSpeed(duration = 5000) {
        this.speedBoost = true;
        this.speedBoostTimer = duration;
    }
    enableShield(duration = 5000) {
        this.shield = true;
        this.shieldTimer = duration;
    }
    enableMultiShot(duration = 5000) {
        this.multiShot = true;
        this.multiShotTimer = duration;
    }
}

// Projectile class for player shooting
class Projectile {
    constructor(x, y, direction, poweredUp = false) {
        this.x = x;
        this.y = y;
        this.width = 24;
        this.height = 12;
        this.speed = poweredUp ? 1200 : 800;
        this.direction = direction;
        this.damage = poweredUp ? 2 : 1;
        this.destroyed = false;
        this.color = poweredUp ? '#FFD700' : '#FFFF00';
    }

    update(deltaTime) {
        const dt = deltaTime / 1000;
        this.x += this.speed * this.direction * dt;
        // Remove if off screen
        if (this.x < -this.width || this.x > 1280) {
            this.destroyed = true;
        }
    }

    checkCollision(enemy) {
        return this.x < enemy.x + enemy.width &&
               this.x + this.width > enemy.x &&
               this.y < enemy.y + enemy.height &&
               this.y + this.height > enemy.y;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    destroy() {
        this.destroyed = true;
    }
} 