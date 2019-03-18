import {Injectable} from '@angular/core';
import {MyJsonpService} from "./my-jsonp.service";
import {ClassTypeDto} from "../_transfer/ClassTypeDto";

@Injectable({
  providedIn: 'root'
})
export class ClassTypeService {

  constructor(private jsonp: MyJsonpService) {
  }

  getAll() {
    return this.jsonp.exec<ClassTypeDto>('getAllClassTypes');
  }
}
