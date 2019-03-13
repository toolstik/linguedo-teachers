import {Component, OnInit} from '@angular/core';
import {TeacherService} from "../_services/teacher.service";
import {Observable} from "rxjs";
import {LessonService} from "../_services/lesson.service";
import {EventObject} from "fullcalendar";

@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.css']
})
export class TeacherComponent implements OnInit {

  teachers$: Observable<any>;
  lessons$: Observable<any>;

  selectedLesson: EventObject;

  constructor(private teacherService: TeacherService,
              private lessonService: LessonService) {
  }

  ngOnInit() {
    this.teachers$ = this.teacherService.getAll();
    this.lessons$ = this.lessonService.getAll();
  }

  eventSelected(event: EventObject) {
    this.selectedLesson = event;
  }

  saveClass() {
    this.selectedLesson = null;
  }

  cancelSaveClass() {
    this.selectedLesson = null;
  }
}
