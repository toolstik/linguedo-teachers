import {Injectable} from '@angular/core';
import {MyJsonpService} from "./my-jsonp.service";
import {TeacherDto} from "../_transfer/TeacherDto";

@Injectable({
  providedIn: 'root'
})
export class TeacherService {

  constructor(private jsonp: MyJsonpService) {
  }

  getAll() {
    return this.jsonp.exec<TeacherDto>('getAllTeachers');
  }
}
