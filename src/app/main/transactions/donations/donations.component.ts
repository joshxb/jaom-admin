import { AfterViewInit, Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { imageUrls } from 'src/app/app.component';
import { ModalComponent } from '../../modal/modal.component';
import { TransactionsService } from 'src/app/configuration/services/transactions/transactions.service';
import { CacheService } from 'src/app/configuration/assets/cache.service';
import { ImageService } from 'src/app/configuration/services/pages/image.service';
import { forkJoin } from 'rxjs';
import { DataName, ExportToExcelService, ExportType } from 'src/app/configuration/assets/export-to-excel.service';
import { DonationService } from 'src/app/configuration/services/pages/donation.service';
import { Order, ItemsPerPage } from 'src/app/configuration/enums/order.enum';

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

  order: Order = Order.Desc;
  orderEnum = Order;
  itemEnum = ItemsPerPage;
  currentPage = 1;
  itemsPerPage = ItemsPerPage.Ten; //default

  showConfirmationModal = false;
  donationToDeleteId!: number;

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
    private exportToExcelService: ExportToExcelService,
    private donationService: DonationService
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

  openConfirmationModal(chat_id: number) {
    this.isSpinnerLoading = true;
    setTimeout(() => {
      this.isSpinnerLoading = false;
      this.donationToDeleteId = chat_id;
      this.showConfirmationModal = true;
    }, 1000);
  }

  closeConfirmationModal() {
    this.showConfirmationModal = false;
  }

  confirmDelete() {
    this.deleteDonationTransaction(this.donationToDeleteId);
    this.closeConfirmationModal();
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

      this.fetchtransactionsData(this.currentPage, this.order, this.itemsPerPage);
    });
  }

  fetchtransactionsData(page: number, order: Order = Order.Null, items: ItemsPerPage = ItemsPerPage.Null) {
    this.isSpinnerLoading = true;

    this.transactionService.getAllPaginatedDonationTransactions(page, order, items).subscribe((res) => {
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

  exportToEXCEL(value: number = 0) {
    this.isSpinnerLoading = true;
    const table = document.getElementById('donationTable') as HTMLTableElement;

    if (!table) {
      console.error("Table element not found");
      return;
    }

    let data: any[] = [];
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

    if (value) {
      this.donationService.getExportDonations(value).subscribe((res) => {
        let data: any[] = [];
        const headers: { [key: string]: string | number } = {};

        res.map((item: ArrayLike<unknown> | { [s: string]: unknown; }) => {
          const newObject: { [key: string]: string | number } = {};
            Object.entries(item).forEach(([key, value]) => {
              if (typeof value === 'string') {
                headers[key] = key;
                newObject[value] = value;
              }
            });
          data.push(newObject);
        });

        delete headers['updated_at'];
        data.unshift(headers);

        setTimeout(() => {
          this.isSpinnerLoading = false;
          this.exportToExcelService.exportToExcel(table, data, 'donation-transactions-list', ExportType.Data, DataName.Donation);
        }, 2000);
      });
    } else {
      setTimeout(() => {
        this.isSpinnerLoading = false;
        this.exportToExcelService.exportToExcel(table, data, 'donation-transactions-list', ExportType.Container, DataName.Donation);
      }, 2000);
    }
  }
}
