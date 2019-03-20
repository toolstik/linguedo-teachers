import {Injectable} from '@angular/core';
import {MyJsonpService} from "./my-jsonp.service";
import {ClassTypeDto} from "../_transfer/ClassTypeDto";
import {ReplaySubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ClassTypeService {

  private resource = 'classType';

  constructor(private jsonp: MyJsonpService) {
  }

  getAll() {
    const subj = new ReplaySubject<ClassTypeDto[]>(1);

    this.jsonp.exec(this.resource, 'list')
      .subscribe(subj);

    return subj.asObservable();
  }
}
