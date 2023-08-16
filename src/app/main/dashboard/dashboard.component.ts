import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CanvasJS, CanvasJSChart } from '@canvasjs/angular-charts';
import { imageUrls } from 'src/app/app.component';
import { Base, Redirects } from 'src/app/configuration/configuration.component';
import { AdminService } from 'src/app/configuration/services/admin.service';
import { DashboardService } from 'src/app/configuration/services/dashboard/dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('chart')
  chart!: CanvasJSChart;

  imageUrls = new imageUrls();

  constructor(
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private dashboardService: DashboardService,
    private adminService: AdminService,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  base = new Base();
  private baseUrl = this.base.baseUrl;
  public data: any;
  public donationTransactions: any;
  public userCounts = 0;
  public userStatusCounts: any;
  public chatCounts = 0;
  public roomCounts = 0;
  public updateCounts = 0;

  private page = 1;

  selectedMonth: string = '';
  selectedMonthIndex: number = Number(new Date().getMonth());
  selectedYear: number = new Date().getFullYear();

  yearOptions: number[] = this.generateYearOptions();

  async ngOnInit(): Promise<void> {
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
        } else {
          this.renderer.addClass(sidebar, 'active');
        }
      }
    });

    this.renderChartData();
  }

  getMonths() {
    const monthNames = [
      'january',
      'february',
      'march',
      'april',
      'may',
      'june',
      'july',
      'august',
      'september',
      'october',
      'november',
      'december',
    ];

    return monthNames;
  }

  async setCurrentMonthAndYear() {
    const currentDate = new Date();

    this.selectedMonth = this.getMonths()[currentDate.getMonth()];
    // Set default parameters or the desired initial values

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

      this.initializeChart(...chartDataPoints);
    } else {
    }
  }

  generateYearOptions(): number[] {
    const currentYear = new Date().getFullYear();
    const startYear = 2022;
    const yearRange = currentYear - startYear + 1;
    return Array.from({ length: yearRange }, (_, index) => startYear + index);
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
      //active_user_count , inactive_user_count
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

  initializeChart(...dataPoints: any) {
    var chart;

    if (dataPoints.length > 0) {
      chart = new CanvasJS.Chart('chartContainer', {
        title: {
          text: '',
        },
        animationEnabled: true,
        axisX: {
          interval: 4,
          intervalType: 'day',
          valueFormatString: 'M-DD-YY', // Format for x-axis labels
        },
        data: [
          {
            type: 'area',
            dataPoints: [...dataPoints],
          },
        ],
      });
    } else {
      chart = new CanvasJS.Chart('chartContainer', {
        title: {
          text: 'No Donation Transactions Data',
          fontSize: 18, // Adjust the font size
          horizontalAlign: 'center', // Center align the title
        },
      });
    }

    chart.render();
  }
}
