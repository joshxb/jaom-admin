import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  Renderer2,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { imageUrls } from 'src/app/app.component';
import { CacheService } from 'src/app/configuration/assets/cache.service';
import ChartType, { ChartService } from 'src/app/configuration/assets/chart.service';
import { DateService } from 'src/app/configuration/assets/date.service';
import { Base } from 'src/app/configuration/configuration.component';
import { Order, ItemsPerPage } from 'src/app/configuration/enums/order.enum';
import { AnalyticsService } from 'src/app/configuration/services/analytics/analytics.service';

@Component({
  selector: 'app-page-visits',
  templateUrl: './page-visits.component.html',
  styleUrls: ['./page-visits.component.css']
})
export class PageVisitsComponent implements OnInit, AfterViewInit {
  imageUrls = new imageUrls();

  constructor(
    private elRef: ElementRef,
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private route: ActivatedRoute,
    private router: Router,
    private dateService: DateService,
    private analyticsService: AnalyticsService,
    private chartService: ChartService,
    private cacheService: CacheService
  ) { }
  base = new Base();
  public analytics: any;

  order: Order = Order.Desc;
  orderEnum = Order;
  itemEnum = ItemsPerPage;
  currentPage = 1;
  itemsPerPage = ItemsPerPage.Ten; //default
  searchTerm: string = '';
  filteredData: any[] = [];
  isSpinnerLoading: boolean = false;

  selectedMonth: string = '';
  selectedMonthIndex: number = Number(new Date().getMonth());
  selectedYear: number = new Date().getFullYear();

  yearOptions: number[] = this.dateService.generateYearOptions();

  activeSelectedList: any = null;

  applySearchFilter() {
    if (!this.searchTerm) {
      this.filteredData = this.analytics?.data;
    } else {
      this.filteredData = this.analytics?.data.filter(
        (data: { [s: string]: unknown } | ArrayLike<unknown>) =>
          Object.values(data).some((value) => {
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

  ngOnInit() {
    const theme = this.cacheService.getCachedAdminData('theme');
    this.cacheService.themeChange(this.renderer, this.elRef.nativeElement, theme);

    if (!this.activeSelectedList) {
      this.setCurrentMonthAndYear();
    } else {
      if (this.activeSelectedList === 'table') {
        this.setCurrentMonthAndYear();
      }
    }
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

    if (!this.activeSelectedList) {
      this.renderChartData();
    } else {
      if (this.activeSelectedList === 'graph') {
        this.renderChartData();
      }
    }
  }

  setCurrentMonthAndYear() {
    const currentDate = new Date();

    this.selectedMonth = this.dateService.getMonths()[currentDate.getMonth()];

    if (
      !(
        this.route.snapshot.queryParamMap.has('month') &&
        this.route.snapshot.queryParamMap.has('year')
      )
    ) {
      this.setParams();

      setTimeout(() => {
        window.location.reload();
      }, 100);
    } else {
      this.route.queryParamMap.subscribe(async (queryParams) => {
        const month = queryParams.get('month');
        const year = queryParams.get('year');
        const order = queryParams.get('order');
        const items = queryParams.get('items');

        if (order && items) {
          this.order = order as Order;
          this.itemsPerPage = items as ItemsPerPage;
        }

        if (month && year) {
          this.selectedMonth = month;
          this.selectedYear = Number(year);

          await this.getPageVisits(this.currentPage, month, Number(year), this.order, this.itemsPerPage);
        }
      });
    }
  }

  setParams() {
    this.isSpinnerLoading = true;

    const defaultParams = {
      month: this.selectedMonth,
      year: this.selectedYear,
    };

    this.router.navigate(['analytics/page-visits'], {
      queryParams: defaultParams,
      queryParamsHandling: 'merge',
    });
  }

  async getPageVisits(
    page: number,
    selectedMonth: string,
    selectedYear: number,
    order: Order = Order.Null,
    items: ItemsPerPage = ItemsPerPage.Null
  ) {
    this.isSpinnerLoading = true;

    try {
      const res = await this.analyticsService
        .getPageVisits(page, selectedMonth, selectedYear, order, items)
        .toPromise();
      this.isSpinnerLoading = false;
      this.analytics = res;
      this.filteredData = this.analytics?.data;
      this.renderChartData();
    } catch (error) {
      console.error('Error fetching donation transactions:', error);
    }
  }

  renderChartData() {
    if (this.analytics) {
      let chartDataPoints: { x: Date; y: number; indexLabel: string }[] = [];

      this.analytics.page_visits.forEach((response: any) => {
        const date = new Date(response?.date);
        const monthIndex = date.getMonth();
        const dayOfMonth = date.getDate();
        const year = date.getFullYear();

        chartDataPoints.push({
          x: new Date(year, monthIndex, dayOfMonth),
          y: Number(response?.visits),
          indexLabel: String(response?.visits),
        });
      });

      this.chartService.initializeChart(ChartType.Area, 'page-visit', ...chartDataPoints);
    }
  }

  onMonthYearChange() {
    this.activeSelectedList = 'graph';
    this.setParams();
  }

  getPages(): number[] {
    const totalPages = this.analytics?.last_page || 0;
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  getCurrentPageEnd(): number {
    return Math.ceil(this.analytics?.total_visits / this.analytics?.per_page);
  }

  onPageChange(page: number, order: Order = Order.Null, items: ItemsPerPage = ItemsPerPage.Null) {
    this.currentPage = page;

    if (order) {
      this.order = order;
    }

    if (items) {
      this.itemsPerPage = items;
    }

    this.activeSelectedList = 'table';

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
    const totalPages = this.analytics?.last_page || 0;
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

  deleteAnalytics(id: number) {
    this.isSpinnerLoading = true;

    this.analyticsService.deleteAnalytics(id).subscribe((res) => {
      this.isSpinnerLoading = false;
      const deleteDialogMessage = this.elRef.nativeElement.querySelector(
        '.delete-dialog-message'
      );
      deleteDialogMessage.style.display = 'block';

      setTimeout(() => {
        window.location.reload();
      }, 2000);
    });
  }
}
