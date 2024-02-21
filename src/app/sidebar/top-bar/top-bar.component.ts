import { AuthService } from './../../configuration/services/auth.service';
import {
  Comp,onent,
  ElementRef,
  OnInit,
  Renderer2,
 , ViewChild,
} from '@angular/core';
import { ,imageUrls } from 'src/app/app.component';
imp,ort { ProfileImageCacheService } from 'src/ap,p/configuration/assets/profile_image.cache.se,rvice';
import { Base, Redirects } from 'src/,app/configuration/configuration.component';
i,mport { AdminService } from 'src/app/configurat,ion/services/pages/admin.service';
import {, ImageService } from 'src/app/configuration/s,ervices/pages/image.service';
import { Notifi,cationService } from 'src/app/configuration/s,ervices/pages/notification.service';

// Top bar component
@Compon,ent({
  selector: 'app-top-bar',
  templateUr,l: './top-bar.component.html',
  styleUrls: [,'./top-bar.component.css'],
})
export class T,opBarComponent implements OnInit {
  // Image URLs
  imageUrl,s = new imageUrls();
  // Settings visibility flag
  settingsVisible = fals,e;
  // View child element reference for profile logo
  @ViewChild('profile_logo')
  profile_log,o!: ElementRef;
  // Notifications data
  notificationsData: any;
  // Last page of notifications
  l,astPage: any;
  // Selected image source
  selectedImageSrc: any;
  // Spinner loading flag
  isSp,innerLoading: boolean = false;

  constructor,(
    private authService: AuthService, // Authentication service
    p,rivate adminService: AdminService, // Admin service
    privat,e notificationService: NotificationService, // Notification service
   ,  private imageService: ImageService, // Image service
    pr,ivate profileImageCacheService: ProfileImageC,acheService // Profile image cache service
  ) {}

  base = new Base(); // Base class instance
  pr,ivate baseUrl = this.base.baseUrl; // Base URL
  public d,ata: any;
  notificationPage: number = 1; // Current notification page

  ,ngOnInit() {
    const cookieKey = 'userAdmin,Data'; // Define a cookie key
    const cache,dData = localStorage.getItem(cookieKey);
    ,if (cachedData) {
      try {
        this.da,ta = JSON.parse(cachedData);
        this.get,ProfileImage(this.data?.id);
      } catch (e,rror) {
        console.error('Error parsing ,cached data:', error);
      }
    } else {
      this.adminService.getUserData().subscrib,e(
        (response) => {
          if (resp,onse?.type === 'admin') {
            this.da,ta = response;
            this.getProfileIma,ge(this.data?.id);
          } else {
            this.redirectToUserPage();
          }
        },
        () => {
          this.redi,rectToUserPage();
        }
      );
    }
    this.getAllNotification(this.notificationPa,ge);
  }

  getProfileImage(id : number) {
    const cachedImage = this.profileImageCacheS,ervice.getProfileImage(id);
    if (cachedIma,ge) {
      this.selectedImageSrc = cachedIma,ge;
    } else {
      this.imageService.getO,therUserImageData(id).subscribe(
        (ima,geData : Blob) => {
          const reader = ,new FileReader();
          reader.onloadend ,= () => {
            const imageBlobData = r,eader.result as string;
            this.sele,ctedImageSrc = imageBlobData;
            thi,s.profileImageCacheService.cacheProfileImage(,id, imageBlobData);
          };
          re,ader.readAsDataURL(imageData);
        });
  }

  getAllNotification(page: number = ,1) {
    this.notificationService.getAllNotif,ication(page).subscribe((res) => {
      cons,t { data } = res;
      this.notificationsDat,a = data;
      this.lastPage = res?.last_pag,e;
      this.isSpinnerLoading = false;
    },);
  }

  getNotificationObject(
    notifica,tionObject: string,
    key: string
  ): stri,ng | null {
    try {
      const parsedNotif,ication = JSON.parse(notificationObject);
   ,   let data = null;
      if (key === 'title',) {
        data = parsedNotification.title;
,      }
      if (key === 'content') {
      ,  data = parsedNotification.content;
      }
,      return data;
    } catch (error) {
    ,  console.error('Error parsing JSON:', error),;
      return null;
    }
  }

  private red,irectToUserPage(): void {
    if (this.baseUr,l === Redirects.localServerUrl) {
      windo,w.location.href = Redirects.localUserUrl;
   , } else {
      window.location.href = Redire,cts.deployUserUrl;
    }
  }

  prevNotif(eve,nt: any) {
    if (this.notificationPage > 1), {
      this.isSpinnerLoading = true;
      ,this.notificationPage = this.notificationPage, - 1;
      this.getAllNotification(this.noti,ficationPage);
    }
  }

  nextNotif(event: ,any) {
    if (this.notificationPage < this.l,astPage) {
      this.isSpinnerLoading = true,;
      this.notificationPage = this.notifica,tionPage + 1;
      this.getAllNotification(t,
