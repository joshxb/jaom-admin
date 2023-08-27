import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { DonationService } from '../pages/donation.service';
import { ConversationService } from '../pages/conversation.service';
import { RoomService } from '../pages/room.service';
import { UpdatesService } from '../pages/updates.service';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private donationService: DonationService,
    private conversationService: ConversationService,
    private roomService: RoomService,
    private updatesService: UpdatesService
  ) {}

  getDonationTransactions(
    page: number,
    selectedMonth: string,
    selectedYear: number
  ): Observable<any> {
    return this.donationService.getDonationTransactions(
      page,
      selectedMonth,
      selectedYear
    );
  }

  getChatCounts(): Observable<any> {
    return this.conversationService.getChatCounts();
  }

  getRoomCounts(): Observable<any> {
    return this.roomService.getRoomCounts();
  }

  getUpdatesCounts(): Observable<any> {
    return this.updatesService.getUpdatesCounts();
  }
}
