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
import {AuthService} from "../_services/auth.service";
import {UserDto} from "../_transfer/UserDto";

@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.css']
})
export class TeacherComponent implements OnInit {

  teachers$: Observable<TeacherDto[]>;
  classTypes$: Observable<ClassTypeDto[]>;
  clients$: Observable<ClientDto[]>;
  lessons$: Observable<any>;

  currentUser$: Observable<UserDto>;

  selectedLesson: EventObject;

  constructor(private teacherService: TeacherService,
              private authService: AuthService,
              private classTypeService: ClassTypeService,
              private clientService: ClientService,
              private lessonService: LessonService) {
  }

  ngOnInit() {
    this.teachers$ = this.teacherService.getAll();
    this.classTypes$ = this.classTypeService.getAll();
    this.clients$ = this.clientService.getAll();
    this.lessons$ = this.lessonService.getAll();
    this.currentUser$ = this.authService.currentUser();
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
