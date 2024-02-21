import { NotificationService } from './../../configuration/services/pages/notification.service';
import { AfterViewInit, Component, ElementRef, Renderer2 } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { imageUrl, s } from 'src/app/app.component';
import { ModalComponent } from '../modal/modal.component';
import { ConcernService } from 'src/app/configuration/services/concerns/concern.service';
import { NotificationEnum } from 'src/app/configuration/enums/notifications.enum';
import { CacheService } from 'src/app/configuration/assets/cache.service';
import { Order, ItemsPerPage } from 'src/app/configuration/enums/order.enum';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit, AfterViewInit {
  // Initialize imageUrls object
  imageUrls = new imageUrls();

  // Binding property for search input
  searchTerm: string = '';
  // Binding property for feedbacks data
  feedbacksData!: any;
  // Selected user object
  selectedUser: any;
  // Filtered feedbacks array
  filteredFeedbacks: any[] = [];
  // Array to store textarea values
  textareaVales: string[] = [];
  // Spinner loading flag
  isSpinnerLoading: boolean = false;

  // Order enum instance
  order: Order = Order.Desc;
  // Order enum reference
  orderEnum = Order;
  // Items per page enum reference
  itemEnum = ItemsPerPage;
  // Current page number
  currentPage = 1;
  // Default items per page value
  itemsPerPage = ItemsPerPage.Ten;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private elRef: ElementRef,
    private dialog: MatDialog,
    private concernService: ConcernService,
    private notificationService: NotificationService,
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private cacheService: CacheService
  ) {}

  ngAfterViewInit() {
    // Get sidebar collapse button and add click event listener
    const scb = this.elementRef.nativeElement.querySelector('#sidebarCollapseBtn');
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
      this.filteredFeedbacks = this.feedbacksData?.data;
    } else {
      this.filteredFeedbacks = this.feedbacksData?.data.filter((chat: { [s: string]: unknown } | ArrayLike<unknown>) =>
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

  openDialog(s: any, any, type: string) {
    const dialogRef = this.dialog.open(ModalComponent, {
      data: { content: `${s}`, level: type },
    });

    dialogRef.afterClosed().subscribe((result) => {});
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

      this.fetchFeedbacksData(this.currentPage, this.order, Order.Null, this.itemsPerPage, ItemsPerPage.Null);
    });
  }

  fetchFeedbacksData(page: number, order: Order, orderEnum: Order, items: ItemsPerPage, itemsPerPageEnum: ItemsPerPage) {
    this.isSpinnerLoading = true;
    this.concernService.getFeedbacks(page, orderEnum, order, items).subscribe((res) => {
      this.isSpinnerLoading = false;
      this.feedbacksData = res;
      this.filteredFeedbacks = this.feedbacksData?.data;
    });
  }

  getPages(): number[] {
    const totalPages = this.feedbacksData?.last_page || 0;
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  getCurrentPageEnd(): number {
    return Math.ceil(this.feedbacksData?.total / this.feedbacksData?.per_page);
  }

  onPageChange(page: number, order: Order, orderEnum: Order, items: ItemsPerPage) {
    this.currentPage = page;

    if (order) {
      this.order = order;
    }
