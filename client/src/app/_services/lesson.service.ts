import {Injectable} from '@angular/core';
import {MyJsonpService} from "./my-jsonp.service";
import {ReplaySubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LessonService {

  constructor(private jsonp: MyJsonpService) {
  }

  getAll() {
    const subj = new ReplaySubject(1);

    this.jsonp.exec('getAllLessons')
      .subscribe(subj);

    return subj.asObservable();
  }
}
