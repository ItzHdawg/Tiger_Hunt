class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Set canvas size
        this.canvas.width = CONFIG.CANVAS_WIDTH;
        this.canvas.height = CONFIG.CANVAS_HEIGHT;
        
        // Initialize game systems
        this.player = new Player();
        this.survival = new Survival();
        this.wolfs = new WolfManager();
        this.huts = new HutManager();
        this.world = new World();
        this.ui = new UI(this.canvas.width, this.canvas.height);
        this.weather = new Weather();
        this.levels = new LevelManager();
        
        // Game state
        this.isRunning = true;
        this.lastFrameTime = Date.now();
        this.fps = 0;
        this.frameCount = 0;
        this.inHut = false;
        
        // Event listeners
        window.addEventListener('keydown', (e) => this.handleKeyDown(e));
        window.addEventListener('keyup', (e) => this.handleKeyUp(e));
        
        // Start game
        this.levels.initialize(1);
        this.gameLoop();
    }
    
    handleKeyDown(event) {
        this.player.handleKeyDown(event);
        
        // Debug toggle
        if (event.key === 'D' || event.key === 'd') {
            CONFIG.DEBUG_MODE = !CONFIG.DEBUG_MODE;
        }
    }
    
    handleKeyUp(event) {
        this.player.handleKeyUp(event);
    }
    
    update(deltaTime) {
        if (!this.isRunning) return;
        
        // Update player
        this.player.update(deltaTime, this.survival);
        
        // Update survival stats
        this.survival.update(deltaTime, this.player, this.inHut);
        
        // Update wolves
        this.wolfs.update(deltaTime, this.player, this.levels.currentLevel);
        
        // Check wolf attacks
        this.wolfs.checkAttacks(this.player, this.survival);
        
        // Update huts
        this.inHut = this.huts.update(this.player, this.survival) !== null;
        
        // Update weather
        this.weather.update(deltaTime);
        
        // Update levels
        this.levels.update(this.wolfs, this.player, this.survival);
        
        // Check game over
        if (!this.survival.isAlive) {
            this.isRunning = false;
        }
    }
    
    render() {
        // Draw world
        const camera = this.world.draw(
            this.ctx, 
            this.player, 
            this.wolfs, 
            this.huts, 
            this.weather,
            this.canvas.width,
            this.canvas.height
        );
        
        // Draw UI
        this.ui.draw(
            this.ctx, 
            this.survival, 
            this.levels.currentLevel, 
            this.wolfs.getWolfCount(),
            this.weather
        );
        
        // Draw debug info
        if (CONFIG.DEBUG_MODE) {
            this.drawDebugInfo();
        }
    }
    
    drawDebugInfo() {
        this.ctx.fillStyle = '#00FF00';
        this.ctx.font = '12px Arial';
        let y = 200;
        
        this.ctx.fillText(`FPS: ${this.fps.toFixed(0)}`, 10, y);
        y += 15;
        
        this.ctx.fillText(`Player: (${this.player.x.toFixed(0)}, ${this.player.y.toFixed(0)})`, 10, y);
        y += 15;
        
        this.ctx.fillText(`Velocity: (${this.player.vx.toFixed(2)}, ${this.player.vy.toFixed(2)})`, 10, y);
        y += 15;
        
        this.ctx.fillText(`Wolves: ${this.wolfs.getWolfCount()}`, 10, y);
        y += 15;
        
        this.ctx.fillText(`In Hut: ${this.inHut ? 'Yes' : 'No'}`, 10, y);
        y += 15;
        
        this.ctx.fillText(`Level: ${this.levels.currentLevel}`, 10, y);
        y += 15;
        
        this.ctx.fillText(`Score: ${this.levels.score}`, 10, y);
    }
    
    gameLoop() {
        const now = Date.now();
        const deltaTime = Math.min((now - this.lastFrameTime) / 1000, 0.016); // Cap at 60fps
        this.lastFrameTime = now;
        
        // Calculate FPS
        this.frameCount++;
        if (this.frameCount % 60 === 0) {
            this.fps = 1 / deltaTime;
        }
        
        // Update and render
        this.update(deltaTime);
        this.render();
        
        // Continue loop
        requestAnimationFrame(() => this.gameLoop());
    }
}

// Start game when page loads
window.addEventListener('load', () => {
    new Game();
});
