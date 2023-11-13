export class ScreenWakeLockController {
    constructor() {
        this.wakeLock = null;
    }

    async requestWakeLock() {
        if ('wakeLock' in navigator) {
            this.wakeLock = await navigator.wakeLock.request('screen');
            console.debug('Wake lock requested.');
        }
    }

    releaseWakeLock() {
        if (this.wakeLock !== null) {
            this.wakeLock.release();
            this.wakeLock = null;
            console.debug('Wake lock released.');
        }
    }
}
