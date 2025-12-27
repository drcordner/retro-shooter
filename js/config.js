// Game Configuration
const CONFIG = {
    // Version
    VERSION: '1.3.0',

    // Canvas settings
    CANVAS_WIDTH: 1280,
    CANVAS_HEIGHT: 960,
    ASPECT_RATIO: 1280 / 960,

    // Player settings
    PLAYER: {
        WIDTH: 64,
        HEIGHT: 96,
        SPEED: 400,
        JUMP_FORCE: -800,
        GRAVITY: 1600,
        MAX_HEALTH: 5,
        SHOOT_DELAY: 250,
        INVINCIBLE_DURATION: 1200,
        COLOR: '#8b4513',
        COLOR_POWERED_UP: '#ff0',
    },

    // Projectile settings
    PROJECTILE: {
        WIDTH: 24,
        HEIGHT: 12,
        SPEED: 800,
        SPEED_POWERED: 1200,
        DAMAGE: 1,
        DAMAGE_POWERED: 2,
        COLOR: '#FFFF00',
        COLOR_POWERED: '#FFD700',
    },

    // Enemy settings
    ENEMY: {
        GODZILLA: {
            WIDTH: 96,
            HEIGHT: 128,
            BASE_SPEED: 160,
            BASE_HEALTH: 3,
            COLOR: '#228B22',
            SCORE: 100,
            ATTACK_COOLDOWN: 1000,
        },
        DOG: {
            WIDTH: 64,
            HEIGHT: 64,
            BASE_SPEED: 300,
            BASE_HEALTH: 1,
            COLOR: '#8B4513',
            SCORE: 50,
            ATTACK_COOLDOWN: 1000,
        },
        BOSS: {
            WIDTH: 192,
            HEIGHT: 192,
            BASE_SPEED: 120,
            BASE_HEALTH: 10,
            COLOR: '#FF4500',
            SCORE: 500,
            ATTACK_COOLDOWN: 1000,
        },
    },

    // Difficulty progression by level
    DIFFICULTY: {
        LEVEL_1: {
            GODZILLA_SPEED: 20,
            DOG_SPEED: 80,
            GODZILLA_ATTACKS: false,
        },
        LEVEL_2: {
            GODZILLA_SPEED: 30,
            DOG_SPEED: 120,
        },
        LEVEL_3: {
            GODZILLA_SPEED: 50,
            DOG_SPEED: 160,
        },
        LEVEL_4_5: {
            GODZILLA_SPEED: 80,
            DOG_SPEED: 200,
        },
        LEVEL_6_8: {
            GODZILLA_SPEED: 120,
            DOG_SPEED: 250,
        },
    },

    // Power-up settings
    POWERUP: {
        WIDTH: 32,
        HEIGHT: 32,
        DURATION: 7000,
        COLORS: {
            BANANA: '#ffe135',
            GOLDEN_BANANA: '#ffd700',
            FIRE_FLOWER: '#ff4500',
            SPEED_VINE: '#32cd32',
            SHIELD_COCONUT: '#8b4513',
            MULTI_SHOT: '#00bfff',
        },
    },

    // Particle effects settings
    PARTICLES: {
        EXPLOSION: {
            COUNT: 20,
            SPEED_MIN: 50,
            SPEED_MAX: 200,
            LIFE_MIN: 300,
            LIFE_MAX: 800,
            SIZE_MIN: 2,
            SIZE_MAX: 6,
        },
        MUZZLE_FLASH: {
            COUNT: 5,
            SPEED_MIN: 30,
            SPEED_MAX: 100,
            LIFE: 150,
            SIZE: 4,
        },
        POWER_UP: {
            COUNT: 15,
            SPEED_MIN: 20,
            SPEED_MAX: 80,
            LIFE: 500,
            SIZE: 3,
        },
    },

    // Game settings
    GAME: {
        FPS: 60,
        MAX_PHYSICS_STEPS: 5,
        TOTAL_LEVELS: 100,
    },

    // Sound settings (volume 0-1)
    SOUND: {
        MASTER_VOLUME: 0.5,
        SFX_VOLUME: 0.5,
        MUSIC_VOLUME: 0.3,
    },
};
