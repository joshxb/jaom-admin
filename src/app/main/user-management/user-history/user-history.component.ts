import { AfterViewInit, Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { imageUrls } from 'src/app/app.component';
import { CacheService } from 'src/app/configuration/assets/cache.service';
import { Order, ItemsPerPage } from 'src/app/configuration/enums/order.enum';
import { UsersManagementService } from 'src/app/configuration/services/user-management/user.management.service';

@Component({
  selector: 'app-user-history',
  templateUrl: './user-history.component.html',
  styleUrls: ['./user-history.component.css']
})
export class UserHistoryComponent implements OnInit, AfterViewInit {

  // Initialize imageUrls object
  imageUrls = new imageUrls();

  // Bindable properties
  searchTerm: string = '';
  userHistoryData!: any;
  selectedUser: any;
  filteredUserHistory: any[] = [];
  isSpinnerLoading: boolean = false;

  // Enums
  order: Order = Order.Desc;
  orderEnum = Order;
  itemEnum = ItemsPerPage;
  currentPage = 1;
  itemsPerPage = ItemsPerPage.Ten; //default

  // Modal properties
  showConfirmationModal = false;
  userHistoryToDeleteId!: number;

  constructor(
    private usersManagementService: UsersManagementService,
    private router: Router,
    private route: ActivatedRoute,
    private elRef: ElementRef,
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private cacheService: CacheService
  ) {}

  // Open confirmation modal
  openConfirmationModal(chat_id: number) {
    this.isSpinnerLoading = true;
    setTimeout(() => {
      this.isSpinnerLoading = false;
      this.userHistoryToDeleteId = chat_id;
      this.showConfirmationModal = true;
    }, 1000);
  }

  // Close confirmation modal
  closeConfirmationModal() {
    this.showConfirmationModal = false;
  }

  // Confirm delete
  confirmDelete() {
    this.deleteSpecificUserHistory(this.userHistoryToDeleteId);
    this.closeConfirmationModal();
  }

  ngAfterViewInit() {
    const sb = this.elementRef.nativeElement.querySelector(
      '#sidebarCollapseBtn'
    );
    this.renderer.listen(sb, 'click', () => {
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

  // Apply search filter
  applySearchFilter() {
    if (!this.searchTerm) {
      this.filteredUserHistory = this.userHistoryData?.data;
    } else {
      this.filteredUserHistory = this.userHistoryData?.data.filter(
        (user: { [s: string]: unknown } | ArrayLike<unknown>) =>
          Object.values(user).some((value) => {
            if (typeof value == 'string') {
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

      this.fetchUserHistoryData(this.currentPage, this.order, this.itemsPerPage);
    });
  }

  // Fetch user history data
  fetchUserHistoryData(page: number, order: Order = Order.Null, items: ItemsPerPage = ItemsPerPage.Null) {
    this.isSpinnerLoading = true;

    this.usersManagementService.getUserHistoryData(page, order, items).subscribe((res) => {
      this.isSpinnerLoading = false;
      this.userHistoryData = res;
      this.filteredUserHistory = this.userHistoryData?.data;
    });
  }

  // Get pages array
  getPages(): number[] {
    const totalPages = this.userHistoryData?.last_page || 0;
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  // Get current page end
  getCurrentPageEnd(): number {
    return Math.ceil(
      this.userHistoryData?.total / this.userHistoryData?.per_page
    );
  }

  // On page change
  onPageChange(page: number, order: Order = Order.Null, items: ItemsPerPage = ItemsPerPage.Null) {
    this.currentPage = page;

    if (order) {
      this.order = order;
    }

    if (items) {

