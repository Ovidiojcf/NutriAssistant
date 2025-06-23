import { Component } from '@angular/core';
import { LayoutService } from './shared/services/layout.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(public layout: LayoutService) {}
}
