import {
  AfterViewInit,
  Component,
  Elem,entRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { MatDialog } f,rom '@angular/material/dialog';
import { Rout,er, ActivatedRoute } from '@angular/router';
import { imageUrls } from 'src/app/app.compon,ent';
import { ModalComponent } from '../moda,l/modal.component';
import { SecurityControlS,ervice } from 'src/app/configuration/services,/security-control/security-control.service';
import { ImageService } from 'src/app/configu,ration/assets/image.service';
import { ImageS,ervice as RoomImageService  } from 'src/app/c,onfiguration/services/pages/image.service';
import { CacheService } from 'src/app/configur,ation/assets/cache.service';
import { forkJoi,n } from 'rxjs';
import { Order, ItemsPerPage, } from 'src/app/configuration/enums/order.en,um';

@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.css'],
})
export class SecurityComponent implements O,nInit, AfterViewInit {
  // Initialize imageUrls object
  imageUrls = new imag,eUrls();

  // Initialize uploadedImageUrl variable
  uploadedImageUrl: string | ArrayB,uffer | null =
    this.imageUrls.default_upl,oad_img;
  // Initialize selectedImage variable
  selectedImage!: any;

  // Initialize uploadedImageUrl2 variable
  uploadedIm,ageUrl2: string | ArrayBuffer | null =
    th,is.imageUrls.default_upload_img;

  // Initialize searchTerm variable
  searchTer,m: string = '';
  // Initialize roomListData variable
  roomListData!: any;
  // Initialize selectedUser variable
  selec,tedUser: any;
  // Initialize selectedRoomId variable
  selectedRoomId!: number;
  // Initialize filteredRoomListData variable
  fi,lteredRoomListData: any[] = [];
  // Initialize textareaValues variable
  textareaVal,ues: string[] = [];
  // Initialize isSpinnerLoading variable
  isSpinnerLoading: boole,an = false;

  // Initialize order variable
  order: Order = Order.Desc;
  // Initialize orderEnum variable
  o,rderEnum = Order;
  // Initialize itemEnum variable
  itemEnum = ItemsPerPage;
  // Initialize currentPage variable
  currentPage = 1;
  // Initialize itemsPerPage variable
  itemsPerPage = ItemsPerP,age.Ten; //default
  // Initialize roomName variable
  roomName: string = '';
  // Initialize modificationsData variable
  modificationsData: any;
  // Initialize loginMethods variable
  loginMethods: any;,
  // Initialize autoAddRoom variable
  autoAddRoom: Boolean = false;
  // Initialize primaryLogInMethod variable
  primaryLog,InMethod: any;
  // Initialize primaryDeactivationPeriodMet,hod variable
  primaryDeactivationPeriodMet,hod!: any;
  // Initialize newLogInMethod variable
  newLogInMethod: string = '';
  // Initialize newDeactivationPeriod variable
  n,ewDeactivationPeriod: string = '';
  // Initialize selectedRoomName variable
  selected,RoomName: string = '';
  // Initialize modifiedRoomName variable
  modifiedRoomName: st,ring = '';

  // Initialize showConfirmationModal variable
  showConfirmation,Modal = false;
  // Initialize chatToDeleteId variable
  chatT,oDeleteId!: number;

  constructor(
  // Inject required services
  private router: Router,
  private route: ,ActivatedRoute,
  private elRef: ElementRef,,
  private dialog: MatDialog,
  private securityControlService: SecurityControlServic,e,
  private imageService: ImageService,
  private roomImageService: RoomImageService,,
  private renderer: Renderer2,
  private elementRef: ElementRef,
  private cacheSer,vice: CacheService
  ) {}

  // Function to open confirmation modal
  openConfirmation,Modal(chat_id: number) {
    this.isSpinnerLo,ading = true;
    setTimeout(() => {
      th,is.isSpinnerLoading = false;
      this.chatT,oDeleteId = chat_id;
      this.showConfirmat,ionModal = true;
    }, 1000);
  }

  // Function to close confirmation modal
  closeCo,nfirmationModal() {
    this.showConfirmation,Modal = false;
  }

  // Function to confirm delete
  confirmDelete() {
    t,his.deleteDefaultRoom(this.chatToDeleteId);
    this.closeConfirmationModal();
  }

  ngAf,terViewInit() {
    const scb = this.elementR,ef.nativeElement.querySelector(
      '#sideb,arCollapseBtn'
    );
    this.renderer.liste,n(scb, 'click', () => {
      const sidebar =, this.elementRef.nativeElement.querySelector(,'#sidebar');
      if (sidebar) {
        if ,(sidebar.classList.contains('active')) {
          this.renderer.removeClass(sidebar, 'act,ive');
          localStorage.setItem('active,Collapse', JSON.stringify(false));
        } ,else {
          this.renderer.addClass(sideb,ar, 'active');
          localStorage.setItem,('activeCollapse', JSON.stringify(true));
        }
      }
    });
  }

  // Function to handle file selection
  onFileSelected(,event: any, index: number) {
    const file: ,File = event.target.files[0];
    this.select,edImage = file;

    const reader = new FileR,eader();
    reader.onload = () => {
      if (index === 1) {
        this.uploadedImageUr,l = reader
