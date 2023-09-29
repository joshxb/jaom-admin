import { AfterViewInit, Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { imageUrls } from 'src/app/app.component';
import { CacheService } from 'src/app/configuration/assets/cache.service';
import { UsersService } from 'src/app/configuration/services/pages/users.service';

@Component({
  selector: 'app-admin-access',
  templateUrl: './admin-access.component.html',
  styleUrls: ['./admin-access.component.css'],
})
export class AdminAccessComponent implements OnInit, AfterViewInit {
  imageUrls = new imageUrls();
  search: string = '';
  showLoading: boolean = true;
  showEmptyData: boolean = true;
  data: any = [];
  isSpinnerLoading: boolean = false;

  constructor(
    private userService: UsersService,
    private elRef: ElementRef,
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private cacheService: CacheService
    ) {}

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
    }

  ngOnInit(): void {
    this.isSpinnerLoading = true;
    const theme = this.cacheService.getCachedAdminData('theme');
    this.cacheService.themeChange(this.renderer, this.elRef.nativeElement, theme);

    this.userService.adminAccessUsers().subscribe((res) => {
      this.isSpinnerLoading = false;
      this.showLoading = false;
      const { data } = res;
      this.data = data;
      this.showEmptyData = data.length > 0 ? false : true;

      const emptyData = this.elRef.nativeElement.querySelector('.empty-data');
      if (data.length > 0) {
        emptyData.style.display = 'none';
      } else {
        emptyData.style.display = 'block';
      }
    });
  }

  removeAdminAccess(id: number) {
    this.isSpinnerLoading = true;
    this.userService
      .updateOtherUserData(id, { type: 'local' })
      .subscribe((res) => {
        this.isSpinnerLoading = false;
        this.elRef.nativeElement.querySelector(
          '.remove-dialog-message'
        ).style.display = 'block';
        setTimeout(() => {
          this.elRef.nativeElement.querySelector(
            '.remove-dialog-message'
          ).style.display = 'none';
          this.search = '';
          this.data = [];
          location.reload();
        }, 2000);
      });
  }
}
