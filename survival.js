class Survival {
    constructor() {
        this.health = 100;
        this.maxHealth = 100;
        
        this.hunger = 50;
        this.maxHunger = 100;
        
        this.thirst = 50;
        this.maxThirst = 100;
        
        this.stamina = 100;
        this.maxStamina = 100;
        
        this.isAlive = true;
        this.isExhausted = false;
    }
    
    update(deltaTime, player, inHut) {
        if (!this.isAlive) return;
        
        // Hunger depletes over time
        this.hunger -= CONFIG.HUNGER_DECAY_RATE * deltaTime;
        this.hunger = Math.max(0, this.hunger);
        
        // Thirst depletes faster
        this.thirst -= CONFIG.THIRST_DECAY_RATE * deltaTime;
        this.thirst = Math.max(0, this.thirst);
        
        // Stamina regeneration/depletion
        if (player.isSprinting) {
            this.stamina -= CONFIG.STAMINA_DRAIN_RATE * deltaTime;
            this.stamina = Math.max(0, this.stamina);
        } else {
            this.stamina += CONFIG.STAMINA_REGEN_RATE * deltaTime;
            this.stamina = Math.min(this.maxStamina, this.stamina);
        }
        
        // Check if exhausted
        this.isExhausted = this.stamina <= 0;
        
        // Health affected by hunger/thirst
        if (this.hunger === 0) {
            this.health -= 0.5 * deltaTime;
        }
        if (this.thirst === 0) {
            this.health -= 1 * deltaTime;
        }
        
        // Health damage from extreme hunger/thirst
        if (this.hunger < 20) {
            this.health -= 0.2 * deltaTime;
        }
        if (this.thirst < 20) {
            this.health -= 0.3 * deltaTime;
        }
        
        // Die if health reaches 0
        if (this.health <= 0) {
            this.isAlive = false;
            this.health = 0;
        }
    }
    
    takeDamage(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            this.isAlive = false;
            this.health = 0;
        }
        return !this.isAlive;
    }
    
    heal(amount) {
        this.health = Math.min(this.maxHealth, this.health + amount);
    }
    
    eat(amount) {
        this.hunger = Math.min(this.maxHunger, this.hunger + amount);
    }
    
    drink(amount) {
        this.thirst = Math.min(this.maxThirst, this.thirst + amount);
    }
    
    getHealthPercentage() {
        return this.health / this.maxHealth;
    }
    
    getHungerPercentage() {
        return this.hunger / this.maxHunger;
    }
    
    getThirstPercentage() {
        return this.thirst / this.maxThirst;
    }
    
    getStaminaPercentage() {
        return this.stamina / this.maxStamina;
    }
}
