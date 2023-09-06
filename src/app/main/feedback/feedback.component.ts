import { Component, ElementRef, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { imageUrls } from 'src/app/app.component';
import { UsersManagementService } from 'src/app/configuration/services/user-management/user.management.service';
import { ModalComponent } from '../modal/modal.component';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { ConcernService } from 'src/app/configuration/services/concerns/concern.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css'],
  animations: [
    trigger('modalAnimation', [
      state(
        'active',
        style({
          transform: 'translateY(0)',
          opacity: 1,
        })
      ),
      transition('void => active', [
        style({
          transform: 'translateY(-20px)',
          opacity: 0,
        }),
        animate('300ms ease'),
      ]),
    ]),
  ],
})
export class FeedbackComponent implements OnInit {
  imageUrls = new imageUrls();

  searchTerm: string = '';
  feedbacksData!: any;
  selectedUser: any;
  filteredFeedbacks: any[] = [];
  textareaValues: string[] = [];

  currentPage = 1;
  itemsPerPage = 1;

  constructor(
    private usersManagementService: UsersManagementService,
    private router: Router,
    private route: ActivatedRoute,
    private elRef: ElementRef,
    private dialog: MatDialog,
    private concernService: ConcernService
  ) {}

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
    this.concernService.getFeedbacks(page).subscribe((res) => {
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
    this.concernService.deleteFeedback(id).subscribe((res) => {
      const deleteDialogMessage = this.elRef.nativeElement.querySelector(
        '.delete-dialog-message'
      );

      deleteDialogMessage.style.display = 'block';

      setTimeout(() => {
        window.location.reload();
      }, 2000);
    });
  }

  addResponse(id: number, responseObject: any, response: string) {
    console.log(responseObject);
    try {
      const decodedResponse = JSON.parse(responseObject.trim());
      if (Array.isArray(decodedResponse)) {
        if (response) {
          decodedResponse.unshift(response.trim());

          const data = {
            response_object: JSON.stringify(decodedResponse),
          };

          this.concernService.addResponseFeedback(id, data).subscribe((res) => {
            this.elRef.nativeElement.querySelector(
              '.add-response-dialog-message'
            ).style.display = 'block';

            setTimeout(() => {
              window.location.reload();
            }, 1000);
          });
        } else {
          const emptyDialog = this.elRef.nativeElement.querySelector(
            '.empty-dialog-message'
          );
          emptyDialog.style.display = 'block';

          setTimeout(() => {
            emptyDialog.style.display = 'none';
          }, 2000);
        }
      } else {
        console.error('Decoded response is not an array.');
      }
    } catch (error) {
      console.error('JSON parsing error:', error);
    }
  }
}
