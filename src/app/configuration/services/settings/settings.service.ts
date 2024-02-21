import { Injectable } from '@angular/core';
// Import the AdminService
import { AdminService } from '../pages/admin.service';

@Injectable({
  // Provide the service at the root level
  providedIn: 'root',
})
export class SettingsService {
  // Constructor to inject the AdminService
  constructor(private adminService: AdminService) {}

  // Method to update other user data
  updateOtherUserData(user: number, formData: any) {
    // Delegate the call to the AdminService
    return this.adminService.updateOtherUserData(user, formData);
  }
}
