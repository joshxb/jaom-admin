import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { Component, ElementRef, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { imageUrls } from 'src/app/app.component';
import { UsersManagementService } from 'src/app/configuration/services/user-management/user.management.service';
import { ModalComponent } from '../../modal/modal.component';
import { TextService } from 'src/app/configuration/assets/text.service';

@Component({
  selector: 'app-updates',
  templateUrl: './updates.component.html',
  styleUrls: ['./updates.component.css'],
  animations: [
    trigger('modalAnimation', [
      state(
        'active',
        style({
          transform: 'translateY(0)',
          opacity: 1,
        })
      ),
      transition('void => active', [
        style({
          transform: 'translateY(-20px)',
          opacity: 0,
        }),
        animate('300ms ease'),
      ]),
    ]),
  ],
})
export class UpdatesComponent implements OnInit {
  imageUrls = new imageUrls();

  searchTerm: string = '';
  updatesData!: any;
  selectedUser: any;
  filteredUpdates: any[] = [];

  currentPage = 1;
  itemsPerPage = 1;

  constructor(
    private usersManagementService: UsersManagementService,
    private router: Router,
    private route: ActivatedRoute,
    private elRef: ElementRef,
    private dialog: MatDialog,
    private textService: TextService
  ) {}

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
            }
            if (typeof value === 'number') {
              return value === parseInt(this.searchTerm.toLowerCase(), 10);
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
      this.fetchupdatesData(this.currentPage);
    });
  }

  fetchupdatesData(page: number) {
    this.usersManagementService.getAllUpdates(page).subscribe((res) => {
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
    this.usersManagementService.deleteSpecificUpdate(id).subscribe((res) => {
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
    const permission = index == 0 ? 'disapproved' : 'approved';

    const data = { permission: permission };

    this.usersManagementService.updatePermission(data, id).subscribe((res) => {
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
