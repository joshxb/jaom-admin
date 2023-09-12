import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root',
})

export class CacheService {
 
  getCachedAdminData(name: string) {
    if (name === 'theme') {
      const cacheTheme = localStorage.getItem('theme');
      const cachedData = cacheTheme ? cacheTheme : 'light';

      return cachedData;
    } else {
      const cookieKey = 'userAdminData';
      const cachedDataString = localStorage.getItem(cookieKey);

      const cachedData = cachedDataString ? JSON.parse(cachedDataString) : null;
      const data = cachedData[name];

      if (data) {
        return data;
      }
    }
  }

  updateCachedAdminData(name: string, newValue: any) {
    if (name === 'theme') {
      localStorage.setItem('theme', newValue.toLowerCase().trim());
    } else {
      const cookieKey = 'userAdminData';
      const cachedDataString = localStorage.getItem(cookieKey);
      let cachedData = cachedDataString ? JSON.parse(cachedDataString) : null;

      if (!cachedData) {
        cachedData = {};
      }
      cachedData[name] = newValue;
      localStorage.setItem(cookieKey, JSON.stringify(cachedData));
    }
  }
}
