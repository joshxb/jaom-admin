import { AfterViewInit, Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { imageUrls } from 'src/app/app.component';
import { UsersManagementService } from 'src/app/configuration/services/user-management/user.management.service';
import { ModalComponent } from '../../modal/modal.component';
import { TextService } from 'src/app/configuration/assets/text.service';
import { CacheService } from 'src/app/configuration/assets/cache.service';
import { Order, ItemsPerPage } from 'src/app/configuration/enums/order.enum';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FileService } from 'src/app/configuration/assets/file.service';
import { UpdateBlobService } from 'src/app/configuration/services/ext/update-blob.service';

@Component({
  selector: 'app-updates',
  templateUrl: './updates.component.html',
  styleUrls: ['./updates.component.css']
})
export class UpdatesComponent implements OnInit, AfterViewInit {
  imageUrls = new imageUrls();
  searchTerm: string = '';
  updatesData!: any;
  selectedUser: any;
  filteredUpdates: any[] = [];
  isSpinnerLoading: boolean = false;
  order: Order = Order.Desc;
  orderEnum = Order;
  itemEnum = ItemsPerPage;
  currentPage = 1;
  itemsPerPage = ItemsPerPage.Ten; //default
  showConfirmationModal = false;
  updateToDeleteId!: number;
  selectedBlobId: number | null = null;
  imagePreview: string | null = null;
  imagePreviews: { [key: string]: string } = {};
  blobIds: { [key: string]: any } = {};
  fileNames: { [key: string]: string } = {};
  dbImagePreviews: { [update_blob_id: string]: { [id: string]: string } } = {};
  dbFileNames: { [update_blob_id: string]: { [id: string]: string } } = {};
  dbBlobIds: { [update_blob_id: string]: { [id: string]: any } } = {};
  dynamicContentMap: Map<number | null, SafeHtml> = new Map();

  constructor(
    private usersManagementService: UsersManagementService,
    private router: Router,
    private route: ActivatedRoute,
    private elRef: ElementRef,
    private dialog: MatDialog,
    private textService: TextService,
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private cacheService: CacheService,
    private fileService: FileService,
    private sanitizer: DomSanitizer,
    private updateBlobService: UpdateBlobService
  ) { }

  createUpdateAttachmentElement = async (update_blob_id: any) => {
    const modalOverlay = this.elRef.nativeElement.querySelector('.modal-overlay');

    if (update_blob_id === null) {
      return;
    }

    if (this.dynamicContentMap.has(update_blob_id)) {
      // If update_blob_id is already in the map, return the existing value
      modalOverlay.style.display = 'flex';
      this.isSpinnerLoading = false;
      return this.dynamicContentMap.get(update_blob_id);
    }

    const blobInfo = await this.getUpdateBlobInfo(update_blob_id);
    const blobDataPromises = blobInfo.update_blob_ids.map(
      (blobId: number, index: number) =>
        this.getUpdateBlobDataFile(
          update_blob_id,
          blobId,
          blobInfo.file_names[index]
        )
    );
    const blobDataArray = await Promise.all(blobDataPromises);
    const imageElements = blobDataArray.map((data) => {
      if (data?.dataType.startsWith('image/')) {
        // If it's an image type
        return this.fileService.imageFilePreview(data?.file_name, data?.blobData, data?.dataType, 'update');
      } else {
        // If it's not an image type
        return this.fileService.nonImageFilePreview(
          data?.file_name,
          data?.blobData,
          data?.dataType
        );
      }
    });

    const imageElementsString = imageElements.join('');
    const newDiv = imageElementsString;

    // Store the new value in the map and return it
    const sanitizedValue = this.sanitizer.bypassSecurityTrustHtml(newDiv);
    this.dynamicContentMap.set(update_blob_id, sanitizedValue);

    modalOverlay.style.display = 'flex';
    this.isSpinnerLoading = false;

    return sanitizedValue;
  };

  async getUpdateBlobInfo(update_blob_id: number): Promise<any> {
    return new Promise((resolve, reject) => {
      if (update_blob_id === null) {
        resolve({ update_blob_ids: [], file_names: [] }); // Resolve with empty arrays
        return;
      }

      this.updateBlobService.getUpdateBlobInfo(update_blob_id).subscribe(
        (blob) => {
          resolve({
            update_blob_ids: blob?.updates_blob_ids || [],
            file_names: blob?.file_names || [],
          });
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  async getUpdateBlobDataFile(
    update_blob_id: number,
    id: number,
    file_name: string
  ) {
    return new Promise((resolve, reject) => {
      this.updateBlobService
        .getUpdateBlobDataFile(update_blob_id, id)
        .subscribe(
          async (data) => {
            try {
              const { blob, dataType } = data;
              if (blob instanceof Blob) {
                const reader = new FileReader();
                reader.onload = () => {
                  const blobData = reader.result as string;

                  if (!this.dbImagePreviews[update_blob_id]) {
                    this.dbImagePreviews[update_blob_id] = {};
                  }

                  if (!this.dbFileNames[update_blob_id]) {
                    this.dbFileNames[update_blob_id] = {};
                  }

                  if (!this.dbBlobIds[update_blob_id]) {
                    this.dbBlobIds[update_blob_id] = {};
                  }

                  this.dbImagePreviews[update_blob_id][id] = blobData;
                  this.dbFileNames[update_blob_id][id] = file_name;
                  this.dbBlobIds[update_blob_id][id] = id;

                  resolve({ blobData, dataType, file_name });
                };
                reader.readAsDataURL(blob);
              } else {
                reject(new Error('Invalid blob data.'));
              }
            } catch (error) {
              reject(error);
            }
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  closeEditModal() {
    const modalOverlay =
      this.elRef.nativeElement.querySelector('.modal-overlay');

    modalOverlay.style.display = 'none';
  }

  openEditModal(blobId: number) {
    this.isSpinnerLoading = true;
    this.createUpdateAttachmentElement(blobId);
    this.selectedBlobId = blobId;
  }

  openConfirmationModal(chat_id: number) {
    this.isSpinnerLoading = true;
    setTimeout(() => {
      this.isSpinnerLoading = false;
      this.updateToDeleteId = chat_id;
      this.showConfirmationModal = true;
    }, 1000);
  }

  closeConfirmationModal() {
    this.showConfirmationModal = false;
  }

  confirmDelete() {
    this.deleteSpecificUpdate(this.updateToDeleteId);
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

  applySearchFilter() {
    if (!this.searchTerm) {
      this.filteredUpdates = this.updatesData?.data;
    } else {
      this.filteredUpdates = this.updatesData?.data.filter(
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

      if (params['order']) {
        this.order = params['order'];
      } else {
        this.order = Order.Desc;
      }

      if (params['items']) {
        this.itemsPerPage = params['items'];
      } else {
        this.itemsPerPage = ItemsPerPage.Ten;
      }

      this.isSpinnerLoading = true;
      this.fetchupdatesData(this.currentPage, this.order, this.itemsPerPage);
    });
  }

  fetchupdatesData(page: number, order: Order = Order.Null, items: ItemsPerPage = ItemsPerPage.Null) {
    this.usersManagementService.getAllUpdates(page, order, items).subscribe((res) => {
      this.isSpinnerLoading = false;
      this.updatesData = res[0];
      this.filteredUpdates = this.updatesData?.data;
    });
  }

  getPages(): number[] {
    const totalPages = this.updatesData?.last_page || 0;
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  getCurrentPageEnd(): number {
    return Math.ceil(this.updatesData?.total / this.updatesData?.per_page);
  }

  onPageChange(page: number, order: Order = Order.Null, items: ItemsPerPage = ItemsPerPage.Null) {
    this.currentPage = page;

    if (order) {
      this.order = order;
    }

    if (items) {
      this.itemsPerPage = items;
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        page: this.currentPage,
        order: this.order,
        items: this.itemsPerPage
      },
      queryParamsHandling: 'merge',
    });
  }

  getStartingIndex(): number {
    return (this.currentPage - 1) + 1;
  }

  getPageRange(): number[] {
    const totalPages = this.updatesData?.last_page || 0;
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

  deleteSpecificUpdate(id: any) {
    this.isSpinnerLoading = true;

    this.usersManagementService.deleteSpecificUpdate(id).subscribe((res) => {
      this.isSpinnerLoading = false;
      const deleteDialogMessage = this.elRef.nativeElement.querySelector(
        '.delete-dialog-message'
      );
      const deleteDialogMessageP = this.elRef.nativeElement.querySelector(
        '.delete-dialog-message p'
      );

      deleteDialogMessageP.textContent = res?.message;
      deleteDialogMessage.style.display = 'block';

      setTimeout(() => {
        window.location.reload();
      }, 2000);
    });
  }

  extractStylesAndText(subject: string): {
    styles: { [key: string]: string };
    innerHTML: string;
  } {
    return this.textService.extractStylesAndText(subject);
  }

  updatePermission(id: number, index: number) {
    this.isSpinnerLoading = true;

    const permission = index == 0 ? 'disapproved' : 'approved';

    const data = { permission: permission };

    this.usersManagementService.updatePermission(data, id).subscribe((res) => {
      this.isSpinnerLoading = false;

      const updateDialogMessage = this.elRef.nativeElement.querySelector(
        '.update-dialog-message'
      );
      const updateDialogMessageP = this.elRef.nativeElement.querySelector(
        '.update-dialog-message p'
      );

      updateDialogMessageP.textContent = res?.message;
      updateDialogMessage.style.display = 'block';

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    });
  }
}
