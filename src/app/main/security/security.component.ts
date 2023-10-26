import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { imageUrls } from 'src/app/app.component';
import { ModalComponent } from '../modal/modal.component';
import { SecurityControlService } from 'src/app/configuration/services/security-control/security-control.service';
import { ImageService } from 'src/app/configuration/assets/image.service';
import { ImageService as RoomImageService  } from 'src/app/configuration/services/pages/image.service';
import { CacheService } from 'src/app/configuration/assets/cache.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.css'],
})
export class SecurityComponent implements OnInit, AfterViewInit {
  imageUrls = new imageUrls();

  uploadedImageUrl: string | ArrayBuffer | null =
    this.imageUrls.default_upload_img;
  selectedImage!: any;

  uploadedImageUrl2: string | ArrayBuffer | null =
    this.imageUrls.default_upload_img;

  searchTerm: string = '';
  roomListData!: any;
  selectedUser: any;
  selectedRoomId!: number;
  filteredRoomListData: any[] = [];
  textareaValues: string[] = [];
  isSpinnerLoading: boolean = false;

  currentPage = 1;
  itemsPerPage = 1;
  roomName: string = '';
  modificationsData: any;
  loginMethods: any;
  autoAddRoom: Boolean = false;
  primaryLogInMethod: any;
  primaryDeactivationPeriodMethod!: any;
  newLogInMethod: string = '';
  newDeactivationPeriod: string = '';
  selectedRoomName: string = '';
  modifiedRoomName: string = '';

  showConfirmationModal = false;
  chatToDeleteId!: number;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private elRef: ElementRef,
    private dialog: MatDialog,
    private securityControlService: SecurityControlService,
    private imageService: ImageService,
    private roomImageService: RoomImageService,
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private cacheService: CacheService
  ) {}

  openConfirmationModal(chat_id: number) {
    this.isSpinnerLoading = true;
    setTimeout(() => {
      this.isSpinnerLoading = false;
      this.chatToDeleteId = chat_id;
      this.showConfirmationModal = true;
    }, 1000);
  }

  closeConfirmationModal() {
    this.showConfirmationModal = false;
  }

  confirmDelete() {
    this.deleteDefaultRoom(this.chatToDeleteId);
    this.closeConfirmationModal();
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
          localStorage.setItem('activeCollapse', JSON.stringify(false));
        } else {
          this.renderer.addClass(sidebar, 'active');
          localStorage.setItem('activeCollapse', JSON.stringify(true));
        }
      }
    });
  }

  onFileSelected(event: any, index: number) {
    const file: File = event.target.files[0];
    this.selectedImage = file;

    const reader = new FileReader();
    reader.onload = () => {
      if (index === 1) {
        this.uploadedImageUrl = reader.result;
      } else {
        this.uploadedImageUrl2 = reader.result;
      }
    };
    reader.readAsDataURL(this.selectedImage);
  }

  uploadImage() {
    if (this.selectedImage) {
      this.uploadedImageUrl = null;
    }
  }

  applySearchFilter() {
    if (!this.searchTerm) {
      this.filteredRoomListData = this.roomListData?.data;
    } else {
      this.filteredRoomListData = this.roomListData?.data.filter(
        (chat: { [s: string]: unknown } | ArrayLike<unknown>) =>
          Object.values(chat).some((value) => {
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

    dialogRef.afterClosed().subscribe((result) => {});
  }

  getParseConfigurations(value: any, option: string) {
    const { data } = value;
    const loginCredsObject = JSON.parse(data.login_credentials);
    const accountDeactiveObject = JSON.parse(data.account_deactivation);

    if (option === 'login-primary') {
      const trueKeys = Object.keys(loginCredsObject).filter(
        (key) => loginCredsObject[key] === true
      );
      return trueKeys[0];
    } else if (option === 'account-deactivation') {
      const trueKeys = Object.keys(accountDeactiveObject).filter(
        (key) => accountDeactiveObject[key] === true
      );
      return trueKeys[0];
    }
    return null;
  }

  ngOnInit(): void {
    const theme = this.cacheService.getCachedAdminData('theme');
    this.cacheService.themeChange(
      this.renderer,
      this.elRef.nativeElement,
      theme
    );

    this.securityControlService.getConfigurations().subscribe((res) => {
      this.modificationsData = res?.data;
      this.autoAddRoom = this.modificationsData?.auto_add_room === 1;
      this.primaryLogInMethod = this.getParseConfigurations(
        res,
        'login-primary'
      );
      this.primaryDeactivationPeriodMethod = this.getParseConfigurations(
        res,
        'account-deactivation'
      );
    });

    this.route.queryParams.subscribe((params) => {
      if (params['page']) {
        this.currentPage = +params['page'];
      } else {
        this.currentPage = 1;
      }
      this.fetchRoomListData(this.currentPage);
    });
  }

  fetchRoomListData(page: number) {
    this.securityControlService.getRoomList(page).subscribe((res) => {
      this.roomListData = res;
      this.filteredRoomListData = this.roomListData?.data;

      const groupImageObservables = this.filteredRoomListData.map((room) => {
        return this.roomImageService.getGroupImageData(room.id);
      });

      forkJoin(groupImageObservables).subscribe((groupImages) => {
        groupImages.forEach((imageData, index) => {
          this.filteredRoomListData[index].group_image =
            URL.createObjectURL(imageData);
        });
      });
    });
  }

  getPages(): number[] {
    const totalPages = this.roomListData?.last_page || 0;
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  getCurrentPageEnd(): number {
    return Math.ceil(this.roomListData?.total / this.roomListData?.per_page);
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.fetchRoomListData(page);

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
    const totalPages = this.roomListData?.last_page || 0;
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

  addDefaultRoom() {
    this.isSpinnerLoading = true;
    if (!this.roomName.trim()) {
      const errorDialogMessage = this.elRef.nativeElement.querySelector(
        '.error-dialog-message'
      );
      const errorDialogMessageP = this.elRef.nativeElement.querySelector(
        '.error-dialog-message p'
      );

      errorDialogMessageP.textContent = 'Room name should not be empty';
      errorDialogMessage.style.display = 'block';

      setTimeout(() => {
        errorDialogMessage.style.display = 'none';
      }, 2000);
      this.isSpinnerLoading = false;
      return;
    } else if (!this.selectedImage) {
      const errorDialogMessage = this.elRef.nativeElement.querySelector(
        '.error-dialog-message'
      );
      const errorDialogMessageP = this.elRef.nativeElement.querySelector(
        '.error-dialog-message p'
      );

      errorDialogMessageP.textContent = 'Room image-icon is required';
      errorDialogMessage.style.display = 'block';

      setTimeout(() => {
        errorDialogMessage.style.display = 'none';
      }, 2000);
      this.isSpinnerLoading = false;
      return;
    }

    const parsedData: number[] = [];

    this.imageService.compressImage(this.selectedImage).subscribe(
      (compressedImage: File) => {
        const compressedFile = new File(
          [compressedImage],
          compressedImage.name,
          {
            type: compressedImage.type,
          }
        );

        this.securityControlService
          .addGroupChat(this.roomName.trim(), parsedData, compressedFile)
          .subscribe(
            async (result) => {
              this.isSpinnerLoading = false;
              const addDialogMessage = this.elRef.nativeElement.querySelector(
                '.add-dialog-message'
              );

              addDialogMessage.style.display = 'block';
              setTimeout(() => {
                location.reload();
              }, 2000);
            },
            (error: any) => {
              const errorMessage = error.error.message;
              const errorDialogMessage = this.elRef.nativeElement.querySelector(
                '.error-dialog-message'
              );

              const errorDialogMessageP =
                this.elRef.nativeElement.querySelector('.error-dialog-message');

              errorDialogMessageP.textContent = errorMessage;
              errorDialogMessage.style.display = 'block';

              setTimeout(() => {
                errorDialogMessage.style.display = 'none';
              }, 2000);
            }
          );
      },
      (error) => {}
    );
  }

  deleteDefaultRoom(id: number) {
    this.isSpinnerLoading = true;
    this.securityControlService.deleteSpecificRoom(id).subscribe((res) => {
      this.isSpinnerLoading = false;
      const deleteDialogMessage = this.elRef.nativeElement.querySelector(
        '.delete-dialog-message'
      );

      deleteDialogMessage.style.display = 'block';

      setTimeout(() => {
        window.location.reload();
      }, 2000);
    });
  }

  updateConfigurations(index: number) {
    this.isSpinnerLoading = true;
    if (!this.modificationsData) {
      this.isSpinnerLoading = false;
      return;
    }

    const data = { ...this.modificationsData };
    const autoAddRoom = JSON.parse(data.auto_add_room);
    const loginMethod = JSON.parse(data.login_credentials);
    const accountDeactivationPeriod = JSON.parse(data.account_deactivation);

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

    switch (index) {
      case 0:
        data.auto_add_room = JSON.stringify(autoAddRoom == 1 ? 0 : 1);
        break;
      case 1:
        if (!this.newLogInMethod) {
          handleEmptyValue('Login method must be required');
          this.isSpinnerLoading = false;
          return;
        }

        for (const key in loginMethod) {
          if (loginMethod.hasOwnProperty(key)) {
            loginMethod[key] = key === this.newLogInMethod ? true : false;
          }
        }
        data.login_credentials = JSON.stringify(loginMethod);
        break;
      case 2:
        if (!this.newDeactivationPeriod) {
          handleEmptyValue('Deactivation period must be required');
          this.isSpinnerLoading = false;
          return;
        }

        for (const key in accountDeactivationPeriod) {
          if (accountDeactivationPeriod.hasOwnProperty(key)) {
            accountDeactivationPeriod[key] =
              key === this.newDeactivationPeriod ? true : false;
          }
        }
        data.account_deactivation = JSON.stringify(accountDeactivationPeriod);
        break;
      default:
        this.isSpinnerLoading = false;
        return;
    }

    this.securityControlService.updateConfigurations(data).subscribe((res) => {
      this.isSpinnerLoading = false;
      this.elRef.nativeElement.querySelector(
        '.update-dialog-message'
      ).style.display = 'block';

      if (index == 0) {
        this.elRef.nativeElement.querySelector(
          '.update-dialog-message p'
        ).textContent = 'Modified changes to auto-add room has been success';
      }

      if (index == 1) {
        this.elRef.nativeElement.querySelector(
          '.update-dialog-message p'
        ).textContent = 'Modified changes to login method successfully updated';
      }

      if (index == 2) {
        this.elRef.nativeElement.querySelector(
          '.update-dialog-message p'
        ).textContent =
          'Modified changes to deactivation period successfully updated';
      }

      setTimeout(() => {
        window.location.reload();
      }, 2000);
    });
  }

  editModal(
    selection: string,
    name: string | null = null,
    id: number | null = null
  ) {
    this.isSpinnerLoading = true;
    setTimeout(() => {
      this.isSpinnerLoading = false;
      if (id !== null) {
        this.selectedRoomId = id;
      }
      this.selectedRoomName = name || '';
      this.selectedImage = null;
      this.uploadedImageUrl = this.imageUrls.default_upload_img;
      this.uploadedImageUrl2 = this.imageUrls.default_upload_img;

      const modalOverlay =
        this.elRef.nativeElement.querySelector('.modal-overlay');
      modalOverlay.style.display = selection === 'open' ? 'flex' : 'none';
    }, 1000);
  }

  updateSpecificGroupChat(groupChatId: number, groupChatName: string) {
    this.isSpinnerLoading = true;
    const updateDialogMessage = this.elRef.nativeElement.querySelector(
      '.update-dialog-message'
    );
    const updateDialogMessageP = this.elRef.nativeElement.querySelector(
      '.update-dialog-message p'
    );

    if (!groupChatName && !this.selectedImage) {
      updateDialogMessageP.textContent = 'No any changes yet!';
      updateDialogMessageP.classList.remove('text-success');
      updateDialogMessageP.classList.add('text-dark');
      updateDialogMessage.style.display = 'block';

      setTimeout(() => {
        updateDialogMessage.style.display = 'none';
      }, 2000);
      this.isSpinnerLoading = false;
      return;
    }

    this.securityControlService
      .updateSpecificGroupChat(groupChatId, groupChatName, this.selectedImage)
      .subscribe((res) => {
        this.isSpinnerLoading = false;
        updateDialogMessageP.textContent =
          'Default Group-chat has been updated successfully!';
        updateDialogMessageP.classList.add('text-success');
        updateDialogMessageP.classList.remove('text-dark');
        updateDialogMessage.style.display = 'block';

        setTimeout(() => {
          window.location.reload();
        }, 2000);
      });
  }
}
