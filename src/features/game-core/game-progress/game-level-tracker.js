export class GameLevelTracker {

// Store the accomplished levels in localStorage
    static storeAccomplishedLevels(levels, key) {
        localStorage.setItem(key, JSON.stringify(levels));
    }

    // Add an accomplished level to the list in localStorage
    static addAccomplishedLevel(level, gameModeLevelKey) {
        let levels = this.getAccomplishedLevels(gameModeLevelKey);
        if (!levels.includes(level)) {
            levels.push(level);
            this.storeAccomplishedLevels(levels, gameModeLevelKey);
        }
    }

    // Get the list of accomplished levels from localStorage
    static getAccomplishedLevels(key) {
        let levels = localStorage.getItem(key);
        if (levels) {
            return JSON.parse(levels);
        } else {
            return [];
        }
    }

    // Check if a level is accomplished
    static isLevelAccomplished(level, gameModeLevelKey) {
        let levels = this.getAccomplishedLevels(gameModeLevelKey);
        return levels.includes(level);
    }

    /**
     * Get the current level which is always one higher than the last completed or the default value
     * @return {number}
     */
    static getCurrentLevel(gameModeLevelKey) {
        let levels = this.getAccomplishedLevels(gameModeLevelKey);
        if (Array.isArray(levels) && levels.length > 0) {
            return parseInt(levels[levels.length - 1]) + 1;
        }
        // Return default level
        return 13;
    }
}