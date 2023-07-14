import { Component, OnInit, ChangeDetectorRef, ViewChild, AfterContentInit, AfterViewInit, ElementRef } from '@angular/core';

import Quagga from 'quagga';
import { configQuagga } from '../barcode-config/quaggaConfig';


@Component({
  selector: 'app-barcode-test',
  templateUrl: './barcode-test.component.html',
  styleUrls: ['./barcode-test.component.scss']
})
export class BarcodeTestComponent implements OnInit, AfterViewInit {
  @ViewChild('inputBarcode', { static: true }) 
  camera: ElementRef;
  
  barcode1: string;
  barcode2: string;

  isHidden: boolean = true;

  deviceList: string[] = []; 

  constructor(private ref: ChangeDetectorRef) { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
     let el: HTMLElement = this.camera.nativeElement;
     el.addEventListener("click", () => {
        Quagga.stop(); 
        this.hideCamera(true);
     });
     
     // simulate click
     this.beep();
     this.pause();
  }


  getBarcode1() {
    this.startScanner();

    this.onDecoderDetected()
      .then(code => {
        this.barcode1 = code;
        this.hideCamera(true);
        Quagga.stop(); 
      })
      .catch(err => {
        alert("mia");
        alert(err);
      });
  }

  getBarcode2() {
    this.startScanner();

    this.onDecoderDetected()
      .then(code => {
        this.barcode2 = code;
      })
      .catch(err => {
        alert(err);
      });
  }

  onProcessed(result: any) {
    const drawingCtx = Quagga.canvas.ctx.overlay;
    const drawingCanvas = Quagga.canvas.dom.overlay;

    if (result) {
      if (result.boxes) {
        drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute('width'), 10), parseInt(drawingCanvas.getAttribute('height'), 10));
        result.boxes.filter(function (box) {
          return box !== result.box;
        }).forEach(function (box) {
          Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, { color: 'green', lineWidth: 2 });
        });
      }

      if (result.box) {
        Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, { color: '#00F', lineWidth: 2 });
      }

      if (result.codeResult && result.codeResult.code) {
        Quagga.ImageDebug.drawPath(result.line, { x: 'x', y: 'y' }, drawingCtx, { color: 'red', lineWidth: 3 });
      }
    }
  }


  onDecoderDetected(): Promise<any> {
    return new Promise((resolve, reject) => {
      Quagga.onDetected(result => {
        if (!result || typeof result.codeResult === 'undefined') {
          reject('Cannot be Detected, Please Try again!');
        }

        // stop and hide
        this.hideCamera(true);
        Quagga.stop(); 

        this.beep();

        resolve(result.codeResult.code);
      });
    });
  }


  startScanner() {
    this.ref.detectChanges();

    this.hideCamera(false);

    Quagga.onProcessed(result => this.onProcessed(result));

    Quagga.init(configQuagga, (err) => {
      if (err) {
        alert(err);
        return;
      }

      Quagga.start();
    });
  }

  hideCamera(bln) {
    this.isHidden = bln;
  }

  doClear() {
    this.barcode1 = "";
    this.barcode2 = "";
  }

  beep() {
    (<HTMLAudioElement> document.getElementById("beep")).play();
  }

  pause() {
    (<HTMLAudioElement> document.getElementById("beep")).pause();
  }

  getDevices() {
    this.deviceList = [];

    navigator.mediaDevices.enumerateDevices()
    .then(function(devices) {
      devices.forEach(function(device) {
        let dev = device.kind + ": " + device.label + " id = " + device.deviceId;
        this.deviceList.push(dev);
        console.log(dev);

        //console.log(device.kind + ": " + device.label +
        //            " id = " + device.deviceId);
      });
    })
    .catch(function(err) {
      console.log(err.name + ": " + err.message);
    });

    this.deviceList.forEach(e => {
      console.log(e);

    });

  }


} // class
