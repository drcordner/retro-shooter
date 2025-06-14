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
        // Make slower on early levels
        let speed = this.speed;
        if (this.game.currentLevel <= 3) speed = 40;
        this.velocityX = speed * this.direction;
        
        // Change direction if hitting a wall or platform edge
        if (this.x <= 0 || this.x + this.width >= 640) {
            this.direction *= -1;
        }
        
        // Attack if player is close
        if (Math.abs(this.x - player.x) < 100 && this.attackCooldown <= 0) {
            this.attack(player);
        }
    }
    
    updateDog(dt, player, platforms) {
        // Make slower and no jumping on early levels
        let speed = this.speed;
        if (this.game.currentLevel <= 3) speed = 120;
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
        this.direction = dx > 0 ? 1 : -1;
        
        // Move towards player
        this.velocityX = this.speed * this.direction;
        
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
        console.log(`${this.type} took ${amount} damage, health now ${this.health}`);
        if (this.health <= 0) {
            this.isDead = true;
            console.log(`${this.type} died`);
            // Add score based on enemy type
            switch (this.type) {
                case 'godzilla':
                    this.game.score += 100;
                    break;
                case 'dog':
                    this.game.score += 50;
                    break;
                case 'boss':
                    this.game.score += 500;
                    break;
            }
            document.getElementById('scoreValue').textContent = this.game.score;
        }
    }
    
    draw(ctx) {
        if (this.isDead) return;
        
        // Draw enemy body
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Draw eyes
        ctx.fillStyle = '#000';
        if (this.direction > 0) {
            ctx.fillRect(this.x + this.width - 12, this.y + 10, 8, 8);
        } else {
            ctx.fillRect(this.x + 4, this.y + 10, 8, 8);
        }
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
        if (this.x < -this.width || this.x > 640) {
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