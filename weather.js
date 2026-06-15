class Weather {
    constructor() {
        this.time = 0; // 0 = dawn, 0.5 = dusk, 1 = next dawn
        this.dayLength = CONFIG.DAY_LENGTH;
        
        this.isDaytime = true;
        this.darkness = 0; // 0 = fully bright, 1 = fully dark
        
        this.weatherType = 'clear'; // clear, rain, fog, snow
        this.weatherIntensity = 0; // 0-1
        this.weatherChangeTimer = 0;
        this.weatherChangeDuration = 30000; // 30 seconds
    }
    
    update(deltaTime) {
        // Clamp deltaTime
        deltaTime = Math.min(deltaTime, 0.033);
        
        // Update time of day
        this.time += deltaTime / this.dayLength;
        if (this.time >= 1) {
            this.time -= 1;
        }
        
        // Calculate darkness (0 at noon, 1 at midnight)
        if (this.time < 0.25 || this.time > 0.75) {
            // Night time
            if (this.time < 0.25) {
                this.darkness = (0.25 - this.time) / 0.25;
            } else {
                this.darkness = (this.time - 0.75) / 0.25;
            }
        } else {
            // Day time
            this.darkness = 0;
        }
        
        // Update weather
        this.weatherChangeTimer += deltaTime;
        if (this.weatherChangeTimer >= this.weatherChangeDuration) {
            this.randomWeatherChange();
            this.weatherChangeTimer = 0;
        }
    }
    
    getDarknessLevel() {
        return Math.max(0, Math.min(1, this.darkness));
    }
    
    getTimeOfDay() {
        const hours = Math.floor(this.time * 24);
        const minutes = Math.floor((this.time * 24 - hours) * 60);
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    }
    
    isNight() {
        return this.time > 0.75 || this.time < 0.25;
    }
    
    randomWeatherChange() {
        const rand = Math.random();
        if (rand < 0.7) {
            this.weatherType = 'clear';
            this.weatherIntensity = 0;
        } else if (rand < 0.85) {
            this.weatherType = 'rain';
            this.weatherIntensity = Math.random() * 0.5 + 0.3;
        } else if (rand < 0.95) {
            this.weatherType = 'fog';
            this.weatherIntensity = Math.random() * 0.4 + 0.2;
        } else {
            this.weatherType = 'snow';
            this.weatherIntensity = Math.random() * 0.3 + 0.1;
        }
    }
    
    drawOverlay(ctx, canvasWidth, canvasHeight) {
        // Draw darkness overlay
        const darkness = this.getDarknessLevel();
        if (darkness > 0) {
            ctx.fillStyle = `rgba(0, 0, 0, ${darkness * 0.6})`;
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        }
        
        // Draw weather effects
        switch (this.weatherType) {
            case 'rain':
                this.drawRain(ctx, canvasWidth, canvasHeight);
                break;
            case 'fog':
                this.drawFog(ctx, canvasWidth, canvasHeight);
                break;
            case 'snow':
                this.drawSnow(ctx, canvasWidth, canvasHeight);
                break;
        }
    }
    
    drawRain(ctx, canvasWidth, canvasHeight) {
        ctx.strokeStyle = `rgba(100, 150, 200, ${this.weatherIntensity * 0.5})`;
        ctx.lineWidth = 2;
        
        const rainCount = Math.floor(this.weatherIntensity * 50);
        for (let i = 0; i < rainCount; i++) {
            const x = Math.random() * canvasWidth;
            const y = Math.random() * canvasHeight;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x - 5, y + 10);
            ctx.stroke();
        }
    }
    
    drawFog(ctx, canvasWidth, canvasHeight) {
        ctx.fillStyle = `rgba(200, 200, 200, ${this.weatherIntensity * 0.3})`;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    }
    
    drawSnow(ctx, canvasWidth, canvasHeight) {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.weatherIntensity * 0.4})`;
        const snowCount = Math.floor(this.weatherIntensity * 30);
        for (let i = 0; i < snowCount; i++) {
            const x = Math.random() * canvasWidth;
            const y = Math.random() * canvasHeight;
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}