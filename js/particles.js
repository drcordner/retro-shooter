// Particle system for visual effects
class Particle {
    constructor(x, y, velocityX, velocityY, color, size, life) {
        this.x = x;
        this.y = y;
        this.velocityX = velocityX;
        this.velocityY = velocityY;
        this.color = color;
        this.size = size;
        this.life = life;
        this.maxLife = life;
        this.gravity = 500;
        this.destroyed = false;
    }

    update(deltaTime) {
        const dt = deltaTime / 1000;

        this.x += this.velocityX * dt;
        this.y += this.velocityY * dt;
        this.velocityY += this.gravity * dt;

        this.life -= deltaTime;
        if (this.life <= 0) {
            this.destroyed = true;
        }
    }

    draw(ctx) {
        const alpha = this.life / this.maxLife;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
        ctx.restore();
    }
}

class ParticleSystem {
    constructor(game) {
        this.game = game;
        this.particles = [];
    }

    createExplosion(x, y, color = '#FF4500') {
        const config = CONFIG.PARTICLES.EXPLOSION;
        const colors = [color, '#FFA500', '#FFD700', '#FFFFFF'];

        for (let i = 0; i < config.COUNT; i++) {
            const angle = (Math.PI * 2 * i) / config.COUNT;
            const speed = random(config.SPEED_MIN, config.SPEED_MAX);
            const velocityX = Math.cos(angle) * speed;
            const velocityY = Math.sin(angle) * speed;
            const particleColor = colors[Math.floor(Math.random() * colors.length)];
            const size = random(config.SIZE_MIN, config.SIZE_MAX);
            const life = random(config.LIFE_MIN, config.LIFE_MAX);

            this.particles.push(new Particle(x, y, velocityX, velocityY, particleColor, size, life));
        }
    }

    createMuzzleFlash(x, y, direction) {
        const config = CONFIG.PARTICLES.MUZZLE_FLASH;
        const colors = ['#FFFF00', '#FFA500', '#FFFFFF'];

        for (let i = 0; i < config.COUNT; i++) {
            const angle = (direction > 0 ? 0 : Math.PI) + (Math.random() - 0.5) * 0.5;
            const speed = random(config.SPEED_MIN, config.SPEED_MAX);
            const velocityX = Math.cos(angle) * speed * direction;
            const velocityY = Math.sin(angle) * speed;
            const particleColor = colors[Math.floor(Math.random() * colors.length)];

            this.particles.push(new Particle(x, y, velocityX, velocityY, particleColor, config.SIZE, config.LIFE));
        }
    }

    createPowerUpEffect(x, y, color) {
        const config = CONFIG.PARTICLES.POWER_UP;

        for (let i = 0; i < config.COUNT; i++) {
            const angle = (Math.PI * 2 * i) / config.COUNT;
            const speed = random(config.SPEED_MIN, config.SPEED_MAX);
            const velocityX = Math.cos(angle) * speed;
            const velocityY = Math.sin(angle) * speed - 100;

            this.particles.push(new Particle(x, y, velocityX, velocityY, color, config.SIZE, config.LIFE));
        }
    }

    createTrail(x, y, color = '#FFFF00') {
        this.particles.push(new Particle(x, y, 0, 0, color, 3, 200));
    }

    createScorePopup(x, y, score) {
        const popup = {
            x: x,
            y: y,
            score: score,
            life: 1000,
            maxLife: 1000,
            velocityY: -100,
            destroyed: false,
            update: function(deltaTime) {
                const dt = deltaTime / 1000;
                this.y += this.velocityY * dt;
                this.life -= deltaTime;
                if (this.life <= 0) {
                    this.destroyed = true;
                }
            },
            draw: function(ctx) {
                const alpha = this.life / this.maxLife;
                ctx.save();
                ctx.globalAlpha = alpha;
                ctx.fillStyle = '#FFD700';
                ctx.font = 'bold 24px Arial';
                ctx.textAlign = 'center';
                ctx.strokeStyle = '#000';
                ctx.lineWidth = 3;
                ctx.strokeText(`+${this.score}`, this.x, this.y);
                ctx.fillText(`+${this.score}`, this.x, this.y);
                ctx.restore();
            }
        };
        this.scorePopups = this.scorePopups || [];
        this.scorePopups.push(popup);
    }

    update(deltaTime) {
        this.particles.forEach(particle => particle.update(deltaTime));
        this.particles = this.particles.filter(particle => !particle.destroyed);

        if (this.scorePopups) {
            this.scorePopups.forEach(popup => popup.update(deltaTime));
            this.scorePopups = this.scorePopups.filter(popup => !popup.destroyed);
        }
    }

    draw(ctx) {
        this.particles.forEach(particle => particle.draw(ctx));

        if (this.scorePopups) {
            this.scorePopups.forEach(popup => popup.draw(ctx));
        }
    }

    clear() {
        this.particles = [];
        this.scorePopups = [];
    }
}
