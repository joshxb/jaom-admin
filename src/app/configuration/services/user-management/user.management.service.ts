import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UsersService } from '../pages/users.service';
import { ChatsService } from '../pages/chats.service';
import { RoomService } from '../pages/room.service';
import { UpdatesService } from '../pages/updates.service';
import { TodoService } from '../pages/todo.service';
import { AdminService } from '../pages/admin.service';

@Injectable({
  providedIn: 'root',
})
export class UsersManagementService {
  constructor(
    private usersService: UsersService,
    private chatsService: ChatsService,
    private roomService: RoomService,
    private updateService: UpdatesService,
    private todoService: TodoService,
    private adminService: AdminService
  ) {}

  getAllUserData(page: number, request: any = null): Observable<any> {
    return this.usersService.getAllUserData(page, request);
  }

  geSpecificUserData(user: number, request: any = null): Observable<any> {
    return this.usersService.geSpecificUserData(user, request);
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

  getRoomList(page: number, access: string = 'local'): Observable<any> {
    return this.roomService.getRoomList(page, access);
  }

  getRoomChatList(page: number): Observable<any> {
    return this.roomService.getRoomChatList(page);
  }

  deleteRoom(id: number): Observable<any> {
    return this.roomService.deleteRoom(id);
  }

  deleteSpecificRoomChat(id: number): Observable<any> {
    return this.roomService.deleteSpecificRoomChat(id);
  }

  getAllUpdates(page: number): Observable<any> {
    return this.updateService.getAllUpdates(page);
  }

  deleteSpecificUpdate(id: number): Observable<any> {
    return this.updateService.deleteSpecificUpdate(id);
  }

  updatePermission(data: any, id: number): Observable<any> {
    return this.updateService.updatePermission(data, id);
  }

  getAllTodoData(page: number): Observable<any> {
    return this.todoService.getAllTodoData(page);
  }

  deleteSpecificTodo(id: number): Observable<any> {
    return this.todoService.deleteSpecificTodo(id);
  }

  getUserHistoryData(page: number): Observable<any> {
    return this.adminService.getUserHistoryData(page);
  }

  deleteUserHistory(id: number): Observable<any> {
    return this.adminService.deleteUserHistory(id);
  }
}
