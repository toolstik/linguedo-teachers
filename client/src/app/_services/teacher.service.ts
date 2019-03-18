import {Injectable} from '@angular/core';
import {MyJsonpService} from "./my-jsonp.service";
import {TeacherDto} from "../_transfer/TeacherDto";
import {ReplaySubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TeacherService {

  constructor(private jsonp: MyJsonpService) {
  }

  getAll() {
    const subj = new ReplaySubject<TeacherDto[]>(1);

    this.jsonp.exec('getAllTeachers')
      .subscribe(subj);

    return subj.asObservable();
  }
}
