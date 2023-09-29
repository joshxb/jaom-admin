import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  Renderer2,
} from '@angular/core';
import { imageUrls } from 'src/app/app.component';
import { CacheService } from 'src/app/configuration/assets/cache.service';
import { TextService } from 'src/app/configuration/assets/text.service';
import { ValidationService } from 'src/app/configuration/assets/validation.service';
import { SettingsService } from 'src/app/configuration/services/settings/settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent implements OnInit, AfterViewInit {
  imageUrls = new imageUrls();
  selectedUser: any;

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

  constructor(
    private elRef: ElementRef,
    private validationService: ValidationService,
    private settingsService: SettingsService,
    private cacheService: CacheService,
    private textService: TextService,
    private renderer: Renderer2,
    private elementRef: ElementRef
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
    this.cacheService.themeChange(this.renderer, this.elRef.nativeElement, theme);
  }
}
