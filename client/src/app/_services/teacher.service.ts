import {Injectable} from '@angular/core';
import {MyJsonpService} from "./my-jsonp.service";

@Injectable({
  providedIn: 'root'
})
export class TeacherService {

  constructor(private jsonp: MyJsonpService) {
  }

  getAll(){
    return this.jsonp.exec('getAllTeachers');
  }
}
