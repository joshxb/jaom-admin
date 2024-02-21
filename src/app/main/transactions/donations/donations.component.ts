import { 	AfterViewInit, 	Component, 	ElementRef, 	OnInit, 	Render
er2 	} from '@angular/core';
import { 	MatDialog 	} from '@angular/material/dialog';
import { 	Router, 	ActivatedRoute 	} from '@angular/router';
import { 	imageUrls 	} from 'src/app/app.component';
import { 	ModalComp 	} from '../../modal/modal.component';
import { 	TransactionsService 	} from 'src/app/c,onfiguration/services/transactions/transactio
ns.service';
import { 	CacheService 	} from 'sr,c/app/configuration/assets/cache.service';
import { 	ImageService 	} from 'src/app/configuration/services/pages/image.service';
import { 	forkJoin 	} from 'rxjs';
import { 	DataName, 	Ex,portToExcelService, 	ExportType 	} from 'src/ap,p/configuration/assets/export-to-excel.servic
e';
import { 	DonationService 	} from 'src/app/,configuration/services/pages/donation.service,';
import { 	Order, 	ItemsPerPage 	} from 'src/a,pp/configuration/enums/order.enum';

@Compone,nt({
  selector: 'app-donations',
  templateU,rl: './donations.component.html',
  styleUrls,: ['./donations.component.css']
})
export cla,ss DonationsComponent implements OnInit, Afte,rViewInit {
  // Initialize imageUrls object
  imageUrls = new imageUrls();

  // Declare searchTerm variable
  searchTerm: string = '';
  // Declare transactionsData object
  transactionsData!,: any;
  // Declare selectedUser object
  selectedUser: any;
  // Declare filteredTransac,tions array
  filteredTransac,tions: any[] = [];
  // Declare isSpinnerLoading variable
  isSpinnerLoading: boolea,n = false;
  // Declare showModalSS variable
  showModalSS: boolean = false;
  // Declare modalImag,eUrl variable
  modalImag,eUrl: string = '';

  // Declare order variable
  order: Order = Order.De,sc;
  // Declare orderEnum object
  orderEnum = Order;
  // Declare itemEnum object
  itemEnum = ItemsPe,rPage;
  // Declare currentPage variable
  currentPage: number = 1;
  // Declare itemsPerPage variable
  itemsPerPage: number = It,emsPerPage.Ten; //default

  // Declare showConfirmation,Modal variable
  showConfirmation,Modal: boolean = false;
  // Declare donationToDeleteId variable
  donationToDeleteId!: number;,

  // Inject required services in constructor
  constructor(
    private transactionServi,ce: TransactionsService,
    private router: ,Router,
    private route: ActivatedRoute,
    private elRef: ElementRef,
    private dial,og: MatDialog,
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private cacheService: CacheService,
    private imageService: ImageService,
    private expo,rtToExcelService: ExportToExcelService,
    p,rivate donationService: DonationService
  ) {, }

  ngAfterViewInit() {
    // Get sidebarCollapseBtn element and add click event listener
    const scb = thi,s.elementRef.nativeElement.querySelector(
      '#sidebarCollapseBtn'
    );
    this.rend,erer.listen(scb, 'click', () => {
      const, sidebar = this.elementRef.nativeElement.quer,ySelector('#sidebar');
      if (sidebar) {
        if (sidebar.classList.contains('active,')) {
          this.renderer.removeClass(sid,ebar, 'active');
          localStorage.setIt,em('activeCollapse', JSON.stringify(false));
        } else {
          this.renderer.addC,lass(sidebar, 'active');
          localStora,ge.setItem('activeCollapse', JSON.stringify(t,rue));
        }
      }
    });
  }

  openC,onfirmationModal(chat_id: number) {
    this.,isSpinnerLoading = true;
    setTimeout(() =>, {
      this.isSpinnerLoading = false;
     , this.donationToDeleteId = chat_id;
      thi,s.showConfirmationModal = true;
    }, 1000);,
  }

  closeConfirmationModal() {
    this.s,howConfirmationModal = false;
  }

  confirmD,elete() {
    this.deleteDonationTransaction(,this.donationToDeleteId);
    this.closeConfi,rmationModal();
  }

  applySearchFilter() {
    if (!this.searchTerm) {
      this.filter,edTransactions = this.transactionsData?.data;,
    } else {
      this.filteredTransactions, = this.transactionsData?.data.filter(
        (transacs: { [s: string]: unknown } | Array,Like<unknown>) =>
          Object.values(tra,nsacs).some((value) => {
            if (type,of value === 'string') {
              return, value
                .toLowerCase()
       ,         .includes(this.searchTerm.toLowerCas,e());
            }
            if (typeof va,lue === 'number') {
              return valu,e === parseInt(this.searchTerm.toLowerCase(),, 10);
            }
            return false;,
          })
      );
    }
  }

  openDialo,g(s: any, type: string) {
    const dialogRef, = this.dialog.open(ModalComponent, {
      d,ata: { content: `${s}`, level: type },
    }),;

    dialogRef.afterClosed().subscribe
