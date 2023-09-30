import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  Renderer2,
} from '@angular/core';
import { Ng2ImgMaxService } from 'ng2-img-max';
import { imageUrls } from 'src/app/app.component';
import { CacheService } from 'src/app/configuration/assets/cache.service';
import { TextService } from 'src/app/configuration/assets/text.service';
import { ValidationService } from 'src/app/configuration/assets/validation.service';
import { Base, Redirects } from 'src/app/configuration/configuration.component';
import { AdminService } from 'src/app/configuration/services/pages/admin.service';
import { SettingsService } from 'src/app/configuration/services/settings/settings.service';
import { UsersManagementService } from 'src/app/configuration/services/user-management/user.management.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent implements OnInit, AfterViewInit {
  imageUrls = new imageUrls();
  selectedUser: any;
  public data: any;

  selectedTheme: string = '';
  modifiedAccountFirstName: string = '';
  modifiedAccountLastName: string = '';
  modifiedAccountAge: any = null;
  modifiedAccountEmail: any = null;
  modifiedAccountPhone: any = null;
  modifiedlocation: any = null;
  modifiedAccountNewPass: any = null;
  modifiedAccountConfirmPass: any = null;
  isSpinnerLoading: boolean = false;
  selectedImageSrc: string | ArrayBuffer | null = this.imageUrls.user_default;
  selectedImageFile!: File;
  base = new Base();
  private baseUrl = this.base.baseUrl;

  constructor(
    private elRef: ElementRef,
    private validationService: ValidationService,
    private settingsService: SettingsService,
    private cacheService: CacheService,
    private textService: TextService,
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private usersManagementService: UsersManagementService,
    private adminService: AdminService,
    private ng2ImgMax: Ng2ImgMaxService
  ) { }

  ngAfterViewInit() {
    const scb = this.elementRef.nativeElement.querySelector(
      '#sidebarCollapseBtn'
    );
    this.renderer.listen(scb, 'click', () => {
      const sidebar = this.elementRef.nativeElement.querySelector('#sidebar');
      if (sidebar) {
        if (sidebar.classList.contains('active')) {
          this.renderer.removeClass(sidebar, 'active');
          localStorage.setItem('activeCollapse', JSON.stringify(false));
        } else {
          this.renderer.addClass(sidebar, 'active');
          localStorage.setItem('activeCollapse', JSON.stringify(true));
        }
      }
    });
  }

  updateConfigurations(index: number) {
    this.isSpinnerLoading = true;
    const handleEmptyValue = (errorMessage: string) => {
      const element = this.elRef.nativeElement.querySelector(
        '.info-dialog-message'
      );
      element.textContent = errorMessage;
      element.style.display = 'block';

      setTimeout(() => {
        element.style.display = 'none';
      }, 2000);
    };

    const data: { [key: string]: string } = {};
    let name = '';
    switch (index) {
      case 0:
        if (!this.selectedTheme) {
          handleEmptyValue('Theme background should be selected!');
          this.isSpinnerLoading = false;
          return;
        }
        break;
      case 1:
        if (!this.modifiedAccountFirstName && !this.modifiedAccountLastName) {
          handleEmptyValue('There should be any changes!');
          this.isSpinnerLoading = false;
          return;
        }

        if (this.modifiedAccountFirstName) {
          data['firstname'] = this.modifiedAccountFirstName;
          this.updateCachedAdminData(
            'firstname',
            this.modifiedAccountFirstName
          );
        }
        if (this.modifiedAccountLastName) {
          data['lastname'] = this.modifiedAccountLastName;
          this.updateCachedAdminData('lastname', this.modifiedAccountLastName);
        }

        name = 'Account name';
        break;
      case 2:
        if (!this.modifiedAccountAge) {
          handleEmptyValue('Age should not be empty!');
          this.isSpinnerLoading = false;
          return;
        }
        if (
          !this.validationService.isValidAge(
            this.textService.calculateAge(this.modifiedAccountAge)
          )
        ) {
          handleEmptyValue('Invalid age required!');
          this.isSpinnerLoading = false;
          return;
        }
        data['age'] = this.textService
          .calculateAge(this.modifiedAccountAge)
          .toString();
        this.updateCachedAdminData(
          'age',
          this.textService.calculateAge(this.modifiedAccountAge)
        );
        name = 'Age';
        break;
      case 3:
        if (!this.modifiedAccountEmail) {
          handleEmptyValue('Email should not be empty!');
          this.isSpinnerLoading = false;
          return;
        }

        if (!this.validationService.isValidEmail(this.modifiedAccountEmail)) {
          handleEmptyValue('Invalid email address!');
          this.isSpinnerLoading = false;
          return;
        }
        data['email'] = this.modifiedAccountEmail;
        this.updateCachedAdminData('email', this.modifiedAccountEmail);
        name = 'Email Address';
        break;
      case 4:
        if (!this.modifiedAccountPhone) {
          handleEmptyValue('Phone number should not be empty!');
          this.isSpinnerLoading = false;
          return;
        }

        if (
          !this.validationService.isValidPhoneNumber(this.modifiedAccountPhone)
        ) {
          handleEmptyValue('Invalid phone number!');
          this.isSpinnerLoading = false;
          return;
        }
        data['phone'] = this.modifiedAccountPhone;
        this.updateCachedAdminData('phone', this.modifiedAccountPhone);
        name = 'Phone Number';
        break;
      case 5:
        if (!this.modifiedlocation) {
          handleEmptyValue('Location should not be empty!');
          this.isSpinnerLoading = false;
          return;
        }
        data['location'] = this.modifiedlocation;
        this.updateCachedAdminData('location', this.modifiedlocation);
        name = 'Location';
        break;
      case 6:
        if (!this.modifiedAccountNewPass) {
          handleEmptyValue('New password is required!');
          this.isSpinnerLoading = false;
          return;
        }

        if (this.modifiedAccountNewPass.length < 5) {
          handleEmptyValue('Password must have at least 6 characters!');
          this.isSpinnerLoading = false;
          return;
        }

        if (!this.modifiedAccountConfirmPass) {
          handleEmptyValue('Password confirmation is required!');
          this.isSpinnerLoading = false;
          return;
        }

        if (
          !this.validationService.isPasswordsMatch(
            this.modifiedAccountNewPass,
            this.modifiedAccountConfirmPass
          )
        ) {
          handleEmptyValue('Password does not match!');
          this.isSpinnerLoading = false;
          return;
        }
        data['password'] = this.modifiedAccountNewPass;
        this.updateCachedAdminData('password', this.modifiedAccountNewPass);
        name = 'password';
        break;
      default:
        this.isSpinnerLoading = false;
        return;
    }

    if (index === 0) {
      this.updateCachedAdminData(
        'theme',
        this.selectedTheme.toLowerCase().trim()
      );

      setTimeout(() => {
        this.isSpinnerLoading = false;
        this.elRef.nativeElement.querySelector(
          '.update-dialog-message'
        ).style.display = 'block';
        this.elRef.nativeElement.querySelector(
          '.update-dialog-message'
        ).textContent = 'Theme change successfully!';
      }, 1000);

      setTimeout(() => {
        window.location.reload();
      }, 2000);
      return;
    }

    this.settingsService
      .updateOtherUserData(this.cacheService.getCachedAdminData('id'), data)
      .subscribe((res) => {
        this.isSpinnerLoading = false;
        this.elRef.nativeElement.querySelector(
          '.update-dialog-message'
        ).style.display = 'block';

        this.elRef.nativeElement.querySelector(
          '.update-dialog-message p'
        ).textContent = `${name} has been updated successfully!`;

        setTimeout(() => {
          window.location.reload();
        }, 2000);
      });
  }

  getCachedAdminData(name: string) {
    return this.cacheService.getCachedAdminData(name);
  }

  updateCachedAdminData(name: string, newValue: any) {
    this.cacheService.updateCachedAdminData(name, newValue);
  }

  ngOnInit(): void {
    const theme = this.getCachedAdminData('theme');
    this.cacheService.themeChange(
      this.renderer,
      this.elRef.nativeElement,
      theme
    );

    const cookieKey = 'userAdminData'; // Define a cookie key
    const cachedData = localStorage.getItem(cookieKey);
    if (cachedData) {
      try {
        this.data = JSON.parse(cachedData); // Parse the JSON string into an array
        this.elRef.nativeElement.querySelector('.profile-image').src =
          'data:image/jpeg;base64,' + this.data?.image_blob;
        this.selectedUser = this.data?.id;
      } catch (error) {
        console.error('Error parsing cached data:', error);
      }
    } else {
      this.adminService.getUserData().subscribe(
        (response) => {
          if (response?.type === 'admin') {
            this.data = response;
            this.elRef.nativeElement.querySelector('.profile-image').src =
              'data:image/jpeg;base64,' + this.data?.image_blob;
            this.selectedUser = this.data?.id;
            localStorage.setItem(cookieKey, this.data);
          } else {
            this.redirectToUserPage();
          }
        },
        () => {
          this.redirectToUserPage();
        }
      );
    }
  }

  onImageChange(event: any): void {
    const file = event.target.files[0];
    const invalidImage =
      this.elRef.nativeElement.querySelector('.invalid-image');
    if (file) {
      if (this.isImageFileValid(file)) {
        this.readImage(file);
        invalidImage.style.display = 'none';
      } else {
        setTimeout(() => {
          this.isSpinnerLoading = false;
          invalidImage.style.display = 'block';
        }, 1000);
      }
    } else {
      this.isSpinnerLoading = false;
      this.elRef.nativeElement.querySelector('.profile-image').src =
        this.imageUrls.user_default;
    }
  }

  isImageFileValid(file: File): boolean {
    const allowedFormats = ['image/jpeg', 'image/png'];
    return allowedFormats.includes(file.type);
  }

  readImage(file: File): void {
    this.isSpinnerLoading = true;

    const reader = new FileReader();
    reader.onload = (event: any) => {
      this.elRef.nativeElement.querySelector('.profile-image').src =
        event.target.result;

      this.selectedImageFile = file;
      this.ng2ImgMax.compressImage(this.selectedImageFile, 0.05).subscribe(
        (result) => {
          const cookieKey = 'userAdminData'; // Define a cookie key
          localStorage.removeItem(cookieKey);
          this.processImage(result);
        },
        (error) => {
          this.isSpinnerLoading = false;
        }
      );
    };
    reader.readAsDataURL(file);
  }

  processImage(image: File) {
    const compressedFile = new File([image], image.name, {
      type: image.type,
    });

    const formData: FormData = new FormData();
    formData.append('image', compressedFile);

    this.usersManagementService
      .updateOtherUserImageData(formData, this.selectedUser)
      .subscribe((result) => {
        this.isSpinnerLoading = false;
        this.elRef.nativeElement.querySelector('.app-spinner-loading')
        .style.display = "none";
        const dialogMessage = this.elRef.nativeElement.querySelector(
          '.update-dialog-message'
        );
        dialogMessage.textContent = 'Profile image updated successfully';
        dialogMessage.style.display = 'block';

        setTimeout(() => {
          window.location.reload();
        }, 2000);
      });
  }

  private redirectToUserPage(): void {
    if (this.baseUrl === Redirects.localServerUrl) {
      window.location.href = Redirects.localUserUrl;
    } else {
      window.location.href = Redirects.deployUserUrl;
    }
  }
}
