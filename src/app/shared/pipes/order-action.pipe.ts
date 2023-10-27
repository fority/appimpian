import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderActionPipe',
})
export class OrderActionPipe implements PipeTransform {
  transform(data: number | null) {
    switch (data) {
      case 0: {
        return 'SENT';
      }
      case 10: {
        return 'PROCESS';
      }
      case 20: {
        return 'PROCCESS';
      }
      case 30: {
        return 'WIP';
      }
      case 40: {
        return 'SHIPPED';
      }
      case 50: {
        return 'INVOICED';
      }
      case 60: {
        return 'PAID';
      }
      case 70: {
        return 'VERIFIED';
      }
      case 80: {
        return 'CANCELED';
      }

      default: {
        return '';
      }
    }
  }
}
