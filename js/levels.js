class Platform {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    draw(ctx) {
        // Draw main platform body with gradient
        const gradient = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
        gradient.addColorStop(0, '#a0522d');
        gradient.addColorStop(0.5, '#8b4513');
        gradient.addColorStop(1, '#654321');
        ctx.fillStyle = gradient;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Draw top edge highlight
        ctx.fillStyle = '#cd853f';
        ctx.fillRect(this.x, this.y, this.width, Math.max(3, this.height * 0.15));

        // Draw bottom shadow
        ctx.fillStyle = '#3d2817';
        ctx.fillRect(this.x, this.y + this.height - 3, this.width, 3);

        // Draw simple texture lines for wider platforms
        if (this.width > 100 && this.height > 30) {
            ctx.strokeStyle = '#6b4423';
            ctx.lineWidth = 1;
            ctx.beginPath();
            // Draw horizontal lines
            const lineSpacing = 15;
            for (let i = 1; i < this.height / lineSpacing; i++) {
                const y = this.y + i * lineSpacing;
                ctx.moveTo(this.x, y);
                ctx.lineTo(this.x + this.width, y);
            }
            ctx.stroke();
        }
    }
}

// Level data for the first 10 levels
const LEVELS = [
    // Level 1: Tutorial
    {
        platforms: [
            new Platform(0, 800, 1280, 160), // Ground
            new Platform(200, 600, 200, 40),
            new Platform(600, 500, 200, 40),
            new Platform(1000, 600, 200, 40)
        ],
        enemies: [
            { type: 'dog', x: 400, y: 560 }
        ],
        powerUps: [
            { type: 'banana', x: 600, y: 700 }
        ]
    },
    
    // Level 2: Basic Platforming
    {
        platforms: [
            new Platform(0, 800, 1280, 160), // Ground
            new Platform(100, 600, 160, 40),
            new Platform(400, 500, 160, 40),
            new Platform(700, 400, 160, 40),
            new Platform(1000, 500, 160, 40)
        ],
        enemies: [
            { type: 'godzilla', x: 400, y: 460 },
            { type: 'godzilla', x: 800, y: 360 },
            { type: 'dog', x: 1100, y: 460 }
        ],
        powerUps: [
            { type: 'golden_banana', x: 1000, y: 600 }
        ]
    },
    
    // Level 3: Multiple Paths
    {
        platforms: [
            new Platform(0, 800, 1280, 160), // Ground
            new Platform(100, 600, 120, 40),
            new Platform(300, 500, 120, 40),
            new Platform(500, 400, 120, 40),
            new Platform(700, 500, 120, 40),
            new Platform(900, 600, 120, 40),
            new Platform(1100, 500, 120, 40)
        ],
        enemies: [
            { type: 'godzilla', x: 400, y: 560 },
            { type: 'godzilla', x: 600, y: 360 },
            { type: 'dog', x: 1000, y: 560 }
        ],
        powerUps: [
            { type: 'fire_flower', x: 400, y: 560 }
        ]
    },
    
    // Level 4: Vertical Challenge
    {
        platforms: [
            new Platform(0, 800, 1280, 160), // Ground
            new Platform(200, 700, 200, 40),
            new Platform(200, 500, 200, 40),
            new Platform(200, 300, 200, 40),
            new Platform(600, 600, 200, 40),
            new Platform(600, 400, 200, 40),
            new Platform(1000, 700, 200, 40),
            new Platform(1000, 500, 200, 40)
        ],
        enemies: [
            { type: 'godzilla', x: 400, y: 660 },
            { type: 'godzilla', x: 400, y: 460 },
            { type: 'dog', x: 700, y: 560 },
            { type: 'dog', x: 1100, y: 660 }
        ]
    },
    
    // Level 5: First Mini-Boss
    {
        platforms: [
            new Platform(0, 800, 1280, 160), // Ground
            new Platform(100, 600, 200, 40),
            new Platform(500, 500, 200, 40),
            new Platform(900, 600, 200, 40)
        ],
        enemies: [
            { type: 'godzilla', x: 400, y: 560 },
            { type: 'godzilla', x: 700, y: 460 },
            { type: 'boss', x: 1000, y: 560 }
        ]
    },
    
    // Level 6: Moving Platforms
    {
        platforms: [
            new Platform(0, 800, 1280, 160), // Ground
            new Platform(200, 600, 160, 40),
            new Platform(600, 500, 160, 40),
            new Platform(1000, 600, 160, 40)
        ],
        enemies: [
            { type: 'godzilla', x: 400, y: 560 },
            { type: 'godzilla', x: 800, y: 460 },
            { type: 'dog', x: 1100, y: 560 }
        ]
    },
    
    // Level 7: Enemy Waves
    {
        platforms: [
            new Platform(0, 800, 1280, 160), // Ground
            new Platform(100, 600, 200, 40),
            new Platform(400, 500, 200, 40),
            new Platform(700, 400, 200, 40),
            new Platform(1000, 500, 200, 40)
        ],
        enemies: [
            { type: 'godzilla', x: 400, y: 560 },
            { type: 'godzilla', x: 600, y: 460 },
            { type: 'godzilla', x: 800, y: 360 },
            { type: 'dog', x: 1100, y: 560 }
        ]
    },
    
    // Level 8: Precision Platforming
    {
        platforms: [
            new Platform(0, 800, 1280, 160), // Ground
            new Platform(100, 600, 80, 40),
            new Platform(300, 500, 80, 40),
            new Platform(500, 400, 80, 40),
            new Platform(700, 500, 80, 40),
            new Platform(900, 600, 80, 40),
            new Platform(1100, 700, 80, 40)
        ],
        enemies: [
            { type: 'godzilla', x: 400, y: 660 },
            { type: 'godzilla', x: 600, y: 460 },
            { type: 'dog', x: 1000, y: 560 }
        ]
    },
    
    // Level 9: Enemy Coordination
    {
        platforms: [
            new Platform(0, 800, 1280, 160), // Ground
            new Platform(200, 600, 200, 40),
            new Platform(600, 500, 200, 40),
            new Platform(1000, 600, 200, 40)
        ],
        enemies: [
            { type: 'godzilla', x: 400, y: 560 },
            { type: 'godzilla', x: 700, y: 460 },
            { type: 'dog', x: 400, y: 560 },
            { type: 'dog', x: 1100, y: 560 }
        ]
    },
    
    // Level 10: First Boss
    {
        platforms: [
            new Platform(0, 800, 1280, 160), // Ground
            new Platform(200, 600, 200, 40),
            new Platform(600, 500, 200, 40),
            new Platform(1000, 600, 200, 40)
        ],
        enemies: [
            { type: 'boss', x: 800, y: 560 }
        ]
    }
];

// Generate additional levels procedurally (levels 11-100)
function generateLevel(levelNum) {
    const platforms = [new Platform(0, 800, 1280, 160)]; // Always include ground
    const enemies = [];
    const powerUps = [];

    // Difficulty scaling
    const difficulty = Math.min(levelNum / 100, 1);
    const enemyCount = Math.floor(3 + difficulty * 5);
    const platformCount = Math.floor(4 + difficulty * 4);

    // Generate platforms with variation
    for (let i = 0; i < platformCount; i++) {
        const x = getRandomInt(50, 1100);
        const y = getRandomInt(420, 700);
        const width = getRandomInt(120, 220);
        platforms.push(new Platform(x, y, width, 40));
    }

    // Generate enemies based on level
    for (let i = 0; i < enemyCount; i++) {
        const platformIndex = getRandomInt(0, platforms.length - 1);
        const platform = platforms[platformIndex];
        const x = getRandomInt(platform.x + 50, Math.min(platform.x + platform.width - 100, 1180));
        const y = platform.y - 130;

        // Enemy type based on level
        let type;
        if (levelNum % 10 === 0) {
            // Boss every 10 levels
            type = 'boss';
        } else if (levelNum > 50 && Math.random() < 0.3) {
            type = 'boss';
        } else if (Math.random() < 0.6) {
            type = 'godzilla';
        } else {
            type = 'dog';
        }

        enemies.push({ type, x, y });
    }

    // Add power-ups (1-2 per level)
    const powerUpTypes = ['banana', 'golden_banana', 'fire_flower', 'speed_vine', 'shield_coconut', 'multi_shot'];
    const powerUpCount = getRandomInt(1, 2);

    for (let i = 0; i < powerUpCount; i++) {
        const platformIndex = getRandomInt(1, platforms.length - 1);
        const platform = platforms[platformIndex];
        const x = getRandomInt(platform.x + 20, platform.x + platform.width - 50);
        const y = platform.y - 50;
        const type = powerUpTypes[getRandomInt(0, powerUpTypes.length - 1)];

        powerUps.push({ type, x, y });
    }

    return { platforms, enemies, powerUps };
}

// Generate levels 11-100
for (let i = 11; i <= 100; i++) {
    LEVELS.push(generateLevel(i));
} 

const LEVEL_ACCESSIBILITY = {
    GROUND_Y: 800,
    MAX_VERTICAL_STEP: 170,
    HELPER_MIN_WIDTH: 140,
    HELPER_MAX_WIDTH: 220,
    HELPER_HEIGHT: 32
};

function clampLevelX(x, width) {
    return Math.max(0, Math.min(1280 - width, x));
}

function addHelperPlatform(level, x, y, width) {
    const exists = level.platforms.some(platform =>
        platform.x === x &&
        platform.y === y &&
        platform.width === width
    );

    if (!exists) {
        level.platforms.push(new Platform(x, y, width, LEVEL_ACCESSIBILITY.HELPER_HEIGHT));
    }
}

function ensurePlatformReachability(level) {
    const elevatedPlatforms = level.platforms.filter(platform => platform.y < LEVEL_ACCESSIBILITY.GROUND_Y);

    elevatedPlatforms.forEach(platform => {
        let currentY = LEVEL_ACCESSIBILITY.GROUND_Y;

        while (currentY - platform.y > LEVEL_ACCESSIBILITY.MAX_VERTICAL_STEP) {
            currentY -= LEVEL_ACCESSIBILITY.MAX_VERTICAL_STEP;
            const helperWidth = Math.max(
                LEVEL_ACCESSIBILITY.HELPER_MIN_WIDTH,
                Math.min(LEVEL_ACCESSIBILITY.HELPER_MAX_WIDTH, platform.width)
            );
            const helperX = Math.round(clampLevelX(platform.x + (platform.width - helperWidth) / 2, helperWidth));
            addHelperPlatform(level, helperX, currentY, helperWidth);
        }
    });
}

// Accessibility pass: ensure all elevated platforms (and their collectibles) are reachable
LEVELS.forEach(level => {
    ensurePlatformReachability(level);
});
