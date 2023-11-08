import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DonationService } from '../pages/donation.service';
import { Order, ItemsPerPage } from '../../enums/order.enum';

@Injectable({
  providedIn: 'root',
})
export class TransactionsService {
  constructor(private donationService: DonationService) {}

  getAllPaginatedDonationTransactions(page: number, order: Order = Order.Null, items: ItemsPerPage = ItemsPerPage.Null): Observable<any> {
    return this.donationService.getAllPaginatedDonationTransactions(page, order, items);
  }

  deleteDonationTransaction(id: number): Observable<any> {
    return this.donationService.deleteDonationTransaction(id);
  }
}
