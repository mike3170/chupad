import { Component } from '@angular/core';
import { AppSvc } from './shared/svc/app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';
  constructor() {
  }
}
