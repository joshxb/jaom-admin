import { AfterViewInit, Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { imageUrls } from 'src/app/app.component';
import { CacheService } from 'src/app/configuration/assets/cache.service';
import { ModificationsService } from 'src/app/configuration/services/modifications/modifcations.service';

@Component({
  selector: 'app-faqs',
  templateUrl: './faqs.component.html',
  styleUrls: ['./faqs.component.css']
})
export class FaqsComponent implements OnInit, AfterViewInit {
  imageUrls = new imageUrls();

  faqsData: any = null;
  selectedUser: any;
  selectedFaqID!: number;
  addNewQuestion: string = '';
  addNewDefinition: string = '';
  newQuestion: string = '';
  newDefinition: string = '';
  isSpinnerLoading: boolean = false;

  showConfirmationModal = false;
  faqsToDeleteId!: number;

  constructor(
    private modificationService: ModificationsService,
    private elRef: ElementRef,
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private cacheService: CacheService
  ) {}

  ngOnInit(): void {
    const theme = this.cacheService.getCachedAdminData('theme');
    this.cacheService.themeChange(this.renderer, this.elRef.nativeElement, theme);

    this.modificationService.showAllFAQS().subscribe((res) => {
      this.faqsData = res;
    });
  }

  openConfirmationModal(chat_id: number) {
    this.isSpinnerLoading = true;
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
    const scb = this.elementRef.nativeElement.querySelector(
      '#sidebarCollapseBtn'
    );
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
      const infoDialogMessage = this.elRef.nativeElement.querySelector(
        '.info-dialog-message p'
      );

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
        const updateDialogMessage = this.elRef.nativeElement.querySelector(
          '.update-dialog-message'
        );

        updateDialogMessage.style.display = 'block';
        const updateDialogMessageP = this.elRef.nativeElement.querySelector(
          '.update-dialog-message p'
        );

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
    const infoDialogMessageP = this.elRef.nativeElement.querySelector(
      '.info-dialog-message p'
    );

    if (question === '' && definition === '') {
      this.displayInfoMessage(infoDialogMessageP, 'No any changes!');
    } else if (question === '') {
      this.displayInfoMessage(infoDialogMessageP, 'Question should not be empty!');
    } else if (definition === '') {
      this.displayInfoMessage(
        infoDialogMessageP,
        'Definition should not be empty!'
      );
    } else {
      const data = {
        title: question,
        definition: definition,
      };

      this.modificationService.addFAQS(data).subscribe((res) => {
        this.isSpinnerLoading = false;
        const infoDialogMessage = this.elRef.nativeElement.querySelector(
          '.success-dialog-message'
        );
        const infoDialogMessageP = this.elRef.nativeElement.querySelector(
          '.success-dialog-message p'
        );

        infoDialogMessage.style.display = 'block';

        infoDialogMessageP.textContent = 'New Faq added successfully!';

        setTimeout(() => {
          window.location.reload();
        }, 2000);
      });
    }
  }

  private displayInfoMessage(element: HTMLElement, message: string) {
    this.isSpinnerLoading = false;
    element.textContent = message;
    const infoDialogMessage = this.elRef.nativeElement.querySelector(
      '.info-dialog-message'
    );
    infoDialogMessage.style.display = 'block';

    setTimeout(() => {
      infoDialogMessage.style.display = 'none';
    }, 2000);
  }

  deleteFaq(id: any) {
    this.isSpinnerLoading = true;
    this.modificationService.deleteFAQS(id).subscribe((res) => {
      this.isSpinnerLoading = false;
      const deleteDialogMessage = this.elRef.nativeElement.querySelector(
        '.delete-dialog-message'
      );
      const deleteDialogMessageP = this.elRef.nativeElement.querySelector(
        '.delete-dialog-message p'
      );

      deleteDialogMessageP.textContent = 'Faq deleted successfully!';
      deleteDialogMessage.style.display = 'block';

      setTimeout(() => {
        window.location.reload();
      }, 2000);
    });
  }

  openEditModal(id: number) {
    this.isSpinnerLoading = true;
    this.selectedFaqID = id;

    this.modificationService.showFAQS(id).subscribe((res) => {
      this.isSpinnerLoading = false;
      const modalOverlay =
        this.elRef.nativeElement.querySelector('.modal-overlay');

      modalOverlay.style.display = 'flex';

      this.newQuestion = res?.title;
      this.newDefinition = res?.definition;

    });
  }

  closeEditModal() {
    const modalOverlay =
      this.elRef.nativeElement.querySelector('.modal-overlay');

    modalOverlay.style.display = 'none';
  }
}
