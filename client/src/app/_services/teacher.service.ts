import {Injectable} from '@angular/core';
import {MyJsonpService} from "./my-jsonp.service";
import {TeacherDto} from "../../../../shared/transfer/TeacherDto";
import {ReplaySubject} from "rxjs";
import {StudentTeacherDto} from "../../../../shared/transfer/StudentTeacherDto";

@Injectable({
  providedIn: 'root'
})
export class TeacherService {

  private resource = 'teacher';

  constructor(private jsonp: MyJsonpService) {
  }

  getAll() {
    const subj = new ReplaySubject<TeacherDto[]>(1);

    this.jsonp.exec(this.resource, 'list')
      .subscribe(subj);

    return subj.asObservable();
  }

  getStudents() {
    return this.jsonp.exec<StudentTeacherDto[]>(this.resource, 'students');
  }
}
