import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {LessonDto} from "../../../../../shared/transfer/LessonDto";
import {EventObject} from "fullcalendar";
import {LessonService} from "../../_services/lesson.service";
import {ClassTypeService} from "../../_services/class-type.service";
import {ClassTypeDto} from "../../../../../shared/transfer/ClassTypeDto";
import {LessonStudentDto} from "../../../../../shared/transfer/LessonStudentDto";
import {StudentDto} from "../../../../../shared/transfer/StudentDto";
import {TeacherService} from "../../_services/teacher.service";
import {StudentTeacherDto} from "../../../../../shared/transfer/StudentTeacherDto";
import {ConfirmWindowComponent} from "../../common/confirm-window/confirm-window.component";
import {WindowComponent} from "../../common/window/window.component";
import {NgbDateAdapter, NgbDateNativeAdapter} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-lesson',
  templateUrl: './lesson.component.html',
  styleUrls: ['./lesson.component.css'],
  providers: [{provide: NgbDateAdapter, useClass: NgbDateNativeAdapter}]
})
export class LessonComponent implements OnInit {

  @Input() set event(value: EventObject) {
    this.selectedEvent = value;
  }

  @Input() set lesson(value: LessonDto) {
    this.selectedLesson = value;
    this.getStudents();
  }

  @Output() onSave = new EventEmitter();
  @Output() onClone = new EventEmitter();
  @Output() onCancel = new EventEmitter();

  @ViewChild('cloneConfirmWindow') cloneConfirmWindow: ConfirmWindowComponent;
  @ViewChild('cloneDatesSelectWindow') cloneDatesSelectWindow: WindowComponent;

  selectedEvent: EventObject;
  selectedLesson: LessonDto;
  classTypes: ClassTypeDto[];
  lessonStudents: LessonStudentDto[];
  newStudent: StudentDto;
  addStudentActive = false;
  loadingEnabled = false;
  teacherStudents: StudentTeacherDto[];

  cloneDates: Date[];

  constructor(private lessonService: LessonService,
              private classTypeService: ClassTypeService,
              private teacherService: TeacherService) {
  }

  ngOnInit() {
    this.newStudent = null;

    this.getClassTypes();
    this.getStudents();
    this.getTeacherStudents();
  }

  displayStudent = (x: StudentDto) => `${x.firstName} ${x.lastName}`;
  displayClassType = (x: ClassTypeDto) => x.name;

  get availableStudents() {
    if (!this.teacherStudents)
      return null;

    return this.teacherStudents
      .filter(s => {
        if (!this.selectedLesson.classType)
          return false;

        if (s.classType.id != this.selectedLesson.classType.id)
          return false;

        if (this.lessonStudents.some(ls => ls.student.id == s.student.id))
          return false;

        return true;
      })
      .map(s => s.student);
  }

  getStudents() {
    this.lessonStudents = null;

    if (!this.selectedLesson.id) {
      this.lessonStudents = [];
      return;
    }

    this.lessonService.getStudents(this.selectedLesson.id)
      .subscribe(data => {
        this.lessonStudents = data;
      });
  }

  getClassTypes() {
    this.classTypeService.getAll()
      .subscribe(data => {
        this.classTypes = data;
      });
  }

  getTeacherStudents() {
    this.teacherService.getStudents()
      .subscribe(data => {
        this.teacherStudents = data;
      });
  }

  save() {
    this.loadingEnabled = true;

    this.lessonService.saveTeacherLesson(this.selectedLesson, this.lessonStudents)
      .subscribe(() => {
        this.onSave.next();
      });
  }

  cancel() {
    this.onCancel.next();
  }

  removeStudent(student: LessonStudentDto) {
    student.isActive = false;
  }

  restoreStudent(student: LessonStudentDto) {
    student.isActive = true;
  }

  createStudent() {
    // this.newStudent = new StudentDto();
    this.addStudentActive = true;
  }

  addStudent() {
    if (!this.newStudent)
      return;

    const lessonStudent: LessonStudentDto = {
      lesson: this.selectedLesson.id,
      student: this.newStudent,
      isActive: true,
      isVisited: true
    };

    this.lessonStudents.push(lessonStudent);
    this.newStudent = null;
    this.addStudentActive = false;

  }

  cancelAddStudent() {
    this.newStudent = null;
    this.addStudentActive = false;

  }

  cloneSelectedDates(range: Date[]) {
    this.cloneDates = range;
    this.cloneDatesSelectWindow.close('CLONE');
    this.cloneConfirmWindow.open();
  }

  cloneLessonConfirmed() {
    this.loadingEnabled = true;

    this.lessonService
      .cloneTeacherLesson(this.selectedLesson, this.lessonStudents, this.cloneDates)
      .subscribe(() => {
        this.onClone.next();
      });
  }

  cloneButtonClick() {
    this.cloneDatesSelectWindow.open();
  }

  setStartDate(date: Date) {
    if (!this.selectedLesson.startTime)
      this.selectedLesson.startTime = new Date();
    this.selectedLesson.startTime.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
  }

  setStartTime(date: Date) {
    if (!this.selectedLesson.startTime)
      this.selectedLesson.startTime = new Date();

    this.selectedLesson.startTime.setHours(date.getHours(), date.getMinutes(), date.getSeconds());
  }
}
