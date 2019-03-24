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
import {StudentService} from "../_services/student.service";
import {StudentDto} from "../_transfer/StudentDto";

@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.css']
})
export class TeacherComponent implements OnInit {

  teachers$: Observable<TeacherDto[]>;
  students$: Observable<StudentDto[]>;
  classTypes$: Observable<ClassTypeDto[]>;
  clients$: Observable<ClientDto[]>;
  lessons$: Observable<any>;

  currentUser$: Observable<UserDto>;

  editableLesson: EventObject;

  constructor(private teacherService: TeacherService,
              private studentService: StudentService,
              private authService: AuthService,
              private classTypeService: ClassTypeService,
              private clientService: ClientService,
              private lessonService: LessonService) {
  }

  ngOnInit() {
    this.teachers$ = this.teacherService.getAll();
    this.students$ = this.studentService.getAll();
    this.classTypes$ = this.classTypeService.getAll();
    this.clients$ = this.clientService.getAll();
    this.lessons$ = this.lessonService.getAll();
    this.currentUser$ = this.authService.currentUser();
  }

  eventSelected(event: EventObject) {
    this.editableLesson = event;
  }

  saveClass() {
    this.editableLesson = null;
  }

  cancelSaveClass() {
    this.editableLesson = null;
  }

  calendarSelect(event: { start: Date, end: Date }) {
    this.editableLesson = {} as EventObject;
    this.editableLesson.start = event.start;
  }
}
