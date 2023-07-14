import { Component, OnInit, OnDestroy } from '@angular/core';
import { BrowserBarcodeReader } from '@zxing/library';

@Component({
  selector: 'app-zxing-test',
  templateUrl: './zxing-test.component.html',
  styleUrls: ['./zxing-test.component.scss']
})
export class ZxingTestComponent implements OnInit, OnDestroy {
  codeReader: BrowserBarcodeReader;
  barcode: string;

  hidden = false;

  constructor() { }

  ngOnInit() {
    this.codeReader = new BrowserBarcodeReader()
  } 

  ngOnDestroy(): void {
    this.codeReader.reset();
    //this.codeReader.unbindVideoSrc(document.getElementById("videox") as HTMLVideoElement);

  }

  start() {
    this.hidden = false;

    this.codeReader.decodeFromInputVideoDevice(undefined, 'video')
      .then(result => {
        this.barcode = result.getText();
        this.codeReader.reset();
        alert(this.barcode);
      })
      .catch(err => {
        alert(err);
      })
  }

  reset() {
    this.codeReader.reset();
    this.barcode = "";
    this.hidden = true;
  }

  toggleHidden() {
    this.hidden = ! this.hidden;
  }



} // end class
