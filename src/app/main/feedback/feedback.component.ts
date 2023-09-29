import { NotificationService } from './../../configuration/services/pages/notification.service';
import { AfterViewInit, Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { imageUrls } from 'src/app/app.component';
import { ModalComponent } from '../modal/modal.component';
import { ConcernService } from 'src/app/configuration/services/concerns/concern.service';
import { NotificationEnum } from 'src/app/configuration/enums/notifications.enum';
import { CacheService } from 'src/app/configuration/assets/cache.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit, AfterViewInit {
  imageUrls = new imageUrls();

  searchTerm: string = '';
  feedbacksData!: any;
  selectedUser: any;
  filteredFeedbacks: any[] = [];
  textareaValues: string[] = [];
  isSpinnerLoading: boolean = false;

  currentPage = 1;
  itemsPerPage = 1;

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
  }

  applySearchFilter() {
    if (!this.searchTerm) {
      this.filteredFeedbacks = this.feedbacksData?.data;
    } else {
      this.filteredFeedbacks = this.feedbacksData?.data.filter(
        (chat: { [s: string]: unknown } | ArrayLike<unknown>) =>
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

  openDialog(s: any, type: string) {
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
      this.fetchFeedbacksData(this.currentPage);
    });
  }

  fetchFeedbacksData(page: number) {
    this.isSpinnerLoading = true;
    this.concernService.getFeedbacks(page).subscribe((res) => {
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

  onPageChange(page: number) {
    this.currentPage = page;
    this.fetchFeedbacksData(page);

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: this.currentPage },
      queryParamsHandling: 'merge',
    });
  }

  getStartingIndex(): number {
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  getPageRange(): number[] {
    const totalPages = this.feedbacksData?.last_page || 0;
    const displayedPages = Math.min(totalPages, 5);
    const startPage = Math.max(
      this.currentPage - Math.floor(displayedPages / 2),
      1
    );
    const endPage = Math.min(startPage + displayedPages - 1, totalPages);
    return Array.from(
      { length: endPage - startPage + 1 },
      (_, index) => startPage + index
    );
  }

  deleteFeedback(id: any) {
    this.isSpinnerLoading = true;
    this.concernService.deleteFeedback(id).subscribe((res) => {
      this.isSpinnerLoading = false;
      const deleteDialogMessage = this.elRef.nativeElement.querySelector(
        '.delete-dialog-message'
      );

      deleteDialogMessage.style.display = 'block';

      setTimeout(() => {
        window.location.reload();
      }, 2000);
    });
  }

  addResponse(
    other_id: number,
    id: number,
    description: string,
    responseObject: any,
    response: string
  ) {
    this.isSpinnerLoading = true;
    try {
      const decodedResponse = JSON.parse(responseObject.trim());
      if (Array.isArray(decodedResponse)) {
        if (response) {
          decodedResponse.unshift(response.trim());

          const data = {
            response_object: JSON.stringify(decodedResponse),
          };

          this.concernService.addResponseFeedback(id, data).subscribe((res) => {
            this.isSpinnerLoading = false;
            let parsedData: number[] = [];
            parsedData.push(other_id);

            const data = {
              userIds: parsedData,
              title: `${NotificationEnum.ResponseConcernNotification}: ${description}`,
              name: ``,
              content: `Response: ${response.trim()}`,
              type: 'newMemberChatNotification',
            };

            this.notificationService
              .addNewNotification(data)
              .subscribe((response) => {
                this.elRef.nativeElement.querySelector(
                  '.add-response-dialog-message'
                ).style.display = 'block';

                setTimeout(() => {
                  window.location.reload();
                }, 1000);
              });
          });
        } else {
          this.isSpinnerLoading = false;
          const emptyDialog = this.elRef.nativeElement.querySelector(
            '.empty-dialog-message'
          );
          emptyDialog.style.display = 'block';

          setTimeout(() => {
            emptyDialog.style.display = 'none';
          }, 2000);
        }
      } else {
        this.isSpinnerLoading = false;
        console.error('Decoded response is not an array.');
      }
    } catch (error) {
      this.isSpinnerLoading = false;
      console.error('JSON parsing error:', error);
    }
  }
}
