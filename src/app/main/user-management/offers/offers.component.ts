import { AfterViewInit, Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { imageUrls } from 'src/app/app.component';
import { ModalComponent } from '../../modal/modal.component';
import { OfferService } from 'src/app/configuration/services/pages/offer.service';
import { CacheService } from 'src/app/configuration/assets/cache.service';
import { DataName, ExportToExcelService, ExportType } from 'src/app/configuration/assets/export-to-excel.service';

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

  currentPage = 1;
  itemsPerPage = 1;

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
      this.fetchoffersData(this.currentPage);
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

  fetchoffersData(page: number) {
    this.isSpinnerLoading = true;

    this.offerService.getOffer(page).subscribe((res) => {
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

  onPageChange(page: number) {
    this.currentPage = page;
    this.fetchoffersData(page);

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
