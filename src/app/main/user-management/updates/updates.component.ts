import { AfterViewInit, Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { imageUrls } from 'src/app/app.component';
import { UsersManagementService } from 'src/app/configuration/services/user-management/user.management.service';
import { ModalComponent } from '../../modal/modal.component';
import { TextService } from 'src/app/configuration/assets/text.service';
import { CacheService } from 'src/app/configuration/assets/cache.service';

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

  currentPage = 1;
  itemsPerPage = 1;

  constructor(
    private usersManagementService: UsersManagementService,
    private router: Router,
    private route: ActivatedRoute,
    private elRef: ElementRef,
    private dialog: MatDialog,
    private textService: TextService,
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

    dialogRef.afterClosed().subscribe((result) => {});
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
      this.isSpinnerLoading = true;

      this.fetchupdatesData(this.currentPage);
    });
  }

  fetchupdatesData(page: number) {
    this.usersManagementService.getAllUpdates(page).subscribe((res) => {
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

  onPageChange(page: number) {
    this.currentPage = page;
    this.fetchupdatesData(page);

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
