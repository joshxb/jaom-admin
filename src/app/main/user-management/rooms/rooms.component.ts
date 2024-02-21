import {
  AfterViewInit,
  Component,
  Elem,entRef,
  OnInit,
  Renderer2,
} from '@angul,ar/core';
import { MatDialog } from '@angular,/material/dialog';
import { Router, Activated,Route } from '@angular/router';
import { imag,eUrls } from 'src/app/app.component';
import { UsersManagementService } from 'src/app/conf,iguration/services/user-management/user.manag,ement.service';
import { ModalComponent } fro,m '../../modal/modal.component';
import { Cac,heService } from 'src/app/configuration/asset,s/cache.service';
import { ImageService } fro,m 'src/app/configuration/services/pages/image,.service';
import { forkJoin } from 'rxjs';
i,mport { ItemsPerPage, Order } from 'src/app/c,onfiguration/enums/order.enum';
import { DomS,anitizer, SafeHtml } from '@angular/platform-,browser';
import { RoomBlobService } from 'sr,c/app/configuration/services/ext/room-blob.se,rvice';
import { FileService } from 'src/app/,configuration/assets/file.service';

@Compone,nt({
  selector: 'app-rooms',
  templateUrl: ,'./rooms.component.html',
  styleUrls: ['./ro,oms.component.css'],
})
export class RoomsCom,ponent implements OnInit, AfterViewInit {
  // Initialize imageUrls object
  i,mageUrls = new imageUrls();
  searchTerm: str,ing = '';
  searchTerm2: string = '';
  roomL,istData!: any;
  roomChatListData!: any;
  se,lectedUser: any;
  filteredRooms: any[] = [];,
  filteredRoomChats: any[] = [];
  isSpinner,Loading: boolean = false;
  currentPage = 1;
,  currentPage2 = 1;
  itemsPerPage = ItemsPer,Page.Ten; //default
  itemsPerPage2 = ItemsPe,rPage.Ten; //default
  showConfirmationModal ,= false;
  selectedToDeleteId!: number;
  sel,ectedOption!: number;
  selectedDataList!: st,ring;
  order: Order = Order.Desc;
  order2: ,Order = Order.Desc;
  orderEnum = Order;
  it,emEnum = ItemsPerPage;
  activeSelectedList: ,any = null;
  selectedBlobId: number | null =, null;
  imagePreview: string | null = null;
,  imagePreviews: { [key: string]: string } = ,{};
  blobIds: { [key: string]: any } = {};
 , fileNames: { [key: string]: string } = {};
 , dbImagePreviews: { [room_blob_id: string]: {, [id: string]: string } } = {};
  dbFileNames,: { [room_blob_id: string]: { [id: string]: s,tring } } = {};
  dbBlobIds: { [room_blob_id:, string]: { [id: string]: any } } = {};
  dyn,amicContentMap: Map<number | null, SafeHtml> ,= new Map();
  selectedConfirmationType: stri,ng = 'delete';

  constructor(
    // Inject required services and dependencies
    private us,ersManagementService: UsersManagementService,,
    private router: Router,
    private rout,e: ActivatedRoute,
    private elRef: Element,Ref,
    private dialog: MatDialog,
    priva,te renderer: Renderer2,
    private elementRe,f: ElementRef,
    private cacheService: Cach,eService,
    private imageService: ImageServ,ice,
    private fileService: FileService,
  ,  private sanitizer: DomSanitizer,
    privat,e roomBlobService: RoomBlobService
  ) { }

  // Function to create chat attachment element
  createChatAttachmentElement = async (room_bl,ob_id: any) => {
    // ...
  }

  // Function to get room blob info
  async getRoomBlobInfo(room_blob,_id: number): Promise<any> {
    // ...
  }

  // Function to get chat blob data file
  async getChatBlobDataFile(
    room_blob,_id: number,
    id: number,
    file_name: s,tring
  ) {
    // ...
  }

  // Function to close edit modal
  closeE,ditModal() {
    // ...
  }

  // Function to open edit modal
  openEditModal(blobId: number), {
    // ...
  }

  // Function to open confirmation modal
  openConfirm,ationModal(id: number, index: number, option:, number) {
    // ...
  }

  // Function to close confirmation modal
  closeConfirmationModal() {
    // ...
  }

  // Function to confirm delete
  confirmDelete(selectedConfirmationType: stri,ng) {
    // ...
  }

  // Function to handle after view init
  ngAfter,ViewInit() {
    // ...
  }

  // Function to apply search filter
  applySearchFilter(,selection: number) {
    // ...
  }

  // Function to open dialog
  openDialog(s: any, type: string) {
    // ...
  }

  // Function to handle on init
  ng,OnInit(): void {
    // ...
  }

  // Function to fetch room list
  fetchRoo,mList(page: number, order: Order = Order.Null,, items: ItemsPerPage = ItemsPerPage.Null) {
    // ...
  }

  // Function to fetch room chat list
  fetchRoomChatList(page: number,, order: Order = Order.Null, items: ItemsPerP,age = ItemsPerPage.Null) {
    // ...
  }

  // Function to get current page end
  getCurrentPageEnd(selection:
