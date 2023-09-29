import { AfterViewInit, Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { imageUrls } from 'src/app/app.component';
import { UsersManagementService } from 'src/app/configuration/services/user-management/user.management.service';
import { ModalComponent } from '../../modal/modal.component';
import { CacheService } from 'src/app/configuration/assets/cache.service';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
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
  itemsPerPage = 1;

  constructor(
    private usersManagementService: UsersManagementService,
    private router: Router,
    private route: ActivatedRoute,
    private elRef: ElementRef,
    private dialog: MatDialog,
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private cacheService: CacheService
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

    dialogRef.afterClosed().subscribe((result: any) => {});
  }

  ngOnInit(): void {
    const theme = this.cacheService.getCachedAdminData('theme');
    this.cacheService.themeChange(this.renderer, this.elRef.nativeElement, theme);

    this.route.queryParams.subscribe(
      (params: { [x: string]: string | number }) => {
        if (params['page']) {
          this.currentPage = +params['page'];
        } else {
          this.currentPage = 1;
        }

        this.isSpinnerLoading = true;
        this.fetchRoomList(this.currentPage);
        this.fetchRoomChatList(this.currentPage2);
      }
    );
  }

  fetchRoomList(page: number) {
    this.usersManagementService.getRoomList(page).subscribe((res: any) => {
      this.isSpinnerLoading = false;
      this.roomListData = res;
      this.filteredRooms = this.roomListData?.data;
    });
  }

  fetchRoomChatList(page: number) {
    this.usersManagementService.getRoomChatList(page).subscribe((res: any) => {
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

  onPageChange(page: number, selection: number) {
    const currentPageKey = selection === 0 ? 'page' : 'page2';
    const currentPageProperty =
      selection === 0 ? 'currentPage' : 'currentPage2';
    const fetchFunction =
      selection === 0 ? this.fetchRoomList : this.fetchRoomChatList;

    this[currentPageProperty] = page;
    fetchFunction.call(this, page);

    const queryParams = { [currentPageKey]: this[currentPageProperty] };
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge',
    });
  }

  getStartingIndex(selection: number): number {
    const currentPage = selection === 0 ? this.currentPage : this.currentPage2;
    return (currentPage - 1) * this.itemsPerPage + 1;
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
