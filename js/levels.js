class Platform {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    
    draw(ctx) {
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(this.x, this.y, this.width, this.height);
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