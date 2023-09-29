import { AfterViewInit, Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { imageUrls } from 'src/app/app.component';
import { ValidationService } from 'src/app/configuration/assets/validation.service';
import { UsersManagementService } from 'src/app/configuration/services/user-management/user.management.service';
import { ModalComponent } from '../../modal/modal.component';
import { TextService } from 'src/app/configuration/assets/text.service';
import { CacheService } from 'src/app/configuration/assets/cache.service';

@Component({
  selector: 'app-configurations',
  templateUrl: './configurations.component.html',
  styleUrls: ['./configurations.component.css']
})
export class ConfigurationsComponent implements OnInit, AfterViewInit {
  imageUrls = new imageUrls();

  searchTerm: string = '';
  usersData!: any;
  selectedUser: any;
  filteredUsers: any[] = [];
  initialNicknameBoolean: boolean = false;
  nicknameBoolean: boolean = false;
  isSpinnerLoading: boolean = false;

  currentPage = 1;
  itemsPerPage = 1;

  constructor(
    private usersManagementService: UsersManagementService,
    private router: Router,
    private route: ActivatedRoute,
    private elRef: ElementRef,
    private dialog: MatDialog,
    private validationService: ValidationService,
    private textService: TextService,
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private cacheService: CacheService
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

  openDialog(s: any, type: string) {
    const dialogRef = this.dialog.open(ModalComponent, {
      data: { content: `${s}`, level: type },
    });

    dialogRef.afterClosed().subscribe((result) => { });
  }

  ngOnInit(): void {
    const theme = this.cacheService.getCachedAdminData('theme');
    this.cacheService.themeChange(this.renderer, this.elRef.nativeElement, theme);

    this.route.queryParams.subscribe((params) => {
      if (params['page']) {
        this.currentPage = +params['page'];
      } else {
        this.currentPage = 1;
      }
      this.fetchUsersData(this.currentPage);
    });
  }

  fetchUsersData(page: number) {
    this.isSpinnerLoading = true;

    this.usersManagementService.getAllUserData(page).subscribe((res) => {
      this.isSpinnerLoading = false;
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
    this.isSpinnerLoading = true;

    this.selectedUser = user;
    this.usersManagementService
      .geSpecificUserData(user)
      .subscribe((response) => {
        const { data } = response;
        const modalOverlay =
          this.elRef.nativeElement.querySelector('.modal-overlay');

        const fieldsToUpdate = [
          {
            selector: '#defaultStatus',
            property: 'value',
            value: data?.status,
          },
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

        const checkBoxNickname =
          this.elRef.nativeElement.querySelector('#checkBoxNickname');

        const inputNickName =
          this.elRef.nativeElement.querySelector('#inputNickName');

        this.setNicknameBoolean(
          this.textService.getNicknameEnableAndDisable(data?.nickname),
          'change'
        );

        this.setNicknameBoolean(
          this.textService.getNicknameEnableAndDisable(data?.nickname),
          'primary'
        );

        checkBoxNickname.checked = this.getNicknameBoolean();
        inputNickName.disabled = !this.getNicknameBoolean();

        hiddenFullNickName.value = data?.nickname;
        modalOverlay.style.display = 'flex';
        this.isSpinnerLoading = false;
      });
  }

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
    this.isSpinnerLoading = true;

    const data: { [key: string]: string } = {};

    const fields = [
      { id: 'inputNickName', key: 'nickname', type: 'value' },
      { id: 'selectStatus', key: 'status', type: 'value' },
      { id: 'selectVisibility', key: 'visibility', type: 'value' },
    ];

    let changes = false;

    fields.forEach((field) => {
      const inputField = this.elRef.nativeElement.querySelector(`#${field.id}`);
      const fieldValue = inputField.value.trim();

      if (fieldValue !== '') {
        if (field.key == 'nickname') {
          const hiddenFullNickName = this.elRef.nativeElement.querySelector(
            '#hiddenFullNickName'
          ).value;

          const separators = '~!@#$%^&*()-=_+[]{}|;:,.<>?';

          data[field.key] = this.textService.setNickName(
            1,
            this.validationService.replaceNicknameFirstPart(
              hiddenFullNickName,
              separators,
              fieldValue
            ),
            this.getNicknameBoolean()
          );
        } else {
          data[field.key] =
            field.type === 'value' ? fieldValue : inputField.value;
        }

        changes = true;
      } else {
        if (field.key == 'nickname') {
          if (this.checkNicknameBooleanChange()) {
            const hiddenFullNickName = this.elRef.nativeElement.querySelector(
              '#hiddenFullNickName'
            ).value;

            data[field.key] = this.textService.setNickName(
              1,
              hiddenFullNickName,
              this.getNicknameBoolean()
            );

            changes = true;
          }
        }
      }
    });

    if (changes) {
      this.usersManagementService
        .updateOtherUserData(this.selectedUser, data)
        .subscribe(
          (res) => {
            this.isSpinnerLoading = false;

            const dialogMessage = this.elRef.nativeElement.querySelector(
              '.update-dialog-message'
            );
            dialogMessage.style.display = 'block';

            setTimeout(() => {
              window.location.reload();
            }, 2000);
          },
          (error) => { }
        );
    } else {
      this.isSpinnerLoading = false;
      const noChangesTxt =
        this.elRef.nativeElement.querySelector('.no-changes-txt');
      noChangesTxt.style.display = 'block';
    }
  }

  toggleNicknameEnabledDisabled() {
    this.isSpinnerLoading = true;

    setTimeout(() => {
      this.isSpinnerLoading = false;
      const toggleNicknameBolean = !this.getNicknameBoolean();
      this.setNicknameBoolean(toggleNicknameBolean, 'change');

      const inputNickName =
        this.elRef.nativeElement.querySelector('#inputNickName');

      inputNickName.value = '';
      inputNickName.disabled = !this.getNicknameBoolean();
    }, 500);
  }

  setNicknameBoolean(boolean: boolean, selection: string) {
    if (selection == 'change') {
      this.nicknameBoolean = boolean;
    } else if (selection == 'primary') {
      this.initialNicknameBoolean = boolean;
    }
  }

  getNicknameBoolean(): boolean {
    return this.nicknameBoolean;
  }

  checkNicknameBooleanChange(): boolean {
    return this.initialNicknameBoolean != this.getNicknameBoolean();
  }
}
