import { Component, OnInit } from '@angular/core';
import { imageUrls } from 'src/app/app.component';
import { AuthService } from 'src/app/configuration/services/auth.service';
import { AdminService } from 'src/app/configuration/services/pages/admin.service';

@Component({
  selector: 'app-left-bar',
  templateUrl: './left-bar.component.html',
  styleUrls: ['./left-bar.component.css', './../../../styles.css'],
})
export class LeftBarComponent implements OnInit {
  public data: any;
  isUserManagementExpanded: boolean = false;
  isTransactionsExpanded: boolean = false;
  isAnalyticsExpanded: boolean = false;
  isModificationsExpanded: boolean = false;

  constructor(
    private adminService: AdminService,
    private authService: AuthService
  ) {}

  imageUrls = new imageUrls();

  toggleDropdown(index: number) {
    const properties = [
      'isUserManagementExpanded',
      'isTransactionsExpanded',
      'isAnalyticsExpanded',
      'isModificationsExpanded',
    ];

    if (index >= 0 && index < properties.length) {
      const propertyName = properties[index] as keyof LeftBarComponent;
      this[propertyName] = !this[propertyName];
      localStorage.setItem(
        propertyName as string,
        JSON.stringify(this[propertyName])
      );
    }
  }

  ngOnInit() {
    const expandedItems = {
      isUserManagementExpanded: false,
      isTransactionsExpanded: false,
      isAnalyticsExpanded: false,
      isModificationsExpanded: false,
    };

    for (const key in expandedItems) {
      if (localStorage.hasOwnProperty(key)) {
        const parsedValue = JSON.parse(
          localStorage.getItem(key) || 'false'
        ) as boolean;
        expandedItems[key as keyof typeof expandedItems] = parsedValue;
      }
    }

    this.isUserManagementExpanded = expandedItems.isUserManagementExpanded;
    this.isTransactionsExpanded = expandedItems.isTransactionsExpanded;
    this.isAnalyticsExpanded = expandedItems.isAnalyticsExpanded;
    this.isModificationsExpanded = expandedItems.isModificationsExpanded;

    const cookieKey = 'userAdminData'; // Define a cookie key
    const cachedData = localStorage.getItem(cookieKey);
    if (cachedData) {
      try {
        this.data = JSON.parse(cachedData); // Parse the JSON string into an array
      } catch (error) {
        console.error('Error parsing cached data:', error);
      }
    } else {
      // If not in cookie, fetch from the server and store in cookie
      this.adminService.getUserData().subscribe((response) => {
        this.data = response;
        localStorage.setItem(cookieKey, JSON.stringify(response)); // Cache the data in cookie
      });
    }
  }

  logOut() {
    this.authService.logout();
  }
}
