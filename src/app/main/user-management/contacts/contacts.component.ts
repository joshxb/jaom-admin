import { AfterViewInit, Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { imageUrls } from 'src/app/app.component';
import { CacheService } from 'src/app/configuration/assets/cache.service';
import { OfferService } from 'src/app/configuration/services/pages/offer.service';
import { ModalComponent } from '../../modal/modal.component';
import { ContactsService } from 'src/app/configuration/services/contacts/contacts.service';
import { DataName, ExportToExcelService, ExportType } from 'src/app/configuration/assets/export-to-excel.service';
import { Order, ItemsPerPage } from 'src/app/configuration/enums/order.enum';

/**
 * ContactsComponent is a component that displays a list of contacts.
 */
@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css'],
})
export class ContactsComponent implements OnInit, AfterViewInit {
  /**
   * imageUrls object for storing image URLs.
   */
  imageUrls = new imageUrls();

  /**
   * Search term for filtering contacts.
   */
  searchTerm: string = '';

  /**
   * Contacts data received from the API.
   */
  contactsData!: any;

  /**
   * Selected user object.
   */
  selectedUser: any;

  /**
   * Filtered contacts array.
   */
  filteredContacts: any[] = [];

  /**
   * Spinner loading indicator visibility.
   */
  isSpinnerLoading: boolean = false;

  /**
   * Order of the contacts list.
   */
  order: Order = Order.Desc;

  /**
   * Enum for order options.
   */
  orderEnum = Order;

  /**
   * Enum for items per page options.
   */
  itemEnum = ItemsPerPage;

  /**
   * Current page number.
   */
  currentPage = 1;

  /**
   * Items per page value.
   */
  itemsPerPage = ItemsPerPage.Ten; // default

  /**
   * Flag for showing the confirmation modal.
   */
  showConfirmationModal = false;

  /**
   * ID of the contact to be deleted.
   */
  contactsToDeleteId!: number;

  /**
   * Constructor for ContactsComponent.
   * @param router Angular Router service.
   * @param route Angular ActivatedRoute service.
   * @param elRef Angular ElementRef service.
   * @param dialog Angular MatDialog service.
   * @param renderer Angular Renderer2 service.
   * @param elementRef Angular ElementRef service.
   * @param cacheService CacheService instance.
   * @param contactService ContactsService instance.
   * @param exportToExcelService ExportToExcelService instance.
   */
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private elRef: ElementRef,
    private dialog: MatDialog,
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private cacheService: CacheService,
    private contactService: ContactsService,
    private exportToExcelService: ExportToExcelService
  ) {}

  /**
   * Opens the confirmation modal for deleting a contact.
   * @param chat_id ID of the contact to be deleted.
   */
  openConfirmationModal(chat_id: number) {
    this.isSpinnerLoading = true;
    setTimeout(() => {
      this.isSpinnerLoading = false;
      this.contactsToDeleteId = chat_id;
      this.showConfirmationModal = true;
    }, 1000);
  }

  /**
   * Closes the confirmation modal.
   */
  closeConfirmationModal() {
    this.showConfirmationModal = false;
  }

  /**
   * Deletes the selected contact.
   */
  confirmDelete() {
    this.deleteContact(this.contactsToDeleteId);
    this.closeConfirmationModal();
  }

  /**
   * Applies the search filter to the contacts list.
   */
  applySearchFilter() {
    if (!this.searchTerm) {
      this.filteredContacts = this.contactsData?.data;
    } else {
      this.filteredContacts = this.contactsData?.data.filter((chat: { [s: string]: unknown } | ArrayLike<unknown>) =>
        Object.values(chat).some((value) => {
          if (typeof value === 'string') {
            return value.toLowerCase().includes(this.searchTerm.toLowerCase());
          } else if (typeof value === 'number') {
            return value == Number(this.searchTerm.toLowerCase());
          }
          return false;
        })
      );
    }
  }

  /**
   * Opens a dialog with the given message and type.
   * @param s Message to be displayed.
   * @param type Type of the message (success, error, or info).
   */
  openDialog(s: any, type: string) {
    const dialogRef = this.dialog.open(ModalComponent, {
      data: { content: `${s}`, level: type },
    });

    dialogRef.afterClosed().subscribe((result) => { });
  }

  /**
   * Initialization logic for the component.
   */
  ngOnInit(): void {
    const theme = this.cacheService.getCachedAdminData('theme');
    this.cacheService.themeChange(
      this.renderer,
      this.elRef.nativeElement,
      theme
    );

    this.route.queryParams.subscribe((params) => {
      if (params['page']) {
        this.currentPage = +params['page'];
      } else {
        this.
