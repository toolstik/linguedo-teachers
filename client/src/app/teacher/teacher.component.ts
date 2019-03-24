import {Component, OnInit} from '@angular/core';
import {TeacherService} from "../_services/teacher.service";
import {Observable} from "rxjs";
import {LessonService} from "../_services/lesson.service";
import {EventObject} from "fullcalendar";
import {TeacherDto} from "../../../../shared/transfer/TeacherDto";
import {ClassTypeService} from "../_services/class-type.service";
import {ClassTypeDto} from "../../../../shared/transfer/ClassTypeDto";
import {ClientService} from "../_services/client.service";
import {ClientDto} from "../../../../shared/transfer/ClientDto";
import {AuthService} from "../_services/auth.service";
import {UserDto} from "../../../../shared/transfer/UserDto";
import {StudentService} from "../_services/student.service";
import {StudentDto} from "../../../../shared/transfer/StudentDto";
import {LessonDto} from "../../../../shared/transfer/LessonDto";

@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.css']
})
export class TeacherComponent implements OnInit {

  teachers$: Observable<TeacherDto[]>;
  students$: Observable<StudentDto[]>;
  classTypes$: Observable<ClassTypeDto[]>;
  // clients$: Observable<ClientDto[]>;

  lessons: LessonDto[];
  events: EventObject[];

  currentUser$: Observable<UserDto>;

  editableLesson: LessonDto;

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
    // this.clients$ = this.clientService.getAll();
    this.currentUser$ = this.authService.currentUser();

    this.getLessons();
  }

  private getLessons() {
    this.lessonService.getByCurrentTeacher().subscribe(data => {
      this.lessons = data;

      this.events = data.map((l, i) => {
        return {
          id: i,
          title: `${l.teacher.firstName} ${l.teacher.lastName} ${l.classType.id}`,
          description: '',
          start: l.startTime,
          end: l.endTime,

        }
      })
    });
  }

  private clone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
  }

  eventSelected(event: EventObject) {
    this.editableLesson = this.clone(this.lessons[event.id]);
  }

  saveClass() {
    this.lessonService.saveTeacherLesson(this.editableLesson)
      .subscribe(() => {
        this.getLessons();
      });
    this.lessons = null;
    this.events = null;

    this.editableLesson = null;
  }

  cancelSaveClass() {
    this.editableLesson = null;
  }

  calendarSelect(event: { start: Date, end: Date }) {
    // this.editableLesson = {} as EventObject;
    // this.editableLesson.start = event.start;
  }
}
