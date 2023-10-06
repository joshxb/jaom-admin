import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class ProfileImageCacheService {
    private readonly CACHE_KEY_PREFIX = 'profile-image-cache-';

    constructor() { }

    cacheProfileImage(id: number, imageData: any) {
        try {
            localStorage.setItem(
                this.getCacheKey(id),
                imageData
            );
        } catch (e) {
            console.error('Error caching profile image:', e);
        }
    }

    getProfileImage(id: number) {
        const cachedImageUrl = localStorage.getItem(this.getCacheKey(id));
        return cachedImageUrl;
    }

    private getCacheKey(id: number): string {
        return `${this.CACHE_KEY_PREFIX}${id}`;
    }
}
