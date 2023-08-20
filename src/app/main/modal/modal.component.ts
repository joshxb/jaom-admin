import { Component, Inject } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from '@angular/material/dialog';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
})
export class ModalComponent {
  selectedUserId!: number;
  canLeaveType!: string;
  userIds: any;

  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,

    private dialog: MatDialog
  ) {}

  ngOnInit(): void {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  confirmLeave(): void {
    if (this.canLeaveType.trim() == 'owner') {
    } else {
    }
  }

  continueRemove() {}

  openDialog(data: any, type: string) {
    const dialogRef = this.dialog.open(ModalComponent, {
      data: { content: `${data}`, level: type },
    });

    dialogRef.afterClosed().subscribe((result: any) => {});
  }
}
