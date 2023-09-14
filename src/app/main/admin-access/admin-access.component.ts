import { Component, ElementRef, OnInit } from '@angular/core';
import { Subject, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { imageUrls } from 'src/app/app.component';
import { UsersService } from 'src/app/configuration/services/pages/users.service';

@Component({
  selector: 'app-admin-access',
  templateUrl: './admin-access.component.html',
  styleUrls: ['./admin-access.component.css'],
})
export class AdminAccessComponent implements OnInit {
  imageUrls = new imageUrls();
  search: string = '';
  showLoading: boolean = true;
  showEmptyData: boolean = true;
  data: any = [];

  constructor(private userService: UsersService, private elRef: ElementRef) {}

  ngOnInit(): void {
    this.userService.adminAccessUsers().subscribe((res) => {
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
    this.userService
      .updateOtherUserData(id, { type: 'local' })
      .subscribe((res) => {
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
