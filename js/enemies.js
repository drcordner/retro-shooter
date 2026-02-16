class Enemy {
    constructor(type, x, y, game) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.game = game;
        this.width = 32;
        this.height = 32;
        this.velocityX = 0;
        this.velocityY = 0;
        this.speed = 100;
        this.health = 1;
        this.maxHealth = this.health;
        this.isDead = false;
        this.direction = -1; // -1 for left, 1 for right
        this.attackCooldown = 0;
        this.attackDelay = 1000; // 1 second between attacks
        
        // Set properties based on enemy type
        this.setupEnemyType();
    }
    
    setupEnemyType() {
        switch (this.type) {
            case 'godzilla':
                this.width = 96;
                this.height = 128;
                this.health = (this.game && this.game.currentLevel === 1) ? 1 : 3;
                this.speed = 160;
                this.color = '#228B22';
                break;
            case 'dog':
                this.width = 64;
                this.height = 64;
                this.health = 1;
                this.speed = 300;
                this.color = '#8B4513';
                break;
            case 'boss':
                this.width = 192;
                this.height = 192;
                this.health = 10;
                this.speed = 120;
                this.color = '#FF4500';
                break;
            default:
                this.color = '#FF0000';
        }

        this.maxHealth = this.health;
    }
    
    update(deltaTime, player, platforms) {
        if (this.isDead) return;
        
        const dt = deltaTime / 1000;
        
        // Basic AI behavior
        switch (this.type) {
            case 'godzilla':
                this.updateGodzilla(dt, player, platforms);
                break;
            case 'dog':
                this.updateDog(dt, player, platforms);
                break;
            case 'boss':
                this.updateBoss(dt, player, platforms);
                break;
        }
        
        // Apply gravity
        this.velocityY += 800 * dt;
        
        // Update position
        this.x += this.velocityX * dt;
        this.y += this.velocityY * dt;
        
        // Platform collision
        this.handlePlatformCollisions(platforms);
        
        // Update attack cooldown
        if (this.attackCooldown > 0) {
            this.attackCooldown -= deltaTime;
        }
    }
    
    updateGodzilla(dt, player, platforms) {
        // Progressive difficulty curve for enemy speed
        let speed = this.speed;
        if (this.game.currentLevel === 1) {
            speed = 20; // Very slow for tutorial
        } else if (this.game.currentLevel === 2) {
            speed = 30; // Still very slow
        } else if (this.game.currentLevel === 3) {
            speed = 50; // Slow
        } else if (this.game.currentLevel <= 6) {
            speed = 70; // Medium-slow
        } else if (this.game.currentLevel <= 10) {
            speed = 100; // Medium
        } else if (this.game.currentLevel <= 15) {
            speed = 130; // Medium-fast
        }
        // Level 16+ uses full speed (160)

        this.velocityX = speed * this.direction;

        // Change direction if hitting a wall or platform edge
        if (this.x <= 0 || this.x + this.width >= 1280) {
            this.direction *= -1;
        }

        // Attack if player is close (disabled on level 1)
        if (this.game.currentLevel > 1 && Math.abs(this.x - player.x) < 100 && this.attackCooldown <= 0) {
            this.attack(player);
        }
    }
    
    updateDog(dt, player, platforms) {
        // Progressive difficulty curve for dog speed
        let speed = this.speed;
        if (this.game.currentLevel === 1) {
            speed = 80; // Very slow for tutorial
        } else if (this.game.currentLevel === 2) {
            speed = 110; // Slow
        } else if (this.game.currentLevel === 3) {
            speed = 140; // Medium-slow
        } else if (this.game.currentLevel <= 6) {
            speed = 170; // Medium
        } else if (this.game.currentLevel <= 10) {
            speed = 210; // Medium-fast
        } else if (this.game.currentLevel <= 15) {
            speed = 250; // Fast
        }
        // Level 16+ uses full speed (300)

        const dx = player.x - this.x;
        this.direction = dx > 0 ? 1 : -1;
        this.velocityX = speed * this.direction;

        // Only jump on later levels
        if (this.game.currentLevel > 3 && player.y < this.y && Math.abs(dx) < 100 && !this.isJumping) {
            this.velocityY = -800;
            this.isJumping = true;
        }
    }
    
    updateBoss(dt, player, platforms) {
        // More complex boss behavior
        const dx = player.x - this.x;

        // Don't move if at boundaries
        if (this.x <= 0 && dx < 0) {
            this.velocityX = 0;
            this.x = 0;
        } else if (this.x + this.width >= 1280 && dx > 0) {
            this.velocityX = 0;
            this.x = 1280 - this.width;
        } else {
            this.direction = dx > 0 ? 1 : -1;
            this.velocityX = this.speed * this.direction;
        }

        // Special attacks
        if (this.attackCooldown <= 0) {
            if (Math.abs(dx) < 200) {
                // Close range attack
                this.attack(player);
            } else {
                // Long range attack
                this.rangedAttack(player);
            }
        }
    }
    
    handlePlatformCollisions(platforms) {
        for (const platform of platforms) {
            // Check if enemy is above platform and falling
            if (this.velocityY > 0 &&
                this.y + this.height > platform.y &&
                this.y + this.height < platform.y + platform.height &&
                this.x + this.width > platform.x &&
                this.x < platform.x + platform.width) {
                
                this.y = platform.y - this.height;
                this.velocityY = 0;
                this.isJumping = false;
            }
        }
    }
    
    attack(player) {
        if (this.attackCooldown <= 0) {
            // Create attack projectile or effect
            const projectile = new EnemyProjectile(
                this.x + (this.direction > 0 ? this.width : 0),
                this.y + this.height / 2,
                this.direction,
                this.type
            );
            this.game.projectiles.push(projectile);
            this.attackCooldown = this.attackDelay;
        }
    }
    
    rangedAttack(player) {
        if (this.attackCooldown <= 0) {
            // Create ranged attack projectile
            const projectile = new EnemyProjectile(
                this.x + (this.direction > 0 ? this.width : 0),
                this.y + this.height / 2,
                this.direction,
                this.type,
                true
            );
            this.game.projectiles.push(projectile);
            this.attackCooldown = this.attackDelay * 2;
        }
    }
    
    takeDamage(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            this.isDead = true;
            // Add score based on enemy type
            let scoreGained = 0;
            switch (this.type) {
                case 'godzilla':
                    scoreGained = 100;
                    this.game.score += scoreGained;
                    break;
                case 'dog':
                    scoreGained = 50;
                    this.game.score += scoreGained;
                    break;
                case 'boss':
                    scoreGained = 500;
                    this.game.score += scoreGained;
                    break;
            }
            document.getElementById('scoreValue').textContent = this.game.score;

            // Create score popup
            if (scoreGained > 0) {
                this.game.particleSystem.createScorePopup(
                    this.x + this.width / 2,
                    this.y,
                    scoreGained
                );
            }
        }
    }
    
    draw(ctx) {
        if (this.isDead) return;

        ctx.save();

        // Get darker shade for depth
        const darkColor = this.getDarkerColor(this.color);

        // Draw shadow/depth
        ctx.fillStyle = darkColor;
        ctx.fillRect(this.x + 2, this.y + 2, this.width - 4, this.height - 4);

        // Draw main body
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height - 2);

        // Draw specific details based on type
        if (this.type === 'godzilla') {
            // Draw spikes on back
            ctx.fillStyle = '#2F4F2F';
            for (let i = 0; i < 4; i++) {
                const spikeX = this.x + this.width * 0.3 + i * (this.width * 0.15);
                ctx.fillRect(spikeX, this.y - 6, 8, 12);
            }
            // Draw belly
            ctx.fillStyle = '#90EE90';
            ctx.fillRect(this.x + this.width * 0.25, this.y + this.height * 0.5, this.width * 0.5, this.height * 0.4);
        } else if (this.type === 'dog') {
            // Draw ears
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x + 5, this.y - 10, 12, 15);
            ctx.fillRect(this.x + this.width - 17, this.y - 10, 12, 15);
            // Draw snout
            ctx.fillStyle = '#654321';
            if (this.direction > 0) {
                ctx.fillRect(this.x + this.width - 15, this.y + this.height * 0.4, 15, 20);
            } else {
                ctx.fillRect(this.x, this.y + this.height * 0.4, 15, 20);
            }
        } else if (this.type === 'boss') {
            // Draw crown/horns
            ctx.fillStyle = '#FF6347';
            ctx.fillRect(this.x + this.width * 0.2, this.y - 15, 20, 20);
            ctx.fillRect(this.x + this.width * 0.6, this.y - 15, 20, 20);
            // Draw larger spikes
            ctx.fillStyle = '#8B0000';
            for (let i = 0; i < 6; i++) {
                const spikeX = this.x + this.width * 0.15 + i * (this.width * 0.15);
                ctx.fillRect(spikeX, this.y - 10, 12, 16);
            }
        }

        // Draw eyes (white with black pupil)
        ctx.fillStyle = '#FFF';
        const eyeSize = this.type === 'boss' ? 16 : 10;
        if (this.direction > 0) {
            ctx.fillRect(this.x + this.width - eyeSize - 8, this.y + 12, eyeSize, eyeSize);
            ctx.fillStyle = '#F00';
            ctx.fillRect(this.x + this.width - eyeSize - 4, this.y + 16, eyeSize / 2, eyeSize / 2);
        } else {
            ctx.fillRect(this.x + 8, this.y + 12, eyeSize, eyeSize);
            ctx.fillStyle = '#F00';
            ctx.fillRect(this.x + 12, this.y + 16, eyeSize / 2, eyeSize / 2);
        }

        // Draw health bar for bosses and damaged enemies
        if (this.type === 'boss' || this.health < this.maxHealth) {
            const healthPercent = this.health / this.maxHealth;
            ctx.fillStyle = '#000';
            ctx.fillRect(this.x, this.y - 10, this.width, 6);
            ctx.fillStyle = healthPercent > 0.5 ? '#0F0' : (healthPercent > 0.25 ? '#FF0' : '#F00');
            ctx.fillRect(this.x + 1, this.y - 9, (this.width - 2) * healthPercent, 4);
        }

        ctx.restore();
    }

    getDarkerColor(color) {
        // Simple color darkening
        const colors = {
            '#228B22': '#1a6b1a',
            '#8B4513': '#6b3410',
            '#FF4500': '#cc3700'
        };
        return colors[color] || '#000';
    }
}

class EnemyProjectile {
    constructor(x, y, direction, enemyType, isRanged = false) {
        this.x = x;
        this.y = y;
        this.width = 16;
        this.height = 16;
        this.speed = isRanged ? 300 : 200;
        this.direction = direction;
        this.damage = isRanged ? 2 : 1;
        this.destroyed = false;
        
        // Set color based on enemy type
        switch (enemyType) {
            case 'godzilla':
                this.color = '#32CD32';
                break;
            case 'dog':
                this.color = '#CD853F';
                break;
            case 'boss':
                this.color = '#FF4500';
                break;
            default:
                this.color = '#FF0000';
        }
    }
    
    update(deltaTime) {
        const dt = deltaTime / 1000;
        this.x += this.speed * this.direction * dt;

        // Destroy if off screen
        if (this.x < -this.width || this.x > 1280) {
            this.destroyed = true;
        }
    }
    
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    checkCollision(target) {
        return this.x < target.x + target.width &&
               this.x + this.width > target.x &&
               this.y < target.y + target.height &&
               this.y + this.height > target.y;
    }

    destroy() {
        this.destroyed = true;
    }
} 
