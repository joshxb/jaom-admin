import { Injectable } from '@angular/core';
import { RoomService } from '../pages/room.service';
import { Observable } from 'rxjs';
import { ModificationsService } from '../modifications/modifcations.service';

@Injectable({
  providedIn: 'root',
})
export class SecurityControlService {
  constructor(
    private roomService: RoomService,
    private modicationsService: ModificationsService
  ) {}

  addGroupChat(
    groupChatName: string,
    userIds: number[],
    image: any
  ): Observable<any> {
    return this.roomService.addGroupChat(groupChatName, userIds, image);
  }

  getRoomList(page: number): Observable<any> {
    return this.roomService.getRoomList(page, 'default');
  }

  deleteSpecificRoom(id: number): Observable<any> {
    return this.roomService.deleteSpecificRoomChat(id);
  }

  getConfigurations(): Observable<any> {
    return this.modicationsService.getConfigurations();
  }

  updateConfigurations(data: any): Observable<any> {
    return this.modicationsService.updateConfigurations(data);
  }

  updateSpecificGroupChat(
    groupChatId: number,
    groupChatName: string
  ): Observable<any> {
    return this.roomService.updateSpecificGroupChat(groupChatId, groupChatName);
  }
}
