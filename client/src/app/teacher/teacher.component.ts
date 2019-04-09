import {Component, OnInit} from '@angular/core';
import {TeacherService} from "../_services/teacher.service";
import {Observable} from "rxjs";
import {LessonService} from "../_services/lesson.service";
import {EventObject} from "fullcalendar";
import {TeacherDto} from "../../../../shared/transfer/TeacherDto";
import {ClassTypeService} from "../_services/class-type.service";
import {ClientService} from "../_services/client.service";
import {AuthService} from "../_services/auth.service";
import {UserDto} from "../../../../shared/transfer/UserDto";
import {StudentService} from "../_services/student.service";
import {StudentDto} from "../../../../shared/transfer/StudentDto";
import {LessonDto} from "../../../../shared/transfer/LessonDto";
import {Moment} from "moment";
import {SubstitutionService} from "../_services/substitution.service";
import {SubstitutionDto} from "../../../../shared/transfer/SubstitutionDto";

@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.css']
})
export class TeacherComponent implements OnInit {

  requestedSubstitutions: SubstitutionDto[];

  lessons: LessonDto[];
  events: EventObject[];

  selectedLesson: LessonDto;
  selectedEvent: EventObject;

  constructor(private teacherService: TeacherService,
              private lessonService: LessonService,
              private substitutionService: SubstitutionService) {
  }

  ngOnInit() {
    this.getLessons();
    this.getRequestedSubstitutions();
  }

  private getLessons() {
    this.lessonService.getByCurrentTeacher().subscribe(data => {
      this.lessons = data.map(l => {
        l.startTime = new Date(l.startTime);
        l.endTime = new Date(l.endTime);
        return l;
      });

      this.events = this.lessons.map((l, i) => {
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

  private getRequestedSubstitutions() {
    this.substitutionService.getSelfRequested()
      .subscribe(data => {
        this.requestedSubstitutions = data;
      });
  }

  private clone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
  }

  eventSelected(event: EventObject) {
    this.selectedEvent = event;
    this.selectedLesson = {...this.lessons[event.id]};
  }

  saveClass() {
    this.lessons = null;
    this.events = null;

    this.selectedLesson = null;
    this.selectedEvent = null;

    this.getLessons();
  }

  cancelSaveClass() {
    this.selectedLesson = null;
    this.selectedEvent = null;
  }

  calendarSelect(event: { start: Moment, end: Moment }) {
    this.selectedEvent = {title: 'New Lesson'} as EventObject;
    this.selectedLesson = {} as LessonDto;
    this.selectedLesson.startTime = event.start.toDate();
    this.selectedLesson.endTime = event.end.toDate();
  }

  cloneClass() {
    this.lessons = null;
    this.events = null;

    this.selectedLesson = null;
    this.selectedEvent = null;

    this.getLessons();
  }
}
