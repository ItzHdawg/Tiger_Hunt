// Configuration file - Centralize all tunable values

const CONFIG = {
    // Canvas
    CANVAS_WIDTH: 1200,
    CANVAS_HEIGHT: 800,
    
    // Player
    PLAYER_SPEED: 150,
    PLAYER_SPRINT_SPEED: 250,
    PLAYER_ACCELERATION: 800,
    PLAYER_DECELERATION: 600,
    PLAYER_SIZE: 20,
    
    // Wolves
    WOLF_SPEED: 120,
    WOLF_DETECTION_RANGE: 300,
    WOLF_ATTACK_RANGE: 40,
    WOLF_ATTACK_COOLDOWN: 1000, // ms
    WOLF_DAMAGE: 15,
    WOLF_SIZE: 25,
    WOLF_HEALTH: 20,
    
    // Survival Stats
    HUNGER_DECAY_RATE: 0.01,
    THIRST_DECAY_RATE: 0.015,
    STAMINA_DRAIN_RATE: 1.5, // per second while sprinting
    STAMINA_REGEN_RATE: 0.5, // per second while resting
    
    // Huts
    HUT_HEALING_RATE: 10, // per second
    HUT_HUNGER_RATE: 2, // per second
    HUT_THIRST_RATE: 2, // per second
    HUT_SIZE: 40,
    
    // Level
    INITIAL_WOLF_COUNT: 2,
    WOLF_SPAWN_RATE: 1.5, // every X seconds
    MAX_WOLVES: 20,
    
    // World
    WORLD_WIDTH: 4800,
    WORLD_HEIGHT: 3200,
    
    // Weather
    DAY_LENGTH: 300000, // 5 minutes in milliseconds
    
    // Debug
    DEBUG_MODE: false
};