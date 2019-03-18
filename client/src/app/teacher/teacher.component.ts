import {Component, OnInit} from '@angular/core';
import {TeacherService} from "../_services/teacher.service";
import {Observable} from "rxjs";
import {LessonService} from "../_services/lesson.service";
import {EventObject} from "fullcalendar";
import {TeacherDto} from "../_transfer/TeacherDto";
import {ClassTypeService} from "../_services/class-type.service";
import {ClassTypeDto} from "../_transfer/ClassTypeDto";
import {ClientService} from "../_services/client.service";
import {ClientDto} from "../_transfer/ClientDto";

@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.css']
})
export class TeacherComponent implements OnInit {

  teachers$: Observable<TeacherDto>;
  classTypes$: Observable<ClassTypeDto>;
  clients$: Observable<ClientDto>;
  lessons$: Observable<any>;

  selectedLesson: EventObject;

  constructor(private teacherService: TeacherService,
              private classTypeService: ClassTypeService,
              private clientService: ClientService,
              private lessonService: LessonService) {
  }

  ngOnInit() {
    localStorage.setItem('teacher_test', 'test value');
    this.teachers$ = this.teacherService.getAll();
    this.classTypes$ = this.classTypeService.getAll();
    this.clients$ = this.clientService.getAll();
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
