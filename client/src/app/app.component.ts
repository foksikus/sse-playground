import { Component } from '@angular/core';
import { ServerSentEventsService } from './services/server-sent-events.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'server-sent-client';
  public data: number = 0;
  constructor(private events: ServerSentEventsService) {}
  public sendRequest() {
    this.events.progress$.subscribe((data) => {
      this.data = data;
    });
  }
}
