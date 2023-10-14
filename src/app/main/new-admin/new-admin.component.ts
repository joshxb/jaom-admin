import { AfterViewInit, Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { Subject, debounceTime, distinctUntilChanged, forkJoin, switchMap } from 'rxjs';
import { imageUrls } from 'src/app/app.component';
import { CacheService } from 'src/app/configuration/assets/cache.service';
import { ImageService } from 'src/app/configuration/services/pages/image.service';
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
    private cacheService: CacheService,
    private imageService: ImageService
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
        switchMap((term) => this.userService.searchUser(term, this.currentPage, 'v2'))
      )
      .subscribe((res) => {
        this.showLoading = false;
        this.data = res?.data;

        const accessAdminObservables = this.data.map((data: { id: number }) => {
          return this.imageService.getOtherUserImageData(data.id);
        });

        forkJoin(accessAdminObservables).subscribe((data: any) => {
          data.forEach(
            (imageData: Blob | MediaSource, index: string | number) => {
              this.data[index].image_blob = URL.createObjectURL(imageData);
            }
          );
        });

        this.showEmptyData = res?.data.length > 0 ? false : true;

        const emptyData = this.elRef.nativeElement.querySelector('.empty-data');
        if (res?.data.length > 0) {
          emptyData.style.display = 'none';
        } else {
          emptyData.style.display = 'block';
        }
      });
      this.searchTerms.next(' ');
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
