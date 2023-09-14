import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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

  activeIndex: number = 1;

  constructor(
    private adminService: AdminService,
    private authService: AuthService,
    private router: Router
  ) {}

  imageUrls = new imageUrls();

  toggleDropdown(index: number) {
    const properties: (keyof LeftBarComponentProps)[] = [
      'isUserManagementExpanded',
      'isTransactionsExpanded',
      'isAnalyticsExpanded',
      'isModificationsExpanded',
    ];

    if (index >= 0 && index < properties.length) {
      const propertyName = properties[index];
      this[propertyName] = !this[propertyName];
      localStorage.setItem(
        propertyName,
        JSON.stringify(this[propertyName])
      );
    }
  }

  ngOnInit() {
    const storedIndex = localStorage.getItem('activeIndex');
    if (storedIndex !== null) {
      this.activeIndex = JSON.parse(storedIndex);
    }

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

  checkActive(index: number, page: string|null = null) {
    this.activeIndex = index;
    localStorage.setItem('activeIndex', JSON.stringify(index));
    if (page !== null){
      this.router.navigate([`/${page}`]);
    }
  }
}

interface LeftBarComponentProps {
  isUserManagementExpanded: boolean;
  isTransactionsExpanded: boolean;
  isAnalyticsExpanded: boolean;
  isModificationsExpanded: boolean;
}