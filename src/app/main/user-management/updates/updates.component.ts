import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  Renderer2,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { imageUrls } from 'src/app/app.component';
import { UsersManagementService } from 'src/app/configuration/services/user-management/user.management.service';
import { ModalComponent } from '../../modal/modal.component';
import { TextService } from 'src/app/configuration/assets/text.service';
import { CacheService } from 'src/app/configuration/assets/cache.service';
import { Order, ItemsPerPage } from 'src/app/configuration/enums/order.enum';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FileService } from 'src/app/configuration/assets/file.service';
import { UpdateBlobService } from 'src/app/configuration/services/ext/update-blob.service';

@Component({
  selector: 'app-updates',
  templateUrl: './updates.component.html',
  styleUrls: ['./updates.component.css'],
})
export class UpdatesComponent implements OnInit, AfterViewInit {
  // Initialize imageUrls
  imageUrls = new imageUrls();
  searchTerm: string = '';
  updatesData!: any;
  selectedUser: any;
  filteredUpdates: any[] = [];
  isSpinnerLoading: boolean = false;
  order: Order = Order.Desc;
  orderEnum = Order;
  itemEnum = ItemsPerPage;
  currentPage = 1;
  itemsPerPage = ItemsPerPage.Ten; //default
  showConfirmationModal = false;
  updateToDeleteId!: number;
  selectedBlobId: number | null = null;
  imagePreview: string | null = null;
  imagePreviews: { [key: string]: string } = {};
  blobIds: { [key: string]: any } = {};
  fileNames: { [key: string]: string } = {};
  dbImagePreviews: { [update_blob_id: string]: { [id: string]: string } } = {};
  dbFileNames: { [update_blob_id: string]: { [id: string]: string } } = {};
  dbBlobIds: { [update_blob_id: string]: { [id: string]: any } } = {};
  dynamicContentMap: Map<number | null, SafeHtml> = new Map();

  constructor(
    private usersManagementService: UsersManagementService,
    private router: Router,
    private route: ActivatedRoute,
    private elRef: ElementRef,
    private dialog: MatDialog,
    private textService: TextService,
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private cacheService: CacheService,
    private fileService: FileService,
    private sanitizer: DomSanitizer,
    private updateBlobService: UpdateBlobService
  ) {}

  processHtmlContent(input: string): string {
    const withoutTags = input.replace(/<[^>]*>/g, '');
    const decodedContent = new DOMParser().parseFromString(
      withoutTags,
      'text/html'
    ).body.textContent || "";
    const trimmedContent = decodedContent.trim();

    return trimmedContent;
  }

  plainTextContent(content: string) {
    return content.replace(/<[^>]*>/g, ''); // Removes all HTML tags
  }

  // Create an update attachment element
  async createUpdateAttachmentElement(update_blob_id: any) {
    const modalOverlay = this.elRef.nativeElement.querySelector('.modal-overlay');

    if (update_blob_id === null) {
      return;
    }

    if (this.dynamicContentMap.has(update_blob_id)) {
      // If update_blob_id is already in the map, return the existing value
      modalOverlay.style.display = 'flex';
      this.isSpinnerLoading = false;
      return this.dynamicContentMap.get(update_blob_id);
    }

    const blobInfo = await this.getUpdateBlobInfo(update_blob_id);
    const blobDataPromises = blobInfo.update_blob_ids.map(
      (blobId: number, index: number) =>
        this.getUpdateBlobDataFile(
          update_blob_id,
          blobId,
          blobInfo.file_names[index]
        )
    );
    const blobDataArray = await Promise.all(blobDataPromises);
    const imageElements = blobDataArray.map((data) => {
      if (data?.dataType.startsWith('image/')) {
        // If it's an image type
        return this.fileService.imageFilePreview(
          data?.file_name,
          data?.blobData,
          data?.dataType,
          'update'
        );
      } else {
        // If it's not an image type
        return this.fileService.nonImageFilePreview(
          data?.file_name,
          data?.blobData,
          data?.dataType
        );
      }
    });

    const imageElementsString = imageElements.join('');
    const newDiv = imageElementsString;

    // Store the new value in the map, and return it
    const sanitizedValue = this.sanitizer.bypassSecurityTrustHtml(newDiv);
    this.dynamicContentMap.set(update_blob_id, sanitizedValue);

    modalOverlay.style.display = 'flex';
    this.isSpinnerLoading = false;

    return sanitizedValue;
  }

  // Get update blob info
  async getUpdateBlobInfo(update_blob_id: number): Promise<any> {
    return new Promise((resolve, reject) => {
      if (update_blob_id === null) {
        resolve({ update
