import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { AfterViewInit, Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { imageUrls } from 'src/app/app.component';
import { ValidationService } from 'src/app/configuration/assets/validation.service';
import { ModificationsService } from 'src/app/configuration/services/modifications/modifcations.service';
import { UsersManagementService } from 'src/app/configuration/services/user-management/user.management.service';

@Component({
  selector: 'app-contact-details',
  templateUrl: './contact-details.component.html',
  styleUrls: ['./contact-details.component.css']
})
export class ContactDetailsComponent implements OnInit, AfterViewInit {
  imageUrls = new imageUrls();

  searchTerm: string = '';
  userHistoryData!: any;
  selectedUser: any;
  filteredUserHistory: any[] = [];

  currentPage = 1;
  itemsPerPage = 1;

  modificationsData: any = null;
  phoneNumber: any = null;
  emailAddress: any = null;
  modifiedEmailAddress: string = '';
  modifiedPhoneNumber: string = '';

  constructor(
    private usersManagementService: UsersManagementService,
    private router: Router,
    private route: ActivatedRoute,
    private elRef: ElementRef,
    private modificationsService: ModificationsService,
    private validationService: ValidationService,
    private renderer: Renderer2,
    private elementRef: ElementRef,
  ) {}

  ngAfterViewInit() {
    const scb = this.elementRef.nativeElement.querySelector(
      '#sidebarCollapseBtn'
    );
    this.renderer.listen(scb, 'click', () => {
      const sidebar = this.elementRef.nativeElement.querySelector('#sidebar');
      if (sidebar) {
        if (sidebar.classList.contains('active')) {
          this.renderer.removeClass(sidebar, 'active');
        } else {
          this.renderer.addClass(sidebar, 'active');
        }
      }
    });
  }

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
    const contactDetailsbject = JSON.parse(data.contact_details_object);

    return contactDetailsbject[option] || null;
  }

  updateConfigurations(index: number) {
    if (!this.modificationsData) {
      return;
    }

    const data = { ...this.modificationsData };
    const contactDetails = JSON.parse(data.contact_details_object);

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
        if (!this.modifiedPhoneNumber) {
          handleEmptyValue(
            'modifiedAccountNumber',
            'Phone number should not be empty!'
          );
          return;
        } else {
          if (
            !this.validationService.isValidPhoneNumber(this.modifiedPhoneNumber)
          ) {
            handleEmptyValue('modifiedAccountNumber', 'Invalid phone number!');
            return;
          }
        }

        contactDetails.phone_number = this.modifiedPhoneNumber.trim();
        data.contact_details_object = JSON.stringify(contactDetails);
        break;
      case 1:
        if (!this.modifiedEmailAddress) {
          handleEmptyValue(
            'modifiedAccountNumber',
            'Email Address should not be empty!'
          );
          return;
        } else if (!this.validationService.isValidEmail(this.modifiedEmailAddress.trim())) {
          handleEmptyValue('modifiedAccountNumber', 'Invalid email address!');
          return;
        };

        contactDetails.email_address = this.modifiedEmailAddress.trim();
        data.contact_details_object = JSON.stringify(contactDetails);
        break;
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
      this.phoneNumber = this.getParseConfigurations(res, 'phone_number');
      this.emailAddress = this.getParseConfigurations(res, 'email_address');
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
