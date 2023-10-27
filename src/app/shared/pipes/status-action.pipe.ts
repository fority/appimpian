import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusActionPipe',
})
export class StatusActionPipe implements PipeTransform {
  transform(data: number | null) {
    switch (data) {
      case 0: {
        return 'POSTED';
      }
      case 10: {
        return 'RETURNED';
      }
      case 20: {
        return 'CANCELED';
      }

      default: {
        return '';
      }
    }
  }
}
