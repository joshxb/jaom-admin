import { Component, ElementRef, OnInit } from '@angular/core';
import { imageUrls } from 'src/app/app.component';
import { CacheService } from 'src/app/configuration/assets/cache.service';
import { TextService } from 'src/app/configuration/assets/text.service';
import { ValidationService } from 'src/app/configuration/assets/validation.service';
import { ModificationsService } from 'src/app/configuration/services/modifications/modifcations.service';
import { SettingsService } from 'src/app/configuration/services/settings/settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent implements OnInit {
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

  constructor(
    private elRef: ElementRef,
    private modificationsService: ModificationsService,
    private validationService: ValidationService,
    private settingsService: SettingsService,
    private cacheService: CacheService,
    private textService: TextService
  ) {}

  updateConfigurations(index: number) {
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
          return;
        }
        break;
      case 1:
        if (!this.modifiedAccountFirstName && !this.modifiedAccountLastName) {
          handleEmptyValue('There should be any changes!');
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
          return;
        }
        if (
          !this.validationService.isValidAge(
            this.textService.calculateAge(this.modifiedAccountAge)
          )
        ) {
          handleEmptyValue('Invalid age required!');
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
          return;
        }

        if (!this.validationService.isValidEmail(this.modifiedAccountEmail)) {
          handleEmptyValue('Invalid email address!');
          return;
        }
        data['email'] = this.modifiedAccountEmail;
        this.updateCachedAdminData('email', this.modifiedAccountEmail);
        name = 'Email Address';
        break;
      case 4:
        if (!this.modifiedAccountPhone) {
          handleEmptyValue('Phone number should not be empty!');
          return;
        }

        if (
          !this.validationService.isValidPhoneNumber(this.modifiedAccountPhone)
        ) {
          handleEmptyValue('Invalid phone number!');
          return;
        }
        data['phone'] = this.modifiedAccountPhone;
        this.updateCachedAdminData('phone', this.modifiedAccountPhone);
        name = 'Phone Number';
        break;
      case 5:
        if (!this.modifiedlocation) {
          handleEmptyValue('Location should not be empty!');
          return;
        }
        data['location'] = this.modifiedlocation;
        this.updateCachedAdminData('location', this.modifiedlocation);
        name = 'Location';
        break;

      default:
        return;
    }

    if (index === 0) {
      this.updateCachedAdminData(
        'theme',
        this.selectedTheme.toLowerCase().trim()
      );
      this.elRef.nativeElement.querySelector(
        '.update-dialog-message p'
      ).textContent = 'Theme change successfully!';

      setTimeout(() => {
        window.location.reload();
      }, 1000);

      return;
    }

    this.settingsService
      .updateOtherUserData(this.cacheService.getCachedAdminData('id'), data)
      .subscribe((res) => {
        this.elRef.nativeElement.querySelector(
          '.update-dialog-message'
        ).style.display = 'block';

        this.elRef.nativeElement.querySelector(
          '.update-dialog-message p'
        ).textContent = `${name} has been updated successfully!`;

        setTimeout(() => {
          window.location.reload();
        }, 1000);
      });
  }

  getCachedAdminData(name: string) {
    return this.cacheService.getCachedAdminData(name);
  }

  updateCachedAdminData(name: string, newValue: any) {
    this.cacheService.updateCachedAdminData(name, newValue);
  }

  ngOnInit(): void {}
}
