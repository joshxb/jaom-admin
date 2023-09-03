import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { Component, ElementRef, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { imageUrls } from 'src/app/app.component';
import { ValidationService } from 'src/app/configuration/assets/validation.service';
import { ModificationsService } from 'src/app/configuration/services/modifications/modifcations.service';
import { UsersManagementService } from 'src/app/configuration/services/user-management/user.management.service';

@Component({
  selector: 'app-donations-info',
  templateUrl: './donations-info.component.html',
  styleUrls: ['./donations-info.component.css'],
  animations: [
    trigger('modalAnimation', [
      state(
        'active',
        style({
          transform: 'translateY(0)',
          opacity: 1,
        })
      ),
      transition('void => active', [
        style({
          transform: 'translateY(-20px)',
          opacity: 0,
        }),
        animate('300ms ease'),
      ]),
    ]),
  ],
})
export class DonationsInfoComponent implements OnInit {
  imageUrls = new imageUrls();

  searchTerm: string = '';
  userHistoryData!: any;
  selectedUser: any;
  filteredUserHistory: any[] = [];

  currentPage = 1;
  itemsPerPage = 1;

  paymentMethods!: any;
  primaryMethod: any = null;
  modificationsData: any = null;
  accountName: any = null;
  accountNumber: any = null;
  selectedBankType: string = '';
  modifiedAccountName: string = '';
  modifiedAccountNumber: string = '';

  constructor(
    private usersManagementService: UsersManagementService,
    private router: Router,
    private route: ActivatedRoute,
    private elRef: ElementRef,
    private modificationsService: ModificationsService,
    private validationService: ValidationService
  ) {}

  applySearchFilter() {
    if (!this.searchTerm) {
      this.filteredUserHistory = this.userHistoryData?.data;
    } else {
      this.filteredUserHistory = this.userHistoryData?.data.filter(
        (user: { [s: string]: unknown } | ArrayLike<unknown>) =>
          Object.values(user).some((value) => {
            if (typeof value === 'string') {
              return value
                .toLowerCase()
                .includes(this.searchTerm.toLowerCase());
            } else if (typeof value === 'number') {
              return value == Number(this.searchTerm.toLowerCase());
            }
            return false;
          })
      );
    }
  }

  getParseConfigurations(value: any, option: string) {
    const { data } = value;
    const donationInfoObject = JSON.parse(data.donation_info_object);
    const bankType = donationInfoObject?.bank_type;

    if (option === 'methods') {
      return Object.keys(bankType).map((key) => key.toLowerCase());
    } else if (option === 'primary' || option === 'secondary') {
      const foundKey = Object.keys(bankType).find(
        (key) => bankType[key].toLowerCase() === option
      );
      return foundKey || null;
    } else {
      return donationInfoObject[option] || null;
    }

    return null;
  }

  updateConfigurations(index: number) {
    if (!this.modificationsData) {
      return;
    }

    const data = { ...this.modificationsData };
    const contactDetails = JSON.parse(data.donation_info_object);

    const handleEmptyValue = (key: string, errorMessage: string) => {
      const element = this.elRef.nativeElement.querySelector(
        '.info-dialog-message'
      );
      element.textContent = errorMessage;
      element.style.display = 'block';

      setTimeout(() => {
        element.style.display = 'none';
      }, 2000);
    };

    switch (index) {
      case 0:
        if (!this.selectedBankType) {
          handleEmptyValue('selectedBankType', 'Bank type should be selected!');
          return;
        }

        for (const key in contactDetails.bank_type) {
          if (contactDetails.bank_type.hasOwnProperty(key)) {
            contactDetails.bank_type[key] =
              key === this.selectedBankType ? 'primary' : 'secondary';
          }
        }
        data.donation_info_object = JSON.stringify(contactDetails);
        break;

      case 1:
        if (!this.modifiedAccountName) {
          handleEmptyValue(
            'modifiedAccountName',
            'Account name should not be empty!'
          );
          return;
        }

        if (this.modifiedAccountName.trim().length <= 5) {
          handleEmptyValue(
            'modifiedAccountName',
            'Must have at least 6 characters!'
          );
          return;
        }

        contactDetails.account_name = this.modifiedAccountName;
        data.donation_info_object = JSON.stringify(contactDetails);
        break;

      case 2:
        if (!this.modifiedAccountNumber) {
          handleEmptyValue(
            'modifiedAccountNumber',
            'Account number should not be empty!'
          );
          return;
        }

        if (
          !this.validationService.isValidPhoneNumber(this.modifiedAccountNumber)
        ) {
          handleEmptyValue('modifiedAccountNumber', 'Invalid phone number!');
          return;
        }

        contactDetails.account_number = this.modifiedAccountNumber;
        data.donation_info_object = JSON.stringify(contactDetails);
        break;

      default:
        return;
    }

    this.modificationsService.updateConfigurations(data).subscribe((res) => {
      this.elRef.nativeElement.querySelector(
        '.update-dialog-message'
      ).style.display = 'block';

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    });
  }

  ngOnInit(): void {
    this.modificationsService.getConfigurations().subscribe((res) => {
      this.modificationsData = res?.data;
      this.paymentMethods = this.getParseConfigurations(res, 'methods');
      this.primaryMethod = this.getParseConfigurations(res, 'primary');
      this.accountName = JSON.parse(
        this.modificationsData?.donation_info_object
      )?.account_name;
      this.accountNumber = JSON.parse(
        this.modificationsData?.donation_info_object
      )?.account_number;
    });

    this.route.queryParams.subscribe((params) => {
      if (params['page']) {
        this.currentPage = +params['page'];
      } else {
        this.currentPage = 1;
      }
      this.fetchUserHistoryData(this.currentPage);
    });
  }

  fetchUserHistoryData(page: number) {
    this.usersManagementService.getUserHistoryData(page).subscribe((res) => {
      this.userHistoryData = res;
      this.filteredUserHistory = this.userHistoryData?.data;
    });
  }

  getPages(): number[] {
    const totalPages = this.userHistoryData?.last_page || 0;
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  getCurrentPageEnd(): number {
    return Math.ceil(
      this.userHistoryData?.total / this.userHistoryData?.per_page
    );
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.fetchUserHistoryData(page);

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: this.currentPage },
      queryParamsHandling: 'merge',
    });
  }

  getStartingIndex(): number {
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  getPageRange(): number[] {
    const totalPages = this.userHistoryData?.last_page || 0;
    const displayedPages = Math.min(totalPages, 5);
    const startPage = Math.max(
      this.currentPage - Math.floor(displayedPages / 2),
      1
    );
    const endPage = Math.min(startPage + displayedPages - 1, totalPages);
    return Array.from(
      { length: endPage - startPage + 1 },
      (_, index) => startPage + index
    );
  }

  deleteSpecificUserHistory(id: any) {
    this.usersManagementService.deleteUserHistory(id).subscribe((res) => {
      const deleteDialogMessage = this.elRef.nativeElement.querySelector(
        '.delete-dialog-message'
      );
      deleteDialogMessage.style.display = 'block';

      setTimeout(() => {
        window.location.reload();
      }, 2000);
    });
  }
}
