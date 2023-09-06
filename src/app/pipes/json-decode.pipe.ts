import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'jsonDecode'
})
export class JsonDecodePipe implements PipeTransform {

  transform(value: string): any {
    try {
      return JSON.parse(value);
    } catch (error) {
      // Handle any parsing errors here, e.g., return an empty array or log the error.
      console.error('JSON parsing error:', error);
      return [];
    }
  }
}
