import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'userTypePipe',
})
export class UserTypePipe implements PipeTransform {
  transform(data: number | undefined | null) {
    switch (data) {
      case 0: {
        return 'STAFF';
      }
      case 1: {
        return 'CUSTOMER';
      }

      default: {
        return '';
      }
    }
  }
}
