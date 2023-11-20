export class ScreenWakeLocker {
    constructor() {
        this.wakeLock = null;
    }

    async requestWakeLock() {
            console.debug('Wake lock requested.');
        if ('wakeLock' in navigator) {
            this.wakeLock = await navigator.wakeLock.request('screen');
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
