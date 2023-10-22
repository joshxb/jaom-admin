import { AfterViewInit, Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { imageUrls } from 'src/app/app.component';
import { ModalComponent } from '../../modal/modal.component';
import { TransactionsService } from 'src/app/configuration/services/transactions/transactions.service';
import { CacheService } from 'src/app/configuration/assets/cache.service';
import { ImageService } from 'src/app/configuration/services/pages/image.service';
import { forkJoin } from 'rxjs';
import { ExportToExcelService } from 'src/app/configuration/assets/export-to-excel.service';

@Component({
  selector: 'app-donations',
  templateUrl: './donations.component.html',
  styleUrls: ['./donations.component.css']
})
export class DonationsComponent implements OnInit, AfterViewInit {
  imageUrls = new imageUrls();

  searchTerm: string = '';
  transactionsData!: any;
  selectedUser: any;
  filteredTransactions: any[] = [];
  isSpinnerLoading: boolean = false;
  showModalSS = false;
  modalImageUrl: string = '';

  currentPage = 1;
  itemsPerPage = 1;

  constructor(
    private transactionService: TransactionsService,
    private router: Router,
    private route: ActivatedRoute,
    private elRef: ElementRef,
    private dialog: MatDialog,
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private cacheService: CacheService,
    private imageService: ImageService,
    private exportToExcelService: ExportToExcelService
  ) { }

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

    dialogRef.afterClosed().subscribe((result) => { });
  }
  openModal(imageUrl: string) {
    this.modalImageUrl = imageUrl;
    this.showModalSS = true;
  }

  closeModal() {
    this.showModalSS = false;
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
      this.fetchtransactionsData(this.currentPage);
    });
  }

  fetchtransactionsData(page: number) {
    this.isSpinnerLoading = true;

    this.transactionService.getAllPaginatedDonationTransactions(page).subscribe((res) => {
      this.isSpinnerLoading = false;
      this.transactionsData = res;
      this.filteredTransactions = this.transactionsData?.data;

      const ssDonateObservables = this.filteredTransactions.map((transac) => {
        return this.imageService.getDonationSSData(transac.id);
      });

      forkJoin(ssDonateObservables).subscribe((transacs) => {
        transacs.forEach((imageData, index) => {
          this.filteredTransactions[index].screenshot_img =
            URL.createObjectURL(imageData);
        });
      });
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
    this.isSpinnerLoading = true;

    this.transactionService.deleteDonationTransaction(id).subscribe((res) => {
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

  exportToEXCEL() {
    this.isSpinnerLoading = true;
    const table = document.getElementById('donationTable') as HTMLTableElement;

    if (!table) {
      console.error("Table element not found");
      return;
    }

    const data: any[] = [];
    for (let i = 1; i < table.rows.length; i++) {
      const row = table.rows[i];

      if (!row) {
        console.error("Row element not found");
        continue;
      }

      const rowData: { [key: string]: string } = {};
      for (let j = 0; j < row.cells.length - 1; j++) {
        const cell = row.cells[j];
        if (cell.textContent !== null) {
          const cellText = cell.textContent;
          rowData[cellText] = cellText;
        }
      }

      data.push(rowData);
    }

    setTimeout(() => {
      this.isSpinnerLoading = false;
      this.exportToExcelService.exportToExcel(table, data, 'contact-list');
    }, 2000);
  }
}
