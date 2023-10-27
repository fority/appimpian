import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'trueFalsePipe',
})
export class TrueFalsePipe implements PipeTransform {
  transform(data: boolean | null | undefined) {
    switch (data) {
      case true: {
        return 'Yes';
      }
      case false: {
        return 'No';
      }

      default: {
        return 'NaN';
      }
    }
  }
}
