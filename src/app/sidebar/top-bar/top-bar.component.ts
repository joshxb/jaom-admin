import { AuthService } from './../../configuration/services/auth.service';
import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { imageUrls } from 'src/app/app.component';
import { Base, Redirects } from 'src/app/configuration/configuration.component';
import { AdminService } from 'src/app/configuration/services/pages/admin.service';
import { NotificationService } from 'src/app/configuration/services/pages/notification.service';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css'],
})
export class TopBarComponent implements OnInit {
  imageUrls = new imageUrls();
  settingsVisible = false;
  @ViewChild('profile_logo')
  profile_logo!: ElementRef;
  notificationsData: any;
  lastPage: any;

  constructor(
    private authService: AuthService,
    private adminService: AdminService,
    private notificationService: NotificationService
  ) {}

  base = new Base();
  private baseUrl = this.base.baseUrl;
  public data: any;
  notificationPage: number = 1;

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
      this.adminService.getUserData().subscribe(
        (response) => {
          if (response?.type === 'admin') {
            this.data = response;
          } else {
            this.redirectToUserPage();
          }
        },
        () => {
          this.redirectToUserPage();
        }
      );
    }
    this.getAllNotification(this.notificationPage);
  }

  getAllNotification(page: number = 1) {
    this.notificationService.getAllNotification(page).subscribe((res) => {
      const { data } = res;
      this.notificationsData = data;
      this.lastPage = res?.last_page;
    });
  }

  getNotificationObject(
    notificationObject: string,
    key: string
  ): string | null {
    try {
      const parsedNotification = JSON.parse(notificationObject);
      let data = null;
      if (key === 'title') {
        data = parsedNotification.title;
      }
      if (key === 'content') {
        data = parsedNotification.content;
      }
      return data;
    } catch (error) {
      console.error('Error parsing JSON:', error);
      return null;
    }
  }

  private redirectToUserPage(): void {
    if (this.baseUrl === Redirects.localServerUrl) {
      window.location.href = Redirects.localUserUrl;
    } else {
      window.location.href = Redirects.deployUserUrl;
    }
  }

  prevNotif(event: any) {
    if (this.notificationPage > 1) {
      this.notificationPage = this.notificationPage - 1;
      this.getAllNotification(this.notificationPage);
    }
  }

  nextNotif(event: any) {
    if (this.notificationPage < this.lastPage) {
      this.notificationPage = this.notificationPage + 1;
      this.getAllNotification(this.notificationPage);
    }
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }

  logOut() {
    this.authService.logout();
  }
}
