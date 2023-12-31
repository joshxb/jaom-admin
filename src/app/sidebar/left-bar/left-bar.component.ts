import { AfterViewInit, Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { imageUrls } from 'src/app/app.component';
import { ProfileImageCacheService } from 'src/app/configuration/assets/profile_image.cache.service';
import { AuthService } from 'src/app/configuration/services/auth.service';
import { AdminService } from 'src/app/configuration/services/pages/admin.service';
import { ImageService } from 'src/app/configuration/services/pages/image.service';

@Component({
  selector: 'app-left-bar',
  templateUrl: './left-bar.component.html',
  styleUrls: ['./left-bar.component.css', './../../../styles.css'],
})

export class LeftBarComponent implements OnInit, AfterViewInit {
  public data: any;
  isUserManagementExpanded: boolean = false;
  isTransactionsExpanded: boolean = false;
  isAnalyticsExpanded: boolean = false;
  isModificationsExpanded: boolean = false;
  isSpinnerLoading: boolean = false;

  activeIndex: number = 1;
  selectedImageSrc: any;

  constructor(
    private adminService: AdminService,
    private authService: AuthService,
    private router: Router,
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private imageService: ImageService,
    private profileImageCacheService: ProfileImageCacheService
  ) { }

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

  ngAfterViewInit(): void {
  }

  ngOnInit() {
    const storedCollapse = localStorage.getItem('activeCollapse');
    if (storedCollapse !== null) {
      const parsedCollapse = JSON.parse(storedCollapse);

      const sidebar = this.elementRef.nativeElement.querySelector('nav');
      if (parsedCollapse === true) {
        if (sidebar) {
          this.renderer.addClass(sidebar, 'active');
        }
      } else {
        if (sidebar) {
          this.renderer.removeClass(sidebar, 'active');
        }
      }
    }

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

    const cookieKey = 'userAdminData'; 
    const cachedData = localStorage.getItem(cookieKey);
    if (cachedData) {
      try {
        this.data = JSON.parse(cachedData); 
        this.getProfileImage(this.data?.id);
      } catch (error) {
        console.error('Error parsing cached data:', error);
      }
    } else {
      this.adminService.getUserData().subscribe((response) => {
        this.data = response;
        this.getProfileImage(this.data?.id);
        localStorage.setItem(cookieKey, JSON.stringify(response));
      });
    }
  }

  logOut() {
    this.authService.logout();
  }

  checkActive(index: number, page: string | null = null) {
    this.isSpinnerLoading = true;
    this.activeIndex = index;
    localStorage.setItem('activeIndex', JSON.stringify(index));
    if (page !== null) {
      this.hidePanel();

      setTimeout(() => {
        this.isSpinnerLoading = false;
        this.router.navigate([`/${page}`]);
      }, 400);
    }
  }

  hidePanel() {
    const sidebar = this.elementRef.nativeElement.querySelector('nav');
    if (sidebar) {
      const screenWidth = window.innerWidth;
      const mobileWidthThreshold = 768;

      if (screenWidth < mobileWidthThreshold) {
        if (sidebar.classList.contains('active')) {
          this.renderer.removeClass(sidebar, 'active');
          localStorage.setItem('activeCollapse', JSON.stringify(false));
        } else {
          this.renderer.addClass(sidebar, 'active');
          localStorage.setItem('activeCollapse', JSON.stringify(true));
        }
      }
    }
  }

  getProfileImage(id : number) {
    const cachedImage = this.profileImageCacheService.getProfileImage(id);
    if (cachedImage) {
      this.selectedImageSrc = cachedImage; 
    } else {
      this.imageService.getOtherUserImageData(id).subscribe(
        (imageData : Blob) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const imageBlobData = reader.result as string;
            this.selectedImageSrc = imageBlobData; 
            this.profileImageCacheService.cacheProfileImage(id, imageBlobData);
          };
          reader.readAsDataURL(imageData);
        });
    }
  }
}

interface LeftBarComponentProps {
  isUserManagementExpanded: boolean;
  isTransactionsExpanded: boolean;
  isAnalyticsExpanded: boolean;
  isModificationsExpanded: boolean;
}