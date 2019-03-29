import { Injectable } from '@angular/core';
import {Observable, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  private subject = new Subject<any>();

  success(message: string) {
    this.subject.next({type: 'success', text: message});
  }

  error(message: string) {
    this.subject.next({type: 'danger', text: message});
  }

  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }
}
