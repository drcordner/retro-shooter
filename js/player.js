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
        this.baseSpeed = this.speed;
        this.jumpForce = -800;
        this.gravity = 1600;
        this.health = 5;
        this.isJumping = false;
        this.isDoubleJumping = false;
        this.jumpHeld = false;
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

        const moveSpeed = this.speedBoost ? this.baseSpeed * 1.5 : this.baseSpeed;
        this.speed = moveSpeed;
        
        // Handle horizontal movement (keyboard and touch)
        if (keys['arrowleft'] || keys['a'] || this.game.touchControls.left) {
            this.velocityX = -this.speed;
            this.facingRight = false;
        } else if (keys['arrowright'] || keys['d'] || this.game.touchControls.right) {
            this.velocityX = this.speed;
            this.facingRight = true;
        } else {
            this.velocityX = 0;
        }
        
        // Handle jumping (keyboard and touch)
        if ((keys['arrowup'] || keys[' '] || keys['spacebar'] || keys['w'] || this.game.touchControls.jump) && !this.isJumping) {
            this.velocityY = this.jumpForce;
            this.isJumping = true;
            this.game.soundManager.playJump();
        } else if ((keys['arrowup'] || keys[' '] || keys['spacebar'] || keys['w'] || this.game.touchControls.jump) && this.isJumping && !this.isDoubleJumping) {
            this.velocityY = this.jumpForce * 0.8;
            this.isDoubleJumping = true;
            this.game.soundManager.playJump();
        }

        this.jumpHeld = jumpPressed;
        
        // Apply gravity
        this.velocityY += this.gravity * dt;
        
        // Update position
        this.x += this.velocityX * dt;
        this.y += this.velocityY * dt;
        
        // Platform collision
        this.handlePlatformCollisions(platforms);
        
        // Screen wrap: teleport to the opposite side at horizontal edges
        if (this.x <= 0) {
            this.x = this.game.canvas.width - this.width;
        } else if (this.x + this.width >= this.game.canvas.width) {
            this.x = 0;
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
            if (this.firePowerTimer <= 0) {
                this.firePower = false;
                this.updatePowerUpDisplay();
            }
        }
        if (this.speedBoost) {
            this.speedBoostTimer -= deltaTime;
            if (this.speedBoostTimer <= 0) {
                this.speedBoost = false;
                this.updatePowerUpDisplay();
            }
        }
        if (this.shield) {
            this.shieldTimer -= deltaTime;
            if (this.shieldTimer <= 0) {
                this.shield = false;
                this.updatePowerUpDisplay();
            }
        }
        if (this.multiShot) {
            this.multiShotTimer -= deltaTime;
            if (this.multiShotTimer <= 0) {
                this.multiShot = false;
                this.updatePowerUpDisplay();
            }
        }
        
        // Invincibility timer
        if (this.invincible) {
            this.invincibleTimer -= deltaTime;
            if (this.invincibleTimer <= 0) {
                this.invincible = false;
            }
        }

        // Update power-up display every frame if any power-up is active
        if (this.firePower || this.speedBoost || this.shield || this.multiShot) {
            this.updatePowerUpDisplay();
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
            const shootX = this.x + (this.facingRight ? this.width : 0);

            // Multi-shot
            if (this.multiShot) {
                this.game.projectiles.push(new Projectile(shootX, baseY, direction, this.powerUpActive || this.firePower));
                this.game.projectiles.push(new Projectile(shootX, baseY - 16, direction, this.powerUpActive || this.firePower));
                this.game.projectiles.push(new Projectile(shootX, baseY + 16, direction, this.powerUpActive || this.firePower));
            } else {
                this.game.projectiles.push(new Projectile(shootX, baseY, direction, this.powerUpActive || this.firePower));
            }

            // Create muzzle flash effect
            this.game.particleSystem.createMuzzleFlash(shootX, baseY, direction);

            // Play shoot sound
            this.game.soundManager.playShoot();

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
            if (this.health <= 0 && this.extraLives > 0) {
                this.extraLives -= 1;
                this.health = this.maxHealth;
            }

            document.getElementById('livesValue').textContent = this.health;
            this.invincible = true;
            this.invincibleTimer = this.invincibleDuration;
            this.game.soundManager.playHit();
            this.game.flashDamage();
        }
    }

    resetForLevel() {
        this.x = 100;
        this.y = 800;
        this.velocityX = 0;
        this.velocityY = 0;
        this.isJumping = false;
        this.isDoubleJumping = false;
    }
    
    checkCollision(enemy) {
        return this.x < enemy.x + enemy.width &&
               this.x + this.width > enemy.x &&
               this.y < enemy.y + enemy.height &&
               this.y + this.height > enemy.y;
    }
    
    draw(ctx) {
        ctx.save();

        // Invincibility glow
        if (this.invincible) {
            ctx.shadowColor = '#fff';
            ctx.shadowBlur = 20;
        }

        // Body color
        const bodyColor = this.powerUpActive ? '#FFD700' : '#8B4513';
        const darkColor = this.powerUpActive ? '#FFA500' : '#654321';

        // Draw body with gradient effect (multiple rectangles for depth)
        ctx.fillStyle = darkColor;
        ctx.fillRect(this.x + 2, this.y + 2, this.width - 4, this.height - 4);

        ctx.fillStyle = bodyColor;
        ctx.fillRect(this.x, this.y, this.width, this.height - 4);

        // Draw chest (lighter belly area)
        ctx.fillStyle = this.powerUpActive ? '#FFFF00' : '#D2691E';
        ctx.fillRect(this.x + this.width * 0.25, this.y + this.height * 0.4, this.width * 0.5, this.height * 0.4);

        // Draw arms
        ctx.fillStyle = bodyColor;
        if (this.facingRight) {
            ctx.fillRect(this.x - 8, this.y + 30, 12, 40);
            ctx.fillRect(this.x + this.width - 4, this.y + 30, 12, 40);
        } else {
            ctx.fillRect(this.x - 8, this.y + 30, 12, 40);
            ctx.fillRect(this.x + this.width - 4, this.y + 30, 12, 40);
        }

        // Draw head area (top 1/3 of body)
        ctx.fillStyle = bodyColor;
        ctx.fillRect(this.x + 8, this.y, this.width - 16, 32);

        // Draw eyes
        ctx.fillStyle = '#FFF';
        if (this.facingRight) {
            ctx.fillRect(this.x + 35, this.y + 12, 12, 12);
            ctx.fillStyle = '#000';
            ctx.fillRect(this.x + 40, this.y + 15, 6, 6);
        } else {
            ctx.fillRect(this.x + 17, this.y + 12, 12, 12);
            ctx.fillStyle = '#000';
            ctx.fillRect(this.x + 18, this.y + 15, 6, 6);
        }

        // Draw shield effect if active
        if (this.shield) {
            ctx.strokeStyle = '#00BFFF';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width * 0.7, 0, Math.PI * 2);
            ctx.stroke();
        }

        ctx.restore();
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
        this.updatePowerUpDisplay();
    }
    enableSpeed(duration = 5000) {
        this.speedBoost = true;
        this.speedBoostTimer = duration;
        this.updatePowerUpDisplay();
    }
    enableShield(duration = 5000) {
        this.shield = true;
        this.shieldTimer = duration;
        this.updatePowerUpDisplay();
    }
    enableMultiShot(duration = 5000) {
        this.multiShot = true;
        this.multiShotTimer = duration;
        this.updatePowerUpDisplay();
    }

    updatePowerUpDisplay() {
        const display = document.getElementById('powerups-display');
        if (!display) return;

        let html = '';

        if (this.firePower) {
            const time = Math.ceil(this.firePowerTimer / 1000);
            html += `<div class="powerup-indicator"><div class="powerup-icon" style="background: #ff4500;"></div>Fire: ${time}s</div>`;
        }
        if (this.speedBoost) {
            const time = Math.ceil(this.speedBoostTimer / 1000);
            html += `<div class="powerup-indicator"><div class="powerup-icon" style="background: #32cd32;"></div>Speed: ${time}s</div>`;
        }
        if (this.shield) {
            const time = Math.ceil(this.shieldTimer / 1000);
            html += `<div class="powerup-indicator"><div class="powerup-icon" style="background: #8b4513;"></div>Shield: ${time}s</div>`;
        }
        if (this.multiShot) {
            const time = Math.ceil(this.multiShotTimer / 1000);
            html += `<div class="powerup-indicator"><div class="powerup-icon" style="background: #00bfff;"></div>Multi: ${time}s</div>`;
        }

        display.innerHTML = html;
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
        this.poweredUp = poweredUp;
        this.trail = [];
        this.trailLength = 5;
    }

    update(deltaTime) {
        // Add current position to trail
        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > this.trailLength) {
            this.trail.shift();
        }

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
        ctx.save();

        // Draw trail
        this.trail.forEach((pos, index) => {
            const alpha = (index + 1) / this.trail.length * 0.5;
            const size = (index + 1) / this.trail.length;
            ctx.fillStyle = this.poweredUp ? `rgba(255, 215, 0, ${alpha})` : `rgba(255, 255, 0, ${alpha})`;
            ctx.fillRect(
                pos.x + this.width * (1 - size) / 2,
                pos.y + this.height * (1 - size) / 2,
                this.width * size,
                this.height * size
            );
        });

        // Draw main projectile with glow
        if (this.poweredUp) {
            ctx.shadowColor = this.color;
            ctx.shadowBlur = 10;
        }

        // Main projectile body
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Add highlight
        ctx.fillStyle = this.poweredUp ? '#FFFF00' : '#FFFFFF';
        ctx.fillRect(this.x + 2, this.y + 2, this.width - 4, 4);

        ctx.restore();
    }

    destroy() {
        this.destroyed = true;
    }
} 
