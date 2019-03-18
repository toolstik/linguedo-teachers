import {Injectable} from '@angular/core';
import {MyJsonpService} from "./my-jsonp.service";
import {ClassTypeDto} from "../_transfer/ClassTypeDto";
import {ReplaySubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ClassTypeService {

  constructor(private jsonp: MyJsonpService) {
  }

  getAll() {
    const subj = new ReplaySubject<ClassTypeDto[]>(1);

    this.jsonp.exec('getAllClassTypes')
      .subscribe(subj);

    return subj.asObservable();
  }
}
