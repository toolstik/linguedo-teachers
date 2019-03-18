import {Injectable} from '@angular/core';
import {MyJsonpService} from "./my-jsonp.service";
import {ReplaySubject} from "rxjs";
import {StudentDto} from "../_transfer/StudentDto";

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor(private jsonp: MyJsonpService) {
  }

  getAll() {
    const subj = new ReplaySubject<StudentDto[]>(1);

    this.jsonp.exec('getAllStudents')
      .subscribe(subj);

    return subj.asObservable();
  }
}
