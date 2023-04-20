import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ServerSentEventsService {
  public progress$: Observable<number>;

  constructor(private http: HttpClient) {
    this.progress$ = new Observable<number>((observer) => {
      const eventSource = new EventSource('/api/events');
      eventSource.addEventListener('message', (event) => {
        observer.next(Number(event.data));
        if (event.data === '100') {
          eventSource.close();
          observer.complete();
        }
      });
      eventSource.addEventListener('error', (error) => {
        eventSource.close();
        observer.error(error);
      });
    }).pipe(
      catchError((error) => {
        console.error('Error: ', error);
        return of(0);
      })
    );
  }
}
