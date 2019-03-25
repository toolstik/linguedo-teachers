import {Injectable} from '@angular/core';
import {MyJsonpService} from "./my-jsonp.service";
import {ClassTypeDto} from '../../../../shared/transfer/ClassTypeDto';
import {BehaviorSubject, ReplaySubject} from "rxjs";
import {map, mergeMap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ClassTypeService {

  private resource = 'classType';

  private all$: BehaviorSubject<ClassTypeDto[]>;

  constructor(private jsonp: MyJsonpService) {
  }

  getAll() {
    if (this.all$)
      return this.all$.asObservable();

    return this.jsonp.exec<ClassTypeDto[]>(this.resource, 'list')
      .pipe(mergeMap(data => {
        this.all$ = new BehaviorSubject<ClassTypeDto[]>(data);

        return this.all$.asObservable();
      }));
  }
}
