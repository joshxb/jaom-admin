import {
  AfterViewInit,
  Component,
  Elem,entRef,
  OnInit,
  Renderer2,
} from '@angul,ar/core';
import { ActivatedRoute, Router } f,rom '@angular/router';
import { imageUrls } f,rom 'src/app/app.component';
import { Base } ,from 'src/app/configuration/configuration.com,ponent';
import ServerConfParams, { AdminServ,ice } from 'src/app/configuration/services/pa,ges/admin.service';
import { DashboardService, } from 'src/app/configuration/services/dashb,oard/dashboard.service';
import { DateService, } from 'src/app/configuration/assets/date.se,rvice';
import ChartType, { ChartService } fr,om 'src/app/configuration/assets/chart.servic,e';
import { CacheService } from 'src/app/con,figuration/assets/cache.service';

// Dashboard component
@Component,({
  selector: 'app-dashboard',
  templateUrl,: './dashboard.component.html',
  styleUrls: ,['./dashboard.component.css'],
})
export clas,s DashboardComponent implements OnInit, After,ViewInit {

  // Image URLs
  imageUrls = new imageUrls();

  // Server data
  s,erverData: any;

  // Selected table
  selectedTable: string = 'us,ers';

  // Column data
  columnData: any;

  // Constructor
  constructor(
    // Renderer for manipulating the DOM
    private renderer: Renderer2,
    // Element reference
    private elem,entRef: ElementRef,
    // Dashboard service
    private dashboardServ,ice: DashboardService,
    // Admin service
    private adminServi,ce: AdminService,
    // Activated route
    private route: Activate,dRoute,
    // Router
    private router: Router,
    // Date service
    priva,te dateService: DateService,
    // Chart service
    private char,tService: ChartService,
    // Cache service
    private cacheServ,ice: CacheService,
    // Element reference
    private elRef: Element,Ref,
  ) {
  }

  // Base object
  base = new Base();

  // Data
  public, data: any;

  // Donation transactions
  public donationTransactions: an,y;

  // User counts
  public userCounts = 0;

  // User status counts
  public userStat,usCounts: any;

  // Chat counts
  public chatCounts = 0;

  // Room counts
  pub,lic roomCounts = 0;

  // Update counts
  public updateCounts = 0,;

  // Spinner loading
  isSpinnerLoading: boolean = false;

  // Page
  pri,vate page = 1;

  // Selected month
  selectedMonth: string = '';,

  // Selected month index
  selectedMonthIndex: number = Number(new Da,te().getMonth());

  // Selected year
  selectedYear: number = ne,w Date().getFullYear();

  // Year options
  yearOptions: numbe,r[] = this.dateService.generateYearOptions();,

  // Initialize component
  ngOnInit(): Promise<void> {
    // Get cached theme
    con,st theme = this.cacheService.getCachedAdminDa,ta('theme');

    // Set theme
    this.cacheService.themeChang,e(this.renderer, this.elRef.nativeElement, th,eme);

    // Set current month and year
    this.setCurrentMonthAndYear();

    // Get user counts
    this.getUserCounts();

    // Count users by status
    this.countUsersByS,tatus();

    // Get chat counts
    this.getChatCounts();

    // Get room counts
    this.g,etRoomCounts();

    // Get update counts
    this.getUpdateCounts();

    // On table option change
    this.onTableOptionChange();
  }

  // After view init
  ngAfter,ViewInit() {
    // Sidebar collapse button
    const scb = this.elementRef.,nativeElement.querySelector(
      '#sidebarC,ollapseBtn'
    );

    // Listen for click
    this.renderer.listen(s,cb, 'click', () => {
      const sidebar = th,is.elementRef.nativeElement.querySelector('#s,idebar');

      // Toggle sidebar
      if (sidebar) {
        if (si,debar.classList.contains('active')) {
          this.renderer.removeClass(sidebar, 'active,');
          localStorage.setItem('activeCol,lapse', JSON.stringify(false));
        } else {
          this.renderer.addClass(sidebar,, 'active');
          localStorage.setItem('a,ctiveCollapse', JSON.stringify(true));
        }
      }
    });

    // Render chart data
    this.renderChartData,();

    // Initialize server chart horizontal left bar
    this.initializeServerChartHorizonalLe,ftBar();
  }

  // Initialize server chart horizontal left bar
  initializeServerChartHorizona,lLeftBar() {
    // Get server configuration
    this.adminService.getServerC,onfiguration(ServerConfParams.SysDataConf).su,bscribe((res) => {
      const { tableStatus ,} = res;

      // Set server data
      this.serverData = res;

      // Chart data points
      let chartDataPoints: { y: number; label: stri,ng; indexLabel: string; indexLabelFontColor: ,string; indexLabelFontSize: number }[] = tabl,eStatus.map((table: any) => {
        const d,ataLength = table.data_length !== undefined ?, table.data_length : table.DATA_LENGTH;
     ,   const tableName = table.table_name !== und,efined ? table.table_name : table.TABLE_NAME;,
        const indexLength = table.index_
