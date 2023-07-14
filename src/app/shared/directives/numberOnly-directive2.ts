import { Directive, ElementRef, HostListener } from '@angular/core';

import { BACKSPACE, TAB, END, HOME, DELETE, LEFT_ARROW, RIGHT_ARROW } from '@angular/cdk/keycodes';
import  Decimal from 'decimal.js';

@Directive({ selector: '[numberOnly2]' })
export class NumberOnly2 {
  private regex: RegExp = new RegExp(/^[0-9]+(\.[0-9]*){0,1}$/g);

  // alllow keys
  // private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', "Delete", "ArrowLeft", "ArrowRight"];
  private specialKeys: Array<number> = [BACKSPACE, TAB, END, HOME, DELETE, LEFT_ARROW, RIGHT_ARROW];

  constructor(private el: ElementRef) {
  }

  @HostListener('keyup', ['$event'])
  onKeydown(event) {
    //this.el.nativeElement.value = 
    //(<HTMLInputElement>event.currentTarget).value.replace(/[^0-9]/g, '');
    //console.log(this.el.nativeElement.value);
    let e = <KeyboardEvent>event;

    if ([46, 8, 9, 27, 13, 110, 190].indexOf(e.keyCode) !== -1 ||
      // Allow: Ctrl+A
      (e.keyCode == 65 && e.ctrlKey === true) ||
      // Allow: Ctrl+C
      (e.keyCode == 67 && e.ctrlKey === true) ||
      // Allow: Ctrl+X
      (e.keyCode == 88 && e.ctrlKey === true) ||
      // Allow: home, end, left, right
      (e.keyCode >= 35 && e.keyCode <= 39)) {
      // let it happen, don't do anything
      return;
    }

    // Ensure that it is a number and stop the keypress
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
      e.preventDefault();
      return;
    }

    let value = (<HTMLInputElement>event.currentTarget).value;
    console.log("value: " + value);

    try {
      let dec = new Decimal(value);
    } catch (error) {
      console.log("not a number");
      e.preventDefault();
    }
    

  }

} // end class