import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  Renderer2,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { imageUrls } from 'src/app/app.component';
import { Base } from 'src/app/configuration/configuration.component';
import { AdminService } from 'src/app/configuration/services/pages/admin.service';
import { DashboardService } from 'src/app/configuration/services/dashboard/dashboard.service';
import { DateService } from 'src/app/configuration/assets/date.service';
import ChartType, { ChartService } from 'src/app/configuration/assets/chart.service';
import { CacheService } from 'src/app/configuration/assets/cache.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, AfterViewInit {
  imageUrls = new imageUrls();
  serverData: any;

  constructor(
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private dashboardService: DashboardService,
    private adminService: AdminService,
    private route: ActivatedRoute,
    private router: Router,
    private dateService: DateService,
    private chartService: ChartService,
    private cacheService: CacheService,
    private elRef: ElementRef,
  ) {
  }

  base = new Base();
  public data: any;
  public donationTransactions: any;
  public userCounts = 0;
  public userStatusCounts: any;
  public chatCounts = 0;
  public roomCounts = 0;
  public updateCounts = 0;
  isSpinnerLoading: boolean = false;

  private page = 1;

  selectedMonth: string = '';
  selectedMonthIndex: number = Number(new Date().getMonth());
  selectedYear: number = new Date().getFullYear();

  yearOptions: number[] = this.dateService.generateYearOptions();

  async ngOnInit(): Promise<void> {
    const theme = this.cacheService.getCachedAdminData('theme');
    this.cacheService.themeChange(this.renderer, this.elRef.nativeElement, theme);

    this.setCurrentMonthAndYear();
    this.getUserCounts();
    this.countUsersByStatus();
    this.getChatCounts();
    this.getRoomCounts();
    this.getUpdateCounts();
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

    this.renderChartData();
    this.initializeServerChartHorizonalLeftBar();
  }

  initializeServerChartHorizonalLeftBar() {
    this.adminService.getServerConfiguration().subscribe((res) => {
      const { tableStatus } = res;
      this.serverData = res;

      let chartDataPoints: { y: number; label: string; indexLabel: string; indexLabelFontColor: string; indexLabelFontSize: number }[] = tableStatus.map((table: any) => {
        const dataLength = table.data_length !== undefined ? table.data_length : table.DATA_LENGTH;
        const tableName = table.table_name !== undefined ? table.table_name : table.TABLE_NAME;
        const indexLength = table.index_length !== undefined ? table.index_length : table.INDEX_LENGTH;

        const storageMB = (dataLength + indexLength) / 1024;
        const storageLabel = `${storageMB < 1000 ? storageMB : storageMB / 1000}` + `${storageMB < 1000 ? ' kb' : ' mb'}`;

        return {
            y: storageMB,
            label: tableName,
            indexLabel: storageLabel,
            indexLabelFontColor: "black",
            indexLabelFontSize: 14
        };
    });

      this.chartService.initializeChart(ChartType.Bar, 'server-info', ...chartDataPoints);
    });
  }

  async setCurrentMonthAndYear() {
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
          await this.getDonationTransactions(this.page, month, Number(year));
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

    this.router.navigate([''], {
      relativeTo: this.route,
      queryParams: defaultParams,
      queryParamsHandling: 'merge',
    });
  }

  async getDonationTransactions(
    page: number,
    selectedMonth: string,
    selectedYear: number
  ): Promise<void> {
    try {
      const res = await this.dashboardService
        .getDonationTransactions(page, selectedMonth, selectedYear)
        .toPromise();
      this.donationTransactions = res;

      this.renderChartData();
      this.isSpinnerLoading = false;
    } catch (error) {
      console.error('Error fetching donation transactions:', error);
    }
  }

  renderChartData() {
    if (this.donationTransactions) {
      let chartDataPoints: { x: Date; y: number; indexLabel: string }[] = [];

      this.donationTransactions.transactions.forEach((response: any) => {
        const date = new Date(response?.date);
        const monthIndex = date.getMonth();
        const dayOfMonth = date.getDate();
        const year = date.getFullYear();

        chartDataPoints.push({
          x: new Date(year, monthIndex, dayOfMonth),
          y: Number(response?.amount),
          indexLabel: response?.amount,
        });
      });

      this.chartService.initializeChart(ChartType.Area, 'transactions', ...chartDataPoints);
    }
  }

  onMonthYearChange() {
    this.setParams();
  }

  getUserCounts() {
    this.adminService.getUserCounts().subscribe((res) => {
      this.userCounts = res?.user_count;
    });
  }

  countUsersByStatus() {
    this.adminService.countUsersByStatus().subscribe((res) => {
      this.userStatusCounts = res;
    });
  }

  getChatCounts() {
    this.dashboardService.getChatCounts().subscribe((res) => {
      this.chatCounts = res?.chat_count;
    });
  }

  getRoomCounts() {
    this.dashboardService.getRoomCounts().subscribe((res) => {
      this.roomCounts = res?.room_count;
    });
  }

  getUpdateCounts() {
    this.dashboardService.getUpdatesCounts().subscribe((res) => {
      this.updateCounts = res?.update_count;
    });
  }
}
