import { Subscription } from 'rxjs';
import { Component, OnInit, ElementRef, Input, SimpleChanges } from '@angular/core';

import { interval } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { ProgressData } from '../../spc0232m/model';
import { StrUtil } from '../../../utils/StrUtil';

@Component({
  selector: 'app-progress-thread',
  templateUrl: './progress-thread.component.html',
  styleUrls: ['./progress-thread.component.scss']
})
export class ProgressThreadComponent implements OnInit {
  @Input()
  data: ProgressData;

  qtySpan: number;
  aggQty: number;  // for animation (累積數量)

  ticks: object[] = [];

  padding = 20;

  progressSubscription: Subscription;

  constructor(private elRef: ElementRef) {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.data) return;

    this.qtySpan = (this.data.baseQty - 0);
    this.aggQty = this.data.aggQty;

    const lowerBound = StrUtil.toDP3(this.data.lowerBoundQty);
    const baseQty = StrUtil.toDP3(this.data.baseQty);

    this.ticks = [
      { qty: lowerBound, label: "L" },
      { qty: baseQty, label: "R" },
    ];

    this.animate();

  }

  totalWidth() {
    return this.elRef.nativeElement.clientWidth - this.padding * 1;
  }

  /**
   * 1. transform the timestamp into a position.
   * 2. convert our position value, which is of unit pixels, 
   *    into a percentage.
   */
  projectQty(qty: number): string {
    const position = qty / this.qtySpan * this.totalWidth();

    return (position / this.elRef.nativeElement.clientWidth * 100) + "%";
  }

  // interporate accQty from 0 -> headQty
  // side effect
  animate() {
    let progress = 0;
    const progressTarget = this.data.aggQty;

    const step = 50;
    const duration = 1200;

    const count = Math.ceil(duration / step);
    const increment = Math.ceil(progressTarget / count) + 1;

    interval(step)
      .pipe(
        take(count),
        map(i => {
          progress = progress + increment;
          if (progress >= progressTarget) {
            progress = progressTarget;
          }
          return progress;
        })
      )
      .subscribe(progress => {
        this.aggQty = progress;
      });

  }
}
