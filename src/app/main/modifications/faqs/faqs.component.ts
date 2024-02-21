import { AfterViewInit, Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { imageUrls } from 'src/app/app.component';
import { CacheService } from 'src/app/configuration/assets/cache.service';
import { ModificationsService } from 'src/app/configuration/services/modifications/modifications.service';

@Component({
  selector: 'app-faqs',
  templateUrl: './faqs.component.html',
  styleUrls: ['./faqs.component.css']
})
export class FaqsComponent implements OnInit, AfterViewInit {
  // Initialize imageUrls object
  imageUrls = new imageUrls();

  // faqsData property to store the FAQs data
  faqsData: any = null;
  // selectedUser property to store the selected user
  selectedUser: any;
  // selectedFaqID property to store the ID of the selected FAQ
  selectedFaqID!: number;
  // addNewQuestion property to store the new question input by the user
  addNewQuestion: string = '';
  // addNewDefinition property to store the new definition input by the user
  addNewDefinition: string = '';
  // newQuestion property to store the new question input by the user in the edit modal
  newQuestion: string = '';
  // newDefinition property to store the new definition input by the user in the edit modal
  newDefinition: string = '';
  // isSpinnerLoading property to control the display of the spinner
  isSpinnerLoading: boolean = false;

  // showConfirmationModal property to control the display of the confirmation modal
  showConfirmationModal = false;
  // faqsToDeleteId property to store the ID of the FAQ to be deleted
  faqsToDeleteId!: number;

  constructor(
    private modificationService: ModificationsService,
    private elRef: ElementRef,
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private cacheService: CacheService
  ) {}

  ngOnInit(): void {
    // Get the cached theme from the cacheService
    const theme = this.cacheService.getCachedAdminData('theme');
    // Set the theme using the renderer and elRef
    this.cacheService.themeChange(this.renderer, this.elRef.nativeElement, theme);

    // Subscribe to the showAllFAQS() method of the modificationService
    this.modificationService.showAllFAQS().subscribe((res) => {
      // Set the faqsData property to the response from the server
      this.faqsData = res;
    });
  }

  openConfirmationModal(chat_id: number) {
    this.isSpinnerLoading = true;
    // Set a timeout to set the isSpinnerLoading property to false after 1 second
    setTimeout(() => {
      this.isSpinnerLoading = false;
      this.faqsToDeleteId = chat_id;
      this.showConfirmationModal = true;
    }, 1000);
  }

  closeConfirmationModal() {
    this.showConfirmationModal = false;
  }

  confirmDelete() {
    this.deleteFaq(this.faqsToDeleteId);
    this.closeConfirmationModal();
  }

  ngAfterViewInit() {
    // Get the sidebarCollapseBtn element
    const scb = this.elementRef.nativeElement.querySelector('#sidebarCollapseBtn');
    // Add a click event listener to the sidebarCollapseBtn element
    this.renderer.listen(scb, 'click', () => {
      const sidebar = this.elementRef.nativeElement.querySelector('#sidebar');
      if (sidebar) {
        if (sidebar.classList.contains('active')) {
          this.renderer.removeClass(sidebar, 'active');
          localStorage.setItem('activeCollapse', JSON.stringify(false));
        } else {
          this.renderer.addClass(sidebar, 'active');
          localStorage.setItem('activeCollapse', JSON.stringify(true));
        }
      }
    });
  }

  updateFaq() {
    this.isSpinnerLoading = true;
    const trimmedQuestion = this.newQuestion.trim();
    const trimmedDefinition = this.newDefinition.trim();

    if (trimmedQuestion === '' && trimmedDefinition === '') {
      this.isSpinnerLoading = false;
      const infoDialogMessage = this.elRef.nativeElement.querySelector('.info-dialog-message p');

      infoDialogMessage.textContent = 'No changes made!';
      infoDialogMessage.style.display = 'block';

      setTimeout(() => {
        infoDialogMessage.style.display = 'none';
      }, 2000);

      return;
    }

    const data = {
      title: trimmedQuestion,
      definition: trimmedDefinition,
    };

    this.modificationService
      .updateFAQS(this.selectedFaqID, data)
      .subscribe(() => {
        this.isSpinnerLoading = false;
        const updateDialogMessage = this.elRef.nativeElement.querySelector('.update-dialog-message');

        updateDialogMessage.style.display = 'block';
        const updateDialogMessageP = this.elRef.nativeElement.querySelector('.update-dialog-message p');

        updateDialogMessageP.textContent = 'FAQ updated successfully!';
        updateDialogMessage.style.display = 'block';

        setTimeout(() => {
          updateDialogMessageP.style.display = 'none';
          window.location.reload();
        }, 2000);
      });
  }

  addFaq() {
    this.isSpinnerLoading = true;
    const question = this.addNewQuestion.trim();
    const definition = this.addNewDefinition.trim();
    const infoDialogMessageP = this.elRef.nativeElement.querySelector('.info-dialog-message p');

    if (question === '' && definition === '') {
      this.displayInfoMessage(infoDialogMessageP, 'No any changes!');
    } else if (question === '') {
      this.displayInfoMessage(infoDialogMessageP, 'Question should not be empty!');
    } else if (definition
