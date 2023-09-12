import { Injectable } from '@angular/core';
import { AdminService } from '../pages/admin.service';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  constructor(private adminService: AdminService) {}

  updateOtherUserData(user: number, formData: any) {
    return this.adminService.updateOtherUserData(user, formData);
  }
}
