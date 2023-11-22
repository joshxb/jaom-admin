import { AfterViewInit, Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { imageUrls } from 'src/app/app.component';
import { UsersManagementService } from 'src/app/configuration/services/user-management/user.management.service';
import { ModalComponent } from '../../modal/modal.component';
import { CacheService } from 'src/app/configuration/assets/cache.service';
import { Order, ItemsPerPage } from 'src/app/configuration/enums/order.enum';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FileService } from 'src/app/configuration/assets/file.service';
import { ChatBlobService } from 'src/app/configuration/services/ext/chat-blob.service';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.css']
})
export class ChatsComponent implements OnInit, AfterViewInit {
  imageUrls = new imageUrls();
  searchTerm: string = '';
  chatsData!: any;
  selectedUser: any;
  filteredChats: any[] = [];
  isSpinnerLoading: boolean = false;
  currentPage = 1;
  itemsPerPage = ItemsPerPage.Ten; //default
  order: Order = Order.Desc;
  orderEnum = Order;
  itemEnum = ItemsPerPage;
  showConfirmationModal = false;
  chatToDeleteId!: number;
  selectedBlobId: number | null = null;
  imagePreview: string | null = null;
  imagePreviews: { [key: string]: string } = {};
  blobIds: { [key: string]: any } = {};
  fileNames: { [key: string]: string } = {};
  dbImagePreviews: { [chat_blob_id: string]: { [id: string]: string } } = {};
  dbFileNames: { [chat_blob_id: string]: { [id: string]: string } } = {};
  dbBlobIds: { [chat_blob_id: string]: { [id: string]: any } } = {};
  dynamicContentMap: Map<number | null, SafeHtml> = new Map();

  constructor(
    private usersManagementService: UsersManagementService,
    private router: Router,
    private route: ActivatedRoute,
    private elRef: ElementRef,
    private dialog: MatDialog,
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private cacheService: CacheService,
    private fileService: FileService,
    private sanitizer: DomSanitizer,
    private chatBlobService: ChatBlobService
  ) { }

  createChatAttachmentElement = async (chat_blob_id: any) => {
    const modalOverlay = this.elRef.nativeElement.querySelector('.modal-overlay');

    if (chat_blob_id === null) {
      return;
    }

    if (this.dynamicContentMap.has(chat_blob_id)) {
      // If chat_blob_id is already in the map, return the existing value
      modalOverlay.style.display = 'flex';
      this.isSpinnerLoading = false;
      return this.dynamicContentMap.get(chat_blob_id);
    }

    const blobInfo = await this.getChatBlobInfo(chat_blob_id);
    const blobDataPromises = blobInfo.chat_blob_ids.map(
      (blobId: number, index: number) =>
        this.getChatBlobDataFile(
          chat_blob_id,
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
    this.dynamicContentMap.set(chat_blob_id, sanitizedValue);

    modalOverlay.style.display = 'flex';
    this.isSpinnerLoading = false;

    return sanitizedValue;
  };

  async getChatBlobInfo(chat_blob_id: number): Promise<any> {
    return new Promise((resolve, reject) => {
      if (chat_blob_id === null) {
        resolve({ chat_blob_ids: [], file_names: [] }); // Resolve with empty arrays
        return;
      }

      this.chatBlobService.getChatBlobInfo(chat_blob_id).subscribe(
        (blob) => {
          resolve({
            chat_blob_ids: blob?.messages_blob_ids || [],
            file_names: blob?.file_names || [],
          });
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  async getChatBlobDataFile(
    chat_blob_id: number,
    id: number,
    file_name: string
  ) {
    return new Promise((resolve, reject) => {
      this.chatBlobService
        .getChatBlobDataFile(chat_blob_id, id)
        .subscribe(
          async (data) => {
            try {
              const { blob, dataType } = data;
              if (blob instanceof Blob) {
                const reader = new FileReader();
                reader.onload = () => {
                  const blobData = reader.result as string;

                  if (!this.dbImagePreviews[chat_blob_id]) {
                    this.dbImagePreviews[chat_blob_id] = {};
                  }

                  if (!this.dbFileNames[chat_blob_id]) {
                    this.dbFileNames[chat_blob_id] = {};
                  }

                  if (!this.dbBlobIds[chat_blob_id]) {
                    this.dbBlobIds[chat_blob_id] = {};
                  }

                  this.dbImagePreviews[chat_blob_id][id] = blobData;
                  this.dbFileNames[chat_blob_id][id] = file_name;
                  this.dbBlobIds[chat_blob_id][id] = id;

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
    this.createChatAttachmentElement(blobId);
    this.selectedBlobId = blobId;
  }

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
    this.deleteSpecificMessage(this.chatToDeleteId);
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
      this.filteredChats = this.chatsData?.messages;
    } else {
      this.filteredChats = this.chatsData?.messages.filter(
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
      this.fetchchatsData(this.currentPage, this.order, this.itemsPerPage);
    });
  }

  fetchchatsData(page: number, order: Order = Order.Null, items: ItemsPerPage = ItemsPerPage.Null) {
    this.isSpinnerLoading = true;

    this.usersManagementService.getAllChatsData(page, order, items).subscribe((res) => {
      this.isSpinnerLoading = false;

      this.chatsData = res;
      this.filteredChats = this.chatsData?.messages;
    });
  }

  getPages(): number[] {
    const totalPages = this.chatsData?.last_page || 0;
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  getCurrentPageEnd(): number {
    return Math.ceil(this.chatsData?.total / this.chatsData?.per_page);
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
        page: this.currentPage, order: this.order,
        items: this.itemsPerPage
      },
      queryParamsHandling: 'merge',
    });
  }

  getStartingIndex(): number {
    return (this.currentPage - 1) + 1;
  }

  getPageRange(): number[] {
    const totalPages = this.chatsData?.last_page || 0;
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

  deleteSpecificMessage(id: any) {
    this.isSpinnerLoading = true;

    this.usersManagementService.deleteSpecificMessage(id).subscribe((res) => {
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
}
