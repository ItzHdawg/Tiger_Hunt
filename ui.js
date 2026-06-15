class UI {
    constructor(canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.barWidth = 150;
        this.barHeight = 20;
        this.padding = 15;
    }
    
    draw(ctx, survival, level, wolfCount, weather) {
        // Draw stat bars
        this.drawStatBars(ctx, survival);
        
        // Draw level and wolf count
        this.drawLevelInfo(ctx, level, wolfCount);
        
        // Draw time of day
        this.drawTimeOfDay(ctx, weather);
        
        // Draw status effects
        this.drawStatusEffects(ctx, survival, weather);
        
        // Draw controls hint
        this.drawControls(ctx);
        
        // Draw game over screen if needed
        if (!survival.isAlive) {
            this.drawGameOver(ctx);
        }
    }
    
    drawStatBars(ctx, survival) {
        const startX = this.padding;
        let startY = this.padding;
        
        // Health bar
        this.drawBar(ctx, startX, startY, this.barWidth, this.barHeight, 
                     survival.health / survival.maxHealth, '#FF6B6B', 'Health');
        startY += this.barHeight + 10;
        
        // Hunger bar
        this.drawBar(ctx, startX, startY, this.barWidth, this.barHeight, 
                     survival.hunger / survival.maxHunger, '#FFD700', 'Hunger');
        startY += this.barHeight + 10;
        
        // Thirst bar
        this.drawBar(ctx, startX, startY, this.barWidth, this.barHeight, 
                     survival.thirst / survival.maxThirst, '#4A90E2', 'Thirst');
        startY += this.barHeight + 10;
        
        // Stamina bar
        this.drawBar(ctx, startX, startY, this.barWidth, this.barHeight, 
                     survival.stamina / survival.maxStamina, '#7ED321', 'Stamina');
    }
    
    drawBar(ctx, x, y, width, height, percentage, color, label) {
        // Background
        ctx.fillStyle = '#333';
        ctx.fillRect(x, y, width, height);
        
        // Foreground
        ctx.fillStyle = color;
        ctx.fillRect(x, y, width * Math.max(0, Math.min(1, percentage)), height);
        
        // Border
        ctx.strokeStyle = '#999';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, width, height);
        
        // Label
        ctx.fillStyle = '#FFF';
        ctx.font = 'bold 12px Arial';
        ctx.fillText(label, x + 5, y + height / 2 + 4);
        
        // Percentage text
        ctx.fillStyle = '#FFF';
        ctx.font = '10px Arial';
        const percentage_text = Math.floor(percentage * 100);
        ctx.fillText(`${percentage_text}%`, x + width - 30, y + height / 2 + 4);
    }
    
    drawLevelInfo(ctx, level, wolfCount) {
        const x = this.canvasWidth - 200;
        const y = this.padding;
        
        ctx.fillStyle = '#FFF';
        ctx.font = 'bold 16px Arial';
        ctx.fillText(`Level: ${level}`, x, y + 20);
        
        ctx.font = '14px Arial';
        ctx.fillText(`Wolves: ${wolfCount}`, x, y + 45);
    }
    
    drawTimeOfDay(ctx, weather) {
        const x = this.canvasWidth / 2 - 50;
        const y = this.padding;
        
        ctx.fillStyle = '#FFF';
        ctx.font = 'bold 14px Arial';
        ctx.fillText(`Time: ${weather.getTimeOfDay()}`, x, y + 20);
        
        ctx.font = '12px Arial';
        ctx.fillText(`${weather.isDaytime ? '☀️ Day' : '🌙 Night'}`, x, y + 40);
        
        if (weather.weatherType !== 'clear') {
            ctx.fillText(`${weather.weatherType.toUpperCase()}`, x, y + 60);
        }
    }
    
    drawStatusEffects(ctx, survival, weather) {
        const x = this.padding;
        const y = this.canvasHeight - 60;
        
        ctx.fillStyle = '#FFF';
        ctx.font = '12px Arial';
        
        let statusY = y;
        
        if (survival.isExhausted) {
            ctx.fillStyle = '#FF4444';
            ctx.fillText('⚠️ EXHAUSTED', x, statusY);
            statusY -= 20;
            ctx.fillStyle = '#FFF';
        }
        
        if (survival.hunger < 30) {
            ctx.fillStyle = '#FFD700';
            ctx.fillText('🍗 Hungry', x, statusY);
            statusY -= 20;
            ctx.fillStyle = '#FFF';
        }
        
        if (survival.thirst < 30) {
            ctx.fillStyle = '#4A90E2';
            ctx.fillText('💧 Thirsty', x, statusY);
            statusY -= 20;
            ctx.fillStyle = '#FFF';
        }
        
        if (weather.isNight()) {
            ctx.fillStyle = '#9999FF';
            ctx.fillText('🌙 Night (Dark)', x, statusY);
            ctx.fillStyle = '#FFF';
        }
    }
    
    drawControls(ctx) {
        const x = this.canvasWidth - 300;
        const y = this.canvasHeight - 100;
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(x, y, 290, 90);
        
        ctx.fillStyle = '#FFF';
        ctx.font = 'bold 12px Arial';
        ctx.fillText('CONTROLS', x + 10, y + 20);
        
        ctx.font = '11px Arial';
        ctx.fillText('WASD - Move', x + 10, y + 38);
        ctx.fillText('Shift - Sprint', x + 10, y + 53);
        ctx.fillText('Huts - Heal & Rest', x + 10, y + 68);
    }
    
    drawGameOver(ctx) {
        // Draw semi-transparent overlay
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
        
        // Draw game over text
        ctx.fillStyle = '#FF4444';
        ctx.font = 'bold 60px Arial';
        const text = 'GAME OVER';
        const textWidth = ctx.measureText(text).width;
        ctx.fillText(text, this.canvasWidth / 2 - textWidth / 2, this.canvasHeight / 2 - 50);
        
        // Draw restart instruction
        ctx.fillStyle = '#FFF';
        ctx.font = '20px Arial';
        const restartText = 'Refresh the page to play again';
        const restartWidth = ctx.measureText(restartText).width;
        ctx.fillText(restartText, this.canvasWidth / 2 - restartWidth / 2, this.canvasHeight / 2 + 50);
    }
}
