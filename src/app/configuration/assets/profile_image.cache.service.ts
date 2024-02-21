import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class ProfileImageCacheService {
    // A read-only property to store the cache key prefix
    private readonly CACHE_KEY_PREFIX = 'profile-image-cache-';

    constructor() { }

    // A method to cache the profile image in local storage
    cacheProfileImage(id: number, imageData: any) {
        try {
            // Use the getCacheKey method to generate the cache key
            // and store the image data in local storage
            localStorage.setItem(this.getCacheKey(id), imageData);
        } catch (e) {
            // Log any errors encountered while caching the image
            console.error('Error caching profile image:', e);
        }
    }

    // A method to retrieve the cached profile image from local storage
    getProfileImage(id: number) {
        // Use the getCacheKey method to generate the cache key
        // and retrieve the cached image from local storage
        const cachedImageUrl = localStorage.getItem(this.getCacheKey(id));
        // Return the cached image
        return cachedImageUrl;
    }

    // A private method to generate the cache key
    private getCacheKey(id: number): string {
        // Combine the cache key prefix and the id to generate the cache key
        return `${this.CACHE_KEY_PREFIX}${id}`;
    }
}
