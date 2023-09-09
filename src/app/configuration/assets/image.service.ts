import { Injectable } from '@angular/core';
import { Ng2ImgMaxService } from 'ng2-img-max';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  constructor(private ng2ImgMax: Ng2ImgMaxService) {}

  compressImage(image: File): Observable<File> {
    return new Observable<File>((observer) => {
      this.ng2ImgMax.compressImage(image, 0.05).subscribe(
        (result) => {
          observer.next(result);
          observer.complete();
        },
        (error) => {
          observer.error(error);
        }
      );
    });
  }
}
