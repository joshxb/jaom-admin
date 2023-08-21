import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UsersService } from './users.service';
import { ChatsService } from './chats.service';

@Injectable({
  providedIn: 'root',
})
export class UsersManagementService {
  constructor(
    private usersService: UsersService,
    private chatsService: ChatsService
  ) {}

  getAllUserData(page: number): Observable<any> {
    return this.usersService.getAllUserData(page);
  }

  geSpecificUserData(user: number): Observable<any> {
    return this.usersService.geSpecificUserData(user);
  }

  updateOtherUserData(user: number, formData: any) {
    return this.usersService.updateOtherUserData(user, formData);
  }

  updateOtherUserImageData(imageData: any, userId: number): Observable<any> {
    return this.usersService.updateOtherUserImageData(imageData, userId);
  }

  deleteSpecificUser(user: number): Observable<any> {
    return this.usersService.deleteSpecificUser(user);
  }

  getAllChatsData(page: number): Observable<any> {
    return this.chatsService.getAllChatsData(page);
  }

  deleteSpecificMessage(id: number): Observable<any> {
    return this.chatsService.deleteSpecificMessage(id);
  }
}
