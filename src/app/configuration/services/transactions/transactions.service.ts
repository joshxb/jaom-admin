import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DonationService } from '../pages/donation.service';

@Injectable({
  providedIn: 'root',
})
export class TransactionsService {
  constructor(private donationService: DonationService) {}

  getAllPaginatedDonationTransactions(page: number): Observable<any> {
    return this.donationService.getAllPaginatedDonationTransactions(page);
  }

  deleteDonationTransaction(id: number): Observable<any> {
    return this.donationService.deleteDonationTransaction(id);
  }
}
