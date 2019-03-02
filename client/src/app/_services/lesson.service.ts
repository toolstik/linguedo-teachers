import { Injectable } from '@angular/core';
import {MyJsonpService} from "./my-jsonp.service";

@Injectable({
  providedIn: 'root'
})
export class LessonService {

  constructor(private jsonp: MyJsonpService) {
  }

  getAll(){
    return this.jsonp.exec('getAllLessons');
  }
}
