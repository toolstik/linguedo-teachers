import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {LessonDto} from "../../../../../shared/transfer/LessonDto";
import {EventObject} from "fullcalendar";
import {LessonService} from "../../_services/lesson.service";
import {ClassTypeService} from "../../_services/class-type.service";
import {ClassTypeDto} from "../../../../../shared/transfer/ClassTypeDto";
import {LessonStudentDto} from "../../../../../shared/transfer/LessonStudentDto";
import {StudentDto} from "../../../../../shared/transfer/StudentDto";
import {TeacherService} from "../../_services/teacher.service";
import {StudentTeacherDto} from "../../../../../shared/transfer/StudentTeacherDto";

@Component({
  selector: 'app-lesson',
  templateUrl: './lesson.component.html',
  styleUrls: ['./lesson.component.css']
})
export class LessonComponent implements OnInit {

  @Input('event') selectedEvent: EventObject;
  @Input('lesson') selectedLesson: LessonDto;

  @Output() onSave = new EventEmitter();
  @Output() onCancel = new EventEmitter();

  classTypes: ClassTypeDto[];
  lessonStudents: LessonStudentDto[];
  newStudent: StudentDto;
  addStudentActive = false;
  teacherStudents: StudentTeacherDto[];

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
      .filter(s => s.classType.id == this.selectedLesson.classType.id)
      .map(s => s.student);
  }

  getStudents() {
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
    this.lessonService.saveTeacherLesson(this.selectedLesson)
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
}
