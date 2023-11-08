import { Injectable } from '@angular/core';
import { RoomService } from '../pages/room.service';
import { Observable } from 'rxjs';
import { ModificationsService } from '../modifications/modifcations.service';
import { ItemsPerPage, Order } from '../../enums/order.enum';

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

  getRoomList(page: number, order: Order = Order.Null, items: ItemsPerPage = ItemsPerPage.Null): Observable<any> {
    return this.roomService.getRoomList(page, 'default', order, items);
  }

  deleteSpecificRoom(id: number): Observable<any> {
    return this.roomService.deleteRoom(id);
  }

  getConfigurations(): Observable<any> {
    return this.modicationsService.getConfigurations();
  }

  updateConfigurations(data: any): Observable<any> {
    return this.modicationsService.updateConfigurations(data);
  }

  updateSpecificGroupChat(
    groupChatId: number,
    groupChatName: string,
    image: any
  ): Observable<any> {
    return this.roomService.updateSpecificGroupChat(groupChatId, groupChatName, image);
  }
}
