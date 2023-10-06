import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  Renderer2,
} from '@angular/core';
import { forkJoin } from 'rxjs';
import { imageUrls } from 'src/app/app.component';
import { CacheService } from 'src/app/configuration/assets/cache.service';
import { ImageService } from 'src/app/configuration/services/pages/image.service';
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
    const theme = this.cacheService.getCachedAdminData('theme');
    this.cacheService.themeChange(
      this.renderer,
      this.elRef.nativeElement,
      theme
    );

    this.userService.adminAccessUsers().subscribe((res) => {
      this.isSpinnerLoading = false;
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
