import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { imageUrls } from 'src/app/app.component';
import { ChartService } from 'src/app/configuration/assets/chart.service';
import { DateService } from 'src/app/configuration/assets/date.service';
import { Base } from 'src/app/configuration/configuration.component';
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
    private chartService: ChartService
  ) {}
  base = new Base();
  public analytics: any;

  currentPage = 1;
  itemsPerPage = 1;
  searchTerm: string = '';
  filteredData: any[] = [];

  selectedMonth: string = '';
  selectedMonthIndex: number = Number(new Date().getMonth());
  selectedYear: number = new Date().getFullYear();

  yearOptions: number[] = this.dateService.generateYearOptions();

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
    this.setCurrentMonthAndYear();
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
        } else {
          this.renderer.addClass(sidebar, 'active');
        }
      }
    });

    this.renderChartData();
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

        if (month && year) {
          this.selectedMonth = month;
          this.selectedYear = Number(year);
          await this.getPageVisits(this.currentPage, month, Number(year));
        }
      });
    }
  }

  setParams() {
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
    selectedYear: number
  ) {
    try {
      const res = await this.analyticsService
        .getPageVisits(page, selectedMonth, selectedYear)
        .toPromise();

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

      this.chartService.initializeChart('page-visit', ...chartDataPoints);
    }
  }

  onMonthYearChange() {
    this.setParams();
  }

  getPages(): number[] {
    const totalPages = this.analytics?.last_page || 0;
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  getCurrentPageEnd(): number {
    return Math.ceil(this.analytics?.total_visits / this.analytics?.per_page);
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.analyticsService
      .getPageVisits(this.currentPage, this.selectedMonth, this.selectedYear)
      .subscribe((res) => {
        this.analytics = res;
        this.filteredData = this.analytics?.data;
      });

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
    this.analyticsService.deleteAnalytics(id).subscribe((res) => {
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
