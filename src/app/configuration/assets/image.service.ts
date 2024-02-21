import { Injectable } from '@angular/core';
import { Ng2ImgMaxService } from 'ng2-img-max';
import { Observable } from 'rxjs';

// Image service for compressing images
@Injectable({
  providedIn: 'root',
})
export class ImageService {
  // Constructor with Ng2ImgMaxService for compressing images
  constructor(private ng2ImgMax: Ng2ImgMaxService) {}

  // Compress image function that takes in a file and returns an observable of the compressed file
  compressImage(image: File): Observable<File> {
    return new Observable<File>((observer) => {
      // Compress the image with Ng2ImgMaxService
      this.ng2ImgMax.compressImage(image, 0.05).subscribe(
        // On success, emit the compressed file and complete the observable
        (result) => {
          observer.next(result);
          observer.complete();
        },
        // On error, emit the error
        (error) => {
          observer.error(error);
        }
      );
    });
  }
}
