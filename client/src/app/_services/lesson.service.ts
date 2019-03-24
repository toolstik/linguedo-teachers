import {Injectable} from '@angular/core';
import {MyJsonpService} from "./my-jsonp.service";
import {LessonDto} from "../../../../shared/transfer/LessonDto";

@Injectable({
  providedIn: 'root'
})
export class LessonService {

  private resource = 'lesson';


  constructor(private jsonp: MyJsonpService) {
  }

  getAll() {
    return this.jsonp.exec<LessonDto[]>(this.resource, 'list');
  }

  getByCurrentTeacher() {
    return this.jsonp.exec<LessonDto[]>(this.resource, 'byCurrentTeacher');
  }

  saveTeacherLesson(lesson: LessonDto) {
    return this.jsonp.exec<LessonDto>(this.resource, 'save', lesson);
  }
}
