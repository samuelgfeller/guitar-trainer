export class GameLevelTracker {

// Store the accomplished levels in localStorage
    static storeAccomplishedLevels(levels) {
        localStorage.setItem('accomplishedLevels', JSON.stringify(levels));
    }

    // Add an accomplished level to the list in localStorage
    static addAccomplishedLevel(level) {
        let levels = this.getAccomplishedLevels();
        if (!levels.includes(level)) {
            levels.push(level);
            this.storeAccomplishedLevels(levels);
        }
    }

    // Get the list of accomplished levels from localStorage
    static getAccomplishedLevels() {
        let levels = localStorage.getItem('accomplishedLevels');
        if (levels) {
            return JSON.parse(levels);
        } else {
            return [];
        }
    }

    // Check if a level is accomplished
    static isLevelAccomplished(level) {
        let levels = this.getAccomplishedLevels();
        return levels.includes(level);
    }

    /**
     * Get the current level which is always one higher than the last completed or the default value
     * @return {number}
     */
    static getCurrentLevel() {
        let levels = this.getAccomplishedLevels();
        if (Array.isArray(levels) && levels.length > 0) {
            return parseInt(levels[levels.length - 1]) + 1;
        }
        // Return default level
        return 13;
    }
}