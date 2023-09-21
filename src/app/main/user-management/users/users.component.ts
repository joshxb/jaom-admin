import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { AfterViewInit, Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { imageUrls } from 'src/app/app.component';
import { UsersManagementService } from 'src/app/configuration/services/user-management/user.management.service';
import { ModalComponent } from '../../modal/modal.component';
import { Ng2ImgMaxService } from 'ng2-img-max';
import { ValidationService } from 'src/app/configuration/assets/validation.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit, AfterViewInit {
  imageUrls = new imageUrls();

  searchTerm: string = '';
  usersData!: any;
  selectedUser: any;
  filteredUsers: any[] = [];

  currentPage = 1;
  itemsPerPage = 1;

  constructor(
    private usersManagementService: UsersManagementService,
    private router: Router,
    private route: ActivatedRoute,
    private elRef: ElementRef,
    private dialog: MatDialog,
    private ng2ImgMax: Ng2ImgMaxService,
    private validationService: ValidationService,
    private renderer: Renderer2,
    private elementRef: ElementRef
  ) {}

  openDialog(s: any, type: string) {
    const dialogRef = this.dialog.open(ModalComponent, {
      data: { content: `${s}`, level: type },
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['page']) {
        this.currentPage = +params['page'];
      } else {
        this.currentPage = 1;
      }
      this.fetchUsersData(this.currentPage);
    });
  }

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
      this.filteredUsers = this.usersData?.data;
    } else {
      this.filteredUsers = this.usersData?.data.filter(
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

  fetchUsersData(page: number) {
    this.usersManagementService.getAllUserData(page).subscribe((res) => {
      this.usersData = res[0];
      this.filteredUsers = this.usersData?.data;
    });
  }

  getPages(): number[] {
    const totalPages = this.usersData?.last_page || 0;
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  getCurrentPageEnd(): number {
    return Math.ceil(this.usersData?.total / this.usersData?.per_page);
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.fetchUsersData(page);

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
    const totalPages = this.usersData?.last_page || 0;
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

  openEditModal(user: any) {
    this.selectedUser = user;
    this.usersManagementService
      .geSpecificUserData(user)
      .subscribe((response) => {
        const { data } = response;
        const modalOverlay =
          this.elRef.nativeElement.querySelector('.modal-overlay');

        const fieldsToUpdate = [
          {
            selector: '.profile-image',
            property: 'src',
            value: data?.image_blob
              ? 'data:image/jpeg;base64,' + data?.image_blob
              : this.imageUrls.user_default,
          },
          {
            selector: '#defaultFirstName',
            property: 'value',
            value: data?.firstname,
          },
          {
            selector: '#defaultLastName',
            property: 'value',
            value: data?.lastname,
          },
          { selector: '#defaultAge', property: 'value', value: data?.age },
          { selector: '#defaultEmail', property: 'value', value: data?.email },
          { selector: '#defaultPhone', property: 'value', value: data?.phone },
          {
            selector: '#defaultLocation',
            property: 'value',
            value: data?.location,
          },
          {
            selector: '#defaultStatus',
            property: 'value',
            value: data?.status,
          },
          { selector: '#defaultRole', property: 'value', value: data?.type },
          {
            selector: '#defaultVisiblity',
            property: 'value',
            value: data?.visibility,
          },
        ];

        fieldsToUpdate.forEach((field) => {
          const element = this.elRef.nativeElement.querySelector(
            field.selector
          );
          if (element) {
            element[field.property] = field.value;
          }
        });

        // Extract real nickname using custom function
        const realNickname = this.extractRealNickname(
          data?.nickname,
          '~!@#$%^&*()-=_+[]{}|;:,.<>?'
        );
        const defaultNickName =
          this.elRef.nativeElement.querySelector('#defaultNickName');
        if (defaultNickName) {
          defaultNickName.value = realNickname;
        }

        const hiddenFullNickName = this.elRef.nativeElement.querySelector(
          '#hiddenFullNickName'
        );

        hiddenFullNickName.value = data?.nickname;

        modalOverlay.style.display = 'flex';
      });
  }

  deleteSpecificUser(user: any) {
    this.usersManagementService.deleteSpecificUser(user).subscribe((res) => {
      const deleteDialogMessage = this.elRef.nativeElement.querySelector(
        '.delete-dialog-message'
      );
      deleteDialogMessage.style.display = 'block';

      setTimeout(() => {
        window.location.reload();
      }, 2000);
    });
  }

  // Custom function to extract real nickname
  extractRealNickname(nickname: string, separator: string): string {
    const parts = nickname.split(separator);
    return parts[0];
  }

  closeEditModal() {
    const modalOverlay =
      this.elRef.nativeElement.querySelector('.modal-overlay');

    modalOverlay.style.display = 'none';
  }

  selectedImageSrc: string | ArrayBuffer | null = this.imageUrls.user_default;
  selectedImageFile!: File;

  onImageChange(event: any): void {
    const file = event.target.files[0];

    const invalidImage =
      this.elRef.nativeElement.querySelector('.invalid-image');
    if (file) {
      if (this.isImageFileValid(file)) {
        this.readImage(file);
        invalidImage.style.display = 'none';
        this.selectedImageFile = file;
      } else {
        invalidImage.style.display = 'block';
        // this.openDialog("Invalid Image Format", "success");
      }
    } else {
      this.selectedImageSrc = this.imageUrls.user_default;
    }
  }

  isImageFileValid(file: File): boolean {
    const allowedFormats = ['image/jpeg', 'image/png'];
    return allowedFormats.includes(file.type);
  }

  readImage(file: File): void {
    const reader = new FileReader();
    reader.onload = (event: any) => {
      this.selectedImageSrc = event.target.result;
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
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      });
  }

  updateUserData() {
    const data: { [key: string]: string } = {};

    const fields = [
      { id: 'inputFirstName', key: 'firstname', type: 'value' },
      { id: 'inputLastName', key: 'lastname', type: 'value' },
      { id: 'inputNickName', key: 'nickname', type: 'value' },
      { id: 'inputAge', key: 'age', type: 'value' },
      { id: 'inputEmail', key: 'email', type: 'value' },
      { id: 'inputPhone', key: 'phone', type: 'value' },
      { id: 'inputLocation', key: 'location', type: 'value' },
    ];

    let changes = false;

    if (this.selectedImageFile) {
      changes = true;
    }

    fields.forEach((field) => {
      const inputField = this.elRef.nativeElement.querySelector(`#${field.id}`);
      const fieldValue = inputField.value.trim();

      if (fieldValue !== '') {
        if (field.key == 'email') {
          if (!this.validationService.isValidEmail(fieldValue)) {
            const noChangesTxt =
              this.elRef.nativeElement.querySelector('.no-changes-txt');
            noChangesTxt.textContent = 'Invalid Email Address';
            noChangesTxt.style.display = 'block';
            return;
          }
        }
        if (field.key == 'phone') {
          if (!this.validationService.isValidPhoneNumber(fieldValue)) {
            const noChangesTxt =
              this.elRef.nativeElement.querySelector('.no-changes-txt');
            noChangesTxt.textContent = 'Invalid Phone Number';
            noChangesTxt.style.display = 'block';
            return;
          }
        }
        if (field.key == 'age') {
          if (!this.validationService.isValidAge(fieldValue)) {
            const noChangesTxt =
              this.elRef.nativeElement.querySelector('.no-changes-txt');
            noChangesTxt.textContent =
              'Age must have at least between 18 and 100';
            noChangesTxt.style.display = 'block';
            return;
          }
        }

        changes = true;

        if (field.key == 'nickname') {
          const hiddenFullNickName = this.elRef.nativeElement.querySelector(
            '#hiddenFullNickName'
          ).value;

          const separators = '~!@#$%^&*()-=_+[]{}|;:,.<>?';
          data[field.key] = this.validationService.replaceNicknameFirstPart(
            hiddenFullNickName,
            separators,
            fieldValue
          );
        } else {
          data[field.key] =
            field.type === 'value' ? fieldValue : inputField.value;
        }
      }
    });

    if (changes) {
      this.usersManagementService
        .updateOtherUserData(this.selectedUser, data)
        .subscribe(
          (res) => {
            if (this.selectedImageFile) {
              this.ng2ImgMax
                .compressImage(this.selectedImageFile, 0.05)
                .subscribe(
                  (result) => {
                    const dialogMessage =
                      this.elRef.nativeElement.querySelector(
                        '.update-dialog-message'
                      );
                    dialogMessage.style.display = 'block';

                    this.processImage(result);
                  },
                  (error) => {}
                );
            } else {
              const dialogMessage = this.elRef.nativeElement.querySelector(
                '.update-dialog-message'
              );
              dialogMessage.style.display = 'block';

              setTimeout(() => {
                window.location.reload();
              }, 2000);
            }
          },
          (error) => {}
        );
    } else {
      const noChangesTxt =
        this.elRef.nativeElement.querySelector('.no-changes-txt');
      noChangesTxt.style.display = 'block';
    }
  }
}
