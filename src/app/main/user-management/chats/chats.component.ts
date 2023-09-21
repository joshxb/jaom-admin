import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { AfterViewInit, Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { imageUrls } from 'src/app/app.component';
import { UsersManagementService } from 'src/app/configuration/services/user-management/user.management.service';
import { ModalComponent } from '../../modal/modal.component';

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

  currentPage = 1;
  itemsPerPage = 1;

  constructor(
    private usersManagementService: UsersManagementService,
    private router: Router,
    private route: ActivatedRoute,
    private elRef: ElementRef,
    private dialog: MatDialog,
    private renderer: Renderer2,
    private elementRef: ElementRef
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

    dialogRef.afterClosed().subscribe((result) => {});
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['page']) {
        this.currentPage = +params['page'];
      } else {
        this.currentPage = 1;
      }
      this.fetchchatsData(this.currentPage);
    });
  }

  fetchchatsData(page: number) {
    this.usersManagementService.getAllChatsData(page).subscribe((res) => {
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

  onPageChange(page: number) {
    this.currentPage = page;
    this.fetchchatsData(page);

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
    this.usersManagementService.deleteSpecificMessage(id).subscribe((res) => {
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
