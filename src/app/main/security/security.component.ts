import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { imageUrls } from 'src/app/app.component';
import { ConcernService } from 'src/app/configuration/services/concerns/concern.service';
import { ModalComponent } from '../modal/modal.component';
import { SecurityControlService } from 'src/app/configuration/services/security-control/security-control.service';
import { ImageService } from 'src/app/configuration/assets/image.service';

@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.css'],
})
export class SecurityComponent implements OnInit {
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

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private elRef: ElementRef,
    private dialog: MatDialog,
    private securityControlService: SecurityControlService,
    private imageService: ImageService
  ) {}

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
    this.securityControlService.deleteSpecificRoom(id).subscribe((res) => {
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
    if (!this.modificationsData) {
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
        return;
    }

    this.securityControlService.updateConfigurations(data).subscribe((res) => {
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
  }

  updateSpecificGroupChat(
    groupChatId: number,
    groupChatName: string
  ) {
    
    this.securityControlService.updateSpecificGroupChat(groupChatId, groupChatName).subscribe((res) => {  
      const updateDialogMessage = this.elRef.nativeElement.querySelector(
        '.update-dialog-message'
      );

      const updateDialogMessageP = this.elRef.nativeElement.querySelector(
        '.update-dialog-message p'
      );

      updateDialogMessageP.textContent = 'Default Group-chat has been updated successfully!';
      updateDialogMessage.style.display = 'block';

      setTimeout(() => {
        window.location.reload();
      }, 2000);
    });
  }
}
