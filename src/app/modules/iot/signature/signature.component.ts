import {
  AngularSignaturePadModule,
  NgSignaturePadOptions,
  SignaturePadComponent,
} from '@almothafar/angular-signature-pad';
import { BreakpointObserver } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-signature',
  standalone: true,
  imports: [CommonModule, AngularSignaturePadModule, ButtonModule],
  templateUrl: './signature.component.html',
  styleUrls: ['./signature.component.less'],
})
export class SignatureComponent {
  @ViewChild('signature')
  public signaturePad = {} as SignaturePadComponent;

  signaturePadOptions: NgSignaturePadOptions = {
    // minWidth: 5,
    minWidth: 0.1,
    maxWidth: 1.5,
    dotSize: 0.5,
    canvasWidth: 250,
    canvasHeight: 200,
    backgroundColor: 'rgba(0,0,0,0)',
  };

  constructor(public breakpointObserver: BreakpointObserver) {}

  ngAfterViewInit() {
    this.setOptions();
  }

  setOptions() {
    this.signaturePad.set('minWidth', 5);
    this.signaturePad.set('penColor', '#000');
    this.signaturePad.clear();
  }

  drawComplete(event: MouseEvent | Touch) {
    console.log('Completed drawing', event);
  }

  drawStart(event: MouseEvent | Touch) {
    console.log('Start drawing', event);
  }

  GetDrawDataUrl() {
    if (this.signaturePad.isEmpty()) {
      return undefined;
    }
    return this.signaturePad.toDataURL('image/png');
  }

  clear() {
    this.signaturePad.clear();
  }
}
