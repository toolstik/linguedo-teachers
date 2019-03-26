import {Injectable} from '@angular/core';
import {MyJsonpService} from "./my-jsonp.service";
import {LessonDto} from "../../../../shared/transfer/LessonDto";
import {LessonStudentDto} from "../../../../shared/transfer/LessonStudentDto";

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

  saveTeacherLesson(lesson: LessonDto, lessonStudents: LessonStudentDto[]) {
    return this.jsonp.exec(this.resource, 'save', {
      lesson: lesson,
      students: lessonStudents
    });
  }

  getStudents(lessonId: string) {
    return this.jsonp.exec<LessonStudentDto[]>(this.resource, 'getStudents', lessonId);
  }
}
