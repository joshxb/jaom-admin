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
import { ModalComponent } from '../../modal/modal.component';
import { TransactionsService } from 'src/app/configuration/services/transactions/transactions.service';

@Component({
  selector: 'app-donations',
  templateUrl: './donations.component.html',
  styleUrls: ['./donations.component.css'],
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
export class DonationsComponent implements OnInit {
  imageUrls = new imageUrls();

  searchTerm: string = '';
  transactionsData!: any;
  selectedUser: any;
  filteredTransactions: any[] = [];

  currentPage = 1;
  itemsPerPage = 1;

  constructor(
    private transactionService: TransactionsService,
    private router: Router,
    private route: ActivatedRoute,
    private elRef: ElementRef,
    private dialog: MatDialog
  ) {}

  applySearchFilter() {
    if (!this.searchTerm) {
      this.filteredTransactions = this.transactionsData?.data;
    } else {
      this.filteredTransactions = this.transactionsData?.data.filter(
        (transacs: { [s: string]: unknown } | ArrayLike<unknown>) =>
          Object.values(transacs).some((value) => {
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
      this.fetchtransactionsData(this.currentPage);
    });
  }

  fetchtransactionsData(page: number) {
    this.transactionService.getAllPaginatedDonationTransactions(page).subscribe((res) => {
      this.transactionsData = res;
      this.filteredTransactions = this.transactionsData?.data;
    });
  }

  getPages(): number[] {
    const totalPages = this.transactionsData?.last_page || 0;
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  getCurrentPageEnd(): number {
    return Math.ceil(this.transactionsData?.total / this.transactionsData?.per_page);
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.fetchtransactionsData(page);

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
    const totalPages = this.transactionsData?.last_page || 0;
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

  deleteDonationTransaction(id: any) {
    this.transactionService.deleteDonationTransaction(id).subscribe((res) => {
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
