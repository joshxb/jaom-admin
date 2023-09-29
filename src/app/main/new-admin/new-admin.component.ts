import { AfterViewInit, Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { Subject, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { imageUrls } from 'src/app/app.component';
import { CacheService } from 'src/app/configuration/assets/cache.service';
import { UsersService } from 'src/app/configuration/services/pages/users.service';

@Component({
  selector: 'app-new-admin',
  templateUrl: './new-admin.component.html',
  styleUrls: ['./new-admin.component.css'],
})
export class NewAdminComponent implements OnInit, AfterViewInit {
  imageUrls = new imageUrls();
  search: string = '';
  showLoading: boolean = false;
  showEmptyData: boolean = true;
  currentPage = 1;
  data: any = [];
  isSpinnerLoading: boolean = false;

  private searchTerms = new Subject<string>();

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
    setTimeout(() => {
      this.isSpinnerLoading = false;
    }, 1000);
    const theme = this.cacheService.getCachedAdminData('theme');
    this.cacheService.themeChange(this.renderer, this.elRef.nativeElement, theme);

    this.searchTerms
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((term) => this.userService.searchUser(term, this.currentPage))
      )
      .subscribe((res) => {
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

  searchKey(): void {
    this.showLoading = true;
    if (this.search != '') {
      this.searchTerms.next(this.search);
    } else {
      this.showLoading = false;
    }
  }

  addAdmin(id: number) {
    this.isSpinnerLoading = true;
    this.userService
      .updateOtherUserData(id, { type: 'admin' })
      .subscribe((res) => {
        this.isSpinnerLoading = false;
        this.elRef.nativeElement.querySelector(
          '.add-dialog-message'
        ).style.display = 'block';
        setTimeout(() => {
          this.elRef.nativeElement.querySelector(
            '.add-dialog-message'
          ).style.display = 'none';
          this.search = '';
          this.data = [];
        }, 2000);
      });
  }
}
