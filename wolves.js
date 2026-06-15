class Wolf {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.speed = CONFIG.WOLF_SPEED;
        this.size = CONFIG.WOLF_SIZE;
        this.health = CONFIG.WOLF_HEALTH;
        this.maxHealth = CONFIG.WOLF_HEALTH;
        
        this.state = 'idle'; // idle, chasing, attacking
        this.detectionRange = CONFIG.WOLF_DETECTION_RANGE;
        this.attackRange = CONFIG.WOLF_ATTACK_RANGE;
        this.attackCooldown = 0;
        this.lastAttackTime = 0;
    }
    
    update(deltaTime, player) {
        // Clamp deltaTime
        deltaTime = Math.min(deltaTime, 0.033);
        
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const distance = Math.sqrt(dx ** 2 + dy ** 2);
        
        // State machine
        if (distance < this.detectionRange) {
            this.state = 'chasing';
        } else {
            this.state = 'idle';
            this.vx = 0;
            this.vy = 0;
        }
        
        // Update attack cooldown
        this.attackCooldown -= deltaTime;
        
        // Behavior based on state
        if (this.state === 'chasing' && distance > 0) {
            // Chase player
            const angle = Math.atan2(dy, dx);
            this.vx = Math.cos(angle) * this.speed;
            this.vy = Math.sin(angle) * this.speed;
            
            // Update position
            this.x += this.vx * deltaTime;
            this.y += this.vy * deltaTime;
            
            // Check if in attack range
            if (distance < this.attackRange && this.attackCooldown <= 0) {
                this.state = 'attacking';
                this.attackCooldown = CONFIG.WOLF_ATTACK_COOLDOWN / 1000; // convert to seconds
                return 'attacking';
            }
        }
        
        // Boundary checking
        this.x = Math.max(this.size, Math.min(CONFIG.WORLD_WIDTH - this.size, this.x));
        this.y = Math.max(this.size, Math.min(CONFIG.WORLD_HEIGHT - this.size, this.y));
        
        return null;
    }
    
    draw(ctx, cameraX, cameraY) {
        const screenX = this.x - cameraX;
        const screenY = this.y - cameraY;
        
        // Draw wolf body
        ctx.fillStyle = '#4A4A4A';
        ctx.beginPath();
        ctx.arc(screenX, screenY, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw eyes
        ctx.fillStyle = '#FF4444';
        ctx.beginPath();
        ctx.arc(screenX - 8, screenY - 5, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(screenX + 8, screenY - 5, 4, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw health bar if damaged
        if (this.health < this.maxHealth) {
            const barWidth = this.size * 2;
            const barHeight = 4;
            ctx.fillStyle = '#333';
            ctx.fillRect(screenX - barWidth / 2, screenY - this.size - 10, barWidth, barHeight);
            ctx.fillStyle = '#FF6B6B';
            ctx.fillRect(screenX - barWidth / 2, screenY - this.size - 10, (this.health / this.maxHealth) * barWidth, barHeight);
        }
    }
    
    takeDamage(amount) {
        this.health -= amount;
        return this.health <= 0;
    }
    
    isAlive() {
        return this.health > 0;
    }
}

class WolfManager {
    constructor() {
        this.wolves = [];
        this.spawnTimer = 0;
        this.spawnRate = CONFIG.WOLF_SPAWN_RATE;
        this.waveCount = 0;
    }
    
    update(deltaTime, player, level) {
        // Clamp deltaTime
        deltaTime = Math.min(deltaTime, 0.033);
        
        // Spawn new wolves
        this.spawnTimer += deltaTime;
        if (this.spawnTimer >= this.spawnRate && this.wolves.length < CONFIG.MAX_WOLVES + (level - 1) * 3) {
            this.spawnWolf(player, level);
            this.spawnTimer = 0;
        }
        
        // Update all wolves
        for (let i = this.wolves.length - 1; i >= 0; i--) {
            if (this.wolves[i] && this.wolves[i].isAlive()) {
                this.wolves[i].update(deltaTime, player);
            } else if (this.wolves[i]) {
                this.wolves.splice(i, 1);
            }
        }
    }
    
    spawnWolf(player, level) {
        // Spawn off-screen at random angle
        const angle = Math.random() * Math.PI * 2;
        const distance = CONFIG.WOLF_DETECTION_RANGE + 100;
        const x = player.x + Math.cos(angle) * distance;
        const y = player.y + Math.sin(angle) * distance;
        
        const wolf = new Wolf(x, y);
        wolf.speed = CONFIG.WOLF_SPEED + (level - 1) * 20; // Increase difficulty
        this.wolves.push(wolf);
    }
    
    draw(ctx, cameraX, cameraY) {
        for (let wolf of this.wolves) {
            if (wolf) {
                wolf.draw(ctx, cameraX, cameraY);
            }
        }
    }
    
    checkAttacks(player, survival) {
        for (let wolf of this.wolves) {
            if (!wolf) continue;
            
            const dx = player.x - wolf.x;
            const dy = player.y - wolf.y;
            const distance = Math.sqrt(dx ** 2 + dy ** 2);
            
            if (distance < (player.size + wolf.size)) {
                survival.takeDamage(CONFIG.WOLF_DAMAGE);
                if (distance > 0) {
                    wolf.vx = (dx / distance) * wolf.speed * 0.5; // Knockback
                    wolf.vy = (dy / distance) * wolf.speed * 0.5;
                }
            }
        }
    }
    
    damageWolf(index, amount) {
        if (index >= 0 && index < this.wolves.length && this.wolves[index]) {
            if (this.wolves[index].takeDamage(amount)) {
                this.wolves.splice(index, 1);
                return true;
            }
        }
        return false;
    }
    
    getWolfCount() {
        return this.wolves.filter(w => w && w.isAlive()).length;
    }
}