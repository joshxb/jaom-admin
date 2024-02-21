import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  Renderer2,
} from '@angular/core';
import { Router } from '@angular/router';
import { imageUrls } from 'src/app/app.component';
import {
  ProfileImageCacheService,
} from 's/rc/app/configuration/assets/profile_image.cac,he.service';
import { AuthService } from 'src/app/configuration/services/auth.service';
import { AdminService } from 'src/app/admin/admin.service'; // Corrected import path
import { ImageService } from 'src/app/image.service'; // Corrected import path

@Component({
  selector: 'app-left-bar',
  templateUrl: './l,eft-bar.component.html',
  styleUrls: ['./lef,t-bar.component.css', './../../../styles.css',],
})

export class LeftBarComponent implements OnInit, AfterViewInit {
  // Declare component properties
  public data: any;
  isUserManagementExpanded: boolean = false;
  isTransactionsExpanded: boolean = false;
  isAnalyticsExpanded: boolean = false;
  isModificationsExpanded: boolean = false;
  isSpinnerLoading: boolean = false;

  activeIndex: number = 1;
  selectedImageSrc: any;

  // Inject required services
  constructor(
    private adminService: AdminService,
    private authService: AuthService,
    private router: Router,
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private imageService: ImageService,
    private profileImageCacheService: ProfileImageCacheService
  ) { }

  // Initialize component properties
  ngOnInit() {
    // Get stored collapse state from local storage
    const storedCollapse = localStorage.getItem('activeCollapse');
    if (storedCollapse !== null) {
      const parsedCollapse = JSON.parse(storedCollapse);

      const sidebar = this.elementRef.nativeElement.querySelector('nav');
      if (parsedCollapse === true) {
        this.renderer.addClass(sidebar, 'active');
      } else {
        this.renderer.removeClass(sidebar, 'active');
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
        const parsedValue = JSON.parse(localStorage.getItem(key) || 'false') as boolean;
        expandedItems[key] = parsedValue;
      }
    }

    this.isUserManagementExpanded = expandedItems.isUserManagementExpanded;
    this.isTransactionsExpanded = expandedItems.isTransactionsExpanded;
    this.isAnalyticsExpanded = expandedItems.isAnalyticsExpanded;
    this.isModificationsExpanded = expandedItems.isModificationsExpanded;
  }

  // Handle dropdown toggle
  toggleDropdown(index: number) {
    const properties: (keyof LeftBarComponent)[] = [
      'isUserManagementExpanded',
      'isTransactionsExpanded',
      'isAnalyticsExpanded',
      'isTransactionsExpanded',
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

  // Handle logout
  logOut() {
    this.authService.logout();
  }

  // Handle navigation
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

  // Handle panel visibility
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

  // Get profile image
  getProfileImage(id: number) {
    const cachedImage = this.profileImageCacheService.getProfileImage(id);
    if (cachedImage) {
      this.selectedImageSrc = cachedImage;
    } else {
      this.imageService.getOtherUserImageData(id).subscribe(
        (imageData: Blob) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const imageBlobData = reader.result as string;
            this.selectedImageSrc = imageBlobData;
            this.profileImageCacheService.cacheProfileImage(id, imageBlobData);
          };
          reader.readAsDataURL(imageData);
        }
      );
    }
  }
}

interface LeftBarComponentProps {
  isUserManagementExpanded: boolean;
 
