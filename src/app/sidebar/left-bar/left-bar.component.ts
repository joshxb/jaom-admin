import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { imageUrls } from 'src/app/app.component';
import { AdminService } from 'src/app/configuration/services/admin.service';

@Component({
  selector: 'app-left-bar',
  templateUrl: './left-bar.component.html',
  styleUrls: ['./left-bar.component.css', './../../../styles.css'],
})
export class LeftBarComponent implements OnInit{
  public data : any;
  constructor(
    private adminService : AdminService
  ) {}

  imageUrls = new imageUrls();

  ngOnInit() {
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

  // Example method to iterate through cached data using a for loop
  iterateThroughData() {
    for (const item of this.data) {
      console.log(item); // Process each item in the data array
    }
  }
}
