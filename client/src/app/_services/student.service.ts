import {Injectable} from '@angular/core';
import {MyJsonpService} from "./my-jsonp.service";
import {ReplaySubject} from "rxjs";
import {StudentDto} from "../../../../shared/transfer/StudentDto";

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  private resource = 'student';

  constructor(private jsonp: MyJsonpService) {
  }

  getAll() {
    const subj = new ReplaySubject<StudentDto[]>(1);

    this.jsonp.exec(this.resource, 'list')
      .subscribe(subj);

    return subj.asObservable();
  }
}
