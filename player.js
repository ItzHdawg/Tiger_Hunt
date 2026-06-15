class Player {
    constructor(x = 600, y = 400) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.speed = CONFIG.PLAYER_SPEED;
        this.sprintSpeed = CONFIG.PLAYER_SPRINT_SPEED;
        this.acceleration = CONFIG.PLAYER_ACCELERATION;
        this.deceleration = CONFIG.PLAYER_DECELERATION;
        this.size = CONFIG.PLAYER_SIZE;
        
        this.isSprinting = false;
        this.animationFrame = 0;
        this.animationCounter = 0;
        
        this.keys = {
            w: false,
            a: false,
            s: false,
            d: false,
            shift: false
        };
    }
    
    handleKeyDown(event) {
        const key = event.key.toLowerCase();
        if (key === 'w') this.keys.w = true;
        if (key === 'a') this.keys.a = true;
        if (key === 's') this.keys.s = true;
        if (key === 'd') this.keys.d = true;
        if (event.shiftKey) this.keys.shift = true;
    }
    
    handleKeyUp(event) {
        const key = event.key.toLowerCase();
        if (key === 'w') this.keys.w = false;
        if (key === 'a') this.keys.a = false;
        if (key === 's') this.keys.s = false;
        if (key === 'd') this.keys.d = false;
        if (!event.shiftKey) this.keys.shift = false;
    }
    
    update(deltaTime, survival) {
        // Clamp deltaTime to prevent physics jumps
        deltaTime = Math.min(deltaTime, 0.033);
        
        // Sprint handling - costs stamina
        this.isSprinting = this.keys.shift && survival.stamina > 0 && !survival.isExhausted;
        
        // Calculate desired velocity
        let ax = 0;
        let ay = 0;
        
        if (this.keys.w) ay -= 1;
        if (this.keys.s) ay += 1;
        if (this.keys.a) ax -= 1;
        if (this.keys.d) ax += 1;
        
        // Normalize diagonal movement
        if (ax !== 0 && ay !== 0) {
            ax *= 0.707; // Math.sqrt(2) / 2
            ay *= 0.707;
        }
        
        // Apply acceleration
        const targetSpeed = this.isSprinting ? this.sprintSpeed : this.speed;
        const maxAccel = this.acceleration;
        
        this.vx += ax * maxAccel * deltaTime;
        this.vy += ay * maxAccel * deltaTime;
        
        // Apply friction/deceleration
        if (ax === 0) {
            if (this.vx > 0) this.vx -= this.deceleration * deltaTime;
            if (this.vx < 0) this.vx += this.deceleration * deltaTime;
            if (Math.abs(this.vx) < 5) this.vx = 0;
        }
        
        if (ay === 0) {
            if (this.vy > 0) this.vy -= this.deceleration * deltaTime;
            if (this.vy < 0) this.vy += this.deceleration * deltaTime;
            if (Math.abs(this.vy) < 5) this.vy = 0;
        }
        
        // Limit max speed
        const speed = Math.sqrt(this.vx ** 2 + this.vy ** 2);
        if (speed > targetSpeed) {
            const scale = targetSpeed / speed;
            this.vx *= scale;
            this.vy *= scale;
        }
        
        // Update position
        this.x += this.vx * deltaTime;
        this.y += this.vy * deltaTime;
        
        // Boundary checking
        this.x = Math.max(this.size, Math.min(CONFIG.WORLD_WIDTH - this.size, this.x));
        this.y = Math.max(this.size, Math.min(CONFIG.WORLD_HEIGHT - this.size, this.y));
        
        // Animation
        this.animationCounter += deltaTime;
        if (this.animationCounter > 0.1) {
            this.animationFrame = (this.animationFrame + 1) % 4;
            this.animationCounter = 0;
        }
    }
    
    draw(ctx, cameraX, cameraY) {
        const screenX = this.x - cameraX;
        const screenY = this.y - cameraY;
        
        // Draw player body (circle)
        ctx.fillStyle = '#FF6B6B';
        ctx.beginPath();
        ctx.arc(screenX, screenY, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw direction indicator (nose)
        const speed = Math.sqrt(this.vx ** 2 + this.vy ** 2);
        if (speed > 10) {
            const angle = Math.atan2(this.vy, this.vx);
            ctx.fillStyle = '#FF4444';
            ctx.save();
            ctx.translate(screenX, screenY);
            ctx.rotate(angle);
            ctx.fillRect(this.size / 2, -5, 15, 10);
            ctx.restore();
        }
        
        // Debug info
        if (CONFIG.DEBUG_MODE) {
            ctx.fillStyle = '#00FF00';
            ctx.font = '12px Arial';
            ctx.fillText(`X: ${this.x.toFixed(0)}, Y: ${this.y.toFixed(0)}`, screenX - 30, screenY - 40);
        }
    }
    
    checkCollisionWithHut(hut) {
        const dx = this.x - hut.x;
        const dy = this.y - hut.y;
        const distance = Math.sqrt(dx ** 2 + dy ** 2);
        return distance < (this.size + hut.size);
    }
    
    checkCollisionWithWolf(wolf) {
        const dx = this.x - wolf.x;
        const dy = this.y - wolf.y;
        const distance = Math.sqrt(dx ** 2 + dy ** 2);
        return distance < (this.size + wolf.size);
    }
}