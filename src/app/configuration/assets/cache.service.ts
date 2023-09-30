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

  themeChange(renderer: any, nativeElement : any, theme: string) {
    if (theme === 'dark') {
      nativeElement.querySelector('body').style.background =
        'rgba(0, 0, 0, 0.829)';

      const inputStyles = `
        p, label, input, .showing-pagination {
          color: #fff !important;
        }

        .modal-overlay p, .modal-overlay label,
        .modal-overlay input ,
        .modal-overlay .showing-pagination,
        .modal-overlay input {
          color: rgba(0, 0, 0, 0.829) !important;
        }

        .modal-overlay input::placeholder, .search-input input::placeholder {
          color: rgba(0, 0, 0, 0.629) !important;
        }

        input::placeholder,
        .auto-add-panel small,
        .content-container small {
          color: #ffffffb5 !important;
        }

        .default-room-row, .faqs-table tr {
          background: #fff !important;
        }

        .custom-div,
        .users-table,
        .faqs-tr {
          background: #fffffff3 !important;
        }

        .default-room-row {
          border-radius: 5px !important;
        }

        .default-room-row td{
          padding:10px !important;
          border:none !important;
        }

        .custom-div p,
        .donations-amount p,
        .filter-user-search,
        .filter-user-search::placeholder,
        .page-visits-count p,
        .default-room-row small,
        .faqs-table p, .faqs-table span,
        .user-card p,
        .empty-data p,
        .search-input input {
          color: rgba(0, 0, 0, 0.829) !important;
        }
      `;

      const styleElement = renderer.createElement('style');
      styleElement.innerHTML = inputStyles;
      renderer.appendChild(nativeElement, styleElement);
    }
  }
}
