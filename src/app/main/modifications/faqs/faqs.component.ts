import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { Component, ElementRef, OnInit } from '@angular/core';
import { imageUrls } from 'src/app/app.component';
import { ModificationsService } from 'src/app/configuration/services/modifications/modifcations.service';

@Component({
  selector: 'app-faqs',
  templateUrl: './faqs.component.html',
  styleUrls: ['./faqs.component.css'],
  animations: [
    trigger('modalAnimation', [
      state(
        'active',
        style({
          transform: 'translateY(0)',
          opacity: 1,
        })
      ),
      transition('void => active', [
        style({
          transform: 'translateY(-20px)',
          opacity: 0,
        }),
        animate('300ms ease'),
      ]),
    ]),
  ],
})
export class FaqsComponent implements OnInit {
  imageUrls = new imageUrls();

  faqsData: any = null;
  selectedUser: any;
  selectedFaqID!: number;
  addNewQuestion: string = '';
  addNewDefinition: string = '';
  newQuestion: string = '';
  newDefinition: string = '';

  constructor(
    private modificationService: ModificationsService,
    private elRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.modificationService.showAllFAQS().subscribe((res) => {
      this.faqsData = res;
    });
  }

  updateFaq() {
    const trimmedQuestion = this.newQuestion.trim();
    const trimmedDefinition = this.newDefinition.trim();
  
    if (trimmedQuestion === '' && trimmedDefinition === '') {
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
  
    this.modificationService.updateFAQS(this.selectedFaqID, data)
      .subscribe(() => {
        const updateDialogMessageP = this.elRef.nativeElement.querySelector(
          '.update-dialog-message p'
        );
  
        updateDialogMessageP.textContent = 'FAQ updated successfully!';
        updateDialogMessageP.style.display = 'block';
  
        setTimeout(() => {
          updateDialogMessageP.style.display = 'none';
          window.location.reload();
        }, 2000);
      });
  }
  
  addFaq() {
    const question = this.addNewQuestion.trim();
    const definition = this.addNewDefinition.trim();
    const infoDialogMessage = this.elRef.nativeElement.querySelector('.info-dialog-message');
    const infoDialogMessageP = this.elRef.nativeElement.querySelector('.info-dialog-message p');
  
    if (question === '' && definition === '') {
      this.displayMessage(infoDialogMessageP, 'No any changes!');
    } else if (question === '') {
      this.displayMessage(infoDialogMessageP, 'Question should not be empty!');
    } else if (definition === '') {
      this.displayMessage(infoDialogMessageP, 'Definition should not be empty!');
    } else {
      const data = {
        title: question,
        definition: definition,
      };
  
      this.modificationService.addFAQS(data).subscribe((res) => {
        this.displayMessage(infoDialogMessageP, 'New Faq added successfully!');
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      });
    }
  }
  
  private displayMessage(element: HTMLElement, message: string) {
    element.textContent = message;
    const infoDialogMessage = this.elRef.nativeElement.querySelector('.info-dialog-message');
    infoDialogMessage.style.display = 'block';
  
    setTimeout(() => {
      infoDialogMessage.style.display = 'none';
    }, 2000);
  }
  

  deleteFaq(id: any) {
    this.modificationService.deleteFAQS(id).subscribe((res) => {
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
    this.selectedFaqID = id;

    this.modificationService.showFAQS(id).subscribe((res) => {
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
