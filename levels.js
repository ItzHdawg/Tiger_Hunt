class LevelManager {
    constructor() {
        this.currentLevel = 1;
        this.maxLevel = 5;
        this.score = 0;
        this.levelStartTime = 0;
        this.wolvesDespawned = 0;
    }
    
    initialize(level) {
        this.currentLevel = level;
        this.levelStartTime = Date.now();
        this.wolvesDespawned = 0;
    }
    
    update(wolfManager, player, survival) {
        // Check if player should advance to next level
        if (this.currentLevel < this.maxLevel) {
            // Advance if enough wolves killed
            if (this.wolvesDespawned >= this.getWolvesRequiredForLevel(this.currentLevel)) {
                this.advanceLevel(wolfManager);
            }
        }
        
        // Increase difficulty based on level
        this.adjustDifficultyByLevel(wolfManager);
    }
    
    advanceLevel(wolfManager) {
        if (this.currentLevel < this.maxLevel) {
            this.currentLevel++;
            this.initialize(this.currentLevel);
            
            // Clear current wolves and reset spawn
            wolfManager.wolves = [];
            wolfManager.spawnTimer = 0;
        }
    }
    
    adjustDifficultyByLevel(wolfManager) {
        // Adjust wolf spawn rate and speed based on level
        wolfManager.spawnRate = CONFIG.WOLF_SPAWN_RATE - (this.currentLevel - 1) * 0.2;
        wolfManager.spawnRate = Math.max(0.5, wolfManager.spawnRate); // Min 0.5 seconds
        
        // Increase max wolf count per level
        const maxWolves = CONFIG.MAX_WOLVES + (this.currentLevel - 1) * 3;
        
        // Update wolf speeds for existing wolves
        for (let wolf of wolfManager.wolves) {
            wolf.speed = CONFIG.WOLF_SPEED + (this.currentLevel - 1) * 20;
        }
    }
    
    getWolvesRequiredForLevel(level) {
        return 5 + (level - 1) * 3; // 5, 8, 11, 14, 17 wolves
    }
    
    recordWolfDefeated(points = 10) {
        this.score += points;
        this.wolvesDespawned++;
    }
    
    getLevelProgress() {
        const required = this.getWolvesRequiredForLevel(this.currentLevel);
        const progress = Math.min(this.wolvesDespawned, required);
        return progress / required;
    }
    
    getElapsedTime() {
        return Date.now() - this.levelStartTime;
    }
    
    isGameComplete() {
        return this.currentLevel > this.maxLevel;
    }
}
