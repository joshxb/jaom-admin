import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ContactService } from '../pages/contact.service';
import { ItemsPerPage, Order } from '../../enums/order.enum';

@Injectable({
  providedIn: 'root',
})
export class ContactsService {
  constructor(
    private contactService: ContactService
  ) {}

  getExportContacts(value: number): Observable<any> {
    return this.contactService.getExportContacts(value);
  }

  getContact(page: number, order: Order = Order.Null, items: ItemsPerPage = ItemsPerPage.Null): Observable<any> {
    return this.contactService.getContact(page, order, items);
  }

  deleteContact(id: number): Observable<any> {
    return this.contactService.deleteContact(id);
  }
}
