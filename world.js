class World {
    constructor() {
        this.width = CONFIG.WORLD_WIDTH;
        this.height = CONFIG.WORLD_HEIGHT;
        this.backgroundColor = '#2a5a2a';
    }
    
    update(player, wolves, huts) {
        // World update logic if needed
    }
    
    draw(ctx, player, wolves, huts, weather, canvasWidth, canvasHeight) {
        // Calculate camera position (center on player)
        const cameraX = player.x - canvasWidth / 2;
        const cameraY = player.y - canvasHeight / 2;
        
        // Clamp camera to world bounds
        const clampedCameraX = Math.max(0, Math.min(this.width - canvasWidth, cameraX));
        const clampedCameraY = Math.max(0, Math.min(this.height - canvasHeight, cameraY));
        
        // Clear canvas
        ctx.fillStyle = this.backgroundColor;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        
        // Draw grid background
        this.drawGrid(ctx, clampedCameraX, clampedCameraY, canvasWidth, canvasHeight);
        
        // Draw world bounds indicator
        this.drawWorldBounds(ctx, clampedCameraX, clampedCameraY, canvasWidth, canvasHeight);
        
        // Draw huts
        huts.draw(ctx, clampedCameraX, clampedCameraY);
        
        // Draw wolves
        wolves.draw(ctx, clampedCameraX, clampedCameraY);
        
        // Draw player
        player.draw(ctx, clampedCameraX, clampedCameraY);
        
        // Draw weather overlay
        weather.drawOverlay(ctx, canvasWidth, canvasHeight);
        
        // Draw minimap
        this.drawMinimap(ctx, player, wolves, huts, canvasWidth, canvasHeight);
        
        return { cameraX: clampedCameraX, cameraY: clampedCameraY };
    }
    
    drawGrid(ctx, cameraX, cameraY, canvasWidth, canvasHeight) {
        const gridSize = 100;
        const startX = Math.floor(cameraX / gridSize) * gridSize;
        const startY = Math.floor(cameraY / gridSize) * gridSize;
        
        ctx.strokeStyle = 'rgba(100, 100, 100, 0.1)';
        ctx.lineWidth = 1;
        
        for (let x = startX; x < startX + canvasWidth + gridSize; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x - cameraX, 0);
            ctx.lineTo(x - cameraX, canvasHeight);
            ctx.stroke();
        }
        
        for (let y = startY; y < startY + canvasHeight + gridSize; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y - cameraY);
            ctx.lineTo(canvasWidth, y - cameraY);
            ctx.stroke();
        }
    }
    
    drawWorldBounds(ctx, cameraX, cameraY, canvasWidth, canvasHeight) {
        ctx.strokeStyle = 'rgba(255, 0, 0, 0.3)';
        ctx.lineWidth = 2;
        
        const left = 0 - cameraX;
        const top = 0 - cameraY;
        const right = this.width - cameraX;
        const bottom = this.height - cameraY;
        
        ctx.strokeRect(left, top, this.width, this.height);
    }
    
    drawMinimap(ctx, player, wolves, huts, canvasWidth, canvasHeight) {
        const minimapWidth = 200;
        const minimapHeight = 150;
        const minimapX = canvasWidth - minimapWidth - 10;
        const minimapY = 10;
        
        // Draw minimap background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(minimapX, minimapY, minimapWidth, minimapHeight);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 2;
        ctx.strokeRect(minimapX, minimapY, minimapWidth, minimapHeight);
        
        // Scale factor for minimap
        const scaleX = minimapWidth / this.width;
        const scaleY = minimapHeight / this.height;
        
        // Draw huts on minimap
        ctx.fillStyle = '#FFD700';
        for (let hut of huts.huts) {
            if (hut) {
                const x = minimapX + hut.x * scaleX;
                const y = minimapY + hut.y * scaleY;
                ctx.fillRect(x - 2, y - 2, 4, 4);
            }
        }
        
        // Draw wolves on minimap
        ctx.fillStyle = '#FF4444';
        for (let wolf of wolves.wolves) {
            if (wolf && wolf.isAlive()) {
                const x = minimapX + wolf.x * scaleX;
                const y = minimapY + wolf.y * scaleY;
                ctx.fillRect(x - 1, y - 1, 2, 2);
            }
        }
        
        // Draw player on minimap
        ctx.fillStyle = '#00FF00';
        const playerX = minimapX + player.x * scaleX;
        const playerY = minimapY + player.y * scaleY;
        ctx.beginPath();
        ctx.arc(playerX, playerY, 3, 0, Math.PI * 2);
        ctx.fill();
    }
}