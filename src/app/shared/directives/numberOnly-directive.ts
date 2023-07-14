import { Directive, ElementRef, HostListener } from '@angular/core';

import {BACKSPACE, TAB, END, HOME, DELETE, LEFT_ARROW, RIGHT_ARROW } from '@angular/cdk/keycodes';
//import {BACKSPACE, TAB, END, HOME, DELETE} from '@angular/cdk/keycodes';

// ATTN: keyocde is deprecated, what ???
@Directive({ selector: '[numberOnly]' })
export class NumberOnly {
  private regex: RegExp = new RegExp(/^[0-9]+(\.[0-9]*){0,1}$/g);

  // alllow keys
  // private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', "Delete", "ArrowLeft", "ArrowRight"];
  private specialKeys: Array<number> = [BACKSPACE, TAB, END, HOME, DELETE, LEFT_ARROW, RIGHT_ARROW];

  constructor(private el: ElementRef) {
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    //if (this.specialKeys.indexOf(event.key) !== -1) {
    //  return;
    //}

    if (this.specialKeys.includes(event.keyCode)) {
      console.log("return");
      return;
    }

    let current: string = this.el.nativeElement.value;
    console.log("current:" + current)

    // 有問題?
    let next: string = current.concat(event.key);
    console.log("next:" + next)

    if (next && ! String(next).match(this.regex)) {
      event.preventDefault();
    }


  }

} // end class