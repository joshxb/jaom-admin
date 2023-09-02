import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { Component, ElementRef, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { imageUrls } from 'src/app/app.component';
import { UsersManagementService } from 'src/app/configuration/services/user-management/user.management.service';
import { ModalComponent } from '../../modal/modal.component';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css'],
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
export class TodoComponent implements OnInit {
  imageUrls = new imageUrls();

  searchTerm: string = '';
  todoData!: any;
  selectedUser: any;
  filteredTodos: any[] = [];

  currentPage = 1;
  itemsPerPage = 1;

  constructor(
    private usersManagementService: UsersManagementService,
    private router: Router,
    private route: ActivatedRoute,
    private elRef: ElementRef,
    private dialog: MatDialog
  ) {}

  applySearchFilter() {
    if (!this.searchTerm) {
      this.filteredTodos = this.todoData?.data;
    } else {
      this.filteredTodos = this.todoData?.data.filter(
        (chat: { [s: string]: unknown } | ArrayLike<unknown>) =>
          Object.values(chat).some((value) => {
            if (typeof value === 'string') {
              return value
                .toLowerCase()
                .includes(this.searchTerm.toLowerCase());
          }else if (typeof value === 'number') {
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
      this.fetchTodoData(this.currentPage);
    });
  }

  fetchTodoData(page: number) {
    this.usersManagementService.getAllTodoData(page).subscribe((res) => {
      this.todoData = res[0];
      this.filteredTodos = this.todoData?.data;
    });
  }

  getPages(): number[] {
    const totalPages = this.todoData?.last_page || 0;
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  getCurrentPageEnd(): number {
    return Math.ceil(this.todoData?.total / this.todoData?.per_page);
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.fetchTodoData(page);

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
    const totalPages = this.todoData?.last_page || 0;
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

  deleteSpecificTodo(id: any) {
    this.usersManagementService.deleteSpecificTodo(id).subscribe((res) => {
      const deleteDialogMessage = this.elRef.nativeElement.querySelector(
        '.delete-dialog-message'
      );
      const deleteDialogMessageP = this.elRef.nativeElement.querySelector(
        '.delete-dialog-message p'
      );

      deleteDialogMessageP.textContent = res?.message;
      deleteDialogMessage.style.display = 'block';

      setTimeout(() => {
        window.location.reload();
      }, 2000);
    });
  }
}
