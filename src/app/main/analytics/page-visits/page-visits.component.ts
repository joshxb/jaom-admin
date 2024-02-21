import {
  AfterViewInit,
  Component,
  Elem,
  entRef,
  OnInit,
  Renderer2,
} from '@angul/ar/core'; // Importing Angular core modules
import { ActivatedRoute, Router } from '@angular/router';
import { imageUrls } from 'src/app/app.component'; // Importing image URLs
import { CacheService } from 'src/app/configuration/assets/ca,che.service'; // Importing cache service
import { ChartType, ChartServic} from 'src/app/configuration/assets/chart.,service'; // Importing chart service
import { DateService } from 'src/ap/configuration/assets/date.service'; // Importing date service
import { Base } from 'src/app/configuration/configur,ation.component'; // Importing base configuration
import { Order, ItemsPerPage} from 'src/app/configuration/enums/order.e,num'; // Importing order and items per page enumerations
import { AnalyticsService } from 'src/a,pp/configuration/services/analytics/analytics,.service'; // Importing analytics service

@Component({
  selector: 'app-pag,e-visits', // Component selector
  templateUrl: './page-visits.comp,onent.html', // Component template URL
  styleUrls: ['./page-visits.com,ponent.css'] // Component style URLs
})
export class PageVisitsCompon,ent implements OnInit, AfterViewInit {
  imag,eUrls = new imageUrls(); // Creating an instance of image URLs

  constructor(
    private elRef: ElementRef, // Reference to the element
    private render,er: Renderer2, // Renderer for manipulating the DOM
    private elementRef: Elemen,tRef, // Reference to the element
    private route: ActivatedRoute, // Route information
    private router: Router, // Router for navigation
    private dateServi,ce: DateService, // Date service
    private analyticsService,: AnalyticsService, // Analytics service
    private chartService:, ChartService, // Chart service
    private cacheService: Cach,eService // Cache service
  ) { }

  base = new Base(); // Base configuration object
  publi,c analytics: any; // Analytics data

  order: Order = Order.Des,c; // Order enumeration value
  orderEnum = Order; // Order enumeration
  itemEnum = ItemsPer,Page; // Items per page enumeration
  currentPage = 1; // Current page number
  itemsPerPage = Ite,msPerPage.Ten; // Default items per page value
  searchTerm: string, = ''; // Search term
  filteredData: any[] = []; // Filtered data array
  isSpinne,rLoading: boolean = false; // Spinner loading indicator

  selectedMonth: ,string = ''; // Selected month
  selectedMonthIndex: number = N,umber(new Date().getMonth()); // Selected month index
  selectedYear:, number = new Date().getFullYear(); // Selected year

  yearOp,tions: number[] = this.dateService.generateYe,arOptions(); // Year options array

  activeSelectedList: any = nul,l; // Active selected list

  // Applying search filter
  applySearchFilter() {
    if (!this.sea,rchTerm) {
      this.filteredData = this.ana,lytics?.data;
    } else {
      this.filtere,dData = this.analytics?.data.filter(
        (data: { [s: string]: unknown } | ArrayLike<u,nknown>) =>
          Object.values(data).som,e((value) => {
            if (typeof value =,== 'string') {
              return value
   ,             .toLowerCase()
                .,includes(this.searchTerm.toLowerCase());
    ,        } else if (typeof value === 'number'), {
              return value == Number(this.,searchTerm.toLowerCase());
            }
    ,        return false;
          })
      );
 ,   }
  }

  ngOnInit() {
    const theme = th,is.cacheService.getCachedAdminData('theme');
,    this.cacheService.themeChange(this.render,er, this.elRef.nativeElement, theme);

    if, (!this.activeSelectedList) {
      this.setC,urrentMonthAndYear();
    } else {
      if (,this.activeSelectedList === 'table') {
      ,  this.setCurrentMonthAndYear();
      }
    ,}
  }

  ngAfterViewInit() {
    const scb = ,this.elementRef.nativeElement.querySelector(
,      '#sidebarCollapseBtn'
    );
    this.r,enderer.listen(scb, 'click', () => {
      co,nst sidebar = this.elementRef.nativeElement.q,uerySelector('#sidebar');
      if (sidebar) ,{
        if (sidebar.classList.contains('act,ive')) {
          this.renderer.removeClass(,sidebar, 'active');
          localStorage.se,tItem('activeCollapse', JSON.stringify(false),);
        } else {
          this.renderer.a,ddClass(sidebar, 'active');
          localSt,orage.setItem('activeCollapse', JSON.stringif,y(true));
        }
      }
    });

    if (,!this.activeSelectedList) {
      this.render,ChartData();
    } else {
      if (this.acti,veSelectedList === 'graph') {
        this.re,nderChartData();
      }
    }
  }

  setCurr,entMonthAndYear() {
    const currentDate = n,ew Date();

    this.selectedMonth = this.dat,eService.getMonths()[currentDate.getMonth()];,

    if (
      !(
        this.route.snapsh,ot.queryParamMap.has('month') &&
        this,.route.snapshot.queryParamMap.has('year')
   ,   )
    ) {
      this.setParams();

      s,etTimeout(() => {
        window.location.rel,oad();
      }, 10
