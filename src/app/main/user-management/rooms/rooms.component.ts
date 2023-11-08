import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  Renderer2,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { imageUrls } from 'src/app/app.component';
import { UsersManagementService } from 'src/app/configuration/services/user-management/user.management.service';
import { ModalComponent } from '../../modal/modal.component';
import { CacheService } from 'src/app/configuration/assets/cache.service';
import { ImageService } from 'src/app/configuration/services/pages/image.service';
import { forkJoin } from 'rxjs';
import { ItemsPerPage, Order } from 'src/app/configuration/enums/order.enum';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css'],
})
export class RoomsComponent implements OnInit, AfterViewInit {
  imageUrls = new imageUrls();

  searchTerm: string = '';
  searchTerm2: string = '';
  roomListData!: any;
  roomChatListData!: any;
  selectedUser: any;
  filteredRooms: any[] = [];
  filteredRoomChats: any[] = [];
  isSpinnerLoading: boolean = false;

  currentPage = 1;
  currentPage2 = 1;
  itemsPerPage = ItemsPerPage.Ten; //default
  itemsPerPage2 = ItemsPerPage.Ten; //default

  showConfirmationModal = false;
  selectedToDeleteId!: number;
  selectedOption!: number;
  selectedDataList!: string;

  order: Order = Order.Desc;
  order2: Order = Order.Desc;

  orderEnum = Order;
  itemEnum = ItemsPerPage;

  activeSelectedList: any = null;

  constructor(
    private usersManagementService: UsersManagementService,
    private router: Router,
    private route: ActivatedRoute,
    private elRef: ElementRef,
    private dialog: MatDialog,
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private cacheService: CacheService,
    private imageService: ImageService
  ) { }

  openConfirmationModal(id: number, index: number) {
    this.isSpinnerLoading = true;
    this.selectedOption = index;


    this.selectedDataList = index === 0 ? 'room' : 'group message';

    setTimeout(() => {
      this.isSpinnerLoading = false;
      this.selectedToDeleteId = id;
      this.showConfirmationModal = true;
    }, 1000);
  }

  closeConfirmationModal() {
    this.showConfirmationModal = false;
  }

  confirmDelete() {
    if (this.selectedOption === 0) {
      this.deleteSpecificRoom(this.selectedToDeleteId);
    } else {
      this.deleteSpecificRoomChat(this.selectedToDeleteId);
    }
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

  applySearchFilter(selection: number) {
    const data =
      selection === 0 ? this.roomListData : this.roomChatListData?.data;
    const searchTerm = selection === 0 ? this.searchTerm : this.searchTerm2;

    if (!data) {
      return;
    }

    if (!searchTerm) {
      if (selection === 0) {
        this.filteredRooms = data?.data;
      } else {
        this.filteredRoomChats = data?.data;
      }
    } else {
      const filteredData = data.data.filter((chat: any) =>
        Object.values(chat).some((value) => {
          if (typeof value === 'string') {
            return value.toLowerCase().includes(searchTerm.toLowerCase());
          } else if (typeof value === 'number') {
            return value == Number(this.searchTerm.toLowerCase());
          }
          return false;
        })
      );

      if (selection === 0) {
        this.filteredRooms = filteredData;
      } else {
        this.filteredRoomChats = filteredData;
      }
    }
  }

  openDialog(s: any, type: string) {
    const dialogRef = this.dialog.open(ModalComponent, {
      data: { content: `${s}`, level: type },
    });

    dialogRef.afterClosed().subscribe((result: any) => { });
  }

  ngOnInit(): void {
    const theme = this.cacheService.getCachedAdminData('theme');
    this.cacheService.themeChange(
      this.renderer,
      this.elRef.nativeElement,
      theme
    );

    this.route.queryParams.subscribe(
      (params) => {
        ///////////////////////////////
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

        ////////////////////////////////
        if (params['page2']) {
          this.currentPage2 = +params['page2'];
        } else {
          this.currentPage2 = 1;
        }
        if (params['order2']) {
          this.order2 = params['order2'];
        }
        if (params['items2']) {
          this.itemsPerPage2 = params['items2'];
        }

        this.isSpinnerLoading = true;

        if (!this.activeSelectedList) {
          this.fetchRoomList(this.currentPage, this.order, this.itemsPerPage);
          this.fetchRoomChatList(this.currentPage2, this.order2, this.itemsPerPage2);
        } else {
          if (this.activeSelectedList === 'room') {
            this.fetchRoomList(this.currentPage, this.order, this.itemsPerPage);
          } else {
            this.fetchRoomChatList(this.currentPage2, this.order2, this.itemsPerPage2);
          }
        }
      }
    );
  }

  fetchRoomList(page: number, order: Order = Order.Null, items: ItemsPerPage = ItemsPerPage.Null) {
    this.isSpinnerLoading = true;

    this.usersManagementService.getRoomList(page, 'v2', order, items).subscribe((res: any) => {
      this.isSpinnerLoading = false;
      this.roomListData = res;
      this.filteredRooms = this.roomListData?.data;

      const groupImageObservables = this.filteredRooms.map((room) => {
        return this.imageService.getGroupImageData(room.id);
      });

      forkJoin(groupImageObservables).subscribe((groupImages) => {
        groupImages.forEach((imageData, index) => {
          this.filteredRooms[index].group_image =
            URL.createObjectURL(imageData);
        });
      });
    });
  }

  fetchRoomChatList(page: number, order: Order = Order.Null, items: ItemsPerPage = ItemsPerPage.Null) {
    this.usersManagementService.getRoomChatList(page, order, items).subscribe((res: any) => {
      this.isSpinnerLoading = false;

      this.roomChatListData = res;
      this.filteredRoomChats = this.roomChatListData?.data?.data;
    });
  }

  getCurrentPageEnd(selection: number): number {
    const data =
      selection === 0 ? this.roomListData : this.roomChatListData?.data;

    if (!data) {
      return 0;
    }

    return Math.ceil(data.total / data.per_page);
  }

  onPageChange(page: number, selection: number, order: Order = Order.Null, items: ItemsPerPage = ItemsPerPage.Null) {
    const currentPageKey = selection === 0 ? 'page' : 'page2';
    const currentPageProperty =
      selection === 0 ? 'currentPage' : 'currentPage2';

    this[currentPageProperty] = page;

    if (order) {
      if (selection === 0) {
        this.order = order;
      } else {
        this.order2 = order;
      }
    }

    if (items) {
      if (selection === 0) {
        this.itemsPerPage = items;
      } else {
        this.itemsPerPage2 = items;
      }
    }

    this.activeSelectedList = selection === 0 ? 'room' : 'room_chat';

    const queryParams = {
      [currentPageKey]: this[currentPageProperty],
      order: this.order,
      order2: this.order2,
      items: this.itemsPerPage,
      items2: this.itemsPerPage2
    };
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge',
    });
  }

  getStartingIndex(selection: number): number {
    const currentPage = selection === 0 ? this.currentPage : this.currentPage2;
    return (currentPage - 1) + 1;
  }

  getPageRange(selection: number): number[] {
    const data =
      selection === 0 ? this.roomListData : this.roomChatListData?.data;

    if (!data) {
      return [];
    }

    const currentPage = selection === 0 ? this.currentPage : this.currentPage2;
    const totalPages = data.last_page || 0;
    const displayedPages = Math.min(totalPages, 5);
    const startPage = Math.max(currentPage - Math.floor(displayedPages / 2), 1);
    const endPage = Math.min(startPage + displayedPages - 1, totalPages);

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, index) => startPage + index
    );
  }

  deleteSpecificRoom(id: any) {
    this.isSpinnerLoading = true;
    this.usersManagementService
      .deleteRoom(id)
      .subscribe((res: { message: any }) => {
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

  deleteSpecificRoomChat(id: any) {
    this.isSpinnerLoading = true;
    this.usersManagementService
      .deleteSpecificRoomChat(id)
      .subscribe((res: { message: any }) => {
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
