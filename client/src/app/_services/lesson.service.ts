import {Injectable} from '@angular/core';
import {MyJsonpService} from "./my-jsonp.service";
import {ReplaySubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LessonService {

  private resource = 'calendar';


  constructor(private jsonp: MyJsonpService) {
  }

  getAll() {
    const subj = new ReplaySubject(1);

    this.jsonp.exec(this.resource, 'list')
      .subscribe(subj);

    return subj.asObservable();
  }
}
