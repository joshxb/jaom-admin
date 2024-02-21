import { Injectable } from '@angular/core'; // Importing the Injectable decorator from Angular core
import { Observable } from 'rxjs'; // Importing the Observable class from RxJS
import { DonationService } from '../pages/donation.service'; // Importing the DonationService
import { Order, ItemsPerPage } from '../enums/order.enum'; // Importing Order and ItemsPerPage enums

@Injectable({ // Decorator for providing the service at the root level
  providedIn: 'root'
})
export class TransactionsService { // Exporting the TransactionsService class
  constructor(private donationService: DonationService) { } // Injecting the DonationService

  // A method to get all paginated donation transactions
  getAllPaginatedDonationTransactions(page: number, order: Order = Order.Null, items: ItemsPerPage = ItemsPerPage.Null): Observable<any> {
    // Returns an Observable of the donation transactions by calling the getAllPaginatedDonationTransactions method of the DonationService
    return this.donationService.getAllPaginatedDonationTransactions(page, order, items);
  }

  // A method to delete a donation transaction
  deleteDonationTransaction(id: number): Observable<any> {
    // Returns an Observable of the result after deleting the donation transaction by calling the deleteDonationTransaction method of the DonationService
    return this.donationService.deleteDonationTransaction(id);
  }
}
