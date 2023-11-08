import { AfterViewInit, Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { imageUrls } from 'src/app/app.component';
import { ModalComponent } from '../../modal/modal.component';
import { OfferService } from 'src/app/configuration/services/pages/offer.service';
import { CacheService } from 'src/app/configuration/assets/cache.service';
import { DataName, ExportToExcelService, ExportType } from 'src/app/configuration/assets/export-to-excel.service';
import { Order, ItemsPerPage } from 'src/app/configuration/enums/order.enum';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.css']
})
export class OffersComponent implements OnInit, AfterViewInit {
  imageUrls = new imageUrls();

  searchTerm: string = '';
  offersData!: any;
  selectedUser: any;
  filteredOffers: any[] = [];
  isSpinnerLoading: boolean = false;

  order: Order = Order.Desc;
  orderEnum = Order;
  itemEnum = ItemsPerPage;
  currentPage = 1;
  itemsPerPage = ItemsPerPage.Ten; //default

  showConfirmationModal = false;
  offerToDeleteId!: number;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private elRef: ElementRef,
    private dialog: MatDialog,
    private offerService: OfferService,
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private cacheService: CacheService,
    private exportToExcelService: ExportToExcelService
  ) { }

  openConfirmationModal(chat_id: number) {
    this.isSpinnerLoading = true;
    setTimeout(() => {
      this.isSpinnerLoading = false;
      this.offerToDeleteId = chat_id;
      this.showConfirmationModal = true;
    }, 1000);
  }

  closeConfirmationModal() {
    this.showConfirmationModal = false;
  }

  confirmDelete() {
    this.deleteOffer(this.offerToDeleteId);
    this.closeConfirmationModal();
  }

  applySearchFilter() {
    if (!this.searchTerm) {
      this.filteredOffers = this.offersData?.data;
    } else {
      this.filteredOffers = this.offersData?.data.filter(
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
      
      this.fetchoffersData(this.currentPage, this.order, this.itemsPerPage);
    });
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

  fetchoffersData(page: number, order: Order = Order.Null, items: ItemsPerPage = ItemsPerPage.Null) {
    this.isSpinnerLoading = true;

    this.offerService.getOffer(page, order, items).subscribe((res) => {
      this.isSpinnerLoading = false;

      this.offersData = res;
      this.filteredOffers = this.offersData?.data;
    });
  }

  getPages(): number[] {
    const totalPages = this.offersData?.last_page || 0;
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  getCurrentPageEnd(): number {
    return Math.ceil(this.offersData?.total / this.offersData?.per_page);
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
    const totalPages = this.offersData?.last_page || 0;
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

  deleteOffer(id: any) {
    this.isSpinnerLoading = true;

    this.offerService.deleteOffer(id).subscribe((res) => {
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
    const table = document.getElementById('offerTable') as HTMLTableElement;

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
      this.offerService.getExportOffer(value).subscribe((res) => {
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
          this.exportToExcelService.exportToExcel(table, data, 'offer-prayer-list', ExportType.Data, DataName.Offer);
        }, 2000);
      });
    } else {
      setTimeout(() => {
        this.isSpinnerLoading = false;
        this.exportToExcelService.exportToExcel(table, data, 'offer-prayer-list', ExportType.Container, DataName.Offer);
      }, 2000);
    }
  }
}
