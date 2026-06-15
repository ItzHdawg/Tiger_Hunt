class Hut {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = CONFIG.HUT_SIZE;
        this.isActive = false;
    }
    
    checkPlayerInside(player) {
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const distance = Math.sqrt(dx ** 2 + dy ** 2);
        this.isActive = distance < this.size + player.size;
        return this.isActive;
    }
    
    draw(ctx, cameraX, cameraY) {
        const screenX = this.x - cameraX;
        const screenY = this.y - cameraY;
        
        // Draw hut structure (square/rectangle)
        ctx.fillStyle = this.isActive ? '#FFD700' : '#8B4513';
        ctx.fillRect(screenX - this.size, screenY - this.size, this.size * 2, this.size * 2);
        
        // Draw roof (triangle)
        ctx.fillStyle = this.isActive ? '#FFA500' : '#654321';
        ctx.beginPath();
        ctx.moveTo(screenX - this.size, screenY - this.size);
        ctx.lineTo(screenX + this.size, screenY - this.size);
        ctx.lineTo(screenX, screenY - this.size * 1.5);
        ctx.closePath();
        ctx.fill();
        
        // Draw door
        ctx.fillStyle = '#333';
        ctx.fillRect(screenX - 10, screenY, 20, 30);
        
        // Glow effect when active
        if (this.isActive) {
            ctx.strokeStyle = 'rgba(255, 215, 0, 0.5)';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(screenX, screenY, this.size + 10, 0, Math.PI * 2);
            ctx.stroke();
        }
    }
}

class HutManager {
    constructor() {
        this.huts = [];
        this.initializeHuts();
    }
    
    initializeHuts() {
        // Create huts at strategic locations in the world
        const hutPositions = [
            { x: 600, y: 400 },    // Starting area
            { x: 1200, y: 800 },   // East
            { x: 300, y: 1200 },   // West
            { x: 900, y: 1600 },   // South
            { x: 1500, y: 600 },   // Northeast
            { x: 2400, y: 1200 },  // Far east
            { x: 300, y: 2400 },   // Far west
            { x: 2100, y: 2400 },  // South-central
        ];
        
        for (let pos of hutPositions) {
            this.huts.push(new Hut(pos.x, pos.y));
        }
    }
    
    update(player, survival) {
        for (let hut of this.huts) {
            if (hut.checkPlayerInside(player)) {
                this.healPlayer(survival);
                return hut;
            }
        }
        return null;
    }
    
    healPlayer(survival) {
        // Restore health
        survival.health = Math.min(100, survival.health + CONFIG.HUT_HEALING_RATE * 0.016); // ~60fps
        
        // Slow restoration of hunger/thirst
        survival.hunger = Math.min(100, survival.hunger + CONFIG.HUT_HUNGER_RATE * 0.016);
        survival.thirst = Math.min(100, survival.thirst + CONFIG.HUT_THIRST_RATE * 0.016);
        
        // Fast stamina regeneration
        survival.stamina = Math.min(100, survival.stamina + 2 * 0.016);
    }
    
    draw(ctx, cameraX, cameraY) {
        for (let hut of this.huts) {
            if (hut) {
                hut.draw(ctx, cameraX, cameraY);
            }
        }
    }
    
    getClosestHut(player) {
        let closest = null;
        let closestDistance = Infinity;
        
        for (let hut of this.huts) {
            if (!hut) continue;
            
            const dx = player.x - hut.x;
            const dy = player.y - hut.y;
            const distance = Math.sqrt(dx ** 2 + dy ** 2);
            
            if (distance < closestDistance) {
                closestDistance = distance;
                closest = hut;
            }
        }
        
        return closest;
    }
}